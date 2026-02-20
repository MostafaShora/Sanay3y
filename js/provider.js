document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-mode');
    }
    const container = document.getElementById("servicesContainer");

    // 1. التأكد أن نوع الخدمة معرف (بيتم تعريفه جوه صفحة HTML لكل خدمة)
    if (typeof serviceType === 'undefined') {
        container.innerHTML = "<div class='error-box'><p>خطأ: نوع الخدمة غير محدد.</p></div>";
        return;
    }

    container.innerHTML = `<div class="loading-state"><p>جاري تحميل قائمة الفنيين...</p></div>`;

    // 2. جلب البيانات من ملف الـ JSON (تأكد من المسار الصحيح)
    fetch('../jsonFiles/users.json') 
        .then(response => {
            if (!response.ok) throw new Error("لم يتم العثور على ملف البيانات");
            return response.json();
        })
        .then(data => {
            // 3. تصفية الفنيين بناءً على (الدور + الموافقة + نوع الخدمة)
            // استخدمنا toLowerCase لضمان المطابقة حتى لو فيه اختلاف حروف كبيرة/صغيرة
            const providers = data.filter(user => 
                user.role === "provider" && 
                user.approved === true && 
                user.service.toLowerCase() === serviceType.toLowerCase()
            );

            container.innerHTML = ""; // مسح رسالة التحميل

            if (providers.length === 0) {
                container.innerHTML = `<p class="no-data">عذراً، لا يوجد فنيين متاحين حالياً لخدمة ${serviceType}.</p>`;
                return;
            }

            // 4. رسم الكروت
            renderProviderCards(providers, container);
        })
        .catch(error => {
            console.error('Error:', error);
            container.innerHTML = "<p>خطأ في تحميل البيانات، تأكد من تشغيل السيرفر ومسار الملف.</p>";
        });
});

function renderProviderCards(providers, container) {
    let html = `<h2 class="category-label">فنيين خدمة ${serviceType}</h2><div class="services-grid">`;
    
    providers.forEach(person => {
        html += `
            <div class="details-section">
                <div class="handyman-card">
                    <img src="${person.image || 'https://ui-avatars.com/api/?name=' + person.name + '&background=random'}" class="avatar" alt="${person.name}">
                    <div>
                        <h3>${person.name}</h3>
                        <div class="rating">⭐ ${person.rating || 'جديد'}</div>
                        <p class="experience">📍 المنطقة: ${person.area}</p>
                        <p>📞 هاتف: ${person.phone}</p>
                    </div>
                </div>
                <button class="btn btn-primary book-btn" onclick="alert('سيتم التواصل مع ${person.name} قريباً')">احجز الآن</button>
            </div>
        `;
    });
    
    html += `</div>`;
    container.innerHTML = html;
}