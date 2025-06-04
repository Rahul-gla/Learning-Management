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
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import {
  useEditCourseMutation,
  useEditLectureMutation,
  useGetLectureByIdQuery,
  useRemoveLectureMutation,
} from "@/features/api/courseApi";
import axios from "axios";
import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useParams,Navigate, useNavigate } from "react-router-dom";
import { toast } from "sonner";

// const MEDIA_API = "http://localhost:8080/api/v1/media";


const MEDIA_API =
  window.location.hostname === "localhost"
    ? "http://localhost:8080/api/v1/media"
    : "https://learning-management-5.onrender.com/api/v1/media";


const LectureTab = () => {
  const [lectureTitle, setLectureTitle] = useState("");
  const [uploadVideoInfo, setUploadVideoInfo] = useState(null);

  const [isFree, setIsFree] = useState(false);
  const [mediaProgress, setMediaProgress] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [btnDisable, setBtnDisable] = useState(true);

  const params = useParams();
  const { courseId, lectureId } = params;

  const { data: lectureData } = useGetLectureByIdQuery(lectureId);
  const lecture = lectureData?.lecture;

  useEffect(() => {
    if (lecture) {
      setLectureTitle(lecture.lectureTitle);
      setIsFree(lecture.isPreviewFree);
      setUploadVideoInfo(lecture.videoInfo);
    }
  }, [lecture]);

  const [editLecture, { data, isLoading, error, isSuccess }] =
    useEditLectureMutation();

  const [
    removeLecture,
    { data: removeData, isLoading: removeLoading, isSuccess: removeIsSuccess },
  ] = useRemoveLectureMutation();

  const fileChangeHandler = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      setMediaProgress(true);
      try {
        const res = await axios.post(`${MEDIA_API}/upload-video`, formData, {
          onUploadProgress: ({ loaded, total }) => {
            setUploadProgress(Math.round((loaded * 100) / total));
          },
        });

        if (res.data.success) {
          console.log(res);
          setUploadVideoInfo({
            videoUrl: res.data.data.url,
            publicId: res.data.data.public_id,
          });
          setBtnDisable(false);
          toast.success(res.data.message || "Video Uploaded Succesfully");
        }
      } catch (error) {
        console.log(error);

        toast.error("Video Upload Failed");
      } finally {
        setMediaProgress(false);
      }
    }
  };

  const removeLectureHandler = async () => {
    await removeLecture(lectureId);
  };

  // const editLectureHandler = async () => {
  //   // alert('working');

  //   await editLecture({
  //     lectureTitle,
  //     videoInfo:uploadVideoInfo,
  //     courseId,
  //     lectureId,
  //     isPreviewFree:isFree,
  //   });
  // };

  const editLectureHandler = async () => {
    console.log({ lectureTitle, uploadVideoInfo, isFree, courseId, lectureId });

    await editLecture({
      lectureTitle,
      videoInfo: uploadVideoInfo,
      isPreviewFree: isFree,
      courseId,
      lectureId,
    });
  };
  const navigate = useNavigate();


  useEffect(() => {
    if (isSuccess) {
      toast.success(data.message || "lecture Update");
      navigate(`/admin/course/${courseId}/lecture`); // Navigate to course page after update

    }

    if (error) {
      toast.error(error.data.message || "lecture is not Updated");
    }
  }, [isSuccess, error]);

  useEffect(() => {
    if (removeIsSuccess) {
      toast.success(removeData.message);
      navigate(`/admin/course/${courseId}/lecture`); // or wherever you want to navigate after removal

    }
  }, [removeIsSuccess]);



  return (
    <Card>
      <CardHeader className="flex justify-between">
        <div>
          <CardTitle>Edit Lecture</CardTitle>
          <CardDescription>
            Make chages in yout account save when done
          </CardDescription>
        </div>

        <div className="flex items-center gap-2">
          <Button
            disbaled={removeLoading}
            variant="destructive"
            onClick={removeLectureHandler}
          >
            {removeLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please Wait
              </>
            ) : (
              "Remove Lecture"
            )}
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <div>
          <Label>Title</Label>
          <Input
            value={lectureTitle}
            onChange={(e) => setLectureTitle(e.target.value)}
            type="text"
            placeholder="ex. Introduction to javaScript"
          />
        </div>

        <div className="my-5">
          <Label>
            Video
            <span
              className="text-red-500
        "
            >
              *
            </span>
          </Label>
          <Input
            type="file"
            accept="video/*"
            onChange={fileChangeHandler}
            placeholder="ex. Introduction to javaScript"
            className="w-fit"
          />
        </div>

        <div className="flex  items-center space-x-2 my-5">
          <Switch
            checked={isFree}
            onCheckedChange={setIsFree}
            id="airplane-mode"
          />
          <Label htmlFor="airplane-mode">Is This Video Free</Label>
        </div>
        {mediaProgress && (
          <div className="my-4">
            {/* <Progress value={100} max={100} /> */}
            <Progress value={uploadProgress} />

            <p>{uploadProgress}% Upload</p>
          </div>
        )}

        <div className="mt-4">
          <Button disbaled={isLoading} onClick={editLectureHandler}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please Wait
              </>
            ) : (
              "Update Lecture"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default LectureTab;
