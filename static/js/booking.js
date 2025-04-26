document.addEventListener('DOMContentLoaded', function() {
    const bookingForm = document.getElementById('bookingForm');
    const serviceTypeSelect = document.getElementById('serviceType');
    const designerSelect = document.getElementById('designer');
    const bookingDateInput = document.getElementById('bookingDate');
    const bookingTimeInput = document.getElementById('bookingTime');
    
    // تعيين الحد الأدنى للتاريخ ليكون التاريخ الحالي
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    bookingDateInput.min = formattedDate;
    
    // التحقق من تغيير نوع الخدمة
    serviceTypeSelect.addEventListener('change', function() {
        // إذا كانت الخدمة زيارة منزلية، عرض رسالة تنبيه
        if (this.value === 'visit') {
            alert('الزيارات المنزلية متاحة فقط في المدن الرئيسية. سيتصل بك فريقنا لتأكيد الموعد.');
            
            // تحديث ساعات العمل للزيارات المنزلية (من 10 صباحاً إلى 4 مساءً)
            bookingTimeInput.min = "10:00";
            bookingTimeInput.max = "16:00";
        } else {
            // إعادة تعيين ساعات العمل العادية
            bookingTimeInput.min = "09:00";
            bookingTimeInput.max = "18:00";
        }
        
        // تحديث قائمة المصممين بناءً على نوع الخدمة المختارة
        updateDesignersList(this.value);
    });
    
    // تحديث قائمة المصممين بناءً على نوع الخدمة
    function updateDesignersList(serviceType) {
        // هنا يمكن إضافة طلب AJAX لجلب المصممين المتاحين لنوع الخدمة المحددة
        // لأغراض العرض، نحن فقط نقوم بتغيير حالة الزر
        
        if (serviceType === '') {
            designerSelect.disabled = true;
        } else {
            designerSelect.disabled = false;
        }
    }
    
    // التحقق من صحة التاريخ والوقت
    bookingDateInput.addEventListener('change', function() {
        validateDateTime();
    });
    
    bookingTimeInput.addEventListener('change', function() {
        validateDateTime();
    });
    
    // التحقق من أن التاريخ والوقت متاحان
    function validateDateTime() {
        const selectedDate = new Date(bookingDateInput.value);
        const dayOfWeek = selectedDate.getDay();
        const selectedTime = bookingTimeInput.value;
        
        // التحقق من أن اليوم ليس يوم الجمعة (في معظم الدول العربية هو يوم العطلة)
        if (dayOfWeek === 5) { // 5 هو يوم الجمعة (0 هو الأحد)
            alert('عذراً، لا نقدم خدمات في يوم الجمعة. يرجى اختيار يوم آخر.');
            bookingDateInput.value = '';
            return false;
        }
        
        // التحقق من أن الوقت ضمن ساعات العمل
        if (selectedTime && (selectedTime < bookingTimeInput.min || selectedTime > bookingTimeInput.max)) {
            alert(`عذراً، ساعات العمل من ${bookingTimeInput.min} صباحاً إلى ${bookingTimeInput.max} مساءً`);
            bookingTimeInput.value = '';
            return false;
        }
        
        return true;
    }
    
    // معالجة تقديم النموذج
    bookingForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        if (!validateForm()) {
            return;
        }
        
        // إنشاء كائن FormData لجمع بيانات النموذج
        const formData = new FormData(bookingForm);
        
        // عرض مؤشر التحميل
        showLoadingIndicator();
        
        // إرسال البيانات إلى الخادم باستخدام fetch API
        fetch('/api/bookings', {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('حدث خطأ في إرسال طلب الحجز');
            }
            return response.json();
        })
        .then(data => {
            hideLoadingIndicator();
            showBookingConfirmation(data);
        })
        .catch(error => {
            hideLoadingIndicator();
            showError(error.message);
            console.error('Error:', error);
        });
    });
    
    // التحقق من صحة النموذج
    function validateForm() {
        // التحقق من أن جميع الحقول المطلوبة قد تم ملؤها
        const requiredFields = bookingForm.querySelectorAll('[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                field.classList.add('error');
            } else {
                field.classList.remove('error');
            }
        });
        
        // التحقق من صحة البريد الإلكتروني
        const emailField = document.getElementById('email');
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailField.value && !emailPattern.test(emailField.value)) {
            isValid = false;
            emailField.classList.add('error');
            alert('يرجى إدخال بريد إلكتروني صحيح');
        }
        
        // التحقق من صحة رقم الهاتف
        const phoneField = document.getElementById('phone');
        const phonePattern = /^[0-9+\s\-()]{8,15}$/;
        if (phoneField.value && !phonePattern.test(phoneField.value)) {
            isValid = false;
            phoneField.classList.add('error');
            alert('يرجى إدخال رقم هاتف صحيح');
        }
        
        // التحقق من صحة التاريخ والوقت
        if (!validateDateTime()) {
            isValid = false;
        }
        
        return isValid;
    }
    
    // عرض مؤشر التحميل
    function showLoadingIndicator() {
        const submitButton = bookingForm.querySelector('button[type="submit"]');
        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري الإرسال...';
    }
    
    // إخفاء مؤشر التحميل
    function hideLoadingIndicator() {
        const submitButton = bookingForm.querySelector('button[type="submit"]');
        submitButton.disabled = false;
        submitButton.innerHTML = 'تأكيد الحجز';
    }
    
    // عرض تأكيد الحجز
    function showBookingConfirmation(data) {
        // إنشاء عنصر تأكيد الحجز
        const confirmationElement = document.createElement('div');
        confirmationElement.className = 'booking-confirmation';
        
        confirmationElement.innerHTML = `
            <div class="confirmation-content">
                <div class="confirmation-icon">
                    <i class="fas fa-check-circle"></i>
                </div>
                <h2>تم تأكيد حجزك بنجاح!</h2>
                <p>رقم الحجز: <strong>${data.bookingId || 'N/A'}</strong></p>
                <p>سيتم التواصل معك قريباً لتأكيد التفاصيل.</p>
                <button class="btn btn-primary" id="closeConfirmation">حسناً</button>
            </div>
        `;
        
        // إضافة عنصر التأكيد إلى الصفحة
        document.body.appendChild(confirmationElement);
        
        // إعادة تعيين النموذج
        bookingForm.reset();
        
        // إضافة حدث النقر لزر الإغلاق
        document.getElementById('closeConfirmation').addEventListener('click', function() {
            document.body.removeChild(confirmationElement);
        });
    }
    
    // عرض رسالة الخطأ
    function showError(message) {
        alert('عذراً، حدث خطأ: ' + message);
    }
    
    // إضافة تفاعلات إضافية لتحسين تجربة المستخدم
    
    // إضافة تأثير التركيز للحقول
    const formInputs = bookingForm.querySelectorAll('input, select, textarea');
    formInputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('focused');
            // إزالة حدود الخطأ عند الكتابة
            if (this.value.trim()) {
                this.classList.remove('error');
            }
        });
    });
});