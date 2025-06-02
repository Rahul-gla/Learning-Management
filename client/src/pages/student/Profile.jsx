import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog } from "@radix-ui/react-dialog";
import exp from "constants";
import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import Course from "./Course";
import {
  useLoadUserQuery,
  useUpdateUserMutation,
} from "@/features/api/authApi";
import { toast } from "sonner";
import { useGetPurchasedCoursesQuery } from "@/features/api/purchaseApi";


const Profile = () => {
  const [name, setName] = useState("");
  const [profilePhoto, setProfilePhoto] = useState("");

  const { data, isLoading,refetch } = useLoadUserQuery(undefined, {
    refetchOnMountOrArgChange: true,});
  // const { data, isLoading,refetch } = useGetPurchasedCoursesQuery();

  const [
    updateUser,
    {
      data: updateUserData,
      isLoading: updateUserIsLoading,
      isError,
      error,
      isSuccess,
    },
  ] = useUpdateUserMutation();

  // const isLoading=false;

  // const enrolledCourses=[1,2];

  const onChangeHandler = (e) => {
    const file = e.target.files?.[0];

    if (file) setProfilePhoto(file);
  };

   

  const updateUserHandler = async () => {
    // console.log(name);
    // console.log(profilePhoto);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("profilePhoto", profilePhoto);

    await updateUser(formData);
  };
  useEffect(()=>{
    refetch();

  },[])

  useEffect(() => {
    if (isSuccess) {
      refetch();
      toast.success(data.message || "Profie Updated");
    }
    if (isError) {
      toast.error(error.message || "Profile Not updated");
    }
  }, [error,updateUserData, isSuccess,isError]);


  // console.log(data);


  if (isLoading) return <h1>Profile Loading...</h1>;

// const user=data;
  const user = data&&data.user;
  // const user = data?.user;


  return (
    <div className="max-w-4xl mx-auto px-4 my-24">
      <h1 className="font-bold text-2xl text-center md:text-left">Profile</h1>
      <div className="flex flex-col md:flex-row items-center md:items-start gap-8 my-5">
        <div className="flex flex-col items-center">
          <Avatar className="h-24 w-24  md:h-32 md:w-32 mb-4">
            <AvatarImage
              // className="w-13 h-13  rounded-full mt-1" // Ensure the image covers the avatar and is circular
              src={user?.photoUrl || "https://github.com/shadcn.png"}
              alt="@shadcn"
            />
            <AvatarFallback className="w-full h-full flex items-center justify-center rounded-full">
              CN
            </AvatarFallback>
          </Avatar>
        </div>

        <div>
          <div className="mb-2">
            <h1 className="font-semibold text-gray-900 dark:text-gray-100">
              Name:
              <span className="font-normal text-gray-700 dark:text-gray-300 ml-2">
                {user.name}
              </span>
            </h1>
          </div>
          <div className="mb-2">
            <h1 className="font-semibold text-gray-900 dark:text-gray-100">
              Email:
              <span className="font-normal text-gray-700 dark:text-gray-300 ml-2">
                {user.email}
              </span>
            </h1>
          </div>
          <div className="mb-2">
            <h1 className="font-semibold text-gray-900 dark:text-gray-100">
              Role:
              <span className="font-normal text-gray-700 dark:text-gray-300 ml-2">
                {user.role.toUpperCase()}
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
                  Make changes to your profile here click save when you are done
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label>Name</Label>
                  <Input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="name"
                    className="col-span-3"
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label>Profile Photo</Label>
                  <Input
                    onChange={onChangeHandler}
                    type="file"
                    accept="image/*"
                    name="profilePhoto"
                    className="col-span-3"
                  />
                </div>
              </div>

              <DialogFooter>
                <Button disabled={updateUserIsLoading} onClick={updateUserHandler}>
                  {updateUserIsLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4  animate-spin" /> Please
                      Wait
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
        <h1 className="font-medium text-lg">Courses You are Enrolled in</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 my-5">
          {user.enrolledCourses.length === 0 ? (
            <h1>You Have Not enrolled yet</h1>
          ) : (
            user.enrolledCourses.map((course) => (
              <Course course={course} key={course._id} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
