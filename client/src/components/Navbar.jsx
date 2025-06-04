import { Menu, School, Sidebar } from "lucide-react";
import React, { useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { Link, useNavigate } from "react-router-dom";
import { useLogoutUserMutation } from "@/features/api/authApi";
import { toast } from "sonner";
import { useSelector } from "react-redux";

const Navbar = () => {
  const { user } = useSelector((store) => store.auth);
  const [logoutUser , { data, isSuccess }] = useLogoutUserMutation();
  const navigate = useNavigate();

  const logoutHandler = async () => {
    await logoutUser ();
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success(data?.message || "User  logged out.");
      navigate("/login");
    }
  }, [isSuccess]);

  return (
    <div className="h-16 bg-white border-b border-b-gray-200 fixed top-0 left-0 right-0 duration-300 z-10">
      <div className="max-w-7xl mx-auto hidden md:flex justify-between items-center gap-10 h-full">
        <div className="flex items-center gap-2">
          <School size={"30"} />
          <Link to="/">
            <h1 className="hidden md:block font-extrabold text-2xl">
              E-Learning
            </h1>
          </Link>
        </div>
        {/* User icons */}
        <div className="flex items-center gap-8">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Avatar className="h-12 w-12">
                  <AvatarImage
                    src={user?.photoUrl || "https://github.com/shadcn.png"}
                    alt="@shadcn"
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <Link to="my-learning">My Learning</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link to="profile">Edit Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={logoutHandler}>
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                {user?.role === "instructor" && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Link to="/admin/dashboard">Dashboard</Link>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => navigate("/login")}>
                Login
              </Button>
              <Button onClick={() => navigate("/login")}>Signup</Button>
            </div>
          )}
        </div>
      </div>
      {/* Mobile device */}
      <div className="flex md:hidden items-center justify-between px-4 h-full">
        <h1 className="font-extrabold text-2xl"><Link to="/">E-learning</Link></h1>
        <MobileNavbar user={user} logoutHandler={logoutHandler} />
      </div>
    </div>
  );
};

// const MobileNavbar = ({ user, logoutHandler }) => {
//   const navigate = useNavigate();

//   return (
//     <Sheet>
//       <SheetTrigger asChild>
//         <Button
//           size="icon"
//           className="rounded-full hover:bg-gray-200"
//           variant="outline"
//         >
//           <Menu />
//         </Button>
//       </SheetTrigger>
//       <SheetContent className="flex flex-col">
//         <SheetHeader className="flex flex-row items-center justify-between mt-2">
//           <SheetTitle className="font-extrabold text-2xl">
//             <Link to="/">E-Learning</Link>
//             {/* <Link to="/" onClick={() => navigate("/")}>E-Learning</Link> */}
//           </SheetTitle>
//         </SheetHeader>
//         <Separator className="mr-2" />
//         <nav className="flex flex-col space-y-4 ml-4">
//           <Link to="/my-learning">My Learning</Link>
//           <Link to="/profile">Edit Profile</Link>
//           <Link onClick={logoutHandler}>Log Out</Link>
//         </nav>
//         {user?.role === "instructor" && (
//           <SheetFooter>
//             <SheetClose asChild>
//               <Button type="submit" onClick={() => navigate("/admin/dashboard")}>
//                 Dashboard
//               </Button>
//             </SheetClose>
//           </SheetFooter>
//         )}
//       </SheetContent>
//     </Sheet>
//   );
// };



const MobileNavbar = ({ user, logoutHandler }) => {
  const navigate = useNavigate();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          size="icon"
          className="rounded-full hover:bg-gray-200"
          variant="outline"
        >
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col">
        <SheetHeader className="flex flex-row items-center justify-between mt-2">
          <SheetTitle className="font-extrabold text-2xl">
            <Link to="/">E-Learning</Link>
          </SheetTitle>
        </SheetHeader>
        <Separator className="mr-2" />

        {user ? (
          <>
            {/* Logged-in user */}
            <nav className="flex flex-col space-y-4 ml-4">


            <SheetClose asChild>

              <Link to="/my-learning">My Learning</Link>
              </SheetClose>

              <SheetClose asChild>

              <Link to="/profile">Edit Profile</Link>
              </SheetClose>

              <SheetClose asChild>

              <Link onClick={logoutHandler}>Log Out</Link>
              </SheetClose>
            </nav>

            {user?.role === "instructor" && (
              <SheetFooter>
                <SheetClose asChild>
                  <Button type="submit" onClick={() => navigate("/admin/dashboard")}>
                    Dashboard
                  </Button>
                </SheetClose>
              </SheetFooter>
            )}
          </>
        ) : (
          <>
            {/* Guest user */}
            <nav className="flex flex-col space-y-4 ml-4">
            <SheetClose asChild>

              <Button variant="outline" onClick={() => navigate("/login")}>
                Login
              </Button>

              </SheetClose>
              <SheetClose asChild>
              <Button onClick={() => navigate("/login")}>Signup</Button>
              </SheetClose>
            </nav>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};









export default Navbar;