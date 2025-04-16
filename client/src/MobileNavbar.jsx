// import { Sheet } from 'lucide-react';
import React from 'react'
import {Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from './components/ui/sheet';
import { Button } from './components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, Label, Separator } from '@radix-ui/react-dropdown-menu';
import { Input } from './components/ui/input';
import { Menu } from 'lucide-react';
import DarkMode from './DarkMode';

const MobileNavbar=()=> {
  const role="instructor";
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size='icon' className="rounded-full bg-gray-200 hover:bg-gray-200" variant="outline">

            <Menu/>
        </Button>
      </SheetTrigger>
      <SheetContent  className="flex flex-col">
        <SheetHeader className="flex flex-row items-center justify-between mt-2">
          <SheetTitle>E-Learning</SheetTitle>
         <DarkMode/>
        </SheetHeader>

        <Separator className='mr-2'/>
        <nav className='flex flex-col space-y-4'>
            <span> My Learning</span>
            <span> Edit Profile</span>
            <span> Log Out</span>

        </nav>

        {
          role==="instructor"&&(

        
       
        <SheetFooter>
          <SheetClose asChild>
            <Button type="submit">Dashboard</Button>
          </SheetClose>
        </SheetFooter>


)
}
      </SheetContent>
    </Sheet>



  )
}

export default MobileNavbar;
