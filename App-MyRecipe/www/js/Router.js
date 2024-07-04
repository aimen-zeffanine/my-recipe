const Router = {
    Routes: [
        {name: 'login', url:'./pages/login.html'},
        {name: 'signup', url:'./pages/signup.html'},
        {name: 'news-feed', url: './pages/news-feed.html'},
        {name: 'create-post', url: './pages/create-post.html'},
        {name: 'user-profile', url: './pages/user-profile.html'}
    ],
    Render: (pageName = 'first-page') => {
        switch (pageName) {
            case 'login':
                Router.prepareLoginPage(pageName);
                break;
            case 'signup':
                Router.prepareSignupPage(pageName);
                break;
            case 'news-feed':
                Router.prepareNewsFeedPage(pageName);
                break;
            case 'create-post':
                Router.prepareCreatePostPage(pageName);
                break;
            case 'user-profile':
                Router.prepareUserProfilePage(pageName);
                break;
            case 'back':
                Router.prepareNewsFeedPage('news-feed');
                break;
        }
    },
    prepareLoginPage: (pageName) => {
        $('nav').hide();

        Router.viewPage(pageName);
    },
    
    prepareSignupPage: (pageName) => {
        $('nav').hide();
        Router.viewPage(pageName);
    },

    prepareNewsFeedPage: (pageName) => {
        $('nav').show();
        $('#back-button').hide();
        $('.navbar-brand').html('وصفتي');
        $('#side-menu-user-name').html(User.username);
        if (User.picture) {
            $('#side-menu-user-image').attr('src', `${serverAddress}${User.picture}`);   
        }
        var pageUrl = Router.Routes.find( r => r.name == pageName).url;
        if(pageUrl) {
            $('#pages').load(pageUrl, function(){
                preparePosts();
            });
        }
    },

    prepareCreatePostPage: (pageName) => {
        $('#back-button').show();
        Router.viewPage(pageName);
    },
    prepareUserProfilePage: (pageName) => {
        $('#back-button').show();
        $('.side-menu-wrapper').removeClass('active');
        $('.navbar-brand').html(User.username);

        var pageUrl = Router.Routes.find( r => r.name == pageName).url;
        if(pageUrl) {
            $('#pages').load(pageUrl, function() {
                if (User.picture) {
                    $('#user-profile-image').attr('src', `${serverAddress}${User.picture}`);
                    $('#side-menu-user-image').attr('src', `${serverAddress}${User.picture}`);  
                }
                $('#upf-user-name').val(User.username);
                $('#upf-user-email').val(User.email);
                $('#upf-user-password').val(User.password);
            });
        }
    },

    viewPage(pageName) {
        var pageUrl = Router.Routes.find( r => r.name == pageName).url;
        if(pageUrl) {
            $('#pages').load(pageUrl);
        }
    }

}