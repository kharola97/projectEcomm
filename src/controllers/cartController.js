const cartModel= require('../models/cartmodel')
const productmodel = require('../models/productmodel')
const userModel= require('../models/usermodel')
const ObjectId = require('mongoose').Types.ObjectId
const { isValid } = require('../validators/validation')


const createCart =async function(req,res){
    const data=req.body
    const userId = req.params.userId
    if(!ObjectId.isValid(userId)) return res.status(400).send({status:false,message:"userId is not valid"})

    if(!isValid(data.userId)) return res.status(400).send({status:false,message:"userId is mandatory"})
    if(!ObjectId.isValid(data.userId)) return res.status(400).send({status:false,message:"userId from body is not valid"})
    
    if(!isValid(data.productId)) return res.status(400).send({status:false,message:"productId is mandatory"})
    if(!ObjectId.isValid(data.productId)) return res.status(400).send({status:false,message:"productId from body is not valid"})

    //sencond layer of authorization
    if(userId!=data.userId) return res.status(403).send({status:false,send:"you are not authorized to add product in cart for given userId"})

    const user = await userModel.findOne({_id:userId})
    if(!user) return res.status(400).send({status:false,message:"user not found"})

    const cart =await cartModel.findOne({userId:data.userId})

    const productData= await productmodel.findOne({_id:data.productId,isDeleted:false})

    if(!productData) return res.status(404).send({status:false,message:"product not found"})
    if(cart){
        let items=cart.items
        const product = items.filter(x=> x.productId==data.productId)
        if(product.length==0){
            items.push({productId:data.productId,quantity:1})
            const updatedCart= await cartModel.findOneAndUpdate({userId:data.userId},{$set:{items:items}, $inc:{totalPrice:productData.price,totalItems:1}},{new:true}).populate('items.productId')
            return res.status(200).send({status:true,message:"Success",data:updatedCart})
        }
        else{
            product[0].quantity=product[0].quantity+1
            const updatedCart= await cartModel.findOneAndUpdate({userId:data.userId},{$set:{items:items}, $inc:{totalPrice:productData.price,totalItems:1}},{new:true}).populate('items.productId')
            return res.status(200).send({status:true,message:"Success",data:updatedCart})
        }
    }
    else{
        const dataForCreate = {}
        dataForCreate.userId=data.userId
        dataForCreate.items=[]
        dataForCreate.items.push({productId:data.productId,quantity:1})
        dataForCreate.totalPrice=productData.price
        dataForCreate.totalItems=1
        const cart = await (await cartModel.create(dataForCreate)).populate('items.productId')
        return res.status(201).send({status:true,message:"Success",data:cart})
    }


    
}


const removeProduct= async function(req,res){

}


const cartDetails =async function(req,res){

}


const deleteCart= async function(req,res){

}




module.exports.createCart=createCart
module.exports.removeProduct=removeProduct
module.exports.cartDetails=cartDetails
module.exports.deleteCart=deleteCart