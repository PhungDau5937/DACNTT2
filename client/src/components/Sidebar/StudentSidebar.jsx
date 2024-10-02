import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useSelector } from "react-redux"; // Import useSelector để lấy ngôn ngữ từ Redux

// React icons
import {
  MdAssignment,       // Làm bài thi thử
  MdManageAccounts,   // Quản lý đề thi
  MdAssessment,       // Quản lý điểm số
} from "react-icons/md";

function StudentSidebar({ responsiveClass, toggleSidebar }) {
  const { pathname } = useLocation(); // Get current pathname for highlighting
  const language = useSelector((state) => state.language.language); // Lấy ngôn ngữ từ Redux

  const linkClass =
    "flex items-center py-2.5 px-4 rounded-lg transition duration-200 hover:bg-stone-200 hover:text-gray-900 hover:dark:text-white hover:dark:bg-stone-700";
  const activeLinkClass = "bg-stone-200 dark:text-white dark:bg-stone-700";

  return (
    <div>
      <div
        className={`w-72 flex flex-col bg-stone-100 dark:bg-stone-900 text-black dark:text-white ${responsiveClass}`}
      >
        {/* <h2 className="text-xl font-bold p-4 border-b border-stone-700">
          Chào {username}!
        </h2> */}
        <ul className="flex flex-col space-y-2 p-4 text-sm mt-4 mx-4 rounded-lg shadow bg-white dark:bg-stone-800">
          <li>
            <NavLink
              to="/student/practicetests"
              className={`${linkClass} ${
                (pathname === "/student" || pathname.startsWith("/student/practicetests")) && activeLinkClass
              }`}
            >
              <MdAssignment size={16} className="mr-4" />
              {language === "vi" ? "Làm bài thi thử" : "Practice Tests"}
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/student/exam"
              className={`${linkClass} ${
                pathname.startsWith("/student/exam") && activeLinkClass
              }`}
            >
              <MdManageAccounts size={16} className="mr-4" />
              {language === "vi" ? "Kỳ thi" : "Exams"}
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/student/score"
              className={`${linkClass} ${
                pathname.startsWith("/student/score") && activeLinkClass
              }`}
            >
              <MdAssessment size={16} className="mr-4" />
              {language === "vi" ? "Quản lý điểm số" : "Score Management"}
            </NavLink>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default StudentSidebar;
