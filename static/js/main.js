// static/js/main.js

document.addEventListener('DOMContentLoaded', () => {
    // --- تبديل قائمة التنقل (Mobile Menu Toggle) ---
    const menuToggle = document.getElementById('menuToggle');
    const mainMenu = document.querySelector('nav .main-menu');

    if (menuToggle && mainMenu) {
        menuToggle.addEventListener('click', () => {
            mainMenu.classList.toggle('active');
            // تغيير أيقونة الزر (اختياري)
            const icon = menuToggle.querySelector('i');
            if (mainMenu.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });

        // إغلاق القائمة عند النقر خارجها (اختياري)
        document.addEventListener('click', (event) => {
            if (!mainMenu.contains(event.target) && !menuToggle.contains(event.target) && mainMenu.classList.contains('active')) {
                mainMenu.classList.remove('active');
                menuToggle.querySelector('i').classList.remove('fa-times');
                menuToggle.querySelector('i').classList.add('fa-bars');
            }
        });
    }

    // --- تأثير الانتقال السلس عند النقر على الروابط الداخلية (اختياري) ---
    // const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');
    // smoothScrollLinks.forEach(link => {
    //     link.addEventListener('click', function (e) {
    //         e.preventDefault();
    //         const targetId = this.getAttribute('href');
    //         const targetElement = document.querySelector(targetId);
    //         if (targetElement) {
    //             // إغلاق القائمة المنسدلة إذا كانت مفتوحة قبل الانتقال
    //             if (mainMenu && mainMenu.classList.contains('active')) {
    //                  mainMenu.classList.remove('active');
    //                  menuToggle.querySelector('i').classList.remove('fa-times');
    //                  menuToggle.querySelector('i').classList.add('fa-bars');
    //             }
    //             // حساب إزاحة الهيدر
    //             const headerOffset = document.querySelector('header')?.offsetHeight || 0;
    //             const elementPosition = targetElement.getBoundingClientRect().top;
    //             const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

    //             window.scrollTo({
    //                 top: offsetPosition,
    //                 behavior: "smooth"
    //             });
    //         }
    //     });
    // });


    // --- أكورديون الأسئلة الشائعة (FAQ Accordion) ---
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        if (question) {
            question.addEventListener('click', () => {
                // أغلق جميع العناصر الأخرى أولاً (إذا أردت فتح عنصر واحد فقط في المرة)
                // faqItems.forEach(otherItem => {
                //     if (otherItem !== item && otherItem.classList.contains('active')) {
                //         otherItem.classList.remove('active');
                //     }
                // });

                // فتح/إغلاق العنصر الحالي
                item.classList.toggle('active');
            });
        }
    });

    // --- إخفاء رسائل Flash بعد فترة ---
    const flashMessages = document.querySelectorAll('.flash-message');
    if (flashMessages.length > 0) {
        setTimeout(() => {
            flashMessages.forEach(message => {
                // تأثير التلاشي التدريجي (اختياري)
                message.style.transition = 'opacity 0.5s ease-out';
                message.style.opacity = '0';
                // إزالة العنصر بعد انتهاء التلاشي
                setTimeout(() => message.remove(), 500);
            });
        }, 5000); // إخفاء بعد 5 ثوانٍ
    }

    // --- إضافة مكتبة سلايدر للتقييمات (مثال باستخدام Slick Slider - يتطلب تضمين المكتبة) ---
    // تأكد من تضمين ملفات CSS و JS لمكتبة Slick Slider في layout.html
    // if (typeof $ !== 'undefined' && $.fn.slick) { // التحقق من وجود jQuery و Slick
    //     $('.testimonials-slider').slick({
    //         dots: true,
    //         infinite: true,
    //         speed: 500,
    //         slidesToShow: 2, // عدد العناصر الظاهرة في الشاشات الكبيرة
    //         slidesToScroll: 1,
    //         autoplay: true,
    //         autoplaySpeed: 4000,
    //         rtl: true, // لدعم اللغة العربية
    //         responsive: [
    //             {
    //                 breakpoint: 992,
    //                 settings: {
    //                     slidesToShow: 1 // عنصر واحد في الشاشات المتوسطة والصغيرة
    //                 }
    //             }
    //         ]
    //     });
    // } else {
    //     console.log("Slick Slider library not found or jQuery not loaded.");
    // }

});

// --- وظيفة لإظهار النافذة المنبثقة (Modal) ---
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = "block";
        // إغلاق النافذة عند النقر خارجها (اختياري)
        window.onclick = function(event) {
            if (event.target == modal) {
                closeModal(modalId);
            }
        }
    }
}

// --- وظيفة لإغلاق النافذة المنبثقة (Modal) ---
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = "none";
    }
}