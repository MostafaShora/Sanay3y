// ==================== SHARED AUTH CODE ====================
// 1. تشغيل الدوال المشتركة (نافبار - فوتر - دارك مود)
document.addEventListener('DOMContentLoaded', () => {
    if (typeof renderNavbar === 'function') renderNavbar();
    if (typeof renderFooter === 'function') renderFooter();
    
    // تفعيل الدارك مود لو محفوظ
    if (typeof applySavedTheme === 'function') applySavedTheme();

    // تهيئة صفحة التسجيل
    initSignUpPage();
    
    // تهيئة صفحة استعادة كلمة السر
    initResetPage();
});

// ==================== SIGN UP LOGIC ====================

function initSignUpPage() {
    const roleSelect = document.getElementById('role');
    const providerFields = document.getElementById('providerFields');
    
    if (!roleSelect) return;
    
    // إظهار/إخفاء حقول الفني عند تغيير الدور
    roleSelect.addEventListener('change', (e) => {
        if (e.target.value === 'provider') {
            providerFields.classList.add('active');
        } else {
            providerFields.classList.remove('active');
        }
    });

    // إضافة حدث الفاليديشن على الأمس الفعلي
    const passwordField = document.getElementById('registerPassword');
    const confirmField = document.getElementById('confirmPassword');
    
    if (passwordField) {
        passwordField.addEventListener('input', (e) => {
            const strength = getPasswordStrength(e.target.value);
            const strengthEl = document.getElementById('passwordStrength');
            if (strengthEl) {
                strengthEl.textContent = strength.message;
                strengthEl.style.color = strength.score === 3 ? '#10b981' : strength.score === 2 ? '#f59e0b' : '#ef4444';
            }
        });
    }

    // تحقق من تطابق كلمات السر
    if (confirmField) {
        confirmField.addEventListener('input', () => {
            const confirmError = document.getElementById('confirmError');
            if (confirmError) {
                if (confirmField.value && passwordField.value !== confirmField.value) {
                    confirmError.textContent = '<i class="fa-solid fa-xmark"></i> كلمات السر غير متطابقة';
                    confirmError.style.color = '#ef4444';
                } else if (passwordField.value === confirmField.value && confirmField.value) {
                    confirmError.textContent = '<i class="fa-solid fa-check"></i> متطابقة';
                    confirmError.classList.add('success');
                } else {
                    confirmError.textContent = '';
                }
            }
        });
    }
}

const registerForm = document.getElementById("registerForm");

if (registerForm) {
  registerForm.addEventListener("submit", e => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("registerEmail").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const password = document.getElementById("registerPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const role = document.getElementById("role").value;

    // <i class="fa-solid fa-check"></i> التحقق الشامل
    if (!name || !email || !phone || !password || !confirmPassword || !role) {
      showToast("⚠️ يجب ملء جميع الحقول المطلوبة", "warning");
      return;
    }

    // <i class="fa-solid fa-check"></i> التحقق من اسم المستخدم
    if (!validateName(name)) {
      document.getElementById("nameError").textContent = "<i class="fa-solid fa-xmark"></i> الاسم يجب أن يكون 3+ أحرف";
      document.getElementById("nameError").style.color = "#ef4444";
      showToast("<i class="fa-solid fa-xmark"></i> الاسم غير صحيح", "error");
      return;
    }

    // <i class="fa-solid fa-check"></i> التحقق من صيغة البريد
    if (!validateEmail(email)) {
      document.getElementById("emailError").textContent = "<i class="fa-solid fa-xmark"></i> صيغة البريد غير صحيحة";
      showToast("<i class="fa-solid fa-xmark"></i> صيغة البريد الإلكتروني غير صحيحة", "error");
      return;
    }

    // <i class="fa-solid fa-check"></i> التحقق من رقم الهاتف
    if (!validatePhone(phone)) {
      document.getElementById("phoneError").textContent = "<i class="fa-solid fa-xmark"></i> صيغة الهاتف غير صحيحة (01XXXXXXXXX)";
      showToast("<i class="fa-solid fa-xmark"></i> رقم الهاتف غير صحيح", "error");
      return;
    }

    // <i class="fa-solid fa-check"></i> التحقق من تطابق كلمات السر
    if (password !== confirmPassword) {
      document.getElementById("confirmError").textContent = "<i class="fa-solid fa-xmark"></i> كلمات السر غير متطابقة";
      showToast("<i class="fa-solid fa-xmark"></i> كلمات السر غير متطابقة", "error");
      return;
    }

    // <i class="fa-solid fa-check"></i> التحقق من قوة كلمة المرور
    if (!validatePassword(password)) {
      document.getElementById("passwordError").textContent = "<i class="fa-solid fa-xmark"></i> كلمة المرور ضعيفة (6+ أحرف)";
      showToast("⚠️ كلمة المرور يجب أن تكون 6 أحرف على الأقل", "warning");
      return;
    }

    // <i class="fa-solid fa-check"></i> التحقق من وجود البريد مسبقاً
    const users = getUsers();
    if (users.some(u => u.email === email)) {
      document.getElementById("emailError").textContent = "<i class="fa-solid fa-xmark"></i> هذا البريد مسجل بالفعل";
      showToast("<i class="fa-solid fa-xmark"></i> هذا البريد مسجل بالفعل", "error");
      return;
    }

    // <i class="fa-solid fa-check"></i> إنشاء مستخدم جديد
    const newUser = {
      id: Date.now(),
      name,
      email,
      phone,
      password, // ⚠️ في production: استخدم bcrypt
      role,
      approved: role === "user" ? true : false, // العملاء موافقون مباشرة، الفنيون بحاجة تفعيل
      createdAt: new Date().toISOString()
    };

    // <i class="fa-solid fa-check"></i> إذا كان فني، أضف بيانات إضافية
    if (role === "provider") {
      const area = document.getElementById("area").value;
      const service = document.getElementById("service").value;
      
      if (!area || !service) {
        showToast("⚠️ يجب ملء بيانات الفني", "warning");
        return;
      }

      newUser.area = area;
      newUser.service = service;
      newUser.rating = 0;
      newUser.subscription = "free";
      newUser.totalOrders = 0;
      newUser.status = "inactive"; // الفني الجديد غير نشط حتى التفعيل
    }

    // <i class="fa-solid fa-check"></i> حفظ المستخدم الجديد
    users.push(newUser);
    saveUsers(users);

    // <i class="fa-solid fa-check"></i> تجميع بيانات الفني في جدول الأدمن (admin)
    if (role === "provider") {
      const pendingProviders = JSON.parse(localStorage.getItem('pendingProviders') || '[]');
      if (!pendingProviders.some(p => p.id === newUser.id)) {
        pendingProviders.push({
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          phone: newUser.phone,
          service: newUser.service,
          area: newUser.area,
          createdAt: newUser.createdAt,
          approved: false
        });
        localStorage.setItem('pendingProviders', JSON.stringify(pendingProviders));
        // إطلاق حدث لإخبار الأدمن بمستخدم جديد
        window.dispatchEvent(new Event('newProviderRegistered'));
      }
    }

    showToast(`<i class="fa-solid fa-check"></i> تم التسجيل بنجاح! ${role === "provider" ? "حسابك قيد المراجعة من الإدارة" : ""}`, "success");
    
    setTimeout(() => {
      if (role === "provider") {
        // الفني ينقله لصفحة الانتظار
        window.location.href = "sign-in.html";
      } else {
        // العميل ينقله مباشرة للوحة التحكم
        setCurrentUser(newUser);
        window.location.href = "userDash.html";
      }
    }, 1500);
  });
}

// ==================== LOGIN LOGIC ====================

const loginForm = document.getElementById("loginForm");

if (loginForm) {
  loginForm.addEventListener("submit", e => {
    e.preventDefault();

    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;

    // <i class="fa-solid fa-check"></i> التحقق من إدخال البيانات
    if (!email || !password) {
      showToast("⚠️ أدخل البريد الإلكتروني وكلمة السر", "warning");
      return;
    }

    const users = getUsers();
    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
      showToast("<i class="fa-solid fa-xmark"></i> خطأ في البريد الإلكتروني أو كلمة السر!", "error");
      return;
    }

    // <i class="fa-solid fa-check"></i> التحقق من الموافقة (للفنيين فقط)
    if (user.role === "provider" && !user.approved) {
      showToast("<i class="fa-solid fa-clock"></i> حسابك قيد المراجعة من الإدارة. يرجى الانتظار", "warning");
      return;
    }

    // <i class="fa-solid fa-check"></i> حفظ بيانات المستخدم الحالي
    setCurrentUser(user);

    // <i class="fa-solid fa-check"></i> عرض رسالة النجاح مع تأخير
    showToast(`<i class="fa-solid fa-check"></i> مرحباً بك يا ${user.name}`, "success");

    setTimeout(() => {
        if (user.role === 'admin') {
            window.location.href = "admin.html"; 
        } 
        else if (user.role === 'provider') {
            window.location.href = "providerDash.html";
        } 
        else {
            window.location.href = "userDash.html";
        }
    }, 1500);
  });
}

// ==================== RESET PASSWORD LOGIC ====================

function initResetPage() {
    const sendOtpBtn = document.getElementById('sendOtpBtn');
    const verifyOtpBtn = document.getElementById('verifyOtpBtn');
    const resetPasswordBtn = document.getElementById('resetPasswordBtn');
    const goToLoginBtn = document.getElementById('goToLoginBtn');
    const resendOtpBtn = document.getElementById('resendOtpBtn');
    const newPasswordField = document.getElementById('newPassword');

    if (!sendOtpBtn) return;

    // مرحلة 1: إرسال OTP
    if (sendOtpBtn) {
        sendOtpBtn.addEventListener('click', () => {
            const email = document.getElementById('resetEmail').value.trim();
            
            if (!email) {
                showToast("⚠️ أدخل بريد إلكتروني", "warning");
                return;
            }

            if (!validateEmail(email)) {
                showToast("<i class="fa-solid fa-xmark"></i> صيغة البريد غير صحيحة", "error");
                return;
            }

            const user = getUsers().find(u => u.email === email);

            if (!user) {
                showToast("<i class="fa-solid fa-xmark"></i> هذا البريد غير مسجل لدينا", "error");
                return;
            }

            // <i class="fa-solid fa-check"></i> توليد OTP
            const otp = Math.floor(100000 + Math.random() * 900000);

            localStorage.setItem("resetOTP", JSON.stringify({
                email,
                code: otp,
                expires: Date.now() + 10 * 60 * 1000 // 10 دقايق
            }));

            // <i class="fa-solid fa-check"></i> طباعة الرمز في console فقط (للاختبار)
            console.log("🔐 OTP للاختبار فقط:", otp);
            showToast("<i class="fa-solid fa-check"></i> تم إرسال رمز التحقق (اطلع على console)", "success");
            
            // الانتقال للمرحلة الثانية
            document.getElementById('stage1').classList.remove('active');
            document.getElementById('stage2').classList.add('active');

            // بدء المؤقت
            startOtpTimer();
        });
    }

    // مرحلة 2: التحقق من OTP
    if (verifyOtpBtn) {
        verifyOtpBtn.addEventListener('click', () => {
            const enteredOTP = document.getElementById('otpInput').value.trim();
            const storedOTP = JSON.parse(localStorage.getItem("resetOTP"));

            if (!enteredOTP) {
                showToast("⚠️ أدخل الرمز", "warning");
                return;
            }

            if (!storedOTP) {
                showToast("<i class="fa-solid fa-xmark"></i> لم يتم إرسال رمز تحقق بعد", "error");
                return;
            }

            if (Date.now() > storedOTP.expires) {
                showToast("⏰ انتهت صلاحية الرمز (10 دقايق)", "warning");
                localStorage.removeItem("resetOTP");
                return;
            }

            if (parseInt(enteredOTP) !== storedOTP.code) {
                showToast("<i class="fa-solid fa-xmark"></i> الرمز غير صحيح", "error");
                return;
            }

            showToast("<i class="fa-solid fa-check"></i> تم التحقق بنجاح!", "success");
            
            // الانتقال للمرحلة الثالثة
            document.getElementById('stage2').classList.remove('active');
            document.getElementById('stage3').classList.add('active');
        });
    }

    // مرحلة 3: إدخال كلمة السر الجديدة
    if (resetPasswordBtn) {
        resetPasswordBtn.addEventListener('click', () => {
            const newPassword = document.getElementById('newPassword').value;
            const confirmNewPassword = document.getElementById('confirmNewPassword').value;
            const storedOTP = JSON.parse(localStorage.getItem("resetOTP"));

            if (!newPassword || !confirmNewPassword) {
                showToast("⚠️ أدخل كلمة السر الجديدة وتأكيدها", "warning");
                return;
            }

            if (!validatePassword(newPassword)) {
                showToast("⚠️ كلمة السر يجب أن تكون 6+ أحرف", "warning");
                return;
            }

            if (newPassword !== confirmNewPassword) {
                showToast("<i class="fa-solid fa-xmark"></i> كلمات السر غير متطابقة", "error");
                return;
            }

            if (!storedOTP) {
                showToast("<i class="fa-solid fa-xmark"></i> حدث خطأ. حاول مرة أخرى", "error");
                return;
            }

            // <i class="fa-solid fa-check"></i> تحديث كلمة السر في قاعدة البيانات
            const users = getUsers();
            const userIndex = users.findIndex(u => u.email === storedOTP.email);

            if (userIndex === -1) {
                showToast("<i class="fa-solid fa-xmark"></i> لم نتمكن من العثور على المستخدم", "error");
                return;
            }

            users[userIndex].password = newPassword;
            users[userIndex].passwordResetAt = new Date().toISOString();
            saveUsers(users);

            localStorage.removeItem("resetOTP");

            showToast("<i class="fa-solid fa-check"></i> تم تحديث كلمة السر بنجاح!", "success");

            // الانتقال للمرحلة الرابعة (النجاح)
            document.getElementById('stage3').classList.remove('active');
            document.getElementById('stage4').classList.add('active');
        });
    }

    // الانتقال لصفحة تسجيل الدخول
    if (goToLoginBtn) {
        goToLoginBtn.addEventListener('click', () => {
            window.location.href = "sign-in.html";
        });
    }

    // إعادة إرسال OTP
    if (resendOtpBtn) {
        resendOtpBtn.addEventListener('click', () => {
            const email = document.getElementById('resetEmail').value.trim();
            if (!email) {
                showToast("⚠️ أدخل البريد الإلكتروني أولاً", "warning");
                return;
            }

            const otp = Math.floor(100000 + Math.random() * 900000);
            localStorage.setItem("resetOTP", JSON.stringify({
                email,
                code: otp,
                expires: Date.now() + 10 * 60 * 1000
            }));

            console.log("🔐 OTP الجديد:", otp);
            showToast("<i class="fa-solid fa-check"></i> تم إعادة إرسال الرمز", "success");
            document.getElementById('otpInput').value = '';
            startOtpTimer();
        });
    }

    // فاليديشن كلمة السر الجديدة
    if (newPasswordField) {
        newPasswordField.addEventListener('input', (e) => {
            const strength = getPasswordStrength(e.target.value);
            const strengthEl = document.getElementById('passwordStrengthReset');
            if (strengthEl) {
                strengthEl.textContent = strength.message;
                strengthEl.style.color = strength.score === 3 ? '#10b981' : strength.score === 2 ? '#f59e0b' : '#ef4444';
            }
        });
    }
}

// <i class="fa-solid fa-check"></i> مؤقت OTP
function startOtpTimer() {
    let remainingTime = 600; // 10 دقايق
    const timerEl = document.getElementById('otpTimer');

    if (!timerEl) return;

    const interval = setInterval(() => {
        remainingTime--;
        const minutes = Math.floor(remainingTime / 60);
        const seconds = remainingTime % 60;

        timerEl.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;

        if (remainingTime <= 0) {
            clearInterval(interval);
            timerEl.textContent = "انتهت الصلاحية";
            showToast("⏰ انتهت صلاحية الرمز", "warning");
        }
    }, 1000);
}

console.log('<i class="fa-solid fa-check"></i> auth.js loaded successfully');
