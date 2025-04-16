import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import React from "react";
import { Link } from "react-router-dom";

const Course = ({course}) => {
  return (

    <Link to={`course-detail/${course._id}`}>
    <Card className="overflow-hidden rounded-lg dark:bg-gray-800 bg-white shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
      <div className="relative">
        <img
          src={course.courseThumbnail
          }
          alt="couses"
          className="w-full h-36 object-cover rounded-t-lg"
        />


      </div>

      <CardContent className="px-5 py-4 space-y-3">
        <h1 className="hover:underline font-bold text-lg truncate">
          {course.courseTitle}
        </h1>
        <div className="flex items-center justify-between">


        <div className="flex items-center gap-3">
        <Avatar >
                  <AvatarImage
                    className="w-13 h-13  rounded-full mt-1" // Ensure the image covers the avatar and is circular
                    src={course.creator?.photoUrl||"https://github.com/shadcn.png"}
                    alt="@shadcn"
                  />
                  <AvatarFallback className="w-full h-full flex items-center justify-center rounded-full">
                    CN
                  </AvatarFallback>
                </Avatar>

                <h1 className="font-medium text-sm">{course.creator?.name}</h1>

        </div>
        <Badge className={'bg-blue-600 text-white py-1 text-xs rounded-full'}>
            {course.courseLevel}
        </Badge>
        </div>

        <div className="text-lg font-bold">
            <span className="">RS.{course.coursePrice}</span>
        </div>

      </CardContent>
    </Card>
    </Link>
  );
};

export default Course;
