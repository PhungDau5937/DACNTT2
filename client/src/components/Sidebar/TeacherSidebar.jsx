// import React, { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useSelector } from "react-redux"; // Import useSelector để lấy ngôn ngữ từ Redux

// React icon
import {
  TbLayoutDashboard,  // Quản lý lớp học
  TbFileCode,         // Nộp đề thi
  TbBook2,            // Kho lưu trữ đề
  TbReport,           // Báo cáo thống kê
} from "react-icons/tb";

function TeacherSidebar({ responsiveClass, toggleSidebar }) {
  const { pathname } = useLocation(); // Get current pathname for highlighting
  const language = useSelector((state) => state.language.language); // Lấy ngôn ngữ từ Redux

  const linkClass =
    "flex items-center py-2.5 px-4 rounded-lg transition duration-200 hover:bg-stone-200 hover:text-gray-900 hover:dark:text-white hover:dark:bg-stone-700";
  const activeLinkClass = "bg-stone-200 dark:text-white dark:bg-stone-700";

  return (
    <div>
      <div
        className={`w-64 flex flex-col bg-stone-100 dark:bg-stone-900 text-black dark:text-white ${responsiveClass}`}>
        {/* <h2 className="text-xl font-bold p-4 border-b border-stone-700">
          Chào {username}!
        </h2> */}
        <ul className="flex flex-col space-y-2 p-4 text-sm mt-4 mx-4 rounded-lg shadow bg-white dark:bg-stone-800">
          
          <li>
            <NavLink
              to="/teacher"
              className={`${linkClass} ${
                (pathname === "/teacher" || pathname.startsWith("/teacher/class")) && activeLinkClass
              }`}>
              <TbLayoutDashboard size={16} className="mr-4" />
              {language === "vi" ? "Quản lý lớp học" : "Class Management"}
            </NavLink>
          </li>
          
          <li>
            <NavLink
              to="/teacher/examsubmission"
              className={`${linkClass} ${
                pathname.startsWith("/teacher/examsubmission") && activeLinkClass
              }`}>
              <TbFileCode size={16} className="mr-4" />
              {language === "vi" ? "Nộp đề thi" : "Submit Exam"}
            </NavLink>
          </li>
          
          <li>
            <NavLink
              to="/teacher/repository"
              className={`${linkClass} ${
                pathname.startsWith("/teacher/repository") && activeLinkClass
              }`}>
              <TbBook2 size={16} className="mr-4" />
              {language === "vi" ? "Kho lưu trữ đề" : "Repository"}
            </NavLink>
          </li>
          
          <li>
            <NavLink
              to="/teacher/reports"
              className={`${linkClass} ${
                pathname.startsWith("/teacher/reports") && activeLinkClass
              }`}>
              <TbReport size={16} className="mr-4" />
              {language === "vi" ? "Báo cáo thống kê" : "Statistical Reports"}
            </NavLink>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default TeacherSidebar;
