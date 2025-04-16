import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCreateCourseMutation } from "@/features/api/courseApi";
import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const AddCourse = () => {
  const [courseTitle,setCourseTitle]=useState("");
  const [category,setCategory]=useState("");
const[createCourse,{data,error,isSuccess,isLoading}] =useCreateCourseMutation();


  const navigate=useNavigate();

  // const isLoading=false;
  const getSelectedCategory=(value)=>{
    // alert(value);
    setCategory(value);
  }

  const createCourseHandler= async()=>{
    // alert("working");
    // console.log(courseTitle,category)
    await createCourse({courseTitle,category})

  }

  useEffect(()=>{
    if(isSuccess){
      toast.success(data?.message||"Course created")
      navigate("/admin/course");
    }

  },[isSuccess,error])

 


  return (
    <div className="flex-1 mx-10">
      <div className="mb-4">
        <h1 className="font-bold text-xl">
          Lets Add course, and some basic course details for this course
        </h1>
        <p className="text-sm">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsa quasi
          earum aspernatur laudantium soluta blanditiis eligendi reiciendis
          consectetur, quae quos. Molestiae nisi ratione itaque?
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <Label>Title</Label>
          <Input
            type="text"
            name="courseTitle"
            value={courseTitle}
            onChange={(e)=>setCourseTitle(e.target.value)}
            placeholder="Your Course Name"
          />
        </div>

        <div>
          <Label>Category</Label>
          <Select onValueChange={getSelectedCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Category</SelectLabel>
                <SelectItem value="Next-Js">Next Js</SelectItem>
                <SelectItem value="aws">AWS</SelectItem>
                <SelectItem value="azure">AZURE</SelectItem>


                <SelectItem value="Data-Science">Data Science</SelectItem>
                <SelectItem value="Frontend-Development">Frontend Development</SelectItem>
                <SelectItem value="FullStack-Development">FullStack Development</SelectItem>
                <SelectItem value="Mern-Development">Mern Development</SelectItem>
                <SelectItem value="JavaScript">JavaScript</SelectItem>
                <SelectItem value="Python">Python</SelectItem>
                <SelectItem value="Docker">Docker</SelectItem>
                <SelectItem value="MongoDb">MongoDb</SelectItem>
                <SelectItem value="Html">Html</SelectItem>




              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={()=>navigate(`/admin/course`)}>Back</Button>
          <Button disabled={isLoading} onClick={createCourseHandler}>
            {
              isLoading?(
                <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                Please Wait
                </>

              ):"Create"
            }
            </Button>
        </div>
      </div>
    </div>
  );
};

export default AddCourse;
