/**
 * 🎛️ ADVANCED ADMIN DASHBOARD
 * مركز القيادة المتقدم لمنصة صنايعي
 * Search, Filter, Modal Management, Activity Logs
 */

// ==================== STATE MANAGEMENT ====================

let adminState = {
    currentTab: 'stats',
    editingUserId: null,
    deletingUserId: null,
    deletingType: null,
    currentProviderSpecFilter: 'all',
    currentOrderFilter: 'all',
    activityLogs: JSON.parse(localStorage.getItem('adminLogs')) || []
};

// ==================== INITIALIZATION ====================

document.addEventListener('DOMContentLoaded', () => {
    const currentUser = getCurrentUser();
    
    if (!currentUser || currentUser.role !== 'admin') {
        showToast("⚠️ غير مصرح - يجب أن تكون مسؤول", "warning");
        setTimeout(() => {
            window.location.href = '../html/sign-in.html';
        }, 1500);
        return;
    }

    renderSidebar();
    showStats();
});

// ==================== SIDEBAR RENDERING ====================

const sidebarItems = [
    { id: 'stats', text: 'الإحصائيات العامة', icon: '<i class="fa-solid fa-chart-bar"></i>' },
    { id: 'users', text: 'إدارة المستخدمين', icon: '<i class="fa-solid fa-users"></i>', badge: 'users' },
    { id: 'providers', text: 'إدارة الفنيين', icon: '<i class="fa-solid fa-screwdriver-wrench"></i>', badge: 'providers' },
    { id: 'orders', text: 'إدارة الطلبات', icon: '<i class="fa-solid fa-list"></i>', badge: 'orders' },
    { id: 'services', text: 'إدارة الخدمات', icon: '<i class="fa-solid fa-briefcase"></i>' },
    { id: 'logs', text: 'سجل العمليات', icon: '📝' },
    { id: 'profits', text: 'الأرباح المحققة', icon: '<i class="fa-solid fa-coins"></i>' }
];

function renderSidebar() {
    const sidebar = document.getElementById('sidebar-container');
    if (!sidebar) return;

    sidebar.innerHTML = '';

    sidebarItems.forEach(item => {
        const div = document.createElement('div');
        div.className = 'sidebar-item';
        
        let badgeHTML = '';
        if (item.id === 'stats') {
            div.classList.add('active');
        }

        // إضافة badge للعناصر
        if (item.badge === 'providers') {
            const pendingCount = getPendingProvidersCount();
            if (pendingCount > 0) {
                badgeHTML = `<span class="badge-notification">${pendingCount}</span>`;
            }
        } else if (item.badge === 'orders') {
            const pendingOrdersCount = getPendingOrdersCount();
            if (pendingOrdersCount > 0) {
                badgeHTML = `<span class="badge-notification">${pendingOrdersCount}</span>`;
            }
        }

        div.innerHTML = `<span>${item.icon}</span> <span>${item.text}</span>${badgeHTML}`;
        
        div.onclick = () => {
            document.querySelectorAll('.sidebar-item').forEach(el => el.classList.remove('active'));
            div.classList.add('active');
            switchTab(item.id);
        };
        sidebar.appendChild(div);
    });
}

function getPendingProvidersCount() {
    const providers = getUsers().filter(u => u.role === 'provider' && !u.approved);
    return providers.length;
}

function getPendingOrdersCount() {
    const orders = getAllOrders().filter(o => o.status === 'pending');
    return orders.length;
}

// ==================== TAB SWITCHING ====================

function switchTab(tabId) {
    adminState.currentTab = tabId;
    const main = document.getElementById('main-content');
    main.innerHTML = '';

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
        case 'profits':
            showProfits();
            break;
        default:
            main.innerHTML = '<h1>لسة مفيش حد <i class="fa-solid fa-screwdriver-wrench"></i></h1>';
    }
}

// ==================== STATS DASHBOARD ====================

function getStats() {
    const allUsers = getUsers();
    const allOrders = getAllOrders();
    
    return {
        totalUsers: allUsers.length,
        totalProviders: allUsers.filter(u => u.role === 'provider').length,
        totalCustomers: allUsers.filter(u => u.role === 'user').length,
        pendingProviders: allUsers.filter(u => u.role === 'provider' && !u.approved).length,
        approvedProviders: allUsers.filter(u => u.role === 'provider' && u.approved).length,
        totalOrders: allOrders.length,
        completedOrders: allOrders.filter(o => o.status === 'completed').length,
        pendingOrders: allOrders.filter(o => o.status === 'pending').length,
        rejectedOrders: allOrders.filter(o => o.status === 'rejected').length,
        acceptedOrders: allOrders.filter(o => o.status === 'accepted').length
    };
}

function showStats() {
    const main = document.getElementById('main-content');
    const stats = getStats();
    
    main.innerHTML = `
        <div class="dashboard-header">
            <h1 class="page-title"><i class="fa-solid fa-chart-bar"></i> لوحة التحكم الرئيسية</h1>
            <p class="subtitle">ملخص الإحصائيات والأنشطة</p>
        </div>

        <div class="stats-grid">
            <div class="stat-card stat-primary">
                <div class="stat-icon"><i class="fa-solid fa-users"></i></div>
                <div class="stat-info">
                    <h3>إجمالي المستخدمين</h3>
                    <p class="stat-value">${stats.totalUsers}</p>
                </div>
            </div>

            <div class="stat-card stat-success">
                <div class="stat-icon"><i class="fa-solid fa-check"></i></div>
                <div class="stat-info">
                    <h3>الفنيين المعتمدين</h3>
                    <p class="stat-value">${stats.approvedProviders}</p>
                </div>
            </div>

            <div class="stat-card stat-warning">
                <div class="stat-icon"><i class="fa-solid fa-clock"></i></div>
                <div class="stat-info">
                    <h3>فنيين قيد المراجعة</h3>
                    <p class="stat-value">${stats.pendingProviders}</p>
                </div>
            </div>

            <div class="stat-card stat-info">
                <div class="stat-icon"><i class="fa-solid fa-list"></i></div>
                <div class="stat-info">
                    <h3>إجمالي الطلبات</h3>
                    <p class="stat-value">${stats.totalOrders}</p>
                </div>
            </div>

            <div class="stat-card stat-success">
                <div class="stat-icon">🎉</div>
                <div class="stat-info">
                    <h3>طلبات مكتملة</h3>
                    <p class="stat-value">${stats.completedOrders}</p>
                </div>
            </div>

            <div class="stat-card stat-warning">
                <div class="stat-icon">⏱️</div>
                <div class="stat-info">
                    <h3>طلبات قيد التنفيذ</h3>
                    <p class="stat-value">${stats.acceptedOrders}</p>
                </div>
            </div>

            <div class="stat-card stat-danger">
                <div class="stat-icon"><i class="fa-solid fa-xmark"></i></div>
                <div class="stat-info">
                    <h3>طلبات مرفوضة</h3>
                    <p class="stat-value">${stats.rejectedOrders}</p>
                </div>
            </div>

            <div class="stat-card stat-info">
                <div class="stat-icon"><i class="fa-solid fa-user"></i></div>
                <div class="stat-info">
                    <h3>إجمالي العملاء</h3>
                    <p class="stat-value">${stats.totalCustomers}</p>
                </div>
            </div>
        </div>
    `;
}

// ==================== USERS MANAGEMENT ====================

function showUsersManagement() {
    const main = document.getElementById('main-content');
    const allUsers = getUsers();
    const customers = allUsers.filter(u => u.role === 'user');

    main.innerHTML = `
        <div class="section-header">
            <h1><i class="fa-solid fa-users"></i> إدارة المستخدمين (العملاء)</h1>
            <span class="badge-large">إجمالي العملاء: ${customers.length}</span>
        </div>

        <div class="table-wrapper">
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
                    ${customers.length > 0 ? customers.map(user => `
                        <tr>
                            <td><strong>${user.name}</strong></td>
                            <td>${user.email}</td>
                            <td>${user.phone || '—'}</td>
                            <td>${formatDate(user.createdAt)}</td>
                            <td>
                                <button class="btn-icon btn-edit" title="تعديل" onclick="openEditModal(${user.id})">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button class="btn-icon btn-delete" title="حذف" onclick="openDeleteConfirm(${user.id}, 'user', '${user.name}')">
                                    <i class="fas fa-trash-alt"></i>
                                </button>
                            </td>
                        </tr>
                    `).join('') : '<tr><td colspan="5" style="text-align: center; padding: 20px;">لا توجد بيانات</td></tr>'}
                </tbody>
            </table>
        </div>
    `;
}


// ==================== PROVIDERS MANAGEMENT ====================

function showProvidersManagement() {
    const main = document.getElementById('main-content');
    const allUsers = getUsers();
    console.log('🔍 All Users:', allUsers);
    const providers = allUsers.filter(u => u.role === 'provider');
    console.log('🔍 Providers found:', providers);

    const pendingProviders = providers.filter(p => !p.approved);
    const approvedProviders = providers.filter(p => p.approved);

    main.innerHTML = `
        <div class="section-header">
            <h1><i class="fa-solid fa-screwdriver-wrench"></i> إدارة الفنيين (الصنايعية)</h1>
            <span class="badge-large">قيد المراجعة: ${pendingProviders.length} | معتمدين: ${approvedProviders.length}</span>
        </div>

        ${pendingProviders.length > 0 ? `
            <div class="providers-section">
                <div class="section-title pending">
                    <h2><i class="fa-solid fa-clock"></i> طلبات جديدة قيد المراجعة (${pendingProviders.length})</h2>
                </div>
                <div class="table-wrapper">
                    <table class="admin-table">
                        <thead>
                            <tr>
                                <th>الفني</th>
                                <th>الإيميل</th>
                                <th>الهاتف</th>
                                <th>التخصص</th>
                                <th>المنطقة</th>
                                <th>التقييم</th>
                                <th>الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${pendingProviders.map(p => `
                                <tr class="pending-row">
                                    <td><strong>${p.name}</strong></td>
                                    <td>${p.email}</td>
                                    <td>${p.phone || '—'}</td>
                                    <td><span class="spec-badge">${p.service ? p.service.toUpperCase() : '—'}</span></td>
                                    <td>${p.area || '—'}</td>
                                    <td><i class="fa-solid fa-star"></i> ${(p.rating || 0).toFixed(1)}</td>
                                    <td>
                                        <button class="btn-icon btn-approve" title="تفعيل" onclick="toggleApproval(${p.id}, true)">
                                            <i class="fas fa-check-circle"></i>
                                        </button>
                                        <button class="btn-icon btn-edit" title="تعديل" onclick="openEditModal(${p.id})">
                                            <i class="fas fa-edit"></i>
                                        </button>
                                        <button class="btn-icon btn-delete" title="رفض" onclick="openDeleteConfirm(${p.id}, 'provider', '${p.name}')">
                                            <i class="fas fa-times-circle"></i>
                                        </button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        ` : ''}

        ${approvedProviders.length > 0 ? `
            <div class="providers-section">
                <div class="section-title approved">
                    <h2><i class="fa-solid fa-check"></i> الفنيين المعتمدين (${approvedProviders.length})</h2>
                </div>
                <div class="table-wrapper">
                    <table class="admin-table">
                        <thead>
                            <tr>
                                <th>الفني</th>
                                <th>الإيميل</th>
                                <th>الهاتف</th>
                                <th>التخصص</th>
                                <th>المنطقة</th>
                                <th>التقييم</th>
                                <th>الاشتراك</th>
                                <th>الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${approvedProviders.map(p => `
                                <tr>
                                    <td><strong>${p.name}</strong></td>
                                    <td>${p.email}</td>
                                    <td>${p.phone || '—'}</td>
                                    <td><span class="spec-badge">${p.service ? p.service.toUpperCase() : '—'}</span></td>
                                    <td>${p.area || '—'}</td>
                                    <td><i class="fa-solid fa-star"></i> ${(p.rating || 0).toFixed(1)}</td>
                                    <td><span class="subscription-badge ${p.subscription}">${p.subscription}</span></td>
                                    <td>
                                        <button class="btn-icon btn-suspend" title="تعطيل" onclick="toggleApproval(${p.id}, false)">
                                            <i class="fas fa-lock"></i>
                                        </button>
                                        <button class="btn-icon btn-edit" title="تعديل" onclick="openEditModal(${p.id})">
                                            <i class="fas fa-edit"></i>
                                        </button>
                                        <button class="btn-icon btn-delete" title="حذف" onclick="openDeleteConfirm(${p.id}, 'provider', '${p.name}')">
                                            <i class="fas fa-trash-alt"></i>
                                        </button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        ` : ''}

        ${pendingProviders.length === 0 && approvedProviders.length === 0 ? 
            '<p style="text-align: center; padding: 30px; color: #666;">لا توجد فنيين</p>' : ''}
    `;
}

// ==================== ORDERS MANAGEMENT ====================

function showOrdersManagement() {
    const main = document.getElementById('main-content');
    const allOrders = getAllOrders();
    const filtered = filterOrders(allOrders, adminState.currentOrderFilter);

    main.innerHTML = `
        <div class="section-header">
            <h1><i class="fa-solid fa-list"></i> إدارة الطلبات</h1>
            <span class="badge-large">إجمالي الطلبات: ${allOrders.length}</span>
        </div>

        <div class="filter-section">
            <div class="filter-buttons">
                <button class="filter-btn ${adminState.currentOrderFilter === 'all' ? 'active' : ''}" onclick="setOrderFilter('all')">
                    الكل (${allOrders.length})
                </button>
                <button class="filter-btn ${adminState.currentOrderFilter === 'pending' ? 'active' : ''}" onclick="setOrderFilter('pending')">
                    قيد الانتظار (${allOrders.filter(o => o.status === 'pending').length})
                </button>
                <button class="filter-btn ${adminState.currentOrderFilter === 'accepted' ? 'active' : ''}" onclick="setOrderFilter('accepted')">
                    جاري التنفيذ (${allOrders.filter(o => o.status === 'accepted').length})
                </button>
                <button class="filter-btn ${adminState.currentOrderFilter === 'completed' ? 'active' : ''}" onclick="setOrderFilter('completed')">
                    مكتملة (${allOrders.filter(o => o.status === 'completed').length})
                </button>
                <button class="filter-btn ${adminState.currentOrderFilter === 'rejected' ? 'active' : ''}" onclick="setOrderFilter('rejected')">
                    مرفوضة (${allOrders.filter(o => o.status === 'rejected').length})
                </button>
            </div>
        </div>

        <div class="table-wrapper">
            <table class="admin-table">
                <thead>
                    <tr>
                        <th>رقم الطلب</th>
                        <th>العميل</th>
                        <th>الفني</th>
                        <th>الخدمة</th>
                        <th>الحالة</th>
                        <th>السعر</th>
                        <th>تاريخ الطلب</th>
                        <th>الإجراءات</th>
                    </tr>
                </thead>
                <tbody>
                    ${filtered.length > 0 ? filtered.map(order => `
                        <tr>
                            <td><strong>#${order.id}</strong></td>
                            <td>${order.customerName || '—'}</td>
                            <td>${order.providerName || '—'}</td>
                            <td>${order.serviceName || '—'}</td>
                            <td><span class="status-badge status-${order.status}">${getOrderStatusBadge(order.status)}</span></td>
                            <td><strong>${order.price || '—'} ج.م</strong></td>
                            <td>${formatDate(order.createdAt)}</td>
                            <td>
                                <button class="btn-icon btn-info" title="التفاصيل" onclick="openOrderDetails(${order.id})">
                                    <i class="fas fa-eye"></i>
                                </button>
                                <button class="btn-icon btn-delete" title="حذف" onclick="openDeleteConfirm(${order.id}, 'order', '#${order.id}')">
                                    <i class="fas fa-trash-alt"></i>
                                </button>
                            </td>
                        </tr>
                    `).join('') : '<tr><td colspan="8" style="text-align: center; padding: 20px;">لا توجد طلبات</td></tr>'}
                </tbody>
            </table>
        </div>
    `;
}

function setOrderFilter(filter) {
    adminState.currentOrderFilter = filter;
    showOrdersManagement();
}

function filterOrders(orders, filter) {
    if (filter === 'all') return orders;
    return orders.filter(o => o.status === filter);
}

function openOrderDetails(orderId) {
    const orders = getAllOrders();
    const order = orders.find(o => o.id === orderId);

    if (!order) {
        showToast("<i class="fa-solid fa-xmark"></i> الطلب غير موجود", "error");
        return;
    }

    const modal = document.getElementById('orderDetailsModal');
    const content = document.getElementById('orderDetailsContent');

    content.innerHTML = `
        <div class="order-details">
            <div class="detail-row">
                <span class="detail-label">رقم الطلب:</span>
                <span class="detail-value">#${order.id}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">اسم العميل:</span>
                <span class="detail-value">${order.customerName || '—'}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">اسم الفني:</span>
                <span class="detail-value">${order.providerName || '—'}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">نوع الخدمة:</span>
                <span class="detail-value">${order.serviceName || '—'}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">الوصف:</span>
                <span class="detail-value">${order.description || '—'}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">الحالة:</span>
                <span class="detail-value"><span class="status-badge status-${order.status}">${getOrderStatusBadge(order.status)}</span></span>
            </div>
            <div class="detail-row">
                <span class="detail-label">السعر:</span>
                <span class="detail-value">${order.price || '—'} ج.م</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">تاريخ الطلب:</span>
                <span class="detail-value">${formatDate(order.createdAt)}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">تغيير الحالة:</span>
                <select id="orderStatusSelect" class="status-select">
                    <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>قيد الانتظار</option>
                    <option value="accepted" ${order.status === 'accepted' ? 'selected' : ''}>مقبول</option>
                    <option value="completed" ${order.status === 'completed' ? 'selected' : ''}>مكتمل</option>
                    <option value="rejected" ${order.status === 'rejected' ? 'selected' : ''}>مرفوض</option>
                </select>
                <button class="btn-save" onclick="updateOrderStatus(${orderId})">تحديث الحالة</button>
            </div>
        </div>
    `;

    openModal('orderDetailsModal');
}

function updateOrderStatus(orderId) {
    const newStatus = document.getElementById('orderStatusSelect').value;
    const orders = getAllOrders();
    const orderIndex = orders.findIndex(o => o.id === orderId);

    if (orderIndex === -1) {
        showToast("<i class="fa-solid fa-xmark"></i> حدث خطأ", "error");
        return;
    }

    orders[orderIndex].status = newStatus;
    orders[orderIndex].updatedAt = new Date().toISOString();
    saveOrders(orders);

    logActivity(`تعديل حالة الطلب #${orderId} إلى: ${getOrderStatusBadge(newStatus)}`);
    showToast("<i class="fa-solid fa-check"></i> تم تحديث حالة الطلب بنجاح", "success");
    closeModal('orderDetailsModal');
    showOrdersManagement();
}

// ==================== SERVICES MANAGEMENT ====================

// function showServicesManagement() {
//     const main = document.getElementById('main-content');
//     let services = JSON.parse(localStorage.getItem('siteServices')) || [];

//     main.innerHTML = `
//         <div class="section-header">
//             <h1><i class="fa-solid fa-briefcase"></i> إدارة الخدمات</h1>
//             <p class="subtitle">الخدمات التي تظهر للعملاء في الصفحة الرئيسية</p>
//         </div>

//         <div class="service-form-card">
//             <h3>➕ إضافة خدمة جديدة</h3>
//             <div class="form-grid">
//                 <input type="text" id="srv-name" placeholder="اسم الخدمة (مثلاً: تكييف)" class="admin-input">
//                 <input type="text" id="srv-img" placeholder="رابط الصورة (URL)" class="admin-input">
//                 <input type="text" id="srv-desc" placeholder="وصف الخدمة" class="admin-input" style="grid-column: span 2;">
//             </div>
//             <button class="btn-approve" onclick="addNewService()" style="width:100%; margin-top:10px;"><i class="fa-solid fa-check"></i> إضافة الخدمة</button>
//         </div>

//         ${services.length > 0 ? `
//             <div style="margin-top: 30px;">
//                 <h3 style="margin-bottom: 15px;">الخدمات الحالية (${services.length})</h3>
//                 <div class="table-wrapper">
//                     <table class="admin-table">
//                         <thead>
//                             <tr>
//                                 <th>الصورة</th>
//                                 <th>اسم الخدمة</th>
//                                 <th>الوصف</th>
//                                 <th>الإجراءات</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             ${services.map((srv, index) => `
//                                 <tr>
//                                     <td><img src="${srv.imgSrc}" style="width:50px; height:50px; border-radius:5px; object-fit:cover;"></td>
//                                     <td><strong>${srv.name}</strong></td>
//                                     <td>${srv.description}</td>
//                                     <td>
//                                         <button class="btn-icon btn-delete" title="حذف" onclick="openDeleteConfirm(${index}, 'service', '${srv.name}')">
//                                             <i class="fas fa-trash-alt"></i>
//                                         </button>
//                                     </td>
//                                 </tr>
//                             `).join('')}
//                         </tbody>
//                     </table>
//                 </div>
//             </div>
//         ` : '<p style="text-align: center; color: #666; margin-top: 20px;">لا توجد خدمات مضافة بعد</p>'}
//     `;
// }
// <i class="fa-solid fa-check"></i> إدارة الخدمات المحسّنة - بدون pagination (عرض كل الخدمات في صفحة واحدة)
function showServicesManagement() {
    const main = document.getElementById('main-content');
    
    // <i class="fa-solid fa-check"></i> استخدم getServices من logic.js
    let services = getServices();

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
                    <label>اسم الخدمة (عربي) *</label>
                    <input type="text" id="srv-name" placeholder="مثلاً: تكييف" class="admin-input">
                </div>
                <div class="form-group">
                    <label>اسم الخدمة (English) *</label>
                    <input type="text" id="srv-english-name" placeholder="مثلاً: AC Repair" class="admin-input">
                </div>
                <div class="form-group">
                    <label>رابط الصورة (URL)</label>
                    <input type="text" id="srv-img" placeholder="https://..." class="admin-input">
                </div>
                <div class="form-group" style="grid-column: span 2;">
                    <label>وصف الخدمة *</label>
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
                            <th>اسم الخدمة (عربي)</th>
                            <th>اسم الخدمة (English)</th>
                            <th>الوصف</th>
                            <th>الإجراءات</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${services.map((srv, index) => `
                            <tr>
                                <td>
                                    <img src="${srv.imgSrc}" style="width: 50px; height: 50px; border-radius: 8px; object-fit: cover;" 
                                         onerror="this.src='https://placehold.co/50x50?text=No+Image'">
                                </td>
                                <td><strong>${srv.name}</strong></td>
                                <td><span style="color: var(--text-muted);">${srv.englishName || '---'}</span></td>
                                <td>${srv.description.substring(0, 40)}...</td>
                                <td class="action-buttons">
                                    <button class="action-btn-icon edit" onclick="showEditServiceModal(${index})" title="تعديل"><i class="fa-solid fa-pen"></i></button>
                                    <button class="action-btn-icon delete" onclick="deleteServiceWithConfirmation(${index})" title="حذف"><i class="fa-solid fa-trash"></i></button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `}
    `;
}

// function addNewService() {
//     const name = document.getElementById('srv-name')?.value.trim();
//     const img = document.getElementById('srv-img')?.value.trim();
//     const desc = document.getElementById('srv-desc')?.value.trim();

//     if (!name || !desc) {
//         showToast("⚠️ الاسم والوصف مطلوبين!", "warning");
//         return;
//     }

//     const newService = {
//         name,
//         description: desc,
//         imgSrc: img || "https://placehold.co/600x400?text=Service",
//         imgAlt: name,
//         href: "../html/providers.html"
//     };

//     let services = JSON.parse(localStorage.getItem('siteServices')) || [];
//     services.push(newService);
//     localStorage.setItem('siteServices', JSON.stringify(services));

//     logActivity(`إضافة خدمة جديدة: ${name}`);
//     showToast("<i class="fa-solid fa-check"></i> تمت إضافة الخدمة بنجاح!", "success");
//     showServicesManagement();
// }

// <i class="fa-solid fa-check"></i> إضافة خدمة جديدة - مع التحقق من الحقول المطلوبة
function addNewService() {
    const name = document.getElementById('srv-name').value.trim();
    const englishName = document.getElementById('srv-english-name').value.trim();
    const img = document.getElementById('srv-img').value.trim();
    const desc = document.getElementById('srv-desc').value.trim();

    // <i class="fa-solid fa-check"></i> التحقق من الحقول المطلوبة
    if (!name || !englishName || !desc) {
        notificationSystem.error('<i class="fa-solid fa-xmark"></i> الاسم (عربي وإنجليزي) والوصف مطلوبان!');
        return;
    }

    let services = getServices();
    
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
        //href: "../html/providers.html?service=" + encodeURIComponent(englishName)
    };

    services.push(newService);
    saveServices(services);  // <i class="fa-solid fa-check"></i> احفظ الخدمات فورًا
    
    activityLogger.log('إضافة خدمة', `تم إضافة خدمة جديدة: ${name} (${englishName})`);
    notificationSystem.success('<i class="fa-solid fa-check"></i> تمت إضافة الخدمة بنجاح! ستظهر في صفحة الخدمات فورًا.');
    
    // مسح الحقول
    document.getElementById('srv-name').value = '';
    document.getElementById('srv-english-name').value = '';
    document.getElementById('srv-img').value = '';
    document.getElementById('srv-desc').value = '';
    
    // إعادة رسم الجدول
    showServicesManagement();
}

function removeService(index) {
    try {
        // التحقق من صحة المعامل
        if (index === null || index === undefined || index < 0) {
            showToast("<i class="fa-solid fa-xmark"></i> خطأ: معرف الخدمة غير صحيح", "error");
            return false;
        }
        
        // الحصول على البيانات
        let services = JSON.parse(localStorage.getItem('siteServices')) || [];
        if (!Array.isArray(services)) {
            console.error('Invalid services data');
            showToast("<i class="fa-solid fa-xmark"></i> خطأ في تحميل بيانات الخدمات", "error");
            return false;
        }
        
        // التحقق من وجود الخدمة
        if (index >= services.length) {
            showToast("<i class="fa-solid fa-xmark"></i> الخدمة غير موجودة", "error");
            return false;
        }
        
        const serviceName = services[index]?.name || 'خدمة';
        
        // حذف الخدمة
        services.splice(index, 1);
        
        // حفظ البيانات
        localStorage.setItem('siteServices', JSON.stringify(services));
        
        // تسجيل العملية
        logActivity(`<i class="fa-solid fa-trash"></i> حذف الخدمة: ${serviceName}`);
        showToast("<i class="fa-solid fa-check"></i> تم حذف الخدمة بنجاح", "success");
        
        // تحديث العرض
        if (adminState.currentTab === 'services') {
            showServicesManagement();
        }
        
        return true;
    } catch (e) {
        console.error('Error deleting service:', e);
        showToast("<i class="fa-solid fa-xmark"></i> حدث خطأ أثناء حذف الخدمة", "error");
        return false;
    }
}

// ==================== ACTIVITY LOGS ====================

function showActivityLogs() {
    const main = document.getElementById('main-content');
    const logs = adminState.activityLogs.slice().reverse();

    main.innerHTML = `
        <div class="section-header">
            <h1>📝 سجل العمليات</h1>
            <span class="badge-large">إجمالي العمليات: ${logs.length}</span>
        </div>

        <div class="logs-container">
            ${logs.length > 0 ? logs.map((log, index) => `
                <div class="log-entry">
                    <div class="log-icon">📌</div>
                    <div class="log-content">
                        <p class="log-message">${log.message}</p>
                        <p class="log-time">${formatDate(log.timestamp)}</p>
                    </div>
                </div>
            `).join('') : '<p style="text-align: center; padding: 30px; color: #666;">لا توجد عمليات</p>'}
        </div>
    `;
}

function logActivity(message) {
    const log = {
        message,
        timestamp: new Date().toISOString()
    };

    adminState.activityLogs.push(log);

    // حفظ آخر 50 عملية فقط
    if (adminState.activityLogs.length > 50) {
        adminState.activityLogs = adminState.activityLogs.slice(-50);
    }

    localStorage.setItem('adminLogs', JSON.stringify(adminState.activityLogs));
}

// ==================== PHONE VALIDATION ====================

/**
 * التحقق من صحة رقم الهاتف المصري
 * @param {string} phone - رقم الهاتف
 * @returns {object} {valid: boolean, message: string}
 */
function validateEgyptianPhone(phone) {
    if (!phone) {
        return { valid: true, message: '' };
    }
    
    phone = phone.trim();
    if (!phone) {
        return { valid: true, message: '' };
    }

    const cleaned = phone.replace(/[\s\-\+]/g, '');
    
    // رقم مصري صحيح: يبدأ بـ 01 أو 201 و 11 أو 12 رقم
    const egyptianPhoneRegex = /^01[0-2]\d{8}$|^201[0-2]\d{8}$/;
    
    if (!egyptianPhoneRegex.test(cleaned)) {
        return {
            valid: false,
            message: '<i class="fa-solid fa-xmark"></i> رقم هاتف غير صحيح. يجب أن يكون رقم مصري (مثال: 01234567890 أو 201234567890)'
        };
    }
    
    return { valid: true, message: '<i class="fa-solid fa-check"></i> رقم الهاتف صحيح' };
}

// ==================== MODAL & EDIT MANAGEMENT ====================

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.add('active');
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.remove('active');
}

function openEditModal(userId) {
    try {
        const users = getUsers();
        if (!users || !Array.isArray(users)) {
            showToast("<i class="fa-solid fa-xmark"></i> خطأ في تحميل البيانات", "error");
            return;
        }
        
        const user = users.find(u => u.id === userId);
        
        if (!user) {
            showToast("<i class="fa-solid fa-xmark"></i> المستخدم غير موجود", "error");
            return;
        }
        
        adminState.editingUserId = userId;
        
        // التحقق من وجود العناصر قبل التعيين
        const nameInput = document.getElementById('editName');
        const emailInput = document.getElementById('editEmail');
        const phoneInput = document.getElementById('editPhone');
        
        if (!nameInput || !emailInput || !phoneInput) {
            showToast("<i class="fa-solid fa-xmark"></i> خطأ في تحميل النموذج", "error");
            return;
        }
        
        nameInput.value = user.name || '';
        emailInput.value = user.email || '';
        phoneInput.value = user.phone || '';
        phoneInput.classList.remove('error');
        
        // إظهار/إخفاء حقول الفنيين
        const providerFields = document.getElementById('editProviderFields');
        if (providerFields) {
            if (user.role === 'provider') {
                providerFields.style.display = 'block';
                const serviceSelect = document.getElementById('editService');
                const areaInput = document.getElementById('editArea');
                
                if (serviceSelect) {
                    serviceSelect.value = user.service || '';
                }
                if (areaInput) {
                    areaInput.value = user.area || '';
                }
            } else {
                providerFields.style.display = 'none';
            }
        }
        
        openModal('editUserModal');
        nameInput.focus();
    } catch (e) {
        console.error('Error opening edit modal:', e);
        showToast("<i class="fa-solid fa-xmark"></i> حدث خطأ في فتح النموذج", "error");
    }
}

function saveUserChanges() {
    const users = getUsers();
    const userIndex = users.findIndex(u => u.id === adminState.editingUserId);

    if (userIndex === -1) {
        showToast("<i class="fa-solid fa-xmark"></i> حدث خطأ - المستخدم غير موجود", "error");
        return;
    }

    try {
        const nameInput = document.getElementById('editName');
        const phoneInput = document.getElementById('editPhone');
        
        if (!nameInput || !phoneInput) {
            showToast("<i class="fa-solid fa-xmark"></i> خطأ في تحميل النموذج", "error");
            return;
        }
        
        const name = nameInput.value.trim();
        const phone = phoneInput.value.trim();
        
        // التحقق من الاسم
        if (!name) {
            showToast("⚠️ الاسم مطلوب", "warning");
            nameInput.focus();
            return;
        }
        
        if (name.length < 3) {
            showToast("⚠️ الاسم يجب أن يكون 3 أحرف على الأقل", "warning");
            nameInput.focus();
            return;
        }
        
        // التحقق من رقم الهاتف
        const phoneValidation = validateEgyptianPhone(phone);
        if (!phoneValidation.valid) {
            showToast(phoneValidation.message, "error");
            phoneInput.focus();
            phoneInput.classList.add('error');
            setTimeout(() => phoneInput.classList.remove('error'), 3000);
            return;
        }
        
        // تحديث البيانات
        users[userIndex].name = name;
        if (phone) {
            users[userIndex].phone = phone;
        }
        
        // تحديث بيانات الفنيين الإضافية
        if (users[userIndex].role === 'provider') {
            const serviceSelect = document.getElementById('editService');
            const areaInput = document.getElementById('editArea');
            
            if (serviceSelect) {
                users[userIndex].service = serviceSelect.value;
            }
            if (areaInput) {
                users[userIndex].area = areaInput.value.trim();
            }
        }
        
        saveUsers(users);
        logActivity(`تعديل بيانات ${users[userIndex].role === 'provider' ? 'فني' : 'عميل'}: ${name}`);
        showToast("<i class="fa-solid fa-check"></i> تم حفظ التغييرات بنجاح", "success");
        closeModal('editUserModal');
        
        // تحديث الجدول
        if (adminState.currentTab === 'users') {
            showUsersManagement();
        } else {
            showProvidersManagement();
        }
    } catch (e) {
        console.error('Error saving changes:', e);
        showToast("<i class="fa-solid fa-xmark"></i> حدث خطأ في حفظ التغييرات", "error");
    }
}

function openDeleteConfirm(id, type, name) {
    try {
        // التحقق من صحة المعاملات
        if (id === null || id === undefined || id === '') {
            showToast("<i class="fa-solid fa-xmark"></i> خطأ: معرف غير صحيح", "error");
            return;
        }
        
        if (!type) {
            showToast("<i class="fa-solid fa-xmark"></i> خطأ: نوع غير محدد", "error");
            return;
        }
        
        // تنظيف الاسم من الأحرف الخاصة والفراغات الزائدة
        const cleanName = String(name || '').trim();
        if (!cleanName) {
            showToast("<i class="fa-solid fa-xmark"></i> خطأ: اسم غير صحيح", "error");
            return;
        }
        
        // التحقق من وجود العناصر في الـ DOM
        const modal = document.getElementById('deleteConfirmModal');
        const message = document.getElementById('deleteMessage');
        
        if (!modal || !message) {
            showToast("<i class="fa-solid fa-xmark"></i> خطأ في تحميل نافذة التأكيد", "error");
            return;
        }
        
        // تخزين المعاملات
        adminState.deletingUserId = id;
        adminState.deletingType = type;
        
        // تعيين رسالة الحذف بشكل آمن
        const typeText = {
            'user': 'العميل',
            'provider': 'الفني',
            'order': 'الطلب',
            'service': 'الخدمة'
        }[type] || 'العنصر';
        
        // استخدام escapeHtml لتجنب XSS
        const escapedName = cleanName
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
        
        message.textContent = `هل أنت متأكد من حذف ${typeText}: "${escapedName}"؟\nلا يمكن التراجع عن هذا الإجراء.`;
        
        openModal('deleteConfirmModal');
    } catch (e) {
        console.error('Error in openDeleteConfirm:', e);
        showToast("<i class="fa-solid fa-xmark"></i> حدث خطأ في نافذة التأكيد", "error");
    }
}

function confirmDelete() {
    try {
        // التحقق من صحة البيانات
        if (!adminState.deletingUserId && adminState.deletingUserId !== 0) {
            showToast("<i class="fa-solid fa-xmark"></i> خطأ: لم يتم تحديد العنصر للحذف", "error");
            closeModal('deleteConfirmModal');
            return;
        }
        
        if (!adminState.deletingType) {
            showToast("<i class="fa-solid fa-xmark"></i> خطأ: نوع الحذف غير محدد", "error");
            closeModal('deleteConfirmModal');
            return;
        }
        
        let deleteSuccess = false;
        
        // تنفيذ الحذف حسب النوع
        if (adminState.deletingType === 'user' || adminState.deletingType === 'provider') {
            deleteSuccess = deleteRecord(adminState.deletingUserId);
        } else if (adminState.deletingType === 'order') {
            deleteSuccess = deleteOrder(adminState.deletingUserId);
        } else if (adminState.deletingType === 'service') {
            deleteSuccess = removeService(adminState.deletingUserId);
        } else {
            showToast("<i class="fa-solid fa-xmark"></i> نوع حذف غير معروف", "error");
            closeModal('deleteConfirmModal');
            return;
        }
        
        // إذا فشل الحذف، لا نغلق النافذة
        if (deleteSuccess !== false) {
            closeModal('deleteConfirmModal');
        }
    } catch (e) {
        console.error('Error in confirmDelete:', e);
        showToast("<i class="fa-solid fa-xmark"></i> حدث خطأ أثناء الحذف", "error");
    }
}

// ==================== DELETE & APPROVAL FUNCTIONS ====================

function deleteRecord(userId) {
    try {
        // التحقق من صحة المعامل
        if (!userId && userId !== 0) {
            showToast("<i class="fa-solid fa-xmark"></i> خطأ: معرف المستخدم غير صحيح", "error");
            return false;
        }
        
        // الحصول على البيانات
        let allUsers = getUsers();
        if (!Array.isArray(allUsers)) {
            console.error('Invalid users data');
            showToast("<i class="fa-solid fa-xmark"></i> خطأ في تحميل بيانات المستخدمين", "error");
            return false;
        }
        
        // البحث عن المستخدم
        const userIndex = allUsers.findIndex(u => u.id === userId);
        if (userIndex === -1) {
            showToast("<i class="fa-solid fa-xmark"></i> المستخدم غير موجود", "error");
            return false;
        }
        
        const user = allUsers[userIndex];
        const userName = user.name || 'مستخدم';
        const userType = user.role === 'provider' ? 'فني' : 'عميل';
        
        // حذف المستخدم
        allUsers.splice(userIndex, 1);
        
        // حفظ البيانات
        saveUsers(allUsers);
        
        // تسجيل العملية
        logActivity(`<i class="fa-solid fa-trash"></i> حذف ${userType}: ${userName}`);
        showToast(`<i class="fa-solid fa-check"></i> تم حذف ${userType} بنجاح`, "success");
        
        // تحديث العرض
        if (adminState.currentTab === 'users') {
            showUsersManagement();
        } else if (adminState.currentTab === 'providers') {
            showProvidersManagement();
        }
        
        return true;
    } catch (e) {
        console.error('Error deleting record:', e);
        showToast("<i class="fa-solid fa-xmark"></i> حدث خطأ أثناء حذف المستخدم", "error");
        return false;
    }
}

function deleteOrder(orderId) {
    try {
        // التحقق من صحة المعامل
        if (!orderId && orderId !== 0) {
            showToast("<i class="fa-solid fa-xmark"></i> خطأ: معرف الطلب غير صحيح", "error");
            return false;
        }
        
        // الحصول على البيانات
        const orders = getAllOrders();
        if (!Array.isArray(orders)) {
            console.error('Invalid orders data');
            showToast("<i class="fa-solid fa-xmark"></i> خطأ في تحميل بيانات الطلبات", "error");
            return false;
        }
        
        // البحث عن الطلب
        const orderIndex = orders.findIndex(o => o.id === orderId);
        if (orderIndex === -1) {
            showToast("<i class="fa-solid fa-xmark"></i> الطلب غير موجود", "error");
            return false;
        }
        
        const order = orders[orderIndex];
        
        // حذف الطلب
        orders.splice(orderIndex, 1);
        
        // حفظ البيانات
        saveOrders(orders);
        
        // تسجيل العملية
        logActivity(`<i class="fa-solid fa-trash"></i> حذف الطلب #${orderId}`);
        showToast("<i class="fa-solid fa-check"></i> تم حذف الطلب بنجاح", "success");
        
        // تحديث العرض
        if (adminState.currentTab === 'orders') {
            showOrdersManagement();
        }
        
        return true;
    } catch (e) {
        console.error('Error deleting order:', e);
        showToast("<i class="fa-solid fa-xmark"></i> حدث خطأ أثناء حذف الطلب", "error");
        return false;
    }
}

function toggleApproval(userId, status) {
    let allUsers = getUsers();
    const userIndex = allUsers.findIndex(u => u.id === userId);

    if (userIndex === -1) {
        showToast("<i class="fa-solid fa-xmark"></i> الفني غير موجود", "error");
        return;
    }

    allUsers[userIndex].approved = status;
    saveUsers(allUsers);

    logActivity(`${status ? 'تفعيل' : 'تعطيل'} حساب الفني: ${allUsers[userIndex].name}`);
    showToast(status ? "<i class="fa-solid fa-check"></i> تم تفعيل الحساب بنجاح" : "🔒 تم تعطيل الحساب", "success");
    showProvidersManagement();
}

// ==================== UTILITIES ====================

function showProfits() {
    const main = document.getElementById('main-content');
    main.innerHTML = `
        <div class="section-header">
            <h1><i class="fa-solid fa-coins"></i> الأرباح المحققة</h1>
        </div>
        <div style="padding: 40px; text-align: center; color: #666;">
            <p><i class="fa-solid fa-chart-bar"></i> هذه الميزة قيد التطوير</p>
        </div>
    `;
}

function formatDate(dateString) {
    if (!dateString) return '—';
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric' });
}

function getOrderStatusBadge(status) {
    const badges = {
        pending: '<i class="fa-solid fa-clock"></i> قيد الانتظار',
        accepted: '<i class="fa-solid fa-check"></i> مقبول',
        completed: '🎉 مكتمل',
        rejected: '<i class="fa-solid fa-xmark"></i> مرفوض'
    };
    return badges[status] || status;
}

console.log('<i class="fa-solid fa-check"></i> admin.js loaded successfully');
