const router = require('express').Router()
const Product = require('../models/product')
const util = require('../config/utilityFunctions')
const User = require('../models/user')

router.get('/',(req,res)=>{
    res.render('products',{title:'Our Products'})
})

router.get('/add:id',(req,res)=>{
    console.log(req.params.id)
    res.render('addProduct',{
        title:'Add Product',
        vendorId:req.params.id
    })
})

router.post('/add:id',(req,res)=>{
    if(req.body.id==''){
        var product = new Product(req.body)
        product.vendorId = req.params.id
        product.save((err)=>{
            if(!err){
                res.redirect('/product/viewProducts'+product.vendorId)
            }
            else{
                if(err.name=='ValidationError'){
                    util.handleValidationError(err,req.body);
                    console.log(err)
                    res.render('addProduct',{
                        title:'Add Product',
                        vendorId:req.params.id,
                        product:req.body
                    })
                }
            }
        })
    }
    else{
        Product.findById(req.body.id,(err,product)=>{
            if(!err){
                product.name = req.body.name
                product.dresscode = req.body.dresscode
                product.size = req.body.size
                product.price = req.body.price
                Product.findByIdAndUpdate(req.params.id,product,(err)=>{
                    if(!err){
                        product.save((err)=>{
                            if(!err){
                                res.redirect('/product/viewProducts'+product.vendorId)
                            }
                            else{
                                if(err.name=='ValidationError'){
                                    util.handleValidationError(err,req.body)
                                    res.render('addProduct',{
                                        title:'Update Product',
                                        vendorId:req.params.id,
                                        product:req.body
                                    })
                                }
                            }
                        })
                    }
                })
            }
            else{
                console.log(err)
                res.redirect('back')
            }
        })
    }
})

router.get('/viewProducts:id',(req,res)=>{
    User.findById(req.params.id,(err,doc)=>{
        Product.find({vendorId:req.params.id},(err,products)=>{
            if(!err){
                res.render('viewProducts',{
                    title:'Your products',
                    name:doc.name,
                    products:products,
                    role:1,
                    cart:0
                })
            }
            else{
                console.log(err)
                res.redirect('back')
            }
        })
    })
})

router.get('/view:id',(req,res)=>{
    Product.findById(req.params.id,(err,doc)=>{
        if(!err){
            res.render('viewProduct',{
                title:'Product page',
                product:doc
            })
        }
        else{
            res.redirect('back')
        }
    })
})

router.get('/update:id',(req,res)=>{
    Product.findById(req.params.id,(err,product)=>{
        if(!err){
            res.render('addProduct',{
                title:'Update Product',
                product:product,
                vendorId:product.vendorId
            })
        }
    })
})

router.get('/delete:id',(req,res)=>{
    Product.findByIdAndRemove(req.params.id,(err,doc)=>{
        if(!err){
            res.redirect('/product/viewProducts'+doc.vendorId)
        }
    })
})

module.exports = router