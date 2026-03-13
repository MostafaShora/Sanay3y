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
Title.innerHTML = 'تواصل معنا <i class="fa-solid fa-phone"></i>';

const Subtitle = document.createElement("p");
Subtitle.className = "subtitle";
Subtitle.textContent = "نحن هنا لمساعدتك - ابقى على تواصل معنا";

headerSection.appendChild(Title);
headerSection.appendChild(Subtitle);
container.appendChild(headerSection);

// ================= FORM =================

const pageContent = document.createElement("div");
pageContent.className = "page-content";

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

// ================= SEND HANDLER =================

submitBtn.onclick = () => {

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const message = messageInput.value.trim();
    const phone = emailInput.value; 

    if (!name) {
        showToast('<i class="fa-solid fa-xmark"></i> الرجاء إدخال الاسم', 'error');
        return;
    }

    if (!email) {
        showToast('<i class="fa-solid fa-xmark"></i> الرجاء إدخال البريد الإلكتروني', 'error');
        return;
    }

    if (!validateEmail(email)) {
        showToast('<i class="fa-solid fa-xmark"></i> صيغة البريد الإلكتروني غير صحيحة', 'error');
        return;
    }

    if (!message) {
        showToast('<i class="fa-solid fa-xmark"></i> الرجاء إدخال الرسالة', 'error');
        return;
    }

    addContactMessage({
        name,
        email,
        phone,
        subject: "رسالة من " + name,
        message
    });

    showToast('✅ تم إرسال رسالتك بنجاح! شكراً لتواصلك معنا', 'success');

    nameInput.value = '';
    emailInput.value = '';
    messageInput.value = '';
};

// ================= CONTACT BOX =================

contactBox.appendChild(title);
contactBox.appendChild(nameInput);
contactBox.appendChild(emailInput);
contactBox.appendChild(messageInput);
contactBox.appendChild(submitBtn);

pageContent.appendChild(contactBox);

// ================= INFO SYSTEM =================

const infoBox = document.createElement("div");
infoBox.className = "info-box";

const infoTitle = document.createElement("h2");
infoTitle.className = "info-title";
infoTitle.textContent = "معلومات التواصل";

function createInfoItem(iconClass, label, mainText, subText = "") {

    const item = document.createElement("div");
    item.className = "info-item";

    const iconDiv = document.createElement("div");
    iconDiv.className = "info-icon";

    const icon = document.createElement("i");
    icon.className = iconClass;

    iconDiv.appendChild(icon);

    const contentDiv = document.createElement("div");
    contentDiv.className = "info-content";

    const labelDiv = document.createElement("div");
    labelDiv.className = "info-label";
    labelDiv.textContent = label;

    const textDiv = document.createElement("div");
    textDiv.className = "info-text";
    textDiv.textContent = mainText || "---";

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

// ================= LOAD CONTACT INFO =================

const contactInfo = getContactInfo();

infoBox.appendChild(infoTitle);

infoBox.appendChild(createInfoItem("fa-solid fa-phone", "رقم الهاتف", contactInfo.phone));
infoBox.appendChild(createInfoItem("fa-solid fa-envelope", "البريد الإلكتروني", contactInfo.email));
infoBox.appendChild(createInfoItem("fa-solid fa-location-dot", "العنوان", contactInfo.address));
infoBox.appendChild(createInfoItem("fa-solid fa-clock", "ساعات العمل", contactInfo.workingHours));

// ================= LIVE UPDATE =================

window.addEventListener('contactInfoChanged', () => {

    const updated = getContactInfo();

    infoBox.innerHTML = '';
    infoBox.appendChild(infoTitle);

    infoBox.appendChild(createInfoItem("fa-solid fa-phone", "رقم الهاتف", updated.phone));
    infoBox.appendChild(createInfoItem("fa-solid fa-envelope", "البريد الإلكتروني", updated.email));
    infoBox.appendChild(createInfoItem("fa-solid fa-location-dot", "العنوان", updated.address));
    infoBox.appendChild(createInfoItem("fa-solid fa-clock", "ساعات العمل", updated.workingHours));
});

pageContent.appendChild(infoBox);
container.appendChild(pageContent);