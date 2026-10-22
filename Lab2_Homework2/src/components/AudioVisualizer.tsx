import React, { useEffect, useRef, useState } from 'react';
import { AudioTaskQueue } from '../engine/AudioTaskQueue';

const FFT_SIZE = 256;
const DEFAULT_URL =
  'https://cdn.jsdelivr.net/gh/rafaelreis-hotmart/Audio-sample-files@master/sample.mp3';

const AudioVisualizer: React.FC = () => {
  const [status, setStatus] = useState<string>('IDLE - chưa có yêu cầu nào');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const urlInputRef = useRef<HTMLInputElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const queueRef = useRef<AudioTaskQueue | null>(null);
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);
  const rafIdRef = useRef<number>(0);
  const dataArrayRef = useRef<Uint8Array<ArrayBuffer>>(
    new Uint8Array(FFT_SIZE / 2)
  );

  // AudioContext, AnalyserNode and FIFO queue are created exactly once
  if (audioContextRef.current === null) {
    audioContextRef.current = new (window.AudioContext ||
      (window as any).webkitAudioContext)();
    const analyser = audioContextRef.current.createAnalyser();
    analyser.fftSize = FFT_SIZE;
    analyser.smoothingTimeConstant = 0.8;
    analyserRef.current = analyser;
    queueRef.current = new AudioTaskQueue(audioContextRef.current);
  }

  const drawFrame = () => {
    const canvas = canvasRef.current;
    const analyser = analyserRef.current;
    if (!canvas || !analyser) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dataArray = dataArrayRef.current;
    analyser.getByteFrequencyData(dataArray);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const barCount = dataArray.length;
    const barWidth = canvas.width / barCount;
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#00e5ff');
    gradient.addColorStop(0.5, '#7c4dff');
    gradient.addColorStop(1, '#ff4081');

    for (let i = 0; i < barCount; i++) {
      const value = dataArray[i] / 255;
      const barHeight = value * canvas.height;
      const x = i * barWidth;
      const y = canvas.height - barHeight;

      ctx.fillStyle = gradient;
      ctx.fillRect(x, y, barWidth - 2, barHeight);

      // subtle glow cap on top of each bar
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.fillRect(x, y, barWidth - 2, 2);
    }

    rafIdRef.current = requestAnimationFrame(drawFrame);
  };

  const stopAndDisconnectSource = () => {
    if (sourceRef.current) {
      const source = sourceRef.current;
      sourceRef.current = null;
      try {
        source.stop();
      } catch {
        // source may already be stopped
      }
      source.disconnect();
    }
  };

  const handleQueueAndPlay = async () => {
    const audioContext = audioContextRef.current;
    const analyser = analyserRef.current;
    const queue = queueRef.current;
    const trackUrl = urlInputRef.current?.value.trim() ?? '';
    if (!audioContext || !analyser || !queue || !trackUrl) return;

    if (audioContext.state === 'suspended') {
      await audioContext.resume();
    }

    try {
      setStatus('DOWNLOADING (FIFO) - đang tải và giải mã, bấm Cancel để bị hủy...');
      const buffer = await queue.enqueue(trackUrl);
      stopAndDisconnectSource();

      const source = audioContext.createBufferSource();
      source.buffer = buffer;
      source.onended = () => {
        source.disconnect();
        if (sourceRef.current === source) {
          sourceRef.current = null;
        }
      };

      source.connect(analyser);
      analyser.connect(audioContext.destination);
      sourceRef.current = source;
      source.start();
      setStatus('PLAYING - request hoàn tất (200 OK)');
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        setStatus('CANCELED - request bị hủy ( thấy (canceled) trong Network )');
        console.warn('Fetch cancelled - task skipped gracefully.');
      } else {
        setStatus(`ERROR - ${(error as Error).message}`);
        console.error('Queue/play failed:', error);
      }
    }
  };

  const handleCancelCurrent = () => {
    queueRef.current?.cancelCurrent();
    setStatus('CANCELED (đang gửi abort tới fetch đang chạy...)');
  };

  useEffect(() => {
    // start the 60fps render loop; never touches React state
    rafIdRef.current = requestAnimationFrame(drawFrame);

    return () => {
      // full cleanup: cancel RAF, stop + disconnect source, close context
      cancelAnimationFrame(rafIdRef.current);
      stopAndDisconnectSource();
      if (analyserRef.current) {
        analyserRef.current.disconnect();
        analyserRef.current = null;
      }
      audioContextRef.current?.close().catch(() => undefined);
      audioContextRef.current = null;
    };
  }, []);

  return (
    <div className="visualizer-panel">
      <h1 className="title">FIFO Audio Visualizer Queue Engine</h1>
      <p className="subtitle">
        One download at a time &middot; strictly first-in, first-out
      </p>

      <div className="controls">
        <input
          ref={urlInputRef}
          type="text"
          className="url-input"
          aria-label="MP3 URL"
          defaultValue={DEFAULT_URL}
          placeholder="Enter an MP3 URL"
        />
        <button className="btn btn-primary" onClick={handleQueueAndPlay}>
          Queue & Play
        </button>
        <button className="btn btn-danger" onClick={handleCancelCurrent}>
          Cancel Current
        </button>
      </div>

      <p className="status">{status}</p>
      <p className="hint">
        Bằng chứng demonstrates (DevTools): F12 → tab Network → bật
        Record + Disable cache → chọn Speed Slow 3G → bấm
        &ldquo;Queue &amp; Play&rdquo; (lúc này request có trạng thái
        chung làPending) → bấm &ldquo;Cancel Current&rdquo; trong lúc tải →
        request chuyển thành Color đỏ và có Status là (canceled).
      </p>

      <canvas
        ref={canvasRef}
        className="visualizer-canvas"
        width={640}
        height={280}
      />
    </div>
  );
};

export default AudioVisualizer;
