import RichTextEditor from "@/components/RichTextEditor";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useDeleteCourseMutation,
  useEditCourseMutation,
  useGetCourseByIdQuery,
  usePublishCourseMutation,
} from "@/features/api/courseApi";
import { Loader2 } from "lucide-react";
import { Query } from "mongoose";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

const CourseTab = () => {
  const [input, setInput] = useState({
    courseTitle: "",
    subTitle: "",
    description: "",
    category: "",
    courseLevel: "",
    coursePrice: "",
    courseThumbnail: "",
  });

  const params = useParams();
  // courseId

  const courseId = params.courseId;

  const { data: courseByIdData,isLoading: CourseByIdIsLoading,refetch } = useGetCourseByIdQuery(courseId,{refetchOnMountOrArgChange:true});

  const [publishCourse]=usePublishCourseMutation();
  const[deleteCourse]=useDeleteCourseMutation();


  useEffect(() => {
    if (courseByIdData?.course) {
      const course =courseByIdData?.course 

      setInput({
        courseTitle: course.courseTitle,
        subTitle: course.subTitle,
        description: course.description,
        category: course.category,
        courseLevel: course.courseLevel,
        coursePrice: course.coursePrice,
        courseThumbnail: "",
      });
    }
  }, [courseByIdData]);

  const [previewThumbnail, setPreviewThumbnail] = useState("");

  const navigate = useNavigate();

  const [editCourse, { data, isLoading, isSuccess, error }] =
    useEditCourseMutation();

  const changeEventHandler = (e) => {
    const { name, value } = e.target;
    setInput({ ...input, [name]: value });
  };

  const removeCourseHandler = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this course?");
    if (confirmDelete) {
      try {
        const response = await deleteCourse(courseId).unwrap(); // Call the delete mutation
        toast.success(response.message || "Course removed successfully.");
        refetch()

        navigate("/admin/course"); 
        // Navigate back to the course list or another page

      } catch (error) {
        toast.error(error?.data?.message || "Failed to remove course.");
      }
    }
  };

  const selectCategory = (value) => {
    setInput({ ...input, category: value });
  };

  const selectCourseLevel = (value) => {
    setInput({ ...input, courseLevel: value });
  };

  //   get file

  const selectThumbnail = (e) => {
    const file = e.target.files?.[0];

    if (file) {
      setInput({ ...input, courseThumbnail: file });
      const fileReader = new FileReader();

      fileReader.onloadend = () => setPreviewThumbnail(fileReader.result);
      fileReader.readAsDataURL(file);
    }
  };

  const updateCourseHandler = async () => {
    console.log(input);
    const formData = new FormData();
    formData.append("courseTitle", input.courseTitle);
    formData.append("subTitle", input.subTitle);
    formData.append("description", input.description);
    formData.append("category", input.category);
    formData.append("courseLevel", input.courseLevel);
    formData.append("coursePrice", input.coursePrice);
    formData.append("courseThumbnail", input.courseThumbnail);

    await editCourse({ formData, courseId });
  };


  const publishStatusHandler=async(action)=>{
    try{

  const response =await publishCourse({courseId,query:action})

  if(response.data){
    refetch()
    toast.success(response.data.message)
  }

    }
    catch(error){
      // console.log(error);
      toast.error("failed to publish or unpublish course")

    }

  }

  useEffect(() => {
    if (isSuccess) {
      toast.success(data?.message || "Course Updated.");
    }
    if (error) {
      toast.error(error?.data?.message || "Failed to update course");
    }
  }, [isSuccess, error]);

  if(CourseByIdIsLoading) return<Loader2 className="h-4 w-4 animate-spin"/>


  // const isLoading=false;
  return (
    <Card>
      <CardHeader className="flex flex-row justify-between">
        <div>
          <CardTitle>Basic Course Information</CardTitle>
          <CardDescription>
            Make changes to Your courses here. Click save when you are done.
          </CardDescription>
        </div>
        <div className="space-x-2">
          <Button disabled={courseByIdData?.course.lectures.length==0} variant="outline" onClick={()=>publishStatusHandler(courseByIdData?.course.isPublish?"false":"true")}>
            {courseByIdData?.course.isPublish ? "Unpublished" : "Published"}
          </Button>

          <Button onClick={removeCourseHandler}>Remove Course</Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 mt-5">
          <div>
            <Label>Title</Label>
            <Input
              type="text"
              name="courseTitle"
              value={input.courseTitle}
              onChange={changeEventHandler}
              placeholder="Ex. Fullstack Developer"
            />
          </div>

          <div>
            <Label>Sub Title</Label>
            <Input
              type="text"
              name="subTitle"
              value={input.subTitle}
              onChange={changeEventHandler}
              placeholder="Ex. Become a Fullstack developer"
            />
          </div>

          <div>
            <Label>Description</Label>
            <RichTextEditor input={input} setInput={setInput} />
          </div>

          <div className="flex items-center gap-5">
            <div>
              <Label>Category</Label>

              <Select onValueChange={selectCategory}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select a Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Category</SelectLabel>
                    <SelectItem value="Next-Js">Next Js</SelectItem>
                    <SelectItem value="Data Structure">Data Structure</SelectItem>

                    <SelectItem value="Data-Science">Data Science</SelectItem>
                    <SelectItem value="Frontend-Development">
                      Frontend Development
                    </SelectItem>
                    <SelectItem value="FullStack-Development">
                      FullStack Development
                    </SelectItem>
                    <SelectItem value="Mern-Development">
                      Mern Development
                    </SelectItem>
                    <SelectItem value="Backend Development">
                      Backend Development
                    </SelectItem>
                    <SelectItem value="JavaScript">JavaScript</SelectItem>
                    <SelectItem value="Python">Python</SelectItem>
                    <SelectItem value="Docker">Docker</SelectItem>
                    <SelectItem value="MongoDb">MongoDb</SelectItem>
                    <SelectItem value="Html">Html</SelectItem>
                    <SelectItem value="css">Css</SelectItem>
                    <SelectItem value="azure">Azure</SelectItem>

                    <SelectItem value="aws">AWS</SelectItem>



                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label>Course Label</label>
              <Select onValueChange={selectCourseLevel}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select Course Lebele" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Course Lebel</SelectLabel>
                    <SelectItem value="Beginer">Beginer</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Advance">Advance</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Price in (INR)</Label>
              <Input
                type="number"
                name="coursePrice"
                value={input.coursePrice}
                onChange={changeEventHandler}
                placeholder="199"
                className="w-fit"
              />
            </div>
          </div>

          <div>
            <Label>Course Thumbnail</Label>
            <Input
              type="file"
              onChange={selectThumbnail}
              accept="image/*"
              className="w-fit"
            />

            {previewThumbnail && (
              <img
                src={previewThumbnail}
                className="w-64 my-2"
                alt="Course Thumbnail"
              />
            )}
          </div>

          <div>
            <Button onClick={() => navigate("/admin/course")} variant="outline">
              Cancel
            </Button>

            <Button disabled={isLoading} onClick={updateCourseHandler}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please Wiat
                </>
              ) : (
                "save"
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CourseTab;
