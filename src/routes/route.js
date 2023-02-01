const express = require('express');
const router = express.Router();

const middleware =require('../middlewares/auth')
const userController=require('../controllers/userController');
const usermodel = require('../models/usermodel');







router.post('/register',userController.createUser)
router.post('/login',userController.login)
router.get('/user/:userId/profile',middleware.authentication,middleware.userAuthorization,userController.getUser)
router.put('/user/:userId/profile',middleware.authentication,middleware.userAuthorization,userController.updateUser)



router.all('/*',(req,res)=>res.status(404).send("page not found"));
module.exports = router;