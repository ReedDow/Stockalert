
require('dotenv').config();

const 
    express = require('express'),
    massive = require('massive'),
    session = require('express-session'),
    authCtrl = require('./controllers/authController'),
    mainCtrl = require('./controllers/mainController'),
    nodemailer = require("nodemailer"),

    

 transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_PASS
        },
    }),

    {EMAIL_SECRET, GMAIL_USER, GMAIL_PASS, SERVER_PORT, CONNECTION_STRING,SESSION_SECRET} = process.env,
    port = SERVER_PORT,
    app = express();

app.use(express.json());

app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: SESSION_SECRET,
    cookie: {maxAge: 1000 * 60 * 60 * 24 * 365}
}));

massive({
    connectionString: CONNECTION_STRING,
    ssl: {rejectUnauthorized: false}
}).then(db => {
    app.set('db', db);
    console.log('db connected');
});

//auth endpoints
app.post('/api/register', authCtrl.register);
app.post('/api/login', authCtrl.login);
app.get('/api/logout', authCtrl.logout);
//email confirmation
// app.get('/confirmation/:token', authCtrl.confirmEmail);

//post endpoints
app.post('/api/post', mainCtrl.createPost);
app.get('/api/posts/:id', mainCtrl.getUserPosts);
app.delete('/api/post/:id', mainCtrl.deletePost);

//user endpoints
app.put('/api/user/:id', mainCtrl.updateUsername);

//add symbol to db
app.post('/api/symbol', mainCtrl.addSymboltoDB)



app.listen(port, () => console.log(`Running Stock Alert on port ${port}`));