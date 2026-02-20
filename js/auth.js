// 1. تشغيل الدوال المشتركة (نافبار - فوتر - دارك مود)
document.addEventListener('DOMContentLoaded', () => {
    if (typeof renderNavbar === 'function') renderNavbar();
    if (typeof renderFooter === 'function') renderFooter();
    
    // تفعيل الدارك مود لو محفوظ
    if (typeof applySavedTheme === 'function') applySavedTheme();
    // تحميل المستخدمين
    loadInitialUsers();
});

// helpers
function getUsers() {
  return JSON.parse(localStorage.getItem("users")) || [];
}

function saveUsers(users) {
  localStorage.setItem("users", JSON.stringify(users));
}

function setCurrentUser(user) {
  localStorage.setItem("currentUser", JSON.stringify(user));
}

//Load initial users
async function loadInitialUsers() {
  if (!localStorage.getItem("users")) {
    const res = await fetch("../jsonFiles/users.json");
    const users = await res.json();
    saveUsers(users);
  }
}
loadInitialUsers();

// Register
const registerForm = document.getElementById("registerForm");

if (registerForm) {
  registerForm.addEventListener("submit", e => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("registerEmail").value.trim();
    const password = document.getElementById("registerPassword").value;
    const role = document.getElementById("role").value;

    if (!name || !email || !password || !role) {
      alert("Please fill in all fields");
      return;
    }

    const users = getUsers();
    if (users.some(u => u.email === email)) {
      alert("Email already registered");
      return;
    }

    users.push({
      id: Date.now(),
      name,
      email,
      password,
      role,
      approved: role !== "provider"
    });

    saveUsers(users);
    alert("Registration successful");
    window.location.href = "./sign-in.html";
  });
}

//Login
// Login logic inside auth.js
const loginForm = document.getElementById("loginForm");

if (loginForm) {
  loginForm.addEventListener("submit", e => {
    e.preventDefault();

    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;

    const users = getUsers(); // دي الدالة اللي بتجيب المستخدمين من الـ LocalStorage
    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
      alert("خطأ في البريد الإلكتروني أو كلمة المرور!");
      return;
    }

    // 1. حفظ بيانات المستخدم الحالي عشان النافبار والداشبورد يحسوا بيه
    setCurrentUser(user);

    // 2. التوجيه الذكي بناءً على الرول (Role)
    alert(`مرحباً بك يا ${user.name}`);

    if (user.role === 'admin') {
        // لو أدمن يروح لصفحة الإدارة
        window.location.href = "admin.html"; 
    } 
    else if (user.role === 'provider') {
        // لو فني يروح لداشبورد الفني (الملف اللي استلمته من صاحبك)
        window.location.href = "providerDash.html";
    } 
    else {
        // لو مستخدم عادي يروح للرئيسية (أو داشبورد اليوزر لما تستلمها)
        window.location.href = "../index.html";
    }
  });
}

//Reset Password
const resetForm = document.getElementById("resetForm");
const sendOtpBtn = document.getElementById("sendOtpBtn");

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000);
}

// send OTP
if (sendOtpBtn) {
  sendOtpBtn.addEventListener("click", () => {
    const email = document.getElementById("resetEmail").value.trim();
    const user = getUsers().find(u => u.email === email);

    if (!user) {
      alert("Email not found");
      return;
    }

    const otp = generateOTP();

    localStorage.setItem("resetOTP", JSON.stringify({
      email,
      code: otp,
      expires: Date.now() + 2 * 60 * 1000
    }));

    alert("OTP sent (demo): " + otp);
  });
}

// verify OTP
if (resetForm) {
  resetForm.addEventListener("submit", e => {
    e.preventDefault();

    const enteredOTP = document.getElementById("otpInput").value;
    const storedOTP = JSON.parse(localStorage.getItem("resetOTP"));

    if (!storedOTP) {
      alert("No OTP found");
      return;
    }

    if (Date.now() > storedOTP.expires) {
      alert("OTP expired");
      localStorage.removeItem("resetOTP");
      return;
    }

    if (enteredOTP != storedOTP.code) {
      alert("Invalid OTP");
      return;
    }

    alert("OTP verified successfully");
    localStorage.removeItem("resetOTP");
    window.location.href = "../html/sign-in.html";
  });
}
