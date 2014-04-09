(function(){
    var body= $('body');
    $('.menu-toogle').bind( 'click', function() {
        body.toggleClass('menu-open');
        return false;
    });
})();