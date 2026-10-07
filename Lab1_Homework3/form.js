// ==========================================
// HW3 - SLICE 2: State-Machine Form
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registration-form');
    const emailInput = document.getElementById('email-input');
    const submitBtn = document.getElementById('submit-btn');
    const formMessage = document.getElementById('form-message');

    // Định nghĩa các trạng thái
    const STATES = {
        IDLE: 'IDLE',
        SUBMITTING: 'SUBMITTING',
        SUCCESS: 'SUCCESS',
        ERROR: 'ERROR'
    };

    let currentState = STATES.IDLE;

    function setState(newState, message = '') {
        currentState = newState;
        formMessage.textContent = message;

        switch (newState) {
            case STATES.IDLE:
                submitBtn.disabled = false;
                submitBtn.textContent = 'Register';
                formMessage.style.color = '';
                break;
            case STATES.SUBMITTING:
                submitBtn.disabled = true; // CHỐNG DOUBLE-SUBMIT
                submitBtn.textContent = 'Submitting...';
                formMessage.style.color = 'blue';
                break;
            case STATES.SUCCESS:
                submitBtn.disabled = false;
                submitBtn.textContent = 'Registered!';
                formMessage.style.color = 'green';
                break;
            case STATES.ERROR:
                submitBtn.disabled = false;
                submitBtn.textContent = 'Try Again';
                formMessage.style.color = 'red';
                break;
        }
    }

    // Làm sạch dữ liệu đầu vào (XSS Prevention)
    // Sử dụng textContent thay vì innerHTML để ngăn chặn mã độc
    function sanitizeInput(input) {
        const tempDiv = document.createElement('div');
        tempDiv.textContent = input;
        return tempDiv.innerHTML; // Trả về chuỗi đã được escape
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Nếu đang submit thì không làm gì cả (chống double click)
        if (currentState === STATES.SUBMITTING) return;

        const rawEmail = emailInput.value;
        const cleanEmail = sanitizeInput(rawEmail);

        // Hiển thị an toàn (không dùng innerHTML trực tiếp với dữ liệu người dùng)
        setState(STATES.SUBMITTING, `Processing: ${cleanEmail}`);

        // Giả lập gọi API
        setTimeout(() => {
            const isSuccess = Math.random() > 0.3; // 70% thành công
            if (isSuccess) {
                setState(STATES.SUCCESS, 'Registration successful!');
            } else {
                setState(STATES.ERROR, 'Server error. Please try again.');
            }
        }, 1500);
    });
});