const jwt = require('jsonwebtoken')


const authentication = async function(req,res,next){
    const token=req.authorisationn
    if(!token) return res.status(401).send({status:false,message:"not getting token"})

    jwt.verify(token,"",function(decodedToken,err){
        if(err) return res.status(401).send({status:false,message:err.message})
        else{
            req.userId= decodedToken.userId
            next()
        }
    })

}

module.exports.authentication=authentication