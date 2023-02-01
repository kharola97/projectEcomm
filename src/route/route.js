const express = require('express');
const router = express.Router();







router.post('/register')
router.post('/login')
router.get('/user/:userId')



router.all('/*',(req,res)=>res.status(404).send("page not found"));
module.exports = router;