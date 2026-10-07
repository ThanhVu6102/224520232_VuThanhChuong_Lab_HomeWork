// ==========================================
// HW2: Keyboard Listener & Throttling
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    
    document.addEventListener('keydown', (event) => {
        // Chặn lỗi giữ phím liên tục (key repeat)
        if (event.repeat) return;

        const key = event.key.toLowerCase();
        // Tìm pad tương ứng với phím vừa bấm dựa vào data-key (Hợp đồng HTML)
        const pad = document.querySelector(`.pad[data-key="${key}"]`);
        
        if (pad) {
            const soundName = pad.dataset.sound; // Lấy data-sound
            AudioEngine.playSound(soundName);    // Gọi Engine độc lập
            
            // Hiệu ứng visual (tùy chọn)
            pad.classList.add('active');
            setTimeout(() => pad.classList.remove('active'), 100);
        }
    });

    // --- BẮT ĐẦU LOGIC RECORDER ---
    const recordBtn = document.getElementById('record-btn');
    const playBtn = document.getElementById('play-btn');
    
    let isRecording = false;
    let recordedBeats = []; // Hàng đợi FIFO chứa {key, time}
    let recordStartTime = 0;

    recordBtn.addEventListener('click', () => {
        isRecording = !isRecording;
        if (isRecording) {
            recordedBeats = []; // Xóa bộ nhớ cũ
            recordStartTime = Date.now();
            recordBtn.textContent = 'Stop';
            recordBtn.style.backgroundColor = 'red';
        } else {
            recordBtn.textContent = 'Record';
            recordBtn.style.backgroundColor = '';
        }
    });

    // Ghi lại sự kiện trong listener keydown (thêm vào trong block if(pad))
    // ... (Bên trong document.addEventListener('keydown', ...)) ...
    if (isRecording) {
        recordedBeats.push({
            key: key,
            sound: soundName,
            time: Date.now() - recordStartTime
        });
    }

    // Phát lại (Playback)
    playBtn.addEventListener('click', () => {
        if (recordedBeats.length === 0) return;
        
        recordedBeats.forEach(beat => {
            setTimeout(() => {
                AudioEngine.playSound(beat.sound);
                // Hiệu ứng visual
                const pad = document.querySelector(`.pad[data-key="${beat.key}"]`);
                if (pad) {
                    pad.classList.add('active');
                    setTimeout(() => pad.classList.remove('active'), 100);
                }
            }, beat.time);
        });
    });
});