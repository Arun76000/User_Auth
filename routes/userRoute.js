const router=require('express').Router()
const {userRegistration,userLogin,changePassword,Loggeduser,sendEmailResetPassword,userPassReset}=require('../controller/user.js')
const { verifyToken } = require('../middleware/user_authentication.js')

// public Routes
router.post('/register',userRegistration)
router.post('/login',userLogin)
router.post('/sendPasswordResetEmail',sendEmailResetPassword)
router.post('/reset-password/:id/:token',userPassReset)

// Protected Routes
router.post('/changepassword',[verifyToken],changePassword)
router.get('/LoggedUser',[verifyToken],Loggeduser)


module.exports=router;
