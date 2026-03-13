/**
 * 🔧 UTILITY FUNCTIONS & STATE MANAGEMENT
 * ملف مشترك لجميع الدوال الأساسية
 * يتم استدعاؤه أولاً قبل أي ملفات أخرى
 */

// ==================== USER FUNCTIONS ====================

function getCurrentUser() {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
}

function setCurrentUser(user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
}

function getUsers() {
    const users = localStorage.getItem('users');
    return users ? JSON.parse(users) : [];
}

function saveUsers(users) {
    if (!Array.isArray(users)) {
        console.error('<i class="fa-solid fa-xmark"></i> saveUsers: Expected array, got', typeof users);
        return false;
    }
    localStorage.setItem('users', JSON.stringify(users));
    return true;
}

// ==================== ORDER FUNCTIONS ====================

function getOrders() {
    const orders = localStorage.getItem('orders');
    return orders ? JSON.parse(orders) : [];
}

function saveOrders(orders) {
    if (!Array.isArray(orders)) {
        console.error('<i class="fa-solid fa-xmark"></i> saveOrders: Expected array');
        return false;
    }
    localStorage.setItem('orders', JSON.stringify(orders));
    return true;
}

function addOrder(orderData) {
    const orders = getOrders();
    const newOrder = {
        id: Date.now(),
        ...orderData,
        createdAt: new Date().toISOString(),
        status: orderData.status || 'pending'
    };
    orders.push(newOrder);
    saveOrders(orders);
    return newOrder;
}

function getOrdersByUser(userId) {
    const orders = getOrders();
    return orders.filter(o => o.userId === userId);
}

function getOrdersByProvider(providerId) {
    const orders = getOrders();
    return orders.filter(o => o.providerId === providerId);
}

function updateOrderStatus(orderId, newStatus) {
    const orders = getOrders();
    const updated = orders.map(o => 
        o.id === orderId ? {...o, status: newStatus, updatedAt: new Date().toISOString()} : o
    );
    saveOrders(updated);
    return updated.find(o => o.id === orderId);
}

function updateOrder(orderId, updates) {
    const orders = getOrders();
    const updated = orders.map(o => 
        o.id === orderId ? {...o, ...updates, updatedAt: new Date().toISOString()} : o
    );
    saveOrders(updated);
    return updated.find(o => o.id === orderId);
}

function deleteOrder(orderId) {
    const orders = getOrders();
    const filtered = orders.filter(o => o.id !== orderId);
    saveOrders(filtered);
    return true;
}

// ==================== SERVICE FUNCTIONS ====================

// <i class="fa-solid fa-check"></i> الخدمات الافتراضية
const DEFAULT_SERVICES = [
    {
        name: "نجاره",
        englishName: "Carpentry",
        description:"تصنيع و تصليح الاثاث بجوده عاليه",
        href:"../html/carpentry.html",
        imgSrc:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQlzjUsKOekwBroG8inAFMPIG7QcpAbvre21Q&s",
        imgAlt: "نجاره",
    },
    {
        name: "سباكه",
        englishName: "Plumbing",
        description:"خدمات صيانة السباكة بالكامل",
        href:"../html/plumbing.html",
        imgSrc:"https://hewitttradeservices.com.au/wp-content/uploads/2024/12/Plumbing.webp",
        imgAlt: "سباكه",
    },
    {
        name: "كهرباء",
        englishName: "Electricity",
        description:"تركيب وإصلاح جميع الأعطال",
        href:"../html/electricity.html",
        imgSrc:"https://www.shutterstock.com/image-photo/electrician-wearing-ppe-doing-upkeep-260nw-2559786359.jpg",
        imgAlt: "كهرباء",
    },
    {
        name: "نقاشه",
        englishName: "Painting",
        description:"حدث الدهانات والديكورات",
        href:"../html/painting.html",
        imgSrc:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSWbD3aLa7sfVKJol4XlaU4qJ6U7EVsQWJ_gg&s",
        imgAlt: "نقاشه",
    }
];

function getServices() {
    let services = localStorage.getItem('siteServices');
    if (services) {
        return JSON.parse(services);
    }
    // إذا لم تكن موجودة، احفظ الافتراضية وأرجعها
    localStorage.setItem('siteServices', JSON.stringify(DEFAULT_SERVICES));
    return DEFAULT_SERVICES;
}

function saveServices(services) {
    if (!Array.isArray(services)) {
        console.error('<i class="fa-solid fa-xmark"></i> saveServices: Expected array, got', typeof services);
        return false;
    }
    localStorage.setItem('siteServices', JSON.stringify(services));
    return true;
}

// ==================== VALIDATION FUNCTIONS ====================

// <i class="fa-solid fa-check"></i> فاليديشن متقدم للإيميل
function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// <i class="fa-solid fa-check"></i> فاليديشن قوي لكلمة المرور
function validatePassword(password) {
    // يجب أن تكون كلمة المرور 6+ أحرف على الأقل
    return password && password.length >= 6;
}

function getPasswordStrength(password) {
    if (!password) return { score: 0, message: '⚠️ أدخل كلمة سر' };
    if (password.length < 6) return { score: 1, message: '<i class="fa-solid fa-xmark"></i> ضعيفة (6+ أحرف على الأقل)' };
    if (password.length < 8) return { score: 2, message: '⚠️ متوسطة' };
    if (/[A-Z]/.test(password) && /[0-9]/.test(password)) {
        return { score: 3, message: '<i class="fa-solid fa-check"></i> قوية جداً' };
    }
    return { score: 2, message: '⚠️ متوسطة' };
}

// <i class="fa-solid fa-check"></i> فاليديشن لرقم الهاتف المصري
function validatePhone(phone) {
    // قبول الصيغ: 01XXXXXXXXX أو +20-1X-XXXXXXXX
    const cleanPhone = phone.replace(/\s+/g, '').replace(/-/g, '');
    const regex = /^(201[0-2]\d{8}|01[0-2]\d{8})$/;
    return regex.test(cleanPhone);
}

// <i class="fa-solid fa-check"></i> فاليديشن لاسم المستخدم
function validateName(name) {
    // يجب أن يحتوي على 3+ أحرف على الأقل
    return name && name.trim().length >= 3;
}

function isValidUser(user) {
    return user && user.id && user.email && user.role;
}

// ==================== AUTH & PERMISSIONS ====================

function checkAuthAndRedirect(requiredRole = null) {
    const currentUser = getCurrentUser();
    
    if (!currentUser) {
        console.warn('⚠️ User not logged in');
        window.location.href = '../html/sign-in.html';
        return false;
    }
    
    if (requiredRole && currentUser.role !== requiredRole) {
        console.warn(`⚠️ Unauthorized role. Expected: ${requiredRole}, Got: ${currentUser.role}`);
        window.location.href = '../index.html';
        return false;
    }
    
    return currentUser;
}

// ==================== SERVICE TRANSLATION ====================

const SERVICE_NAMES = {
    "plumbing": "سباك",
    "electricity": "كهربائي",
    "carpentry": "نجار",
    "painting": "نقاش",
    "cleaning": "خدمات نظافة",
    "gardening": "خدمات البستنة"
};

function translateService(serviceType) {
    if (!serviceType) return '---';
    const key = serviceType.toLowerCase();
    return SERVICE_NAMES[key] || serviceType;
}

// ==================== DATA INITIALIZATION ====================

function initializeApp() {
    // <i class="fa-solid fa-check"></i> تهيئة جداول البيانات إذا لم تكن موجودة
    if (!localStorage.getItem('users')) {
        // تصنع مستخدمي اختبار
        const demoUsers = [
            {
                id: 1,
                name: 'محمد أحمد',
                email: 'test@email.com',
                phone: '01001234567',
                password: 'password123',
                role: 'user',
                approved: true,
                createdAt: new Date().toISOString()
            },
            {
                id: 2,
                name: 'أدمن صنايعي',
                email: 'admin@sanay3y.com',
                phone: '01115551234',
                password: 'admin123',
                role: 'admin',
                approved: true,
                createdAt: new Date().toISOString()
            },
            {
                id: 3,
                name: 'أحمد السباك',
                email: 'plumber@test.com',
                phone: '01201234567',
                password: 'provider123',
                role: 'provider',
                approved: true,
                area: 'cairo',
                service: 'plumbing',
                rating: 4.5,
                subscription: 'premium',
                totalOrders: 15,
                status: 'active',
                createdAt: new Date().toISOString()
            }
        ];
        localStorage.setItem('users', JSON.stringify(demoUsers));
    }
    
    if (!localStorage.getItem('orders')) {
        localStorage.setItem('orders', JSON.stringify([]));
    }
    
    if (!localStorage.getItem('theme')) {
        localStorage.setItem('theme', 'light');
    }
}

// <i class="fa-solid fa-check"></i> استدعِ التهيئة فوراً
initializeApp();

// ==================== LOAD INITIAL DATA ====================

async function loadInitialUsersIfNeeded() {
    const users = getUsers();
    
    // إذا كانت البيانات فارغة، حمّل من JSON
    if (users.length === 0) {
        try {
            const response = await fetch('../jsonFiles/users.json');
            if (!response.ok) throw new Error('Failed to load users.json');
            
            const initialUsers = await response.json();
            saveUsers(initialUsers);
            console.log('<i class="fa-solid fa-check"></i> Initial users loaded from JSON');
        } catch (error) {
            console.error('⚠️ Could not load initial users:', error);
        }
    }
}

// استدعِ عند تحميل أي صفحة
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadInitialUsersIfNeeded);
} else {
    loadInitialUsersIfNeeded();
}

// ==================== TOAST NOTIFICATION SYSTEM ====================

function showToast(message, type = 'info', duration = 3000) {
    // إنشاء container إذا لم يكن موجوداً
    let toastContainer = document.getElementById('toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'toast-container';
        toastContainer.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            max-width: 400px;
        `;
        document.body.appendChild(toastContainer);
    }

    // إنشاء Toast
    const toast = document.createElement('div');
    const colors = {
        success: '#10b981',
        error: '#ef4444',
        warning: '#f59e0b',
        info: '#3b82f6'
    };
    
    toast.style.cssText = `
        background: ${colors[type] || colors.info};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        margin-bottom: 10px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        animation: slideIn 0.3s ease-out;
    `;
    toast.textContent = message;
    
    toastContainer.appendChild(toast);

    // حذف بعد المدة المحددة
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

// إضافة CSS للـ animations
const toastStyles = document.createElement('style');
toastStyles.textContent = `
    @keyframes slideIn {
        from { transform: translateX(400px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(400px); opacity: 0; }
    }
`;
document.head.appendChild(toastStyles);

// ==================== UTILITIES ====================

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-EG');
}

function getOrderStatusBadge(status) {
    const badges = {
        pending: '<i class="fa-solid fa-clock"></i> قيد الانتظار',
        accepted: '<i class="fa-solid fa-check"></i> مقبول',
        rejected: '<i class="fa-solid fa-xmark"></i> مرفوض',
        completed: '🎉 مكتمل',
        cancelled: '⛔ ملغى'
    };
    return badges[status] || status;
}

// ==================== PROFITS & SUBSCRIPTIONS ====================

function getProfits() {
    const profits = localStorage.getItem('siteProfits');
    return profits ? JSON.parse(profits) : [];
}

function saveProfits(profits) {
    localStorage.setItem('siteProfits', JSON.stringify(profits));
    window.dispatchEvent(new Event('siteProfitsChanged'));
}

function addProfit(profitData) {
    const profits = getProfits();
    const newProfit = {
        id: Date.now(),
        providerId: profitData.providerId,
        providerName: profitData.providerName,
        amount: profitData.amount,
        subscriptionDate: new Date().toISOString(),
        status: 'active',
        notes: profitData.notes || ''
    };
    profits.push(newProfit);
    saveProfits(profits);
    return newProfit;
}

function removeProfit(profitId) {
    const profits = getProfits();
    const profit = profits.find(p => p.id == profitId);
    if (profit) {
        const originalAmount = parseFloat(profit.amount);
        const refundAmount = originalAmount * 0.75;  // إرجاع 3/4
        const platformProfit = originalAmount * 0.25;  // الاحتفاظ بـ 1/4
        
        profit.status = 'cancelled';
        profit.cancellationDate = new Date().toISOString();
        profit.refund = refundAmount;  // قيمة الاسترجاع للفني
        profit.amount = platformProfit;  // الربح النهائي للمنصة
        
        saveProfits(profits);
    }
    return profit;
}

function getTotalProfits() {
    const profits = getProfits();
    return profits
        .filter(p => p.status === 'active')
        .reduce((sum, p) => sum + parseFloat(p.amount), 0);
}

function getProviderSubscriptions() {
    const subscriptions = localStorage.getItem('providerSubscriptions');
    return subscriptions ? JSON.parse(subscriptions) : [];
}

function getProviderSubscription(providerId) {
    const subscriptions = getProviderSubscriptions();
    return subscriptions.find(s => s.providerId == providerId && s.status === 'active');
}

function addProviderSubscription(subscriptionData) {
    const subscriptions = getProviderSubscriptions();
    const newSubscription = {
        id: Date.now(),
        providerId: subscriptionData.providerId,
        providerName: subscriptionData.providerName,
        subscriptionDate: new Date().toISOString(),
        amount: subscriptionData.amount || 50,
        status: 'active',
        notes: subscriptionData.notes || ''
    };
    subscriptions.push(newSubscription);
    localStorage.setItem('providerSubscriptions', JSON.stringify(subscriptions));
    
    // إضافة الربح المقابل
    addProfit({
        providerId: subscriptionData.providerId,
        providerName: subscriptionData.providerName,
        amount: subscriptionData.amount || 50,
        notes: 'اشتراك جديد'
    });
    
    window.dispatchEvent(new Event('providerSubscriptionsChanged'));
    return newSubscription;
}

function cancelProviderSubscription(providerId) {
    const subscriptions = getProviderSubscriptions();
    const subscription = subscriptions.find(s => s.providerId == providerId && s.status === 'active');
    
    if (subscription) {
        subscription.status = 'cancelled';
        subscription.cancellationDate = new Date().toISOString();
        localStorage.setItem('providerSubscriptions', JSON.stringify(subscriptions));
        
        // تحديث الربح المقابل مع حساب الاسترجاع
        const profits = getProfits();
        const profit = profits.find(p => p.providerId == providerId && p.status === 'active');
        if (profit) {
            removeProfit(profit.id);
        }
        
        window.dispatchEvent(new Event('providerSubscriptionsChanged'));
    }
    
    return subscription;
}

// ==================== CONTACT & MESSAGES ====================

function getContactMessages() {
    const messages = localStorage.getItem('contactMessages');
    return messages ? JSON.parse(messages) : [];
}

function saveContactMessages(messages) {
    localStorage.setItem('contactMessages', JSON.stringify(messages));
    window.dispatchEvent(new Event('contactMessagesChanged'));
}

function addContactMessage(messageData) {
    const messages = getContactMessages();
    const newMessage = {
        id: Date.now(),
        name: messageData.name,
        email: messageData.email,
        phone: messageData.phone,
        subject: messageData.subject,
        message: messageData.message,
        date: new Date().toISOString(),
        status: 'new'
    };
    messages.push(newMessage);
    saveContactMessages(messages);
    return newMessage;
}

function deleteContactMessage(messageId) {
    const messages = getContactMessages();
    const filtered = messages.filter(m => m.id !== messageId);
    saveContactMessages(filtered);
    return true;
}

function markMessageAsRead(messageId) {
    const messages = getContactMessages();
    const message = messages.find(m => m.id === messageId);
    if (message) {
        message.status = 'read';
        saveContactMessages(messages);
    }
    return message;
}

// ==================== CONTACT INFO ====================

const DEFAULT_CONTACT_INFO = {
    email: 'info@sanay3y.com',
    phone: '+20-1001234567',
    address: 'مصر، القاهرة',
    workingHours: 'السبت - الخميس: 9 صباحاً - 5 مساءً',
    facebook: 'https://facebook.com/sanay3y'
};

function getContactInfo() {
    const info = localStorage.getItem('contactInfo');
    if (info) {
        return JSON.parse(info);
    }
    // إذا لم تكن موجودة، احفظ الافتراضية وأرجعها
    localStorage.setItem('contactInfo', JSON.stringify(DEFAULT_CONTACT_INFO));
    return DEFAULT_CONTACT_INFO;
}

function saveContactInfo(contactInfo) {
    localStorage.setItem('contactInfo', JSON.stringify(contactInfo));
    window.dispatchEvent(new Event('contactInfoChanged'));
}

console.log('<i class="fa-solid fa-check"></i> logic.js loaded successfully');
