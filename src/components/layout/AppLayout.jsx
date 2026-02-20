// import { Outlet, useLocation } from "react-router-dom";
// import Sidebar from "./Sidebar";
// import RightSidebar from "./RightSidebar";
// import TopSection from "./TopSection";

// const AppLayout = () => {
//   const location = useLocation();

//   const pageTitleMap = {
//     "/home": "Home",
//     "/enrollment": "Enrollment",
//     "/course-feed": "Course Feed",
//     "/result-feed": "Result Feed",
//     "/attendance": "Attendance",
//     "/student-insight": "Student Insight",
//     "/admin": "Admin",
//   };

//   const currentTitle = pageTitleMap[location.pathname] || "Dashboard";

//   return (
//     <div className="flex min-h-screen bg-secondary">

//       {/* Sidebar */}
//       <div className="w-[220px] min-w-[180px] bg-white border-r border-gray-200 hidden md:flex flex-col">
//         <Sidebar />
//       </div>

//       {/* Main Area */}
//       <div className="flex-1 p-6 space-y-6">

//         {/* Permanent Top Section */}
//         <TopSection />

//         {/* Dynamic Page Heading */}
//         <h1 className="text-2xl font-bold">
//           {currentTitle}
//         </h1>

//         {/* Dynamic Page Content */}
//         <Outlet />

//       </div>

//       {/* Right Sidebar */}
//       <div className="w-[300px] min-w-[250px] bg-white hidden lg:flex">
//         <RightSidebar />
//       </div>

//     </div>
//   );
// };

// export default AppLayout;


import Sidebar from "./Sidebar";
import RightSidebar from "./RightSidebar";
import TopSection from "./TopSection";
import { Outlet } from "react-router-dom";
import DemoSidebar from "./DemoSidebar";


export default function AppLayout() {
  return (
    <div className="h-screen flex overflow-hidden">

      {/* LEFT SIDEBAR */}
      <div className="w-64 flex-shrink-0">
        <Sidebar />
      </div>

      {/* CENTER SECTION */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* TOP HEADER */}
        <div className="flex-shrink-0">
          <TopSection />
        </div>

        {/* SCROLLABLE CONTENT */}
        <div className="flex-1 overflow-y-auto bg-gray-100 p-6">
          <Outlet />
        </div>

      </div>

      {/* RIGHT SIDEBAR */}
      <div className="w-80 flex-shrink-0 border-l bg-white">
        <RightSidebar />
      </div>

    </div>
  );
}
