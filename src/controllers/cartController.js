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
    try {
        let userId = req.params.userId;
        const deleted = await cartModel.findOneAndUpdate(
        {_id: userId, isDeleted: false},
        {isDeleted: true},
        {$inc:{totalPrice: 0, totalItems: 0}},
        {new: true}
        )
        const cart = await cartModel.findById({_id: userId})
        if(cart){
            return res.status(200).send({status:true, message:"cart exit"});
        }
        const user = await userModel.findById({_id: userId})
        if(user){
            return res.status(200).send({status:true, message:"user exit"});
        }
        res.status(204).send({status:true, message:"Success", data: deleted});
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }
};




module.exports.createCart=createCart
module.exports.updateCart=updateCart
module.exports.cartDetails=cartDetails
module.exports.deleteCart=deleteCart