document.addEventListener('DOMContentLoaded', () => {
    const app = document.getElementById("app");
    
    // <i class="fa-solid fa-check"></i> 1. التحقق من تسجيل الدخول والصلاحيات
    const currentUser = checkAuthAndRedirect('provider');
    if (!currentUser) return;
    
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
        
        const orders = getOrdersByProvider(currentUser.id);
        const pendingOrdersCount = orders.filter(o => o.status === 'pending').length;
        const completedOrders = orders.filter(o => o.status === 'completed');
        const totalEarnings = completedOrders.reduce((sum, o) => sum + (o.price || 0), 0);
        const monthlyEarnings = completedOrders
            .filter(o => {
                const orderDate = new Date(o.updatedAt);
                const today = new Date();
                return orderDate.getMonth() === today.getMonth() && 
                       orderDate.getFullYear() === today.getFullYear();
            })
            .reduce((sum, o) => sum + (o.price || 0), 0);
        
        mainContent.innerHTML = `
            <div class="welcome-header">
                <h1>
                     أهلاً بك يا ${currentUser.name} <i class="fa-solid fa-hand"></i>
                </h1>
                <p>تخصصك: <span class="badge">${translateService(currentUser.service)}</span></p>
            </div>
            <div class="cards">
                ${createStatCard("إجمالي الطلبات", orders.length, '<i class="fa-solid fa-list"></i>')}
                ${createStatCard("طلبات جديدة", pendingOrdersCount, '<i class="fa-solid fa-bell"></i>')}
                ${createStatCard("التقييم العام", (currentUser.rating || 0).toFixed(1), '<i class="fa-solid fa-star"></i>')}
                
                <div class="card sub-card">
                    <div class="card-icon"><i class="fa-solid fa-rocket"></i></div>
                    <h3>نوع الاشتراك</h3>
                    <p>${currentUser.subscription || 'الباقة المجانية'}</p>
                    <button class="btn-upgrade-dash" onclick="window.location.href='../html/sub.html'">تطوير الحساب</button>
                </div>
            </div>

            <div class="earnings-section" style="margin-top: 40px;">
                <h2 style="font-size: 22px; margin-bottom: 20px; color: var(--text-main);"><i class="fa-solid fa-chart-bar"></i> الأرباح</h2>
                <div class="earnings-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px;">
                    <div class="earnings-card" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 12px; padding: 20px; color: white; text-align: center;">
                        <div style="font-size: 28px; margin-bottom: 10px;"><i class="fa-solid fa-coins"></i></div>
                        <div style="font-size: 14px; opacity: 0.9;">الأرباح الكلية</div>
                        <div style="font-size: 28px; font-weight: bold; margin-top: 10px;">${totalEarnings.toFixed(2)} ج.م</div>
                    </div>
                    <div class="earnings-card" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); border-radius: 12px; padding: 20px; color: white; text-align: center;">
                        <div style="font-size: 28px; margin-bottom: 10px;"><i class="fa-solid fa-chart-line"></i></div>
                        <div style="font-size: 14px; opacity: 0.9;">هذا الشهر</div>
                        <div style="font-size: 28px; font-weight: bold; margin-top: 10px;">${monthlyEarnings.toFixed(2)} ج.م</div>
                    </div>
                    <div class="earnings-card" style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); border-radius: 12px; padding: 20px; color: white; text-align: center;">
                        <div style="font-size: 28px; margin-bottom: 10px;"><i class="fa-solid fa-check"></i></div>
                        <div style="font-size: 14px; opacity: 0.9;">الأعمال المنجزة</div>
                        <div style="font-size: 28px; font-weight: bold; margin-top: 10px;">${completedOrders.length}</div>
                    </div>
                </div>
                
                <div style="margin-top: 30px; background: var(--bg-card); border-radius: 12px; padding: 20px; border: 1px solid var(--border-color);">
                    <h3 style="margin-bottom: 15px; color: var(--text-main);"><i class="fa-solid fa-list"></i> تفاصيل الأرباح</h3>
                    <div style="max-height: 300px; overflow-y: auto;">
                        ${completedOrders.length === 0 ? 
                            '<p style="text-align: center; color: var(--text-muted); padding: 20px;">لا توجد أعمال منجزة بعد</p>' :
                            `<table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                                <thead>
                                    <tr style="border-bottom: 2px solid var(--border-color);">
                                        <th style="padding: 10px; text-align: right; color: var(--text-main);">الطلب</th>
                                        <th style="padding: 10px; text-align: right; color: var(--text-main);">المبلغ</th>
                                        <th style="padding: 10px; text-align: right; color: var(--text-main);">التاريخ</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${completedOrders.map(order => `
                                        <tr style="border-bottom: 1px solid var(--border-color);">
                                            <td style="padding: 10px; color: var(--text-main);">#${order.id}</td>
                                            <td style="padding: 10px; color: var(--text-main); font-weight: bold;">${order.price || 0} ج.م</td>
                                            <td style="padding: 10px; color: var(--text-muted); font-size: 12px;">${new Date(order.updatedAt).toLocaleDateString('ar-EG')}</td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>`
                        }
                    </div>
                </div>
            </div>
        `;
    };

    // --- دالة لعرض بيانات الملف الشخصي ---
    window.showProfile = () => {
        updateActiveMenu('menu-profile');
        
        // <i class="fa-solid fa-check"></i> احصل على الخدمات من localStorage لكي تكون ديناميكية
        const services = getServices();
        const servicesOptions = services.map(s => 
            `<option value="${s.name}" ${currentUser.service === s.name ? 'selected' : ''}>${s.name}</option>`
        ).join('');
        
        mainContent.innerHTML = `
            <div class="profile-container">
                <div class="profile-header">
                    <h2><i class="fa-solid fa-user"></i> بيانات الملف الشخصي</h2>
                    <p>يمكنك تحديث بياناتك المسجلة في المنصة</p>
                </div>
                
                <form id="profile-form" style="background: var(--bg-card); border-radius: 12px; padding: 25px; border: 1px solid var(--border-color);">
                    <div class="profile-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px;">
                        <div class="form-group">
                            <label style="display: block; margin-bottom: 8px; font-weight: 600; color: var(--text-main);">الاسم الكامل</label>
                            <input type="text" id="edit-name" value="${currentUser.name}" style="width: 100%; padding: 12px; border: 1px solid var(--border-color); border-radius: 8px; font-family: 'Cairo', Arial; background: var(--bg-main); color: var(--text-main);">
                        </div>
                        <div class="form-group">
                            <label style="display: block; margin-bottom: 8px; font-weight: 600; color: var(--text-main);">البريد الإلكتروني</label>
                            <input type="email" id="edit-email" value="${currentUser.email}" style="width: 100%; padding: 12px; border: 1px solid var(--border-color); border-radius: 8px; font-family: 'Cairo', Arial; background: var(--bg-main); color: var(--text-main);">
                        </div>
                        <div class="form-group">
                            <label style="display: block; margin-bottom: 8px; font-weight: 600; color: var(--text-main);">رقم الهاتف</label>
                            <input type="tel" id="edit-phone" value="${currentUser.phone || ''}" maxlength="12" inputmode="numeric" pattern="[0-9]*" style="width: 100%; padding: 12px; border: 1px solid var(--border-color); border-radius: 8px; font-family: 'Cairo', Arial; background: var(--bg-main); color: var(--text-main);">
                        </div>
                        <div class="form-group">
                            <label style="display: block; margin-bottom: 8px; font-weight: 600; color: var(--text-main);">التخصص</label>
                            <select id="edit-service" style="width: 100%; padding: 12px; border: 1px solid var(--border-color); border-radius: 8px; font-family: 'Cairo', Arial; background: var(--bg-main); color: var(--text-main);">
                                <option value="">-- اختر تخصص --</option>
                                ${servicesOptions}
                            </select>
                        </div>
                        <div class="form-group">
                            <label style="display: block; margin-bottom: 8px; font-weight: 600; color: var(--text-main);">المنطقة</label>
                            <input type="text" id="edit-area" value="${currentUser.area || ''}" style="width: 100%; padding: 12px; border: 1px solid var(--border-color); border-radius: 8px; font-family: 'Cairo', Arial; background: var(--bg-main); color: var(--text-main);">
                        </div>
                    </div>

                    <div class="profile-actions" style="display: flex; gap: 15px; margin-top: 25px; justify-content: flex-end;">
                        <button type="button" onclick="showProfile()" style="padding: 12px 25px; background: var(--bg-light); color: var(--text-main); border: 1px solid var(--border-color); border-radius: 8px; cursor: pointer; font-weight: 600; transition: 0.3s;">الغاء</button>
                        <button type="button" onclick="saveProfileChanges()" style="padding: 12px 25px; background: var(--primary); color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; transition: 0.3s;">💾 حفظ التغييرات</button>
                    </div>
                </form>
            </div>
        `;
    };

    // دالة حفظ التغييرات
    window.saveProfileChanges = () => {
        const updatedUser = {
            ...currentUser,
            name: document.getElementById('edit-name').value.trim(),
            email: document.getElementById('edit-email').value.trim(),
            phone: document.getElementById('edit-phone').value.trim(),
            service: document.getElementById('edit-service').value,
            area: document.getElementById('edit-area').value.trim()
        };

        // التحقق من البيانات
        if (!updatedUser.name || updatedUser.name.length < 3) {
            notificationSystem.error('الاسم يجب أن يكون 3 أحرف على الأقل');
            return;
        }
        if (!validateEmail(updatedUser.email)) {
            notificationSystem.error('البريد الإلكتروني غير صحيح');
            return;
        }
        if (updatedUser.phone && !/^\d{10,12}$/.test(updatedUser.phone)) {
            notificationSystem.error('رقم الهاتف يجب أن يحتوي على 12 رقم فقط   ');
            return;
        }

        // تحديث في localStorage
        setCurrentUser(updatedUser);

        // تحديث في مصفوفة المستخدمين
        const allUsers = getUsers();
        const userIndex = allUsers.findIndex(u => u.id === currentUser.id);
        if (userIndex !== -1) {
            allUsers[userIndex] = updatedUser;
            saveUsers(allUsers);
        }

        // تحديث currentUser الداخلي
        Object.assign(currentUser, updatedUser);

        notificationSystem.success('<i class="fa-solid fa-check"></i> تم حفظ التغييرات بنجاح!');
        setTimeout(() => showProfile(), 1500);
    };

    // <i class="fa-solid fa-check"></i> --- دالة لعرض الطلبات الجديدة ---
    window.showOrders = () => {
        updateActiveMenu('menu-orders');
        
        const orders = getOrdersByProvider(currentUser.id);
        const pendingOrders = orders.filter(o => o.status === 'pending');
        
        if (pendingOrders.length === 0) {
            mainContent.innerHTML = `
                <div class="empty-state">
                    <h2>🎉 لا توجد طلبات جديدة</h2>
                    <p>استرخ! عند وصول طلب جديد سيظهر هنا</p>
                </div>
            `;
            return;
        }
        
        mainContent.innerHTML = `
            <div class="orders-section">
                <h2><i class="fa-solid fa-screwdriver-wrench"></i> الطلبات الجديدة (${pendingOrders.length})</h2>
                <div class="orders-list" style="animation: fadeInUp 0.5s ease-out;">
                    ${pendingOrders.map((order, index) => `
                        <div class="order-card pending" id="order-${order.id}" style="animation: slideInCard 0.4s ease-out ${index * 0.08}s both;">
                            <div class="order-header">
                                <h3>طلب من: ${order.userName}</h3>
                                <span class="order-id">#${order.id}</span>
                            </div>
                            <div class="order-details">
                                <p><strong><i class="fa-solid fa-list"></i> الخدمة:</strong> ${translateService(order.serviceType)}</p>
                                <p><strong>📅 التاريخ المطلوب:</strong> ${order.date}</p>
                                <p><strong>📝 الوصف:</strong> ${order.description || 'بدون وصف إضافي'}</p>
                                <p><strong><i class="fa-solid fa-coins"></i> السعر المتوقع:</strong> <span style="color: var(--success); font-weight: bold; font-size: 16px;">${order.price || '---'} ج.م</span></p>
                            </div>
                            <div class="order-actions">
                                <button class="btn-accept" onclick="acceptOrder(${order.id})"><i class="fa-solid fa-check"></i> قبول</button>
                                <button class="btn-reject" onclick="rejectOrder(${order.id})"><i class="fa-solid fa-xmark"></i> رفض</button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    };

    // <i class="fa-solid fa-check"></i> --- دالة لعرض الطلبات المقبولة ---
    window.showAcceptedOrders = () => {
        updateActiveMenu('menu-accepted');
        
        const orders = getOrdersByProvider(currentUser.id);
        const acceptedOrders = orders.filter(o => o.status === 'accepted');
        
        mainContent.innerHTML = `
            <div class="orders-section">
                <h2><i class="fa-solid fa-check"></i> الطلبات المقبولة (${acceptedOrders.length})</h2>
                ${acceptedOrders.length === 0 ? 
                    `<div class="empty-state">
                        <h2>🎊 لا توجد طلبات مقبولة حالياً</h2>
                        <p>عندما تقبل طلب جديد سيظهر هنا</p>
                    </div>` : 
                    `<div class="orders-list" style="animation: fadeInUp 0.5s ease-out;">
                        ${acceptedOrders.map((order, index) => `
                            <div class="order-card accepted" style="animation: slideInCard 0.4s ease-out ${index * 0.08}s both;">
                                <div class="order-header">
                                    <h3>${order.userName}</h3>
                                    <span class="order-id">#${order.id}</span>
                                </div>
                                <div class="order-details">
                                    <p><strong>📅 التاريخ المطلوب:</strong> ${order.date}</p>
                                    <p><strong>📞 هاتف العميل:</strong> ${getOrderCustomerPhone(order.userId)}</p>
                                    <p><strong>📝 الوصف:</strong> ${order.description || 'بدون وصف'}</p>
                                    <p><strong><i class="fa-solid fa-coins"></i> السعر المتوقع:</strong> <span style="color: var(--success); font-weight: bold;">${order.price || '---'} ج.م</span></p>
                                </div>
                                <div class="order-actions">
                                    <button class="btn-complete" onclick="completeOrder(${order.id})">🎉 إنهاء الخدمة</button>
                                </div>
                            </div>
                        `).join('')}
                    </div>`
                }
            </div>
        `;
    };

    // --- دالة لعرض الطلبات المرفوضة ---
    window.showRejectedOrders = () => {
        updateActiveMenu('menu-rejected');
        
        const orders = getOrdersByProvider(currentUser.id);
        const rejectedOrders = orders.filter(o => o.status === 'rejected');
        
        mainContent.innerHTML = `
            <div class="orders-section">
                <h2><i class="fa-solid fa-xmark"></i> الطلبات المرفوضة (${rejectedOrders.length})</h2>
                ${rejectedOrders.length === 0 ? 
                    `<div class="empty-state">
                        <h2><i class="fa-solid fa-sparkles"></i> لا توجد طلبات مرفوضة</h2>
                        <p>استمر في قبول الطلبات الجديدة</p>
                    </div>` : 
                    `<div class="orders-list" style="animation: fadeInUp 0.5s ease-out;">
                        ${rejectedOrders.map((order, index) => `
                            <div class="order-card rejected" id="rejected-order-${order.id}" style="animation: slideInCard 0.4s ease-out ${index * 0.08}s both;">
                                <div class="order-header">
                                    <h3>${order.userName}</h3>
                                    <span class="order-id" style="background: #ef4444; color: white;">مرفوض</span>
                                </div>
                                <div class="order-details">
                                    <p><strong><i class="fa-solid fa-list"></i> الخدمة:</strong> ${translateService(order.serviceType)}</p>
                                    <p><strong>📅 التاريخ المطلوب:</strong> ${order.date}</p>
                                    <p><strong>📝 الوصف:</strong> ${order.description || 'بدون وصف'}</p>
                                    <p style="color: var(--text-muted); font-size: 13px;"><strong>⏰ تم الرفض في:</strong> ${new Date(order.updatedAt).toLocaleDateString('ar-EG')}</p>
                                </div>
                                <div class="order-actions">
                                    <button class="btn-delete" onclick="deleteRejectedOrder(${order.id})"><i class="fa-solid fa-trash"></i> حذف</button>
                                </div>
                            </div>
                        `).join('')}
                    </div>`
                }
            </div>
        `;
    };

    container.append(sidebar, mainContent);
    app.appendChild(container);

    // تشغيل الإحصائيات كأول شاشة
    showStats();
});

// <i class="fa-solid fa-check"></i> دوال إدارة الطلبات

window.acceptOrder = (orderId) => {
    updateOrderStatus(orderId, 'accepted');
    notificationSystem.success('<i class="fa-solid fa-check"></i> تم قبول الطلب بنجاح!', 3000);
    setTimeout(() => window.showOrders(), 1000);
};

window.rejectOrder = (orderId) => {
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed; top: 0; left: 0; right: 0; bottom: 0;
        background: rgba(0,0,0,0.5); display: flex; align-items: center;
        justify-content: center; z-index: 10000; direction: rtl;
    `;
    
    modal.innerHTML = `
        <div style="background: var(--bg-card); padding: 30px; border-radius: 12px;
                    max-width: 400px; box-shadow: 0 10px 40px rgba(0,0,0,0.3);
                    border: 1px solid var(--border-color);">
            <h3 style="margin-bottom: 15px; color: var(--text-main);">هل تريد رفض هذا الطلب؟</h3>
            <p style="margin-bottom: 20px; color: var(--text-muted);">لا يمكن التراجع عن هذا الإجراء</p>
            <div style="display: flex; gap: 10px; justify-content: flex-end;">
                <button onclick="event.currentTarget.closest('[data-modal-id]').remove()" style="
                    padding: 10px 20px; background: var(--bg-light); border: 1px solid var(--border-color);
                    border-radius: 6px; cursor: pointer; color: var(--text-main); font-weight: 600;">
                    الغاء
                </button>
                <button onclick="confirmRejectOrder(${orderId}); event.currentTarget.closest('[data-modal-id]').remove();" style="
                    padding: 10px 20px; background: #ef4444; color: white;
                    border: none; border-radius: 6px; cursor: pointer; font-weight: 600;">
                    تأكيد الرفض
                </button>
            </div>
        </div>
    `;
    modal.setAttribute('data-modal-id', 'reject-order');
    document.body.appendChild(modal);
};

window.confirmRejectOrder = (orderId) => {
    updateOrderStatus(orderId, 'rejected');
    notificationSystem.warning('<i class="fa-solid fa-xmark"></i> تم رفض الطلب', 3000);
    setTimeout(() => window.showOrders(), 1000);
};

window.completeOrder = (orderId) => {
    const orders = getOrders();
    const order = orders.find(o => o.id === orderId);
    
    if (!order) {
        notificationSystem.error("الطلب غير موجود");
        return;
    }

    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed; top: 0; left: 0; right: 0; bottom: 0;
        background: rgba(0,0,0,0.5); display: flex; align-items: center;
        justify-content: center; z-index: 10000; direction: rtl;
    `;
    
    modal.innerHTML = `
        <div style="background: var(--bg-card); padding: 30px; border-radius: 12px;
                    max-width: 450px; box-shadow: 0 10px 40px rgba(0,0,0,0.3);
                    border: 1px solid var(--border-color);">
            <h3 style="margin-bottom: 15px; color: var(--text-main);">🎉 إنهاء الخدمة</h3>
            <p style="margin-bottom: 20px; color: var(--text-muted);">أدخل سعر الخدمة المنجزة</p>
            <input type="number" id="service-price" placeholder="السعر بالجنيه" value="${order.price || ''}" 
                   style="width: 100%; padding: 12px; border: 1px solid var(--border-color);
                   border-radius: 8px; margin-bottom: 15px; background: var(--bg-main); color: var(--text-main);">
            <textarea id="service-note" placeholder="ملاحظات اختيارية" 
                   style="width: 100%; padding: 12px; border: 1px solid var(--border-color);
                   border-radius: 8px; margin-bottom: 15px; resize: none; height: 80px;
                   background: var(--bg-main); color: var(--text-main);"></textarea>
            <div style="display: flex; gap: 10px; justify-content: flex-end;">
                <button onclick="event.currentTarget.closest('[data-modal-id]').remove()" style="
                    padding: 10px 20px; background: var(--bg-light); border: 1px solid var(--border-color);
                    border-radius: 6px; cursor: pointer; color: var(--text-main); font-weight: 600;">
                    الغاء
                </button>
                <button onclick="confirmCompleteOrder(${orderId}); event.currentTarget.closest('[data-modal-id]').remove();" style="
                    padding: 10px 20px; background: var(--success); color: white;
                    border: none; border-radius: 6px; cursor: pointer; font-weight: 600;">
                    إنهاء الخدمة
                </button>
            </div>
        </div>
    `;
    modal.setAttribute('data-modal-id', 'complete-order');
    document.body.appendChild(modal);
};

window.confirmCompleteOrder = (orderId) => {
    const price = document.getElementById('service-price').value;
    const note = document.getElementById('service-note').value;
    
    if (!price || price <= 0) {
        notificationSystem.error("الرجاء إدخال سعر صحيح");
        return;
    }

    updateOrderStatus(orderId, 'completed');
    updateOrder(orderId, { price: parseFloat(price), completionNote: note });
    
    notificationSystem.success("🎉 تم إنهاء الخدمة بنجاح!", 3000);
    setTimeout(() => window.showAcceptedOrders(), 1000);
};

window.deleteRejectedOrder = (orderId) => {
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed; top: 0; left: 0; right: 0; bottom: 0;
        background: rgba(0,0,0,0.5); display: flex; align-items: center;
        justify-content: center; z-index: 10000; direction: rtl;
    `;
    
    modal.innerHTML = `
            <div style="background: var(--bg-card); padding: 30px; border-radius: 12px;
                        max-width: 400px; box-shadow: 0 10px 40px rgba(0,0,0,0.3);
                        border: 1px solid var(--border-color);">
                <h3 style="margin-bottom: 15px; color: var(--text-main);"><i class="fa-solid fa-trash"></i> حذف الطلب المرفوض</h3>
                <p style="margin-bottom: 20px; color: var(--text-muted);">هل تريد حذف هذا الطلب نهائياً؟</p>
                <div style="display: flex; gap: 10px; justify-content: flex-end;">
                    <button onclick="event.currentTarget.closest('[data-modal-id]').remove()" style="
                        padding: 10px 20px; background: var(--bg-light); border: 1px solid var(--border-color);
                        border-radius: 6px; cursor: pointer; color: var(--text-main); font-weight: 600;">
                        الغاء
                    </button>
                    <button onclick="confirmDeleteRejected(${orderId}); event.currentTarget.closest('[data-modal-id]').remove();" style="
                        padding: 10px 20px; background: #ef4444; color: white;
                        border: none; border-radius: 6px; cursor: pointer; font-weight: 600;">
                        حذف نهائياً
                    </button>
                </div>
            </div>
    `;
    modal.setAttribute('data-modal-id', 'delete-rejected');
    document.body.appendChild(modal);
};

window.confirmDeleteRejected = (orderId) => {
    deleteOrder(orderId);
    notificationSystem.success('<i class="fa-solid fa-check"></i> تم حذف الطلب', 3000);
    setTimeout(() => window.showRejectedOrders(), 1000);
};

function getOrderCustomerPhone(userId) {
    const user = getUsers().find(u => u.id === userId);
    return user ? user.phone || 'لم يحدد' : '---';
}

// --- دوال مساعدة ---

function renderSidebar(name) {
    const side = document.createElement("div");
    side.className = "side";

    side.innerHTML = `
        <h2>لوحة تحكم العامل</h2>
        <ul>
            <li onclick="showStats()" id="menu-stats"><i class="fa-solid fa-chart-bar"></i> الإحصائيات</li>
            <li onclick="showProfile()" id="menu-profile"><i class="fa-solid fa-user"></i> الملف الشخصي</li>
            <li onclick="showOrders()" id="menu-orders"><i class="fa-solid fa-bell"></i> الطلبات الجديدة</li>
            <li onclick="showAcceptedOrders()" id="menu-accepted"><i class="fa-solid fa-check"></i> طلباتي</li>
            <li onclick="showRejectedOrders()" id="menu-rejected"><i class="fa-solid fa-xmark"></i> الطلبات المرفوضة</li>
            <li onclick="window.location.href='../html/sub.html'" id="menu-sub" style="color: #fbbf24; font-weight: bold;"><i class="fa-solid fa-credit-card"></i> باقات الاشتراك</li>
        </ul>
    `;
    return side;
}

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

