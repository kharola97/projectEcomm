
const {isValid} =require('../validators/validation')
const UserModel =require('../models/usermodel')
const validator = require ('validator')
const {uploadFile}=require('../aws/s3Service')
const bcrypt = require ('bcrypt');

const createUser = async (req, res) => {
    try {
      let data = req.body;
      let files = req.files;
      let fields = Object.keys(data);
      if (fields.length == 0)return res.status(400).send({status: false,message: "Please provide data for create the user."});

  
      if (!isValid(data.fname)) return res.status(400).send({status: false,message: "fname is mandatory"});
      if(parseInt(data.fname)) return res.status(400).send({status: false,message: "give valid name"});

      if (!isValid(data.lname)) return res.status(400).send({status: false,message: "lname is mandatory"});
      if(parseInt(data.lname)) return res.status(400).send({status: false,message: "give valid last name"});
      //check validation for email ---------------------------------------------------------------
      if (!isValid(data.email)) return res.status(400).send({status: false,message: "email is mandatory"});
      if (!validator.isEmail(data.email)) return res.status(400).send({ status: false, msg: "please enter valid email address!" })
      
      if(files.length==0) return res.status(400).send({status: false,message: "profile image  is mandatory"});

      // phone validation ---------------------------------------------
      if (!isValid(data.phone)) return res.status(400).send({status: false,message: "phone is mandatory"});
      if(!(data.phone.match(/^(\+91[\-\s]?)?[0]?(91)?[6789]\d{9}$/))) return res.status(400).send({ status: false, message: "phone number is not valid" })


      
      /*----------------------------------- Checking Unique -----------------------------*/
  
      const email = await UserModel.findOne({email:data.email});
      if(email) return res.status(400).send({status:false,message:"email already exist"})

      const phone = await UserModel.findOne({phone:data.phone});
      if(phone) return res.status(400).send({status:false,message:"phone already exist"})

  
      // password validation --------------------------------
      if (!isValid(data.password)) return res.status(400).send({status: false,message: "password is mandatory"});
      if(data.password.length <8 || data.password.length>15) return res.status(400).send({status: false,message: "password length should be in range 8-15"});
      if (!(data.password.match(/.*[a-zA-Z]/))) return res.status(400).send({ status: false, error: "Password should contain alphabets" }) // password must be alphabetic //
      if (!(data.password.match(/.*\d/))) return res.status(400).send({ status: false, error: "Password should contain digits" })// we can use number also //
      // encrypt the password
      const saltRounds=10 //default
      bcrypt.hash(data.password, saltRounds, function(err, hash) {
        if(err) return res.status(400).send({status:false,message:"invalid password"})
        else data.password=hash  
      });



      if (!isValid(data.address.shipping.street)) return res.status(400).send({status: false,message: "shipping address street is mandatory"});
      if (!isValid(data.address.shipping.city)) return res.status(400).send({status: false,message: "shipping address city is mandatory"});
      if (!data.address.shipping.pincode) return res.status(400).send({status: false,message: "shipping address pincode is mandatory"});
      if(parseInt(data.address.shipping.pincode)!=data.address.shipping.pincode) return res.status(400).send({status: false,message: "shipping address pincode should only be Number"});

      if (!isValid(data.address.billing.street)) return res.status(400).send({status: false,message: "billing address street is mandatory"});
      if (!isValid(data.address.billing.city)) return res.status(400).send({status: false,message: "billing address city is mandatory"});
      if (!data.address.billing.pincode) return res.status(400).send({status: false,message: "billing address pincode is mandatory"});
      if(parseInt(data.address.billing.pincode)!=data.address.billing.pincode) return res.status(400).send({status: false,message: "billing address pincode should only be Number"});


      data.fname = data.fname.toLowerCase();
      data.lname=data.lname.toLowerCase()
      data.email=data.email.toLowerCase()
      
    

      /*-----------------------------------upload files on s3 storage and getting the link----------------------------------------------------*/
  
      if (files.length > 0) {
        uploadedFileURL = await uploadFile(files[0]);
      } else {
        return res.status(400).send({ status: false, message: "No file found" });
      }
      data.profileImage=uploadedFileURL
      /*---------------------------------------------------------------------------------------*/
      let createUser = await UserModel.create(data);
  
      return res.status(201).send({status: true,message: `This user is created sucessfully.`,data: createUser,});
    } catch (error) {
      return res.status(500).send({ status: false, message: error.message });
    }
  };

module.exports.createUser=createUser
