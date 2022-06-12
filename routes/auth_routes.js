const dotenv = require("dotenv");
dotenv.config({ path: "../.env" });
const User = require("../models/User");
const router = require("express").Router();
const { registerValidation, loginValidation } = require("../config/validation");
const bcrypt = require("bcryptjs");

// const CLIENT_LOGIN_PAGE_URL = process.env.NODE_ENV ==='production'?"/":"http://localhost:3000/";
const CLIENT_LOGIN_PAGE_URL = "http://localhost:3000/";
const authorize = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect("/auth/login");
  }
  next();
};

const authorized = (req, res, next) => {
  if (req.session.user) {
    return res.redirect("/home");
  }
  next();
};
const directory = "tmp";

const clearTmp = () => {
  fs.readdir(directory, (err, files) => {
    if (err) throw err;

    for (const file of files) {
      fs.unlink(path.join(directory, file), (err) => {
        if (err) throw err;
      });
    }
  });
};

router.post("/register", async (req, res) => {
  console.log("reached user registration");
  // console.log(req.body);

  const emailExists = await User.findOne({ email: req.body.email });
  if (emailExists)
    return res.status(400).json({
      status: false,
      message: "Email already registered!",
    });

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);
  const user = new User({
    username: req.body.username,
    email: req.body.email,
    password: hashedPassword,
  });
  try {
    const savedUser = await user.save();
    req.user = savedUser;
    // res.render("login",{registeredNow:true,username:savedUser.username,loginFailure:false,error:null});

    res.json({
      status: true,
      message: "succcess",
      username: req.body.username,
      // type:"user"
    });
  } catch (err) {
    console.log("error", err);
    // res.status(400).render("register",{registerFailure:true,error:err});
    res.status(400).json({
      status: false,
      message: "Unable to Register, Please try again!",
    });
  }
});

// router.get("/login",authorized,async (req,res)=>{
//   console.log("req.session:");
//   console.log(req.session);
//   res.render("login",{registeredNow:false,username:null,loginFailure:false,error:null});
// });

router.post("/login", async (req, res) => {
  // const { error } = loginValidation(req.body);
  let session = req.session;

  // if (error) return res.status(400).render("login",{registeredNow:false,username:null,loginFailure:true,error:error.details[0].message});
  // res.status(400).send(error.details[0].message);

  const user = await User.findOne({ email: req.body.email });
  if (user === null)
    // return res.status(400).render("login",{registeredNow:false,username:null,loginFailure:true,error:"Email not registered!"});
    return res.status(401).send({
      authenticate: false,
      message: "Email not registered",
    });

  // res.status(400).send("Email not registered!");
  // else console.log("user found",user);

  const comp = await bcrypt.compare(req.body.password, user.password);
  if (!comp)
    // return res.status(404).render("login",{registeredNow:false,username:null,loginFailure:true,error:"Password doesn't match"});
    return res.status(401).send({
      authenticate: false,
      message: "Passwords don't match",
    });

  session["user"] = user;
  // res.redirect("/home");
  return res.status(200).send({ authenticate: true, username: user.username });
});

router.get("/logout", authorize, async (req, res) => {
  console.log("reached logout");
  // clearInterval(refreshInterval);
  // console.log("req session before:");
  // console.log(req.session);
  if (
    typeof req.session.nextDriveWriteIndex !== "undefined" ||
    req.session.nextDriveWriteIndex !== "null"
  ) {
    await User.updateOne(
      { email: req.session.user.email },
      { $set: { lastDriveWriteIndx: req.session.nextDriveWriteIndex } }
    );
  }
  req.session.destroy(function (err) {
    if (err) {
      console.log(err);
    } else {
      res.redirect(CLIENT_LOGIN_PAGE_URL);
      try {
        clearTmp();
      } catch (error) {
        console.log("Error while logging out removing tmp files: ", error);
      }
    }
  });
});

module.exports = router;
