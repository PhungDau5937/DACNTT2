// import React, { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useSelector } from "react-redux"; // Import useSelector để lấy ngôn ngữ từ Redux

// React icon
import {
  TbCalendar,         // Quản lý niên khóa
  TbSchool,           // Quản lý lớp học
  TbFileText,         // Quản lý đề thi
  TbReport,           // Báo cáo và thống kê
  TbUser,             // Quản lý tài khoản
  TbSettings,         // Cài đặt hệ thống
} from "react-icons/tb";

function HeadSideBar({ responsiveClass, toggleSidebar }) {
  const { pathname } = useLocation(); // Get current pathname for highlighting
  const language = useSelector((state) => state.language.language); // Lấy ngôn ngữ từ Redux

  const linkClass =
    "flex items-center py-2.5 px-4 rounded-lg transition duration-200 hover:bg-stone-200 hover:text-gray-900 hover:dark:text-white hover:dark:bg-stone-700";
  const activeLinkClass = "bg-stone-200 dark:text-white dark:bg-stone-700";

  return (
    <div>
      <div
        className={`w-72 flex flex-col bg-stone-100 dark:bg-stone-900 text-black dark:text-white ${responsiveClass}`}>
        {/* <h2 className="text-xl font-bold p-4 border-b border-stone-700">
          Chào {username}!
        </h2> */}
        <ul className="flex flex-col space-y-2 p-4 text-sm mt-4 mx-4 rounded-lg shadow bg-white dark:bg-stone-800">
      
          <li>
            <NavLink
              to="/head"
              className={`${linkClass} ${
                pathname === "/head" && activeLinkClass
              }`}>
              <TbCalendar size={16} className="mr-4" />
              {language === "vi" ? "Quản lý niên khóa" : "Semester Management"}
            </NavLink>
          </li>      

          <li>
            <NavLink
              to="/head/grade"
              className={`${linkClass} ${
                pathname.startsWith("/head/grade") && activeLinkClass
              }`}>
              <TbSchool size={16} className="mr-4" />
              {language === "vi" ? "Quản lý lớp học" : "Grade Management"}
            </NavLink>
          </li>  

          <li>
            <NavLink
              to="/head/exam"
              className={`${linkClass} ${
                pathname.startsWith("/head/exam") && activeLinkClass
              }`}>
              <TbFileText size={16} className="mr-4" />
              {language === "vi" ? "Quản lý đề thi" : "Exam Management"}
            </NavLink>
          </li>
            
          {/* <li>
            <NavLink
              to="/head/student"
              className={`${linkClass} ${
                pathname.startsWith("/head/student") && activeLinkClass
              }`}>
              <TbUser size={16} className="mr-4" />
              {language === "vi" ? "Quản lý tài khoản" : "Account Management"}
            </NavLink>
          </li> */}
          <li>
            <NavLink
              to="/head/reports"
              className={`${linkClass} ${
                pathname.startsWith("/head/reports") && activeLinkClass
              }`}>
              <TbReport size={16} className="mr-4" />
              {language === "vi"
                ? "Báo cáo và thống kê"
                : "Reports and Statistics"}
            </NavLink>
          </li>
          {/* <li>
            <NavLink
              to="/head/settings"
              className={`${linkClass} ${
                pathname.startsWith("/head/settings") && activeLinkClass
              }`}>
              <TbSettings size={16} className="mr-4" />
              {language === "vi" ? "Cài đặt hệ thống" : "System Settings"}
            </NavLink>
          </li> */}
          <li>
            <NavLink
              to="/head/account"
              className={`${linkClass} ${
                pathname.startsWith("/head/account") && activeLinkClass
              }`}>
              <TbUser size={16} className="mr-4" />
              {language === "vi" ? "Quản lý tài khoản" : "Account Management"}
            </NavLink>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default HeadSideBar;
