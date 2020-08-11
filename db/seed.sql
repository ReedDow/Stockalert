
create table if not exists users (
    user_id serial primary key,
    username varchar(20),
    email varchar(150),
    password varchar(250),
);

create table if not exists note (
    note_id serial primary key,
    user_id int references users(user_id),
    note_id references stock_symbol(stock_id),
    note_content text
);

create table if not exists stocks(
    stock_id serial primary key,
    user_id int references users(user_id),
    stock_name varchar(50),
    stock_symbol varchar(10)
);

create table stock_symbol(
    stock_id serial primary key,
    symbol varchar(20),
    user_id int references users(user_id)
);