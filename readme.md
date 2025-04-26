project_structure/
├── app.py                 # تطبيق Flask الرئيسي
├── schema.sql             # مخطط قاعدة البيانات
├── static/                # الملفات الثابتة
│   ├── css/
│   │   ├── style.css      # ملف CSS الرئيسي
│   │   └── responsive.css # للتصميم المتجاوب
│   ├── js/
│   │   ├── main.js        # سكريبت رئيسي
│   │   └── booking.js     # سكريبت لصفحة الحجز
│   └── images/
│       ├── logo.png       # شعار الموقع
│       ├── hero.jpg       # صورة الصفحة الرئيسية
│       └── furniture/     # مجلد لصور الأثاث
├── templates/             # قوالب HTML
│   ├── layout.html        # القالب الرئيسي
│   ├── index.html         # الصفحة الرئيسية
│   ├── about.html         # صفحة من نحن
│   ├── services.html      # صفحة خدماتنا
│   ├── store.html         # صفحة المتجر
│   ├── booking.html       # صفحة الحجز
│   └── contact.html       # صفحة تواصل معنا
└── instance/              # مجلد لقاعدة البيانات
    └── decorsmart.db      # قاعدة البيانات SQLite