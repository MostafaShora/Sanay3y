// تشغيل التطبيق أول ما الصفحة تفتح
document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

function initApp() {
    renderNavbar(); 
    
    // التأكد إننا في الصفحة الرئيسية قبل رسم المحتوى
    const homeContainer = document.getElementById('home-content');
    if (homeContainer) {
        renderHero();       
        // بدل ما ننادي renderCategories هنا، هننادي دالة الجلب اللي هي هترسمها في مكانها
        fetchAndRenderCategories(); 
        renderHowItWorks(); 
    }
    
    renderFooter();
    //checkSavedTheme(); 
    applySavedTheme();
}

// 1. قسم الهيرو
function renderHero() {
    const container = document.getElementById('home-content');
    if (!container) return;

    const hero = document.createElement('section');
    hero.className = 'hero';
    hero.innerHTML = `
        <div class="hero-text">
            <h1>محتاج صنايعي شاطر؟ 🛠️</h1>
            <h2>أفضل العروض لصيانة وإصلاح منزلك</h2>
            <p>بنربطك بأفضل الفنيين في منطقتك بضغطة زرار واحدة</p>
            <div class="hero-buttons">
                <button onclick="location.href='../html/services.html'" class="btn-primary">ابدأ الآن</button>
                <button onclick="location.href='../html/contact.html'" class="btn-secondary">تواصل معنا</button>
            </div>
        </div>
        <div class="hero-image-placeholder"></div>
    `;
    container.appendChild(hero);
}

// 2. دالة جلب البيانات (JSON)
async function fetchAndRenderCategories() {
    try {
        const response = await fetch('jsonFiles/main.json'); 
        if (!response.ok) throw new Error('لم يتم العثور على ملف الـ JSON');

        const categoriesData = await response.json();
        renderCategories(categoriesData);

    } catch (error) {
        console.error("خطأ في جلب البيانات:", error);
    }
}

// 3. قسم الخدمات الشائعة
function renderCategories(data) {
    const container = document.getElementById('home-content');
    if (!container || !data) return;

    const section = document.createElement('section');
    section.className = 'services-section';
    section.innerHTML = `
        <h2>الخدمات الشائعة</h2>
        <div id="services-grid" class="services-grid"></div>
    `;
    
    // بنضيف السيكشن بعد الهيرو وقبل "كيف يعمل الموقع"
    // لو عايز ترتيب دقيق، بنستخدم insertBefore أو نتحكم في الترتيب جوه initApp
    const howItWorks = container.querySelector('.how-it-works');
    if (howItWorks) {
        container.insertBefore(section, howItWorks);
    } else {
        container.appendChild(section);
    }

    const grid = document.getElementById('services-grid');
    grid.innerHTML = data.map(service => `
        <div class="card">
            <div class="icon-container">
                <img src="${service.icon}" alt="${service.name}">
            </div>
            <h3>${service.name}</h3>
            <p>${service.desc}</p>
        </div>
    `).join('');
}

// 4. قسم كيف يعمل الموقع
function renderHowItWorks() {
    const container = document.getElementById('home-content');
    if (!container) return;
    
    const section = document.createElement('section');
    section.className = 'how-it-works';
    section.innerHTML = `
        <h2>كيف يعمل "صنايعي"؟</h2>
        <div class="steps-grid">
            <div class="step-card">
                <div class="step-number">01</div> <h3>اختر الخدمة</h3> <p>حدد نوع الخدمة (سباكة، كهرباء...)</p>
            </div>
            <div class="step-card">
                <div class="step-number">02</div> <h3>قارن العمال</h3> <p>شوف التقييمات واختار الأنسب</p>
            </div>
            <div class="step-card">
                <div class="step-number">03</div> <h3>خلص شغلك!</h3> <p>تواصل مع الصنايعي مباشرة</p>
            </div>
        </div>
    `;
    container.appendChild(section);
}