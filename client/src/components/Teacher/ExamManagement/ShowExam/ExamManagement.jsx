// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import HistoryLibraryQuestion from "./HistoryExam/HistoryLibraryQuestion";
import ExamLibraryQuestion from "./LibraryExam/ExamLibraryQuestion";
import NavbarTeacher from "../../../component/navbar/navbarTeacher/navbarTeacher";
import ExamWareHouse from "./WarehouseExam/ExamWareHouse";
// import "./ExamManagement.css";

const ExamManagement = () => {
  const [changeU, setChangeU] = useState("Warehouse");
  const [showContent, setShowContent] = useState("Warehouse");

  const handleClick = (id) => {
    handleUnderline(id);
    handleShowContent(id);
  };
  const handleUnderline = (id) => {
    setChangeU(id);
  };

  const handleShowContent = (id) => {
    setShowContent(id);
  };

  return (
    <>
      <NavbarTeacher />
      <div className="libraryQuestion w-full text-2xl pb-10">
        <div className="titleLibrary pt-5 bg-gray-200 px-40">
          <div className="navbarMenu border-red-600 flex w-full ">
            <ul className="flex cursor-pointer">
              <li
                id="Warehouse"
                className={
                  changeU === "Warehouse" ? "underlinez itemsMenu" : "itemsMenu"
                }
                onClick={() => handleClick("Warehouse")}
              >
                Kho đề thi
              </li>
              <li
                id="Exam"
                className={
                  changeU === "Exam" ? "underlinez itemsMenu" : "itemsMenu"
                }
                onClick={() => handleClick("Exam")}
              >
                Bài Thi
              </li>
              <li
                id="History"
                className={
                  changeU === "History" ? "underlinez itemsMenu" : "itemsMenu"
                }
                onClick={() => handleClick("History")}
              >
                Lịch Sử
              </li>
            </ul>
          </div>
        </div>
        {showContent && (
          <div className="content">
            {showContent === "Exam" ? <ExamLibraryQuestion /> : ""}
            {showContent === "History" ? <HistoryLibraryQuestion /> : ""}
            {showContent === "Warehouse" ? <ExamWareHouse /> : ""}
          </div>
        )}
      </div>
    </>
  );
};

export default ExamManagement;
