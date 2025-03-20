import { User } from "../models/user.model.js";
import bycrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";
import req from "express/lib/request.js";
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