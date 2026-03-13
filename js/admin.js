 // ==================== نظام Activity Logs ====================
class ActivityLogger {
    constructor(maxLogs = 10) {
        this.maxLogs = maxLogs;
        this.logKey = 'adminActivityLogs';
    }

    log(action, details = '') {
        const logs = this.getLogs();
        const newLog = {
            id: Date.now(),
            action,
            details,
            timestamp: new Date().toISOString(),
            admin: getCurrentUser()?.name || 'مسؤول'
        };
        logs.unshift(newLog);
        // الاحتفاظ بآخر 10 لوجات فقط
        if (logs.length > this.maxLogs) logs.pop();
        localStorage.setItem(this.logKey, JSON.stringify(logs));
        return newLog;
    }

    getLogs() {
        const logs = localStorage.getItem(this.logKey);
        return logs ? JSON.parse(logs) : [];
    }

    clear() {
        localStorage.setItem(this.logKey, JSON.stringify([]));
    }
}

const activityLogger = new ActivityLogger();

// ==================== Global Filter State ====================
window.providersFilterStatus = 'all'; // متتبع حالة الفلتر الحالي

// ==================== Pagination System ====================
class Paginator {
    constructor(data = [], itemsPerPage = 10) {
        this.data = data;
        this.itemsPerPage = itemsPerPage;
        this.currentPage = 1;
    }

    getTotalPages() {
        return Math.ceil(this.data.length / this.itemsPerPage);
    }

    getCurrentPageData() {
        const start = (this.currentPage - 1) * this.itemsPerPage;
        const end = start + this.itemsPerPage;
        return this.data.slice(start, end);
    }

    setPage(page) {
        const maxPage = this.getTotalPages();
        if (page < 1) this.currentPage = 1;
        else if (page > maxPage) this.currentPage = maxPage;
        else this.currentPage = page;
    }

    // getPaginationHTML() {
    //     const totalPages = this.getTotalPages();
    //     if (totalPages <= 1) return '';

    //     let html = '<div class="pagination-controls">';
        
    //     // السابق
    //     html += `<button class="pagination-btn ${this.currentPage === 1 ? 'disabled' : ''}" 
    //             onclick="window.currentPaginator?.setPage(${this.currentPage - 1}); window.currentPaginator?.render()">
    //             السابق</button>`;
        
    //     // الأرقام
    //     for (let i = 1; i <= totalPages; i++) {
    //         html += `<button class="pagination-btn ${i === this.currentPage ? 'active' : ''}" 
    //                 onclick="window.currentPaginator?.setPage(${i}); window.currentPaginator?.render()">${i}</button>`;
    //     }
        
    //     // التالي
    //     html += `<button class="pagination-btn ${this.currentPage === totalPages ? 'disabled' : ''}" 
    //             onclick="window.currentPaginator?.setPage(${this.currentPage + 1}); window.currentPaginator?.render()">
    //             التالي</button>`;
        
    //     html += '</div>';
    //     return html;
    // }
    getPaginationHTML() {
    const totalPages = this.getTotalPages();
    if (totalPages <= 1) return '';

    let html = '<div class="pagination-controls">';
    
    // السابق
    const isPrevDisabled = this.currentPage === 1;
    html += `<button class="pagination-btn pagination-prev ${isPrevDisabled ? 'disabled' : ''}" 
            onclick="handlePaginationClick('prev')"
            ${isPrevDisabled ? 'disabled' : ''}>
            ← السابق</button>`;
    
    // الأرقام - في الوسط
    html += '<div class="pagination-numbers">';
    for (let i = 1; i <= totalPages; i++) {
        html += `<button class="pagination-btn pagination-number ${i === this.currentPage ? 'active' : ''}" 
                onclick="handlePaginationClick('page', ${i})">${i}</button>`;
    }
    html += '</div>';
    
    // التالي
    const isNextDisabled = this.currentPage === totalPages;
    html += `<button class="pagination-btn pagination-next ${isNextDisabled ? 'disabled' : ''}" 
            onclick="handlePaginationClick('next')"
            ${isNextDisabled ? 'disabled' : ''}>
            التالي →</button>`;
    
    html += '</div>';
    return html;
}

    render() {
        const contentType = this.currentContent;
        console.log('<i class="fa-solid fa-rotate"></i> Rendering:', contentType, 'Page:', this.currentPage);
        if (contentType === 'users') showUsersManagement();
        else if (contentType === 'providers') showProvidersManagement();
        else if (contentType === 'orders') showOrdersManagement();
        else if (contentType === 'services') showServicesManagement();
        else if (contentType === 'logs') showActivityLogs();
    }
}

// <i class="fa-solid fa-check"></i> دوال التنقل بين الصفحات - تعمل مع جميع الجداول
function handlePaginationClick(action, pageNumber = null) {
    if (!window.currentPaginator) {
        console.error('<i class="fa-solid fa-xmark"></i> currentPaginator غير معرّف!');
        return;
    }
    
    const totalPages = window.currentPaginator.getTotalPages();
    
    if (action === 'prev') {
        if (window.currentPaginator.currentPage > 1) {
            window.currentPaginator.currentPage--;
            window.currentPaginator.render();
        }
    } else if (action === 'next') {
        if (window.currentPaginator.currentPage < totalPages) {
            window.currentPaginator.currentPage++;
            window.currentPaginator.render();
        }
    } else if (action === 'page' && pageNumber) {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            window.currentPaginator.currentPage = pageNumber;
            window.currentPaginator.render();
        }
    }
    
    // التمرير لأعلى الصفحة
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ==================== Modal System ====================
function createModal(title, content, actions = []) {
    // إزالة أي modal قديم
    const existingModal = document.getElementById('admin-modal');
    if (existingModal) existingModal.remove();

    const modal = document.createElement('div');
    modal.id = 'admin-modal';
    modal.className = 'admin-modal';
    modal.innerHTML = `
        <div class="modal-backdrop"></div>
        <div class="modal-content">
            <div class="modal-header">
                <h2>${title}</h2>
                <button class="modal-close" onclick="closeModal()">✕</button>
            </div>
            <div class="modal-body">
                ${content}
            </div>
            <div class="modal-footer">
                ${actions.map(action => `
                    <button class="btn-modal ${action.class || 'primary'}" 
                            onclick="${action.onclick}">${action.text}</button>
                `).join('')}
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // إغلاق عند النقر على الخلفية
    modal.querySelector('.modal-backdrop').onclick = closeModal;
}

function closeModal() {
    const modal = document.getElementById('admin-modal');
    if (modal) {
        modal.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => modal.remove(), 300);
    }
}

// ==================== Modal - Confirmation ====================
function showConfirmation(title, message, onConfirm, onCancel = null) {
    createModal(title, `<p class="confirmation-message">${message}</p>`, [
        { text: 'إلغاء', class: 'secondary', onclick: 'closeModal()' },
        { text: 'تأكيد', class: 'danger', onclick: onConfirm }
    ]);
}

// ==================== Modal - Edit User ====================
function showEditUserModal(user) {
    const content = `
        <div class="form-group">
            <label>الاسم</label>
            <input type="text" id="edit-name" value="${user.name}" class="admin-input">
        </div>
        <div class="form-group">
            <label>البريد الإلكتروني</label>
            <input type="email" id="edit-email" value="${user.email}" class="admin-input" disabled>
        </div>
        <div class="form-group">
            <label>الهاتف</label>
            <input type="tel" id="edit-phone" value="${user.phone || ''}" class="admin-input">
        </div>
        ${user.role === 'provider' ? `
            <div class="form-group">
                <label>التخصص</label>
                <input type="text" id="edit-service" value="${user.service || ''}" class="admin-input">
            </div>
            <div class="form-group">
                <label>المنطقة</label>
                <input type="text" id="edit-area" value="${user.area || ''}" class="admin-input">
            </div>
        ` : ''}
    `;

    createModal(`تعديل بيانات ${user.name}`, content, [
        { text: 'إلغاء', class: 'secondary', onclick: 'closeModal()' },
        { text: 'حفظ التغييرات', class: 'primary', onclick: `saveUserChanges(${user.id})` }
    ]);
}

// ==================== Save User Changes ====================
function saveUserChanges(userId) {
    const users = getUsers();
    const user = users.find(u => u.id === userId);
    
    if (!user) return notificationSystem.error('المستخدم غير موجود');

    user.name = document.getElementById('edit-name').value;
    user.phone = document.getElementById('edit-phone').value;
    
    if (user.role === 'provider') {
        user.service = document.getElementById('edit-service').value;
        user.area = document.getElementById('edit-area').value;
    }

    saveUsers(users);
    activityLogger.log('تعديل مستخدم', `تم تعديل بيانات ${user.name}`);
    notificationSystem.success('تم حفظ التغييرات بنجاح <i class="fa-solid fa-check"></i>');
    closeModal();

    // إعادة تحميل القسم الحالي
    const activeTab = document.querySelector('.sidebar-item.active')?.getAttribute('data-tab');
    if (activeTab) switchTab(activeTab);
}

// ==================== Initialize Admin Dashboard ====================
document.addEventListener('DOMContentLoaded', () => {
    // <i class="fa-solid fa-check"></i> التحقق من صلاحية المسؤول
    const currentUser = getCurrentUser();
    
    if (!currentUser || currentUser.role !== 'admin') {
        window.location.href = '../html/sign-in.html';
        throw new Error("غير مصرح - يجب أن تكون مسؤول");
    }

    renderSidebar();
    updatePendingBadges();
    showStats(); // الشاشة الأساسية اللي بتفتح أول ما تدخل

    // === الاستماع لتحديثات الرسائل والتواصل ===
    window.addEventListener('contactMessagesChanged', () => {
        updatePendingBadges();
    });

    window.addEventListener('contactInfoChanged', () => {
        showToast('<i class="fa-solid fa-check"></i> تم تحديث معلومات التواصل', 'success', 2000);
    });
});

// <i class="fa-solid fa-check"></i> حساب الإحصائيات الديناميكية المحسّنة
function getStats() {
    const allUsers = getUsers();
    const allOrders = getOrders();
    const pendingProviders = allUsers.filter(u => u.role === 'provider' && !u.approved);
    
    return {
        totalUsers: allUsers.length,
        totalProviders: allUsers.filter(u => u.role === 'provider').length,
        totalCustomers: allUsers.filter(u => u.role === 'user').length,
        pendingProviders: pendingProviders.length,
        totalOrders: allOrders.length,
        completedOrders: allOrders.filter(o => o.status === 'completed').length,
        pendingOrders: allOrders.filter(o => o.status === 'pending').length,
        rejectedOrders: allOrders.filter(o => o.status === 'rejected').length,
        acceptedOrders: allOrders.filter(o => o.status === 'accepted').length,
        totalRevenue: allOrders
            .filter(o => o.status === 'completed')
            .reduce((sum, o) => sum + (parseFloat(o.price) || 0), 0)
    };
}

// <i class="fa-solid fa-check"></i> عرض الإحصائيات المحسّنة
function showStats() {
    const main = document.getElementById('main-content');
    const stats = getStats();
    
    main.innerHTML = `
        <div class="page-header">
            <h1 class="page-title"><i class="fa-solid fa-chart-bar"></i> لوحة تحكم المشرف</h1>
            <p class="page-subtitle">مراقبة شاملة للمنصة وأداء النظام</p>
        </div>
        
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-icon" style="color: #3b82f6;"><i class="fa-solid fa-users"></i></div>
                <h3>إجمالي المستخدمين</h3>
                <p class="stat-number">${stats.totalUsers}</p>
                <small>المستخدمين والفنيين</small>
            </div>
            
            <div class="stat-card">
                <div class="stat-icon" style="color: #22c55e;"><i class="fa-solid fa-screwdriver-wrench"></i></div>
                <h3>الفنيين النشطين</h3>
                <p class="stat-number">${stats.totalProviders}</p>
                <small>الفنيين المعتمدين</small>
            </div>
            
            <div class="stat-card">
                <div class="stat-icon" style="color: #ef4444;"><i class="fa-solid fa-clock"></i></div>
                <h3>فنيين بالانتظار</h3>
                <p class="stat-number warning">${stats.pendingProviders}</p>
                <small>في انتظار التفعيل</small>
            </div>
            
            <div class="stat-card">
                <div class="stat-icon" style="color: #f59e0b;"><i class="fa-solid fa-box"></i></div>
                <h3>إجمالي الطلبات</h3>
                <p class="stat-number">${stats.totalOrders}</p>
                <small>كل الطلبات</small>
            </div>
            
            <div class="stat-card">
                <div class="stat-icon" style="color: #10b981;"><i class="fa-solid fa-check"></i></div>
                <h3>طلبات مكتملة</h3>
                <p class="stat-number">${stats.completedOrders}</p>
                <small>الطلبات المنجزة</small>
            </div>
            
            <div class="stat-card">
                <div class="stat-icon" style="color: #8b5cf6;"><i class="fa-solid fa-coins"></i></div>
                <h3>الإيرادات</h3>
                <p class="stat-number" style="color: #10b981;">${stats.totalRevenue.toFixed(2)} ج.م</p>
                <small>من الطلبات المكتملة</small>
            </div>
        </div>
        
        <div class="quick-actions">
            <button class="action-btn" onclick="switchTab('users')"><i class="fa-solid fa-users"></i> إدارة المستخدمين</button>
            <button class="action-btn" onclick="switchTab('providers')"><i class="fa-solid fa-screwdriver-wrench"></i> إدارة الفنيين</button>
            <button class="action-btn" onclick="switchTab('orders')"><i class="fa-solid fa-box"></i> إدارة الطلبات</button>
            <button class="action-btn" onclick="switchTab('logs')"><i class="fa-solid fa-list"></i> سجل العمليات</button>
        </div>
    `;
}

const sidebarItems = [
    { id: 'stats', text: 'الإحصائيات العامة', icon: '<i class="fa-solid fa-chart-bar"></i>', badge: false },
    { id: 'users', text: 'إدارة المستخدمين', icon: '<i class="fa-solid fa-users"></i>', badge: false },
    { id: 'providers', text: 'إدارة الفنيين', icon: '<i class="fa-solid fa-screwdriver-wrench"></i>', badge: true },
    { id: 'orders', text: 'إدارة الطلبات', icon: '<i class="fa-solid fa-box"></i>', badge: false },
    { id: 'services', text: 'إدارة الخدمات', icon: '<i class="fa-solid fa-briefcase"></i>', badge: false },
    { id: 'logs', text: 'سجل العمليات', icon: '<i class="fa-solid fa-list"></i>', badge: false },
    { id: 'messages', text: 'الرسائل من الجمهور', icon: '<i class="fa-solid fa-comments"></i>', badge: true },
    { id: 'contact-settings', text: 'إعدادات التواصل', icon: '<i class="fa-solid fa-gear"></i>', badge: false },
    { id: 'profits', text: 'الأرباح المحققة', icon: '<i class="fa-solid fa-coins"></i>', badge: false }
];

// <i class="fa-solid fa-check"></i> دالة تحديث الـ Badges وحساب البيانات الصحيحة
function updatePendingBadges() {
    const allUsers = getUsers();
    const allProviders = allUsers.filter(u => u.role === 'provider');
    const pendingCount = allProviders.filter(u => !u.approved).length;
    
    const providersItem = document.querySelector('[data-tab="providers"]');
    if (providersItem) {
        let badge = providersItem.querySelector('.badge-counter');
        if (!badge && pendingCount > 0) {
            badge = document.createElement('span');
            badge.className = 'badge-counter';
            providersItem.appendChild(badge);
        }
        if (badge) {
            badge.textContent = pendingCount;
            badge.style.display = pendingCount > 0 ? 'flex' : 'none';
        }
    }

    // === تحديث badge الرسائل الجديدة ===
    const messages = getContactMessages();
    const newMessagesCount = messages.filter(m => m.status === 'new').length;
    const messagesItem = document.querySelector('[data-tab="messages"]');
    if (messagesItem) {
        let msgBadge = messagesItem.querySelector('.badge-counter');
        if (!msgBadge && newMessagesCount > 0) {
            msgBadge = document.createElement('span');
            msgBadge.className = 'badge-counter';
            messagesItem.appendChild(msgBadge);
        }
        if (msgBadge) {
            msgBadge.textContent = newMessagesCount;
            msgBadge.style.display = newMessagesCount > 0 ? 'flex' : 'none';
        }
    }
}

// <i class="fa-solid fa-check"></i> رسم السايدبار مع الـ Badges
function renderSidebar() {
    const sidebar = document.getElementById('sidebar-container');
    if (!sidebar) return;

    sidebarItems.forEach(item => {
        const div = document.createElement('div');
        div.className = 'sidebar-item';
        div.setAttribute('data-tab', item.id);
        
        const content = `<span class="sidebar-icon">${item.icon}</span> 
                         <span class="sidebar-text">${item.text}</span>`;
        
        if (item.badge) {
            div.innerHTML = content + '<span class="badge-counter" style="display:none;"></span>';
        } else {
            div.innerHTML = content;
        }
        
        div.onclick = () => {
            document.querySelectorAll('.sidebar-item').forEach(el => el.classList.remove('active'));
            div.classList.add('active');
            switchTab(item.id);
        };
        
        sidebar.appendChild(div);
    });
    
    // تفعيل التبويب الأول بشكل افتراضي
    document.querySelector('[data-tab="stats"]')?.classList.add('active');
    updatePendingBadges();
}

function switchTab(tabId) {
    const main = document.getElementById('main-content');
    main.innerHTML = '<div class="loading">جاري التحميل...</div>';
    
    setTimeout(() => {
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
            case 'orders':
                showOrdersManagement();
                break;
            case 'services':
                showServicesManagement();
                break;
            case 'logs':
                showActivityLogs();
                break;
            case 'messages':
                showContactMessages();
                break;
            case 'contact-settings':
                showContactSettings();
                break;
            case 'profits':
                showProfits();
                break;
            default:
                main.innerHTML = '<h1><i class="fa-solid fa-xmark"></i> لم يتم العثور على الصفحة</h1>';
        }
    }, 200);
}

//<i class="fa-solid fa-check"></i> عرض تفاصيل المستخدمين مع الـ Modals المحسّنة
function showUsersManagement() {
    const main = document.getElementById('main-content');
    const allUsers = getUsers();
    const customers = allUsers.filter(u => u.role === 'user');
    
    // استخدام Paginator
    const paginator = new Paginator(customers, 10);
    window.currentPaginator = paginator;
    window.currentPaginator.currentContent = 'users';

    main.innerHTML = `
        <div class="page-header">
            <h1 class="page-title"><i class="fa-solid fa-users"></i> إدارة المستخدمين (العملاء)</h1>
            <div class="header-stats">
                <span class="stat-badge">إجمالي العملاء: <strong>${customers.length}</strong></span>
            </div>
        </div>

        <div class="search-bar">
            <input type="text" id="search-users" placeholder="🔍 ابحث عن عميل..." class="admin-input" 
                   onkeyup="filterUsersTable()">
        </div>

        ${customers.length === 0 ? `
            <div class="empty-state">
                <p><i class="fa-solid fa-sparkles"></i> لا توجد عملاء حالياً</p>
            </div>
        ` : `
            <div class="table-container">
                <table class="admin-table">
                    <thead>
                        <tr>
                            <th>الاسم</th>
                            <th>البريد الإلكتروني</th>
                            <th>الهاتف</th>
                            <th>تاريخ التسجيل</th>
                            <th>الإجراءات</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${paginator.getCurrentPageData().map(user => `
                            <tr>
                                <td><strong>${user.name}</strong></td>
                                <td>${user.email}</td>
                                <td>${user.phone || '---'}</td>
                                <td>${user.createdAt ? new Date(user.createdAt).toLocaleDateString('ar-EG') : '---'}</td>
                                <td class="action-buttons">
                                    <button class="action-btn-icon edit" onclick="showEditUserModal({id:${user.id}, name:'${user.name}', email:'${user.email}', phone:'${user.phone || ''}', role:'${user.role}'})" title="تعديل"><i class="fa-solid fa-pen"></i></button>
                                    <button class="action-btn-icon delete" onclick="deleteUserWithConfirmation(${user.id})" title="حذف"><i class="fa-solid fa-trash"></i></button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
            ${paginator.getPaginationHTML()}
        `}
    `;
}

// <i class="fa-solid fa-check"></i> حذف مستخدم مع نافذة تأكيد
function deleteUserWithConfirmation(userId) {
    const users = getUsers();
    const user = users.find(u => u.id === userId);
    
    if (!user) return notificationSystem.error('المستخدم غير موجود');

    showConfirmation(
        '⚠️ تأكيد الحذف',
        `هل أنت متأكد من حذف العميل <strong>${user.name}</strong> نهائياً؟<br>
         هذه العملية لا يمكن التراجع عنها.`,
        `deleteUserPermanently(${userId})`
    );
}

function deleteUserPermanently(userId) {
    let allUsers = getUsers();
    const user = allUsers.find(u => u.id === userId);
    
    if (user.id === getCurrentUser().id) {
        notificationSystem.error('<i class="fa-solid fa-xmark"></i> لا يمكن حذف حسابك أنت!');
        return;
    }

    allUsers = allUsers.filter(u => u.id !== userId);
    saveUsers(allUsers);
    activityLogger.log('حذف مستخدم', `تم حذف المستخدم ${user.name}`);
    notificationSystem.success(`تم حذف العميل ${user.name} بنجاح <i class="fa-solid fa-check"></i>`);
    closeModal();
    showUsersManagement();
}

// <i class="fa-solid fa-check"></i> عرض تفاصيل الفنيين المحسّن مع الفلترة الديناميكية - بدون pagination
function showProvidersManagement() {
    const main = document.getElementById('main-content');
    const allUsers = getUsers();
    const allProviders = allUsers.filter(u => u.role === 'provider');
    
    // تقسيم حسب الحالة
    const approved = allProviders.filter(p => p.approved);
    const pending = allProviders.filter(p => !p.approved);
    
    // تطبيق الفلتر الحالي
    let filteredProviders = allProviders;
    if (window.providersFilterStatus === 'approved') {
        filteredProviders = approved;
    } else if (window.providersFilterStatus === 'pending') {
        filteredProviders = pending;
    }

    main.innerHTML = `
        <div class="page-header">
            <h1 class="page-title"><i class="fa-solid fa-screwdriver-wrench"></i> إدارة الفنيين (الصنايعية)</h1>
            <div class="header-stats">
                <span class="stat-badge">الإجمالي: <strong>${allProviders.length}</strong></span>
                <span class="stat-badge approved">نشط: <strong>${approved.length}</strong></span>
                <span class="stat-badge pending">بالانتظار: <strong>${pending.length}</strong></span>
            </div>
        </div>

        <div class="filter-tabs">
            <button class="filter-tab ${window.providersFilterStatus === 'all' ? 'active' : ''}" onclick="filterProvidersByStatus('all')">الكل (${allProviders.length})</button>
            <button class="filter-tab ${window.providersFilterStatus === 'approved' ? 'active' : ''}" onclick="filterProvidersByStatus('approved')">النشطون (${approved.length})</button>
            <button class="filter-tab ${window.providersFilterStatus === 'pending' ? 'active' : ''}" onclick="filterProvidersByStatus('pending')">بالانتظار (${pending.length})</button>
        </div>

        ${filteredProviders.length === 0 ? `
            <div class="empty-state">
                <p><i class="fa-solid fa-sparkles"></i> ${window.providersFilterStatus === 'approved' ? 'لا توجد فنيين نشطين' : window.providersFilterStatus === 'pending' ? 'لا توجد فنيين بالانتظار' : 'لا توجد فنيين مسجلين حالياً'}</p>
            </div>
        ` : `
            <div class="table-container">
                <table class="admin-table">
                    <thead>
                        <tr>
                            <th>الفني</th>
                            <th>المهنة</th>
                            <th>المنطقة</th>
                            <th>الهاتف</th>
                            <th>الحالة</th>
                            <th>تاريخ التسجيل</th>
                            <th>الإجراءات</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${filteredProviders.map(p => `
                            <tr>
                                <td><strong>${p.name}</strong></td>
                                <td><span class="service-tag">${p.service || '---'}</span></td>
                                <td>${p.area || '---'}</td>
                                <td>${p.phone || '---'}</td>
                                <td>
                                    <span class="status-badge ${p.approved ? 'approved' : 'pending'}">
                                        ${p.approved ? '<i class="fa-solid fa-check"></i> معتمد' : '<i class="fa-solid fa-clock"></i> في الانتظار'}
                                    </span>
                                </td>
                                <td>${p.createdAt ? new Date(p.createdAt).toLocaleDateString('ar-EG') : '---'}</td>
                                <td class="action-buttons">
                                    <button class="action-btn-icon edit" onclick="showEditUserModal({id:${p.id}, name:'${p.name}', email:'${p.email}', phone:'${p.phone || ''}', service:'${p.service || ''}', area:'${p.area || ''}', role:'${p.role}'})\" title="تعديل"><i class="fa-solid fa-pen"></i></button>
                                    ${!p.approved ? 
                                        `<button class="action-btn-icon approve" onclick="toggleProviderApproval(${p.id}, true)" title="تفعيل"><i class="fa-solid fa-check"></i></button>` : 
                                        `<button class="action-btn-icon suspend" onclick="toggleProviderApproval(${p.id}, false)" title="تعطيل">⛔</button>`
                                    }
                                    <button class="action-btn-icon delete" onclick="deleteProviderWithConfirmation(${p.id})" title="حذف"><i class="fa-solid fa-trash"></i></button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `}
    `;
}

// <i class="fa-solid fa-check"></i> تصفية الفنيين بناءً على الحالة - ديناميكية بالكامل
function filterProvidersByStatus(status) {
    // تحديث متتبع الفلتر الحالي
    window.providersFilterStatus = status;
    
    // إعادة تحميل الجدول كاملاً مع الفلتر الجديد
    showProvidersManagement();
}

// <i class="fa-solid fa-check"></i> تفعيل/تعطيل الفني مع التأكيد
function toggleProviderApproval(userId, status) {
    const users = getUsers();
    const user = users.find(u => u.id === userId);
    
    if (!user) return notificationSystem.error('الفني غير موجود');

    showConfirmation(
        status ? '<i class="fa-solid fa-check"></i> تفعيل الحساب' : '⛔ تعطيل الحساب',
        status ? 
            `هل تريد تفعيل حساب الفني <strong>${user.name}</strong>؟` :
            `هل تريد تعطيل حساب الفني <strong>${user.name}</strong>؟`,
        `confirmProviderApproval(${userId}, ${status})`
    );
}

function confirmProviderApproval(userId, status) {
    let allUsers = getUsers();
    const user = allUsers.find(u => u.id === userId);
    
    if (!user) return;
    
    user.approved = status;
    saveUsers(allUsers);
    
    activityLogger.log(
        status ? 'تفعيل فني' : 'تعطيل فني',
        `${status ? 'تم تفعيل' : 'تم تعطيل'} حساب الفني ${user.name}`
    );
    
    notificationSystem.success(
        `${status ? 'تم تفعيل' : 'تم تعطيل'} حساب الفني ${user.name} بنجاح <i class="fa-solid fa-check"></i>`
    );
    closeModal();
    
    // تحديث الـ badges والبيانات
    updatePendingBadges();
    window.providersFilterStatus = 'all';
    showProvidersManagement();
}

// <i class="fa-solid fa-check"></i> حذف فني مع نافذة تأكيد
function deleteProviderWithConfirmation(userId) {
    const users = getUsers();
    const user = users.find(u => u.id === userId);
    
    if (!user) return notificationSystem.error('الفني غير موجود');

    showConfirmation(
        '⚠️ تأكيد الحذف',
        `هل أنت متأكد من حذف الفني <strong>${user.name}</strong> نهائياً؟<br>
         سيتم حذف جميع بيانات الفني والطلبات المرتبطة به.`,
        `deleteProviderPermanently(${userId})`
    );
}

function deleteProviderPermanently(userId) {
    let allUsers = getUsers();
    let allOrders = getOrders();
    const user = allUsers.find(u => u.id === userId);
    
    if (!user) return;

    allUsers = allUsers.filter(u => u.id !== userId);
    allOrders = allOrders.filter(o => o.providerId !== userId);
    
    saveUsers(allUsers);
    saveOrders(allOrders);
    
    activityLogger.log('حذف فني', `تم حذف الفني ${user.name} وجميع طلباته`);
    notificationSystem.success(`تم حذف الفني ${user.name} بنجاح <i class="fa-solid fa-check"></i>`);
    closeModal();
    
    // تحديث الـ badges والبيانات
    updatePendingBadges();
    window.providersFilterStatus = 'all';
    showProvidersManagement();
}


// <i class="fa-solid fa-check"></i> إدارة الطلبات الشاملة (NEW)
function showOrdersManagement() {
    const main = document.getElementById('main-content');
    const allOrders = getOrders();
    const users = getUsers();
    
    // دالة للحصول على اسم المستخدم من ID
    const getUserName = (id) => {
        const user = users.find(u => u.id === id);
        return user ? user.name : 'غير معروف';
    };

    // استخدام Paginator
    const paginator = new Paginator(allOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)), 10);
    window.currentPaginator = paginator;
    window.currentPaginator.currentContent = 'orders';

    const stats = {
        total: allOrders.length,
        pending: allOrders.filter(o => o.status === 'pending').length,
        accepted: allOrders.filter(o => o.status === 'accepted').length,
        completed: allOrders.filter(o => o.status === 'completed').length,
        rejected: allOrders.filter(o => o.status === 'rejected').length
    };

    main.innerHTML = `
        <div class="page-header">
            <h1 class="page-title"><i class="fa-solid fa-box"></i> إدارة الطلبات</h1>
            <div class="header-stats">
                <span class="stat-badge">الإجمالي: <strong>${stats.total}</strong></span>
                <span class="stat-badge pending"><i class="fa-solid fa-clock"></i> ${stats.pending}</span>
                <span class="stat-badge accepted"><i class="fa-solid fa-thumbs-up"></i> ${stats.accepted}</span>
                <span class="stat-badge completed"><i class="fa-solid fa-check"></i> ${stats.completed}</span>
                <span class="stat-badge rejected"><i class="fa-solid fa-xmark"></i> ${stats.rejected}</span>
            </div>
        </div>

        ${allOrders.length === 0 ? `
            <div class="empty-state">
                <p><i class="fa-solid fa-sparkles"></i> لا توجد طلبات حالياً</p>
            </div>
        ` : `
            <div class="table-container">
                <table class="admin-table">
                    <thead>
                        <tr>
                            <th>رقم الطلب</th>
                            <th>العميل</th>
                            <th>الفني</th>
                            <th>الخدمة</th>
                            <th>السعر</th>
                            <th>الحالة</th>
                            <th>التاريخ</th>
                            <th>الإجراءات</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${paginator.getCurrentPageData().map(order => `
                            <tr>
                                <td class="order-id">#${order.id}</td>
                                <td>${getUserName(order.userId)}</td>
                                <td>${order.providerId ? getUserName(order.providerId) : '---'}</td>
                                <td><span class="service-tag">${order.service || '---'}</span></td>
                                <td class="price">${order.price ? order.price + ' ج.م' : '---'}</td>
                                <td>
                                    <span class="status-badge ${order.status}">
                                        ${getOrderStatusBadge(order.status)}
                                    </span>
                                </td>
                                <td>${new Date(order.createdAt).toLocaleDateString('ar-EG')}</td>
                                <td class="action-buttons">
                                    <button class="action-btn-icon edit" onclick="showOrderDetailsModal(${order.id})" title="عرض التفاصيل"><i class="fa-solid fa-eye"></i></button>
                                    <button class="action-btn-icon edit" onclick="showChangeOrderStatusModal(${order.id})" title="تغيير الحالة"><i class="fa-solid fa-rotate"></i></button>
                                    <button class="action-btn-icon delete" onclick="deleteOrderWithConfirmation(${order.id})" title="حذف"><i class="fa-solid fa-trash"></i></button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
            ${paginator.getPaginationHTML()}
        `}
    `;
}

// <i class="fa-solid fa-check"></i> عرض تفاصيل الطلب
function showOrderDetailsModal(orderId) {
    const orders = getOrders();
    const users = getUsers();
    const order = orders.find(o => o.id === orderId);
    
    if (!order) return notificationSystem.error('الطلب غير موجود');

    const customer = users.find(u => u.id === order.userId);
    const provider = users.find(u => u.id === order.providerId);

    const content = `
        <div class="order-details">
            <div class="detail-row">
                <strong>رقم الطلب:</strong>
                <span>#${order.id}</span>
            </div>
            <div class="detail-row">
                <strong>العميل:</strong>
                <span>${customer ? customer.name : 'غير معروف'}</span>
            </div>
            <div class="detail-row">
                <strong>الفني:</strong>
                <span>${provider ? provider.name : 'لم يتم التعيين بعد'}</span>
            </div>
            <div class="detail-row">
                <strong>الخدمة:</strong>
                <span>${order.service}</span>
            </div>
            <div class="detail-row">
                <strong>السعر:</strong>
                <span class="price">${order.price} ج.م</span>
            </div>
            <div class="detail-row">
                <strong>الحالة:</strong>
                <span class="status-badge ${order.status}">${getOrderStatusBadge(order.status)}</span>
            </div>
            <div class="detail-row">
                <strong>الموقع:</strong>
                <span>${order.location || 'لم يحدد'}</span>
            </div>
            <div class="detail-row">
                <strong>الوصف:</strong>
                <span>${order.description || '---'}</span>
            </div>
            <div class="detail-row">
                <strong>تاريخ الطلب:</strong>
                <span>${new Date(order.createdAt).toLocaleDateString('ar-EG')}</span>
            </div>
        </div>
    `;

    createModal('<i class="fa-solid fa-list"></i> تفاصيل الطلب', content, [
        { text: 'إغلاق', class: 'secondary', onclick: 'closeModal()' }
    ]);
}

// <i class="fa-solid fa-check"></i> تغيير حالة الطلب
function showChangeOrderStatusModal(orderId) {
    const statuses = [
        { value: 'pending', label: '<i class="fa-solid fa-clock"></i> قيد الانتظار' },
        { value: 'accepted', label: '<i class="fa-solid fa-thumbs-up"></i> مقبول' },
        { value: 'completed', label: '<i class="fa-solid fa-check"></i> مكتمل' },
        { value: 'rejected', label: '<i class="fa-solid fa-xmark"></i> مرفوض' }
    ];

    const content = `
        <div class="form-group">
            <label>اختر الحالة الجديدة:</label>
            <select id="order-status-select" class="admin-input">
                ${statuses.map(s => `<option value="${s.value}">${s.label}</option>`).join('')}
            </select>
        </div>
        <div class="form-group">
            <label>ملاحظات (اختيارية)</label>
            <textarea id="order-notes" class="admin-input" placeholder="أضف ملاحظات..." style="resize: vertical; height: 80px;"></textarea>
        </div>
    `;

    createModal('<i class="fa-solid fa-rotate"></i> تغيير حالة الطلب', content, [
        { text: 'إلغاء', class: 'secondary', onclick: 'closeModal()' },
        { text: 'حفظ التغييرات', class: 'primary', onclick: `updateOrderStatus(${orderId})` }
    ]);
}

// <i class="fa-solid fa-check"></i> تحديث حالة الطلب
function updateOrderStatus(orderId) {
    const newStatus = document.getElementById('order-status-select').value;
    const notes = document.getElementById('order-notes').value;
    
    const orders = getOrders();
    const order = orders.find(o => o.id === orderId);
    
    if (!order) return notificationSystem.error('الطلب غير موجود');

    order.status = newStatus;
    if (notes) order.notes = notes;
    order.updatedAt = new Date().toISOString();
    
    saveOrders(orders);
    activityLogger.log('تغيير حالة طلب', `تم تغيير حالة الطلب #${orderId} إلى ${getOrderStatusBadge(newStatus)}`);
    notificationSystem.success('تم تحديث حالة الطلب بنجاح <i class="fa-solid fa-check"></i>');
    closeModal();
    showOrdersManagement();
}

// <i class="fa-solid fa-check"></i> حذف طلب مع تأكيد
function deleteOrderWithConfirmation(orderId) {
    showConfirmation(
        '⚠️ تأكيد الحذف',
        `هل أنت متأكد من حذف الطلب <strong>#${orderId}</strong>؟<br>
         هذه العملية لا يمكن التراجع عنها.`,
        `deleteOrderPermanently(${orderId})`
    );
}

function deleteOrderPermanently(orderId) {
    let allOrders = getOrders();
    allOrders = allOrders.filter(o => o.id !== orderId);
    
    saveOrders(allOrders);
    activityLogger.log('حذف طلب', `تم حذف الطلب #${orderId}`);
    notificationSystem.success('تم حذف الطلب بنجاح <i class="fa-solid fa-check"></i>');
    closeModal();
    showOrdersManagement();
}

// <i class="fa-solid fa-check"></i> سجل العمليات (NEW)
function showActivityLogs() {
    const main = document.getElementById('main-content');
    const logs = activityLogger.getLogs();
    
    const paginator = new Paginator(logs, 10);
    window.currentPaginator = paginator;
    window.currentPaginator.currentContent = 'logs';

    main.innerHTML = `
        <div class="page-header">
            <h1 class="page-title"><i class="fa-solid fa-list"></i> سجل العمليات</h1>
            <div class="header-stats">
                <span class="stat-badge">إجمالي العمليات: <strong>${logs.length}</strong></span>
            </div>
            <button class="btn-primary" onclick="clearActivityLogs()" style="margin-top: 10px;"><i class="fa-solid fa-trash"></i> مسح السجل</button>
        </div>

        ${logs.length === 0 ? `
            <div class="empty-state">
                <p><i class="fa-solid fa-sparkles"></i> لا توجد عمليات مسجلة بعد</p>
            </div>
        ` : `
            <div class="logs-timeline">
                ${paginator.getCurrentPageData().map(log => `
                    <div class="log-item">
                        <div class="log-time">${new Date(log.timestamp).toLocaleTimeString('ar-EG')}</div>
                        <div class="log-content">
                            <div class="log-action">
                                <strong>${log.action}</strong>
                                <span class="log-admin">بواسطة ${log.admin}</span>
                            </div>
                            <p class="log-details">${log.details}</p>
                        </div>
                        <div class="log-date">${new Date(log.timestamp).toLocaleDateString('ar-EG')}</div>
                    </div>
                `).join('')}
            </div>
            ${paginator.getPaginationHTML()}
        `}
    `;
}

function clearActivityLogs() {
    showConfirmation(
        '⚠️ تأكيد المسح',
        'هل أنت متأكد من مسح جميع السجلات؟ هذه العملية لا يمكن التراجع عنها.',
        'confirmClearLogs()'
    );
}

function confirmClearLogs() {
    activityLogger.clear();
    notificationSystem.success('تم مسح السجلات بنجاح <i class="fa-solid fa-check"></i>');
    closeModal();
    showActivityLogs();
}

// <i class="fa-solid fa-check"></i> إدارة الخدمات المحسّنة
function showServicesManagement() {
    const main = document.getElementById('main-content');
    
    // <i class="fa-solid fa-check"></i> استخدم getServices من logic.js
    let services = getServices();

    // استخدام Paginator
    const paginator = new Paginator(services, 10);
    window.currentPaginator = paginator;
    window.currentPaginator.currentContent = 'services';

    main.innerHTML = `
        <div class="page-header">
            <h1 class="page-title"><i class="fa-solid fa-briefcase"></i> إدارة الخدمات</h1>
            <p class="page-subtitle">الخدمات التي تظهر للعملاء في الصفحة الرئيسية</p>
            <div class="header-stats">
                <span class="stat-badge">إجمالي الخدمات: <strong>${services.length}</strong></span>
            </div>
        </div>

        <div class="service-form-card">
            <h3>➕ إضافة خدمة جديدة</h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-top: 15px;">
                <div class="form-group">
                    <label>اسم الخدمة (عربي)</label>
                    <input type="text" id="srv-name" placeholder="مثلاً: تكييف" class="admin-input">
                </div>
                <div class="form-group">
                    <label>اسم الخدمة (English)</label>
                    <input type="text" id="srv-english-name" placeholder="مثلاً: AC Repair" class="admin-input">
                </div>
                <div class="form-group">
                    <label>رابط الصورة (URL)</label>
                    <input type="text" id="srv-img" placeholder="https://..." class="admin-input">
                </div>
                <div class="form-group" style="grid-column: span 2;">
                    <label>وصف الخدمة</label>
                    <textarea id="srv-desc" placeholder="وصف قصير للخدمة" class="admin-input" style="height: 80px;"></textarea>
                </div>
            </div>
            <button class="btn-primary" onclick="addNewService()" style="width: 100%; margin-top: 10px;"><i class="fa-solid fa-check"></i> إضافة الخدمة</button>
        </div>

        ${services.length === 0 ? `
            <div class="empty-state">
                <p><i class="fa-solid fa-sparkles"></i> لا توجد خدمات حالياً</p>
            </div>
        ` : `
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
                        ${paginator.getCurrentPageData().map((srv, index) => `
                            <tr>
                                <td>
                                    <img src="${srv.imgSrc}" style="width: 50px; height: 50px; border-radius: 8px; object-fit: cover;" 
                                         onerror="this.src='https://placehold.co/50x50?text=No+Image'">
                                </td>
                                <td><strong>${srv.name}</strong></td>
                                <td>${srv.description.substring(0, 50)}...</td>
                                <td class="action-buttons">
                                    <button class="action-btn-icon edit" onclick="showEditServiceModal(${index})" title="تعديل"><i class="fa-solid fa-pen"></i></button>
                                    <button class="action-btn-icon delete" onclick="deleteServiceWithConfirmation(${index})" title="حذف"><i class="fa-solid fa-trash"></i></button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
            ${paginator.getPaginationHTML()}
        `}
    `;
}

// <i class="fa-solid fa-check"></i> إضافة خدمة جديدة
function addNewService() {
    const name = document.getElementById('srv-name').value.trim();
    const englishName = document.getElementById('srv-english-name').value.trim();
    const img = document.getElementById('srv-img').value.trim();
    const desc = document.getElementById('srv-desc').value.trim();

    if (!name || !englishName || !desc) {
        notificationSystem.error('<i class="fa-solid fa-xmark"></i> الاسم (عربي وإنجليزي) والوصف مطلوبان!');
        return;
    }

    let services = getServices();  // <i class="fa-solid fa-check"></i> استخدم getServices من logic.js
    
    // تحقق من عدم تكرار الخدمة
    if (services.find(s => s.name.toLowerCase() === name.toLowerCase())) {
        notificationSystem.error('<i class="fa-solid fa-xmark"></i> هذه الخدمة موجودة بالفعل!');
        return;
    }

    const newService = {
        name: name,
        englishName: englishName,
        description: desc,
        imgSrc: img || "https://placehold.co/600x400?text=" + encodeURIComponent(name),
        imgAlt: name,
        href: "../html/sub.html"  // <i class="fa-solid fa-check"></i> أضفا href للخدمة الجديدة
    };

    services.push(newService);
    saveServices(services);  // <i class="fa-solid fa-check"></i> استخدم saveServices من logic.js
    
    activityLogger.log('إضافة خدمة', `تم إضافة خدمة جديدة: ${name}`);
    notificationSystem.success('<i class="fa-solid fa-check"></i> تمت إضافة الخدمة بنجاح!');
    
    // مسح الحقول
    document.getElementById('srv-name').value = '';
    document.getElementById('srv-english-name').value = '';
    document.getElementById('srv-img').value = '';
    document.getElementById('srv-desc').value = '';
    
    showServicesManagement();
}

// <i class="fa-solid fa-check"></i> حذف خدمة مع تأكيد
function deleteServiceWithConfirmation(index) {
    let services = getServices();  // <i class="fa-solid fa-check"></i> استخدم getServices من logic.js
    const service = services[index];
    
    if (!service) return notificationSystem.error('الخدمة غير موجودة');

    showConfirmation(
        '⚠️ تأكيد الحذف',
        `هل أنت متأكد من حذف الخدمة <strong>${service.name}</strong> من الموقع؟`,
        `deleteServicePermanently(${index})`
    );
}

function deleteServicePermanently(index) {
    let services = getServices();  // <i class="fa-solid fa-check"></i> استخدم getServices من logic.js
    const service = services[index];
    
    services.splice(index, 1);
    saveServices(services);  // <i class="fa-solid fa-check"></i> استخدم saveServices من logic.js
    
    activityLogger.log('حذف خدمة', `تم حذف الخدمة: ${service.name}`);
    notificationSystem.success('<i class="fa-solid fa-check"></i> تم حذف الخدمة بنجاح!');
    closeModal();
    showServicesManagement();
}

// <i class="fa-solid fa-check"></i> تعديل خدمة
// function showEditServiceModal(index) {
//     let services = getServices();  // <i class="fa-solid fa-check"></i> استخدم getServices من logic.js
//     const service = services[index];
    
//     if (!service) return;

//     const content = `
//         <div class="form-group">
//             <label>اسم الخدمة (عربي)</label>
//             <input type="text" id="edit-srv-name" value="${service.name}" class="admin-input">
//         </div>
//         <div class="form-group">
//             <label>اسم الخدمة (English)</label>
//             <input type="text" id="edit-srv-english-name" value="${service.englishName || ''}" class="admin-input">
//         </div>
//         <div class="form-group">
//             <label>رابط الصورة</label>
//             <input type="text" id="edit-srv-img" value="${service.imgSrc}" class="admin-input">
//         </div>
//         <div class="form-group">
//             <label>الوصف</label>
//             <textarea id="edit-srv-desc" class="admin-input" style="height: 100px;">${service.description}</textarea>
//         </div>
//     `;

//     createModal('<i class="fa-solid fa-pen"></i> تعديل الخدمة', content, [
//         { text: 'إلغاء', class: 'secondary', onclick: 'closeModal()' },
//         { text: 'حفظ التغييرات', class: 'primary', onclick: `saveServiceChanges(${index})` }
//     ]);
// }
// <i class="fa-solid fa-check"></i> تعديل خدمة
function showEditServiceModal(index) {
    let services = getServices();
    const service = services[index];
    
    if (!service) return;

    const content = `
        <div class="form-group">
            <label>اسم الخدمة (عربي)</label>
            <input type="text" id="edit-srv-name" value="${service.name}" class="admin-input">
        </div>
        <div class="form-group">
            <label>اسم الخدمة (English)</label>
            <input type="text" id="edit-srv-english-name" value="${service.englishName || ''}" class="admin-input">
        </div>
        <div class="form-group">
            <label>رابط الصورة</label>
            <input type="text" id="edit-srv-img" value="${service.imgSrc}" class="admin-input">
        </div>
        <div class="form-group">
            <label>الوصف</label>
            <textarea id="edit-srv-desc" class="admin-input" style="height: 100px;">${service.description}</textarea>
        </div>
    `;

    createModal('<i class="fa-solid fa-pen"></i> تعديل الخدمة', content, [
        { text: 'إلغاء', class: 'secondary', onclick: 'closeModal()' },
        { text: 'حفظ التغييرات', class: 'primary', onclick: `saveServiceChanges(${index})` }
    ]);
}

function saveServiceChanges(index) {
    let services = getServices();  // <i class="fa-solid fa-check"></i> استخدم getServices من logic.js
    const service = services[index];
    
    if (!service) return notificationSystem.error('الخدمة غير موجودة');

    service.name = document.getElementById('edit-srv-name').value;
    service.englishName = document.getElementById('edit-srv-english-name').value;
    service.imgSrc = document.getElementById('edit-srv-img').value;
    service.description = document.getElementById('edit-srv-desc').value;
    
    saveServices(services);  // <i class="fa-solid fa-check"></i> استخدم saveServices من logic.js
    activityLogger.log('تعديل خدمة', `تم تعديل الخدمة: ${service.name}`);
    notificationSystem.success('<i class="fa-solid fa-check"></i> تم تحديث الخدمة بنجاح!');
    closeModal();
    showServicesManagement();
}

// <i class="fa-solid fa-check"></i> عرض الأرباح المحققة
function showProfits() {
    const main = document.getElementById('main-content');
    const profits = getProfits();
    const totalProfit = profits
        .filter(p => p.status === 'active')
        .reduce((sum, p) => sum + parseFloat(p.amount), 0);
    
    const platformProfit = profits
        .filter(p => p.status === 'cancelled')
        .reduce((sum, p) => sum + parseFloat(p.amount), 0);
    
    const totalRefund = profits
        .filter(p => p.status === 'cancelled' && p.refund)
        .reduce((sum, p) => sum + parseFloat(p.refund), 0);
    
    const activeSubscriptions = profits.filter(p => p.status === 'active').length;
    const cancelledSubscriptions = profits.filter(p => p.status === 'cancelled').length;
    const totalPlatformEarnings = totalProfit + platformProfit;

    main.innerHTML = `
        <div class="page-header">
            <h1 class="page-title"><i class="fa-solid fa-coins"></i> الأرباح المحققة</h1>
            <p class="page-subtitle">تتبع أرباح الاشتراكات والعمليات المالية</p>
            <div class="header-stats">
                <span class="stat-badge">أرباح المنصة: <strong style="color: #2563eb;">${totalPlatformEarnings.toFixed(2)} ج.م</strong></span>
                <span class="stat-badge approved">اشتراكات <i class="fa-solid fa-chart-bar"></i>: <strong>${activeSubscriptions}</strong></span>
                <span class="stat-badge pending">ملغاة <i class="fa-solid fa-xmark"></i>: <strong>${cancelledSubscriptions}</strong></span>
            </div>
        </div>

        ${profits.length === 0 ? `
            <div class="empty-state">
                <p><i class="fa-solid fa-sparkles"></i> لا توجد عمليات مالية حالياً</p>
            </div>
        ` : `
            <div class="table-container">
                <table class="admin-table">
                    <thead>
                        <tr>
                            <th>اسم الفني</th>
                            <th>المبلغ الأصلي (ج.م)</th>
                            <th>ربح المنصة (ج.م)</th>
                            <th>المسترجع للفني (ج.م)</th>
                            <th>الحالة</th>
                            <th>تاريخ الاشتراك</th>
                            <th>تاريخ الإلغاء</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${profits.map(profit => `
                            <tr>
                                <td><strong>${profit.providerName}</strong></td>
                                <td class="price">${profit.status === 'cancelled' ? (parseFloat(profit.amount) / 0.25).toFixed(2) : parseFloat(profit.amount).toFixed(2)}</td>
                                <td class="price" style="color: var(--primary); font-weight: bold;">${parseFloat(profit.amount).toFixed(2)}</td>
                                <td class="price" style="color: #10b981;">${profit.refund ? parseFloat(profit.refund).toFixed(2) : '---'}</td>
                                <td>
                                    <span class="status-badge ${profit.status}">
                                        ${profit.status === 'active' ? '<i class="fa-solid fa-check"></i> نشط' : '<i class="fa-solid fa-xmark"></i> ملغى'}
                                    </span>
                                </td>
                                <td>${new Date(profit.subscriptionDate).toLocaleDateString('ar-EG')}</td>
                                <td>${profit.cancellationDate ? new Date(profit.cancellationDate).toLocaleDateString('ar-EG') : '---'}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `}
    `;
}

// ==================== CONTACT MESSAGES ====================

function showContactMessages() {
    const main = document.getElementById('main-content');
    const messages = getContactMessages();
    const newCount = messages.filter(m => m.status === 'new').length;

    main.innerHTML = `
        <div class="page-header">
            <h1 class="page-title"><i class="fa-solid fa-comments"></i> الرسائل من الجمهور</h1>
            <p class="page-subtitle">إدارة الرسائل والاستفسارات الواردة</p>
            <div class="header-stats">
                <span class="stat-badge">إجمالي الرسائل: <strong>${messages.length}</strong></span>
                <span class="stat-badge pending">رسائل جديدة: <strong>${newCount}</strong></span>
            </div>
        </div>

        ${messages.length === 0 ? `
            <div class="empty-state">
                <p><i class="fa-solid fa-sparkles"></i> لا توجد رسائل حالياً</p>
            </div>
        ` : `
            <div class="table-container">
                <table class="admin-table">
                    <thead>
                        <tr>
                            <th>الاسم</th>
                            <th>البريد الإلكتروني</th>
                            <th>الموضوع</th>
                            <th>الرسالة</th>
                            <th>التاريخ</th>
                            <th>الحالة</th>
                            <th>الإجراءات</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${messages.map(msg => `
                            <tr>
                                <td><strong>${msg.name}</strong></td>
                                <td>${msg.email}</td>
                                <td>${msg.subject}</td>
                                <td>
                                    <button class="btn-view-message" onclick="showMessageDetais(${msg.id})" style="background: #3b82f6; color: white; padding: 5px 10px; border: none; border-radius: 4px; cursor: pointer;">
                                        عرض
                                    </button>
                                </td>
                                <td>${new Date(msg.date).toLocaleDateString('ar-EG')}</td>
                                <td>
                                    <span class="status-badge ${msg.status}">
                                        ${msg.status === 'new' ? '<i class="fa-solid fa-star"></i> جديدة' : '<i class="fa-solid fa-check"></i> مقروءة'}
                                    </span>
                                </td>
                                <td>
                                    <button class="btn-delete" onclick="if(confirm('هل أنت متأكد؟')) { deleteContactMessage(${msg.id}); showContactMessages(); }" style="background: #ef4444; color: white; padding: 5px 10px; border: none; border-radius: 4px; cursor: pointer;">
                                        حذف
                                    </button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `}
    `;
}

window.showMessageDetais = (messageId) => {
    const messages = getContactMessages();
    const msg = messages.find(m => m.id === messageId);
    if (!msg) return;

    const modal = createModal('تفاصيل الرسالة', `
        <div style="direction: rtl; text-align: right;">
            <p><strong>من:</strong> ${msg.name} (${msg.email})</p>
            <p><strong>الهاتف:</strong> ${msg.phone || '---'}</p>
            <p><strong>الموضوع:</strong> ${msg.subject}</p>
            <p><strong>التاريخ:</strong> ${new Date(msg.date).toLocaleDateString('ar-EG')}</p>
            <hr style="margin: 15px 0; border: none; border-top: 1px solid #e5e7eb;">
            <p><strong>الرسالة:</strong></p>
            <p style="background: var(--bg-secondary); padding: 15px; border-radius: 8px; white-space: pre-wrap; word-wrap: break-word;">
                ${msg.message}
            </p>
        </div>
    `, [
        { text: 'إغلاق', class: 'secondary', onclick: 'closeModal()' }
    ]);
    
    // تحديث حالة الرسالة إلى مقروءة
    markMessageAsRead(messageId);
};

// ==================== CONTACT SETTINGS ====================

function showContactSettings() {
    const main = document.getElementById('main-content');
    const contactInfo = getContactInfo();

    main.innerHTML = `
        <div class="page-header">
            <h1 class="page-title"><i class="fa-solid fa-gear"></i> إعدادات التواصل</h1>
            <p class="page-subtitle">عدّل معلومات التواصل التي تظهر على صفحة "اتصل بنا"</p>
        </div>

        <div style="max-width: 600px; margin: 20px auto; background: var(--bg-card); padding: 20px; border-radius: 12px; border: 1px solid var(--border-color);">
            <form id="contact-settings-form" style="display: flex; flex-direction: column; gap: 15px;">
                <div>
                    <label style="display: block; margin-bottom: 5px; font-weight: 600; color: var(--text-main);">📧 البريد الإلكتروني <span style="color: #ef4444;">*</span></label>
                    <input type="email" id="contact-email" value="${contactInfo.email}" placeholder="مثال: info@sanay3y.com" style="width: 100%; padding: 10px; border: 1px solid var(--border-color); border-radius: 6px; background: var(--bg-secondary); color: var(--text-main);" />
                    <small style="color: var(--text-muted); font-size: 12px; margin-top: 3px; display: block;">صيغة صحيحة: name@example.com</small>
                </div>

                <div>
                    <label style="display: block; margin-bottom: 5px; font-weight: 600; color: var(--text-main);">📞 رقم الهاتف <span style="color: #ef4444;">*</span></label>
                    <input type="text" id="contact-phone" value="${contactInfo.phone}" placeholder="مثال: +20-1001234567" style="width: 100%; padding: 10px; border: 1px solid var(--border-color); border-radius: 6px; background: var(--bg-secondary); color: var(--text-main);" />
                    <small style="color: var(--text-muted); font-size: 12px; margin-top: 3px; display: block;">صيغة صحيحة: 01X-XXXXXXXX أو +20-1X-XXXXXXXX</small>
                </div>

                <div>
                    <label style="display: block; margin-bottom: 5px; font-weight: 600; color: var(--text-main);">📍 العنوان</label>
                    <input type="text" id="contact-address" value="${contactInfo.address}" style="width: 100%; padding: 10px; border: 1px solid var(--border-color); border-radius: 6px; background: var(--bg-secondary); color: var(--text-main);" />
                </div>

                <div>
                    <label style="display: block; margin-bottom: 5px; font-weight: 600; color: var(--text-main);">⏰ ساعات العمل</label>
                    <input type="text" id="contact-hours" value="${contactInfo.workingHours}" style="width: 100%; padding: 10px; border: 1px solid var(--border-color); border-radius: 6px; background: var(--bg-secondary); color: var(--text-main);" />
                </div>

                <div>
                    <label style="display: block; margin-bottom: 5px; font-weight: 600; color: var(--text-main);">f الفيسبوك</label>
                    <input type="url" id="contact-facebook" value="${contactInfo.facebook}" style="width: 100%; padding: 10px; border: 1px solid var(--border-color); border-radius: 6px; background: var(--bg-secondary); color: var(--text-main);" />
                </div>

                <button type="button" onclick="saveContactSettingsForm()" style="padding: 12px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600; font-size: 16px; transition: transform 0.2s;">
                    💾 حفظ التعديلات
                </button>
            </form>
        </div>
    `;
}

window.saveContactSettingsForm = () => {
    const email = document.getElementById('contact-email').value.trim();
    const phone = document.getElementById('contact-phone').value.trim();
    const address = document.getElementById('contact-address').value.trim();
    const hours = document.getElementById('contact-hours').value.trim();
    const facebook = document.getElementById('contact-facebook').value.trim();

    // === التحقق من صيغة البريد ===
    if (!email) {
        notificationSystem.error('<i class="fa-solid fa-xmark"></i> البريد الإلكتروني مطلوب', 3000);
        return;
    }
    if (!validateEmail(email)) {
        notificationSystem.error('<i class="fa-solid fa-xmark"></i> صيغة البريد الإلكتروني غير صحيحة', 3000);
        return;
    }

    // === التحقق من صيغة الهاتف ===
    if (!phone) {
        notificationSystem.error('<i class="fa-solid fa-xmark"></i> رقم الهاتف مطلوب', 3000);
        return;
    }
    if (!validatePhone(phone)) {
        notificationSystem.error('<i class="fa-solid fa-xmark"></i> صيغة رقم الهاتف غير صحيحة (يجب أن يكون: 01XXXXXXXXX أو +20-1X-XXXXXXXX)', 3000);
        return;
    }

    const updated = {
        email,
        phone,
        address,
        workingHours: hours,
        facebook
    };

    saveContactInfo(updated);
    notificationSystem.success('<i class="fa-solid fa-check"></i> تم حفظ المعلومات بنجاح!', 3000);
    setTimeout(() => showContactSettings(), 1000);
};

// <i class="fa-solid fa-check"></i> دالة مساعدة لتصفية جداول البحث
function filterUsersTable() {
    const searchValue = document.getElementById('search-users').value.toLowerCase();
    const rows = document.querySelectorAll('.admin-table tbody tr');
    
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchValue) ? '' : 'none';
    });
}