const express=require('express');
const {Userregister, Userlogin, Userlogout, getAlluser, deleteUser, updateUserrole, updateProfile, getSingleUser} = require("./user.controller");
const verifyToken=require("../middleware/verifyToken")
const verifyAdmin=require("../middleware/verifyAdmin")
const upload = require("../utilitis/multer");
const router=express.Router();


router.post('/register',Userregister)
router.post('/login',Userlogin)
router.post('/logout',Userlogout)

router.get('/get-singleuser/:id',verifyToken,getSingleUser)
router.get('/alluser',verifyToken,verifyAdmin,getAlluser)
router.delete('/deleteuser/:id',verifyToken,verifyAdmin,deleteUser)
router.post('/updateuser/:id',verifyToken,verifyAdmin,updateUserrole)
router.post('/updateprofile/:id',upload.single("profileImage"),verifyToken,updateProfile)

module.exports=router;