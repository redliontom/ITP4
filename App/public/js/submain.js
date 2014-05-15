
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
        $("#profile_banner").animate({opacity:"0", filter:"alpha(opacity=0)"}, 200, function() {
            $("#profile_banner").load("../account/profile_header.html", function() {
               $("#profile_banner").animate({opacity:"1", filter:"alpha(opacity=100)"}, 200);
            });
        });
        document.getElementById("subsection").innerHTML="chronos38";
    });

    $("#m-land").click(function() {
        $("#content_container").animate({opacity:"0", filter:"alpha(opacity=0)"}, 200, function() {
            $("#content_container").load("../account/gallery.html", function() {
               $("#content_container").animate({opacity:"1", filter:"alpha(opacity=100)"}, 200);
            });
        });
        document.getElementById("subsection").innerHTML="Landscapes";
    });
