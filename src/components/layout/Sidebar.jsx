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

const Sidebar = ({ onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [openMenu, setOpenMenu] = useState(null);

  const isActive = (path) => location.pathname === path;

  const toggleMenu = (menu) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  const handleNavigate = (path) => {
    navigate(path);
    if (onClose) onClose(); // close only in mobile
  };

  const menuClass = (path) =>
    `px-3 py-2 rounded-md cursor-pointer transition text-sm ${
      isActive(path)
        ? "bg-blue-100 text-primary font-medium"
        : "text-gray-700 hover:bg-blue-50 hover:text-primary"
    }`;

  return (
    <div className="h-full lg:h-screen flex flex-col justify-between bg-white p-3 border-r">

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
          onClick={() => handleNavigate("/home")}
          className={`flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer transition ${
            isActive("/home")
              ? "bg-blue-100 text-primary font-medium"
              : "text-gray-700 hover:bg-blue-50 hover:text-primary"
          }`}
        >
          <FaHome />
          <span className="font-bold">Home</span>
        </div>

        {/* STUDENT */}
        <div className="mt-4">
          <div
            onClick={() => toggleMenu("student")}
            className="flex items-center gap-3 px-3 py-2 cursor-pointer text-gray-800 font-medium"
          >
            <FaUserGraduate />
            <span>Student</span>
          </div>

          {openMenu === "student" && (
            <div className="ml-6 space-y-1 mt-1">
              <div className={menuClass("/student/enrollment")} onClick={() => handleNavigate("/student/enrollment")}>
                Enrollment
              </div>
              <div className={menuClass("/student/promote")} onClick={() => handleNavigate("/student/promote")}>
                Promote
              </div>
              <div className={menuClass("/student/export")} onClick={() => handleNavigate("/student/export")}>
                Data Export
              </div>
              <div className={menuClass("/student/insight")} onClick={() => handleNavigate("/student/insight")}>
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
            <span>Employees</span>
          </div>

          {openMenu === "employees" && (
            <div className="ml-6 space-y-1 mt-1">
              <div className={menuClass("/employees/add-teacher")} onClick={() => handleNavigate("/employees/add-teacher")}>
                Add Teacher
              </div>
              <div className={menuClass("/employees/manage")} onClick={() => handleNavigate("/employees/manage")}>
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
              <div className={menuClass("/academics/course-feed")} onClick={() => handleNavigate("/academics/course-feed")}>
                Course Feed
              </div>
              <div className={menuClass("/academics/result-feed")} onClick={() => handleNavigate("/academics/result-feed")}>
                Result Feed
              </div>
              <div className={menuClass("/academics/attendance")} onClick={() => handleNavigate("/academics/attendance")}>
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
            <span>Fees</span>
          </div>

          {openMenu === "fees" && (
            <div className="ml-6 space-y-1 mt-1">
              <div className={menuClass("/fees/overview")} onClick={() => handleNavigate("/fees/overview")}>
                Overview
              </div>
              <div className={menuClass("/fees/collection")} onClick={() => handleNavigate("/fees/collection")}>
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
            <span>Admin</span>
          </div>

          {openMenu === "admin" && (
            <div className="ml-6 space-y-1 mt-1">
              <div className={menuClass("/admin/trigger")} onClick={() => handleNavigate("/admin/trigger")}>
                Trigger Notification
              </div>
              <div className={menuClass("/admin/settings")} onClick={() => handleNavigate("/admin/settings")}>
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
