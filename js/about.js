document.addEventListener('DOMContentLoaded', () => {
    // تطبيق الدارك مود والـ Navbar والـ Footer
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-mode');
    }
    if (typeof renderNavbar === 'function') renderNavbar();
    if (typeof renderFooter === 'function') renderFooter();
    if (typeof applySavedTheme === 'function') applySavedTheme();
});

const aboutData = {
    hero: {
        title: " عن منصتنا ",
        subtitle: "شريكك الموثوق به لجميع احتياجات صيانة وإصلاح منزلك بكل سهولة وأمان"
    },
    story: {
        image: "../images/img.jpeg",
        title: "قصتنا",
        text: "منصة صنايعي هي منصة إلكترونية رائدة متخصصة في تسهيل الوصول إلى مقدمي الخدمات المنزلية الموثوقين بكل سهولة وسرعة. نسعى إلى توفير تجربة آمنة ومريحة للعملاء من خلال ربطهم بمحترفين ذوي خبرة عالية وجودة مضمونة. هدفنا هو بناء بيئة موثوقة تجمع بين الكفاءة والشفافية والاحترافية لتلبية احتياجات العملاء بأفضل صورة ممكنة."
    },
    values: [
        { icon: "", title: "مهمتنا", desc: "تقديم خدمات إصلاح وصيانة منزلية استثنائية تتجاوز توقعات العملاء وتحقق رضاهم الكامل."  },
        {  icon: "", title: "العميل أولاً", desc: "كل قرار نتخذه يبدأ بوضع عملائنا واحتياجاتهم في المقدمة دائماً وأبداً." },
        { icon: "", title: "جودة العمل", desc: "نحن نفخر بتقديم أعلى مستويات الجودة والاحترافية والدقة في كل مهمة نقوم بها." },
        {  icon: "", title: "روح الفريق",  desc: "نؤمن بالتعاون والاحترام المتبادل والسعي المستمر نحو التطور والابتكار."  }
    ],
    team: [
        { name: "خلف حسين", role: "مؤسس ومدير المشروع", exp: "8 سنوات خبرة في مجال الخدمات المنزلية"},
        { name: "مصطفي شوري", role: "مسؤول تطوير البرنامج", exp: "5 سنوات خبرة في تطوير الويب والتطبيقات" },
        { name: "ايريني نادي", role: "مدير العمليات", exp: "6 سنوات خبرة في إدارة المشاريع" },
        { name: "اسماء خضري", role: "مسؤولة خدمة العملاء", exp: "4 سنوات خبرة في التعامل مع العملاء" }
    ],
    stats: [
        { value: "10,000+", label: "عملاء سعيدون بنا" },
        { value: "100+", label: "خبراء محترفون" },
        { value: "50,000+", label: "الوظائف المكتملة" },
        { value: "4.9/5", label: "متوسط التقييم" }
    ]
};

const container = document.getElementById("aboutUs");

// 1. Hero Section
const heroHtml = `
    <section class="about-hero">
        <h1>${aboutData.hero.title}</h1>
        <p>${aboutData.hero.subtitle}</p>
    </section>
`;

// 2. Our Story Section
const storyHtml = `
    <section class="story-section">
        <div class="story-content">
            <div class="story-text">
                <h2>${aboutData.story.title}</h2>
                <p>${aboutData.story.text}</p>
            </div>
            <div class="story-image">
                <img src="${aboutData.story.image}" alt="Our Story">
            </div>
        </div>
    </section>
`;

// 3. Mission & Values Section
let valuesCards = aboutData.values.map(v => `
    <div class="value-card">
        <div class="value-icon">${v.icon}</div>
        <h3>${v.title}</h3>
        <p>${v.desc}</p>
    </div>
`).join('');

const valuesHtml = `
    <section class="values-section">
        <h2>مهمتنا وقيمنا</h2>
        <p class="section-sub">نحن مدفوعون بقيم أساسية توجه كل ما نقوم به</p>
        <div class="values-grid">${valuesCards}</div>
    </section>
`;

// 4. Team Section
let teamCards = aboutData.team.map(t => `
    <div class="team-card">
        <div class="team-img-placeholder">
            <div style="font-size: 40px; line-height: 80px;"><i class="fa-solid fa-user"></i></div>
        </div>
        <h3>${t.name}</h3>
        <p class="role" style="color: var(--primary); font-weight: 600; margin: 8px 0;">${t.role}</p>
        <p class="exp" style="color: var(--text-muted); font-size: 13px;">${t.exp}</p>
    </div>
`).join('');

const teamHtml = `
    <section class="team-section">
        <h2>👨‍<i class="fa-solid fa-briefcase"></i> فريقنا المتميز</h2>
        <p class="section-sub">محترفون ماهرون متفانون في خدمتكم وتحقيق رؤيتنا المشتركة</p>
        <div class="team-grid">${teamCards}</div>
    </section>
`;

// 5. Stats Bar
let statsItems = aboutData.stats.map((s, i) => {
    const icons = ['', '', '', ''];
    return `
        <div class="stat-item">
            <div style="font-size: 28px; margin-bottom: 10px;">${icons[i]}</div>
            <h3>${s.value}</h3>
            <p>${s.label}</p>
        </div>
    `;
}).join('');

const statsHtml = `
    <section class="stats-bar">
        <h2 style="text-align: center; margin-bottom: 40px; font-size: 28px; width: 100%;"><i class="fa-solid fa-chart-bar"></i> إحصائياتنا</h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; max-width: 1000px; margin: 0 auto; width: 100%;">
            ${statsItems}
        </div>
    </section>
`;

// تجميع كل الأقسام وحقنها في الـ HTML مرة واحدة
container.innerHTML = heroHtml + storyHtml + valuesHtml + teamHtml + statsHtml;