document.addEventListener('DOMContentLoaded', function() {
    // قائمة التنقل للهاتف المحمول
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navMenu = document.querySelector('nav ul');

    if (mobileToggle) {
        mobileToggle.addEventListener('click', function() {
            navMenu.classList.toggle('show');
        });
    }

    // إغلاق القائمة عند النقر على الروابط
    const navLinks = document.querySelectorAll('nav ul li a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('show');
        });
    });

    // معالجة التمرير السلس للروابط
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId !== '#') {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 70,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // تأثيرات التمرير للعناصر
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.feature-card, .testimonial-content, .cta');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.3;
            
            if (elementPosition < screenPosition) {
                element.classList.add('fade-in');
            }
        });
    };

    // إضافة كلاس للتحريك عند التمرير
    window.addEventListener('scroll', animateOnScroll);
    
    // تشغيل التحريك عند تحميل الصفحة
    animateOnScroll();

    // شريط تمرير التقييمات
    const testimonials = document.querySelectorAll('.testimonial');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    let currentIndex = 0;

    // عرض التقييم الأول عند تحميل الصفحة
    if (testimonials.length > 0) {
        testimonials[0].style.display = 'block';
    }

    // دالة لعرض التقييم المحدد مع تأثير انتقالي
    function showTestimonial(index) {
        testimonials.forEach(testimonial => {
            testimonial.style.opacity = '0';
            setTimeout(() => {
                testimonial.style.display = 'none';
            }, 300);
        });
        
        setTimeout(() => {
            testimonials[index].style.display = 'block';
            setTimeout(() => {
                testimonials[index].style.opacity = '1';
            }, 50);
        }, 300);
    }

    // إضافة تأثير انتقالي للتقييمات
    testimonials.forEach(testimonial => {
        testimonial.style.transition = 'opacity 0.3s ease';
        testimonial.style.opacity = '0';
    });
    
    if (testimonials.length > 0) {
        testimonials[0].style.opacity = '1';
    }

    // التنقل للتقييم السابق
    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            currentIndex--;
            if (currentIndex < 0) {
                currentIndex = testimonials.length - 1;
            }
            showTestimonial(currentIndex);
        });
    }

    // التنقل للتقييم التالي
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            currentIndex++;
            if (currentIndex >= testimonials.length) {
                currentIndex = 0;
            }
            showTestimonial(currentIndex);
        });
    }

    // تناوب تلقائي للتقييمات
    let testimonialInterval;

    function startTestimonialRotation() {
        testimonialInterval = setInterval(function() {
            currentIndex++;
            if (currentIndex >= testimonials.length) {
                currentIndex = 0;
            }
            showTestimonial(currentIndex);
        }, 5000); // تغيير كل 5 ثواني
    }

    function stopTestimonialRotation() {
        clearInterval(testimonialInterval);
    }

    // بدء التناوب التلقائي عند تحميل الصفحة
    if (testimonials.length > 0) {
        startTestimonialRotation();
    
        // إيقاف التناوب التلقائي عند مرور المؤشر فوق التقييمات
        const testimonialsContainer = document.querySelector('.testimonials-slider');
        testimonialsContainer.addEventListener('mouseenter', stopTestimonialRotation);
        testimonialsContainer.addEventListener('mouseleave', startTestimonialRotation);
    }

    // نموذج النشرة البريدية
    const newsletterForm = document.querySelector('.footer-newsletter form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const emailInput = this.querySelector('input[type="email"]');
            const email = emailInput.value.trim();
            
            if (email === '') {
                alert('يرجى إدخال بريدك الإلكتروني');
                return;
            }
            
            // يمكن إضافة التحقق من صحة البريد الإلكتروني هنا
            if (!validateEmail(email)) {
                alert('يرجى إدخال بريد إلكتروني صحيح');
                return;
            }
            
            // هنا يمكن إضافة كود لإرسال البريد الإلكتروني للخادم
            alert('شكراً لاشتراكك في النشرة البريدية!');
            emailInput.value = '';
        });
    }

    // دالة للتحقق من صحة البريد الإلكتروني
    function validateEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    // تأثير التمرير للهيدر
    const header = document.querySelector('header');
    let lastScroll = 0;

    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;

        if (currentScroll > lastScroll && currentScroll > 100) {
            // التمرير لأسفل
            header.style.transform = 'translateY(-100%)';
        } else {
            // التمرير لأعلى
            header.style.transform = 'translateY(0)';
        }

        if (currentScroll > 100) {
            header.style.boxShadow = '0 5px 15px rgba(123, 94, 68, 0.1)';
        } else {
            header.style.boxShadow = '0 2px 10px rgba(123, 94, 68, 0.1)';
        }

        lastScroll = currentScroll;
    });

    // تحميل الصور بشكل كسول (lazy loading)
    if ('IntersectionObserver' in window) {
        const imgObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    const src = img.getAttribute('data-src');
                    if (src) {
                        img.src = src;
                        img.removeAttribute('data-src');
                    }
                    observer.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imgObserver.observe(img);
        });
    }

    // تأثيرات التحريك عند التمرير
    const fadeElements = document.querySelectorAll('.fade-in');
    
    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.5
    });

    fadeElements.forEach(element => {
        fadeObserver.observe(element);
    });

    // إضافة تأثير ripple للأزرار
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            ripple.classList.add('ripple');
            this.appendChild(ripple);

            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';

            setTimeout(() => {
                ripple.remove();
            }, 1000);
        });
    });
});
