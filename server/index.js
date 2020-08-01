
require('dotenv').config();

const 
    express = require('express'),
    massive = require('massive'),
    session = require('express-session'),
    authCtrl = require('./controllers/authController'),
    mainCtrl = require('./controllers/mainController'),
    // nodemailer = require("nodemailer"),
    email = require('./controllers/emailController'),
    
    {EMAIL_SECRET,SERVER_PORT,CONNECTION_STRING,SESSION_SECRET} = process.env,
    port = SERVER_PORT,
    app = express();

    // transporter = nodemailer.createTransport({
    //     host: 'smtp.ethereal.email',
    //     secure: true,
    //     auth: {
    //         user: USER,
    //         pass: PASS
    //     },
    // }),

app.use(express.json());

app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: SESSION_SECRET,
    cookie: {maxAge: 1000 * 60 * 60 * 24 * 365}
}));


// transporter.verify((error, success) => {
//     if (error) {
//         console.log(error);
//     } else {
//         console.log('Server ready');
//     }
// });

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
app.post('/api/email', email.email) 

// (req, res, next) => {
//     var name = req.body.name
//     var email = req.body.email
//     var message = req.body.message
//     var content = `name: ${name} \n email: ${email} \n message: ${content} `
  
//     var mail = {
//         from: name,
//         to: 'coty.west@ethereal.email', 
//         port: 587,
//         subject: 'New Message from StockAlert Form',
//         text: content
//     }
  
//     transporter.sendMail(mail, (err, data) => {
//         if (err) {
//             res.json({
//             msg: 'fail'
//             })
//         } else {
//         res.json({
//             msg: 'success'
//         })
//         }
//     })
// }



app.listen(port, () => console.log(`Running Stock Alert on port ${port}`));