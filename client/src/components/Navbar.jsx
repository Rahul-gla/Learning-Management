import React from "react";
import { School} from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Label,
} from "@radix-ui/react-dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import DarkMode from "@/DarkMode";
import MobileNavbar from "@/MobileNavbar";
import { Link } from "react-router-dom";
// import { Input } from "./ui/input";


const Navbar = () => {
  const user = true;
  return (
    <div className="h-16 dark:bg-[#0A0A0A] bg-white border-b dark:border-b-ray-800 border-b-gray-200 fixed top-0 left-0 right-0 duration-300 z-10">
      <div className=" max-w-7xl mx-auto hidden md:flex justify-between items-center gap-10 h-full">
        <div className="flex items-center gap-2">
          <School size={"30"} />
          <h1 className="hidden md:block font-extrabold text-2xl">
            E-Learning
          </h1>
        </div>

        <div className="flex items-center gap-8">
          {user ? (
            <DropdownMenu>
              {/* <DropdownMenuTrigger asChild>
                <Avatar>
                  <AvatarImage
                    className="w-15 h-15 border-r-2 object-cover" // Ensure the image covers the avatar
                    src="https://github.com/shadcn.png"
                    alt="@shadcn"
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger> */}

              <DropdownMenuTrigger asChild>
                <Avatar>
                  {" "}
                  {/* Add border color if needed */}
                  <AvatarImage
                    className="w-13 h-13  rounded-full mt-1" // Ensure the image covers the avatar and is circular
                    src="https://github.com/shadcn.png"
                    alt="@shadcn"
                  />
                  <AvatarFallback className="w-full h-full flex items-center justify-center rounded-full">
                    {" "}
                    {/* Ensure fallback is also circular */}
                    CN
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>

              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuGroup>
                  <DropdownMenuItem><Link to="my-learning">My Learning</Link></DropdownMenuItem>
                  <DropdownMenuItem><Link to="profile">Edit Profile</Link></DropdownMenuItem>
                  <DropdownMenuItem>Log out</DropdownMenuItem>
                </DropdownMenuGroup>

                <DropdownMenuSeparator />

                <DropdownMenuItem>Dashboard</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="outline">Login</Button>
              <Button>SignUp</Button>
            </div>
          )}

          <DarkMode />
        </div>
      </div>


      {/* mobile device */}


      <div className="flex md:hidden items-center justify-between px-4 h-full">
        <h1 className="font-extrabold">E-Learning</h1>
      <MobileNavbar/>

      </div>
    </div>
  );
};

export default Navbar;





