import "./App.css";
import { Button } from "./components/ui/button";
import Login from "./pages/login";
import Navbar from "./components/Navbar";
import HeroSection from "./pages/student/HeroSection";
import { createBrowserRouter } from "react-router-dom";
import MainLayout from "./Layout/MainLayout";
import { RouterProvider } from "react-router";
import Courses from "./pages/student/Courses";
import MyLearning from "./pages/student/MyLearning";
import Profile from "./pages/student/Profile";
import Sidebar from "./pages/admin/Sidebar";
import DashBoard from "./pages/admin/DashBoard";
import CourseTable from "./pages/admin/course/CourseTable";
import AddCourse from "./pages/admin/course/AddCourse";
import EditCourse from "./pages/admin/course/EditCourse";
// import { Sidebar } from "./pages/admin/Sidebar.jsx";

const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: (
          <>
            <HeroSection />
            <Courses/>
          </>
        ),
      },
      {
        path:"login",
        element:<Login/>
      },
      {
        path:"my-learning",
        element:<MyLearning/>
      },
      {
        path:"profile",
        element:<Profile/>
      },


      //   admin routes start from here 


      {
        path:"admin",
        element:<Sidebar/>,

        children:[
          {
            path:"dashboard",
            element:<DashBoard/>
          },

          {
            path:"course",
            element:<CourseTable/>
          },

          {
            path:"course/create",
            element:<AddCourse/>
          },

          {
            path:"course/:courseId",
            element:<EditCourse/>
          },

        
        ]

      }
    ],

    



  },
]);
function App() {
  return (
    <>
      <main>
        <RouterProvider router={appRouter}/>

       
      </main>
    </>
  );
}

export default App;
