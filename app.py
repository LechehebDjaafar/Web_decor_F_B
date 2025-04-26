import os
import sqlite3
import click # <-- تم إضافة هذا الاستيراد
from flask import Flask, render_template, request, g, redirect, url_for, flash, jsonify
from datetime import datetime, timedelta

# إنشاء تطبيق Flask
app = Flask(__name__)
app.config['SECRET_KEY'] = 'decorsmart_secret_key'
app.config['DATABASE'] = os.path.join(app.instance_path, 'decorsmart.db')

# التأكد من وجود مجلد instance
try:
    os.makedirs(app.instance_path)
except OSError:
    pass

# --- وظائف قاعدة البيانات ---
def get_db():
    """الاتصال بقاعدة البيانات الحالية للتطبيق."""
    if 'db' not in g:
        g.db = sqlite3.connect(
            app.config['DATABASE'],
            detect_types=sqlite3.PARSE_DECLTYPES
        )
        g.db.row_factory = sqlite3.Row
    return g.db

def close_db(e=None):
    """إغلاق اتصال قاعدة البيانات."""
    db = g.pop('db', None)
    if db is not None:
        db.close()

# تسجيل دالة إغلاق قاعدة البيانات مع سياق التطبيق
app.teardown_appcontext(close_db)

def init_db():
    """مسح البيانات الموجودة وإنشاء جداول جديدة."""
    db = get_db()
    with app.open_resource('schema.sql') as f:
        db.executescript(f.read().decode('utf8'))
    # إضافة بيانات افتراضية بعد إنشاء الجداول
    populate_default_data(db)
    db.commit() # حفظ التغييرات بعد إضافة البيانات

def populate_default_data(db):
    """إضافة بيانات افتراضية إلى الجداول."""
    # إضافة مصممين افتراضيين (إذا لم يكونوا موجودين)
    designers = [
        ('أحمد محمود', 'تصميم المساحات السكنية', 'designer1.jpg', 5, 'خبرة أكثر من 10 سنوات في تصميم المنازل والشقق الفاخرة.'),
        ('سارة مصطفى', 'تصميم المكاتب والمساحات التجارية', 'designer2.jpg', 4, 'متخصصة في تصميم بيئات العمل العصرية والمريحة.'),
        ('كريم عبد النور', 'تصميم الحدائق والمساحات الخارجية', 'designer3.jpg', 5, 'خبير في دمج المساحات الخضراء مع التصميم الداخلي.')
    ]
    db.executemany('''
        INSERT OR IGNORE INTO designers (name, specialty, image, rating, bio)
        VALUES (?, ?, ?, ?, ?)
    ''', designers)

    # إضافة تقييمات افتراضية (إذا لم تكن موجودة)
    testimonials = [
        ('محمد ساعي', 'الجزائر العاصمة', 5, 'تجربة رائعة مع فريق ديكور سمارت. المصممون محترفون والنتيجة النهائية تجاوزت توقعاتي.'),
        ('ليلى بوقرة', 'وهران', 4, 'استفدت كثيراً من الاستشارة المجانية، وحصلت على أفكار مبتكرة لشقتي بميزانية محدودة.'),
        ('رياض مالك', 'قسنطينة', 5, 'الأثاث الذي اشتريته من ديكور سمارت ذو جودة ممتازة وتصميم عصري. أنصح به بشدة!')
    ]
    db.executemany('''
        INSERT OR IGNORE INTO testimonials (name, city, rating, text)
        VALUES (?, ?, ?, ?)
    ''', testimonials)

    # إضافة منتجات افتراضية (إذا لم تكن موجودة)
    product_data = []
    categories = ['صالون', 'غرفة نوم', 'مطبخ', 'مكتب', 'حمام', 'حديقة']
    for category in categories:
        for i in range(1, 4):
            product_data.append((
                f'منتج {category} {i}',
                category,
                round(float(10000 + (i * 5000))),
                f'وصف تفصيلي للمنتج {i} في فئة {category}. هذا المنتج يتميز بتصميم عصري وجودة عالية من المواد.',
                f'product-{category.lower().replace(" ", "-")}-{i}.jpg', # Ensure consistent image names
                4
            ))
    db.executemany('''
        INSERT OR IGNORE INTO products (name, category, price, description, image, rating)
        VALUES (?, ?, ?, ?, ?, ?)
    ''', product_data)

@app.cli.command('init-db')
def init_db_command():
    """مسح البيانات الموجودة وإنشاء جداول جديدة."""
    init_db()
    # السطر الذي كان يسبب المشكلة تم إزالته
    click.echo('Initialized the database.') # <-- استخدام click المستوردة مباشرة

# --- صفحات الموقع ---
@app.route('/')
def index():
    db = get_db()
    # جلب آخر 3 تقييمات معتمدة
    testimonials = db.execute(
        'SELECT * FROM testimonials WHERE is_approved = 1 ORDER BY created_at DESC LIMIT 3'
    ).fetchall()
    return render_template('index.html', testimonials=testimonials)

@app.route('/about')
def about():
    db = get_db()
    # جلب المصممين المتاحين
    team_members = db.execute(
        'SELECT * FROM designers WHERE available = 1 ORDER BY name'
    ).fetchall()
    return render_template('about.html', team_members=team_members)

@app.route('/services')
def services():
    return render_template('services.html')

@app.route('/store')
def store():
    db = get_db()
    page = request.args.get('page', 1, type=int)
    category = request.args.get('category', None) # استخدام None كقيمة افتراضية
    per_page = 9  # عدد المنتجات في الصفحة الواحدة

    category_names = {
        'all': 'جميع المنتجات',
        'living': 'صالون',
        'bedroom': 'غرفة نوم',
        'kitchen': 'مطبخ',
        'office': 'مكتب',
        'decor': 'ديكور'
    }

    # استعلام عن الفئات المتاحة
    categories_result = db.execute('SELECT DISTINCT category FROM products ORDER BY category').fetchall()
    categories = [row['category'] for row in categories_result] # تحويلها إلى قائمة بسيطة

    # بناء الاستعلام الأساسي للمنتجات
    base_query = 'SELECT * FROM products'
    count_query = 'SELECT COUNT(*) FROM products'
    parameters = []
    where_clauses = []

    if category:
        where_clauses.append('category = ?')
        parameters.append(category)

    # بناء جملة WHERE
    if where_clauses:
        query_where = ' WHERE ' + ' AND '.join(where_clauses)
        base_query += query_where
        count_query += query_where

    # حساب إجمالي عدد المنتجات والصفحات
    total = db.execute(count_query, parameters).fetchone()[0]
    total_pages = (total + per_page - 1) // per_page

    # إضافة حدود الصفحة (Pagination)
    offset = (page - 1) * per_page
    paged_query = base_query + ' ORDER BY created_at DESC LIMIT ? OFFSET ?'
    parameters.extend([per_page, offset])

    products = db.execute(paged_query, parameters).fetchall()

    return render_template('store.html',
                          products=products,
                          categories=categories,
                          current_category=category, # تغيير الاسم لتمييزه
                          category_names=category_names,
                          page=page,
                          total_pages=total_pages)

@app.route('/product/<int:product_id>')
def product_details(product_id):
    db = get_db()
    product = db.execute('SELECT * FROM products WHERE id = ?', (product_id,)).fetchone()
    if product is None:
        flash('المنتج غير موجود.', 'error')
        return redirect(url_for('store'))

    # استعلام عن منتجات مشابهة من نفس الفئة (باستثناء المنتج الحالي)
    similar_products = db.execute(
        'SELECT * FROM products WHERE category = ? AND id != ? ORDER BY RANDOM() LIMIT 4',
        (product['category'], product_id)
    ).fetchall()

    # في حالة عدم وجود صفحة تفاصيل المنتج، يمكن إعادة التوجيه أو عرض خطأ
    # return render_template('product_details.html', product=product, similar_products=similar_products)
    flash('صفحة تفاصيل المنتج غير متوفرة حاليًا.', 'info')
    return redirect(url_for('store')) # مؤقتا، إعادة توجيه إلى المتجر


@app.route('/booking')
def booking():
    db = get_db()
    # جلب المصممين المتاحين فقط
    designers = db.execute('SELECT id, name, specialty FROM designers WHERE available = 1 ORDER BY name').fetchall()
    min_date = datetime.now().date().isoformat()  # الحد الأدنى هو تاريخ اليوم

    # اختيار بعض المصممين للعرض في قسم "تعرف على مصممينا" (المتاحين الأعلى تقييمًا)
    featured_designers = db.execute(
        'SELECT * FROM designers WHERE available = 1 ORDER BY rating DESC LIMIT 3'
    ).fetchall()

    return render_template('booking.html',
                          designers=designers,
                          min_date=min_date,
                          featured_designers=featured_designers)

@app.route('/contact')
def contact():
    return render_template('contact.html')

# --- صفحات المصادقة (أمثلة بسيطة، تحتاج إلى تطوير) ---
@app.route('/login')
def login():
    # يجب إضافة منطق المصادقة الفعلي هنا
    flash('صفحة تسجيل الدخول غير مكتملة بعد.', 'warning')
    return render_template('login.html') # تأكد من وجود ملف login.html

@app.route('/register')
def register():
    # يجب إضافة منطق التسجيل الفعلي هنا
    flash('صفحة التسجيل غير مكتملة بعد.', 'warning')
    return render_template('register.html') # تأكد من وجود ملف register.html

# --- معالجة النماذج ---
@app.route('/submit_booking', methods=['POST'])
def submit_booking():
    if request.method == 'POST':
        # استخراج البيانات من النموذج والتحقق منها (يمكن إضافة تحقق أكثر تفصيلاً)
        full_name = request.form.get('full_name')
        phone = request.form.get('phone')
        email = request.form.get('email')
        service_type = request.form.get('service_type')
        designer_id = request.form.get('designer')
        booking_date = request.form.get('booking_date')
        booking_time = request.form.get('booking_time')
        project_details = request.form.get('project_details', '')

        # التحقق من الحقول المطلوبة
        if not all([full_name, phone, email, service_type, designer_id, booking_date, booking_time]):
            flash('يرجى ملء جميع الحقول المطلوبة.', 'error')
            return redirect(url_for('booking'))

        try:
            db = get_db()
            db.execute('''
                INSERT INTO bookings (full_name, phone, email, service_type, designer_id, booking_date, booking_time, project_details, status)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (full_name, phone, email, service_type, designer_id, booking_date, booking_time, project_details, 'pending'))
            db.commit()
            flash('تم حجز موعدك بنجاح! سنتواصل معك قريباً لتأكيد الموعد.', 'success')
        except sqlite3.Error as e:
            flash(f'حدث خطأ أثناء حفظ الحجز: {e}', 'error')
            # يمكنك تسجيل الخطأ هنا للمراجعة لاحقاً
            # app.logger.error(f"Database error on booking submission: {e}")

        return redirect(url_for('booking'))
    return redirect(url_for('booking')) # إعادة توجيه إذا كانت الطريقة GET

@app.route('/submit_contact', methods=['POST'])
def submit_contact():
    if request.method == 'POST':
        full_name = request.form.get('full_name')
        phone = request.form.get('phone')
        email = request.form.get('email')
        subject = request.form.get('subject')
        message = request.form.get('message')

        if not all([full_name, phone, email, subject, message]):
            flash('يرجى ملء جميع الحقول المطلوبة.', 'error')
            return redirect(url_for('contact'))

        try:
            db = get_db()
            db.execute('''
                INSERT INTO messages (full_name, phone, email, subject, message, created_at)
                VALUES (?, ?, ?, ?, ?, ?)
            ''', (full_name, phone, email, subject, message, datetime.now()))
            db.commit()
            flash('تم إرسال رسالتك بنجاح! سنرد عليك في أقرب وقت ممكن.', 'success')
        except sqlite3.Error as e:
            flash(f'حدث خطأ أثناء إرسال الرسالة: {e}', 'error')
            # app.logger.error(f"Database error on contact submission: {e}")

        return redirect(url_for('contact'))
    return redirect(url_for('contact'))

@app.route('/api/products')
def get_filtered_products():
    price = request.args.get('price', type=float)
    styles = request.args.get('styles', '').split(',') if request.args.get('styles') else []
    colors = request.args.get('colors', '').split(',') if request.args.get('colors') else []
    sort = request.args.get('sort', 'popularity')

    query = Product.query

    if price:
        query = query.filter(Product.price <= price)
    if styles:
        query = query.filter(Product.style.in_(styles))
    if colors:
        query = query.filter(Product.color.in_(colors))

    if sort == 'price_asc':
        query = query.order_by(Product.price.asc())
    elif sort == 'price_desc':
        query = query.order_by(Product.price.desc())
    elif sort == 'newest':
        query = query.order_by(Product.created_at.desc())
    else:  # popularity
        query = query.order_by(Product.views.desc())

    products = query.all()
    return jsonify({
        'products': [product.to_dict() for product in products]
    })

# تشغيل التطبيق (يفضل استخدام خادم WSGI في الإنتاج بدلاً من هذا)
if __name__ == '__main__':
    # تفعيل وضع التصحيح (Debug Mode) للتطوير فقط
    # في بيئة الإنتاج، يجب تعيين debug=False
    app.run(debug=True)