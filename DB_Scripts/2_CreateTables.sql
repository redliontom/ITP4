drop table if exists public.user cascade;
create table public.user (
	pk_user			serial primary key,
	email			text not null,
	password		text not null,
	username		text unique not null,
	forename		text,
	surname			text
);

drop table if exists public.user_friend cascade;
create table public.user_friend (
	fk_user1		integer references public.user(pk_user),
	fk_user2		integer references public.user(pk_user),
	status 			boolean
);

drop table if exists public.entity cascade;
create table public.entity (
	pk_entity		serial primary key
);

drop table if exists public.like cascade;
create table public.like(
	fk_user			integer references public.user(pk_user),
	fk_entity		integer references public.entity(pk_entity)
);

drop table if exists public.foto cascade;
create table public.foto (
	pk_foto			integer primary key references public.entity(pk_entity),
	fk_user			integer references public.user(pk_user),
	directory		text,
	flash			boolean,
	aperture		text,
	exposure		text,
	focal_distance		integer,
	iso			integer,
	exposure_time		text
);

drop table if exists public.foto_attribute cascade;
create table public.foto_attribute (
	pk_foto_attribute	serial primary key,
	attribute_name		text,
	attribute_value		text
);

drop table if exists public.rel_foto_attribute cascade;
create table public.rel_foto_attribute (
	fk_foto			integer references public.foto(pk_foto),
	fk_foto_attribute	integer references public.foto_attribute(pk_foto_attribute)
);

drop table if exists public.comment cascade;
create table public.comment (
	pk_comment		integer primary key references public.entity(pk_entity),
	fk_user			integer references public.user(pk_user),
	fk_comment_on		integer references public.entity(pk_entity)
);

drop table if exists public.like cascade;
create table public.like (
	fk_user			integer references public.user(pk_user),
	fk_entity		integer references public.entity(pk_entity)
);

drop table if exists public.tag_name cascade;
create table public.tag_name (
	pk_tag_name		integer primary key,
	tag_name		text
);

drop table if exists public.entity_tag cascade;
create table public.entity_tag (
	fk_entity		integer references public.entity(pk_entity),
	fk_tag_name		integer references public.tag_name(pk_tag_name)
);

drop table if exists public.album cascade;
create table public.album (
	pk_album		serial primary key,
	fk_user			integer references public.user(pk_user),
	album_name		text
);

drop table if exists public.rel_album_foto cascade;
create table public.rel_album_foto (
	fk_album 		integer references public.album(pk_album),
	fk_foto			integer references public.foto(pk_foto)

);

drop table if exists public.equipment cascade;
create table public.equipment (
	pk_equipment 		serial primary key,
	equipment_type		text,
	equipment_name		text
);

drop table if exists public.rel_user_equipment cascade;
create table public.rel_user_equipment (
	fk_user			integer references public.user(pk_user),
	fk_equipment		integer references public.equipment(pk_equipment)
);
