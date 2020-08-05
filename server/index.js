
require('dotenv').config();

const 
    express = require('express'),
    massive = require('massive'),
    session = require('express-session'),
    authCtrl = require('./controllers/authController'),
    mainCtrl = require('./controllers/mainController'),
    emailCtrl = require('./controllers/emailController'),
    
    {SERVER_PORT,CONNECTION_STRING,SESSION_SECRET} = process.env,
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
app.get('/api/checkuser', authCtrl.checkuser);

//post endpoints
app.post('/api/post', mainCtrl.createPost);
app.get('/api/posts/:id', mainCtrl.getUserPosts);
app.delete('/api/post/:id', mainCtrl.deletePost);

//user endpoints
app.put('/api/user/:id', mainCtrl.updateUsername);

//stock endpoints
app.post('/api/symbol', mainCtrl.addSymboltoDB)
app.get('/api/symbols/:id', mainCtrl.getSymbolfromDB)
app.delete('/api/symbol/:id', mainCtrl.deleteSymbol)

//contact endpoint - nodemailer
app.post('/api/email', emailCtrl.email) 

app.listen(port, () => console.log(`Running Stock Alert on port ${port}`));