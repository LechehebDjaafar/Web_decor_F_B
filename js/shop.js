// main.js
document.addEventListener('DOMContentLoaded', function() {
    // تبديل القائمة في الهاتف المحمول
    const mobileToggle = document.querySelector('.mobile-toggle');
    const nav = document.querySelector('nav ul');
    
    if(mobileToggle) {
        mobileToggle.addEventListener('click', function() {
            nav.style.display = nav.style.display === 'flex' ? 'none' : 'flex';
        });
    }

    // تصفية المنتجات
    const filterButtons = document.querySelectorAll('.filter-btn');
    const products = document.querySelectorAll('.product-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // إزالة الكلاس النشط من جميع الأزرار
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // إضافة الكلاس النشط للزر المحدد
            button.classList.add('active');
            
            const category = button.getAttribute('data-category');
            
            products.forEach(product => {
                if(category === 'all') {
                    product.style.display = 'block';
                } else {
                    if(product.getAttribute('data-category') === category) {
                        product.style.display = 'block';
                    } else {
                        product.style.display = 'none';
                    }
                }
            });
        });
    });

    // البحث في المنتجات
    const searchInput = document.querySelector('.search-box input');
    
    if(searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            
            products.forEach(product => {
                const productName = product.querySelector('h3').textContent.toLowerCase();
                if(productName.includes(searchTerm)) {
                    product.style.display = 'block';
                } else {
                    product.style.display = 'none';
                }
            });
        });
    }

    // ترتيب المنتجات
    const sortSelect = document.querySelector('.sort-by select');
    
    if(sortSelect) {
        sortSelect.addEventListener('change', function() {
            const sortValue = this.value;
            const productsArray = Array.from(products);
            
            productsArray.sort((a, b) => {
                const priceA = parseInt(a.querySelector('.price').textContent.replace(/[^\d]/g, ''));
                const priceB = parseInt(b.querySelector('.price').textContent.replace(/[^\d]/g, ''));
                
                switch(sortValue) {
                    case 'price-asc':
                        return priceA - priceB;
                    case 'price-desc':
                        return priceB - priceA;
                    case 'popularity':
                        const ratingA = parseInt(a.querySelector('.stars span').textContent.replace(/[()]/g, ''));
                        const ratingB = parseInt(b.querySelector('.stars span').textContent.replace(/[()]/g, ''));
                        return ratingB - ratingA;
                    default:
                        return 0;
                }
            });
            
            const productsGrid = document.querySelector('.products-grid');
            productsArray.forEach(product => {
                productsGrid.appendChild(product);
            });
        });
    }

    // المفضلة
    const wishlistButtons = document.querySelectorAll('.wishlist-btn');
    
    wishlistButtons.forEach(button => {
        button.addEventListener('click', function() {
            this.querySelector('i').classList.toggle('fas');
            this.querySelector('i').classList.toggle('far');
        });
    });

    // تأثيرات التمرير السلس
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if(target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
});
