module.exports = (app) => {

    
const userController = require('../controllers/userController');

//إنشاء المستخدم
app.post('/users/create', userController.create);

//التحقق من البريد الإلكتروني
app.get('/users/validateEmail', userController.validateEmail);

// التحقق من اسم المستخدم
app.get('/users/validateUsername', userController.validateUsername);

// جلب بيانات المستخدم
app.get('/users/getUser', userController.getUser);

// تسجيل الدخول
app.post('/users/login', userController.login);

// تعديل الصورة الشخصية
app.put('/users/updateImage', userController.updateImage);

// تعديل معلومات المستخدم
app.put('/users/update', userController.update);

}
