document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-mode');
    }
    const container = document.getElementById("servicesContainer");

    // 1. التأكد أن نوع الخدمة معرف (بيتم تعريفه جوه صفحة HTML لكل خدمة)
    if (typeof serviceType === 'undefined') {
        container.innerHTML = `<div cladocumentss='error-box'><p> <i class="fa-solid fa-xmark"></i> خطأ: نوع الخدمة غير محدد.</p></div>`;
        return;
    }

    container.innerHTML = `<div class="loading-state"><p>جاري تحميل قائمة الفنيين...</p></div>`;

    // 2. <i class="fa-solid fa-check"></i> جلب البيانات من localStorage، لا من JSON المباشر
    displayProviders();
});

function displayProviders() {
    const container = document.getElementById("servicesContainer");
    if (!container) return;
    
    // <i class="fa-solid fa-check"></i> استخدم localStorage بدل fetch من JSON
    const users = getUsers();
    
    if (users.length === 0) {
        // إذا كان localStorage فارعاً، حاول تحميل من JSON
        fetch('../jsonFiles/users.json')
            .then(res => res.json())
            .then(data => {
                saveUsers(data);
                renderProviders(container, data);
            })
            .catch(err => {
                console.error('Error loading data:', err);
                container.innerHTML = `<p><i class="fa-solid fa-xmark"></i> خطأ في تحميل البيانات</p>`;
            });
    } else {
        renderProviders(container, users);
    }
}

function renderProviders(container, users) {
    // <i class="fa-solid fa-check"></i> احصل على الخدمات من localStorage للحصول على englishName
    const services = getServices();
    const currentService = services.find(s => 
        s.englishName && s.englishName.toLowerCase() === serviceType.toLowerCase()
    );

    const providers = users.filter(user => 
        user.role === "provider" && 
        user.approved === true && 
        user.service && 
        // قارن بالاسم العربي من localStorage
        (user.service.toLowerCase() === currentService?.name?.toLowerCase() ||
         user.service.toLowerCase() === serviceType.toLowerCase())
    );

    container.innerHTML = ""; // مسح رسالة التحميل

    if (providers.length === 0) {
        const serviceLabel = currentService?.name || translateService(serviceType);
        container.innerHTML = `<p class="no-data">عذراً، لا يوجد فنيين متاحين حالياً لخدمة ${serviceLabel}.</p>`;
        return;
    }

    renderProviderCards(providers, container);
}

function renderProviderCards(providers, container) {
    const services = getServices();
    const currentService = services.find(s => 
        s.englishName && s.englishName.toLowerCase() === serviceType.toLowerCase()
    );
    const serviceLabel = currentService?.name || translateService(serviceType);
    
    let html = `<h2 class="category-label">فنيين خدمة ${serviceLabel}</h2><div class="services-grid">`;
    
    providers.forEach(person => {
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
                <button class="btn btn-primary book-btn" onclick="openBookingDialog(${person.id}, '${person.name}', '${serviceLabel}')">احجز الآن</button>
            </div>
        `;
    });
    
    html += `</div>`;
    container.innerHTML = html;
}

// <i class="fa-solid fa-check"></i> دالة الحجز الحقيقية (بدل alert)
function openBookingDialog(providerId, providerName, serviceType) {
    const currentUser = getCurrentUser();
    
    // <i class="fa-solid fa-check"></i> التحقق من أن المستخدم عميل
    if (!currentUser) {
        showToast("⚠️ يجب تسجيل الدخول أولاً لحجز خدمة", "warning");
        setTimeout(() => {
            window.location.href = '../html/sign-in.html';
        }, 1000);
        return;
    }

    if (currentUser.role !== 'user') {
        showToast('<i class="fa-solid fa-xmark"></i> الحجز متاح للعملاء فقط", "error');
        return;
    }

    // <i class="fa-solid fa-check"></i> جلب تفاصيل الفني
    const provider = getUsers().find(u => u.id === providerId);
    if (!provider) {
        showToast('<i class="fa-solid fa-xmark"></i> الفني غير موجود", "error');
        return;
    }

    // سؤال عن التاريخ والوصف
    const bookingDate = prompt(`متى تريد خدمة ${translateService(serviceType)} من ${providerName}?\n(صيغة: DD/MM/YYYY)`);
    if (!bookingDate) return;

    const bookingDescription = prompt("وصف إضافي للطلب (اختياري):") || "";

    // تأكيد من العميل
    const confirmed = confirm(
        `تأكيد الحجز:\n` +
        `الفني: ${providerName}\n` +
        `الخدمة: ${translateService(serviceType)}\n` +
        `التاريخ: ${bookingDate}\n\n` +
        `هل تريد تأكيد الحجز؟`
    );

    if (!confirmed) {
        showToast("⚠️ تم إلغاء الحجز", "warning");
        return;
    }

    // <i class="fa-solid fa-check"></i> إنشاء الطلب وحفظه
    const newOrder = addOrder({
        userId: currentUser.id,
        userName: currentUser.name,
        providerId: providerId,
        providerName: providerName,
        serviceType: serviceType,
        description: bookingDescription,
        date: bookingDate,
        status: 'pending'
    });

    showToast(`<i class="fa-solid fa-check"></i> تم الحجز بنجاح!\nمعرف الطلب: #${newOrder.id}`, "success");

    setTimeout(() => {
        window.location.href = '../html/userDash.html';
    }, 2000);
}