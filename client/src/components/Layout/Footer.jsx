import React from "react";

const Footer = () => {
  return (
    <footer
      className={`bg-gradient-to-r from-stone-300 via-stone-200 to-stone-300 dark:bg-gradient-to-r dark:from-stone-900 dark:via-stone-700 dark:to-stone-900`}>
      <div className="flex justify-between items-center mx-auto p-1">
        <p className="m-3">Footer content goes here</p>
      </div>
    </footer>
  );
};

export default Footer;
