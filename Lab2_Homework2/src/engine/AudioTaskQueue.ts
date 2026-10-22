export interface AudioTask {
  trackUrl: string;
  controller: AbortController;
  resolve: (buffer: AudioBuffer) => void;
  reject: (error: any) => void;
}

export class AudioTaskQueue {
  private queue: AudioTask[] = [];
  private isProcessing = false;
  private activeController: AbortController | null = null;
  private audioContext: AudioContext;

  constructor(audioContext: AudioContext) {
    this.audioContext = audioContext;
  }

  async enqueue(trackUrl: string): Promise<AudioBuffer> {
    const controller = new AbortController();
    return new Promise((resolve, reject) => {
      this.queue.push({ trackUrl, controller, resolve, reject });
      this.processNext();
    });
  }

  cancelCurrent() {
    const controller = this.activeController;
    if (controller) {
      controller.abort();
    }
  }

  private async processNext() {
    if (this.isProcessing || this.queue.length === 0) {
      return;
    }

    this.isProcessing = true;
    const task = this.queue.shift()!;
    this.activeController = task.controller;

    try {
      const response = await fetch(task.trackUrl, {
        signal: task.controller.signal,
      });
      if (!response.ok) {
        throw new Error(
          `Failed to fetch audio: ${response.status} ${response.statusText}`
        );
      }
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
      task.resolve(audioBuffer);
    } catch (error) {
      if (
        error instanceof DOMException &&
        error.name === 'AbortError'
      ) {
        task.reject(new DOMException('Fetch aborted', 'AbortError'));
      } else {
        task.reject(error);
      }
    } finally {
      this.activeController = null;
      this.isProcessing = false;
      this.processNext();
    }
  }
}
