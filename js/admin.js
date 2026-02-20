document.addEventListener('DOMContentLoaded', () => {
    renderSidebar();
    showStats(); // الشاشةالاساسة اللي بتفتح أول ما تدخل
});
function showStats() {
    const main = document.getElementById('main-content');
    main.innerHTML = `
        <h1 class="page-title">لوحة تحكم المشرف</h1>
        <div class="stats-grid">
            <div class="stat-card"><h3>إجمالي المستخدمين</h3><p>1,250</p></div>
            <div class="stat-card"><h3>الفنيين النشطين</h3><p>450</p></div>
            <div class="stat-card"><h3>طلبات اليوم</h3><p>89</p></div>
            <div class="stat-card"><h3>الأرباح</h3><p>15,000 ج.م</p></div>
        </div>
    `;
}


const sidebarItems = [
    { id: 'stats', text: 'الإحصائيات العامة', icon: '📊' },
    { id: 'users', text: 'إدارة المستخدمين', icon: '👥' },
    { id: 'providers', text: 'إدارة الفنيين', icon: '🛠️' },
    { id: 'services', text: 'إدارة الخدمات', icon: '💼' },
    { id: 'profits', text: 'الأرباح المحققة', icon: '💰' }
];

function renderSidebar() {
    const sidebar = document.getElementById('sidebar-container');
    if (!sidebar) return;

    sidebarItems.forEach(item => {
        const div = document.createElement('div');
        div.className = 'sidebar-item';
        div.innerHTML = `<span>${item.icon}</span> <span>${item.text}</span>`;
        
        div.onclick = () => {
            // شيل كلاس active من الكل وحطه للي اداس عليه بس
            document.querySelectorAll('.sidebar-item').forEach(el => el.classList.remove('active'));
            div.classList.add('active');
            switchTab(item.id);
        };
        sidebar.appendChild(div);
    });
}

function switchTab(tabId) {
    const main = document.getElementById('main-content');
    main.innerHTML = ''; // مسح المحتوى القديم (مرحلة المسح)
    //(بناءً على الـ ID)
    switch (tabId) {
        case 'stats':
            showStats();
            break;
        case 'users':
            showUsersManagement();
            break;
        case 'providers':
            showProvidersManagement();
            break;
        case 'services':
            showServicesManagement();
            break;
        case 'profits':
            showProfits();
            break;
        default:
            main.innerHTML = '<h1>لسة مفيش حد 🛠️</h1>';
    }
}

//عرض تفاصيل المستخدمين 
function showUsersManagement() {
    const main = document.getElementById('main-content');
    //هات بس كل البيانات 
    const allUsers = JSON.parse(localStorage.getItem('users')) || [];
    // تصفية المستخدمين العاديين فقط
    const customers = allUsers.filter(u => u.role === 'user');
    main.innerHTML = `
        <div class="content-header">
            <h1>إدارة المستخدمين (العملاء)</h1>
            <span class="badge">إجمالي العملاء: ${customers.length}</span>
        </div>
        <table class="admin-table">
            <thead>
                <tr>
                    <th>الاسم</th>
                    <th>البريد الإلكتروني</th>
                    <th>الإجراءات</th>
                </tr>
            </thead>
            <tbody>
                ${customers.map(user => `
                    <tr>
                        <td>${user.name}</td>
                        <td>${user.email}</td>
                        <td>
                            <button class="btn-delete" onclick="deleteRecord(${user.id})">حذف الحساب</button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}
// عرض تفاصيل العمال 
function showProvidersManagement() {
    const main = document.getElementById('main-content');
     //هات بس كل البيانات 
    const allUsers = JSON.parse(localStorage.getItem('users')) || [];
    // تصفية الفنيين فقط
    const providers = allUsers.filter(u => u.role === 'provider');
    main.innerHTML = `
        <div class="content-header">
            <h1>إدارة الفنيين (الصنايعية)</h1>
        </div>
        <table class="admin-table">
            <thead>
                <tr>
                    <th>الفني</th>
                    <th>المهنة</th>
                    <th>المنطقة</th>
                    <th>الحالة</th>
                    <th>الإجراءات</th>
                </tr>
            </thead>
            <tbody>
                ${providers.map(p => `
                    <tr>
                        <td>
                            <strong>${p.name}</strong><br>
                            <small>${p.phone || 'بدون رقم'}</small>
                        </td>
                        <td>${p.service || 'لم تحدد'}</td>
                        <td>${p.area || 'غير معروف'}</td>
                        <td>
                            <span class="status-badge ${p.approved ? 'active' : 'pending'}">
                                ${p.approved ? 'معتمد' : 'في الانتظار'}
                            </span>
                        </td>
                        <td>
                            ${!p.approved ? 
                                `<button class="btn-approve" onclick="toggleApproval(${p.id}, true)">تفعيل</button>` : 
                                `<button class="btn-suspend" onclick="toggleApproval(${p.id}, false)">تعطيل</button>`
                            }
                            <button class="btn-delete" onclick="deleteRecord(${p.id})">حذف</button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}


// ادارة الخدمات 

function showServicesManagement() {
    const main = document.getElementById('main-content');
    
    // سحب الخدمات من نفس المفتاح 'siteServices'
    let services = JSON.parse(localStorage.getItem('siteServices')) || [];

    main.innerHTML = `
        <div class="content-header">
            <h1>إدارة الخدمات</h1>
            <p>الخدمات التي تظهر للعملاء في الصفحة الرئيسية</p>
        </div>

        <div class="service-form-card" style="background:var(--bg-card); padding:20px; border-radius:10px; border:1px solid var(--border-color); margin-bottom:20px;">
            <h3>إضافة خدمة جديدة</h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 10px;">
                <input type="text" id="srv-name" placeholder="اسم الخدمة (مثلاً: تكييف)" class="admin-input">
                <input type="text" id="srv-img" placeholder="رابط الصورة (URL)" class="admin-input">
                <input type="text" id="srv-desc" placeholder="وصف الخدمة" class="admin-input" style="grid-column: span 2;">
            </div>
            <button class="btn-approve" onclick="addNewService()" style="width:100%; margin-top:10px;">إضافة الخدمة +</button>
        </div>

        <div class="table-container">
            <table class="admin-table">
                <thead>
                    <tr>
                        <th>الصورة</th>
                        <th>اسم الخدمة</th>
                        <th>الوصف</th>
                        <th>الإجراءات</th>
                    </tr>
                </thead>
                <tbody>
                    ${services.map((srv, index) => `
                        <tr>
                            <td><img src="${srv.imgSrc}" style="width:40px; height:40px; border-radius:5px; object-fit:cover;"></td>
                            <td><strong>${srv.name}</strong></td>
                            <td>${srv.description}</td>
                            <td>
                                <button class="btn-delete" onclick="removeService(${index})">حذف</button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

//اضافة خدمة جديدة
function addNewService() {
    const name = document.getElementById('srv-name').value.trim();
    const img = document.getElementById('srv-img').value.trim();
    const desc = document.getElementById('srv-desc').value.trim();

    if (!name || !desc) {
        alert("الاسم والوصف مطلوبين!");
        return;
    }

    // تجهيز الاوبجيكت الجديد زي ما صفحة الخدمات عايزاه بالظبط
    const newService = {
        name: name,
        description: desc,
        imgSrc: img || "https://placehold.co/600x400?text=Service", // صورة افتراضية لو مدخلش صورة
        imgAlt: name,
        href: "../html/providers.html"
    };

    let services = JSON.parse(localStorage.getItem('siteServices')) || [];
    services.push(newService);
    
    // الحفظ والتحديث
    localStorage.setItem('siteServices', JSON.stringify(services));
    showServicesManagement();
    alert("تمت إضافة الخدمة بنجاح، ستظهر الآن في صفحة الخدمات!");
}

// دالة حذف خدمة
function removeService(index) {
    if (confirm("هل أنت متأكد من حذف هذه الخدمة من الموقع؟")) {
        let services = JSON.parse(localStorage.getItem('siteServices')) || [];
        services.splice(index, 1);
        localStorage.setItem('siteServices', JSON.stringify(services));
        showServicesManagement();
    }
}

function showProfits() {
    const main = document.getElementById('main-content');
    main.innerHTML = `<h1>الأرباح المحققة</h1><p> لسة مفيش ارباح</p>`;
}


// دالة قبول أو تعطيل الفني
function toggleApproval(userId, status) {
    let allUsers = JSON.parse(localStorage.getItem('users')) || [];
    
    // البحث عن المستخدم وتعديل حالته
    allUsers = allUsers.map(u => {
        if (u.id === userId) u.approved = status;
        return u;
    });

    localStorage.setItem('users', JSON.stringify(allUsers));
    showProvidersManagement(); // إعادة رسم الجدول لتحديث البيانات
    alert(status ? "تم تفعيل حساب الفني بنجاح ✅" : "تم تعطيل الحساب");
}

// دالة الحذف النهائي
function deleteRecord(userId) {
    if (confirm("هل أنت متأكد من حذف هذا السجل نهائياً؟")) {
        let allUsers = JSON.parse(localStorage.getItem('users')) || [];
        allUsers = allUsers.filter(u => u.id !== userId);
        
        localStorage.setItem('users', JSON.stringify(allUsers));
        
        // إعادة تحميل الشاشة الحالية
        const currentTab = document.querySelector('.sidebar-item.active').innerText;
        currentTab.includes('المستخدمين') ? showUsersManagement() : showProvidersManagement();
    }
}