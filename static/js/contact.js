document.addEventListener('DOMContentLoaded', function() {
    // Cache DOM elements
    const contactForm = document.getElementById('contactForm');
    const faqItems = document.querySelectorAll('.faq-item');
    
    // Form validation and submission
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            if (!validateForm()) return;
            
            const submitButton = this.querySelector('button[type="submit"]');
            submitButton.disabled = true;
            submitButton.textContent = 'جاري الإرسال...';
            
            try {
                const formData = new FormData(this);
                const response = await fetch('/api/contact', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(Object.fromEntries(formData))
                });
                
                const data = await response.json();
                
                if (data.success) {
                    showNotification('تم إرسال رسالتك بنجاح! سنتواصل معك قريباً.', 'success');
                    contactForm.reset();
                } else {
                    showNotification('عذراً، حدث خطأ أثناء إرسال الرسالة. الرجاء المحاولة مرة أخرى.', 'error');
                }
            } catch (error) {
                showNotification('حدث خطأ في الاتصال. الرجاء التحقق من اتصالك بالإنترنت.', 'error');
            } finally {
                submitButton.disabled = false;
                submitButton.textContent = 'إرسال الرسالة';
            }
        });
    }

    // Form validation
    function validateForm() {
        let isValid = true;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const message = document.getElementById('message').value;

        // التحقق من صحة البريد الإلكتروني
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            showFieldError('email', 'الرجاء إدخال بريد إلكتروني صحيح');
            isValid = false;
        }

        // التحقق من رقم الهاتف (يقبل الأرقام والعلامات + - () فقط)
        if (!/^[\d\s+()-]+$/.test(phone)) {
            showFieldError('phone', 'الرجاء إدخال رقم هاتف صحيح');
            isValid = false;
        }

        // التحقق من طول الرسالة
        if (message.length < 10) {
            showFieldError('message', 'الرسالة قصيرة جداً. الرجاء كتابة على الأقل 10 أحرف');
            isValid = false;
        }

        return isValid;
    }

    function showFieldError(fieldId, message) {
        const field = document.getElementById(fieldId);
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.textContent = message;
        
        // إزالة أي رسائل خطأ سابقة
        const existingError = field.parentElement.querySelector('.field-error');
        if (existingError) existingError.remove();
        
        field.parentElement.appendChild(errorDiv);
        field.classList.add('error');
        
        // إزالة رسالة الخطأ عند الكتابة
        field.addEventListener('input', function() {
            errorDiv.remove();
            field.classList.remove('error');
        }, { once: true });
    }

    // FAQ Accordion
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        const icon = item.querySelector('.toggle-icon i');
        
        question.addEventListener('click', () => {
            const isOpen = answer.style.maxHeight;
            
            // Close all other answers
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.querySelector('.faq-answer').style.maxHeight = null;
                    otherItem.querySelector('.toggle-icon i').className = 'fas fa-plus';
                }
            });
            
            // Toggle current answer
            answer.style.maxHeight = isOpen ? null : answer.scrollHeight + 'px';
            icon.className = isOpen ? 'fas fa-plus' : 'fas fa-minus';
        });
    });

    // Notification system
    function showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Trigger animation
        setTimeout(() => notification.classList.add('show'), 100);
        
        // Remove notification after 5 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    }
});
