const nodemailer = require('nodemailer'),
    {USER, PASS} = process.env

module.exports = {

// app.post('/send', 
email: async(req, res, next) => {
    
    const {name, email, content} = req.body,
        {id} = req.params
    // var content = `name: ${name} \n email: ${email} \n message: ${content} `
    try {
        console.log(req.body)

        let transporter = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            service: 'ethereal',
            requireTLS: true,
            auth: {
                user: USER,
                pass: PASS
            },
        })

        let info = await transporter.sendMail({
            from: name,
            to: email,
            subject: 'Email from TestAlert',
            text: content,
        }, (err, response) => {
            if(err) {
                console.log('hit')
                console.log(err)
            }else {
                res.sendStatus(200).send(info)
            }
        }
        
        )
    

    }catch(err){
        res.status(500).send(err)
    }


    
    // var mail = {
    //     from: name,
    //     to: 'coty.west@ethereal.email', 
    //     port: 587,
    //     subject: 'New Message from StockAlert Form',
    //     text: content
    // }
  
    // transporter.sendMail(mail, (err, data) => {
    //     if (err) {
    //         res.json({
    //         msg: 'fail'
    //         })
    //     } else {
    //     res.json({
    //         msg: 'success'
    //     })
    //     }
    // })
}
}
