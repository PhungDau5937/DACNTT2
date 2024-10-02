import React, { useState, useEffect } from "react";
import ImgWord from "../../../../../../../../../assets/Image/UploadFile/wordIcon.png";
import ImgExcel from "../../../../../../../../../assets/Image/UploadFile/ExcelIcon.png";
import ImgPdf from "../../../../../../../../../assets/Image/UploadFile/PdfIcon.png";
import UploadFileWord from "./UploadFileWord";
import UploadFileExcel from "./UploadFileExcel";
import UploadPdf from "./UploadFilePDF";

import { MdCloudUpload } from "react-icons/md";



const UploadFile = ({ sendDataToExam }) => {
  // State để lưu trữ tên của file được tải lên
  const [fileName, setFileName] = useState("");
  // State bỏ icon tải lên
  const [iconshow, setIconShow] = useState(true);
  const handshowIcon = () => {
    setIconShow(false);
  };

  const [fileType, setFileType] = useState(""); // New state to track the file type

  // State để lưu trữ URL của hình ảnh file được tải lên
  const [fileImageUrl, setFileImageUrl] = useState("");

  // State để lưu trữ file để đưa qua prop con (Word or Excel)
  const [sendFileToChildren, setSendFileToChildren] = useState();

  // Hàm xử lý khi tải file lên
  const handleFileUpload = (event) => {
    const file = event.target.files[0]; // Lấy file đầu tiên từ input
    console.log("file chua gui: ", file);

    if (file) {
      setFileName(file.name); // Đặt state tên file

      // Kiểm tra loại file và đặt URL hình ảnh tương ứng
      const fileExtension = file.name.split(".").pop().toLowerCase();
      if (fileExtension === "doc" || fileExtension === "docx") {
        setFileType("word"); // Set file type to 'word'
        setFileImageUrl(ImgWord); // Đặt đường dẫn tới hình ảnh file Word
      } else if (fileExtension === "xls" || fileExtension === "xlsx") {
        setFileType("excel"); // Set file type to 'excel'
        setFileImageUrl(ImgExcel); // Đặt đường dẫn tới hình ảnh file Excel
      } else if (fileExtension === "pdf") {
        setFileType("pdf"); // Set file type to 'excel'
        setFileImageUrl(ImgPdf); // Đặt đường dẫn tới hình ảnh file Excel
      } else {
        setFileImageUrl(URL.createObjectURL(file)); // Đặt URL hình ảnh của file tải lên nếu không phải Word hoặc Excel
      }

      // Ensure state update before proceeding
      setSendFileToChildren(file); // Chuyển file qua cho UploadFileExcel.jsx xử lý
    }

    handshowIcon(); // ẩn icon upload
  };
  console.log("data send to ulf:", sendDataToExam);

  useEffect(() => {
    if (sendFileToChildren) {
      console.log("File updated:", sendFileToChildren);
    }
  }, [sendFileToChildren]);

return (
    <div className="rounded-lg border-2 border-gray-300 border-dashed mt-6 bg-white dark:bg-stone-800">
      <div className="p-6 min-h-[180px] flex flex-col items-center justify-center text-center cursor-pointer dark:border-stone-600">
        {iconshow && (
          <div className="text-gray-600 dark:text-gray-400">
            
            <MdCloudUpload className="text-4xl text-black dark:text-white" size={40}/>
          </div>
        )}

        {fileName && (
          <div className="mt-4 flex flex-col items-center">
            <img
              src={fileImageUrl}
              alt="Uploaded file"
              className="w-24 h-24 object-cover mb-2"
            />
            <p className="text-gray-700 dark:text-gray-300 text-sm">{fileName}</p>
          </div>
        )}

        {fileType === "word" && sendFileToChildren && (
          <UploadFileWord
            sendDataToExam={sendDataToExam}
            sendFileToChildrenWord={sendFileToChildren}
          />
        )}

        {fileType === "excel" && sendFileToChildren && (
          <UploadFileExcel
            sendDataToExam={sendDataToExam}
            sendFileToChildrenExcel={sendFileToChildren}
          />
        )}

        {fileType === "pdf" && sendFileToChildren && (
          <UploadPdf
            sendDataToExam={sendDataToExam}
            sendFileToChildrenPdf={sendFileToChildren}
          />
        )}

        <h4 htmlFor="chooseFile" className="text-sm text-gray-600 dark:text-gray-400 mt-4">
          Drag & Drop or{" "}
          <label htmlFor="chooseFile" className="text-blue-600 dark:text-blue-400 cursor-pointer font-medium">
            Choose file
          </label>{" "}
          to upload
        </h4>

        
        <input
          onChange={handleFileUpload}
          type="file"
          id="chooseFile"
          
          className="hidden"
        />
      </div>
    </div>
  );
};

export default UploadFile;
