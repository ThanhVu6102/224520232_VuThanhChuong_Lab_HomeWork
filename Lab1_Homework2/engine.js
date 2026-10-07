// ==========================================
// HW2: Polyphonic Audio Playback Engine
// ==========================================
const AudioEngine = (() => {
    // Hàm phát âm thanh độc lập
    function playSound(soundName) {
        // Giả sử file âm thanh nằm trong thư mục 'sounds/'
        const audio = new Audio(`sounds/${soundName}.wav`);
        audio.currentTime = 0; // Reset để có thể bấm liên tục
        audio.play().catch(err => console.error("Audio play failed:", err));
    }

    return {
        playSound
    };
})();