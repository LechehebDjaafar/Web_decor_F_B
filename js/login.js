document.addEventListener('DOMContentLoaded', function() {
    // Tab switching functionality
    const tabs = document.querySelectorAll('.auth-tab');
    const forms = document.querySelectorAll('.auth-form');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const target = tab.getAttribute('data-tab');
            
            // Update active tab
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Show corresponding form
            forms.forEach(form => {
                form.classList.remove('active');
                if (form.id === `${target}-form`) {
                    form.classList.add('active');
                }
            });
        });
    });
    
    // Password visibility toggle
    const toggleButtons = document.querySelectorAll('.toggle-password');
    
    toggleButtons.forEach(button => {
        button.addEventListener('click', () => {
            const input = button.parentElement.querySelector('input');
            const icon = button.querySelector('i');
            
            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    });
    
    // Mobile menu toggle
    const mobileToggle = document.querySelector('.mobile-toggle');
    const nav = document.querySelector('nav ul');
    
    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            nav.style.display = nav.style.display === 'flex' ? 'none' : 'flex';
        });
    }
    
    // Form validation
    const loginForm = document.querySelector('#login-form form');
    const registerForm = document.querySelector('#register-form form');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.querySelector('#login-email').value;
            const password = document.querySelector('#login-password').value;
            
            // Basic validation
            if (!email || !password) {
                showMessage('يرجى ملء جميع الحقول المطلوبة', 'error');
                return;
            }
            
            // Here you would typically send the data to your server
            console.log('Login attempt:', { email });
            showMessage('تم تسجيل الدخول بنجاح', 'success');
        });
    }
    
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.querySelector('#register-name').value;
            const email = document.querySelector('#register-email').value;
            const password = document.querySelector('#register-password').value;
            const confirmPassword = document.querySelector('#register-confirm-password').value;
            const terms = document.querySelector('#terms').checked;
            
            // Basic validation
            if (!name || !email || !password || !confirmPassword) {
                showMessage('يرجى ملء جميع الحقول المطلوبة', 'error');
                return;
            }
            
            if (password !== confirmPassword) {
                showMessage('كلمات المرور غير متطابقة', 'error');
                return;
            }
            
            if (!terms) {
                showMessage('يرجى الموافقة على الشروط والأحكام', 'error');
                return;
            }
            
            // Here you would typically send the data to your server
            console.log('Registration attempt:', { name, email });
            showMessage('تم إنشاء الحساب بنجاح', 'success');
        });
    }
    
    // Helper function to show messages
    function showMessage(message, type) {
        // Create message element
        const messageElement = document.createElement('div');
        messageElement.className = `message ${type}`;
        messageElement.textContent = message;
        
        // Add to page
        const container = document.querySelector('.auth-forms');
        container.insertBefore(messageElement, container.firstChild);
        
        // Remove after 3 seconds
        setTimeout(() => {
            messageElement.remove();
        }, 3000);
    }
    
    // Add message styles
    const style = document.createElement('style');
    style.textContent = `
        .message {
            padding: 10px 15px;
            border-radius: 4px;
            margin-bottom: 20px;
            text-align: center;
            animation: fadeIn 0.3s ease;
        }
        
        .message.success {
            background-color: rgba(76, 175, 80, 0.1);
            color: #4CAF50;
            border: 1px solid rgba(76, 175, 80, 0.3);
        }
        
        .message.error {
            background-color: rgba(214, 64, 69, 0.1);
            color: #D64045;
            border: 1px solid rgba(214, 64, 69, 0.3);
        }
        
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
        }
    `;
    
    document.head.appendChild(style);
    
    // Add input focus effects
    const inputs = document.querySelectorAll('input');
    
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', () => {
            input.parentElement.classList.remove('focused');
        });
    });
    
    // Password strength indicator (for registration)
    const registerPasswordInput = document.querySelector('#register-password');
    
    if (registerPasswordInput) {
        registerPasswordInput.addEventListener('input', function() {
            const password = this.value;
            let strength = 0;
            
            // Length check
            if (password.length >= 8) strength += 1;
            
            // Contains lowercase
            if (/[a-z]/.test(password)) strength += 1;
            
            // Contains uppercase
            if (/[A-Z]/.test(password)) strength += 1;
            
            // Contains number
            if (/[0-9]/.test(password)) strength += 1;
            
            // Contains special character
            if (/[^A-Za-z0-9]/.test(password)) strength += 1;
            
            // Show strength indicator
            let strengthText = '';
            let strengthClass = '';
            
            switch (strength) {
                case 0:
                case 1:
                    strengthText = 'ضعيفة';
                    strengthClass = 'weak';
                    break;
                case 2:
                case 3:
                    strengthText = 'متوسطة';
                    strengthClass = 'medium';
                    break;
                case 4:
                case 5:
                    strengthText = 'قوية';
                    strengthClass = 'strong';
                    break;
            }
            
            // Create or update strength indicator
            let strengthIndicator = document.querySelector('.password-strength');
            
            if (!strengthIndicator && password.length > 0) {
                strengthIndicator = document.createElement('div');
                strengthIndicator.className = 'password-strength';
                registerPasswordInput.parentElement.insertAdjacentElement('afterend', strengthIndicator);
            }
            
            if (strengthIndicator && password.length > 0) {
                strengthIndicator.textContent = `قوة كلمة المرور: ${strengthText}`;
                strengthIndicator.className = `password-strength ${strengthClass}`;
            } else if (strengthIndicator) {
                strengthIndicator.remove();
            }
        });
    }
    
    // Add password strength indicator styles
    const strengthStyle = document.createElement('style');
    strengthStyle.textContent = `
        .password-strength {
            margin-top: 8px;
            font-size: 14px;
            transition: all 0.3s ease;
        }
        
        .password-strength.weak {
            color: #D64045;
        }
        
        .password-strength.medium {
            color: #FFA000;
        }
        
        .password-strength.strong {
            color: #4CAF50;
        }
        
        .input-with-icon.focused {
            border-color: #7B5E44;
            box-shadow: 0 0 0 3px rgba(123, 94, 68, 0.15);
        }
    `;
    
    document.head.appendChild(strengthStyle);
});
