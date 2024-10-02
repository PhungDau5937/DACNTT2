import React from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";


function Repository() {
  const { pathname } = useLocation();
  const linkClass =
    "flex items-center justify-center px-5 py-2 border border-stone-900 dark:border-stone-200 rounded-lg transition duration-300 ease-in-out text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700 whitespace-nowrap";
  const activeLinkClass = "bg-stone-400 dark:bg-stone-700 text-stone-900 dark:text-white";
  const language = useSelector((state) => state.language.language);

  // Check if the current path is in the repository section
  const isRepositoryPath = pathname.startsWith("/teacher/repository");

  return (
    <div className="flex flex-col w-full h-full">
      <header>
        <nav>
          <ul className="flex flex-wrap justify-between py-4 pb-6 gap-4 sm:gap-6 md:gap-8 lg:gap-10 md:flex-row md:justify-start">
            <li className="flex-1">
              <NavLink
                to="/teacher/repository/warehouse"
                className={({ isActive }) =>
                  `${linkClass} ${isRepositoryPath && (pathname === "/teacher/repository/warehouse" || pathname === "/teacher/repository") ? activeLinkClass : (isActive ? activeLinkClass : '')}`
                }
              >
                {language === "vi" ? "Kho đề thi" : "Exam Warehouse"}
              </NavLink>
            </li>
            <li className="flex-1">
              <NavLink
                to="/teacher/repository/createexam"
                className={({ isActive }) =>
                  `${linkClass} ${isRepositoryPath && (pathname === "/teacher/repository/createexam") ? activeLinkClass : (isActive ? activeLinkClass : '')}`
                }
              >
                {language === "vi" ? "Tạo đề thi" : "Create Exam"}
              </NavLink>
            </li>
            <li className="flex-1">
              <NavLink
                to="/teacher/repository/createrandom"
                className={({ isActive }) =>
                  `${linkClass} ${isRepositoryPath && (pathname === "/teacher/repository/createrandom") ? activeLinkClass : (isActive ? activeLinkClass : '')}`
                }
              >
                {language === "vi" ? "Tạo đề ngẫu nhiên" : "Create Exam Random"}
              </NavLink>
            </li>
            <li className="flex-1">
              <NavLink
                to="/teacher/repository/createupload"
                className={({ isActive }) =>
                  `${linkClass} ${isRepositoryPath && (pathname === "/teacher/repository/createupload") ? activeLinkClass : (isActive ? activeLinkClass : '')}`
                }
              >
                {language === "vi" ? "Tạo đề từ file" : "Create Exam Upload"}
              </NavLink>
            </li>
          </ul>
        </nav>
      </header>
      {/* Hiển thị nội dung của các route con */}
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default Repository;
