// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MdSearch } from "react-icons/md";
import { FaPlusCircle } from "react-icons/fa";
/* import { FiFilter } from "react-icons/fi"; */
import { HiPencilAlt } from "react-icons/hi";
import { MdDelete } from "react-icons/md";
import { IoMdArrowRoundBack } from "react-icons/io";
import { TbListDetails } from "react-icons/tb";
import ExamUpdate from "./ExamUpdate/ExamUpdate"; // import để chuyển Exam có Id tương ứng từ client
import removeAccents from "remove-accents"; // Thư viên loại bỏ dấu khi search

import axios from "axios";
// URL de ket noi qua server
axios.defaults.baseURL = "http://localhost:8000/";

const ExamWareHouse = () => {
  // Search Exam
  const [searchQuery, setSearchQuery] = useState(""); // Search state
  const [filteredExamList, setFilteredExamList] = useState([]); // Filtered list

  /*  const [isOpen, setIsOpen] = useState(false); */

  // Show ExamList
  const [ExamList, setExamList] = useState([]);

  // Hàm lấy dữ liệu Exam từ server
  const getDataFromServer = async () => {
    const userId = localStorage.getItem("username"); // Sửa từ localStore thành localStorage
    try {
      // Gửi yêu cầu để lấy bài thi theo teacherID
      const response = await axios.get("teacher/exam", { params: { teacherID: userId } });
      console.log("Full response:", response); // Log toàn bộ phản hồi

      const dataGetServer = response.data;
      console.log("Data from server:", dataGetServer); // Log dữ liệu từ server

      if (Array.isArray(dataGetServer) && dataGetServer.length > 0) {
        setExamList(dataGetServer);
        setFilteredExamList(dataGetServer); // Tạo danh sách đã search
      } else {
        console.error(
          "Server response does not contain a valid exam list:",
          dataGetServer
        );
      }
    } catch (error) {
      console.error("Error fetching data from server:", error);
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
        console.error("Response headers:", error.response.headers);
      }
    }
  };

  useEffect(() => {
    getDataFromServer();
  }, []);

  // search
  useEffect(() => {
    // Filter exams based on search query
    const normalizedSearchQuery = removeAccents(searchQuery.toLowerCase());
    const filtered = ExamList.filter(
      (exam) =>
        removeAccents(exam.titleExam.toLowerCase()).includes(
          normalizedSearchQuery
        ) ||
        removeAccents(exam.description.toLowerCase()).includes(
          normalizedSearchQuery
        ) ||
        removeAccents(exam.time.toLowerCase()).includes(normalizedSearchQuery)
    );
    setFilteredExamList(filtered);
  }, [searchQuery, ExamList]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const toggleExamStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'public' ? 'private' : 'public';
    try {
      await axios.put(`http://localhost:8000/teacher/updateexamstatus/${id}`, { status: newStatus });
      alert(`Exam status updated to ${newStatus}`);
      getDataFromServer(); // Lấy lại dữ liệu sau khi cập nhật
    } catch (error) {
      console.error("Error updating exam status:", error);
    }
  };

  /* button Update */
  // Button xem Chi tiet tung Exam
  const [showDiv, setShowDiv] = useState(false);
  const [moveDiv, setMoveDiv] = useState(false);

  const handleShowDiv = () => {
    setShowDiv(true);
    setMoveDiv(true);
  };

  // Ẩn xem trước Update Form
  const handleHideDiv = () => {
    setMoveDiv(false);
    setTimeout(() => {
      setShowDiv(false);
    }, 500); // Thời gian delay phải khớp với thời gian animation
  };

  // Data cua tung ID Exam cần Update
  const [examForID, setExamForID] = useState();

  // function lay id khi click chi tiet Exam
  const handleExamIDUpdate = (id) => {
    let dataForID;
    ExamList.map((exam) => {
      if (id === exam._id) {
        console.log("Exam tuong ung:", exam);
        dataForID = exam;
      }
      return dataForID;
    });
    setExamForID(dataForID);

    handleShowDiv();

    console.log("Dau ra: ", dataForID);
  };

  // button delete
  const deteleExam = async (id) => {
    const dataDelete = await axios.delete("teacher/delete/" + id);
    console.log(dataDelete);
    alert("Xoa thanh cong Exam!");
    getDataFromServer(); // reset lai table show
  };



  return (
    <>
      <div className="container mx-auto p-6 bg-white shadow rounded-lg min-h-96 dark:bg-stone-800">
        <header className="flex flex-col sm:flex-row justify-between items-end pb-4 border-b border-stone-300">
          <div className="mb-4 sm:mb-0">
            <h1 className="text-2xl font-bold dark:text-white">Exams Table</h1>
            <p className="text-sm text-stone-600 dark:text-white pr-4">
              A list of all exams in your account including their name, title,
              time, description, ...
            </p>
          </div>
          {/* <SearchBar searchTerm={searchTerm} handleSearch={handleSearch} /> */}
          <div className="relative">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none p-1">
              <MdSearch className="w-5 h-5 text-stone-400 dark:text-stone-300" />
            </div>
            <input
              type="text"
              name="search_text"
              id="floating_text"
              className="block w-full p-2 ps-10 text-sm text-black border border-stone-600 rounded-lg bg-stone-100 focus:ring-red-900 focus:border-blue-500 dark:bg-stone-800 dark:border-stone-600 dark:placeholder-stone-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-red-500"
              placeholder="Search for exam"
              value={searchQuery}
              onChange={handleSearchChange}
              required
            />
          </div>

        </header>


        {/* Table List Exam Teacher */}
        <p className="text-sm text-stone-600 dark:text-white pb-4">
          <span className='font-bold'></span>{" "}
          { }
        </p>
        <div className="relative overflow-x-auto shadow rounded-lg">
          <table className="w-full text-sm text-left rtl:text-right text-black dark:text-white">
            <thead className="text-xs uppercase bg-stone-200 dark:bg-stone-700 dark:text-white">
              <tr>
                <th scope="col" className="px-6 py-3 whitespace-nowrap">STT</th>
                <th scope="col" className="px-6 py-3 whitespace-nowrap">Tiêu đề</th>
                <th scope="col" className="px-6 py-3 whitespace-nowrap">Mô tả</th>
                <th scope="col" className="px-6 py-3 whitespace-nowrap">Lớp</th>
                <th scope="col" className="px-6 py-3 whitespace-nowrap">Thời gian</th>
                <th scope="col" className="px-6 py-3 whitespace-nowrap">Thang điểm</th>
                <th scope="col" className="px-6 py-3 whitespace-nowrap">Tùy chỉnh</th>
                <th scope="col" className="px-6 py-3 whitespace-nowrap">Chia sẻ</th>

              </tr>
            </thead>

            <tbody className="text-sm">
              {filteredExamList.length !== 0 ? (
                filteredExamList.map((exam, indexExam) => (
                  <tr key={indexExam} className="even:bg-stone-100 odd:bg-white dark:even:bg-stone-800 dark:odd:bg-stone-900 border-b dark:border-stone-700">
                    <td className="px-6 py-1 text-xs whitespace-nowrap">{indexExam + 1}</td>
                    <td className="px-6 py-1 text-xs whitespace-nowrap">{exam.titleExam}</td>
                    <td className="px-6 py-1 text-xs min-w-60" title={exam.description}>{exam.description}</td>
                    <td className="px-6 py-1 text-xs whitespace-nowrap">{exam.classExam}</td>
                    <td className="px-6 py-1 text-xs whitespace-nowrap">{exam.time}</td>
                    <td className="px-6 py-1 text-xs whitespace-nowrap">10</td>
                    <td className="px-6 py-1 text-xs whitespace-nowrap grid-center space-x-2">
                    {/* Button Update */}
                      <button
                        type="button"
                        onClick={() => handleExamIDUpdate(exam._id)}
                        className="text-white  bg-yellow-500 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-400 font-medium rounded-lg text-xs px-3 py-2 transition duration-200 ease-in-out dark:bg-yellow-400 dark:hover:bg-yellow-500 dark:focus:ring-yellow-600">
                        <HiPencilAlt size={18} />
                      </button>

                      {/* Button Detail */}
                      <button
                        type="button"
                        className="text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 font-medium rounded-lg text-xs px-3 py-2 transition duration-200 ease-in-out dark:bg-green-500 dark:hover:bg-green-600 dark:focus:ring-green-700">
                        <Link to={`/teacher/exam/${exam._id}`}>
                          <TbListDetails size={18}/>
                        </Link>
                      </button>

                      {/* Button Delete */}
                      <button
                        type="button"
                        onClick={() => deteleExam(exam._id)}
                        className="text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400 font-medium rounded-lg text-xs px-3 py-2 transition duration-200 ease-in-out dark:bg-red-500 dark:hover:bg-red-600 dark:focus:ring-red-700">
                        <MdDelete size={18} />
                      </button>
                    </td>
                    <td className="px-6 py-1 text-xs whitespace-nowrap">
                      {/* Button Delete */}
                      <div className="mt-2">
                        <label className="inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={exam.status === 'public'}
                            onChange={() => toggleExamStatus(exam._id, exam.status)}
                            className="sr-only peer"
                          />
                          <div className="relative w-11 h-6 bg-stone-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-stone-600 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-stone-600 peer-checked:bg-blue-600"></div>
                          <span className="ms-3 text-sm font-medium text-stone-900 dark:text-stone-300">Kích hoạt</span>
                        </label>
                      </div>
                    </td>
                  </tr>

                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-4 text-stone-500 dark:text-stone-400">No Data</td>
                </tr>
              )}
            </tbody>
          </table>


        </div>
        <div className="flex justify-center p-4">
          <div className="flex items-center border border-stone-300 rounded-lg shadow dark:border-stone-600 dark:shadow">
            <button
              type="button"
              className="px-4 py-2 text-sm font-semibold text-stone-700 bg-white border-r border-stone-300 rounded-l-lg hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-stone-300 dark:bg-stone-800 dark:border-stone-600 dark:hover:bg-stone-700 dark:focus:ring-blue-500">
              Previous
            </button>
            <button
              type="button"
              className="px-4 py-2 text-sm font-semibold text-stone-700 bg-white rounded-r-lg hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-stone-300 dark:bg-stone-800 dark:border-stone-600 dark:hover:bg-stone-700 dark:focus:ring-blue-500">
              Next
            </button>
          </div>
        </div>
      </div>


      {/* Show Form Update */}
      {showDiv && (
        <div className={`preview-div flex-col ${moveDiv ? "move" : ""}`}>
          {/* Button Close page preview */}
          <div className="buttonBackPage flex items-center justify-center bg-green-500 py-2">
            {/* Button back */}
            <div className="button-close relative group cursor-pointer hover:bg-white w-[40px] h-[40px] flex items-center justify-center p-1 rounded-full">
              <button onClick={handleHideDiv} type="button" className="">
                <IoMdArrowRoundBack size={25} />
              </button>
              <div className="absolute shadow hidden group-hover:block bg-[#333] text-white font-semibold px-1 text-[10px] left-full ml-2 top-0 bottom-0 my-auto h-max w-max rounded before:w-2 before:h-2 before:rotate-45 before:bg-[#333] before:absolute before:z-[-1] before:bottom-0 before:top-0 before:my-auto before:-left-1 before:mx-auto">
                Go back
              </div>
            </div>
            {/* Time */}
            <div className="w-full flex items-center justify-center gap-2 py-1">
              <h2 className="text-2xl font-bold">
                {`UPDATE EXAM: `}
                {examForID.titleExam}
              </h2>
            </div>
          </div>
          {/* Preview Exam */}
          <div className="containerPreviewExam mt-5">
            <form className="formExam w-full mx-auto" /* onSubmit={sendData} */>
              <ExamUpdate
                examForID={
                  examForID
                } /* examForID: data có ID Exam cần Update tương ứng */
              />
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default ExamWareHouse;
