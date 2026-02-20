document.addEventListener('DOMContentLoaded', () => {
    if (typeof renderNavbar === 'function') renderNavbar();
    if (typeof renderFooter === 'function') renderFooter();
    if (typeof applySavedTheme === 'function') applySavedTheme();
});

const container = document.getElementById("contact-container");

const headerSection = document.createElement("section");
headerSection.className = "contact-header";
const Title = document.createElement("h1");
Title.className = "title";
Title.textContent = " تواصل معنا📞";

const Subtitle = document.createElement("p");
Subtitle.className = "subtitle";
Subtitle.textContent = "نحن هنا لمساعدتك - ابقى على تواصل معنا";

headerSection.appendChild(Title);
headerSection.appendChild(Subtitle);
container.appendChild(headerSection);

const pageContent=document.createElement("div");
pageContent.className="page-content";

const contactBox = document.createElement("div");
contactBox.className = "contact-box";

const title = document.createElement("h2");
title.className = "contact-title";
title.textContent = "اتصل بنا";

const nameInput = document.createElement("input");
nameInput.type = "text";
nameInput.className = "form-input";
nameInput.placeholder = "الاسم الكامل";

const emailInput = document.createElement("input");
emailInput.type = "email";
emailInput.className = "form-input";
emailInput.placeholder = "البريد الإلكتروني";

const messageInput = document.createElement("textarea");
messageInput.className = "form-input";
messageInput.placeholder = "رسالتك...";
messageInput.rows = 5;

const submitBtn = document.createElement("button");
submitBtn.className = "submit-btn";
submitBtn.textContent = "إرسال الرسالة";


contactBox.appendChild(title);
contactBox.appendChild(nameInput);
contactBox.appendChild(emailInput);
contactBox.appendChild(messageInput);
contactBox.appendChild(submitBtn);

container.appendChild(contactBox);
const infoBox=document.createElement("div");
infoBox.className="info-box";
const infoTitle = document.createElement("h2");
infoTitle.className = "info-title";
infoTitle.textContent = "معلومات التواصل";

function createInfoItem(icon, label, mainText, subText = "") {
    const item = document.createElement("div");
    item.className = "info-item";
    
    const iconDiv = document.createElement("div");
    iconDiv.className = "info-icon";
    iconDiv.textContent = icon;
    
    const contentDiv = document.createElement("div");
    contentDiv.className = "info-content";
    
    const labelDiv = document.createElement("div");
    labelDiv.className = "info-label";
    labelDiv.textContent = label;
    
    const textDiv = document.createElement("div");
    textDiv.className = "info-text";
    textDiv.textContent = mainText;
    
    contentDiv.appendChild(labelDiv);
    contentDiv.appendChild(textDiv);
    
    if (subText) {
        const subDiv = document.createElement("div");
        subDiv.className = "info-sub";
        subDiv.textContent = subText;
        contentDiv.appendChild(subDiv);
    }
    
    item.appendChild(iconDiv);
    item.appendChild(contentDiv);
    
    return item;
}

infoBox.appendChild(infoTitle);
infoBox.appendChild(createInfoItem("📞", "رقم الهاتف", "012 3456 7890", "011 2345 6789"));
infoBox.appendChild(createInfoItem("✉️", "البريد الإلكتروني", "info@sanay3y.com"));
infoBox.appendChild(createInfoItem("📍", "العنوان", "مصر، قنا"));
infoBox.appendChild(createInfoItem("⏰", "ساعات العمل", "السبت - الخميس: ٩ص - ٦م", "الجمعة: إجازة"));

pageContent.appendChild(contactBox);
pageContent.appendChild(infoBox);
container.appendChild(pageContent);
