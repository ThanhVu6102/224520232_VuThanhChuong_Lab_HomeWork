// ==========================================
// HW3 - SLICE 1: Drift-Free Countdown Engine
// Sử dụng UTC ISO 8601 để tránh lỗi múi giờ
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    // Mốc thời gian mục tiêu (Ví dụ: 31/12/2026 23:59:59 UTC)
    const targetDate = new Date('2026-12-31T23:59:59Z').getTime();
    const countdownDisplay = document.getElementById('countdown-display');

    function updateCountdown() {
        const now = Date.now();
        const distance = targetDate - now;

        if (distance < 0) {
            countdownDisplay.textContent = "Event Started!";
            clearInterval(intervalId);
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        countdownDisplay.textContent = `${days}d ${hours}h ${minutes}m ${seconds}s`;
    }

    // Cập nhật mỗi giây
    // LƯU Ý: Tính toán dựa trên Date.now() mỗi lần chạy giúp tránh drift
    const intervalId = setInterval(updateCountdown, 1000);
    updateCountdown(); // Chạy ngay lần đầu
});