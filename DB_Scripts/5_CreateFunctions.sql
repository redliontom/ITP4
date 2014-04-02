create or replace function func_verify_user(_username text, _password text)
	returns text
	as $$
declare
	_passwordHash text := (select password from public.user where username=_username);
begin
	if(_passwordHash=crypt(_password, _passwordHash)) then 
		return _passwordHash;
	end if;
	return 'null';
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