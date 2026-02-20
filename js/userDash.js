document.addEventListener('DOMContentLoaded', () => {
    const mainContent = document.getElementById("mainContent");
    const menuBtn = document.getElementById("menuBtn");
    const sidebar = document.getElementById("sidebar");
    const buttons = document.querySelectorAll(".sidebar button[data-section]");

    // 1. التأكد من وجود المستخدم (لو مفيش مستخدم هنحط بيانات تجريبية عشان الصفحة متوقفش وأنت بتجرب)
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if (!currentUser) {
        console.warn("لم يتم العثور على مستخدم مسجل، سيتم استخدام بيانات تجريبية للمعاينة.");
        currentUser = { name: "زائر", email: "guest@example.com", role: "user" };
    }

    // 2. تحديث الاسم في السايد بار لو العنصر موجود
    const nameDisplay = document.getElementById('userNameDisplay');
    if (nameDisplay) nameDisplay.innerText = currentUser.name;

    // 3. فتح وقفل السايد بار
    if (menuBtn && sidebar) {
        menuBtn.addEventListener("click", () => {
            sidebar.classList.toggle("hide");
        });
    }

    const renderSection = (section) => {
        console.log("عرض قسم:", section); 

        if (section === "profile") {
            mainContent.innerHTML = `
                <div class="card profile-card">
                    <h2>👤 بياناتي الشخصية</h2>
                    <div class="info-group">
                        <label>الاسم الكامل:</label>
                        <p>${currentUser.name}</p>
                    </div>
                    <div class="info-group">
                        <label>البريد الإلكتروني:</label>
                        <p>${currentUser.email}</p>
                    </div>
                    <button class="btn-edit" onclick="alert('قريباً')">تعديل الملف الشخصي</button>
                </div>
            `;
        } 
        else if (section === "requests") {
            mainContent.innerHTML = `
                <div class="card">
                    <h2>🛠️ طلباتي الحالية</h2>
                    <p>لا يوجد طلبات نشطة حالياً.</p>
                </div>
            `;
        }
        else if (section === "reviews") {
            mainContent.innerHTML = `
                <div class="card">
                    <h2>⭐ تقييماتي</h2>
                    <p>لم تقم بتقييم أي صنايعي بعد.</p>
                </div>
            `;
        }
    };

    // 5. ربط الزراير بالدالة
    buttons.forEach(btn => {
        btn.addEventListener("click", (e) => {
            // بنستخدم e.currentTarget عشان نضمن إننا بنجيب الداتا حتى لو داس على الأيقونة اللي جوه الزرار
            const section = e.currentTarget.getAttribute('data-section');
            renderSection(section);
            
            // قفل السايد بار تلقائياً في الموبايل بعد الاختيار
            if (window.innerWidth < 768) {
                sidebar.classList.add("hide");
            }
        });
    });
});