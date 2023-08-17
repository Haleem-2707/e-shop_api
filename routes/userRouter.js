const express = require("express");
const { User } = require("../model/User");
const bcrypt = require("bcrypt");
const generateToken = require("../helper/generateToken");
const getTokenFromHeader = require("../helper/getTokenFromHeader");
const isLogin = require("../middlewares/isLogin");
const appErr = require("../helper/appErr");
const isAdmin = require("../middlewares/isAdmin");
const router = express.Router();



// GET METHOD
// Get all User
router.get("/", isLogin, isAdmin, async (req, res) => {
    const userList = await User.find();
    res.send(userList) ;
});

//post method: register ---------------------A new router for registration

router.post("/register", async (req, res, next) => {
    const {
        name,
        email,
        passwordHash,
        phone,
        isAdmin,
        street,
        apartment,
        zip,
        city,
        country,
        } = req.body;

         // secure password
    const salt = await bcrypt.genSalt(10);

     // Checking if name is already created

        const userFound = await User.findOne({ name });
        if (userFound) {
          return next(appErr(`${name} User already exist`, 404));
         
        }

        //checking if email already exist

        const userEmail = await User.findOne({ email });
        if (userEmail) {
          return next(appErr(`${email} User already exist`, 404));
         
        }

    let user = new User ({
      name,
      email,
      passwordHash: bcrypt.hashSync(passwordHash, salt),
      phone,
      isAdmin,
      street,
      apartment,
      zip,
      city,
      country,
        
    });
    user = await user.save();
    if(!user){
        return next(appErr("User cannot send.", 404));
    }
    res.send(user);
  
});


//post method: login------------------------A new router for logIn
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    //email validation
    const userFound = await User.findOne({ email: email });
    if (!userFound){
       return res.status(404).send("Invalid email or password provided")
    };

   if (userFound && bcrypt.compareSync(password, userFound.passwordHash)) {
    res.status(200).json({
        message: "User login successfully",
        name: userFound.name,
        email: userFound.email,
        isAdmin: userFound.isAdmin,
        token: generateToken(userFound._id),
        id: userFound._id,
    });
   } else {
      res.status(404).json ({
        message: "Invalid username or password provided" ,
      });
   }
});


// delete user

router.delete("/:id", isLogin, isAdmin, async (req, res) => {
    const userList = await User.findByIdAndRemove( req.params.id);
      if (!userList) {
        res.status(404).send ("The user with this id is not found")
      };
     

    res.send("User deleted successfully");
    
});



//get single user/ user profile
router.get("/profile", isLogin, async (req, res) => {
  console.log(getTokenFromHeader(req)); 
  const userProfile = await User.findById(req.userAuth);
  res.send(userProfile) ;
});

//update user

router.put("/update", isLogin, isAdmin, async (req, res) => {
  const {  name,
    email,
    passwordHash,
    phone,
    street,
    apartment,
    zip,
    city,
    country,} = req.body;


     //checking if email already exist

     const userEmail = await User.findOne({ email });
     if (userEmail) {
       return next(appErr(`${email} User already exist`, 404));
      
     }
  const userList = await User.findByIdAndUpdate(
      req.userAuth,
      {
        name,
        email,
        passwordHash,
        phone,
        street,
        apartment,
        zip,
        city,
        country,
      },
      {new: true}
  );
  if(!userList) {
      res.status(404).send("The user with this id is not found");
  }

  res.send(userList) ;
});



//Count all users
router.get("/get/count", async(req, res) => {
  const userCount = await User.countDocuments();
  if (!userCount) {
    res.status(404).json({ success: false });
  }
  res.send({
    count: userCount,
  });
});

module.exports = router;