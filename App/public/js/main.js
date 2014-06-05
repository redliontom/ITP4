$(document).ready(function() {
    $("#content_container").load("../account/feeds.html");
    
    
    $("#m-home").click(function() {
        $("#content_container").animate({opacity:"0", filter:"alpha(opacity=0)"}, 200, function() {
            $("#content_container").load("../account/feeds.html", function() {
               $("#content_container").animate({opacity:"1", filter:"alpha(opacity=100)"}, 200);
            });
        });
        document.getElementById("subsection").innerHTML="News Feed";
        profile();
    });
    
    $("#m-gallery").click(function() {
        $("#content_container").animate({opacity:"0", filter:"alpha(opacity=0)"}, 200, function() {
            $("#content_container").load("../account/gallery_cat.html", function() {
               $("#content_container").animate({opacity:"1", filter:"alpha(opacity=100)"}, 200);
            });
        });
        document.getElementById("subsection").innerHTML="Gallery Categories";
        profile();
    });
    
    $("#m-profile").click(function() {
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
        document.getElementById("subsection").innerHTML="Username";
    });
    
    $("#m-find-friends").click(function() {
        $("#content_container").animate({opacity:"0", filter:"alpha(opacity=0)"}, 200, function() {
            $("#content_container").load("../account/find.html", function() {
               $("#content_container").animate({opacity:"1", filter:"alpha(opacity=100)"}, 200);
            });
        });
        document.getElementById("subsection").innerHTML="Find Friends";
        profile();
    });
    
    
    $("#m-mhome").click(function() {
        $("#content_container").animate({opacity:"0", filter:"alpha(opacity=0)"}, 200, function() {
            $("#content_container").load("../account/feeds.html", function() {
               $("#content_container").animate({opacity:"1", filter:"alpha(opacity=100)"}, 200);
            });
        });
        document.getElementById("subsection").innerHTML="News Feed";
        profile();
    });
    
    $("#m-mgallery").click(function() {
        $("#content_container").animate({opacity:"0", filter:"alpha(opacity=0)"}, 200, function() {
            $("#content_container").load("../account/gallery_cat.html", function() {
               $("#content_container").animate({opacity:"1", filter:"alpha(opacity=100)"}, 200);
            });
        });
        document.getElementById("subsection").innerHTML="Gallery Categories";
        profile();
    });
    
    $("#m-mprofile").click(function() {
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
        document.getElementById("subsection").innerHTML="Username";
    });
    
    $("#m-mfind-friends").click(function() {
        $("#content_container").animate({opacity:"0", filter:"alpha(opacity=0)"}, 200, function() {
            $("#content_container").load("../account/find.html", function() {
               $("#content_container").animate({opacity:"1", filter:"alpha(opacity=100)"}, 200);
            });
        });
        document.getElementById("subsection").innerHTML="Find Friends";
        profile();
    });
    
    $("#m-settings").click(function() {
        $("#content_container").animate({opacity:"0", filter:"alpha(opacity=0)"}, 200, function() {
            $("#content_container").load("../account/settings.html", function() {
               $("#content_container").animate({opacity:"1", filter:"alpha(opacity=100)"}, 200);
            });
        });
        document.getElementById("subsection").innerHTML="Settings";
        profile();
    });
    
    $("#m-upload").click(function() {
        $("#content_container").animate({opacity:"0", filter:"alpha(opacity=0)"}, 200, function() {
            $("#content_container").load("../account/upload.html", function() {
               $("#content_container").animate({opacity:"1", filter:"alpha(opacity=100)"}, 200);
            });
        });
        document.getElementById("subsection").innerHTML="Upload Image";
        profile();
    });
    
    $("#m-mupload").click(function() {
        $("#content_container").animate({opacity:"0", filter:"alpha(opacity=0)"}, 200, function() {
            $("#content_container").load("../account/upload.html", function() {
               $("#content_container").animate({opacity:"1", filter:"alpha(opacity=100)"}, 200);
            });
        });
        document.getElementById("subsection").innerHTML="Upload Image";
        profile();
    });   
});


function profile () {
   document.getElementById("profile_banner").innerHTML ="";
}


