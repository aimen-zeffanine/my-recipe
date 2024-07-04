module.exports = (app) => {
    const postController = require('../controllers/postController');

// إنشاء منشور
app.post('/posts/create', postController.create);

// جلب جميع المنشورات
app.get('/posts/getAll', postController.getAll);

// جلب منشور وحيد
app.get('/post/getPost', postController.getPost);

// تعديل بيانات المنشور
app.put('/posts/update', postController.update);

// تسجيل إعجاب
app.put('/posts/like', postController.like);
}