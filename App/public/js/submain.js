
    $("#m-equipment").click(function() {
        $("#content_container").animate({opacity:"0", filter:"alpha(opacity=0)"}, 200, function() {
            $("#content_container").load("../account/equipment.html", function() {
               $("#content_container").animate({opacity:"1", filter:"alpha(opacity=100)"}, 200);
            });
        });
    });
    
     $("#m-mequipment").click(function() {
        $("#content_container").animate({opacity:"0", filter:"alpha(opacity=0)"}, 200, function() {
            $("#content_container").load("../account/equipment.html", function() {
               $("#content_container").animate({opacity:"1", filter:"alpha(opacity=100)"}, 200);
            });
        });
    });

    $("#m-about").click(function() {
        $("#content_container").animate({opacity:"0", filter:"alpha(opacity=0)"}, 200, function() {
            $("#content_container").load("../account/profile.html", function() {
               $("#content_container").animate({opacity:"1", filter:"alpha(opacity=100)"}, 200);
            });
        });
    });

    $("#m-allphotos").click(function() {
        $("#content_container").animate({opacity:"0", filter:"alpha(opacity=0)"}, 200, function() {
            $("#content_container").load("../account/myphotos.html", function() {
               $("#content_container").animate({opacity:"1", filter:"alpha(opacity=100)"}, 200);
            });
        });
    });

    $("#m-friends").click(function() {
        $("#content_container").animate({opacity:"0", filter:"alpha(opacity=0)"}, 200, function() {
            $("#content_container").load("../account/friends.html", function() {
               $("#content_container").animate({opacity:"1", filter:"alpha(opacity=100)"}, 200);
            });
        });
    });

    $("#m-land").click(function() {
        $("#content_container").animate({opacity:"0", filter:"alpha(opacity=0)"}, 200, function() {
            $("#content_container").load("../account/gallery.html", function() {
               $("#content_container").animate({opacity:"1", filter:"alpha(opacity=100)"}, 200);
            });
        });
        document.getElementById("subsection").innerHTML="Landscapes";
    });
