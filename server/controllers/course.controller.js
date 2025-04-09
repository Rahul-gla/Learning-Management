import { Course } from "../models/course.module.js";
import { Lecture } from '../models/lecture.model.js'; // Adjust the path as necessary
// import  Lecture  from '../models/lecture.model.js'; // Adjust the path as necessary
// import mongoose from "mongoose";
import { deletMediaFromCloudinary, uploadMedia } from "../utils/cloudinary.js";
export const createCourse = async (req, res) => {
  try {
    const { courseTitle, category } = req.body;

    if (!courseTitle || !category) {
      return res.json(400).json({
        message: "course title and category is required",
      });
    }

    const course = await Course.create({
      courseTitle,
      category,
      creator: req.id,
    });

    return res.status(201).json({
      course,
      message: "course created",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Failed to create Course",
    });
  }
};

export const getCreatorCourses = async (req, res) => {
  try {
    const userId = req.id;
    const courses = await Course.find({
      creator: userId,
    });

    if (!courses) {
      return res.status(404).json({
        courses: [],
        message: "Course not found",
      });
    }

    return res.status(200).json({
      courses,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Failed to create Course",
    });
  }
};

export const editCourse = async (req, res) => {
  try {
    const courseId = req.params.courseId;

    const {
      courseTitle,
      subTitle,
      description,
      category,
      courseLevel,
      coursePrice,
    } = req.body;
    const thumbnail = req.file;

    let course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        message: "Course Not Found",
      });
    }
    let courseThumbnail;
    if (thumbnail) {
      if (course.courseThumbnail) {
        const publicId = course.courseThumbnail.split("/").pop().split(".")[0];
        await deletMediaFromCloudinary(publicId);
      }

      // upload thumbail in cloudinary

      courseThumbnail = await uploadMedia(thumbnail.path);
    }

    const updateData = {
      courseTitle,
      subTitle,
      description,
      category,
      courseLevel,
      coursePrice,
      courseThumbnail: courseThumbnail?.secure_url,
    };
    course = await Course.findByIdAndUpdate(courseId, updateData, {
      new: true,
    });

    return res.status(200).json({
      course,
      message: "Course Updated Successfully.",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Failed to edit course",
    });
  }
};

export const getCourseById = async (req, res) => {
  try {
    const { courseId } = req.params;
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        message: "Course Not Found",
      });
    }

    return res.status(200).json({
      course,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Failed to get courseById",
    });
  }
};

//    for a creating a lecture

export const createLecture = async (req, res) => {
  try {
    const { lectureTitle } = req.body;
    const { courseId } = req.params;

    if (!lectureTitle || !courseId) {
      return res.status(400).json({
        message: "Lecture Title is Required",
      });
    }

    //  create Lecture
    const lecture = await Lecture.create({ lectureTitle });

    const course = await Course.findById(courseId);

    if (course) {
      course.lectures.push(lecture._id);
      await course.save();
    }

    return res.status(200).json({
      lecture,
      message: "Lecture Created SuccessFully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Failed to Create Lecture",
    });
  }
};



export const getCourseLecture=async(req,res)=>{

  try{

    const {courseId}=req.params;
    const course =await Course.findById(courseId).populate("lectures");

    if(!course){
      return res.status(404).json({
        message:"Course Not Found"

    })
    }

    return res.status(200).json({
      lectures:course.lectures,
    })




  }
  catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Failed to get Lecture",
    });
  }
}



