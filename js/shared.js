function renderNavbar() {
    const navContainer = document.getElementById('navbar-container');
    if (!navContainer) return;

    const nav = document.createElement('nav');

    // --- اللوجو ---
    const logoDiv = document.createElement('div');
    logoDiv.className = 'logo';
    const logoAnchor = document.createElement('a');
    logoAnchor.href = '../index.html';
    const logoImg = document.createElement('img');
    logoImg.src = '../images/Logo.png';
    logoImg.alt = 'صنايعي لوجو';
    logoImg.id = 'nav-logo';
    logoAnchor.appendChild(logoImg);
    logoDiv.appendChild(logoAnchor);

    // --- القائمة ---
    const ul = document.createElement('ul');
    const menuItems = [
        { text: 'الرئيسية', href: '../index.html' },
        { text: 'الخدمات', href: '../html/services.html' },
        { text: 'من نحن', href: '../html/about.html' },
        { text: 'اتصل بنا', href: '../html/contact.html' }
    ];
    menuItems.forEach(item => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.textContent = item.text;
        a.href = item.href;
        li.appendChild(a);
        ul.appendChild(li);
    });

    // --- الأزرار (هنا كان الخطأ) ---
    const actionsDiv = document.createElement('div');
    actionsDiv.className = 'nav-actions';

    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    if (currentUser) {
        // حالة تسجيل الدخول
        const dashboardBtn = document.createElement('button');
        dashboardBtn.textContent = 'لوحة التحكم';
        dashboardBtn.className = 'btn'; 
        dashboardBtn.onclick = () => {
            if (currentUser.role === 'admin') location.href = '../html/admin.html';
            else if (currentUser.role === 'provider') location.href = '../html/providerDash.html';
            else location.href = '../html/userDash.html';
        };

        const logoutBtn = document.createElement('button');
        logoutBtn.textContent = 'خروج';
        logoutBtn.className = 'btn btn-logout';
        logoutBtn.onclick = () => {
            localStorage.removeItem('currentUser');
            location.href = '../index.html';
        };

        actionsDiv.append(dashboardBtn, logoutBtn);
    } else {
        // حالة عدم تسجيل الدخول
        const loginBtn = document.createElement('button');
        loginBtn.textContent = 'دخول';
        loginBtn.className = 'btn';
        loginBtn.onclick = () => location.href = '../html/sign-in.html';
        
        actionsDiv.append(loginBtn);
    }

    // زرار الثيم دايماً بيتحط في الآخر
    const themeBtn = document.createElement('button');
    themeBtn.id = 'theme-btn';
    themeBtn.textContent = '🌙'; 
    themeBtn.onclick = () => {
        if (typeof toggleDarkMode === 'function') {
            toggleDarkMode();
        } else {
            console.log("دالة toggleDarkMode غير معرفة بعد");
        }
    };
    actionsDiv.appendChild(themeBtn);

    // تجميع النافبار
    nav.append(logoDiv, ul, actionsDiv);
    navContainer.innerHTML = '';
    navContainer.appendChild(nav);
}

// Footer
function renderFooter() {
    const footerContainer = document.getElementById('footer-container');
    if (!footerContainer) return;
    // 1. إنشاء عنصر الـ footer الأساسي
    const footer = document.createElement('footer');
    footer.className = 'main-footer';
    // 2. إنشاء الـ Grid الحاوية للأعمدة
    const footerGrid = document.createElement('div');
    footerGrid.className = 'footer-grid';
    // --- العمود الأول: عن المنصة واللوجو ---
    const colAbout = document.createElement('div');
    colAbout.className = 'footer-col about';
    const footerLogo = document.createElement('div');
    footerLogo.className = 'footer-logo';
    const logoImg = document.createElement('img');
    logoImg.src = '../images/Logo.png';
    const logoText = document.createElement('span');
    logoText.textContent = 'صنايعي';
    footerLogo.append(logoImg, logoText);
    const aboutP = document.createElement('p');
    aboutP.textContent = 'خدمات صنايعية محترفين لكل احتياجات منزلك. جودة عالية وأسعار مناسبة.';
    const socialLinks = document.createElement('div');
    socialLinks.className = 'social-links';
    const icons = ['fa-facebook-f', 'fa-twitter', 'fa-instagram', 'fa-linkedin-in'];
    icons.forEach(iconClass => {
        const a = document.createElement('a');
        a.href = '#';
        const i = document.createElement('i');
        i.className = `fab ${iconClass}`;
        a.appendChild(i);
        socialLinks.appendChild(a);
    });
    colAbout.append(footerLogo, aboutP, socialLinks);
    // --- العمود الثاني والثالث (القوائم) ---
    const createListCol = (title, items) => {
        const col = document.createElement('div');
        col.className = 'footer-col';
        const h3 = document.createElement('h3');
        h3.textContent = title;
        const ul = document.createElement('ul');
        items.forEach(item => {
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.textContent = item.text;
            a.href = item.href;
            li.appendChild(a);
            ul.appendChild(li);
        });
        col.append(h3, ul);
        return col;
    };
    const colLinks = createListCol('روابط سريعة', [
        { text: 'الرئيسية', href: 'index.html' },
        { text: 'الخدمات', href: 'html/services.html' },
        { text: 'من نحن', href: 'about.html' },
        { text: 'اتصل بنا', href: '../html/contact.html' }
    ]);
    const colServices = createListCol('خدماتنا', [
        { text: 'سباكة', href: '#' },
        { text: 'كهرباء', href: '#' },
        { text: 'نجارة', href: '#' },
        { text: 'نقاشة', href: '#' }
    ]);
    // --- العمود الرابع: اتصل بنا ---
    const colContact = document.createElement('div');
    colContact.className = 'footer-col';
    const h3Contact = document.createElement('h3');
    h3Contact.textContent = 'اتصل بنا';
    const ulContact = document.createElement('ul');
    ulContact.className = 'contact-info';
    const contacts = [
        { icon: 'fa-map-marker-alt', text: 'القاهرة، مصر' },
        { icon: 'fa-phone', text: '(555) 123-4567' },
        { icon: 'fa-envelope', text: 'info@sanay3y.com' }
    ];
    contacts.forEach(item => {
        const li = document.createElement('li');
        const i = document.createElement('i');
        i.className = `fas ${item.icon}`;
        li.append(i, ` ${item.text}`);
        ulContact.appendChild(li);
    });
    colContact.append(h3Contact, ulContact);
    // --- تجميع كل الأعمدة في الجريد ---
    footerGrid.append(colAbout, colLinks, colServices, colContact);
    // --- الجزء الأخير: الحقوق (Copyright) ---
    const copyrightDiv = document.createElement('div');
    copyrightDiv.className = 'footer-copyright';
    const pCopy = document.createElement('p');
    pCopy.textContent = '© 2026 جميع الحقوق محفوظة لمنصة صنايعي';
    copyrightDiv.appendChild(pCopy);
    // --- الحقن النهائي في الفوتر والصفحة ---
    footer.append(footerGrid, copyrightDiv);
    footerContainer.innerHTML = ''; 
    footerContainer.appendChild(footer);
}

// 2. منطق الدارك مود 
function toggleDarkMode() {
    const isDark = document.body.classList.toggle('dark-mode');
    localStorage.setItem('theme', isDark ? 'dark' : 'light'); // حفظ الاختيار
    updateThemeIcon(isDark);
}

function updateThemeIcon(isDark) {
    const btn = document.getElementById('theme-toggle');
    if (btn) {
        btn.innerText = isDark ? '☀️' : '🌙';
    }
}

// دالة لتطبيق الثيم المحفوظ فوراً (تُستدعى في بداية الملف)
function applySavedTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
    }
}

applySavedTheme(); // تنفيذ الثيم قبل تحميل الـ DOM لمنع الـ "Flicker"
window.addEventListener('DOMContentLoaded', () => {
    renderNavbar();
    renderFooter();
});


const componentStyles = `
<style>
:root {
    --primary: #2563eb;
    --secondary: #0f172a;
    --bg: #ffffff;
    --bg-light: #f8fafc;
    --text: #1e293b;
    --card-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); 
}

body.dark-mode {
    --bg: #0f172a;          
    --bg-light: #1e293b;
    --text: #f8fafc;
    --card-shadow: 0 4px 15px rgba(0,0,0,0.3);
}

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
}

body {
    background-color: var(--bg);
    color: var(--text);
    direction: rtl; 
    transition: all 0.3s ease;
    line-height: 1.6;
}

    /* النافبار */
    nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    padding: 15px 8%; 
    background-color: var(--bg);
    box-shadow: 0 1px 10px rgba(0, 0, 0, 0.05); 
    position: sticky;
    top: 0;
    z-index: 1000;
    transition: 0.3s;
    border-bottom: 1px solid rgba(0,0,0,0.05);
    direction: rtl; 
    }
    
    #nav-logo {
    height: 45px; 
    width: auto;
    transition: 0.3s;
    border-radius: 50%;
    }
    
    #nav-logo:hover { transform: scale(1.05); }
    
    nav ul { display: flex; list-style: none; gap: 30px; }
    
    nav ul li a { 
        text-decoration: none; 
        color: var(--text); 
        font-weight: 500; 
        font-size: 15px;
        transition: 0.3s; 
    }
    
    nav ul li a:hover { color: var(--primary); }
    
    .nav-actions { display: flex; gap: 15px; align-items: center; }
    
    .nav-actions .btn { 
    background-color: var(--primary); 
    color: white; 
    padding: 8px 18px; 
    border-radius: 8px; 
    font-weight: 600; 
    font-size: 14px;
    cursor: pointer; 
    border: none; 
    transition: 0.3s ease;
    }
    
    .nav-actions .btn:hover { background-color: #1d4ed8; } 

    .btn-logout {
    background-color: #fee2e2 !important; 
    color: #dc2626 !important; 
    border: 1px solid #fecaca !important;
    }

.btn-logout:hover {
    background-color: #dc2626 !important;
    color: white !important;
    }
    
    #theme-btn { background: none; border: none; font-size: 1.2rem; cursor: pointer; color: var(--text); }

    /* الفوتر */
    .main-footer {
        background-color: var(--secondary); 
        color: #94a3b8; 
        padding: 60px 8% 20px;
        direction: rtl;
        margin-top: 50px;
    }
    
    .footer-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 40px; margin-bottom: 40px; }
    
    .footer-col h3 { color: white; margin-bottom: 25px; font-weight: 600; }
    
    .footer-col ul { list-style: none; padding: 0; }
    .footer-col ul li { margin-bottom: 12px; }
    
    .footer-col ul li a { color: #94a3b8; text-decoration: none; transition: 0.3s; }
    .footer-col ul li a:hover { color: white; padding-right: 5px; }
    
    .footer-logo { display: flex; align-items: center; gap: 10px; margin-bottom: 20px; }
    .footer-logo img { width: 40px; border-radius: 8px; }
    
    .social-links { display: flex; gap: 12px; margin-top: 20px; }
    
    .social-links a { 
        width: 36px; height: 36px; 
        background-color: rgba(255,255,255,0.1); 
        color: white; 
        display: flex; align-items: center; justify-content: center; 
        border-radius: 50%; 
        text-decoration: none; 
        transition: 0.3s;
    }
    
    .social-links a:hover { background-color: var(--primary); transform: translateY(-3px); }
    
    .contact-info li { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
    
    .footer-copyright { 
        text-align: center; 
        border-top: 1px solid rgba(255,255,255,0.1); 
        padding-top: 25px; 
        margin-top: 20px; 
        font-size: 14px;
    }
    @media (max-width: 768px) {
        nav {
            padding: 10px 15px;
            justify-content: center; 
            gap: 10px;
        }
        nav ul {
            order: 3;
            width: 100%;
            justify-content: center;
            gap: 15px;
            margin-top: 10px;
            flex-wrap: wrap;
        }
        nav ul li a {
            font-size: 13px; 
        }
        .nav-actions {
            order: 2;
        }
        #nav-logo {
            order: 1;
            height: 35px; 
        }
    }
</style>
`;

document.head.insertAdjacentHTML('beforeend', componentStyles);