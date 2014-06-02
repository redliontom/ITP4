function popup(id) {
    var e = document.getElementById(id);
    if(e.style.visibility == 'visible')
    {
        e.style.visibility = 'hidden';
        $('#popup_background').css('visibility', 'hidden');
    } else {
        e.style.visibility = 'visible';
        $('#popup_background').css('visibility', 'visible');
    }
}
