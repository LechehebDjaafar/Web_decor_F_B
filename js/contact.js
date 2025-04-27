/**
 * ديكور سمارت - صفحة التواصل
 * ملف JavaScript للتفاعلات والوظائف
 */

document.addEventListener('DOMContentLoaded', function() {
    'use strict';
    
    // ===== المحمل =====
    const preloader = document.querySelector('.preloader');
    
    window.addEventListener('load', function() {
        setTimeout(function() {
            preloader.classList.add('fade-out');
        }, 500);
    });
    
    // ===== تهيئة مكتبة AOS للتأثيرات =====
    AOS.init({
        duration: 800,
        easing: 'ease',
        once: true,
        offset: 100
    });
    
    // ===== القائمة المتنقلة =====
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    const body = document.body;
    
    if (mobileMenuToggle && mainNav) {
        mobileMenuToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            mainNav.classList.toggle('active');
            body.classList.toggle('no-scroll');
        });

        // إغلاق القائمة عند النقر خارجها
        document.addEventListener('click', function(e) {
            if (!mainNav.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
                mobileMenuToggle.classList.remove('active');
                mainNav.classList.remove('active');
                body.classList.remove('no-scroll');
            }
        });
    }

    // ===== الأسئلة الشائعة =====
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        if (question) {
            question.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                
                // إغلاق كل الأسئلة المفتوحة
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                    }
                });
                
                // تبديل حالة السؤال الحالي
                item.classList.toggle('active');
                
                // تحريك الشاشة إلى السؤال المفتوح على الأجهزة المحمولة
                if (!isActive && window.innerWidth < 768) {
                    const offset = 20;
                    const itemTop = item.getBoundingClientRect().top + window.pageYOffset - offset;
                    window.scrollTo({ top: itemTop, behavior: 'smooth' });
                }
            });
        }
    });

    // ===== نموذج الاتصال =====
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // إزالة رسائل الخطأ السابقة
            clearErrors();
            
            // التحقق من صحة المدخلات
            if (validateForm()) {
                // إظهار رسالة النجاح
                showSuccessMessage();
                
                // إعادة تعيين النموذج
                this.reset();
                
                // هنا يمكن إضافة كود لإرسال البيانات إلى الخادم
            }
        });
    }

    // التحقق من صحة النموذج
    function validateForm() {
        let isValid = true;
        
        // التحقق من الاسم
        const nameInput = document.getElementById('name');
        if (!nameInput.value.trim()) {
            showError(nameInput, 'الرجاء إدخال الاسم الكامل');
            isValid = false;
        }
        
        // التحقق من البريد الإلكتروني
        const emailInput = document.getElementById('email');
        if (!isValidEmail(emailInput.value.trim())) {
            showError(emailInput, 'الرجاء إدخال بريد إلكتروني صحيح');
            isValid = false;
        }
        
        // التحقق من الموضوع
        const subjectInput = document.getElementById('subject');
        if (!subjectInput.value.trim()) {
            showError(subjectInput, 'الرجاء إدخال موضوع الرسالة');
            isValid = false;
        }
        
        // التحقق من الرسالة
        const messageInput = document.getElementById('message');
        if (!messageInput.value.trim()) {
            showError(messageInput, 'الرجاء إدخال نص الرسالة');
            isValid = false;
        }
        
        // التحقق من الموافقة على الشروط
        const privacyCheckbox = document.getElementById('privacy');
        if (!privacyCheckbox.checked) {
            showError(privacyCheckbox, 'الرجاء الموافقة على سياسة الخصوصية وشروط الاستخدام');
            isValid = false;
        }
        
        return isValid;
    }

    // إظهار رسالة خطأ
    function showError(input, message) {
        const formGroup = input.closest('.form-group');
        input.classList.add('error');
        
        const errorMessage = document.createElement('div');
        errorMessage.className = 'error-message';
        errorMessage.textContent = message;
        
        formGroup.appendChild(errorMessage);
    }

    // إزالة رسائل الخطأ
    function clearErrors() {
        const errorInputs = document.querySelectorAll('.error');
        const errorMessages = document.querySelectorAll('.error-message');
        
        errorInputs.forEach(input => input.classList.remove('error'));
        errorMessages.forEach(message => message.remove());
    }

    // التحقق من صحة البريد الإلكتروني
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // إظهار رسالة النجاح
    function showSuccessMessage() {
        const successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.innerHTML = '<i class="fas fa-check-circle"></i> تم إرسال رسالتك بنجاح. سنتواصل معك قريبًا.';
        
        const form = document.getElementById('contactForm');
        form.parentNode.insertBefore(successMessage, form.nextSibling);
        
        // إزالة رسالة النجاح بعد 5 ثوانٍ
        setTimeout(() => {
            successMessage.remove();
        }, 5000);
    }

    // ===== النشرة البريدية =====
    const newsletterForm = document.querySelector('.newsletter-form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = this.querySelector('input[type="email"]');
            
            if (emailInput && isValidEmail(emailInput.value.trim())) {
                // إظهار رسالة النجاح
                const successMessage = document.createElement('div');
                successMessage.className = 'success-message';
                successMessage.innerHTML = '<i class="fas fa-check-circle"></i> تم الاشتراك في النشرة البريدية بنجاح!';
                
                this.parentNode.appendChild(successMessage);
                this.reset();
                
                setTimeout(() => {
                    successMessage.remove();
                }, 3000);
            }
        });
    }

    // ===== زر العودة للأعلى =====
    const backToTop = document.querySelector('.back-to-top');
    
    if (backToTop) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTop.classList.add('active');
            } else {
                backToTop.classList.remove('active');
            }
        });
        
        backToTop.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ===== تأثير تمرير الهيدر =====
    const header = document.querySelector('.header');
    let lastScroll = 0;
    
    if (header) {
        window.addEventListener('scroll', function() {
            const currentScroll = window.pageYOffset;
            
            if (currentScroll <= 0) {
                header.classList.remove('scroll-up');
                return;
            }
            
            if (currentScroll > lastScroll && !header.classList.contains('scroll-down')) {
                // التمرير للأسفل
                header.classList.remove('scroll-up');
                header.classList.add('scroll-down');
            } else if (currentScroll < lastScroll && header.classList.contains('scroll-down')) {
                // التمرير للأعلى
                header.classList.remove('scroll-down');
                header.classList.add('scroll-up');
            }
            
            lastScroll = currentScroll;
        });
    }

    // ===== تأثيرات التمرير للروابط =====
    const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');
    
    smoothScrollLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                e.preventDefault();
                
                const headerOffset = 100;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
                
                // إغلاق القائمة المتنقلة إذا كانت مفتوحة
                if (mainNav && mainNav.classList.contains('active')) {
                    mobileMenuToggle.classList.remove('active');
                    mainNav.classList.remove('active');
                    body.classList.remove('no-scroll');
                }
            }
        });
    });
});
