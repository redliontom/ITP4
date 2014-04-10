$(document).ready(function() {
    $("#m-home").click(function() {
        $("#content_container").animate({opacity:"0", filter:"alpha(opacity=0)"}, 200, function() {
            $("#content_container").load("../account/feeds.html", function() {
               $("#content_container").animate({opacity:"1", filter:"alpha(opacity=100)"}, 200);
            });
        });
    });
    
    $("#m-gallery").click(function() {
        $("#content_container").animate({opacity:"0", filter:"alpha(opacity=0)"}, 200, function() {
            $("#content_container").load("../account/gallery.html", function() {
               $("#content_container").animate({opacity:"1", filter:"alpha(opacity=100)"}, 200);
            });
        });
    });
});