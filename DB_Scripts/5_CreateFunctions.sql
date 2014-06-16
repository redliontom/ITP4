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
		username text,
		email text, 
		password text,
		forename text,
		surname text,
		status boolean 
	) 
	as $$
begin
	return query 
		select u.pk_user, u.username, u.email, u.password, u.forename, u.surname, u.status 
		from public.user as u 
		where u.email = _mail;
end
$$language plpgsql;

create or replace function func_verify_change_password(_id int, _username text)
	returns text
	as $$
begin
	return (select password from public.user where pk_user = _id AND username = _username); 
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

create or replace function func_create_auth_session(_username text, _series text, _token text)
	returns boolean
	as $$
declare
	_count integer := (select count(*) from public.auth_session where username = _username);
begin
	if (_count <= 0) then
		insert into public.auth_session (username, series, token) values (_username, _series, _token);
		return true;
	end if;

	if (_count = 1) then
		update public.auth_session set series = _series, token = _token where username = _username;
		return true;
	end if;

	update public.auth_session set valid = false where username = _username;
	return false;
end
$$ language plpgsql;

create or replace function func_destroy_auth_session(_username text)
	returns boolean
	as $$
declare
	_count integer := (select count(*) from public.auth_session where username = _username);
begin
	if (_count > 0) then
		delete from public.auth_session where username = _username;
		return true;
	end if;

	return false;
end
$$ language plpgsql;

create or replace function func_check_auth_session(_username text, _series text, _token text)
	returns boolean
	as $$
declare
	_count integer := (select count(*) from public.auth_session where username = _username and series = _series and token = _token);
begin
	if (_count <= 0) then
		update public.auth_session set valid = false where username = _username;
		return false;
	end if;

	return true;
end
$$ language plpgsql;

create or replace function func_save_picture_infos(
	_username text,
	_name text,
	_directory text,
	_flash text,
	_aperture text,
	_exposure_time text,
	_focal_distance text,
	_iso text
	)
	returns boolean
	as $$
declare
	lastId integer;
begin
	insert into public.entity(pk_entity) VALUES(DEFAULT) RETURNING pk_entity into lastId;
	insert into public.foto(pk_foto, fk_user, name, directory, flash, aperture, exposure_time, focal_distance, iso) 
		values (
			lastId,
			_username,
			_name,
			_directory,
			_flash,
			_aperture,
			_exposure_time,
			_focal_distance,
			_iso
			);
	return true;
exception
	when unique_violation then
	return false;
end
$$ language plpgsql;

create or replace function func_change_user_name(_username text, _forename text, _surname text)
	returns boolean
	as $$
declare
	_count int := (select count(*) from public.user where username=_username);
begin
	if (_count = 0) then
		return false;
	end if;
	
	update public.user set forename=_forename, surname=_surname where username=_username;
	return true;
end
$$ language plpgsql;

create or replace function func_change_user_mail(_username text, _mail text)
	returns boolean
	as $$
declare
	_count int := (select count(*) from public.user where username=_username);
begin
	if (_count = 0) then
		return false;
	end if;
	
	update public.user set email=_mail where username=_username;
	return true;
end
$$ language plpgsql;

create or replace function func_change_user_password(_username text, _old text, _new text)
	returns boolean
	as $$
declare
	_password text := (select password from public.user where username=_username);
	_count int := (select count(*) from public.user where username=_username and password=crypt(_old, _password));
begin
	if (_count = 0) then
		return false;
	end if;
	
	update public.user set password=crypt(_new, gen_salt('bf', 8)) where username=_username;
	return true;
end
$$ language plpgsql;


