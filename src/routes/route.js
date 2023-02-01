const express = require('express');
const router = express.Router();

const middleware =require('../middlewares/auth')
const userController=require('../controllers/userController')







router.post('/register',userController.createUser)
router.post('/login')
router.get('/user/:userId/profile',middleware.authentication)
router.put('/user/:userId/profile',middleware.authentication)



router.all('/*',(req,res)=>res.status(404).send("page not found"));
module.exports = router;