const UserModel=require('./user.model');
const generateToken=require('../middleware/authMiddleware')
const cloudinary=require('../utilitis/cloudinary')


const Userregister=async(req,res)=>{
    try{
      const {username,email,password}=req.body;
      const user=new UserModel({username,email,password})
        await user.save();
      res.status(200).json({message:"registration successfully created"});
    }catch(err){
        console.log(err);
         res.status(500).json({message:"registration failed"});
    }
}


const Userlogin=async(req,res)=>{
    try{
     const {email,password}=req.body;
     const user=await UserModel.findOne({email})
        if(!user){
           return res.status(404).json({message:"user not found"});
        }
        const isMatch=await user.comparePassword(password);
        if(!isMatch){
            return res.status(401).json({message:"Invalid password"});
        }
        const token=await generateToken(user._id)
        res.cookie('token',token,{
            httpOnly: true,
            secure: true,
            sameSite: 'none'
        })
        res.status(200).send({
            message:"login successfull",
            token,
            user:{
                _id:user._id,
                username:user.username,
                email:user.email,
                role:user.role,
                profileImage:user.profileImage,
                profession:user.profession,
                bio:user.bio
            }
        })
    }catch (e){
        console.log(e);
        res.status(500).json({message:"login failed"});
    }
}


const Userlogout=async(req,res)=>{
    try{
        res.clearCookie('token')
        res.status(200).json({message:"Logout successfully "});
    }catch(err){
        console.log(e);
        res.status(500).json({message:"Logout failed"});
    }
}


const getSingleUser=async(req,res)=>{
    const {id} = req.params;
    try {
        const user=await UserModel.findById(id)
        if(!user){
            return res.status(404).json({message:"user not found"});
        }
        res.status(200).json({message:"user finded successfull",data:user});
    }catch(err){
        res.status(500).json({message:"user not found"});
    }
}



const getAlluser=async(req,res)=>{
    try{
    const users=await UserModel.find({},'email role').sort({createdAt:-1})
        res.status(200).json({message:"All users found",data:users});
    }catch (e){
        console.log(e);
        res.status(500).json({message:"All users not found"});
    }
}


const deleteUser=async (req,res)=>{
    const {id}=req.params;
    try {
        const user=await UserModel.findByIdAndDelete(id);
        if(!user){
            return res.status(404).json({message:"user not found"});
        }
        res.status(200).json({message:"user deleted successfully"});
    }catch(err){
        console.log(err);
        res.status(500).json({message:"User deleted failed"});
    }
}


const updateUserrole=async(req,res)=>{
    const {id}=req.params;
    const {role}=req.body;
    try{
        const updateuser=await UserModel.findByIdAndUpdate(id,{role:role},{new:true})
        if(!updateuser){
            return res.status(404).json({message:"user not found"});
        }
        res.status(200).json({message:"user updated successfully"});
    }catch(err){
       console.log(err);
       res.status(500).json({message:"User updated failed"});
    }
}


const updateProfile=async (req,res)=>{
    const {id}=req.params;
    const {username,bio,profession}=req.body;
    try{
        let imageURL=""
        if(req.file){
            const result=await cloudinary.uploader.upload(req.file.path,{
                folder:"UserImage"
            })
            imageURL=result.secure_url;
        }
        const profileupdate=await UserModel.findByIdAndUpdate(id,{
            username:username,
            profileImage:imageURL,
            bio:bio,
            profession:profession,
        },{new:true})
        if(!profileupdate){
            return res.status(404).json({message:"user not found"});
        }
        res.status(200).json({message:"user updated successfully"});
    }catch(err){
        console.log(err);
        res.status(500).json({message:"User updated failed"});
    }
}

module.exports={Userregister,Userlogin,Userlogout,getAlluser,deleteUser,updateUserrole,updateProfile,getSingleUser};