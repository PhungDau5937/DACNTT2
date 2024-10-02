// Language.js
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleLanguage } from "../../Redux/Language/languageSlice"; // Import hành động toggleLanguage
import { TbSquareRoundedLetterE, TbSquareRoundedLetterV } from "react-icons/tb";


const Language = () => {
  const dispatch = useDispatch();
  const language = useSelector((state) => state.language.language);

  const handleToggleLanguage = () => {
    dispatch(toggleLanguage());
  };

  return (
    <button
      // className="rounded-full p-2 bg-gray-100 dark:bg-gray-800 focus:outline-none hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-150"
      className="rounded-full p-2 bg-stone-100 dark:bg-stone-700 focus:outline-none"
      onClick={handleToggleLanguage}>
      {language === "vi" ? (
        <TbSquareRoundedLetterV size={17} className="dark:text-stone-300" />
      ) : (
        <TbSquareRoundedLetterE size={17} className="dark:text-stone-300" />
      )}
    </button>
  );
};

export default Language;
