// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import "../ShowExam/ExamManagement.css";
import CreateExamRandom from "./CreateRandom/CreateExamRandom";
import CreateExamUpload from "./CreateUploadFile/CreateExamUpload";


const CreateExamAuto = () => {
  const [changeU, setChangeU] = useState("UploadFile");
  const [showContent, setShowContent] = useState("UploadFile");

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
      <div className="autoCreateExam w-full text-2xl pb-10 mt-20">
        <div className="pt-5 bg-gray-200 px-40">
          <div className="navbarMenu border-red-600 flex w-full ">
            <ul className="flex cursor-pointer">
              <li
                id="UploadFile"
                className={
                  changeU === "UploadFile"
                    ? "underlinez itemsMenu"
                    : "itemsMenu"
                }
                onClick={() => handleClick("UploadFile")}
              >
                Upload File(Word or Excel)
              </li>
              <li
                id="Random"
                className={
                  changeU === "Random" ? "underlinez itemsMenu" : "itemsMenu"
                }
                onClick={() => handleClick("Random")}
              >
                Tạo đề Random
              </li>
            </ul>
          </div>
        </div>

        {showContent && (
          <div className="content">
            {showContent === "UploadFile" ? (
              <>
                <CreateExamUpload />
              </>
            ) : (
              ""
            )}
            {showContent === "Random" ? <CreateExamRandom /> : ""}
          </div>
        )}
      </div>
    </>
  );
};

export default CreateExamAuto;
