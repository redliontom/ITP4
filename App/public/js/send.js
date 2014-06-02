$( document ).ready(function() {
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
                data: SON.stringify(data),
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
});
