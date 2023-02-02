const express = require('express');
const router = express.Router();

const middleware =require('../middlewares/auth')
const userController=require('../controllers/userController');
const productController= require('../controllers/productController')







router.post('/register',userController.createUser)
router.post('/login',userController.login)
router.get('/user/:userId/profile',middleware.authentication,middleware.userAuthorization,userController.getUser)
router.put('/user/:userId/profile',middleware.authentication,middleware.userAuthorization,userController.updateUser)


router.post('/products',productController.createProduct)
router.get('/products',productController.getProducts)
// router.get('/products/:productId',productController.getProductById)



router.all('/*',(req,res)=>res.status(404).send("page not found"));
module.exports = router;