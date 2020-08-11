update users
set username = $1
where user_id = $2;

select user_id, username, email from users
where user_id = $2;