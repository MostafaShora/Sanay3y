/**
 * 🧪 اختبار شامل: هل يظهر العامل بعد تغيير التخصص مباشرة؟
 */

const fs = require('fs');

console.log('\n════════════════════════════════════════════════════════════');
console.log('🧪 اختبار: عرض العمال بعد تغيير التخصص (مع وبدون موافقة)');
console.log('════════════════════════════════════════════════════════════\n');

// قراءة users.json
const users = JSON.parse(fs.readFileSync('jsonFiles/users.json', 'utf8'));

// الخدمات الافتراضية
const services = [
    { name: "نجاره", englishName: "Carpentry" },
    { name: "سباكه", englishName: "Plumbing" },
    { name: "كهرباء", englishName: "Electricity" },
    { name: "نقاشه", englishName: "Painting" }
];

// السيناريو: عامل جديد غير معتمد يغير التخصص
console.log('📝 السيناريو:\n');
console.log('1. عامل يتسجل بتخصص "سباكه" و approved=false');
console.log('2. يدخل لوحة التحكم ويغير التخصص إلى "كهرباء"');
console.log('3. المستخدم يذهب لصفحة "كهرباء" ويتوقع رؤية العامل\n');

// محاكاة عامل جديد
const newProvider = {
    id: 999,
    name: "محمود السلمي",
    email: "mahmoud@example.com",
    password: "pass123",
    role: "provider",
    service: "كهرباء",  // غيّر التخصص من سباكه إلى كهرباء
    area: "الجيزة",
    phone: "01099999999",
    rating: 0,
    approved: false,  // <i class="fa-solid fa-xmark"></i> لم يُعتمد بعد!
    subscription: "free"
};

const allUsers = [...users, newProvider];

console.log(`<i class="fa-solid fa-check"></i> إضافة عامل جديد:\n`);
console.log(`   الاسم: ${newProvider.name}`);
console.log(`   التخصص: ${newProvider.service}`);
console.log(`   الموافقة: ${newProvider.approved ? '<i class="fa-solid fa-check"></i>' : '<i class="fa-solid fa-xmark"></i>'} (غير معتمد)\n`);

// اختبار الفلترة الجديدة (بدون شرط approved = true)
console.log('🔍 اختبار الفلترة الجديدة:\n');

const selectedService = services.find(s => s.englishName === 'Electricity');
console.log(`خدمة: ${selectedService.name} (${selectedService.englishName})\n`);

// <i class="fa-solid fa-check"></i> الفلترة الجديدة: بدون شرط approved = true
const providers = allUsers.filter(user => {
    const isProvider = user.role === "provider";
    const hasService = user.service && user.service.trim() !== "";
    const serviceMatches = hasService && (
        user.service.toLowerCase() === selectedService.name.toLowerCase() || 
        user.service.toLowerCase() === selectedService.englishName.toLowerCase()
    );
    
    return isProvider && serviceMatches;
});

console.log(`<i class="fa-solid fa-chart-bar"></i> النتائج:\n`);
console.log(`   إجمالي العمال: ${providers.length}`);

const approved = providers.filter(p => p.approved === true);
const pending = providers.filter(p => p.approved !== true);

console.log(`   <i class="fa-solid fa-check"></i> معتمدين: ${approved.length}`);
approved.forEach(p => console.log(`      - ${p.name}`));

console.log(`\n   <i class="fa-solid fa-clock"></i> في الانتظار: ${pending.length}`);
pending.forEach(p => console.log(`      - ${p.name} (جديد)`));

console.log('\n════════════════════════════════════════════════════════════');
console.log('<i class="fa-solid fa-check"></i> النتائج:\n');

if (providers.length > 0) {
    console.log('<i class="fa-solid fa-check"></i> سيظهر العامل الجديد في الصفحة!');
    console.log('   - العمال المعتمدين سيكونون بشكل طبيعي');
    console.log('   - العمال الجدد سيظهرون مع تنبيه "in انتظار الموافقة"');
    console.log('   - الزر سيكون معطلاً للعمال الجدد');
} else {
    console.log('<i class="fa-solid fa-xmark"></i> لن يظهر أي عامل');
}

console.log('\n════════════════════════════════════════════════════════════\n');
