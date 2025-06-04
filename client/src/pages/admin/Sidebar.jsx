import { ChartNoAxesColumn, Menu, SquareLibrary } from "lucide-react";
import React, { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  // Auto-close sidebar when route changes
  React.useEffect(() => {
    setIsOpen(false);
  }, [location]);

  return (
    <div className="flex mt-20 relative">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-[250px] sm:w-[300px] space-y-8 border-r border-gray-300 p-5 sticky top-0 h-screen">
        <SidebarLinks />
      </div>

      {/* Mobile Sidebar Trigger (slightly lower) */}
      <div className="lg:hidden ml-4 mt-4">

        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <Menu />
            </Button>
          </SheetTrigger>

          <SheetContent side="left" className="w-[250px] sm:w-[300px]">
            <SidebarLinks isMobile onLinkClick={() => setIsOpen(false)} />
          </SheetContent>
        </Sheet>
      </div>

      {/* Main content */}
      <div className="flex-1 p-10">
        <Outlet />
      </div>
    </div>
  );
};

const SidebarLinks = ({ isMobile = false, onLinkClick = () => {} }) => (
  <div className={`space-y-4 ${isMobile ? "mt-10" : ""}`}>
    <Link
      to="dashboard"
      onClick={onLinkClick}
      className="flex items-center gap-2"
    >
      <ChartNoAxesColumn size={22} />
      <h1>Dashboard</h1>
    </Link>
    <Link
      to="course"
      onClick={onLinkClick}
      className="flex items-center gap-2"
    >
      <SquareLibrary size={22} />
      <h1>Courses</h1>
    </Link>
  </div>
);

export default Sidebar;
