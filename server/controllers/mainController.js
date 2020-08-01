
module.exports = {
    
    createPost: (req, res) => {
        const {id, postContent} = req.body,
              db = req.app.get('db');
        
        db.post.create_post(id, postContent)
        .then(() => res.sendStatus(200))
        .catch(err => res.status(500).send(err));
    },
    getUserPosts: (req, res) => {
        const {id} = req.params,
              db = req.app.get('db');

        db.post.get_user_posts(id)
        .then(posts => res.status(200).send(posts))
        .catch(err => res.status(500).send(err));
    },
    deletePost: (req, res) => {
        const {id} = req.params,
              db = req.app.get('db');

        db.post.delete_post(id)
        .then(() => res.sendStatus(200))
        .catch(err => res.status(500).send(err));
    },
    updateUsername: (req, res) => {
        const {id} = req.params,
              {username} = req.body
              db = req.app.get('db');
        
        db.users.update_username(username, id)
        .then(user => res.status(200).send(user))
        .catch(err => console.log(err));
    },

    addSymboltoDB: (req, res) => {
        console.log(req.body)
        const {id, symbol} = req.body, 
              db = req.app.get('db');
        
        db.stocks.add_db({id, symbol})
        .then(() => res.sendStatus(200))
        .catch(err => res.status(500).send(err));
    },

    getSymbolfromDB: (req, res) => {
        const {id} = req.params,
              db = req.app.get('db');

        db.stocks.get_symbol(id)
        .then(symbols => res.status(200).send(symbols))
        .catch(err => res.status(500).send(err));
    },

    deleteSymbol: (req, res) => {
        const {id} = req.params,
            db = req.app.get('db');

        db.stocks.delete_symbol(id)
        .then(() => res.sendStatus(200))
        .catch(err => res.status(500).send(err));
    },
}
