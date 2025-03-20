import express from "express";
import {getUserProfile, login, logout, register, updateProfile } from "../controllers/user.controller.js";
import isAuthanticated from "../middlewares/isAuthenticated.js";
import upload from "../utils/multer.js";

const router=express.Router();


router.route("/register").post(register)

router.route("/login").post(login);
router.route("/logout").get(logout)
router.route("/profile").get(isAuthanticated, getUserProfile);
router.route("/profile/update").put(isAuthanticated,upload.single("profilePhoto"),  updateProfile);




export default router;

