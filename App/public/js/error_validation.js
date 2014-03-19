function validateForm()
{
	var error = document.querySelector('.error');
	var user = document.forms["login"]["username"].value;
	var pw = document.forms["login"]["password"].value;
	
	if ((user==null || user=="") & (pw==null || pw==""))
	{
		error.innerHTML = '<i class="fa fa-exclamation-triangle"></i> All fields are required!';
		error.className = "error active";
		document.forms["login"]["username"].focus();
		return false;
	} 
	else if (user==null || user=="")
	{
		error.innerHTML = '<i class="fa fa-exclamation-triangle"></i> The username field is required!';
		error.className = "error active";
		document.forms["login"]["username"].focus();
		return false;
	} 
	else if (pw==null || pw=="")
	{
		error.innerHTML = '<i class="fa fa-exclamation-triangle"></i> The password field is required!';
		error.className = "error active";
		document.forms["login"]["password"].focus();
		return false;
	} 
}


function validatePw()
{
	var error = document.querySelector('.error');
	var mail = document.forms["forgot"]["mail"].value;

	if (mail==null || mail=="")
	{
		error.innerHTML = '<i class="fa fa-exclamation-triangle"></i> The email address field is required!';
		error.className = "error active";
		document.forms["forgot"]["mail"].focus();
		return false;
	} 

	var val = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;	
	if (!val.test(mail))
	{
		error.innerHTML = '<i class="fa fa-exclamation-triangle"></i> Please provide a valid email address!';
		error.className = "error active";
		document.forms["forgot"]["mail"].focus();
		return false;
	}
}


function validateSignup()
{
	var error = document.querySelector('.error');
	var first = document.forms["signup"]["first"].value;
	var last = document.forms["signup"]["last"].value;
	var user = document.forms["signup"]["user"].value;
	var mail = document.forms["signup"]["mail"].value;
	var pw = document.forms["signup"]["password"].value;
	var cpw = document.forms["signup"]["confirmpassword"].value;
	var val = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;	
	
	if ((first==null || first=="") & (last==null || last=="") & (user==null || user=="") & (mail==null || mail=="") & (pw==null || pw=="")) 
	{
		error.innerHTML = '<i class="fa fa-exclamation-triangle"></i> All fields are required!';
		error.className = "error active";
		document.forms["signup"]["first"].focus();
		return false;
	}
	else if (first==null || first=="")
	{
		error.innerHTML = '<i class="fa fa-exclamation-triangle"></i> The first name field is required!';
		error.className = "error active";
		document.forms["signup"]["first"].focus();
		return false;
	} 
	else if (last==null || last=="")
	{
		error.innerHTML = '<i class="fa fa-exclamation-triangle"></i> The last name field is required!';
		error.className = "error active";
		document.forms["signup"]["last"].focus();
		return false;
	} 
	else if (user==null || user=="")
	{
		error.innerHTML = '<i class="fa fa-exclamation-triangle"></i> The username field is required!';
		error.className = "error active";
		document.forms["signup"]["user"].focus();
		return false;
	} 
	else if (mail==null || mail=="")
	{
		error.innerHTML = '<i class="fa fa-exclamation-triangle"></i> The email address field is required!';
		error.className = "error active";
		document.forms["signup"]["mail"].focus();
		return false;
	} 
	else if (!val.test(mail))
	{
		error.innerHTML = '<i class="fa fa-exclamation-triangle"></i> Please provide a valid email address!';
		error.className = "error active";
		document.forms["signup"]["mail"].focus();
		return false;
	}	
	else if (pw==null || pw=="")
	{
		error.innerHTML = '<i class="fa fa-exclamation-triangle"></i> The password field is required!';
		error.className = "error active";
		document.forms["signup"]["password"].focus();
		return false;
	} 
	else if (pw!=cpw)
	{
		error.innerHTML = '<i class="fa fa-exclamation-triangle"></i> Password does not match!';
		error.className = "error active";
		document.forms["signup"]["password"].focus();
		return false;
	}
}