import { User } from "../models/user.model.js";
import bycrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";
import req from "express/lib/request.js";
import { deletMediaFromCloudinary, uploadMedia } from "../utils/cloudinary.js";
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All feilds  are required.",
      });
    }

    const user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({
        success: false,
        message: "User already exists with email",
      });
    }

    const hashedPassword = await bycrypt.hash(password, 10);

    await User.create({
      name,
      email,
      password: hashedPassword,
    });

    return res.status(201).json({
      success: true,
      message: "Account created successfully.",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "failed to register",
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All feilds are required",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Incorrect Email or Password",
      });
    }

    const isPasswordMatch = await bycrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({
        success: false,
        message: "Incorrect Email or Password",
      });
    }
    generateToken(res, user, `Welcome Back ${user.name}`);
    // return res.status(200).json({ // Added response
    //     success: true,
    //     message: `Welcome Back ${user.name}`,
    // });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "failed to Login",
    });
  }
};

export const logout=async(req,res)=>{
    try{
        return res.status(200).cookie("token","",{maxAge:0}).json({
            message:"LogOut Succesfully",
            success:true
        })

    }catch (error) {
        console.log(error);
    
        return res.status(500).json({
          success: false,
          message: "failed to logout",
        });
      }
}





export const getUserProfile=async(req,res)=>{
    try{

        const userId=req.id;

        const user=await User.findById(userId).select("-password");
        if(!user){
            return res.status(404).json({
                message:"profile not found",
                success:false
            })
        }

        return res.status(200).json({
            success:true,
            user
        })


    }
    catch (error) {
        console.log(error);
    
        return res.status(500).json({
          success: false,
          message: "failed to load User",
        });
      }


}


// export const updateProfile=async(req,res)=>{


//   try{

//     const userId=req.id;
//     const {name}=req.body;
//     const profilePhoto=req.file.path;

//     const user=await User.findById(userId);

//     if(!user){
//       return res.status(404).json({
//         message:"User NOt Found",
//         success:false
//       })

//     }

//     // extract the public id of old image from the url is it exists
//     if(user.photoUrl){
//       const publicId=user.photoUrl.split("/").pop().split(".")[0];
//       deletMediaFromCloudinary(publicId);
//     }
//     // upload new photo

//     const cloudResponse=await uploadMedia(profilePhoto.path);
//     const photoUrl=cloudResponse.secure_url;

//     const updatedData={name,photoUrl}

//     const updatesUser=await User.findByIdAndUpdate(userId,updatedData,{
//       new:true
//     }).select("-password");

//     return res.status(200).json({
//       success:true,
//       user:updatesUser,
//       message:"profile updated succesfully "
//     })

//   }
//   catch (error) {
//     console.log(error);

//     return res.status(500).json({
//       success: false,
//       message: "failed to update profile",
//     });
//   }

// }



export const updateProfile = async (req, res) => {
  try {
      const userId = req.id;
      const { name } = req.body;

      // Check if the file was uploaded
      if (!req.file) {
          return res.status(400).json({
              success: false,
              message: 'No file uploaded',
          });
      }

      const profilePhotoPath = req.file.path; // Now it's safe to access path

      const user = await User.findById(userId);
      if (!user) {
          return res.status(404).json({
              message: "User  Not Found",
              success: false
          });
      }

      // Extract the public id of the old image from the URL if it exists
      if (user.photoUrl) {
          const publicId = user.photoUrl.split("/").pop().split(".")[0];
          await deletMediaFromCloudinary(publicId);
      }

      // Upload new photo
      const cloudResponse = await uploadMedia(profilePhotoPath);
      const photoUrl = cloudResponse.secure_url;

      const updatedData = { name, photoUrl };

      const updatedUser  = await User.findByIdAndUpdate(userId, updatedData, {
          new: true
      }).select("-password");

      return res.status(200).json({
          success: true,
          user: updatedUser ,
          message: "Profile updated successfully"
      });
  } catch (error) {
      console.log(error);
      return res.status(500).json({
          success: false,
          message: "Failed to update profile",
      });
  }
};


