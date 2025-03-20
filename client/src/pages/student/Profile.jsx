import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Key, Loader2 } from "lucide-react";
// import { Dialog } from "@radix-ui/react-dialog";
import React from "react";
import Course from "./Course";
import { useLoadUserQuery } from "@/features/api/authApi";

const Profile = () => {

  const {data,isLoading}=useLoadUserQuery();
  console.log(data);


  // const isLoading = false;
  const enrolledcouses = [1, 2, 3, 4];
  return (
    <div className="my-20 max-w-4xl mx-auto px-4 ">
      <h1 className="font-bold text-2xl text-center md:text-left">Profile</h1>
      <div className="flex flex-col md:flex-row items-center md:items-startgap-8 my-5">
        <div className="flex flex-col items-center">
          <Avatar className="h-20 w-20 md:h-32 md:w-32 mb-4">
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback className="w-full h-full flex items-center justify-center rounded-full">
              CN
            </AvatarFallback>
          </Avatar>
        </div>

        <div>
          <div className="mb-2">
            <h1 className="font-semibold text-gray-900 dark:text-gray-100 ml-2">
              Name:
              <span className="font-normal text-gray-700 dark:text-gray-300 ml-2">
                Rahul Mern Stack
              </span>
            </h1>
          </div>

          <div className="mb-2">
            <h1 className="font-semibold text-gray-900 dark:text-gray-100 ml-2">
              Email:
              <span className="font-normal text-gray-700 dark:text-gray-300 ml-2">
                rkx639849@gmail.com
              </span>
            </h1>
          </div>

          <div className="mb-2">
            <h1 className="font-semibold text-gray-900 dark:text-gray-100 ml-2">
              Role:
              <span className="font-normal text-gray-700 dark:text-gray-300 ml-2">
                Instructor
              </span>
            </h1>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm" className="mt-2">
                Edit Profile
              </Button>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Profile</DialogTitle>
                <DialogDescription>
                  Make chages to your Profile Here.Click save when You are done.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label>Name</Label>
                  <Input type="text" placehoder="name" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label>Profile Photo</Label>
                  <Input type="file" accept="image/*" className="col-span-3" />
                </div>
              </div>

              <DialogFooter>
                <Button disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Please Wait
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div>
        <h1 className="font-medium text-lg">Courses You Are Enrolled in</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 my-5">
          {enrolledcouses.length === 0 ? (
            <h1>You Have Not Enroll yet</h1>
          ) : (
            enrolledcouses.map((course, index) => <Course Key={index} />)
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
