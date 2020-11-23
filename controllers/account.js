const router = require('express').Router()
const User = require('../models/user')

router.get('/signUp',(req,res)=>{
    res.render('signUp',{title:'Sign up'})
})

router.get('/login',(req,res)=>{
    res.render('login',{title:'Login'})
})

router.post('/signUp',(req,res) =>{
    User.findOne({email:req.body.email},(err,obj)=>{
        if(obj===null) {
            addUser(req,res);
        }
        else {
            console.log("Email taken");
            res.render('signUp',{title:'Email already exist'});
        };
    });
})

router.post('/login',(req,res)=>{
    User.findOne({email:req.body.email},(err,obj)=>{
        if(!err){
            if(req.body.email=='' | req.body.password==''){
                if(req.body.email=='' & req.body.password=='')
                    res.render('login',{
                        title:'Welcome',
                        uid:'This field is required',
                        ups:'This field is required'
                    });
                else{
                    if(req.body.email=='') res.render('login',{uid:'This field is required'})
                    else if(req.body.password=='') res.render('login',{ups:'This field is required'})
                }
            }
            else if(obj==null){
                res.render('login',{
                    viewTitle:'User does not exist'
                })
            }
            else if(req.body.password!=obj.password || req.body.password==null){
                res.render('login',{
                    viewTitle:'Incorrect Password'
                })
            }
            else if(req.body.password==obj.password){
                res.render('home',{
                    user:obj,
                    title:'Home'
                })
            }
        }else console.log('Error in signing in')
    });
})

function addUser(req,res){
    var user=new User()
    user.name=req.body.name;
    user.email=req.body.email;
    user.password=req.body.password;
    if(req.body.role){
        if(req.body.code=='12345'){
            user.role='admin'
        }
        else message='Wrong admin code. You are registered as a user'
    }
    user.save((err)=>{
        if(!err){
            res.render('home',{
                title:"Home",
                user:user,
                message:message,
                layout:null
            });
        }
        else{
            if(err.name=='ValidationError'){
                handleValidationError(err,req.body);
                res.render('signUp',{user: req.body});
            }
            else console.log('error in Signing up -> '+err);
        }
    });
};

function handleValidationError(err,body){
    for(field in err.errors){
        switch(err.errors[field].path){
            case 'name':
                body['nameError']=err.errors[field].message;
                break;
            case 'email':
                body['emailError']=err.errors[field].message;
                break;
            case 'password':
                body['passwordError']=err.errors[field].message;
                break;
            case 'phoneNumber':
                body['phoneNumberError']=err.errors[field].message;
                break;
            default: break;
        }
    }
};

module.exports = router;