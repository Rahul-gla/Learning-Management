import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";
// import req from "express/lib/request.js";
import { deletMediaFromCloudinary, uploadMedia } from "../utils/cloudinary.js";
export const register = async (req, res) => {
  try {
    // const { name, email, password } = req.body;


    const { name, email, password, role } = req.body;


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

    const hashedPassword = await bcrypt.hash(password, 10);

    // await User.create({
    //   name,
    //   email,
    //   password: hashedPassword,
    // });


    await User.create({
      name,
      email,
      password: hashedPassword,
      role: role && ["student", "instructor"].includes(role) ? role : "student",
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

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({
        success: false,
        message: "Incorrect Email or Password",
      });
    }
    return generateToken(res, user, `Welcome Back ${user.name}`);

   
 
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "failed to Login",
    });
  }
};

export const logout = async (_, res) => {
  try {
    return res.status(200).cookie("token", "", { maxAge: 0 }).json({
      message: "LogOut Succesfully",
      success: true,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "failed to logout",
    });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const userId = req.id;

    // const user = await User.findById(userId).select("-password").populate("enrolledCourses");



    const user = await User.findById(userId)
    .select("-password")
    .populate({
      path: "enrolledCourses",
      populate: {
        path: "creator",
        model: "User",
        select: "name photoUrl", // select only what you need
      },
    });
    if (!user) {
      return res.status(404).json({
        message: "profile not found",
        success: false,
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "failed to load User",
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.id;
    const { name } = req.body;
    const profilePhoto = req.file;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User NOt Found",
        success: false,
      });
    }

    // extract the public id of old image from the url is it exists
    if (user.photoUrl) {
      const publicId = user.photoUrl.split("/").pop().split(".")[0];
      deletMediaFromCloudinary(publicId);
    }
    // upload new photo

    const cloudResponse = await uploadMedia(profilePhoto.path);
    const photoUrl = cloudResponse.secure_url;

    const updatedData = { name, photoUrl };

    const updatedUser = await User.findByIdAndUpdate(userId, updatedData, {
      new: true
    }).select("-password");

    return res.status(200).json({
      success: true,
      user: updatedUser,
      message: "profile updated succesfully ",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "failed to update profile",
    });
  }
};
