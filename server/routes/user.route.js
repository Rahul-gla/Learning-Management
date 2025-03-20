import express from "express";
import {getUserProfile, login, logout, register } from "../controllers/user.controller.js";
import isAuthanticated from "../middlewares/isAuthenticated.js";

const router=express.Router();


router.route("/register").post(register)

router.route("/login").post(login);
router.route("/logout").get(logout)
router.route("/profile").get(isAuthanticated, getUserProfile);




export default router;

