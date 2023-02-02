const productModel =require('../models/productmodel')
const {isValid}=require('../validators/validation')
const {uploadFile} = require('../aws/s3Service')
const { default: isBoolean } = require('validator/lib/isboolean')

const createProduct = async function(req,res){
    const file =req.files
    const data =req.body
    if(Object.keys(data).length==0) return res.status(400).send({status:false,message:"body is mandatory"})

    if(!isValid(data.title)) return res.status(400).send({status:false,message:"title is mandatory"})
    //uniqueNess
    data.title=data.title.trim().toUpperCase()
    const dataWithTitle= await productModel.findOne({title:data.title, isDeleted:false})
    if(dataWithTitle) return res.status(400).send({status:false,message:"title already exist"})

    if(!isValid(data.description)) return res.status(400).send({status:false,message:"description is mandatory"})

    if(!isValid(data.price)) return res.status(400).send({status:false,message:"price is mandatory"})
    data.price=data.price.trim()
    if(parseFloat(data.price)!=data.price) return res.status(400).send({status:false,message:"price should only be a Number"})

    if(!isValid(data.currencyId)) return res.status(400).send({status:false,message:"currencyId is mandatory"})
    data.currencyId=data.currencyId.trim().toUpperCase()
    if(!['INR'].includes(data.currencyId)) return res.status(400).send({status:false,message:"currencyId should be valid"})

    if(!isValid(data.currencyFormat))return res.status(400).send({status:false,message:"currencyFormat is mandatory"})
    data.currencyFormat=data.currencyFormat.trim().toUpperCase()
    if(!['₹'].includes(data.currencyFormat)) return res.status(400).send({status:false,message:"currencyFormat should be valid"})

    if(data.isFreeShipping){
        data.isFreeShipping=data.isFreeShipping.trim()
        if(!isBoolean(data.isFreeShipping)) return res.status(400).send({status:false,message:"isFreeShipping should only be boolean true or false"})
    }
    if(data.isFreeShipping=="") data.isFreeShipping=false

    if(file.length==0) return res.status(400).send({status:false,message:"productImage is mandatory"})
    const imageUrl= await uploadFile(file[0])
    data.productImage=imageUrl

    if(data.style){
        data.style=data.style.trim()
        if(data.style) data.style=data.style.toUpperCase()
    }

    
    data.availableSizes=data.availableSizes.split(",")
    data.availableSizes=data.availableSizes.filter(x=>x.trim()!="")
    if(data.availableSizes.length==0) return res.status(400).send({status:false,message:"at least one size is required ['S', 'XS','M','X', 'L','XXL', 'XL']"})
    let newArr=data.availableSizes.filter(x=>!["S", "XS","M","X", "L","XXL", "XL"].includes(x))
    if(newArr.length!=0) return res.status(400).send({status:false,message:`sizes ${newArr} should be presented in ["S","XS","M","X","L","XXL","XL"] ` })


    if(data.installments){
        if(data.installments.trim()){
            if(parseInt(data.installments)!=data.installments) return res.status(400).send({status:false,message:"installments should only be a Number"})
        }
    }

    const productData = await productModel.create(data)
    res.status(201).send({status:false,message:"Success",data:productData})





}


const getProducts= async function(req,res){
    try {

        let data = req.query
    
        let { size, name, priceGreaterThan, priceLessThan, priceSort } = data
        if (Object.keys(data).length > 0) {
            let allProduct = await productModel.find({isDeleted:false})
            return res.status(200).send({status: true, data:allProduct})
          }

          const filter = {}

    filter["isDeleted"] = false

    if (size || size =='') {
      let newsize = size.split(",").map((x) => x.trim())
      if (!isValidAvailableSizes(newsize))
        return res.status(400).send({status: false,message: "vailable sizes are XS,S,M,L,X,XXL,XL, please enter available size"})
      
      filter["availableSizes"] = size
    }
    const finaldata = await productModel.find(filter)

    if (finaldata.length == 0) {
      return res.status(404).send({status: false,message: "No data found"})
    }

    return res.status(200).send({ status: true, message: "Success", data: finaldata })
  } 
    
    catch (error) {
        res.status(500).send({ message: error.message })
      }
}

const deleteProducts = async function (req, res) {
  try {
    let productId = req.params.productId;
    const deleted = await productModel.findOneAndUpdate(
      { _id: productId, isDeleted: false },
      { isDeleted: true },
      { new: true }
    );
    if(!deleted){
        return res.status(400).send({status:false, message:"Products will not deleted"})
    }
    res.status(200).send({ status: true, message: "Success", data: deleted });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

module.exports.createProduct = createProduct;
module.exports.getProducts = getProducts;
module.exports.deleteProducts = deleteProducts;