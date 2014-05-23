insert into public.user(email,password,username,forename,surname,status) 
	values ('user@userweb.at',crypt('password', gen_salt('bf', 8)),'testuser', 'test', 'user',true);
