insert into users (
    username,
    email,
    password
    
) values (
    ${username},
    ${email},
    ${password}
)
returning user_id, username, email;