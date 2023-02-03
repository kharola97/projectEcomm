const cartModel= require('../models/cartmodel')
const mongoose = require("mongoose")
const usermodel = require('../models/usermodel')
const productmodel = require('../models/productmodel')



const createCart =async function(req,res){
    
}


const updateCart= async function(req,res){
    let userId = req.params.userId
    let cartId = req.body.cartId
    let productId = req.body.productId
    removeProduct = req.body.removeProduct
    if(!mongoose.Types.ObjectId.isValid(userId)) return res.status(400).send({status:false,message:"invalid user Id"})
    if(!mongoose.Types.ObjectId.isValid(cartId)) return res.status(400).send({status:false,message:"invalid user Id"})
    if(!mongoose.Types.ObjectId.isValid(productId)) return res.status(400).send({status:false,message:"invalid user Id"})
    let findProduct = await productmodel.findById(productId)
    if(!findProduct) return res.status(404).send({status:false,message:"Product not found"})
    let checkCart = await cartModel.findById(cartId)
    if(!checkCart) return res.status(400).send({status:false,message:"Cart not found"})
     let checkProduct = checkCart.items
     let filterCart = checkProduct.filter(x=>x.productId==productId)
     if(filterCart.length==0) return res.status(400).send({status:false,message:"Product doesnt exist in cart"})
   let checkUser = await usermodel.findById(userId)
   if(!checkUser) return res.status(404).send({status:false,message:"User not found"})
   if(removeProduct==0){
        let list = findProduct.items
        let remove = list.filter(x=>x.productId!=productId)
        let newCart = await cartModel.findOneAndUpdate({_id:cartId},{items:remove},{new:true})
        return res.status(200).send({status:true,message:"success",data:newCart})

   }
   if(removeProduct==1){
    let newcart = await cartModel.findOneAndUpdate({_id:cartId},{items:{$inc:{quantity:-1}}},{new:true})
    return res.status(200).send({status:true,message:"success",data:newcart})
   }
}


const cartDetails =async function(req,res){

}


const deleteCart= async function(req,res){
    
}




module.exports.createCart=createCart
module.exports.updateCart=updateCart
module.exports.cartDetails=cartDetails
module.exports.deleteCart=deleteCart