$( document ).ready(function() {
    //********************************************************************
    //          Upload
    //********************************************************************
    $('#formUpload').submit(function(){
        var title = document.forms["formUpload"]["title"].value;
        var camera = document.forms["formUpload"]["camera"].value;
        var focal = document.forms["formUpload"]["focal"].value;
        var exposure = document.forms["formUpload"]["exposure"].value;
        var aperture = document.forms["formUpload"]["aperture"].value;
        var iso = document.forms["formUpload"]["iso"].value;
        var picture = document.forms["formUpload"]["picture"].files;
        if ((title==null || title=="") & (picture==null || picture==""))
        {
            $('#response').addClass('send_message_error');
            $('#response').css('visibility', 'visible');
            $('#response').html('<i class="fa fa-exclamation-triangle"></i> All fields are required!');
            setTimeout(function() {   
                $('#response').css('visibility', 'hidden');
                $('#response').removeClass('send_message_error');
	        }, 3000);  
           
        } else {
            $('#submit').attr('disabled');
            var data = {};
            data.title = title;
            data.camera = camera;
            data.focal = focal;
            data.exposure = exposure;
            data.aperture = aperture;
            data.iso = iso;
            data.picture = picture;
            $.ajax({
                type: 'POST',
                url: '/account/upload',
                data: JSON.stringify(data),
                contentType: 'application/json',
                success: function(msg) {
                    $('#response').addClass('send_message_success');
                    $('#response').css('visibility', 'visible');
                    $('#response').html('<i class="fa fa-check"></i> '+ msg);
                    setTimeout(function() {   
                        $('#response').css('visibility', 'hidden');
                        $('#response').removeClass('send_message_success');
                        $('#popup_name').css('visibility', 'hidden');
                        $('#popup_background').css('visibility', 'hidden');
	               }, 3000);
                }
            });
        }
        return false;
    });
    
    
    //********************************************************************
    //          Settings
    //********************************************************************
    //Form Name
    $('#form_name').submit(function(){
        var forename = document.forms["form_name"]["forename"].value;
        var surname = document.forms["form_name"]["surname"].value;
        if ((forename==null || forename=="") & (surname==null || surname==""))
        {
            $('#response').addClass('send_message_error');
            $('#response').css('visibility', 'visible');
            $('#response').html('<i class="fa fa-exclamation-triangle"></i> All fields are required!');
            setTimeout(function() {   
                $('#response').css('visibility', 'hidden');
                $('#response').removeClass('send_message_error');
	        }, 3000);  
           
        } else {
            $('#submit').attr('disabled');
            var data = {};
            data.forename = forename;
            data.surname = surname;
            $.ajax({
                type: 'POST',
                url: '/account/settings',
                data: JSON.stringify(data),
                contentType: 'application/json',
                success: function(msg) {
                    $('#response').addClass('send_message_success');
                    $('#response').css('visibility', 'visible');
                    $('#response').html('<i class="fa fa-check"></i> '+ msg);
                    setTimeout(function() {   
                        $('#response').css('visibility', 'hidden');
                        $('#response').removeClass('send_message_success');
                        $('#popup_name').css('visibility', 'hidden');
                        $('#popup_background').css('visibility', 'hidden');
	               }, 3000);
                }
            });
        }
        return false;
    });
    
    //Form Mail
    $('#form_mail').submit(function(){
        var mail = document.forms["form_mail"]["mail"].value;
        if (mail==null || mail=="")
        {
            $('#response').addClass('send_message_error');
            $('#response').css('visibility', 'visible');
            $('#response').html('<i class="fa fa-exclamation-triangle"></i> The mail field is required!');
            setTimeout(function() {   
                $('#response').css('visibility', 'hidden');
                $('#response').removeClass('send_message_error');
	        }, 3000);  
           
        } else {
            if (!val.test(mail))
	       {
               $('#response').addClass('send_message_error');
               $('#response').css('visibility', 'visible');
               $('#response').html('<i class="fa fa-exclamation-triangle"></i> Please provide a valid email address!');
                setTimeout(function() {   
                    $('#response').css('visibility', 'hidden');
                    $('#response').removeClass('send_message_error');
	           }, 3000);  
               return false;
           }
            $('#submit').attr('disabled');
            var data = {};
            data.mail = mail;
            $.ajax({
                type: 'POST',
                url: '/account/settings',
                data: JSON.stringify(data),
                contentType: 'application/json',
                success: function(msg) {
                    $('#response').addClass('send_message_success');
                    $('#response').css('visibility', 'visible');
                    $('#response').html('<i class="fa fa-check"></i> '+ msg);
                    setTimeout(function() {   
                        $('#response').css('visibility', 'hidden');
                        $('#response').removeClass('send_message_success');
                        $('#popup_name').css('visibility', 'hidden');
                        $('#popup_background').css('visibility', 'hidden');
	               }, 3000);
                },
                    statusCode: {
                        500: function(msg) {
                            $('#response').addClass('send_message_error');
                            $('#response').css('visibility', 'visible');
                            $('#response').html('<i class="fa fa-exclamation-triangle"></i> Please provide a valid email address!');
                            setTimeout(function() {   
                                $('#response').css('visibility', 'hidden');
                                $('#response').removeClass('send_message_error');
                                $('#popup_name').css('visibility', 'hidden');
                                $('#popup_background').css('visibility', 'hidden');
	                       }, 3000);
                        },
                        406: function(msg) {
                            $('#response').addClass('send_message_error');
                            $('#response').css('visibility', 'visible');
                            $('#response').html('<i class="fa fa-exclamation-triangle"></i> Could not verifiy username!');
                            setTimeout(function() {   
                                $('#response').css('visibility', 'hidden');
                                $('#response').removeClass('send_message_error');
                                $('#popup_name').css('visibility', 'hidden');
                                $('#popup_background').css('visibility', 'hidden');
	                       }, 3000);
                        }
                    }
            });
        }
        return false;
    });
    
    //Form Password
    $('#form_password').submit(function(){
        var old_password = document.forms["form_password"]["old_password"].value;
        var new_password_1 = document.forms["form_password"]["new_password_1"].value;
        var new_password_2 = document.forms["form_password"]["new_password_2"].value;
        if ((old_password==null || old_password=="") & (new_password_1==null || new_password_1=="") & (new_password_2==null || new_password_2==""))
        {
            $('#response').addClass('send_message_error');
            $('#response').css('visibility', 'visible');
            $('#response').html('<i class="fa fa-exclamation-triangle"></i> All fields are required!');
            setTimeout(function() {   
                $('#response').css('visibility', 'hidden');
                $('#response').removeClass('send_message_error');
	        }, 3000);  
           
        } else {
            if ( new_password_1 == new_password_2)
            {
                $('#submit').attr('disabled');
                var data = {};
                data.old_password = old_password;
                data.new_password_1 = new_password_1;
                data.new_password_2 = new_password_2;
                $.ajax({
                    type: 'POST',
                    url: '/account/settings',
                    data: JSON.stringify(data),
                    contentType: 'application/json',
                    success: function(msg) {
                        $('#response').addClass('send_message_success');
                        $('#response').css('visibility', 'visible');
                        $('#response').html('<i class="fa fa-check"></i> '+ msg);
                        setTimeout(function() {   
                            $('#response').css('visibility', 'hidden');
                            $('#response').removeClass('send_message_success');
                            $('#popup_name').css('visibility', 'hidden');
                            $('#popup_background').css('visibility', 'hidden');
	                   }, 3000);
                    }
                });
            } else {
                $('#response').addClass('send_message_error');
                $('#response').css('visibility', 'visible');
                $('#response').html('<i class="fa fa-exclamation-triangle"></i> Password does not match!');
                setTimeout(function() {   
                    $('#response').css('visibility', 'hidden');
                    $('#response').removeClass('send_message_error');
	           }, 3000); 
            }
                
        }
        return false;
    });
});
