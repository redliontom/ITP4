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

create or replace function func_verify_user_cookie(_username text, _hash text)
	returns text
	as $$
declare
	_passwordHash text := (select password from public.user where username=_username);
begin
	if(_passwordHash=_hash) then 
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
	returns boolean
	as $$
begin
	insert into public.user(email,password,username,forename,surname,status) 
		values (
			_email,
			crypt(_password, gen_salt('bf', 8)),
			_username,
			_forename,
			_surname,
			false
			);
	return true;
exception
	when unique_violation then
	return false;
end
$$ language plpgsql;

create or replace function func_get_user_by_mail(_mail text)
	returns table (
		pk_user int, 
		email text, 
		password text,
		forename text,
		surname text,
		status boolean 
	) 
	as $$
begin
	return query 
		select u.pk_user, u.email, u.password, u.forename, u.surname, u.status 
		from public.user as u 
		where u.email = _mail;
end
$$language plpgsql;


create or replace function func_change_password(_password text, _pk_user int)
	returns boolean
	as $$
begin
	update public.user set password = crypt(_password, gen_salt('bf', 8)) where pk_user = _pk_user;
	return true;
exception
	when unique_violation then
	return false;
end
$$language plpgsql;


create or replace function func_verify_oauth(_oauth_id text)
	returns int
	as $$
begin
	return (select count(*) from public.user where oauth_id = _oauth_id); 
end
$$language plpgsql;


create or replace function func_register_user_oauth( 
					_email text,
					_username text,
					_forename text,
					_surname text,
					_oauth_id text
					)
	returns boolean
	as $$
begin
	insert into public.user(email,username,forename,surname,status, oauth_id) 
		values (
			_email,
			_username,
			_forename,
			_surname,
			true,
			_oauth_id
			);
	return true;
exception
	when unique_violation then
	return false;
end
$$ language plpgsql;
