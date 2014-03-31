create or replace function func_verify_user(_username text, _password text)
	returns boolean
	as $$
begin
	if(
		select true 
		from 
			public.user 
		where 
			password=crypt(_password, password)
		and 
			username=_username
	) then 
		return true;
	end if;
	return false;
end
$$ language plpgsql;

create or replace function func_register_user( 
					_email text,
					_password text,
					_username text,
					_forename text,
					_surname text
					)
	returns void
	as $$
begin
	insert into public.user(email,password,username,forename,surname) 
		values (
			_email,
			crypt(_password, gen_salt('bf', 8)),
			_username,
			_forename,
			_surname
			);
end
$$ language plpgsql;