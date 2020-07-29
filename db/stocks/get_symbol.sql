select s.symbol from stock_symbol s
join users u on s.user_id = u.user_id
where u.user_id = $1;