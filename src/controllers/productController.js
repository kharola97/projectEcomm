const productModel =require('../models/productmodel')

const createProduct = async function(req,res){

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