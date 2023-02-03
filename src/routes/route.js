const express = require('express');
const router = express.Router();

const middleware =require('../middlewares/auth')
const userController=require('../controllers/userController');
const productController= require('../controllers/productController')
const cartController=require('../controllers/cartController');
const orderController=require('../controllers/orderController')
const { RoboMaker } = require('aws-sdk');







router.post('/register',userController.createUser)
router.post('/login',userController.login)
router.get('/user/:userId/profile',middleware.authentication,middleware.userAuthorization,userController.getUser)
router.put('/user/:userId/profile',middleware.authentication,middleware.userAuthorization,userController.updateUser)


router.post('/products',productController.createProduct)
router.get('/products',productController.getProducts)
router.get('/products/:productId',productController.getProductById)
router.put('/products/:productId',productController.updateProduct)
router.delete('/products/:productId',productController.deleteProduct)



router.post('/users/:userId/cart',middleware.authentication,middleware.userAuthorization, cartController.createCart)
router.put('/users/:userId/cart',middleware.authentication, middleware.userAuthorization,cartController.removeProductFromCart)
router.get('/users/:userId/cart',middleware.authentication, middleware.userAuthorization, cartController.cartDetails)
router.delete('/users/:userId/cart',middleware.authentication, middleware.userAuthorization,cartController.deleteCart)



router.post('/users/:userId/orders',middleware.authentication, middleware.userAuthorization,orderController.createOrder)
router.put('/users/:userId/orders',middleware.authentication, middleware.userAuthorization,orderController.updateOrderStatus)



router.all('/*',(req,res)=>res.status(404).send("page not found"));
module.exports = router;