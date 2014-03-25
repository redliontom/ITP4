insert into public.user(email,password,username,forename,surname) 
	values ('user@userweb.at',sha256('password'),'testuser', 'test', 'user');