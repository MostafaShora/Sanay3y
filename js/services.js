// <i class="fa-solid fa-check"></i> الحصول على الخدمات من localStorage (موحد مع جميع الصفحات)
const services = getServices();

// <i class="fa-solid fa-check"></i> دالة لرسم الخدمات
function renderServicesCards() {
    const gridRow = document.querySelector(".grid-row");
    if (!gridRow) return;

    gridRow.innerHTML = ''; // مسح البيانات القديمة

    // <i class="fa-solid fa-check"></i> اقرأ الخدمات الحالية من localStorage
    const currentServices = getServices();

    currentServices.forEach(function(service) {
        const card = document.createElement("a");
        card.className = "card";
        //card.href = service.href;
        card.href = `../html/providers.html?service=${encodeURIComponent(service.englishName || service.name)}`;

        const iconDiv = document.createElement("div");
        iconDiv.className = "icon";

        const img = document.createElement("img");
        img.src = service.imgSrc;
        img.alt = service.imgAlt;
        iconDiv.appendChild(img);

        const infoDiv = document.createElement("div")
        infoDiv.className = "info";

        const title = document.createElement("h3");
        title.textContent = service.name;

        const desc = document.createElement("p");
        desc.textContent = service.description;

        const button = document.createElement("button")
        button.textContent = "تصفح العمال"
        button.className = "show-details-btn"

// <i class="fa-solid fa-check"></i> استخدم englishName للـ query string
button.onclick = () => {
    const serviceEnglishName = service.englishName || service.name;
    window.location.href = `../html/providers.html?service=${encodeURIComponent(serviceEnglishName)}`;
};

infoDiv.appendChild(button);

        infoDiv.appendChild(title);
        infoDiv.appendChild(desc);
        infoDiv.appendChild(button);

        card.appendChild(iconDiv);
        card.appendChild(infoDiv);

        gridRow.appendChild(card);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    // نداء لدوال الـ shared اللي بتركب النافبار والفوتر
    if (typeof renderNavbar === 'function') renderNavbar();
    if (typeof renderFooter === 'function') renderFooter();
    //if (typeof checkSavedTheme === 'function') checkSavedTheme(); // عشان الدارك مود يشتغل
    if (typeof applySavedTheme === 'function') applySavedTheme();
    
    // <i class="fa-solid fa-check"></i> رسم الخدمات من localStorage
    renderServicesCards();

    // <i class="fa-solid fa-check"></i> الاستماع لتغييرات localStorage (تحديث في الوقت الفعلي عند تغيير الخدمات من صفحة أخرى)
    // window.addEventListener('storage', (e) => {
    //     if (e.key === 'siteServices') {
    //         renderServicesCards();
    //     }
    // });
    // <i class="fa-solid fa-check"></i> الاستماع لتحديثات الخدمات من الأدمن (Real-time)
window.addEventListener('storage', (e) => {
    if (e.key === 'siteServices') {
        console.log('<i class="fa-solid fa-rotate"></i> Services updated in another tab! Re-rendering...');
        renderServicesCards();
    }
});
});
