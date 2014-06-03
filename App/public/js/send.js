$( document ).ready(function() {
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
        var email = document.forms["form_mail"]["mail"].value;
        if (email==null || email=="")
        {
            $('#response').addClass('send_message_error');
            $('#response').css('visibility', 'visible');
            $('#response').html('<i class="fa fa-exclamation-triangle"></i> The mail field is required!');
            setTimeout(function() {   
                $('#response').css('visibility', 'hidden');
                $('#response').removeClass('send_message_error');
	        }, 3000);  
           
        } else {
            $('#submit').attr('disabled');
            var data = {};
            data.email = email;
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
