import "./App.css";
import { Button } from "./components/ui/button";
import Login from "./pages/login";
// import Navbar from "./components/Navbar";
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
import CreateLecture from "./pages/admin/lecture/CreateLecture";
import EditLecture from "./pages/admin/lecture/EditLecture";
import CourseDetail from "./pages/student/CourseDetail";
import CourseProgress from "./pages/student/CourseProgress";
import SearchPage from "./pages/student/SearchPage";
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

      {
        path:"course/search",
        element:<SearchPage/>
      },


      {
        path: "course-detail/:courseId",
        element: (
          // <ProtectedRoute>
            <CourseDetail />
          // </ProtectedRoute>
        ),
      },


      {
        path: "course-progress/:courseId",
        element: (
          // <ProtectedRoute>
            // <PurchaseCourseProtectedRoute>
            <CourseProgress />
            // </PurchaseCourseProtectedRoute>
          // </ProtectedRoute>
        ),
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

          {
            path:"course/:courseId/lecture",
            element:<CreateLecture/>
          },

          {
            path:"course/:courseId/lecture/:lectureId",
            element:<EditLecture/>
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
