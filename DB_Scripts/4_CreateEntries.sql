insert into public.user(email,password,username,forename,surname,status) 
	values ('user@userweb.at',crypt('password', gen_salt('bf', 8)),'testuser', 'test', 'user',true);

insert into public.session_key(username,hash)values('testuser','f9953b711889f145dcf5f052dd4328743cacda10');
