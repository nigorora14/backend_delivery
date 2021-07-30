drop table if exists roles cascade;
create table roles(
	id bigserial primary key,
	name varchar(180) not null unique,
	image varchar(255) null,
	route varchar(255) null,
	create_at timestamp(0) not null,
	update_at timestamp(0) not null
);

drop table if exists users cascade;
create table users(
	id bigserial primary key,
	email varchar(255) not null unique,
	name varchar(255) not null,
	lastname varchar(255) not null,
	phone varchar(20) not null,
	image varchar(255) not null,
	password varchar(255) not null,
	is_available boolean null,
	session_token varchar(500) not null,
	create_at timestamp(0) not null,
	update_at timestamp(0) not null
);

drop table if exists user_has_roles cascade;
create table user_has_roles(
	id_user bigserial not null,
	id_rol bigserial not null,
	create_at timestamp(0) not null,
	update_at timestamp(0) not null,
	foreign key(id_user) references users(id) on update cascade on delete cascade,
	foreign key(id_user) references roles(id) on update cascade on delete cascade,
	primary key(id_user,id_rol)
);

insert into roles (
	name,route,create_at,update_at
) values (
	'CLIENTE','client/products/list','2021-07-15','2021-07-15'
);
insert into roles (
	name,route,create_at,update_at
) values (
	'RESTAURANTE','restaurant/orders/list','2021-07-15','2021-07-15'
);
insert into roles (
	name,route,create_at,update_at
) values (
	'REPARTIDOR','delivery/orders/list','2021-07-15','2021-07-15'
);

drop table IF exists CATEGORIES cascade;
create table CATEGORIES (
	ID bigserial primary key,
	NAME varchar(100) not null unique,
	description varchar(255) not null,
	create_at timestamp(0) not null,
	update_at timestamp(0) not null
);

drop table IF exists products cascade;
create table products (
	ID bigserial primary key,
	NAME varchar(180) not null unique,
	description varchar(255) not null,
	price decimal default 0,
	image1 varchar(255) not null,
	image2 varchar(255) null,
	image3 varchar(255) null,
	id_category bigint not null,
	create_at timestamp(0) not null,
	update_at timestamp(0) not null,
	foreign key(id_category) references CATEGORIES(id) on update cascade on delete cascade
);
