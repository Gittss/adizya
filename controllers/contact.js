const router = require('express').Router()
const { Contact } = require('../models')
var nodemailer = require('nodemailer')

router.post('/',(req,res)=>{
    const contact = new Contact(req.body)
    contact.save((err)=>{
        if(err) console.log(err)
    })
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth:{
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_PASSWORD
        }
    });
    console.log(transporter)
    var mailOptions = {
        from: process.env.GMAIL_USER,
        to: req.body.email,
        subject: 'Adizya Clothing',
        text: 'Successfully made an account with us. We welcome you to our family. We received your message'
    };
    transporter.sendMail(mailOptions,(err,info)=>{
        if(!err){
            res.redirect('/')
        }
        else{
            console.log(err)
            res.redirect('back')
        }
    })
})

module.exports = router