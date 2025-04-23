import Stripe from "stripe";
import { Course } from "../models/course.module.js";
import { CoursePurchase } from "../models/coursePurchase.model.js";
import { Lecture } from "../models/lecture.model.js";
import { User } from "../models/user.model.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Create a checkout session for purchasing a course
export const createCheckoutSession = async (req, res) => {
  try {
    const userId = req.id; // Get the user ID from the request
    const { courseId } = req.body; // Get the course ID from the request body

    // Find the course by ID
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found!" });

    // Create a new course purchase record
    const newPurchase = new CoursePurchase({
      courseId,
      userId,
      amount: course.coursePrice,
      status: "pending",
    });

    // Create a Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: course.courseTitle,
              images: [course.courseThumbnail],
            },
            unit_amount: course.coursePrice * 100, // Amount in paise (lowest denomination)
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `http://localhost:5173/course-progress/${courseId}`, // Redirect after successful payment
      cancel_url: `http://localhost:5173/course-detail/${courseId}`, // Redirect if payment is canceled
      metadata: {
        courseId: courseId,
        userId: userId,
      },
      shipping_address_collection: {
        allowed_countries: ["IN"], // Optionally restrict allowed countries
      },
    });

    if (!session.url) {
      return res.status(400).json({ success: false, message: "Error while creating session" });
    }

    // Save the purchase record
    newPurchase.paymentId = session.id;
    await newPurchase.save();

    return res.status(200).json({
      success: true,
      url: session.url, // Return the Stripe checkout URL
    });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return res.status(500).json({ message: "Failed to create checkout session" });
  }
};

// Handle Stripe webhook events
// export const stripeWebhook = async (req, res) => {
//   let event;

//   try {
//     const payloadString = JSON.stringify(req.body, null, 2);
//     const secret = process.env.WEBHOOK_ENDPOINT_SECRET;

//     const header = stripe.webhooks.generateTestHeaderString({
//       payload: payloadString,
//       secret,
//     });

//     event = stripe.webhooks.constructEvent(payloadString, header, secret);
//   } catch (error) {
//     console.error("Webhook error:", error.message);
//     return res.status(400).send(`Webhook error: ${error.message}`);
//   }

//   // Handle the checkout session completed event
//   if (event.type === "checkout.session.completed") {
//     console.log("Checkout session completed event received:", event);

//     try {
//       const session = event.data.object;

//       // Find the purchase record using the payment ID
//       const purchase = await CoursePurchase.findOne({
//         paymentId: session.id,
//       }).populate({ path: "courseId" });

//       if (!purchase) {
//         return res.status(404).json({ message: "Purchase not found" });
//       }

//       // Update purchase status
//       purchase.status = "completed";

//       // Make all lectures visible by setting `isPreviewFree` to true
//       if (purchase.courseId && purchase.courseId.lectures.length > 0) {
//         await Lecture.updateMany(
//           { _id: { $in: purchase.courseId.lectures } },
//           { $set: { isPreviewFree: true } }
//         );
//       }

//       await purchase.save();

//       // Update user's enrolledCourses
//       const userUpdateResult = await User.findByIdAndUpdate(
//         purchase.userId,
//         { $addToSet: { enrolledCourses: purchase.courseId._id } }, // Add course ID to enrolledCourses
//         { new: true }
//       );
//       console.log("User  update result:", userUpdateResult);

//       // Update course to add user ID to enrolledStudents
//       const courseUpdateResult = await Course.findByIdAndUpdate(
//         purchase.courseId._id,
//         { $addToSet: { enrolledStudents: purchase.userId } }, // Add user ID to enrolledStudents
//         { new: true }
//       );
//       console.log("Course update result:", courseUpdateResult);
//     } catch (error) {
//       console.error("Error handling event:", error);
//       return res.status(500).json({ message: "Internal Server Error" });
//     }
//   }
//   res.status(200).send();
// };




// export const stripeWebhook = async (req, res) => {
//   let event;

//   try {
//     const payloadString = JSON.stringify(req.body, null, 2);
//     const secret = process.env.WEBHOOK_ENDPOINT_SECRET;

//     const header = stripe.webhooks.generateTestHeaderString({
//       payload: payloadString,
//       secret,
//     });

//     event = stripe.webhooks.constructEvent(payloadString, header, secret);
//   } catch (error) {
//     console.error("Webhook error:", error.message);
//     return res.status(400).send(`Webhook error: ${error.message}`);
//   }

//   // Handle the checkout session completed event
//   if (event.type === "checkout.session.completed") {
//     console.log("Checkout session completed event received:", event);

//     try {
//       const session = event.data.object;

//       // Find the purchase record using the payment ID
//       const purchase = await CoursePurchase.findOne({
//         paymentId: session.id,
//       }).populate({ path: "courseId" });

//       if (!purchase) {
//         return res.status(404).json({ message: "Purchase not found" });
//       }

//       // Update purchase status
//       purchase.status = "completed";

//       // Make all lectures visible by setting `isPreviewFree` to true
//       if (purchase.courseId && purchase.courseId.lectures.length > 0) {
//         await Lecture.updateMany(
//           { _id: { $in: purchase.courseId.lectures } },
//           { $set: { isPreviewFree: true } }
//         );
//       }

//       await purchase.save();

//       // Update user's enrolledCourses
//       const userUpdateResult = await User.findByIdAndUpdate(
//         purchase.userId,
//         { $addToSet: { enrolledCourses: purchase.courseId._id } }, // Add course ID to enrolledCourses
//         { new: true }
//       );
//       console.log("User  update result:", userUpdateResult);

//       // Update course to add user ID to enrolledStudents
//       const courseUpdateResult = await Course.findByIdAndUpdate(
//         purchase.courseId._id,
//         { $addToSet: { enrolledStudents: purchase.userId } }, // Add user ID to enrolledStudents
//         { new: true }
//       );
//       console.log("Course update result:", courseUpdateResult);
//     } catch (error) {
//       console.error("Error handling event:", error);
//       return res.status(500).json({ message: "Internal Server Error" });
//     }
//   }
//   res.status(200).send();
// };



// Stripe webhook handler
export const stripeWebhook = async (req, res) => {
  let event;

  const sig = req.headers["stripe-signature"];
  const webhookSecret = process.env.WEBHOOK_ENDPOINT_SECRET;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.error("❌ Stripe webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Only handle completed checkout sessions
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    console.log("✅ Checkout session completed event received");

    try {
      const purchase = await CoursePurchase.findOne({ paymentId: session.id }).populate("courseId");

      if (!purchase) {
        console.warn("⚠️ No purchase record found for session:", session.id);
        return res.status(404).json({ message: "Purchase not found" });
      }

      purchase.status = "completed";
      await purchase.save();

      if (purchase.courseId?.lectures?.length > 0) {
        await Lecture.updateMany(
          { _id: { $in: purchase.courseId.lectures } },
          { $set: { isPreviewFree: true } }
        );
      }

      // Add course to user's enrolled list
      await User.findByIdAndUpdate(
        purchase.userId,
        { $addToSet: { enrolledCourses: purchase.courseId._id } },
        { new: true }
      );

      // Add user to course's enrolled students
      await Course.findByIdAndUpdate(
        purchase.courseId._id,
        { $addToSet: { enrolledStudents: purchase.userId } },
        { new: true }
      );
    } catch (err) {
      console.error("❌ Error processing completed session:", err);
      return res.status(500).send("Internal Server Error");
    }
  }

  res.status(200).send("Webhook received");
};


// Get course details along with purchase status
export const getCourseDetailWithPurchaseStatus = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.id;

    const course = await Course.findById(courseId)
      .populate({ path: "creator" })
      .populate({ path: "lectures" });

    const purchased = await CoursePurchase.findOne({ userId, courseId });
    console.log(purchased);

    if (!course) {
      return res.status(404).json({ message: "Course not found!" });
    }

    return res.status(200).json({
      course,
      purchased: !!purchased, // true if purchased, false otherwise
    });
  } catch (error) {
    console.log("Error fetching course details:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get all purchased courses for a user
// export const getAllPurchasedCourse = async (req, res) => {
//   try {
//     const userId = req.id; // Assuming user ID is available in the request
//     const purchasedCourse = await CoursePurchase.find({
//       userId,
//       status: "completed", // Change to "pending" if needed
//     }).populate("courseId");

//     if (!purchasedCourse.length) {
//       return res.status(404).json({
//         purchasedCourse: [],
//       });
//     }
//     return res.status(200).json({
//       purchasedCourse,
//     });
//   } catch (error) {
//     console.log("Error fetching purchased courses:", error);
//     return res.status(500).json({ message: "Internal Server Error" });
//   }
// };


// Get all purchased courses for a user (with full course + creator populated)
export const getAllPurchasedCourse = async (req, res) => {
  try {
    const userId = req.id; // Assuming user ID is available in the request

    const purchasedCourse = await CoursePurchase.find({
      userId,
      status: "completed",
    }).populate({
      path: "courseId",
      populate: {
        path: "creator",
        select: "name photoUrl", // Select only what you need
      },
    });

    if (!purchasedCourse.length) {
      return res.status(404).json({
        purchasedCourse: [],
      });
    }

    // Option 1: Return the full CoursePurchase data with populated courseId + creator
    // return res.status(200).json({ purchasedCourse });

    // Option 2 (Recommended): Reshape response to just return array of courses
    const courses = purchasedCourse
      .filter((purchase) => purchase.courseId) // Ensure course still exists
      .map((purchase) => purchase.courseId);

    return res.status(200).json({ purchasedCourse: courses });
  } catch (error) {
    console.log("Error fetching purchased courses:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};




// Get all purchased courses for all users
export const getAllPurchasedCourses = async (req, res) => {
  try {
    const purchasedCourses = await CoursePurchase.find()
      .populate("courseId")
      .populate("userId"); // Assuming you want to populate user details as well

    if (!purchasedCourses.length) {
      return res.status(404).json({ message: "No purchased courses found." });
    }

    return res.status(200).json({ purchasedCourses });
  } catch (error) {
    console.log("Error fetching all purchased courses:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};