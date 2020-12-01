const router = require('express').Router()
const User = require('../models/user')
const util = require('../config/utilityFunctions')

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
            res.render('signUp',{
                message:'Email already exist',
                title:'Sign Up'
            });
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
    var user=new User(req.body)
    var message;
    if(req.body.role=='vendor'){
        if(req.body.code=='12345'){
            user.role='vendor'
            message='Registered successfully'
        }
        else message='Wrong admin code. You are registered as a user'
    }
    user.save((err)=>{
        if(!err){
            res.render('home',{
                title:"Home",
                user:user,
                message:message
            });
        }
        else{
            if(err.name=='ValidationError'){
                util.handleValidationError(err,req.body);
                console.log(err)
                console.log(req.body)
                res.render('signUp',{
                    title:'Sign Up',
                    user: req.body
                });
            }
            else console.log('error in Signing up -> '+err);
        }
    });
};

module.exports = router;