select n.note_id, n.note_content from note n
join users u on n.user_id = u.user_id
where u.user_id = $1;