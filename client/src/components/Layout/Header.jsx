import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { MdSearch, MdMenu, MdOutlineSend } from "react-icons/md";
import { TbMessage, TbSquareRoundedLetterE, TbSquareRoundedLetterV } from "react-icons/tb";


import fullLogo from "../../assets/Image/logo.png";
import HeadSidebar from "../Sidebar/HeadSidebar";
import TeacherSidebar from "../Sidebar/TeacherSidebar";
import StudentSidebar from "../Sidebar/StudentSidebar";
import DarkMode from "../../components/DarkMode/DarkMode";
import Language from "../../components/Language/Language";
import ProfileMenu from "./ProfileMenu";
import default_avt from "../../assets/Image/default_avt.png";

const Header = () => {

  const userId = localStorage.getItem('username');
  const userRole = localStorage.getItem('userRole');
  const [userAvatar, setUserAvatar] = useState(default_avt);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);

  const [isAvatarDropdownOpen, setIsAvatarDropdownOpen] = useState(false);
  const avatarDropdownRef = useRef(null);

  const toggleAvatarDropdown = () => {
    setIsAvatarDropdownOpen(!isAvatarDropdownOpen);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleClickOutside = (event) => {
    if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
      setIsSidebarOpen(false);
    }
    if (
      avatarDropdownRef.current &&
      !avatarDropdownRef.current.contains(event.target)
    ) {
      setIsAvatarDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (userId) {
      // Fetch user data from API
      const fetchUserAvatar = async () => {
        try {
          const response = await fetch(`${process.env.REACT_APP_API_URL}auth/profile/${userId}`);
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          const data = await response.json();
          const avatarUrl = data.avatar;

          // Check if avatarUrl is empty or not, and update userAvatar accordingly
          if (avatarUrl && avatarUrl.trim() !== "") {
            setUserAvatar(`${process.env.REACT_APP_API_URL}${avatarUrl}`);
          } else {
            setUserAvatar(default_avt);
          }
        } catch (error) {
          console.error("Error fetching user avatar:", error);
          setUserAvatar(default_avt); // Fallback to default avatar if error occurs
        }
      };

      fetchUserAvatar();
    }
  }, [userId]);

  return (
    <>
      <nav className="bg-gradient-to-r from-stone-300 via-stone-200 to-stone-300 dark:bg-gradient-to-r dark:from-stone-900 dark:via-stone-700 dark:to-stone-900">
        <div className="flex justify-between items-center mx-auto p-1">
          <Link
            to="/"
            className="flex items-center space-x-1 rtl:space-x-reverse">
            <img src={fullLogo} className=" md:block h-8" alt="GO Logo" />
            <div className="hidden md:block text-black dark:text-white text-xs font-bold">
              English <br />
              for Education
            </div>
          </Link>

          {/* <div className="md:flex md:items-center md:space-x-4"> */}

          {/* <div className="hidden relative md:block">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none p-1">
              <MdSearch className=" w-4 h-4 text-black dark:text-white" />
            </div>
            <input
              type="text"
              id="search-navbar"
              className="block w-full p-2 ps-10 text-sm text-black border border-stone-600 rounded-lg bg-stone-200 focus:ring-red-900 focus:border-blue-500 dark:bg-stone-800 dark:border-stone-600 dark:placeholder-stone-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-red-500"
              placeholder="Search..."
            />
          </div> */}

          <div className="hidden relative md:block">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none p-1">
              <span className="text-sm font-extrabold dark:text-stone-200 p-1 text-nowrap uppercase">Hi {userRole}!</span>
              <div />
            </div>
          </div>

          {/* ********************** */}

          <div className="flex items-center md:flex md:items-center space-x-2 md:space-x-2">
            {/* Button with message link */}
            <button className="rounded-full p-2 bg-stone-100 dark:bg-stone-700 focus:outline-none">
              <Link to="message">
                <TbMessage size={16} className="dark:text-white" />
              </Link>
            </button>

            {/* Language component */}
            <Language />

            {/* DarkMode component */}
            <DarkMode />

            {/* Avatar button with dropdown */}
            <div className="relative">
              <button
                className="rounded-full p-0 bg-stone-100 dark:bg-stone-700 focus:outline-none flex items-center justify-center"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent event propagation
                  toggleAvatarDropdown();
                }}>
                <img
                  src={userAvatar}
                  alt="User Avatar"
                  className="rounded-full"
                  style={{ width: "32px", height: "32px" }}
                />
              </button>

              {/* Avatar dropdown menu */}
              {isAvatarDropdownOpen && (
                <div ref={avatarDropdownRef}>
                  <ProfileMenu
                    onClose={toggleAvatarDropdown}
                    size={20}
                    className="dark:text-white"
                  />
                </div>
              )}
            </div>

            <button
              type="button"
              aria-controls="navbar-search"
              aria-expanded={isSidebarOpen}
              className="md:hidden rounded-full p-2 bg-stone-100 dark:bg-stone-700 focus:outline-none"
              onClick={toggleSidebar}>
              <MdMenu className="w-5 h-5" />
              <span className="sr-only">Toggle sidebar</span>
            </button>
          </div>
        </div>
      </nav>

      <div
        className={`fixed inset-0 z-30 transition-transform duration-300 ${isSidebarOpen
          ? "transform translate-x-0"
          : "transform -translate-x-full"
          }`}
        onClick={toggleSidebar}>
        <div className="fixed inset-0 bg-stone-600 bg-opacity-50"></div>
        <div className="fixed inset-y-0 left-0 bg-stone-100 dark:bg-stone-900">
          {userRole === "Head" && <HeadSidebar className="block" />}
          {userRole === "Teacher" && <TeacherSidebar className="block" />}
          {userRole === "Student" && <StudentSidebar className="block" />}

        </div>
      </div>
    </>
  );
};

export default Header;
