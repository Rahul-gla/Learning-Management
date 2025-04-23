import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import {
  createCheckoutSession,
  getAllPurchasedCourse,
  getAllPurchasedCourses,
  getCourseDetailWithPurchaseStatus,
  stripeWebhook,
} from "../controllers/coursePurchase.controller.js";

const router = express.Router();

// Checkout session (Stripe payment)
router.post("/checkout/create-checkout-session", isAuthenticated, createCheckoutSession);

// Stripe webhook (RAW body handled in index.js/server.js)
router.post("/webhook", stripeWebhook);

// Get specific course detail with purchase status
router.get("/course/:courseId/detail-with-status", isAuthenticated, getCourseDetailWithPurchaseStatus);

// Get all purchased courses for logged-in user
router.get("/", isAuthenticated, getAllPurchasedCourse);
// Get all purchased courses for all users
router.get("/all", isAuthenticated, getAllPurchasedCourses);

export default router;
