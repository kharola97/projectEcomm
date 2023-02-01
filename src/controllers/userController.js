exports.createUser = async (req, res) => {
    try {
      let data = req.body;
      let fields = Object.keys(data);
      if (fields.length == 0)
        return res.status(400).send({
          status: false,
          message: "Please provide data for create a book.",
        });
      fields.forEach((x) => (data[x] = data[x].toString().trim()));
  
      let {
        fname,
        lname,
        email,
        profileImage,
        phone,
        password,
        address,
        billing,
        userId,
        ...rest
      } = data; //Destructuring
  
      if (Object.keys(rest).length != 0) {
        //Checking extra attributes are added or not
        return res.status(400).send({
          status: false,
          message: "Not allowed to add extra attributes",
        });
      }
  
      if (!fname) {
        return res
          .status(400)
          .send({ status: false, message: "fname is required." });
      }
      if (!isValid(fname)) {
        return res
          .status(400)
          .send({ status: false, message: "Please provide Valid fname." });
      }
      fname = fname.toLowerCase();
      data.fname = data.fname.toLowerCase();
      if (!lname) {
        return res
          .status(400)
          .send({ status: false, message: "lname is required." });
      }
      if (!isValid(lname)) {
        return res
          .status(400)
          .send({ status: false, message: "Please provide Valid lname." });
      }
      if (!userId) {
        return res
          .status(400)
          .send({ status: false, message: "userId is required." });
      }
      if (!isValidObjectId(userId))
        return res
          .status(400)
          .send({ status: false, message: "Invalid userId." });
      if (!email) {
        return res
          .status(400)
          .send({ status: false, message: "email is required." });
      }
      if (!isVAlidISBN(email)) {
        return res
          .status(400)
          .send({ status: false, message: "Please provide Valid email." });
      }
      if (!phone) {
        return res
          .status(400)
          .send({ status: false, message: "phone is required." });
      }
      if (!isValid(phone)) {
        return res
          .status(400)
          .send({ status: false, message: "Please provide Valid phone." });
      }
      if (!password) {
        return res
          .status(400)
          .send({ status: false, message: "password is required." });
      }
      if (!isValid(password)) {
        return res
          .status(400)
          .send({ status: false, message: "Please provide Valid password." });
      }
      if (!address) {
        return res
          .status(400)
          .send({ status: false, message: "address is required." });
      }
      if (!(billing)) {
        return res
          .status(400)
          .send({ status: false, message: "billing is required." });
      }
  
      /*----------------------------------- Checking Unique -----------------------------*/
  
      const check = await UserModel.findOne({ $or: [{ fname }, { lname }] });
  
      if (check) {
        if (check.fname == fname) {
          return res
            .status(400)
            .send({ status: false, message: "This title is already exist." });
        }
        if (check.lname == lname) {
          return res
            .status(400)
            .send({ status: false, message: "This ISBN is already exist." });
        }
      }
  
      /*---------------------------------------------------------------------------------------*/
  
      let files = req.files;
      let uploadedFileURL;
      if (files && files.length > 0) {
        uploadedFileURL = await uploadFile(files[0]);
      } else {
        return res.status(400).send({ status: false, message: "No file found" });
      }
  
      /*---------------------------------------------------------------------------------------*/
      let createUser = await UserModel.create({
        ...data,
        profileImage: uploadedFileURL,
      });
  
      return res.status(201).send({
        status: true,
        message: `This user is created sucessfully.`,
        data: createUser,
      });
    } catch (error) {
      return res.status(500).send({ status: false, message: error.message });
    }
  };


  /****************************get user data***************************************************************/

  
exports.getUserData = async function(req,res){

  try{
      let userId = req.params.userId

      if (!mongoose.isValidObjectId(userId)) {
        return res.status(400).send({ status: false, message: "Invalid userId" });
      }

      let userData = await userModel.findById(userId)
      if(!userData){
          return res.status(404).send({status:false,message:"User not found"})
      }

      return res.status(200).send({status:true,message:"User profile details",data:userData})

  } catch(err){
      return res.status(500).send({status:false,message:err.message})
  }
}
