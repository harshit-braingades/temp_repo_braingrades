// import { useNavigate, useLocation } from "react-router-dom";
// import {
//   FaHome,
//   FaBook,
//   FaClipboard,
//   FaScroll,
//   FaUserCheck,
//   FaChartBar,
//   FaCog,
//   FaSignOutAlt,
// } from "react-icons/fa";

// const Sidebar = () => {
//   const navigate = useNavigate();
//   const location = useLocation();

//   const menuItems = [
//     { name: "Home", path: "/home", icon: <FaHome /> },
//     { name: "Enrollment", path: "/enrollment", icon: <FaBook /> },
//     { name: "Course Feed", path: "/course-feed", icon: <FaClipboard /> },
//     { name: "Result Feed", path: "/result-feed", icon: <FaScroll /> },
//     { name: "Attendance", path: "/attendance", icon: <FaUserCheck /> },
//     { name: "Student Insight", path: "/student-insight", icon: <FaChartBar /> },
//     { name: "Admin", path: "/admin", icon: <FaCog /> },
//   ];

//   return (
//     <div className="h-screen flex flex-col justify-between bg-white p-4">

//       {/* Top Section */}
//       <div>
//         {/* Logo */}
//         <div className="mb-8">
//           <img
//             src="https://d3vmvj34imavjj.cloudfront.net/emails/braingrades_logo.png"
//             alt="Logo"
//             className="w-[140px]"
//           />
//         </div>

//         {/* Menu Items */}
//         <div className="space-y-2">
//           {menuItems.map((item) => {
//             const isActive = location.pathname === item.path;

//             return (
//               <div
//                 key={item.name}
//                 onClick={() => navigate(item.path)}
//                 className={`flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer transition
//                   ${
//                     isActive
//                       ? "bg-blue-100 text-primary font-medium"
//                       : "text-gray-700 hover:bg-blue-50 hover:text-primary"
//                   }`}
//               >
//                 <span className="text-lg">{item.icon}</span>
//                 <span>{item.name}</span>
//               </div>
//             );
//           })}
//         </div>
//       </div>

//       {/* Sign Out */}
//       <div className="flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer text-red-500 hover:bg-red-50">
//         <FaSignOutAlt />
//         <span>Sign Out</span>
//       </div>

//     </div>
//   );
// };

// export default Sidebar;













import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import {
  FaHome,
  FaUserGraduate,
  FaChalkboardTeacher,
  FaBook,
  FaMoneyBill,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [openMenu, setOpenMenu] = useState(null);

  const isActive = (path) => location.pathname === path;

  const toggleMenu = (menu) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  const menuClass = (path) =>
    `px-3 py-2 rounded-md cursor-pointer transition text-sm ${
      isActive(path)
        ? "bg-blue-100 text-primary font-medium"
        : "text-gray-700 hover:bg-blue-50 hover:text-primary"
    }`;

  return (
    <div className="h-screen flex flex-col justify-between bg-white p-3 border-r">
      <div>
        {/* Logo */}
        <div className="mb-8">
          <img
            src="https://d3vmvj34imavjj.cloudfront.net/emails/braingrades_logo.png"
            alt="Logo"
            className="w-[140px]"
          />
        </div>

        {/* HOME */}
        <div
          onClick={() => navigate("/home")}
          className={`flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer transition ${
            isActive("/home")
              ? "bg-blue-100 text-primary font-medium"
              : "text-gray-700 hover:bg-blue-50 hover:text-primary"
          }`}
        >
          <FaHome />
          <span>Home</span>
        </div>

        {/* STUDENT */}
        <div className="mt-4">
          <div
            onClick={() => toggleMenu("student")}
            className="flex items-center gap-3 px-3 py-2 cursor-pointer text-gray-800 font-medium"
          >
            <FaUserGraduate />
            <span className="flex items-center gap-1 font-bold "> Student ↓</span>
          </div>

          {openMenu === "student" && (
            <div className="ml-6 space-y-1 mt-1">
              <div className={menuClass("/student/enrollment")} onClick={() => navigate("/student/enrollment")}>
                Enrollment
              </div>
              <div className={menuClass("/student/promote")} onClick={() => navigate("/student/promote")}>
                Promote
              </div>
              <div className={menuClass("/student/export")} onClick={() => navigate("/student/export")}>
                Data Export
              </div>
              <div className={menuClass("/student/insight")} onClick={() => navigate("/student/insight")}>
                Insight
              </div>
            </div>
          )}
        </div>

        {/* EMPLOYEES */}
        <div className="mt-4">
          <div
            onClick={() => toggleMenu("employees")}
            className="flex items-center gap-3 px-3 py-2 cursor-pointer text-gray-800 font-medium"
          >
            <FaChalkboardTeacher />
            <span className="flex items-center gap-1 font-bold " >Employees ↓</span>
          </div>

          {openMenu === "employees" && (
            <div className="ml-6 space-y-1 mt-1">
              <div className={menuClass("/employees/add-teacher")} onClick={() => navigate("/employees/add-teacher")}>
                Add Teacher
              </div>
              <div className={menuClass("/employees/manage")} onClick={() => navigate("/employees/manage")}>
                Manage
              </div>
            </div>
          )}
        </div>

        {/* ACADEMICS */}
        <div className="mt-4">
          <div
            onClick={() => toggleMenu("academics")}
            className="flex items-center gap-3 px-3 py-2 cursor-pointer text-gray-800 font-medium"
          >
            <FaBook />
            <span>Academics</span>
          </div>

          {openMenu === "academics" && (
            <div className="ml-6 space-y-1 mt-1">
              <div className={menuClass("/academics/course-feed")} onClick={() => navigate("/academics/course-feed")}>
                Course Feed
              </div>
              <div className={menuClass("/academics/result-feed")} onClick={() => navigate("/academics/result-feed")}>
                Result Feed
              </div>
              <div className={menuClass("/academics/attendance")} onClick={() => navigate("/academics/attendance")}>
                Attendance
              </div>
            </div>
          )}
        </div>

        {/* FEES */}
        <div className="mt-4">
          <div
            onClick={() => toggleMenu("fees")}
            className="flex items-center gap-3 px-3 py-2 cursor-pointer text-gray-800 font-medium"
          >
            <FaMoneyBill />
            <span> Fees </span>
          </div>

          {openMenu === "fees" && (
            <div className="ml-6 space-y-1 mt-1">
              <div className={menuClass("/fees/overview")} onClick={() => navigate("/fees/overview")}>
                Overview
              </div>
              <div className={menuClass("/fees/collection")} onClick={() => navigate("/fees/collection")}>
                Collection
              </div>
            </div>
          )}
        </div>

        {/* ADMIN */}
        <div className="mt-4">
          <div
            onClick={() => toggleMenu("admin")}
            className="flex items-center gap-3 px-3 py-2 cursor-pointer text-gray-800 font-medium"
          >
            <FaCog />
            <span className="flex items-center gap-1 font-bold " >Admin ↓</span>
          </div>

          {openMenu === "admin" && (
            <div className="ml-6 space-y-1 mt-1">
              <div className={menuClass("/admin/trigger")} onClick={() => navigate("/admin/trigger")}>
                Trigger Notification
              </div>
              <div className={menuClass("/admin/settings")} onClick={() => navigate("/admin/settings")}>
                Settings
              </div>
            </div>
          )}
        </div>
      </div>

      {/* SIGN OUT */}
      <div className="flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer text-red-500 hover:bg-red-50">
        <FaSignOutAlt />
        <span>Sign Out</span>
      </div>

    </div>
  );
};

export default Sidebar;
