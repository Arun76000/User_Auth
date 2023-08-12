const router=require('express').Router()
const {userRegistration,userLogin,changePassword,Loggeduser,sendEmailResetPassword,userPassReset}=require('../controller/user.js')
const { verifyToken } = require('../middleware/user_authentication.js')

// public Routes
router.post('/register',userRegistration)                       //User Registration Page
router.post('/login',userLogin)                                 // User Login Page

router.post('/sendPasswordResetEmail',sendEmailResetPassword)   //Sending Email to User
router.post('/reset-password/:id/:token',userPassReset)         //User password reset page

// Protected Routes
router.post('/changepassword',[verifyToken],changePassword)     //User Changing Password While Logged In
router.get('/LoggedUser',[verifyToken],Loggeduser)              //User profile Gathering


module.exports=router;
