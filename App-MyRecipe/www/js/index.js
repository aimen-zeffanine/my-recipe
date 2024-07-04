var User = {};


$(document).ready(function(){
    // $('.page').hide();

    // $('#first-page').show();

    // $('.navigator').click(function() {
    //     var pageId = `#${this.dataset.navigate}`;
    //     $('.page').hide();
    //     $(pageId).show();
    // });

    Router.Render('login');

    $(document).on('click', '.navigator', function() {
        Router.Render(this.dataset.navigate);
    });



    $('.side-menu-toggle, .side-menu-close').click(function () {
        $('.side-menu-wrapper').toggleClass('active');
    })

    $(document).on('click', '.view-button', function() {
        $(this).parents('.post').find('.post-content').slideToggle(333);
    })
});