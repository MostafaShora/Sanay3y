document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-mode');
    }
});

const container=document.getElementById("sub-container");
const plansSection = document.createElement("section");
plansSection.className = "plans-section";

const plansTitle = document.createElement("h2");
plansTitle.className = "plans-title";
plansTitle.textContent = "اختر الخطة المناسبة لك";

const plansSubtitle = document.createElement("p");
plansSubtitle.className = "plans-subtitle";
plansSubtitle.textContent = "أسعار تنافسية  ";

const plansContainer = document.createElement("div");
plansContainer.className = "plans-container";

const plansData = [
    {
        name: "حساب مشترك (Plus)",
        discount: "16% خصم",
        price: "700",
        duration: "شهر كامل",
        features: [
            "اشتراك رسمي 100%",
            "جهاز واحد فقط",
            "حساب مشترك يضم 5 أفراد",
            "إخفاء سجل البحث",
            "أسرع خدمات"
        ]
    },
    {
        name: "حساب مشترك (3 Plus)",
        discount: "30% خصم",
        price: "399",
        duration: "شهراً",
        featured: true,
        features: [
            "اشتراك رسمي 100%",
            "كل مميزات الاشتراك الشهري",
            "صالحية لـ 90 يوم",
            "ضمان كامل المدة",
            "سعر اقتصادي لفترة محدودة"
        ]
    },
     {
        name: "اشتراك خاص Plus",
        discount: "35% خصم",
        price: "280",
        duration: "شهر",
        features: [
            "على إيميلك الشخصي",
            "ثبات بدون انقطاع",
            "خصوصية كاملة",
            "جميع مميزات  Plus"
        ]
    },
    {
        name: "اشتراك اعمال خاص Plus",
        discount: "84% خصم",
        price: "180",
        duration: "عرض محدود",
        features: [
            "اشتراك رسمي",
            "على إيميلك الشخصي",
            "سعر منافس جداً",
            "دعم فني متابع",
            "إعادة تفعيل فوري"
        ]
    }
];
function createPlanCard(plan) {
    const card = document.createElement("div");
    card.className = ` plan-card ${plan.featured ? 'featured' : ''}`;

    const discountBadge = document.createElement("span");
    discountBadge.className = "discount-badge";
    discountBadge.textContent = plan.discount;

    const planName = document.createElement("h3");
    planName.className = "plan-name";
    planName.textContent = plan.name;

    const planPrice = document.createElement("div");
    planPrice.className = "plan-price";
    planPrice.innerHTML = `${plan.price}<span>ج.م</span>`;

    const planDuration = document.createElement("div");
    planDuration.className = "plan-duration";
    planDuration.textContent = plan.duration;

    const featuresList = document.createElement("div");
    featuresList.className = "plan-features";
    
    plan.features.forEach(feature => {
        const p = document.createElement("p");
        p.textContent = feature;
        featuresList.appendChild(p);
    });

    const planBtn = document.createElement("a");
    planBtn.href = "#";
    planBtn.className = "plan-btn";
    planBtn.textContent = "اشترك الآن";

    card.appendChild(discountBadge);
    card.appendChild(planName);
    card.appendChild(planPrice);
    card.appendChild(planDuration);
    card.appendChild(featuresList);
    card.appendChild(planBtn);

    return card;
}

plansData.forEach(plan => {
    plansContainer.appendChild(createPlanCard(plan));
});

plansSection.appendChild(plansTitle);
plansSection.appendChild(plansSubtitle);
plansSection.appendChild(plansContainer);

container.appendChild(plansSection);