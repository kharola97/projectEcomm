const productModel =require('../models/productmodel')

const createProduct = async function(req,res){
    const file =req.files
    const data =req.body
    if(Object.keys(data).length==0) return res.status(400).send({status:false,message:"body is mandatory"})
    
}


const getProducts= async function(req,res){

}


const getProductById= async function(req,res){

}


module.exports.createProduct=createProduct
module.exports.getProducts=getProducts
module.exports.getProductById=getProductById
