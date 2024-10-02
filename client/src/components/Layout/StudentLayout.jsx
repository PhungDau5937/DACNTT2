import React from "react";
import Header from "./Header.jsx";
// import Footer from "./Footer.jsx";
import Sidebar from '../Sidebar/StudentSidebar.jsx';
import Breadcrumb from "./Breadcrumb.jsx";

const HeadLayout = ({ children }) => {
  const responsiveClass = "hidden md:flex";
  return (
    <div className="flex flex-col min-h-screen bg-stone-100 dark:text-white dark:bg-stone-900 max-w-full overflow-x-hidden">
      <Header className="shadow-inner" />
      <div className="flex flex-1">
        <Sidebar responsiveClass={responsiveClass} />
        <main className="flex-1 p-4 text-black overflow-hidden">
          <Breadcrumb/>
          {children}
        </main>
      </div>
      {/* <Footer /> */}
    </div>
  );
};

export default HeadLayout;

