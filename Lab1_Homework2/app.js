// ==========================================
// HW2: Keyboard Listener, Throttling & FIFO Beat Recorder
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    
    // --- KHAI BÁO BIẾN CHO RECORDER (đặt lên đầu để tránh lỗi scope) ---
    const recordBtn = document.getElementById('record-btn');
    const playBtn = document.getElementById('play-btn');
    
    let isRecording = false;
    let recordedBeats = []; // Hàng đợi FIFO chứa {key, sound, time}
    let recordStartTime = 0;

    // --- BƯỚC 3: KEYDOWN LISTENER WITH EVENT.REPEAT THROTTLING ---
    document.addEventListener('keydown', (event) => {
        // Chặn lỗi giữ phím liên tục (key repeat throttling)
        if (event.repeat) return;

        const key = event.key.toLowerCase();
        // Tìm pad tương ứng với phím vừa bấm dựa vào data-key (Hợp đồng HTML)
        const pad = document.querySelector(`.pad[data-key="${key}"]`);
        
        if (pad) {
            const soundName = pad.dataset.sound; // Lấy data-sound từ HTML
            AudioEngine.playSound(soundName);    // Gọi Engine độc lập
            
            // Hiệu ứng visual
            pad.classList.add('active');
            setTimeout(() => pad.classList.remove('active'), 100);

            // --- BƯỚC 4: GHI LẠI SỰ KIỆN (đặt ĐÚNG BÊN TRONG listener) ---
            if (isRecording) {
                recordedBeats.push({
                    key: key,
                    sound: soundName,
                    time: Date.now() - recordStartTime
                });
            }
        }
    });

    // --- BƯỚC 4: FIFO BEAT RECORDER (Xử lý nút Record/Play) ---
    
    // Xử lý nút Record
    recordBtn.addEventListener('click', () => {
        isRecording = !isRecording;
        
        if (isRecording) {
            recordedBeats = []; // Xóa bộ nhớ cũ
            recordStartTime = Date.now();
            recordBtn.textContent = 'Stop';
            recordBtn.classList.add('recording'); // Dùng class thay vì inline style
        } else {
            recordBtn.textContent = 'Record';
            recordBtn.classList.remove('recording');
        }
    });

    // Xử lý nút Play (Phát lại)
    playBtn.addEventListener('click', () => {
        if (recordedBeats.length === 0) return;
        
        // Duyệt qua hàng đợi FIFO và phát lại đúng thời điểm đã ghi
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