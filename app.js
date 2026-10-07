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
});