document.addEventListener('DOMContentLoaded', () => {
    const app = document.getElementById("app");
    
    // 1. التأكد من هوية المستخدم
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if (!currentUser || currentUser.role !== 'provider') {
        alert("عفواً، هذه الصفحة مخصصة للفنيين فقط.");
        window.location.href = 'sign-in.html';
        return;
    }
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-mode');
    }

    // 2. إنشاء الحاوية الرئيسية
    const container = document.createElement("div");
    container.className = "container";

    // 3. بناء السايد بار (Sidebar)
    const sidebar = renderSidebar(currentUser.name);
    
    // 4. بناء المحتوى الرئيسي (Main Content)
    const mainContent = document.createElement("div");
    mainContent.className = "main";
    mainContent.id = "dashboard-main";

    // --- دالة لعرض الإحصائيات ---
    window.showStats = () => {
        updateActiveMenu('menu-stats');
        
        mainContent.innerHTML = `
            <div class="welcome-header">
                <h1>أهلاً بك يا ${currentUser.name} 👋</h1>
                <p>تخصصك: <span class="badge">${translateService(currentUser.service)}</span></p>
            </div>
            <div class="cards">
                ${createStatCard("إجمالي الطلبات", "25", "📋")}
                ${createStatCard("التقييم العام", `⭐ ${currentUser.rating}`, "✨")}
                ${createStatCard("أرباح الشهر", "1,200 ج.م", "💰")}
                
                <div class="card sub-card">
                    <div class="card-icon">🚀</div>
                    <h3>نوع الاشتراك</h3>
                    <p>${currentUser.subscription || 'الباقة المجانية'}</p>
                    <button class="btn-upgrade-dash" onclick="window.location.href='../html/sub.html'">تطوير الحساب</button>
                </div>
            </div>
        `;
    };

    // دالة لعرض بيانات الملف الشخصي
    window.showProfile = () => {
        updateActiveMenu('menu-profile');
        
        mainContent.innerHTML = `
            <div class="profile-container">
                <div class="profile-header">
                    <h2>👤 بيانات الملف الشخصي</h2>
                    <p>يمكنك مراجعة بياناتك المسجلة في المنصة</p>
                </div>
                
                <div class="profile-grid">
                    <div class="profile-item">
                        <label>الاسم الكامل</label>
                        <input type="text" value="${currentUser.name}" readonly>
                    </div>
                    <div class="profile-item">
                        <label>البريد الإلكتروني</label>
                        <input type="email" value="${currentUser.email}" readonly>
                    </div>
                    <div class="profile-item">
                        <label>رقم الهاتف</label>
                        <input type="text" value="${currentUser.phone || '01xxxxxxxxx'}" readonly>
                    </div>
                    <div class="profile-item">
                        <label>التخصص</label>
                        <input type="text" value="${translateService(currentUser.service)}" readonly>
                    </div>
                    <div class="profile-item">
                        <label>المنطقة</label>
                        <input type="text" value="${currentUser.area || 'غير محدد'}" readonly>
                    </div>
                    <div class="profile-item">
                        <label>حالة التفعيل</label>
                        <input type="text" value="${currentUser.approved ? 'حساب موثق' : 'تحت المراجعة'}" readonly>
                    </div>
                </div>

                <div class="profile-actions">
                    <button class="btn-primary" onclick="alert('خاصية التعديل ستتوفر قريباً!')">تعديل البيانات</button>
                </div>
            </div>
        `;
    };

    container.append(sidebar, mainContent);
    app.appendChild(container);

    // تشغيل الإحصائيات كأول شاشة
    showStats();
    
});

// --- دوال مساعدة ---

function renderSidebar(name) {
    const side = document.createElement("div");
    side.className = "side";

    side.innerHTML = `
        <h2>لوحة تحكم العامل</h2>
        <ul>
            <li onclick="showStats()" id="menu-stats">📊 الإحصائيات</li>
            <li onclick="showProfile()" id="menu-profile">👤 الملف الشخصي</li>
            <li onclick="window.location.href='../html/sub.html'" id="menu-sub" style="color: #fbbf24; font-weight: bold;">💳 باقات الاشتراك</li>
            <li onclick="alert('قريباً: عرض الطلبات الجديدة')">🛠️ طلباتي</li>
            <li onclick="alert('قريباً: تفاصيل الأرباح')">💰 الأرباح</li>
        </ul>
    `;
    return side;
}

// دالة لتغيير الشكل (Active) بين الأزرار
function updateActiveMenu(activeId) {
    const items = document.querySelectorAll('.side li');
    items.forEach(item => item.classList.remove('active'));
    const activeItem = document.getElementById(activeId);
    if (activeItem) activeItem.classList.add('active');
}

function createStatCard(title, value, icon) {
    return `
        <div class="card">
            <div class="card-icon">${icon}</div>
            <h3>${title}</h3>
            <p>${value}</p>
        </div>
    `;
}

function translateService(service) {
    const services = {
        "Plumbing": "سباك",
        "Electricity": "كهربائي",
        "Carpentry": "نجار",
        "Painting": "نقاش",
        "Cleaning": "خدمات نظافة"
    };
    return services[service] || service;
}

