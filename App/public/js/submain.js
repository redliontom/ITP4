
    $("#m-equipment").click(function() {
        $("#content_container").animate({opacity:"0", filter:"alpha(opacity=0)"}, 200, function() {
            $("#content_container").load("../account/equipment.html", function() {
               $("#content_container").animate({opacity:"1", filter:"alpha(opacity=100)"}, 200);
            });
        });
    });
