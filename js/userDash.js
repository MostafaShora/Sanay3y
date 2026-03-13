document.addEventListener('DOMContentLoaded', () => {
    const app = document.getElementById("app");
    
    // <i class="fa-solid fa-check"></i> 1. التحقق من تسجيل الدخول والصلاحيات
    let currentUser = checkAuthAndRedirect('user');
    if (!currentUser) return;
    
    // تطبيق الثيم المحفوظ
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-mode');
    }

    // 2. إنشاء الحاوية الرئيسية
    const container = document.createElement("div");
    container.className = "container";

    // 3. بناء السايد بار (Sidebar)
    const sidebar = renderUserSidebar(currentUser.name);
    
    // 4. بناء المحتوى الرئيسي (Main Content)
    const mainContent = document.createElement("div");
    mainContent.className = "main";
    mainContent.id = "dashboard-main";

    // ==================== دالة عرض الهُوية الشخصية ====================
    window.showUserProfile = () => {
        updateActiveMenu('menu-profile');
        
        // تحديث البيانات من localStorage
        const updatedUser = getCurrentUser();
        
        mainContent.innerHTML = `
            <div class="profile-container">
                <div class="profile-header">
                    <h2><i class="fa-solid fa-user"></i> بيانات الملف الشخصي</h2>
                    <p>إدارة معلومات حسابك الشخصية</p>
                </div>
                
                <div class="profile-card" style="background: var(--bg-card); border-radius: 16px; padding: 30px; border: 1px solid var(--border-color); margin-bottom: 25px;">
                    <div class="profile-section" style="display: grid; grid-template-columns: auto 1fr; gap: 25px; align-items: start; margin-bottom: 30px;">
                        <div class="profile-avatar" style="width: 120px; height: 120px; background: linear-gradient(135deg, var(--primary), #1e40af); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 50px; box-shadow: 0 4px 15px rgba(37, 99, 235, 0.3);">
                            <i class="fa-solid fa-user"></i>
                        </div>
                        <div class="profile-info">
                            <h3 style="font-size: 24px; margin-bottom: 10px; color: var(--text-main);">${updatedUser.name}</h3>
                            <p style="color: var(--text-muted); margin-bottom: 5px;">📧 ${updatedUser.email}</p>
                            <p style="color: var(--text-muted); margin-bottom: 5px;">📱 ${updatedUser.phone || 'لم يتم تسجيل رقم'}</p>
                            ${updatedUser.area ? `<p style="color: var(--text-muted); margin-bottom: 5px;">📍 ${updatedUser.area}</p>` : ''}
                            <span class="badge" style="background: var(--primary); color: white; padding: 6px 14px; border-radius: 20px; font-size: 12px; font-weight: 600; display: inline-block;">عميل</span>
                        </div>
                    </div>

                    <div class="profile-details" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; padding-top: 20px; border-top: 1px solid var(--border-color);">
                        <div class="detail-item">
                            <label>الاسم الكامل</label>
                            <p>${updatedUser.name}</p>
                        </div>
                        <div class="detail-item">
                            <label>البريد الإلكتروني</label>
                            <p>${updatedUser.email}</p>
                        </div>
                        <div class="detail-item">
                            <label>رقم الهاتف</label>
                            <p>${updatedUser.phone || 'لم يتم تحديد'}</p>
                        </div>
                        <div class="detail-item">
                            <label>المنطقة</label>
                            <p>${updatedUser.area || 'لم يتم تحديد'}</p>
                        </div>
                        <div class="detail-item">
                            <label>تاريخ التسجيل</label>
                            <p>${new Date(updatedUser.createdAt || Date.now()).toLocaleDateString('ar-EG')}</p>
                        </div>
                        <div class="detail-item">
                            <label>نوع الحساب</label>
                            <p>عميل عادي</p>
                        </div>
                    </div>

                    <div class="profile-actions" style="margin-top: 30px; padding-top: 20px; border-top: 1px solid var(--border-color); display: flex; gap: 15px; justify-content: flex-end;">
                        <button onclick="openProfileEditModal()" style="padding: 12px 25px; background: var(--primary); color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; transition: 0.3s; font-family: 'Cairo', sans-serif;" class="btn-action"><i class="fa-solid fa-pen"></i> تعديل البيانات</button>
                    </div>
                </div>
            </div>
        `;
    };

    // ==================== دالة عرض الطلبات ====================
    window.showMyOrders = () => {
        updateActiveMenu('menu-orders');
        
        const orders = getOrdersByUser(currentUser.id);
        
        if (orders.length === 0) {
            mainContent.innerHTML = `
                <div class="empty-state" style="text-align: center; padding: 60px 20px;">
                    <div style="font-size: 80px; margin-bottom: 20px;">🛶</div>
                    <h2 style="color: var(--text-main); margin-bottom: 10px;">لا توجد طلبات بعد</h2>
                    <p style="color: var(--text-muted); margin-bottom: 30px; font-size: 16px;">ابدأ بحجز خدمة صناعية الآن!</p>
                    <a href="../html/services.html" style="display: inline-block; background: var(--primary); color: white; padding: 14px 35px; border-radius: 8px; text-decoration: none; font-weight: 600; transition: 0.3s;"><i class="fa-solid fa-rocket"></i> استعرض الخدمات</a>
                </div>
            `;
            return;
        }
        
        // <i class="fa-solid fa-check"></i> حساب الإحصائيات الديناميكية الحقيقية
        const pendingOrders = orders.filter(o => o.status === 'pending').length;
        const completedOrders = orders.filter(o => o.status === 'completed').length;
        const acceptedOrders = orders.filter(o => o.status === 'accepted').length;

        mainContent.innerHTML = `
            <div class="orders-header" style="margin-bottom: 35px;">
                <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 20px;">
                    <div>
                        <h1 style="font-size: 28px; margin-bottom: 5px; color: var(--text-main);"><i class="fa-solid fa-screwdriver-wrench"></i> طلباتي</h1>
                        <p style="color: var(--text-muted);">إدارة وتتبع طلبات الخدمات</p>
                    </div>
                    <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                        <div class="stat-badge" style="background: linear-gradient(135deg, #3b82f6, #2563eb); padding: 12px 20px; border-radius: 8px; color: white; text-align: center;">
                            <div style="font-size: 10px; opacity: 0.8;">جميع الطلبات</div>
                            <div style="font-size: 24px; font-weight: bold;">${orders.length}</div>
                        </div>
                        <div class="stat-badge" style="background: linear-gradient(135deg, #f59e0b, #d97706); padding: 12px 20px; border-radius: 8px; color: white; text-align: center;">
                            <div style="font-size: 10px; opacity: 0.8;">قيد الانتظار</div>
                            <div style="font-size: 24px; font-weight: bold;">${pendingOrders}</div>
                        </div>
                        <div class="stat-badge" style="background: linear-gradient(135deg, #3b82f6, #2563eb); padding: 12px 20px; border-radius: 8px; color: white; text-align: center;">
                            <div style="font-size: 10px; opacity: 0.8;">قيد المراجعة</div>
                            <div style="font-size: 24px; font-weight: bold;">${acceptedOrders}</div>
                        </div>
                        <div class="stat-badge" style="background: linear-gradient(135deg, #22c55e, #16a34a); padding: 12px 20px; border-radius: 8px; color: white; text-align: center;">
                            <div style="font-size: 10px; opacity: 0.8;">المنجزة</div>
                            <div style="font-size: 24px; font-weight: bold;">${completedOrders}</div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="orders-list" style="animation: fadeIn 0.5s ease-out;">
                ${orders.map((order, index) => {
                    // <i class="fa-solid fa-check"></i> Cross-Reference: البحث عن اسم الصنايعي من مصفوفة users
                    const provider = getProviderById(order.providerId);
                    const providerName = provider ? provider.name : 'الصنايعي';
                    
                    // <i class="fa-solid fa-check"></i> معالجة السعر النهائي
                    let priceDisplay = '--- ج.م';
                    if (order.finalPrice) {
                        priceDisplay = `${order.finalPrice} ج.م`;
                    }
                    
                    return `
                        <div class="order-card order-${order.status}" id="order-${order.id}" style="animation: slideInCard 0.4s ease-out ${index * 0.08}s both;">
                            <div class="order-content">
                                <div class="order-header-row">
                                    <div class="order-title-section">
                                        <h3 class="order-title">🏢 ${providerName}</h3>
                                        <span class="order-id">#${order.id}</span>
                                    </div>
                                    <span class="status-badge status-${order.status}">${getOrderStatusBadge(order.status)}</span>
                                </div>

                                <div class="order-details-grid">
                                    <div class="detail-cell">
                                        <span class="detail-label"><i class="fa-solid fa-list"></i> الخدمة</span>
                                        <span class="detail-value">${translateService(order.serviceType)}</span>
                                    </div>
                                    <div class="detail-cell">
                                        <span class="detail-label">📅 التاريخ المطلوب</span>
                                        <span class="detail-value">${new Date(order.date).toLocaleDateString('ar-EG')}</span>
                                    </div>
                                    <div class="detail-cell">
                                        <span class="detail-label"><i class="fa-solid fa-coins"></i> السعر</span>
                                        <span class="detail-value" style="font-weight: bold; color: var(--primary);">${priceDisplay}</span>
                                    </div>
                                    <div class="detail-cell">
                                        <span class="detail-label">⏰ وقت الطلب</span>
                                        <span class="detail-value">${new Date(order.createdAt).toLocaleDateString('ar-EG')}</span>
                                    </div>
                                </div>

                                ${order.description ? `
                                    <div class="order-description">
                                        <span class="detail-label">📝 تفاصيل الطلب</span>
                                        <p>${order.description}</p>
                                    </div>
                                ` : ''}

                                <div class="order-actions">
                                    ${order.status === 'pending' ? `
                                        <button onclick="confirmCancelOrder(${order.id})" class="btn-cancel" title="إلغاء الطلب"><i class="fa-solid fa-xmark"></i> إلغاء الطلب</button>
                                    ` : ''}
                                    ${order.status === 'completed' && !order.rating ? `
                                        <button onclick="openReviewDialog(${order.id}, '${providerName}')" class="btn-review"><i class="fa-solid fa-star"></i> كيّف الخدمة</button>
                                    ` : ''}
                                    ${order.rating ? `
                                        <div class="review-badge" style="background: #dcfce7; color: #166534; padding: 8px 16px; border-radius: 6px; font-weight: 600; font-size: 13px; display: inline-block;">
                                            <i class="fa-solid fa-star"></i> تم تقييمك بـ ${order.rating}/5 نجوم
                                        </div>
                                    ` : ''}
                                </div>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    };

    // ==================== دالة عرض التقييمات ====================
    window.showMyReviews = () => {
        updateActiveMenu('menu-reviews');
        
        const orders = getOrdersByUser(currentUser.id);
        const ratedOrders = orders.filter(o => o.rating);
        
        if (ratedOrders.length === 0) {
            mainContent.innerHTML = `
                <div class="empty-state" style="text-align: center; padding: 60px 20px;">
                    <div style="font-size: 80px; margin-bottom: 20px;"><i class="fa-solid fa-star"></i></div>
                    <h2 style="color: var(--text-main); margin-bottom: 10px;">لم تقيّم أي خدمة بعد</h2>
                    <p style="color: var(--text-muted); margin-bottom: 30px; font-size: 16px;">عند إنهاء أي خدمة، يمكنك تقييم الصنايعي</p>
                    <a href="#" onclick="showMyOrders(); return false;" style="display: inline-block; background: var(--primary); color: white; padding: 14px 35px; border-radius: 8px; text-decoration: none; font-weight: 600; transition: 0.3s;">👀 عرض الطلبات المنجزة</a>
                </div>
            `;
            return;
        }
        
        mainContent.innerHTML = `
            <div class="reviews-container">
                <div style="margin-bottom: 30px;">
                    <h1 style="font-size: 28px; margin-bottom: 5px; color: var(--text-main);"><i class="fa-solid fa-star"></i> تقييماتي</h1>
                    <p style="color: var(--text-muted);">عدد التقييمات: ${ratedOrders.length}</p>
                </div>

                <div class="reviews-list">
                    ${ratedOrders.map((order, index) => {
                        const provider = getProviderById(order.providerId);
                        const providerName = provider ? provider.name : 'الصنايعي';
                        
                        return `
                            <div class="review-card" style="animation: slideInCard 0.4s ease-out ${index * 0.08}s both;">
                                <div class="review-header">
                                    <div>
                                        <h3 style="color: var(--text-main); margin-bottom: 5px;">${providerName}</h3>
                                        <p style="color: var(--text-muted); font-size: 13px;">${translateService(order.serviceType)} • ${new Date(order.reviewedAt).toLocaleDateString('ar-EG')}</p>
                                    </div>
                                    <div class="rating-stars" style="font-size: 24px;">
                                        ${Array(5).fill('').map((_, i) => i < order.rating ? '<i class="fa-solid fa-star"></i>' : '☆').join('')}
                                    </div>
                                </div>
                                ${order.review ? `
                                    <p class="review-text" style="color: var(--text-main); margin: 15px 0; line-height: 1.6;">${order.review}</p>
                                ` : ''}
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    };

    // ==================== دالة إلغاء الطلب مع تأكيد ====================
    window.confirmCancelOrder = (orderId) => {
        if (confirm('هل تريد بالفعل إلغاء هذا الطلب؟')) {
            deleteOrder(orderId);
            showToast('<i class="fa-solid fa-check"></i> تم إلغاء الطلب بنجاح', 'success');
            showMyOrders();
        }
    };

    // ==================== دالة فتح نافذة التقييم ====================
    window.openReviewDialog = (orderId, providerName) => {
        let dialogHTML = `
            <div id="review-modal" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 2000; animation: fadeIn 0.3s ease;">
                <div style="background: var(--bg-card); border-radius: 16px; padding: 40px; max-width: 500px; width: 90%; box-shadow: 0 20px 60px rgba(0,0,0,0.3); animation: slideUp 0.3s ease;">
                    <h2 style="color: var(--text-main); margin-bottom: 10px; font-size: 22px;"><i class="fa-solid fa-star"></i> قيّم الخدمة</h2>
                    <p style="color: var(--text-muted); margin-bottom: 25px;">كيف كان أداء ${providerName}؟</p>
                    
                    <div style="margin-bottom: 25px;">
                        <label style="display: block; color: var(--text-main); font-weight: 600; margin-bottom: 12px;">التقييم (من 1 إلى 5 نجوم)</label>
                        <div class="rating-selector" style="display: flex; gap: 10px; justify-content: center; font-size: 40px; margin-bottom: 15px;">
                            ${[1, 2, 3, 4, 5].map(i => `
                                <span onclick="document.getElementById('rating-input').value = ${i}; updateStars(${i})" style="cursor: pointer; transition: 0.2s; opacity: 0.5;" class="star-${i}"><i class="fa-solid fa-star"></i></span>
                            `).join('')}
                        </div>
                        <input type="hidden" id="rating-input" value="0">
                    </div>
                    
                    <div style="margin-bottom: 25px;">
                        <label style="display: block; color: var(--text-main); font-weight: 600; margin-bottom: 8px;">تعليقك (اختياري)</label>
                        <textarea id="review-text" placeholder="شارك تجربتك مع الخدمة..." style="width: 100%; height: 100px; padding: 12px; border: 1px solid var(--border-color); border-radius: 8px; font-family: 'Cairo', sans-serif; resize: none; background: var(--bg-main); color: var(--text-main);"></textarea>
                    </div>

                    <div style="display: flex; gap: 12px; justify-content: flex-end;">
                        <button onclick="document.getElementById('review-modal').remove()" style="padding: 12px 25px; background: var(--border-color); color: var(--text-main); border: none; border-radius: 8px; cursor: pointer; font-weight: 600; font-family: 'Cairo', sans-serif;">الغاء</button>
                        <button onclick="submitReview(${orderId})" style="padding: 12px 25px; background: var(--primary); color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; font-family: 'Cairo', sans-serif;"><i class="fa-solid fa-check"></i> قدّم التقييم</button>
                    </div>
                </div>
            </div>
        `;
        
        const modal = document.createElement('div');
        modal.innerHTML = dialogHTML;
        document.body.appendChild(modal);
        
        // إضافة أنماط الـ keyframes
        if (!document.querySelector('style[data-modal-styles]')) {
            const style = document.createElement('style');
            style.setAttribute('data-modal-styles', 'true');
            style.textContent = `
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes slideUp { from { transform: translateY(30px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
            `;
            document.head.appendChild(style);
        }
    };

    window.updateStars = (rating) => {
        for (let i = 1; i <= 5; i++) {
            const star = document.querySelector(`.star-${i}`);
            if (star) {
                star.style.opacity = i <= rating ? '1' : '0.5';
            }
        }
    };

    window.submitReview = (orderId) => {
        const rating = parseInt(document.getElementById('rating-input').value);
        const review = document.getElementById('review-text').value.trim();

        if (rating === 0) {
            showToast('⚠️ الرجاء اختيار تقييم', 'warning');
            return;
        }

        updateOrder(orderId, {
            rating: rating,
            review: review,
            reviewedAt: new Date().toISOString()
        });

        document.getElementById('review-modal').remove();
        showToast('<i class="fa-solid fa-check"></i> شكراً لتقييمك!', 'success');
        setTimeout(() => showMyReviews(), 1000);
    };

    // ==================== دالة تحديث القائمة النشطة ====================
    function updateActiveMenu(menuId) {
        document.querySelectorAll('.side li').forEach(li => li.classList.remove('active'));
        const activeMenu = document.querySelector(`[data-menu="${menuId}"]`);
        if (activeMenu) activeMenu.classList.add('active');
    }

    // ==================== عرض المحتوى الإفتراضي ====================
    container.append(sidebar, mainContent);
    app.appendChild(container);

    renderNavbar();
    renderFooter();
    
    showUserProfile();
});

// ==================== دالة بناء السايد بار ====================
function renderUserSidebar(userName) {
    const sidebar = document.createElement("div");
    sidebar.className = "side";
    
    sidebar.innerHTML = `
        <h2 style="font-size: 24px; margin-bottom: 30px; color: var(--primary); text-align: center; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 15px;">🎯 لوحتي</h2>
        <ul style="list-style: none;">
            <li class="active" data-menu="menu-profile" style="cursor: pointer; padding: 12px 15px; border-radius: 8px; transition: 0.3s; margin-bottom: 10px; color: rgba(255,255,255,0.8); display: flex; align-items: center; gap: 10px;">
                <i class="fa-solid fa-user"></i> الملف الشخصي
            </li>
            <li data-menu="menu-orders" style="cursor: pointer; padding: 12px 15px; border-radius: 8px; transition: 0.3s; margin-bottom: 10px; color: rgba(255,255,255,0.8); display: flex; align-items: center; gap: 10px;">
                <i class="fa-solid fa-screwdriver-wrench"></i> طلباتي
            </li>
            <li data-menu="menu-reviews" style="cursor: pointer; padding: 12px 15px; border-radius: 8px; transition: 0.3s; margin-bottom: 10px; color: rgba(255,255,255,0.8); display: flex; align-items: center; gap: 10px;">
                <i class="fa-solid fa-star"></i> التقييمات
            </li>
        </ul>
    `;

    sidebar.querySelectorAll('li').forEach(li => {
        li.addEventListener('click', function() {
            document.querySelectorAll('.side li').forEach(item => item.classList.remove('active'));
            this.classList.add('active');
            
            if (this.getAttribute('data-menu') === 'menu-profile') {
                showUserProfile();
            } else if (this.getAttribute('data-menu') === 'menu-orders') {
                showMyOrders();
            } else if (this.getAttribute('data-menu') === 'menu-reviews') {
                showMyReviews();
            }
        });

        li.addEventListener('mouseenter', function() {
            this.style.background = 'rgba(255,255,255,0.1)';
            this.style.paddingRight = '25px';
        });
        li.addEventListener('mouseleave', function() {
            if (!this.classList.contains('active')) {
                this.style.background = 'none';
                this.style.paddingRight = '15px';
            }
        });
    });

    return sidebar;
}

// ==================== دالة جلب الصنايعي بواسطة ID ====================
function getProviderById(providerId) {
    const users = getUsers();
    return users.find(u => u.id === providerId);
}

// ==================== دالة فتح نافذة تعديل الملف الشخصي ====================
window.openProfileEditModal = () => {
    const currentUserData = getCurrentUser();
    
    let modalHTML = `
        <div id="edit-profile-modal" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 2000; animation: fadeIn 0.3s ease; overflow-y: auto; padding: 20px;">
            <div style="background: var(--bg-card); border-radius: 16px; padding: 40px; max-width: 600px; width: 100%; box-shadow: 0 20px 60px rgba(0,0,0,0.3); animation: slideUp 0.3s ease;">
                <h2 style="color: var(--text-main); margin-bottom: 25px; font-size: 24px;"><i class="fa-solid fa-pen"></i> تعديل البيانات الشخصية</h2>
                
                <form id="edit-profile-form" style="display: grid; gap: 20px;">
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px;">
                        <div class="form-group">
                            <label style="display: block; color: var(--text-main); font-weight: 600; margin-bottom: 8px;">الاسم الكامل</label>
                            <input type="text" id="edit-name" value="${currentUserData.name}" style="width: 100%; padding: 12px; border: 1px solid var(--border-color); border-radius: 8px; font-family: 'Cairo', Arial; background: var(--bg-main); color: var(--text-main);" required>
                        </div>
                        <div class="form-group">
                            <label style="display: block; color: var(--text-main); font-weight: 600; margin-bottom: 8px;">رقم الهاتف</label>
                            <input type="tel" id="edit-phone" value="${currentUserData.phone || ''}" placeholder="01012345678" style="width: 100%; padding: 12px; border: 1px solid var(--border-color); border-radius: 8px; font-family: 'Cairo', Arial; background: var(--bg-main); color: var(--text-main);">
                        </div>
                        <div class="form-group">
                            <label style="display: block; color: var(--text-main); font-weight: 600; margin-bottom: 8px;">المنطقة/المدينة</label>
                            <input type="text" id="edit-area" value="${currentUserData.area || ''}" placeholder="مثال: القاهرة، الجيزة" style="width: 100%; padding: 12px; border: 1px solid var(--border-color); border-radius: 8px; font-family: 'Cairo', Arial; background: var(--bg-main); color: var(--text-main);">
                        </div>
                    </div>

                    <div style="display: flex; gap: 12px; justify-content: flex-end; margin-top: 20px; padding-top: 20px; border-top: 1px solid var(--border-color);">
                        <button type="button" onclick="document.getElementById('edit-profile-modal').remove()" style="padding: 12px 25px; background: var(--border-color); color: var(--text-main); border: none; border-radius: 8px; cursor: pointer; font-weight: 600; font-family: 'Cairo', sans-serif;">الغاء</button>
                        <button type="button" onclick="saveProfileChanges()" style="padding: 12px 25px; background: var(--primary); color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; font-family: 'Cairo', sans-serif;">💾 حفظ التغييرات</button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    const modal = document.createElement('div');
    modal.innerHTML = modalHTML;
    document.body.appendChild(modal);
    
    if (!document.querySelector('style[data-edit-modal-styles]')) {
        const style = document.createElement('style');
        style.setAttribute('data-edit-modal-styles', 'true');
        style.textContent = `
            @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
            @keyframes slideUp { from { transform: translateY(30px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        `;
        document.head.appendChild(style);
    }
};

// ==================== دالة حفظ التعديلات ====================
window.saveProfileChanges = () => {
    const currentUserData = getCurrentUser();
    
    const name = document.getElementById('edit-name').value.trim();
    const phone = document.getElementById('edit-phone').value.trim();
    const area = document.getElementById('edit-area').value.trim();

    if (!name || name.length < 3) {
        showToast('⚠️ الاسم يجب أن يكون 3 أحرف على الأقل', 'warning');
        return;
    }

    if (phone && !/^01[0-2]\d{8}$/.test(phone)) {
        showToast('⚠️ صيغة رقم الهاتف غير صحيحة', 'warning');
        return;
    }

    // <i class="fa-solid fa-check"></i> إنشاء كائن المستخدم المحدّث
    const updatedUser = {
        ...currentUserData,
        name: name,
        phone: phone,
        area: area
    };

    // <i class="fa-solid fa-check"></i> تحديث currentUser في localStorage
    setCurrentUser(updatedUser);

    // <i class="fa-solid fa-check"></i> تحديث المستخدم في مصفوفة users الشاملة
    const allUsers = getUsers();
    const userIndex = allUsers.findIndex(u => u.id === currentUserData.id);
    if (userIndex !== -1) {
        allUsers[userIndex] = updatedUser;
        saveUsers(allUsers);
        console.log('<i class="fa-solid fa-check"></i> تم تحديث بيانات المستخدم في مصفوفة users');
    }

    document.getElementById('edit-profile-modal').remove();
    
    showToast('<i class="fa-solid fa-check"></i> تم حفظ التغييرات بنجاح!', 'success');
    
    setTimeout(() => {
        document.querySelectorAll('.side li')[0].click();
    }, 500);
};

console.log('<i class="fa-solid fa-check"></i> userDash.js loaded successfully');