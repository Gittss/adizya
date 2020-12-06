const router = require('express').Router()
const { Product, User } = require('../models')
const product = require('../models/product')

router.get('/:id',(req,res)=>{
    User.findById(req.params.id,(err,user)=>{
        if(!err){
            Product.find((err,products)=>{
                res.render('viewProducts',{
                    title:'Buy products',
                    name:user.name,
                    uid:user.id,
                    products:products,
                    role:0
                })
            })
        }
        else res.send(err)
    })
})

router.get('/add:uid/:id',(req,res)=>{
    User.findById(req.params.uid,(err,user)=>{
        user.update(user.cart.push(req.params.id))
        User.findByIdAndUpdate(req.params.uid,user,(err)=>{
            if(!err){
                res.redirect('/cart/view/'+req.params.uid)
            }
            else{
                res.redirect('back')
            }
        })
    })
})

router.get('/view/:id',(req,res)=>{
    User.findById(req.params.id,(err,user)=>{
        Product.find({_id:{$in:user.cart}},(err,products)=>{
            if(user.cart.length == 0) var message='Cart empty !!'
            res.render('viewProducts',{
                title:'Your cart',
                name:user.name,
                uid:user.id,
                products:products,
                role:1,
                cart:1,
                message:message
            })
        })
    })
})

router.get('/update:uid/:id',(req,res)=>{
    User.findById(req.params.uid,(err,user)=>{
        user.update(user.cart.pull(req.params.id))
        User.findByIdAndUpdate(req.params.uid,user,(err)=>{
            if(!err){
                res.redirect('/cart/view/'+req.params.uid)
            }
            else{
                res.redirect('back')
            }
        })
    })
})

router.get('/bill/:uid',(req,res)=>{
    User.findById(req.params.uid,(err,user)=>{
        if(!err){
            Product.find({_id:{$in:user.cart}},(err,products)=>{
                var total=0;
                for(i=0;i<products.length;i++){
                    total+=products[i].price;
                }
                res.render('bill',{
                    title:'Billing',
                    name:user.name,
                    products:products,
                    total:total
                })
            })
        }
    })
})

module.exports = router