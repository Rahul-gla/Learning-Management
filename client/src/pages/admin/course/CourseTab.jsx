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
import { Loader2 } from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const CourseTab = () => {
  const [input, setInput] = useState({
    courseTitle: "",
    subTitle: "",
    description: "",
    category: "",
    courseLevel: "",
    coursePrice: "",
    couseThumbnail: "",
  });


  const [previewThumbnail,setPreviewThumbnail]=useState("");

  const navigate=useNavigate();

  const changeEventHandler = (e) => {
    const { name, value } = e.target;
    setInput({ ...input, [name]: value });
  };


  const selectCategory=(value)=>{
    setInput({...input,category:value})
  }

  const selectCourseLevel=(value)=>{
    setInput({...input,courseLevel:value})
  }

//   get file

const selectThumbnail=(e)=>{
    const file=e.target.files?.[0];

    if(file){
        setInput({...input,couseThumbnail:file})
        const fileReader=new FileReader();

        fileReader.onloadend=()=>setPreviewThumbnail(fileReader.result)
        fileReader.readAsDataURL(file);
    }
}

const updateCourseHandler=()=>{
    console.log(input);

}





  const isPublished = false;

  const isLoading=false;
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
          <Button variant="outline">
            {isPublished ? "Unpublished" : "Published"}
          </Button>

          <Button>Remove Course</Button>
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

              <Select   onValueChange={selectCategory}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select a Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Category</SelectLabel>
                    <SelectItem value="Next-Js">Next Js</SelectItem>
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
                    <SelectItem value="JavaScript">JavaScript</SelectItem>
                    <SelectItem value="Python">Python</SelectItem>
                    <SelectItem value="Docker">Docker</SelectItem>
                    <SelectItem value="MongoDb">MongoDb</SelectItem>
                    <SelectItem value="Html">Html</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

          <div >
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
            <Label>
                Price in (INR)
            </Label>
            <Input
            type="number"
            name="coursePrice"
            value={input.coursePrice}
            onChange={changeEventHandler}
            placeholder="199"
            className='w-fit'
            />
          </div>
          </div>



          <div>
            <Label>Course Thumbnail</Label>
            <Input 
            type='file'
            onChange={selectThumbnail}

            accept="image/*"
            className="w-fit"
            
            />

            {
                previewThumbnail&&(
                    <img src={previewThumbnail} className="w-64 my-2" alt="Course Thumbnail"/>
                )
            }

          </div>

          <div>
            <Button onClick={()=>navigate("/admin/course")} variant='outline'>Cancel</Button>

            <Button disabaled={isLoading} onClick={updateCourseHandler}>
                {
                    isLoading?(
                        <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                        Please Wiat
                        
                        </>
                    ):"save"
                }

            </Button>
          </div>

        </div>
      </CardContent>
    </Card>
  );
};

export default CourseTab;
