const services = [
    {
        name: "نجاره",
        description:"تصنيع و تصليح الاثاث بجوده عاليه",
       href:"../html/carpentry.html" ,
        imgSrc:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQlzjUsKOekwBroG8inAFMPIG7QcpAbvre21Q&s" ,
        imgAlt: "نجاره",

    },
    {
        name: "سباكه",
         description:"خدمات صيانة السباكة بالكامل",
        href:"../html/plumbing.html" ,
        imgSrc:"https://hewitttradeservices.com.au/wp-content/uploads/2024/12/Plumbing.webp" ,
        imgAlt: "سباكه",

    },
    {
        name: "كهرباء",
         description:"تركيب وإصلاح جميع الأعطال",
        href:"../html/electricity.html" ,
        imgSrc:"https://www.shutterstock.com/image-photo/electrician-wearing-ppe-doing-upkeep-260nw-2559786359.jpg" ,
        imgAlt: "كهرباء",

    },
    {
        name: "نقاشه",
         description:"حدث الدهانات والديكورات",
        href:"../html/painting.html" ,
        imgSrc:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSWbD3aLa7sfVKJol4XlaU4qJ6U7EVsQWJ_gg&s" ,
        imgAlt: "نقاشه",

    }
]

document.addEventListener('DOMContentLoaded', () => {
    // نداء لدوال الـ shared اللي بتركب النافبار والفوتر
    if (typeof renderNavbar === 'function') renderNavbar();
    if (typeof renderFooter === 'function') renderFooter();
    //if (typeof checkSavedTheme === 'function') checkSavedTheme(); // عشان الدارك مود يشتغل
    if (typeof applySavedTheme === 'function') applySavedTheme();
    // بعد كدة ابدأ شغل صفحة الخدمات بتاعك (fetchServices)
    const gridRow=document.querySelector(".grid-row");
    if (gridRow){
        services.forEach(function(services){
        const card=document.createElement("a");
        card.className="card";
        card.href=services.href;

        const iconDiv=document.createElement("div");
        iconDiv.className="icon";

        const img=document.createElement("img");
        img.src=services.imgSrc;
        img.alt=services.imgAlt;
        iconDiv.appendChild(img);

        const infoDiv=document.createElement("div")
        infoDiv.className="info";

        const title=document.createElement("h3");
        title.textContent= services.name;

        const desc=document.createElement("p");
        desc.textContent=services.description;

        const button=document.createElement("button")
        button.textContent="تصفح العمال";
        //button.onclick = ()=> location.href = '../html/providers.html'
        button.className = "show-details-btn"

        infoDiv.appendChild(title);
        infoDiv.appendChild(desc);
        infoDiv.appendChild(button);

        card.appendChild(iconDiv);
        card.appendChild(infoDiv);

        gridRow.appendChild(card);

        });
    }
});
