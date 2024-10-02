// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { IoMdSearch } from "react-icons/io";
import { FiFilter } from "react-icons/fi";
import ImgCard from "../../../../../assets/Image/Exam_test.png";
import { MdTimer } from "react-icons/md";
import { MdClass } from "react-icons/md";

import axios from "axios";

// URL de ket noi qua server
axios.defaults.baseURL = "http://localhost:8000/";

const ExamWareHouse = () => {

  const [isOpen, setIsOpen] = useState(false);

  // Show ExamList
  const [ExamList, setExamList] = useState([]);

  const getDataFromServer = async () => {
    const dataGetServer = await axios.get("/api/exam");
    console.log("dataGetServer", dataGetServer)

    if (dataGetServer.status === 200) {
      setExamList(dataGetServer.data);
    }
  };
  useEffect(() => {
    getDataFromServer();
  }, []);

  console.log("ExamList", ExamList)

  return (
    <>
      <div className="contentHistory flex flex-col shadow-top pt-5">
        {/* Filter */}
        <div className="filterContainer w-full flex bg-white py-5">
          <div className="relative z-0 w-full group flex items-center justify-end">
            <div className="searchContainer flex w-[30%]">
              <input
                type="text"
                name="floating_text"
                id="floating_text"
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
                required
              />
              <button type="button">
                <IoMdSearch />
              </button>
              <label
                htmlFor="floating_text"
                className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-35 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
              >
                Tìm kiếm
              </label>
            </div>
            <div className="filterContent flex items-center ml-5">
              <button
                onClick={() => setIsOpen((prev) => !prev)}
                type="button"
                className="flex mt-2.5 items-center justify-center text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
              >
                <span className="mr-2">Lọc</span>
                <FiFilter />
              </button>
              {isOpen && (
                <div className="dropdownFilter w-64 h-40 border-2 border-gray-500 bg-white absolute mt-60 right-0 shadow-xl rounded-md p-2 ">
                  <div className="list-none text-sm flex flex-col gap-2 w-full">
                    <li className="flex items-center justify-between px-1">
                      <span className="font-bold">Thời gian:</span>
                      <input type="date"></input>
                    </li>
                    <li className="itemsFilter">Dễ</li>
                    <li className="itemsFilter">Trung Bình</li>
                    <li className="itemsFilter">Khó</li>
                  </div>
                  <div className="buttonFilter flex justify-end">
                    <button
                      className="font-bold flex mt-3 items-center justify-center text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 rounded-lg text-sm px-2.5 pb-1 mb-1 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                      type="button"
                    >
                      Lọc
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        {/* Card History*/}
        <div className="cardContentContainer w-full bg-white flex flex-col gap-5 py-5">
          {/*================================= Item Exam List =================================*/}
          {ExamList.map((exam, indexExam) => (
            <div key={indexExam} className="items-exam">
              <div className="w-full h-[300px] flex bg-white border border-gray-200 rounded-lg shadow-2xl dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-200">
                <div className="w-[30%] h-[100%] overflow-hidden">
                  <Link to="">
                    <img className="rounded-t-lg" src={ImgCard} alt="" />
                  </Link>
                </div>
                <div className="p-5 w-[70%] h-full flex flex-wrap">
                  <div className="w-full h-2/7 overflow-hidden text-ellipsisTitle">
                    <Link to="">
                      <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                        <span className="free">FREE</span>
                        {exam.titleExam}
                      </h5>
                    </Link>
                  </div>
                  <div className="w-full h-2/7 overflow-hidden text-ellipsis">
                    <p className="mb-3 text-sm text-gray-700 dark:text-gray-400 text-ellipsis">
                      {exam.description}
                    </p>
                  </div>
                  <div className="w-full h-2/7 grid grid-cols-6">
                    <div className="peopleJoin flex items-center gap-2 col-start-1 col-end-3">
                      <MdClass />
                      <span className="count text-sm">{exam.classExam}</span>
                    </div>
                    <div className="startEvaluate py-2 col-end-7 col-span-2">
                      <div className="flex items-center justify-end">
                        <svg
                          className="w-4 h-4 text-yellow-300 me-1"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 22 20"
                        >
                          <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                        </svg>
                        <svg
                          className="w-4 h-4 text-yellow-300 me-1"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 22 20"
                        >
                          <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                        </svg>
                        <svg
                          className="w-4 h-4 text-yellow-300 me-1"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 22 20"
                        >
                          <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                        </svg>
                        <svg
                          className="w-4 h-4 text-yellow-300 me-1"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 22 20"
                        >
                          <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                        </svg>
                        <svg
                          className="w-4 h-4 text-gray-300 me-1 dark:text-gray-500"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 22 20"
                        >
                          <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                        </svg>
                        <p className="ms-1 text-sm font-medium text-gray-500 dark:text-gray-400">
                          4.5
                        </p>
                        <p className="ms-1 text-sm font-medium text-gray-500 dark:text-gray-400">
                          of
                        </p>
                        <p className="ms-1 text-sm font-medium text-gray-500 dark:text-gray-400">
                          5
                        </p>
                      </div>
                    </div>
                    <div className="priceProduct py-1 col-start-1 col-end-7">
                      <div className="flex justify-start items-center gap-2">
                        <MdTimer />
                        <p>{exam.time}</p>
                      </div>
                    </div>
                  </div>

                  {/* Button Chi tiet */}
                  <div className="w-full h-1/7 flex items-center justify-end">
                    <Link
                      /* onClick={() => handleExamID(exam._id)} */
                      to={`/teacher/exam/${exam._id}`}
                      className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    >
                      Chi tiết
                      <svg
                        className="rtl:rotate-180 w-3.5 h-3.5 ms-2"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 14 10"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M1 5h12m0 0L9 1m4 4L9 9"
                        />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        
      </div>
    </>
  );
};

export default ExamWareHouse;
