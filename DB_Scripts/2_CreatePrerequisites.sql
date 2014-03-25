create extension pgcrypto; 

create or replace function sha256(bytea) 
	returns text 
	AS $$
	select encode(digest($1, 'sha256'), 'hex')
$$ language sql strict immutable;
