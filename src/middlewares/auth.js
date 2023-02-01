const jwt = require('jsonwebtoken')


const authentication = async function(req,res,next){
    
    let token=req.headers['authorization']
    console.log(token)
    if(!token) return res.status(401).send({status:false,message:"not getting token"})
    
    token = token.replace("Bearer ","")
    console.log(token)

    jwt.verify(token,"Secret-key",function(err,decodedToken){
        if(err) return res.status(401).send({status:false,message:err.message})
        else{
            req.userId= decodedToken.userId
            next()
        }
    })

}

const userAuthorization = async function (req,res,next){
    const userId=req.params.userId
    if(userId==req.userId) return next()
    else return res.status(403).send({status:false,message:"you are not authorized personn to see profile"})
}

module.exports.authentication=authentication
module.exports.userAuthorization=userAuthorization