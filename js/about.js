document.addEventListener('DOMContentLoaded', () => {
    // تطبيق الدارك مود فور التحميل
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-mode');
    }
});

const aboutData = {
    hero: {
        title: "عن منصتنا",
        subtitle: "شريكك الموثوق به لجميع احتياجات صيانة وإصلاح منزلك"
    },
    story: {
        image: "../images/img.jpeg",
        title: "قصتنا",
          text: "نحن منصة إلكترونية متخصصة في تسهيل الوصول إلى مقدمي الخدمات المنزلية الموثوقين بكل سهولة وسرعة. نسعى إلى توفير تجربة آمنة ومريحة لأصحاب المنازل من خلال ربطهم بمحترفين ذوي خبرة عالية وجودة مضمونة. هدفنا هو بناء بيئة موثوقة تجمع بين الكفاءة والشفافية لتلبية احتياجات العملاء بأفضل صورة ممكنه"
    },
    values: [
        { icon: "🎯", title: "مهمتنا", desc: "تقديم خدمات إصلاح منازل استثنائية تتجاوز توقعات العملاء."  },
        {  icon: "❤️", title: "العميل أولاً", desc: "كل قرار نتخذه يبدأ بوضع عملائنا واحتياجاتهم في المقدمة." },
        { icon: "💡", title: "جودة العمل", desc: "نحن نفخر بتقديم أعلى مستويات الجودة والاحترافية في كل مهمة." },
        {  icon: "🤝", title: "روح الفريق",  desc: "نؤمن بالتعاون، والاحترام المتبادل، والسعي المستمر نحو التطور."  }
    ],
    team: [
        { name: "Khalaf Hussein", role: "Tech Lead", exp: "15 years experience" },
        { name: "Mostafa Shora", role: "Web Develepor", exp: "12 years experience" },
        { name: "Ereni Nady ", role: "Web Develepor", exp: "18 years experience" },
        { name: "Asmaa Khodary", role: "Web Develepor", exp: "15 years experience" }
    ],
    stats: [
        { value: "10,000+", label: "عملاء سعيدون بنا" },
        { value: "100+", label: "خبراء فالعمل" },
        { value: "50,000+", label: "الوظائف المكتملة" },
        { value: "4.9/5", label: "متوسط ​​التقييم" }
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
        <div class="team-img-placeholder"></div>
        <h3>${t.name}</h3>
        <p class="role">${t.role}</p>
        <p class="exp">${t.exp}</p>
    </div>
`).join('');

const teamHtml = `
    <section class="team-section">
        <h2>Meet Our Team</h2>
        <p class="section-sub">محترفون ماهرون متفانون في خدمتكم</p>
        <div class="team-grid">${teamCards}</div>
    </section>
`;

// 5. Stats Bar
let statsItems = aboutData.stats.map(s => `
    <div class="stat-item">
        <h3>${s.value}</h3>
        <p>${s.label}</p>
    </div>
`).join('');

const statsHtml = `<section class="stats-bar">${statsItems}</section>`;

// تجميع كل الأقسام وحقنها في الـ HTML مرة واحدة
container.innerHTML = heroHtml + storyHtml + valuesHtml + teamHtml + statsHtml;