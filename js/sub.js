document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-mode');
    }

    const currentUser = getCurrentUser();
    const container = document.getElementById("sub-container");

    const plansData = [
        {
            id: 'plus-monthly',
            name: "حساب مشترك (Plus)",
            discount: "16% خصم",
            price: "700",
            duration: "شهر كامل",
            originalPrice: "833",
            features: [
                "اشتراك رسمي 100%",
                "جهاز واحد فقط",
                "حساب مشترك يضم 5 أفراد",
                "إخفاء سجل البحث",
                "أسرع خدمات"
            ]
        },
        {
            id: 'plus-3months',
            name: "حساب مشترك (3 Plus)",
            discount: "30% خصم",
            price: "399",
            duration: "ثلاث شهور",
            originalPrice: "570",
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
            id: 'private-plus',
            name: "اشتراك خاص Plus",
            discount: "35% خصم",
            price: "280",
            duration: "شهر واحد",
            originalPrice: "431",
            features: [
                "على إيميلك الشخصي",
                "ثبات بدون انقطاع",
                "خصوصية كاملة",
                "جميع مميزات Plus"
            ]
        },
        {
            id: 'business-plus',
            name: "اشتراك اعمال خاص Plus",
            discount: "84% خصم",
            price: "180",
            duration: "عرض محدود",
            originalPrice: "1125",
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
        card.className = `plan-card ${plan.featured ? 'featured' : ''}`;

        const discountBadge = document.createElement("span");
        discountBadge.className = "discount-badge";
        discountBadge.textContent = plan.discount;

        const planName = document.createElement("h3");
        planName.className = "plan-name";
        planName.textContent = plan.name;

        const planPrice = document.createElement("div");
        planPrice.className = "plan-price";
        planPrice.innerHTML = `
            <span style="text-decoration: line-through; opacity: 0.6; font-size: 0.8em;">${plan.originalPrice}</span>
            <span style="margin: 0 8px;">${plan.price}<span>ج.م</span></span>
        `;

        const planDuration = document.createElement("div");
        planDuration.className = "plan-duration";
        planDuration.textContent = plan.duration;

        const featuresList = document.createElement("div");
        featuresList.className = "plan-features";

        plan.features.forEach(feature => {
            const p = document.createElement("p");
            p.innerHTML = `<span style="color: #22c55e; margin-left: 8px;">✓</span> ${feature}`;
            featuresList.appendChild(p);
        });

        const planBtn = document.createElement("button");
        planBtn.className = "plan-btn";
        planBtn.textContent = "اشترك الآن";
        planBtn.onclick = () => {
            if (!currentUser) {
                notificationSystem.error("يجب تسجيل الدخول أولاً");
                setTimeout(() => {
                    window.location.href = '../html/sign-in.html';
                }, 1500);
                return;
            }
            openPaymentFlow(plan);
        };

        card.appendChild(discountBadge);
        card.appendChild(planName);
        card.appendChild(planPrice);
        card.appendChild(planDuration);
        card.appendChild(featuresList);
        card.appendChild(planBtn);

        return card;
    }

    // --- صفحة الخطط الأساسية ---
    function renderPlansPage() {
        container.innerHTML = '';

        const plansSection = document.createElement("section");
        plansSection.className = "plans-section";

        const plansTitle = document.createElement("h2");
        plansTitle.className = "plans-title";
        plansTitle.textContent = "اختر الخطة المناسبة لك";

        const plansSubtitle = document.createElement("p");
        plansSubtitle.className = "plans-subtitle";
        plansSubtitle.textContent = "أسعار تنافسية وخدمات متميزة";

        const plansContainer = document.createElement("div");
        plansContainer.className = "plans-container";

        plansData.forEach(plan => {
            plansContainer.appendChild(createPlanCard(plan));
        });

        // --- القسم الحالي للمستخدم ---
        if (currentUser) {
            const currentPlanSection = document.createElement("div");
            currentPlanSection.style.cssText = `
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 30px;
                border-radius: 12px;
                margin-top: 50px;
                text-align: center;
            `;

            const currentPlanText = (currentUser.subscription && currentUser.subscription.toLowerCase() !== 'free') ? 
                `<h3 style="margin-bottom: 10px;"><i class="fa-solid fa-check"></i> اشتراكك الحالي</h3>
                 <p style="font-size: 18px; margin-bottom: 15px;">${currentUser.subscription}</p>
                 <button onclick="showManageSubscription()" style="
                     padding: 10px 25px;
                     background: white;
                     color: #667eea;
                     border: none;
                     border-radius: 6px;
                     cursor: pointer;
                     font-weight: 600;
                     transition: 0.3s;
                 "><i class="fa-solid fa-list"></i> إدارة الاشتراك</button>` :
                '<h3>لا يوجد لديك اشتراك نشط</h3> <p style="margin-top: 10px;">اختر خطة مناسبة لتحسين خدماتك</p>';

            currentPlanSection.innerHTML = currentPlanText;
            plansSection.appendChild(currentPlanSection);
        }

        plansSection.appendChild(plansTitle);
        plansSection.appendChild(plansSubtitle);
        plansSection.appendChild(plansContainer);

        container.appendChild(plansSection);
    }

    // --- صفحة الدفع ---
    window.openPaymentFlow = (plan) => {
        container.innerHTML = '';

        const paymentSection = document.createElement("section");
        paymentSection.className = "payment-section";
        paymentSection.style.cssText = `
            padding: 40px 20px;
            max-width: 600px;
            margin: 0 auto;
        `;

        const backBtn = document.createElement("button");
        backBtn.textContent = "← العودة";
        backBtn.style.cssText = `
            background: none;
            border: none;
            color: var(--primary);
            cursor: pointer;
            font-weight: 600;
            margin-bottom: 20px;
            font-size: 16px;
        `;
        backBtn.onclick = renderPlansPage;

        const header = document.createElement("div");
        header.style.cssText = `
            text-align: center;
            margin-bottom: 30px;
        `;
        header.innerHTML = `
            <h2 style="margin-bottom: 10px; color: var(--text-main);"><i class="fa-solid fa-credit-card"></i> تأكيد الاشتراك</h2>
            <p style="color: var(--text-muted);">خطة: ${plan.name}</p>
        `;

        const orderSummary = document.createElement("div");
        orderSummary.style.cssText = `
            background: var(--bg-card);
            border: 1px solid var(--border-color);
            border-radius: 12px;
            padding: 20px;
            margin-bottom: 25px;
        `;
        orderSummary.innerHTML = `
            <h3 style="margin-bottom: 15px; color: var(--text-main);"><i class="fa-solid fa-list"></i> ملخص الاشتراك</h3>
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px; padding-bottom: 10px; border-bottom: 1px solid var(--border-color);">
                <span style="color: var(--text-muted);">الخطة:</span>
                <span style="color: var(--text-main); font-weight: 600;">${plan.name}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px; padding-bottom: 10px; border-bottom: 1px solid var(--border-color);">
                <span style="color: var(--text-muted);">المدة:</span>
                <span style="color: var(--text-main); font-weight: 600;">${plan.duration}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px; padding-bottom: 10px; border-bottom: 1px solid var(--border-color);">
                <span style="color: var(--text-muted);">السعر الأصلي:</span>
                <span style="color: var(--text-main); text-decoration: line-through; opacity: 0.7;">${plan.originalPrice} ج.م</span>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 18px; font-weight: bold; color: var(--primary);">
                <span>الإجمالي:</span>
                <span>${plan.price} ج.م</span>
            </div>
        `;

        const paymentMethods = document.createElement("div");
        paymentMethods.style.cssText = `
            margin-bottom: 25px;
        `;
        paymentMethods.innerHTML = `
            <h3 style="margin-bottom: 15px; color: var(--text-main);"><i class="fa-solid fa-coins"></i> وسيلة الدفع</h3>
            <div style="display: flex; flex-direction: column; gap: 10px;">
                <label style="display: flex; align-items: center; padding: 15px; background: var(--bg-card); border: 2px solid var(--primary); border-radius: 8px; cursor: pointer;">
                    <input type="radio" name="payment" value="card" checked style="margin-left: 10px;">
                    <span style="color: var(--text-main);"><i class="fa-solid fa-credit-card"></i> بطاقة ائتمان / خصم</span>
                </label>
                <label style="display: flex; align-items: center; padding: 15px; background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 8px; cursor: pointer;">
                    <input type="radio" name="payment" value="wallet" style="margin-left: 10px;">
                    <span style="color: var(--text-main);">📱 محفظة رقمية</span>
                </label>
                <label style="display: flex; align-items: center; padding: 15px; background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 8px; cursor: pointer;">
                    <input type="radio" name="payment" value="bank" style="margin-left: 10px;">
                    <span style="color: var(--text-main);">🏦 تحويل بنكي</span>
                </label>
            </div>
        `;

        const cardForm = document.createElement("div");
        cardForm.style.cssText = `
            background: var(--bg-light);
            border-radius: 12px;
            padding: 20px;
            margin-bottom: 25px;
            display: none;
        `;
        cardForm.id = "card-form";
        cardForm.innerHTML = `
            <div style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 8px; color: var(--text-main); font-weight: 600;">رقم البطاقة</label>
                <input type="text" id="card-number" placeholder="1234 5678 9012 3456" maxlength="19" style="
                    width: 100%; padding: 12px; border: 1px solid var(--border-color);
                    border-radius: 8px; background: var(--bg-card); color: var(--text-main);
                ">
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px;">
                <div>
                    <label style="display: block; margin-bottom: 8px; color: var(--text-main); font-weight: 600;">تاريخ الانتهاء</label>
                    <input type="text" id="card-expiry" placeholder="MM/YY" maxlength="5" style="
                        width: 100%; padding: 12px; border: 1px solid var(--border-color);
                        border-radius: 8px; background: var(--bg-card); color: var(--text-main);
                    ">
                </div>
                <div>
                    <label style="display: block; margin-bottom: 8px; color: var(--text-main); font-weight: 600;">CVV</label>
                    <input type="text" id="card-cvv" placeholder="123" maxlength="3" style="
                        width: 100%; padding: 12px; border: 1px solid var(--border-color);
                        border-radius: 8px; background: var(--bg-card); color: var(--text-main);
                    ">
                </div>
            </div>
            <div>
                <label style="display: block; margin-bottom: 8px; color: var(--text-main); font-weight: 600;">اسم حامل البطاقة</label>
                <input type="text" id="card-holder" placeholder="الاسم كما يظهر على البطاقة" style="
                    width: 100%; padding: 12px; border: 1px solid var(--border-color);
                    border-radius: 8px; background: var(--bg-card); color: var(--text-main);
                ">
            </div>
        `;

        // تبديل وسائل الدفع
        paymentMethods.addEventListener('change', (e) => {
            if (e.target.name === 'payment') {
                const cardFormDiv = document.getElementById('card-form');
                if (cardFormDiv) {
                    cardFormDiv.style.display = e.target.value === 'card' ? 'block' : 'none';
                }
            }
        });

        const agreeCheckbox = document.createElement("div");
        agreeCheckbox.style.cssText = `
            background: var(--bg-light);
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 25px;
            display: flex;
            align-items: flex-start;
            gap: 10px;
        `;
        agreeCheckbox.innerHTML = `
            <input type="checkbox" id="agree-terms" style="margin-top: 3px; cursor: pointer;">
            <label for="agree-terms" style="cursor: pointer; color: var(--text-muted); font-size: 14px;">
                أوافق على <a href="#" style="color: var(--primary); text-decoration: none;">شروط الاستخدام</a> و 
                <a href="#" style="color: var(--primary); text-decoration: none;">سياسة الخصوصية</a>
            </label>
        `;

        const completeBtn = document.createElement("button");
        completeBtn.textContent = "🔒 إتمام عملية الدفع";
        completeBtn.style.cssText = `
            width: 100%;
            padding: 14px;
            background: var(--primary);
            color: white;
            border: none;
            border-radius: 8px;
            font-weight: 600;
            font-size: 16px;
            cursor: pointer;
            transition: 0.3s;
            margin-bottom: 15px;
        `;
        completeBtn.onmouseover = () => completeBtn.style.background = '#1d4ed8';
        completeBtn.onmouseout = () => completeBtn.style.background = 'var(--primary)';
        completeBtn.onclick = () => processPayment(plan);

        const cancelBtn = document.createElement("button");
        cancelBtn.textContent = "الغاء";
        cancelBtn.style.cssText = `
            width: 100%;
            padding: 12px;
            background: var(--bg-light);
            color: var(--text-main);
            border: 1px solid var(--border-color);
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            transition: 0.3s;
        `;
        cancelBtn.onclick = renderPlansPage;

        paymentSection.appendChild(backBtn);
        paymentSection.appendChild(header);
        paymentSection.appendChild(orderSummary);
        paymentSection.appendChild(paymentMethods);
        paymentSection.appendChild(cardForm);
        paymentSection.appendChild(agreeCheckbox);
        paymentSection.appendChild(completeBtn);
        paymentSection.appendChild(cancelBtn);

        container.appendChild(paymentSection);
    };

    // --- معالجة الدفع ---
    window.processPayment = (plan) => {
        const agreeTerms = document.getElementById('agree-terms')?.checked;
        
        if (!agreeTerms) {
            notificationSystem.error("يجب الموافقة على شروط الاستخدام");
            return;
        }

        // محاكاة معالجة الدفع
        const processingModal = document.createElement('div');
        processingModal.style.cssText = `
            position: fixed; top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(0,0,0,0.6); display: flex; align-items: center;
            justify-content: center; z-index: 10001;
        `;
        processingModal.innerHTML = `
            <div style="background: var(--bg-card); padding: 40px; border-radius: 12px;
                        text-align: center; box-shadow: 0 10px 40px rgba(0,0,0,0.3);">
                <div style="font-size: 48px; margin-bottom: 15px; animation: spin 1s linear infinite;"><i class="fa-solid fa-clock"></i></div>
                <h3 style="color: var(--text-main); margin-bottom: 10px;">جاري معالجة الدفع...</h3>
                <p style="color: var(--text-muted);">الرجاء الانتظار</p>
            </div>
        `;
        document.body.appendChild(processingModal);

        setTimeout(() => {
            processingModal.remove();
            activateSubscription(plan);
        }, 2500);
    };

    // --- تفعيل الاشتراك ---
    window.activateSubscription = (plan) => {
        if (!currentUser) {
            notificationSystem.error("حدث خطأ في الجلسة");
            return;
        }

        const updatedUser = {
            ...currentUser,
            subscription: plan.name,
            subscriptionPlan: plan.id,
            subscriptionPrice: plan.price,
            subscriptionDate: new Date().toISOString(),
            subscriptionExpiry: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString()
        };

        setCurrentUser(updatedUser);

        const allUsers = getUsers();
        const userIndex = allUsers.findIndex(u => u.id === currentUser.id);
        if (userIndex !== -1) {
            allUsers[userIndex] = updatedUser;
            saveUsers(allUsers);
        }

        Object.assign(currentUser, updatedUser);

        // === إضافة الاشتراك إلى سجل الأرباح ===
        if (currentUser.role === 'provider') {
            addProviderSubscription({
                providerId: currentUser.id,
                providerName: currentUser.name,
                amount: parseFloat(plan.price),
                notes: plan.name
            });
        }

        notificationSystem.success("🎉 تم تفعيل اشتراكك بنجاح!", 4000);

        setTimeout(() => {
            showSuccessPage(plan);
        }, 1500);
    };

    // --- صفحة النجاح ---
    window.showSuccessPage = (plan) => {
        container.innerHTML = '';

        const successSection = document.createElement("section");
        successSection.style.cssText = `
            padding: 50px 20px;
            text-align: center;
            max-width: 500px;
            margin: 0 auto;
        `;

        successSection.innerHTML = `
            <div style="font-size: 80px; margin-bottom: 20px; animation: bounce 0.6s ease-out;"><i class="fa-solid fa-check"></i></div>
            <h2 style="color: var(--text-main); margin-bottom: 10px;">تم بنجاح!</h2>
            <p style="color: var(--text-muted); margin-bottom: 30px; font-size: 16px;">
                شكراً لك على اشتراكك في خطة <strong>${plan.name}</strong>
            </p>
            
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white;
                        border-radius: 12px; padding: 25px; margin-bottom: 30px;">
                <h3 style="margin-bottom: 15px;"><i class="fa-solid fa-chart-bar"></i> تفاصيل اشتراكك</h3>
                <div style="text-align: right; font-size: 14px;">
                    <p style="margin-bottom: 10px;"><strong>الخطة:</strong> ${plan.name}</p>
                    <p style="margin-bottom: 10px;"><strong>المبلغ:</strong> ${plan.price} ج.م</p>
                    <p style="margin-bottom: 10px;"><strong>تاريخ البدء:</strong> ${new Date().toLocaleDateString('ar-EG')}</p>
                    <p><strong>تاريخ الانتهاء:</strong> ${new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toLocaleDateString('ar-EG')}</p>
                </div>
            </div>

            <div style="display: flex; gap: 15px; flex-direction: column;">
                <button onclick="window.location.href='../html/providerDash.html'" style="
                    padding: 14px;
                    background: var(--primary);
                    color: white;
                    border: none;
                    border-radius: 8px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: 0.3s;
                ">← العودة إلى لوحة التحكم</button>
            </div>
        `;

        container.appendChild(successSection);
    };

    // --- إدارة الاشتراك ---
    window.showManageSubscription = () => {
        container.innerHTML = '';

        const manageSection = document.createElement("section");
        manageSection.style.cssText = `
            padding: 40px 20px;
            max-width: 600px;
            margin: 0 auto;
        `;

        const backBtn = document.createElement("button");
        backBtn.textContent = "← العودة";
        backBtn.style.cssText = `
            background: none;
            border: none;
            color: var(--primary);
            cursor: pointer;
            font-weight: 600;
            margin-bottom: 20px;
            font-size: 16px;
        `;
        backBtn.onclick = renderPlansPage;

        const header = document.createElement("div");
        header.style.cssText = `
            text-align: center;
            margin-bottom: 30px;
        `;
        header.innerHTML = `
            <h2 style="margin-bottom: 10px; color: var(--text-main);"><i class="fa-solid fa-list"></i> إدارة الاشتراك</h2>
        `;

        const subscriptionInfo = document.createElement("div");
        subscriptionInfo.style.cssText = `
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border-radius: 12px;
            padding: 25px;
            margin-bottom: 25px;
            text-align: center;
        `;
        subscriptionInfo.innerHTML = `
            <h3 style="margin-bottom: 15px;"><i class="fa-solid fa-check"></i> اشتراك نشط</h3>
            <p style="font-size: 18px; margin-bottom: 10px;"><strong>${currentUser.subscription}</strong></p>
            <p style="opacity: 0.9;">تاريخ الانتهاء: ${new Date(currentUser.subscriptionExpiry || Date.now()).toLocaleDateString('ar-EG')}</p>
        `;

        const options = document.createElement("div");
        options.style.cssText = `
            display: flex;
            flex-direction: column;
            gap: 10px;
        `;
        options.innerHTML = `
            <button onclick="cancelSubscription()" style="
                padding: 14px;
                background: #fca5a5;
                color: #991b1b;
                border: none;
                border-radius: 8px;
                font-weight: 600;
                cursor: pointer;
                transition: 0.3s;
            "><i class="fa-solid fa-xmark"></i> إلغاء الاشتراك</button>
        `;

        manageSection.appendChild(backBtn);
        manageSection.appendChild(header);
        manageSection.appendChild(subscriptionInfo);
        manageSection.appendChild(options);

        container.appendChild(manageSection);
    };

    // --- إلغاء الاشتراك ---
    window.cancelSubscription = () => {
        const confirmModal = document.createElement('div');
        confirmModal.style.cssText = `
            position: fixed; top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(0,0,0,0.5); display: flex; align-items: center;
            justify-content: center; z-index: 10000; direction: rtl;
        `;
        
        confirmModal.innerHTML = `
            <div style="background: var(--bg-card); padding: 30px; border-radius: 12px;
                        max-width: 400px; box-shadow: 0 10px 40px rgba(0,0,0,0.3);
                        border: 1px solid var(--border-color);">
                <h3 style="margin-bottom: 15px; color: var(--text-main);"><i class="fa-solid fa-xmark"></i> إلغاء الاشتراك</h3>
                <p style="margin-bottom: 20px; color: var(--text-muted);">هل أنت متأكد من رغبتك في إلغاء الاشتراك؟</p>
                <p style="margin-bottom: 20px; color: var(--text-muted); font-size: 14px;">ستفقد جميع المزايا المرتبطة بالخطة الحالية</p>
                <div style="display: flex; gap: 10px; justify-content: flex-end;">
                    <button onclick="event.currentTarget.closest('[data-modal-id]').remove()" style="
                        padding: 10px 20px; background: var(--bg-light); border: 1px solid var(--border-color);
                        border-radius: 6px; cursor: pointer; color: var(--text-main); font-weight: 600;">
                        الغاء
                    </button>
                    <button onclick="confirmCancelSubscription(); event.currentTarget.closest('[data-modal-id]').remove();" style="
                        padding: 10px 20px; background: #ef4444; color: white;
                        border: none; border-radius: 6px; cursor: pointer; font-weight: 600;">
                        تأكيد الإلغاء
                    </button>
                </div>
            </div>
        `;
        confirmModal.setAttribute('data-modal-id', 'cancel-subscription');
        document.body.appendChild(confirmModal);
    };

    // --- تأكيد إلغاء الاشتراك ---
    window.confirmCancelSubscription = () => {
        const updatedUser = {
            ...currentUser,
            subscription: null,
            subscriptionPlan: null,
            subscriptionPrice: null,
            subscriptionDate: null,
            subscriptionExpiry: null
        };

        setCurrentUser(updatedUser);

        const allUsers = getUsers();
        const userIndex = allUsers.findIndex(u => u.id === currentUser.id);
        if (userIndex !== -1) {
            allUsers[userIndex] = updatedUser;
            saveUsers(allUsers);
        }

        Object.assign(currentUser, updatedUser);

        // === إزالة الاشتراك من سجل الأرباح ===
        if (currentUser.role === 'provider') {
            cancelProviderSubscription(currentUser.id);
        }

        notificationSystem.success("<i class="fa-solid fa-check"></i> تم إلغاء الاشتراك بنجاح", 3000);
        setTimeout(() => renderPlansPage(), 1500);
    };

    // --- بدء التطبيق ---
    renderPlansPage();
});

// إضافة أنماط الـ CSS للـ animation
const subAnimationStyles = `
<style>
@keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}

@keyframes bounce {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.1); }
}

.plans-section {
    padding: 50px 20px;
    background-color: var(--bg);
    min-height: 100vh;
}

.plans-title {
    font-size: 2.5em;
    text-align: center;
    margin-bottom: 10px;
    color: var(--text-main);
}

.plans-subtitle {
    text-align: center;
    margin-bottom: 50px;
    color: var(--text-muted);
    font-size: 16px;
}

.plans-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 25px;
    max-width: 1200px;
    margin: 0 auto;
}

.plan-card {
    background: var(--bg-card);
    border: 2px solid var(--border-color);
    border-radius: 12px;
    padding: 25px;
    position: relative;
    display: flex;
    flex-direction: column;
    transition: all 0.3s ease;
}

.plan-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 30px rgba(0,0,0,0.1);
    border-color: var(--primary);
}

.plan-card.featured {
    border-color: var(--primary);
    background: linear-gradient(135deg, rgba(37, 99, 235, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%);
    transform: scale(1.02);
}

.discount-badge {
    position: absolute;
    top: 15px;
    right: 15px;
    background: #fbbf24;
    color: #b45309;
    padding: 5px 12px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 700;
}

.plan-name {
    font-size: 18px;
    margin-bottom: 10px;
    color: var(--text-main);
}

.plan-price {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    color: var(--primary);
    font-weight: 700;
    margin-bottom: 10px;
    margin-top: 15px;
}

.plan-price span {
    font-size: 14px;
    margin-right: 5px;
}

.plan-duration {
    text-align: center;
    color: var(--text-muted);
    margin-bottom: 20px;
    font-size: 14px;
}

.plan-features {
    flex: 1;
    margin-bottom: 20px;
}

.plan-features p {
    color: var(--text-main);
    margin-bottom: 10px;
    font-size: 14px;
    display: flex;
    align-items: center;
}

.plan-btn {
    background: var(--primary);
    color: white;
    padding: 12px;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: 0.3s;
    width: 100%;
}

.plan-btn:hover {
    background: #1d4ed8;
    transform: scale(1.02);
}

@media (max-width: 768px) {
    .plans-title {
        font-size: 1.8em;
    }
    
    .plans-container {
        grid-template-columns: 1fr;
    }
    
    .plan-card.featured {
        transform: scale(1);
    }
}
</style>
`;

document.head.insertAdjacentHTML('beforeend', subAnimationStyles);