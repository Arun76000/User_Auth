const userModel = require("../model/userModel");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const transporter = require("../config/emailconfig");

// User Registration

exports.userRegistration = async (req, res) => {
  try {
    const { name, email, password, password_confirm, tc } = req.body;

    const user = await userModel.findOne({ email: email });

    if (user) {
      res
        .status(400)
        .send({ status: "Failed", Message: "User Already Exists" });
    } else {
      if (name && email && password && password_confirm && tc) {
        if (password === password_confirm) {
          try {
            const salt = await bcrypt.genSalt(10);
            const hashpassword = await bcrypt.hash(password, salt);
            const newUser = new userModel({
              name: name,
              email: email,
              password: hashpassword,
              tc: tc,
            });
            await newUser.save();
            const saved_user = await userModel.findOne({ email: email });

            const token = jwt.sign(
              { userID: saved_user._id },
              process.env.JWT_SECRET_KEY,
              { expiresIn: "10m" }
            );

            res.status(201).send({
              status: "SuccessFull",
              Message: "Registration Successful",
              token: token,
            });
          } catch (error) {
            res.status(500).send(error.message);
          }
        } else {
          res.status(400).send({
            status: "Failed",
            Message: "Both Password Doest match Try Again",
          });
        }
      } else {
        res
          .status(400)
          .send({ status: "Failed", Message: "All Fields are Required" });
      }
    }
  } catch (error) {
    res
      .status(500)
      .send(
        { status: "Failed", Message: "Registration Failed Try Again" },
        error.message
      );
  }
};

// User Login

exports.userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (email && password) {
      const user = await userModel.findOne({ email: email });
      if (user != null) {
        const isMatch = await bcrypt.compare(password, user.password);
        if (user.email === email && isMatch) {
          // GENERATE TOKEN
          const token = jwt.sign(
            { userID: user._id },
            process.env.JWT_SECRET_KEY,
            { expiresIn: "10m" }
          );
          // console.log(user._id);
          // console.log(token)
          res.status(200).send({
            status: "Success",
            Message: "Loged in SuccessFully",
            token: token,
          });
        } else {
          res.status(400).send({
            status: "Failed",
            Message: "User Email oor Password Does not Match",
          });
        }
      } else {
        res.status(400).send({
          status: "Failed",
          Message:
            "You Are Not A registered User... Registere your self for Login",
        });
      }
    } else {
      res
        .status(400)
        .send({ status: "Failed", Message: "All Fields Are Required" });
    }
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

// User Change Password
// user can change password only if had already loged in
exports.changePassword = async (req, res) => {
  const { password, password_confirm } = req.body;
  if (password && password_confirm) {
    if (password === password_confirm) {
      const salt = await bcrypt.genSalt(10);
      const hashpassword = await bcrypt.hash(password, salt);

      await userModel.findByIdAndUpdate(req.user._id, {
        $set: { password: hashpassword },
      });

      res.status(200).send({
        status: "SuccessFull",
        Message: "Password Changed SuccessFully",
      });
    } else {
      res.status(400).send({
        status: "failed",
        Message: "PassWord & Confirm_Password Doest not Matched!!!",
      });
    }
  } else {
    res
      .status(400)
      .send({ status: "failed", Message: "All fields Are Required" });
  }
  try {
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

// Get LogedIn User data
exports.Loggeduser = async (req, res) => {
  res.status(200).send({ User: req.user });
};

exports.sendEmailResetPassword = async (req, res) => {
  const { email } = req.body;
  if (email) {
    const user = await userModel.findOne({ email: email });
    if (user) {
      const secret_key = user._id + process.env.JWT_SECRET_KEY;
      const token = jwt.sign({ userID: user._id }, secret_key, {
        expiresIn: "5m",
      });

      const link = `http://127.0.0.1:5000/user/reset/${user._id}/${token}`;

      console.log(link);



      // SEND EMAIL TO USER for Password reset
      
      try {
        transporter.sendMail({
          from:'flame100622@gmail.com',
          to:user.email, 
          subject:'Your Account has Been HACKED 💀💀',
          text:'hey you!! Karan kathait Your Email account has been hacked  If you want Your Account Access Back sent me the Ransome ',
          html:`<a href=link>Click Here</a> To Reset Your Password`
      },(error,info)=>{
            if(error){
                console.log(error)
            }else{
                console.log("email has been Sent ",info.response);
            }
        })
          res.status(200).send({
            status: "Success",
            Message:
              "Email is Sent On your Registered Email ID to Reset your Password!!!"
          });
      } catch (error) {
        res.status(500).send({status:"failed",Message:"There Is some Problem in server Cannot SEnd Email Now"})
      }



    } else {
      res
        .status(400)
        .send({ status: "failed", Message: "Email Does Not Exists" });
    }
  } else {
    res
      .status(400)
      .send({ status: "failed", Message: "Email Field Is required " });
  }
};

exports.userPassReset = async (req, res) => {
  const { password, password_confirm } = req.body;
  const { id, token } = req.params;
  try {
    const user = await userModel.findById(id);
    const new_secret_key = user._id + process.env.JWT_SECRET_KEY;
    jwt.verify(token, new_secret_key);
    if (password && password_confirm) {
      if (password === password_confirm) {
        const salt = await bcrypt.genSalt(10);
        const newHashPassword = await bcrypt.hash(password, salt);

        await userModel.findByIdAndUpdate(user._id, {
          $set: { password: newHashPassword },
        });
        res
          .status(200)
          .send({
            status: " SuccessFull ",
            Message:
              " Password Reset SuccessFull \n Use New Passwordv To Login!!! ",
          });
      } else {
        res
          .status(400)
          .send({
            status: "Failed",
            Message: " Password and Password_confirm Doesn't Matched ",
          });
      }
    } else {
      res
        .status(400)
        .send({ status: "Failed", Message: " All Fields Are Required " });
    }
  } catch (error) {
    return res
      .status(500)
      .send({ status: "Failed", Message: " Reset Password Not working " });
  }
};
