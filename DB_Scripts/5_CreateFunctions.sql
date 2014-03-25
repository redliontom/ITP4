create or replace function func_verify_user(_username text, _password text)
	returns boolean
	as $func$
begin
	if(
		select true 
		from 
			public.user 
		where 
			password=sha256(bytea(_password)) 
		and 
			username=_username
	) then 
		return true;
	end if;
	return false;
end
$func$ language plpgsql;


