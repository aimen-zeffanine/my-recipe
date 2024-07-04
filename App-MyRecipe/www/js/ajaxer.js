const serverAddress = 'http://192.168.1.37:10000';

//Signup Form
//#region 
$(document).on('focusout', '#suf-username', function(){
    var reqData = $('#suf-username').val();
    $.ajax({
        type: 'GET',
        url: `${serverAddress}/users/validateUsername`,
        data: {username: reqData},
        success: (res) => {
            $('#suf-username')[0].setCustomValidity('');
            $('#suf-username').removeClass('invalid').addClass('valid');
            $('#suf-username-em').html('');
        },
        error: (error) => {
            $('#suf-username-em').html('هذا الاسم مستخدم، جرب غيره');
            $('#suf-username').removeClass('valid').addClass('invalid');
            $('#suf-username')[0].setCustomValidity('invalid');
        }
    });
});


$(document).on('focusout', '#suf-email', function(){
    var reqData = $('#suf-email').val();
    $.ajax({
        type: 'GET',
        url: `${serverAddress}/users/validateEmail`,
        data: {email: reqData},
        success: (res) => {
            $('#suf-email')[0].setCustomValidity('');
            $('#suf-email').removeClass('invalid').addClass('valid');
            $('#suf-email-em').html('');
        },
        error: (error) => {
            $('#suf-email-em').html('هذا الاسم مستخدم، جرب غيره');
            $('#suf-email').removeClass('valid').addClass('invalid');
            $('#suf-email')[0].setCustomValidity('invalid');
        }
    });
});

$(document).on('focusout', '#suf-password-confirm', function() {
    var passInput = $('#suf-password');
    var passConfInput = $('#suf-password-confirm');
    if (passInput.val() == passConfInput.val()) {
        passInput[0].setCustomValidity('');
        passConfInput[0].setCustomValidity('');
        $('#suf-password-em').html('');
    } else {
        passInput[0].setCustomValidity('invalid');
        passConfInput[0].setCustomValidity('invalid');
        $('#suf-password-em').html('حقلا كلمة المرور وتأكيدها غير متطابقين');
    }
});

$(document).on('submit', '#signup-form', function(e) {
    e.preventDefault();
    var reqData = $('#signup-form').serializeArray();
    $.ajax({
        type: 'POST',
        url: `${serverAddress}/users/create`,
        data: reqData,
        success: (res) => {
            alert('مبروك! أنشئ حسابك وأهلًا بك بيننا');
            Router.Render('login');
        },
        error: (res) => {
            alert('المعذرة! حصل خطأ ولم يتم إنشاء الحساب. ' + res);
        }
    });
})
//#endregion

//Login Form
//#region 
$(document).on('submit', '#login-form', function(e) {
    e.preventDefault();
    var reqData = $('#login-form').serializeArray();
    $.ajax({
        type: 'POST',
        url: `${serverAddress}/users/login`,
        data: reqData,
        dataType: 'JSON',
        success: (res) => {
            User = res;
            $('#lgf-em').html('');
            Router.Render('news-feed');
        },
        error: (error) => {
            $('#lgf-em').html('خطأ في اسم المستخدم أو كلمة المرور');
        }
    });
});
//#endregion


//Create Post Form
//#region 
$(document).on('click', '#cpf-open-camera', function() {
    navigator.camera.getPicture(
        (data) => {
            var imageElement = $('#create-post-image');
            if (imageElement.length > 0) {
                $('#create-post-image').remove();
                $('#create-post-form').children('input[name=picture]').remove();
            }
            $('#create-post-image-viewer').append(`
                <img src="data:image/jpg;base64,${data}" alt="image" id="create-post-image">
            `);
            $('#create-post-form').append(`
                <input type="text" name="picture" hidden value="${data}">
            `);
        }, (error) => {
            alert(error);
        },{
            quality: 100,
            destinationType: Camera.DestinationType.DATA_URL,
            correctOrientation: true
        }
    );
});

$(document).on('click', '#component-adder-button', function() {
    var text = $('#component-adder-text').val();
    var collector = $('#cpf-components');
    var collectorVal = collector.val();

    if (!text) {
        alert('لم تدخل أي نص في مربع إدخال المكونات!');
    } else {
        if (!collectorVal) {
            collectorVal += `${text}.`;
        } else {
            collectorVal = `${collectorVal.substr(0, collectorVal.length - 1)}، ${text}.`;
        }
    }
    collector.val(collectorVal);
    $('#component-adder-text').val('').focus();
});

$(document).on('click', '#step-adder-button', function(){
    var text = $('#step-adder-text').val();
    var collector = $('#cpf-steps');
    var collectorVal = collector.val();
    var numOfSteps;

    var arr = collectorVal.split('\n');
    if (!arr[0]) {
        numOfSteps = 1;
    } else if (arr[0] && arr.length == 1) {
        numOfSteps = 2;
    } else if (arr.length > 1) {
        numOfSteps = arr.length + 1;
    }

    if (!text) {
        alert('لم تدخل نصًا لإضافته!');
    } else if (!collectorVal) {
        collectorVal += `${numOfSteps}) ${text}.`
    } else {
        collectorVal += `\n${numOfSteps}) ${text}.`
    }
    collector.val(collectorVal);
    $('#step-adder-text').val('').focus();
});

$(document).on('submit', '#create-post-form', function(e) {
    e.preventDefault();
    var titleElement = $('#cpf-title');
    var compElement = $('#cpf-components');
    var stepsElement = $('#cpf-steps');
    var formData = $(this).serializeArray();

    if (!formData.find(x => x.name == 'picture')) {
        throw alert('لا يمكن نشر المنشور دون صورة!');
    }
    if (!compElement.val() || !stepsElement.val()){
        throw alert('لا يمكن نشر المنشور دون مكونات أو خطوات تحضير!');
    }

    var picture = formData.find(x => x.name == 'picture').value;
    var components = compElement.val();
    var steps = stepsElement.val().split('\n');
    var title = titleElement.val();

    if (!User) {
        throw alert('لم تسجل الدخول');
    }

    var userId = User._id;

    var reqData = {
        picture: picture,
        components: components,
        steps: steps,
        title: title,
        userId: userId
    }

    $.ajax({
        type: 'POST',
        url: `${serverAddress}/posts/create`,
        data: reqData,
        success: function(res) {
            alert('تم إنشاء المنشور');
        }, error: function(error) {
            alert(error);
        }
    });
});
//#endregion

//User Profile
//#region 
$(document).on('click', '#upf-open-camera', function() {
    navigator.camera.getPicture((data) => {
        var reqData = {
            userId: User._id,
            picture: data
        }
        $.ajax({
            type: 'PUT',
            url: `${serverAddress}/users/updateImage`,
            data: reqData,
            success: function(res) {
                User = res;
                Router.Render('user-profile');
            }, error: function(error) { alert(error) }
        });
    }, error => {alert(error)}, {
        quality: 80,
        destinationType: Camera.DestinationType.DATA_URL,
        correctOrientation: true
    })
})

//#endregion

// News Feed
//#region 
$(document).on('click', '#logout-button', function() {
    User = {};
    Router.Render('login');
});

$(document).on('click', '.edit-button', function() {
    var postId = $(this).parents('.post')[0].dataset.postid;
    $.ajax({
        type: 'GET',
        url: `${serverAddress}/posts/getPost`,
        data: {postId: postId},
        success: function(post) {
            $('#button-back').show();
            $('.navbar-brand').html('تعديل منشور');
            var pageUrl = Router.Routes.find(r => r.name == 'create-post');
            $('#pages').load(pageUrl, function() {
                
            });
        }, error: function(error) {
            alert(error);
        }
    });
})

$(document).on('click', '.like-button', function() {
    var likeButton = $(this);
    var currentPost = likeButton.parents('.post');
    var likesCount = currentPost.find('.number');
    var likesCount_you = currentPost.find('.you');
    var heart = likeButton.find('i.fa-heart');
    var postId = currentPost[0].dataset.postid;

    $.ajax({
        type: 'PUT',
        url: `${serverAddress}/posts/like`,
        data: {postId: postId, userId: User._id},
        success: function() {
            heart.toggleClass('red-heart');
            heart.hasClass('red-heart')? likesCount_you.html('أنت و '): likesCount_you.html('');
        }, error: function(error) {alert(error)}
    })
})

function preparePosts() {
    $.ajax({
        type: 'GET',
        url: `${serverAddress}/posts/getAll`,
        data: {userId: User._id},
        success: function(Posts) {
            console.log(Posts);
            if (Posts.length == 0) alert('لا يوجد منشورات لعرضها!');
            for (let i = 0; i < Posts.length; i++) {
                const post = Posts[i];
                $.ajax({
                    type: 'GET',
                    url: `${serverAddress}/users/getUser`,
                    data: {userId: post.userId},
                    success: function(postOwner) {
                        console.log(postOwner);
                        var perpSteps = '';
                        for (let s = 0; s < post.steps.length; s++) {
                            const step = post.steps[s];
                            perpSteps += `<p>${step}</p>`;
                        }
                        var redOrOrangeHeart = post.isLikedByCurrentUser? 'red-heart': '';
                        var visibleEditButton = post.isCreatedByCurrentUser? 'visible': 'invisible';
                        var you = post.isLikedByCurrentUser? 'أنت و ':'';
                        var likesCount = 0;
                        if (post.likes.length > 0) {
                            likesCount = post.likes.length;
                            if (post.isLikedByCurrentUser) {
                                likesCount -= 1;
                            }
                        }

                        var postElement = `
                        <div class="post" data-postid="${post.id}" data-postOwnerid="${post.userId}">

                        <div class="post-header navbar">
                            
                            <div class="post-user">
                                <img src="${serverAddress}${postOwner.picture}" class="post-user-img">
                                <span class="post-user-name">${postOwner.username}</span>
                            </div>
        
                            <span class="post-date">
                                ${post.date}
                            </span>
        
                        </div>
        
                        <div class="post-title">
                            <span>${post.title}</span>
                        </div>
        
                        <div class="post-body">
        
                            <img src="${serverAddress}${post.picture}" class="post-image">
        
                            <div class="post-content">
                                <div class="post-components post-details-wrapper">
                                    <h6 class="post-components-title post-details-title">
                                        المكونات:
                                    </h6>
                                    <span>
                                        ${post.components}
                                    </span>
                                </div>
        
                                <div class="post-steps post-details-wrapper">
                                    <h6 class="post-steps-title post-details-title">
                                        خطوات التحضير:
                                    </h6>
                                    ${perpSteps}
                                </div>
                            </div>
                            
                        </div>
                        <div class="post-functions">
                            <span class="post-fn-like">
                                <a class="like-button">
                                    <i class="fa fa-heart ${redOrOrangeHeart}"></i>
                                </a>
                            </span>
                            <span class="post-fn-view">
                                <a class="view-button">
                                    <i class="fa fa-eye"></i>
                                </a>
                            </span>
                            <span class="post-fn-edit ${visibleEditButton}">
                                <a class="edit-button">
                                    <i class="fa fa-edit"></i>
                                </a>
                            </span>
                        </div>
                        <div class="likes-count">
                            <span class="you">${you} </span>
                            <span class="number">${likesCount} </span>
                            <span>مُعجب</span>
                        </div>
                    </div>
                        `;


                        $('#posts-container').append(postElement);

                    },error: function(error) {alert(error);}
                });
            }
        }, error: function(error) {alert(error)}
    });
}

//#endregion