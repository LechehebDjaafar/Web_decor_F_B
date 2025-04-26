document.addEventListener('DOMContentLoaded', function() {
    // ===== المتغيرات العامة =====
    const filterSection = document.getElementById('filterSection');
    const priceRange = document.getElementById('priceRange');
    const priceValue = document.getElementById('priceValue');
    const productsGrid = document.getElementById('productsGrid');
    const sortBy = document.getElementById('sortBy');
    const applyFilterBtn = document.querySelector('.apply-filter');
    const resetFilterBtn = document.querySelector('.reset-filter');
    const contactButtons = document.querySelectorAll('.contact-btn');
    const favoriteButtons = document.querySelectorAll('.favorite-btn');
    const contactModal = document.getElementById('contactModal');
    const closeModal = document.querySelector('.close-modal');
    const contactForm = document.getElementById('contactForm');
    const pagination = document.querySelector('.pagination');
    
    // الحصول على الفئة الحالية
    const currentCategory = filterSection ? filterSection.dataset.currentCategory || 'all' : 'all';
    
    // ===== التعامل مع فلاتر المنتجات =====
    
    // تحديث قيمة السعر أثناء تحريك الشريط
    if (priceRange && priceValue) {
        priceRange.addEventListener('input', function() {
            // تنسيق العدد بفواصل للأرقام الكبيرة
            priceValue.textContent = parseFloat(this.value).toLocaleString('ar-DZ') + ' دج';
        });
    }
    
    // تطبيق الفلاتر
    if (applyFilterBtn) {
        applyFilterBtn.addEventListener('click', function() {
            applyFilters();
        });
    }
    
    // إعادة ضبط الفلاتر
    if (resetFilterBtn) {
        resetFilterBtn.addEventListener('click', function() {
            resetFilters();
        });
    }
    
    // تجميع الفلاتر وإنشاء الرابط للتصفية
    function applyFilters() {
        let url = new URL(window.location.href);
        
        // إضافة فلتر السعر
        if (priceRange) {
            url.searchParams.set('price', priceRange.value);
        }
        
        // إضافة فلاتر النمط
        const styleCheckboxes = document.querySelectorAll('input[name="style"]:checked');
        const selectedStyles = Array.from(styleCheckboxes).map(checkbox => checkbox.value);
        if (selectedStyles.length > 0) {
            url.searchParams.set('style', selectedStyles.join(','));
        } else {
            url.searchParams.delete('style');
        }
        
        // إضافة فلاتر اللون
        const colorCheckboxes = document.querySelectorAll('input[name="color"]:checked');
        const selectedColors = Array.from(colorCheckboxes).map(checkbox => checkbox.value);
        if (selectedColors.length > 0) {
            url.searchParams.set('color', selectedColors.join(','));
        } else {
            url.searchParams.delete('color');
        }
        
        // إضافة طريقة الترتيب الحالية
        if (sortBy) {
            url.searchParams.set('sort', sortBy.value);
        }
        
        // إعادة تعيين رقم الصفحة إلى 1 عند تطبيق الفلاتر
        url.searchParams.set('page', '1');
        
        // الانتقال إلى الرابط الجديد
        window.location.href = url.toString();
    }
    
    // إعادة ضبط جميع الفلاتر
    function resetFilters() {
        // إعادة ضبط شريط السعر
        if (priceRange) {
            priceRange.value = 50000;
            if (priceValue) {
                priceValue.textContent = '50,000 دج';
            }
        }
        
        // إعادة ضبط صناديق الاختيار للنمط
        const styleCheckboxes = document.querySelectorAll('input[name="style"]');
        styleCheckboxes.forEach(checkbox => {
            checkbox.checked = false;
        });
        
        // إعادة ضبط صناديق الاختيار للون
        const colorCheckboxes = document.querySelectorAll('input[name="color"]');
        colorCheckboxes.forEach(checkbox => {
            checkbox.checked = false;
        });
        
        // تطبيق الفلاتر بعد إعادة الضبط
        applyFilters();
    }
    
    // ===== التعامل مع ترتيب المنتجات =====
    
    if (sortBy) {
        // تعيين القيمة الحالية للترتيب
        const currentSort = sortBy.dataset.currentSort;
        if (currentSort) {
            sortBy.value = currentSort;
        }
        
        // تحديث الترتيب عند التغيير
        sortBy.addEventListener('change', function() {
            let url = new URL(window.location.href);
            url.searchParams.set('sort', this.value);
            window.location.href = url.toString();
        });
    }
    
    // ===== التعامل مع أزرار المفضلة =====
    
    function toggleFavorite(button) {
        if (!button) return;
        
        const productId = button.dataset.id;
        if (!productId) return;
        
        const iconElement = button.querySelector('i');
        if (!iconElement) return;
        
        const isFavorite = iconElement.classList.contains('fas');
        
        // تحديث المظهر المرئي
        if (isFavorite) {
            iconElement.classList.replace('fas', 'far');
        } else {
            iconElement.classList.replace('far', 'fas');
        }
        
        // تخزين المفضلة في Local Storage
        let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
        
        if (isFavorite) {
            // إزالة من المفضلة
            favorites = favorites.filter(id => id !== productId);
        } else {
            // إضافة إلى المفضلة
            if (!favorites.includes(productId)) {
                favorites.push(productId);
            }
        }
        
        localStorage.setItem('favorites', JSON.stringify(favorites));
        
        // إظهار إشعار بنجاح العملية
        showNotification(isFavorite ? 'تمت إزالة المنتج من المفضلة' : 'تمت إضافة المنتج إلى المفضلة');
    }
    
    // تطبيق حالة المفضلة من Local Storage
    function applyFavoritesFromStorage() {
        let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
        
        if (favoriteButtons && favoriteButtons.length > 0) {
            favoriteButtons.forEach(button => {
                const productId = button.dataset.id;
                const iconElement = button.querySelector('i');
                
                if (productId && iconElement && favorites.includes(productId)) {
                    iconElement.classList.replace('far', 'fas');
                }
            });
        }
    }
    
    // إضافة الأحداث لأزرار المفضلة
    if (favoriteButtons && favoriteButtons.length > 0) {
        favoriteButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                toggleFavorite(this);
            });
        });
    }
    
    // تطبيق حالة المفضلة عند تحميل الصفحة
    applyFavoritesFromStorage();
    
    // ===== التعامل مع نافذة التواصل للشراء =====
    
    // فتح النافذة المنبثقة
    if (contactButtons && contactButtons.length > 0 && contactModal) {
        contactButtons.forEach(button => {
            button.addEventListener('click', function() {
                const productId = this.dataset.id;
                const productIdField = document.getElementById('productId');
                
                if (productIdField) {
                    productIdField.value = productId;
                }
                
                // الحصول على معلومات المنتج للعرض في النافذة
                const productCard = document.querySelector(`.product-card[data-product-id="${productId}"]`);
                if (productCard) {
                    const productName = productCard.querySelector('.product-name');
                    const productPrice = productCard.querySelector('.product-price');
                    
                    // تحديث عنوان النافذة المنبثقة
                    const modalTitle = contactModal.querySelector('h2');
                    if (modalTitle && productName && productPrice) {
                        modalTitle.textContent = `تواصل للاستفسار عن: ${productName.textContent} - ${productPrice.textContent}`;
                    }
                    
                    // إضافة محتوى تلقائي إلى حقل الرسالة
                    const messageField = document.getElementById('message');
                    if (messageField && productName) {
                        messageField.value = `أرغب في الاستفسار عن المنتج: ${productName.textContent}`;
                    }
                }
                
                // عرض النافذة المنبثقة
                contactModal.style.display = 'flex';
            });
        });
    }
    
    // إغلاق النافذة المنبثقة
    if (closeModal && contactModal) {
        closeModal.addEventListener('click', function() {
            contactModal.style.display = 'none';
        });
    }
    
    // إغلاق النافذة المنبثقة عند النقر خارجها
    if (contactModal) {
        window.addEventListener('click', function(event) {
            if (event.target === contactModal) {
                contactModal.style.display = 'none';
            }
        });
    }
    
    // معالجة نموذج التواصل
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // التحقق من صحة النموذج
            if (!validateContactForm()) {
                return;
            }
            
            // عرض مؤشر التحميل
            const submitButton = contactForm.querySelector('button[type="submit"]');
            if (submitButton) {
                submitButton.disabled = true;
                submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري الإرسال...';
            }
            
            // إنشاء كائن FormData لجمع بيانات النموذج
            const formData = new FormData(contactForm);
            
            // إرسال البيانات إلى الخادم باستخدام fetch API
            fetch('/api/product-inquiries', {
                method: 'POST',
                body: formData
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('حدث خطأ في إرسال طلب الاستفسار');
                }
                return response.json();
            })
            .then(data => {
                // إغلاق النافذة المنبثقة
                if (contactModal) {
                    contactModal.style.display = 'none';
                }
                
                // إعادة تعيين النموذج
                contactForm.reset();
                
                // إظهار إشعار بنجاح العملية
                showNotification('تم إرسال طلب الاستفسار بنجاح، سنتواصل معك قريبًا');
                
                // إعادة تعيين زر الإرسال
                if (submitButton) {
                    submitButton.disabled = false;
                    submitButton.innerHTML = 'إرسال الطلب';
                }
            })
            .catch(error => {
                // إظهار رسالة الخطأ
                showNotification('حدث خطأ أثناء إرسال الطلب، يرجى المحاولة مرة أخرى', 'error');
                
                // إعادة تعيين زر الإرسال
                if (submitButton) {
                    submitButton.disabled = false;
                    submitButton.innerHTML = 'إرسال الطلب';
                }
                
                console.error('Error:', error);
            });
        });
    }
    
    // التحقق من صحة نموذج التواصل
    function validateContactForm() {
        let isValid = true;
        
        // التحقق من الاسم
        const nameField = document.getElementById('name');
        if (nameField && !nameField.value.trim()) {
            markFieldAsError(nameField, 'الرجاء إدخال الاسم الكامل');
            isValid = false;
        } else if (nameField) {
            clearFieldError(nameField);
        }
        
        // التحقق من رقم الهاتف
        const phoneField = document.getElementById('phone');
        const phonePattern = /^(\+\d{1,3}|0)?[0-9]{9,14}$/;
        
        if (phoneField) {
            if (!phoneField.value.trim()) {
                markFieldAsError(phoneField, 'الرجاء إدخال رقم الهاتف');
                isValid = false;
            } else if (!phonePattern.test(phoneField.value)) {
                markFieldAsError(phoneField, 'الرجاء إدخال رقم هاتف صحيح');
                isValid = false;
            } else {
                clearFieldError(phoneField);
            }
        }
        
        // التحقق من البريد الإلكتروني (إذا تم إدخاله)
        const emailField = document.getElementById('email');
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (emailField && emailField.value.trim() && !emailPattern.test(emailField.value)) {
            markFieldAsError(emailField, 'الرجاء إدخال بريد إلكتروني صحيح');
            isValid = false;
        } else if (emailField) {
            clearFieldError(emailField);
        }
        
        return isValid;
    }
    
    // تمييز الحقل كخطأ
    function markFieldAsError(field, message) {
        if (!field || !field.parentElement) return;
        
        field.classList.add('error');
        
        // إضافة رسالة خطأ إذا لم تكن موجودة
        let errorMessage = field.parentElement.querySelector('.error-message');
        if (!errorMessage) {
            errorMessage = document.createElement('div');
            errorMessage.className = 'error-message';
            field.parentElement.appendChild(errorMessage);
        }
        
        errorMessage.textContent = message;
    }
    
    // إزالة تمييز الخطأ من الحقل
    function clearFieldError(field) {
        if (!field || !field.parentElement) return;
        
        field.classList.remove('error');
        
        // إزالة رسالة الخطأ إذا كانت موجودة
        const errorMessage = field.parentElement.querySelector('.error-message');
        if (errorMessage) {
            field.parentElement.removeChild(errorMessage);
        }
    }
    
    // ===== وظائف مساعدة =====
    
    // عرض إشعار للمستخدم
    function showNotification(message, type = 'success') {
        if (!message) return;
        
        // إنشاء عنصر الإشعار
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        // إضافة الإشعار إلى الصفحة
        document.body.appendChild(notification);
        
        // جعل الإشعار مرئيًا
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        // إزالة الإشعار بعد فترة
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
    
    // ===== تحميل صور المنتجات بشكل متأخر =====
    
    // تطبيق التحميل المتأخر للصور لتحسين أداء الصفحة
    function lazyLoadImages() {
        const productImages = document.querySelectorAll('.product-image img');
        
        if ('IntersectionObserver' in window && productImages && productImages.length > 0) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        const src = img.dataset.src;
                        
                        if (src) {
                            img.src = src;
                            img.removeAttribute('data-src');
                        }
                        
                        observer.unobserve(img);
                    }
                });
            });
            
            productImages.forEach(img => {
                if (img.dataset.src) {
                    imageObserver.observe(img);
                }
            });
        } else if (productImages && productImages.length > 0) {
            // Fallback لمتصفحات لا تدعم IntersectionObserver
            productImages.forEach(img => {
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
            });
        }
    }
    
    // تنفيذ التحميل المتأخر للصور
    lazyLoadImages();
    
    // ===== تطبيق الفلاتر المحفوظة =====
    
    // تطبيق قيم الفلاتر من معلمات URL
    function applyFiltersFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        
        // تطبيق فلتر النمط
        const styleParam = urlParams.get('style');
        if (styleParam) {
            const styles = styleParam.split(',');
            styles.forEach(style => {
                const checkbox = document.querySelector(`input[name="style"][value="${style}"]`);
                if (checkbox) {
                    checkbox.checked = true;
                }
            });
        }
        
        // تطبيق فلتر اللون
        const colorParam = urlParams.get('color');
        if (colorParam) {
            const colors = colorParam.split(',');
            colors.forEach(color => {
                const checkbox = document.querySelector(`input[name="color"][value="${color}"]`);
                if (checkbox) {
                    checkbox.checked = true;
                }
            });
        }
        
        // تطبيق فلتر السعر
        const priceParam = urlParams.get('price');
        if (priceParam && priceRange && priceValue) {
            priceRange.value = priceParam;
            priceValue.textContent = parseFloat(priceParam).toLocaleString('ar-DZ') + ' دج';
        }
    }
    
    // تطبيق الفلاتر من URL
    applyFiltersFromURL();
    // ===== إضافة تأثيرات تفاعلية =====
    
    // إضافة تأثير التحويم على بطاقات المنتجات
    const productCards = document.querySelectorAll('.product-card');
    if (productCards && productCards.length > 0) {
        productCards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.classList.add('hover');
            });
            
            card.addEventListener('mouseleave', function() {
                this.classList.remove('hover');
            });
        });
    }
    
    // ===== التعامل مع الصفحات (pagination) =====
    
    // تحديث روابط الصفحات للحفاظ على الفلاتر
    if (pagination) {
        const pageLinks = pagination.querySelectorAll('.page-link');
        
        if (pageLinks && pageLinks.length > 0) {
            pageLinks.forEach(link => {
                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    
                    // الحصول على رابط الصفحة
                    let url = new URL(this.href);
                    
                    // إضافة معلمات الفلتر الحالية
                    const currentUrl = new URL(window.location.href);
                    
                    // نقل جميع معلمات URL ما عدا معلمة الصفحة
                    currentUrl.searchParams.forEach((value, key) => {
                        if (key !== 'page') {
                            url.searchParams.set(key, value);
                        }
                    });
                    
                    // الانتقال إلى الرابط الجديد
                    window.location.href = url.toString();
                });
            });
        }
    }
});