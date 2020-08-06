const nodemailer = require('nodemailer'),
    { EMAIL, PASS } = process.env

module.exports = {
    email: async (req, res) => {
        try {
            let transporter = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 587,
                service: 'gmail',
                secure: false,
                requireTLS: true,
                auth: {
                    user: EMAIL,
                    pass: PASS
                }
            });

            let info = await transporter.sendMail({
                from: `Stock Alert <${EMAIL}>`,
                to: `${req.body.email}`,
                subject: 'Stock Notification',
                
                text: `Please check your stocks - ${req.body.symbol} has changed 5%`,
                
                html: `<div>Please check stocks - ${req.body.symbol} has decreased 5%</div>
                           <img src="https://www.freelogodesign.org/file/app/client/thumb/56cf6e02-8a69-4d55-87ae-0a4e94d66251_200x200.png?1595389851905"/>`,
                
                attachments: [
                    {
                        filename: 'license.txt',
                        path: 'https://raw.github.com/nodemailer/nodemailer/master/LICENSE'
                    } 
                ]
            }, (err, res) => {
                if (err) {
                    console.log(err)
                } else {
                    res.status(200).send(info);
                }
            })
        } catch (err) {
            res.status(500).send(err);
        }
    }
}