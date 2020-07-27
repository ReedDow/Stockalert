const bcrypt = require('bcryptjs');

module.exports = {
    register: async(req, res) => {
        const {username, email, password, profilePicture} = req.body,
              db = req.app.get('db');
        const foundUser = await db.users.check_user({email});
        if(foundUser[0]){
            return res.status(400).send('Email already in use')
        }

        let salt = bcrypt.genSaltSync(10),
            hash = bcrypt.hashSync(password, salt);

        const newUser = await db.users.register_user({username, email, password: hash, profilePicture});
        req.session.user = newUser[0];
        res.status(201).send(req.session.user);
    },

    login: async(req, res) => {
        //What does this function need to run properly?
        const {email, password} = req.body,
              db = req.app.get('db');

        //Checks if user is already in the database, based on email
        const foundUser = await db.users.check_user({email});
        if(!foundUser[0]){
            return res.status(400).send('Email not found');
        }

        //Compare the passwords to make they match
        const authenticated = bcrypt.compareSync(password, foundUser[0].password);
        if(!authenticated){
            return res.status(401).send('Password is incorrect')
        }

        //Set user on session, send it client-side
        delete foundUser[0].password;
        req.session.user = foundUser[0];
        res.status(202).send(req.session.user);
    },

    // confirmEmail: async(req, res => {
    //     try{
    //         const {username: {id}} = jwt.verify(req.params.token, EMAIL_SECRET.process.env);
    //         await db.user.update({confirmed: true}, {where: {id} });
    //     }   
    //     catch (e) {
    //     res.send('error');
    //     }
    //     return res.redirect('http:./localhost:4000/login')
    // }),
    logout: (req, res) => {
        //logout clears out the session of user data
        req.session.destroy();
        res.sendStatus(200);
    }

}