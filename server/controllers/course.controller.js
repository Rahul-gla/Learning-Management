import { Course } from "../models/course.module.js";
import { Lecture } from '../models/lecture.model.js'; // Adjust the path as necessary
// import  Lecture  from '../models/lecture.model.js'; // Adjust the path as necessary
// import mongoose from "mongoose";
import { deleteVideoFromCloudinary, deletMediaFromCloudinary, uploadMedia } from "../utils/cloudinary.js";
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



export const searchCourse = async (req,res) => {
  try {
      const {query = "", categories = [], sortByPrice =""} = req.query;
      console.log(categories);
      
      // create search query
      const searchCriteria = {
          isPublished:true,
          $or:[
              {courseTitle: {$regex:query, $options:"i"}},
              {subTitle: {$regex:query, $options:"i"}},
              {category: {$regex:query, $options:"i"}},
          ]
      }

      // if categories selected
      if(categories.length > 0) {
          searchCriteria.category = {$in: categories};
      }

      // define sorting order
      const sortOptions = {};
      if(sortByPrice === "low"){
          sortOptions.coursePrice = 1;//sort by price in ascending
      }else if(sortByPrice === "high"){
          sortOptions.coursePrice = -1; // descending
      }

      let courses = await Course.find(searchCriteria).populate({path:"creator", select:"name photoUrl"}).sort(sortOptions);

      return res.status(200).json({
          success:true,
          courses: courses || []
      });

  } catch (error) {
      console.log(error);
      
  }
}


export const getPublishedCourse = async (_,res) => {
  try {
      const courses = await Course.find({isPublish:true}).populate({path:"creator", select:"name photoUrl"});
      if(!courses){
          return res.status(404).json({
              message:"Course not found"
          })
      }
      return res.status(200).json({
          courses,
      })
  } catch (error) {
      console.log(error);
      return res.status(500).json({
          message:"Failed to get published courses"
      })
  }
}
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



// export const editLecture=async(req,res)=>{
//   try{

//     const{lectureTitle, videoInfo,  isPreviewFree}=req.body;

//     const {courseId,lectureId}=req.params;

//     const lecture=await Lecture.findById(lectureId)


//     if(!lecture){
//       return res.status(404).json({
//         message:"Lecture Not Found"
//       })
//     }

//     //  update Lecture

//     if(lectureTitle) lecture.lectureTitle=lectureTitle
//     if(videoInfo.videoUrl) lecture.videoUrl=videoInfo.videoUrl;
//     if(videoInfo.publicId) lecture.publicId=videoInfo.publicId;
//     if(isPreviewFree) lecture.isPreviewFree=isPreviewFree;

//     await lecture.save();

//     // ensure the course still has the lectureid if it was not already added
//     const course=await Course.findById(courseId);
//     if(course&&course.lectures.includes(lecture._id)){
//       course.lectures.push(lecture._id);
//       await course.save();
//     }

//     return res.status(200).json({
//       lecture,
//       message:"Lecture Updated Succesfully"
//     })

//   }


//   catch (error) {
//     console.log(error);
//     return res.status(500).json({
//       message: "Failed to update Lecture",
//     });
//   }
// }


export const editLecture = async (req,res) => {
  try {
      const {lectureTitle, videoInfo, isPreviewFree} = req.body;
      
      const {courseId, lectureId} = req.params;
      const lecture = await Lecture.findById(lectureId);
      if(!lecture){
          return res.status(404).json({
              message:"Lecture not found!"
          })
      }

      // update lecture
      if(lectureTitle) lecture.lectureTitle = lectureTitle;
      if(videoInfo?.videoUrl) lecture.videoUrl = videoInfo.videoUrl;
      if(videoInfo?.publicId) lecture.publicId = videoInfo.publicId;
      lecture.isPreviewFree = isPreviewFree;

      await lecture.save();

      // Ensure the course still has the lecture id if it was not aleardy added;
      const course = await Course.findById(courseId);
      if(course && !course.lectures.includes(lecture._id)){
          course.lectures.push(lecture._id);
          await course.save();
      };
      return res.status(200).json({
          lecture,
          message:"Lecture updated successfully."
      })
  } catch (error) {
      console.log(error);
      return res.status(500).json({
          message:"Failed to edit lectures"
      })
  }
}



export const removeLecture=async(req,res)=>{
  try{

    const{lectureId}=req.params;
    const lecture=await Lecture.findByIdAndDelete(lectureId);

    if(!lecture){
      return res.status(404).json({
        message:"Lecture Not Found"
    })
    }

    //  delete the lecture from Cloudinary

    if(lecture.publicId){
      await deleteVideoFromCloudinary(lecture.publicId);
    }

    //  remove the lecture referenace from the assocaited course
    await Course.updateOne({
      lectures:lectureId
    },{$pull:{lectures:lectureId}}
  )

  return res.status(200).json({
    message:"Lecture Removed Succesfully"
  })

  }


  catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Failed to Remove Lecture",
    });
  }
}




export const getLectureById=async(req,res)=>{
  try{

    const{lectureId}=req.params;
    const lecture=await Lecture.findById(lectureId);

    if(!lecture){
      return res.status(404).json({
        message:"Lecture Not Found"
    })
    }


    return res.status(200).json({
      lecture,
  
    })
  }

  catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Failed to Get Lecture By Id",
    });
  }
}



// publish unpublish course logic

export const togglePublishCourse = async (req,res) => {
  try {
      const {courseId} = req.params;
      const {publish} = req.query; // true, false
      const course = await Course.findById(courseId);
      if(!course){
          return res.status(404).json({
              message:"Course not found!"
          });
      }

      course.isPublish
      // publish status based on the query paramter
      course.isPublish = publish === "true";
      await course.save();

      const statusMessage = course.isPublish ? "Published" : "Unpublished";
      return res.status(200).json({
          message:`Course is ${statusMessage}`
      });
  } catch (error) {
      console.log(error);
      return res.status(500).json({
          message:"Failed to update status"
      })
  }
}



