document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-mode');
    }
    
    const container = document.getElementById("servicesContainer");

    // <i class="fa-solid fa-check"></i> احصل على اسم الخدمة من query string
    console.log('🔗 Current URL:', window.location.href);
    console.log('🔗 Search String:', window.location.search);
    
    const params = new URLSearchParams(window.location.search);
    const serviceEnglishName = params.get('service');
    
    console.log('📥 Query Parameters:', Array.from(params.entries()));
    console.log('🔎 Service from query:', serviceEnglishName);
    
    if (!serviceEnglishName) {
        container.innerHTML = "<div class='error-box'><p><i class="fa-solid fa-xmark"></i> خطأ: لم يتم تحديد خدمة. (أرسلت من صفحة أخرى)</p></div>";
        return;
    }

    container.innerHTML = `<div class="loading-state"><p>جاري تحميل قائمة العمال...</p></div>`;

    // <i class="fa-solid fa-check"></i> جلب البيانات من localStorage
    displayProviders(serviceEnglishName);
    
    // <i class="fa-solid fa-check"></i> الاستماع لتحديثات البيانات من صفحات أخرى (عندما يغير العامل تخصصه)
    window.addEventListener('storage', (e) => {
        if (e.key === 'users') {
            console.log('<i class="fa-solid fa-rotate"></i> ========== Users updated in another tab! ==========');
            console.log('<i class="fa-solid fa-rotate"></i> Refreshing providers list...');
            
            // إعادة تحميل البيانات من localStorage
            const updatedUsers = getUsers();
            console.log('<i class="fa-solid fa-check"></i> Reloaded users:', updatedUsers.length);
            
            // إعادة رسم قائمة العمال بالخدمة الحالية
            if (currentContainer && currentServiceName) {
                console.log('<i class="fa-solid fa-rotate"></i> Re-rendering providers for service:', currentServiceName);
                renderProviders(currentContainer, updatedUsers, currentServiceName);
            }
        }
    });
});

// <i class="fa-solid fa-check"></i> متغير عام لحفظ الـ container لاستخدامه في حدث storage
let currentContainer = null;
let currentServiceName = null;

function displayProviders(serviceEnglishName) {
    const container = document.getElementById("servicesContainer");
    if (!container) return;
    
    // <i class="fa-solid fa-check"></i> حفظ الـ container والـ service للاستخدام في حدث storage
    currentContainer = container;
    currentServiceName = serviceEnglishName;
    
    // <i class="fa-solid fa-check"></i> تأكد من وجود الخدمات في localStorage
    const services = getServices();
    console.log('<i class="fa-solid fa-chart-bar"></i> Available Services:', services.map(s => s.englishName));
    console.log('🔍 Looking for:', serviceEnglishName);
    
    // <i class="fa-solid fa-check"></i> استخدم localStorage بدل fetch من JSON
    let users = getUsers();
    
    if (users.length === 0) {
        console.warn('⚠️ No users in localStorage, loading from JSON...');
        // إذا كان localStorage فارعاً، حاول تحميل من JSON
        fetch('../jsonFiles/users.json')
            .then(res => res.json())
            .then(data => {
                saveUsers(data);
                console.log('<i class="fa-solid fa-check"></i> Users loaded and saved:', data.length);
                renderProviders(container, data, serviceEnglishName);
            })
            .catch(err => {
                console.error('<i class="fa-solid fa-xmark"></i> Error loading data:', err);
                container.innerHTML = "<p><i class="fa-solid fa-xmark"></i> خطأ في تحميل البيانات</p>";
            });
    } else {
        console.log('<i class="fa-solid fa-check"></i> Users loaded from localStorage:', users.length);
        renderProviders(container, users, serviceEnglishName);
    }
}

function renderProviders(container, users, serviceEnglishName) {
    // <i class="fa-solid fa-check"></i> احصل على الخدمات من localStorage للحصول على الاسم العربي
    let services = getServices();
    
    // 🔍 ابحث عن الخدمة بعدة طرق
    let currentService = services.find(s => 
        s.englishName && s.englishName.toLowerCase() === serviceEnglishName.toLowerCase()
    );

    // إذا لم تجد، جرّب مع DEFAULT_SERVICES مباشرة
    if (!currentService) {
        console.warn('⚠️ Service not found in localStorage, checking DEFAULT_SERVICES');
        const DEFAULT_SERVICES_LOCAL = [
            { name: "نجاره", englishName: "Carpentry" },
            { name: "سباكه", englishName: "Plumbing" },
            { name: "كهرباء", englishName: "Electricity" },
            { name: "نقاشه", englishName: "Painting" }
        ];
        currentService = DEFAULT_SERVICES_LOCAL.find(s => 
            s.englishName.toLowerCase() === serviceEnglishName.toLowerCase()
        );
    }

    if (!currentService) {
        console.error('<i class="fa-solid fa-xmark"></i> Service not found:', serviceEnglishName);
        console.log('Available services:', services.map(s => s.englishName));
        container.innerHTML = `<p class="no-data"><i class="fa-solid fa-xmark"></i> الخدمة غير موجودة: ${serviceEnglishName}</p>`;
        return;
    }

    console.log('<i class="fa-solid fa-check"></i> Found service:', currentService.name, '(Arabic: ' + currentService.name + ')');
    console.log('<i class="fa-solid fa-chart-bar"></i> Total users in system:', users.length);
    console.log('👷 Searching for providers with service:', currentService.name);

    // <i class="fa-solid fa-check"></i> فلتر العمال بناءً على اسم الخدمة العربي (أو الإنجليزي للتوافق)
    // ⚠️ نعرض جميع العمال الذين لديهم التخصص الصحيح بغض النظر عن حالة الموافقة
    const providers = users.filter(user => {
        const isProvider = user.role === "provider";
        const hasService = user.service && user.service.trim() !== "";
        const serviceMatches = hasService && (
            user.service.toLowerCase() === currentService.name.toLowerCase() || 
            user.service.toLowerCase() === currentService.englishName.toLowerCase()
        );
        
        if (isProvider && hasService) {
            console.log(`  <i class="fa-solid fa-list"></i> ${user.name}:`);
            console.log(`      role: ${user.role}`);
            console.log(`      service: ${user.service}`);
            console.log(`      approved: ${user.approved}`);
            console.log(`      matches: ${serviceMatches}`);
        }
        
        // <i class="fa-solid fa-check"></i> لا نتطلب approved = true لأن العمال الجدد قد لا يكونوا معتمدين بعد
        return isProvider && serviceMatches;
    });

    console.log('<i class="fa-solid fa-check"></i> Found ALL providers for service:', providers.length);
    const approvedCount = providers.filter(p => p.approved).length;
    const pendingCount = providers.filter(p => !p.approved).length;
    console.log(`   ✓ معتمدين (approved): ${approvedCount}`);
    console.log(`   <i class="fa-solid fa-clock"></i> في الانتظار (pending): ${pendingCount}`);
    providers.forEach(p => console.log(`      - ${p.name} (${p.approved ? '<i class="fa-solid fa-check"></i>' : '<i class="fa-solid fa-clock"></i>'})`));

    container.innerHTML = ""; // مسح رسالة التحميل

    if (providers.length === 0) {
        const serviceLabel = currentService.name || serviceEnglishName;
        container.innerHTML = `<p class="no-data">عذراً، لا يوجد فنيين متاحين حالياً لخدمة ${serviceLabel}.</p>`;
        return;
    }

    renderProviderCards(providers, container, currentService.name || serviceEnglishName);
}

function renderProviderCards(providers, container, serviceName) {
    // <i class="fa-solid fa-check"></i> فصل العمال المعتمدين والجدد
    const approved = providers.filter(p => p.approved === true);
    const pending = providers.filter(p => p.approved !== true);
    
    let html = `<h2 class="category-label">فنيين خدمة ${serviceName}</h2><div class="services-grid">`;
    
    // عرض العمال المعتمدين أولاً
    approved.forEach(person => {
        html += `
            <div class="details-section">
                <div class="handyman-card">
                    <img src="${person.image || 'https://ui-avatars.com/api/?name=' + person.name + '&background=random'}" class="avatar" alt="${person.name}">
                    <div>
                        <h3>${person.name}</h3>
                        <div class="rating"><i class="fa-solid fa-star"></i> ${person.rating || 'جديد'}</div>
                        <p class="experience">📍 المنطقة: ${person.area || 'غير محدد'}</p>
                        <p>📞 هاتف: ${person.phone || 'غير مدرج'}</p>
                    </div>
                </div>
                <button class="btn btn-primary book-btn" onclick="openBookingDialog(${person.id}, '${person.name}', '${serviceName}')">احجز الآن</button>
            </div>
        `;
    });
    
    // عرض العمال الجدد (غير المعتمدين) مع تنبيه
    pending.forEach(person => {
        html += `
            <div class="details-section" style="opacity: 0.7; border: 2px solid #ff9800;">
                <div class="handyman-card">
                    <img src="${person.image || 'https://ui-avatars.com/api/?name=' + person.name + '&background=random'}" class="avatar" alt="${person.name}">
                    <div>
                        <h3>${person.name}</h3>
                        <div class="rating"><i class="fa-solid fa-clock"></i> جديد</div>
                        <p class="experience">📍 المنطقة: ${person.area || 'غير محدد'}</p>
                        <p>📞 هاتف: ${person.phone || 'غير مدرج'}</p>
                        <p style="color: #ff9800; font-size: 12px; margin-top: 10px;"><i class="fa-solid fa-clock"></i> في انتظار موافقة الإداري</p>
                    </div>
                </div>
                <button class="btn btn-primary book-btn" disabled style="opacity: 0.5; cursor: not-allowed;" onclick="showToast('🔒 هذا العامل قيد المراجعة', 'warning')">قريباً</button>
            </div>
        `;
    });
    
    html += `</div>`;
    container.innerHTML = html;
}

// <i class="fa-solid fa-check"></i> دالة الحجز الحقيقية (بدل alert)
function openBookingDialog(providerId, providerName, serviceName) {
    const currentUser = getCurrentUser();
    
    // <i class="fa-solid fa-check"></i> التحقق من أن المستخدم عميل
    if (!currentUser) {
        showToast(" يجب تسجيل الدخول أولاً لحجز خدمة", "warning");
        setTimeout(() => {
            window.location.href = '../html/sign-in.html';
        }, 1000);
        return;
    }

    if (currentUser.role !== 'user') {
        showToast("<i class="fa-solid fa-xmark"></i> الحجز متاح للعملاء فقط", "error");
        return;
    }

    // <i class="fa-solid fa-check"></i> جلب تفاصيل الفني
    const provider = getUsers().find(u => u.id === providerId);
    if (!provider) {
        showToast("<i class="fa-solid fa-xmark"></i> الفني غير موجود", "error");
        return;
    }

    // === عرض نافذة Modal أنيقة بدلاً من prompt ===
    showBookingModal(providerId, providerName, serviceName, currentUser);
}

function showBookingModal(providerId, providerName, serviceName, currentUser) {
    // حذف أي modal قديم
    const existingModal = document.getElementById('booking-modal');
    if (existingModal) existingModal.remove();

    // إنشاء العناصر
    const modal = document.createElement('div');
    modal.id = 'booking-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.6);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        direction: rtl;
    `;

    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
        background: var(--bg-card);
        border: 1px solid var(--border-color);
        border-radius: 12px;
        padding: 30px;
        max-width: 500px;
        width: 90%;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
        max-height: 80vh;
        overflow-y: auto;
    `;

    modalContent.innerHTML = `
        <div style="text-align: right;">
            <h2 style="color: var(--text-main); margin-bottom: 10px; font-size: 24px;"><i class="fa-solid fa-list"></i> إكمال بيانات الحجز</h2>
            <p style="color: var(--text-muted); margin-bottom: 20px; font-size: 14px;">
                الفني: <strong style="color: var(--primary);">${providerName}</strong> | 
                الخدمة: <strong style="color: var(--primary);">${serviceName}</strong>
            </p>
            
            <hr style="border: none; border-top: 1px solid var(--border-color); margin: 20px 0;">

            <div style="margin-bottom: 20px;">
                <label style="display: block; margin-bottom: 8px; font-weight: 600; color: var(--text-main);">📅 اختر التاريخ <span style="color: #ef4444;">*</span></label>
                <input 
                    type="date" 
                    id="booking-date-input" 
                    style="
                        width: 100%;
                        padding: 12px;
                        border: 1px solid var(--border-color);
                        border-radius: 8px;
                        background: var(--bg-secondary);
                        color: var(--text-main);
                        font-size: 16px;
                        box-sizing: border-box;
                    "
                />
                <small style="color: #ef4444; display: none; margin-top: 5px;" id="booking-date-error">
                     يجب اختيار تاريخ
                </small>
            </div>

            <div style="margin-bottom: 20px;">
                <label style="display: block; margin-bottom: 8px; font-weight: 600; color: var(--text-main);">📝 شرح المشكلة أو الطلب <span style="color: #ef4444;">*</span></label>
                <textarea 
                    id="booking-description-input" 
                    rows="5"
                    placeholder="اشرح المشكلة بالتفصيل أو وصّف الخدمة المطلوبة..."
                    style="
                        width: 100%;
                        padding: 12px;
                        border: 1px solid var(--border-color);
                        border-radius: 8px;
                        background: var(--bg-secondary);
                        color: var(--text-main);
                        font-size: 16px;
                        box-sizing: border-box;
                        font-family: inherit;
                        resize: vertical;
                    "
                ></textarea>
                <small style="color: #ef4444; display: none; margin-top: 5px;" id="booking-desc-error">
                     يجب إدخال وصف الطلب
                </small>
            </div>

            <div style="display: flex; gap: 10px; margin-top: 25px;">
                <button 
                    id="booking-confirm-btn"
                    onclick="confirmBooking(${providerId}, '${providerName}', '${serviceName}', ${currentUser.id}, '${currentUser.name}')"
                    style="
                        flex: 1;
                        padding: 12px;
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        color: white;
                        border: none;
                        border-radius: 8px;
                        cursor: pointer;
                        font-weight: 600;
                        font-size: 16px;
                        transition: transform 0.2s;
                    "
                    onmouseover="this.style.transform='scale(1.02)'"
                    onmouseout="this.style.transform='scale(1)'"
                >
                     تأكيد الحجز
                </button>
                <button 
                    onclick="closeBookingModal()"
                    style="
                        flex: 1;
                        padding: 12px;
                        background: var(--bg-secondary);
                        color: var(--text-main);
                        border: 1px solid var(--border-color);
                        border-radius: 8px;
                        cursor: pointer;
                        font-weight: 600;
                        font-size: 16px;
                        transition: transform 0.2s;
                    "
                    onmouseover="this.style.transform='scale(1.02)'"
                    onmouseout="this.style.transform='scale(1)'"
                >
                     إلغاء
                </button>
            </div>
        </div>
    `;

    modal.appendChild(modalContent);
    document.body.appendChild(modal);

    // إغلاق عند الضغط على الخلفية
    modal.onclick = (e) => {
        if (e.target === modal) closeBookingModal();
    };

    // التركيز على حقل التاريخ
    setTimeout(() => {
        document.getElementById('booking-date-input').focus();
    }, 100);
}

function closeBookingModal() {
    const modal = document.getElementById('booking-modal');
    if (modal) {
        modal.style.opacity = '0';
        modal.style.transition = 'opacity 0.3s ease-out';
        setTimeout(() => modal.remove(), 300);
    }
}

window.confirmBooking = (providerId, providerName, serviceName, userId, userName) => {
    const dateInput = document.getElementById('booking-date-input');
    const descInput = document.getElementById('booking-description-input');
    const dateError = document.getElementById('booking-date-error');
    const descError = document.getElementById('booking-desc-error');

    // إزالة رسائل الخطأ السابقة
    dateError.style.display = 'none';
    descError.style.display = 'none';

    // التحقق من صحة المدخلات
    if (!dateInput.value) {
        dateError.style.display = 'block';
        return;
    }

    const description = descInput.value.trim();
    if (!description) {
        descError.style.display = 'block';
        return;
    }

    // تحويل التاريخ من YYYY-MM-DD إلى DD/MM/YYYY
    const dateObj = new Date(dateInput.value);
    const displayDate = dateObj.toLocaleDateString('ar-EG');

    // <i class="fa-solid fa-check"></i> إنشاء الطلب وحفظه
    const newOrder = addOrder({
        userId: userId,
        userName: userName,
        providerId: providerId,
        providerName: providerName,
        service: serviceName,
        description: description,
        date: displayDate,
        status: 'pending'
    });

    closeBookingModal();

    showToast(` تم الحجز بنجاح!\n<i class="fa-solid fa-bell"></i> معرف الطلب: #${newOrder.id}`, 'success', 4000);

    setTimeout(() => {
        window.location.href = '../html/userDash.html';
    }, 2000);
};
