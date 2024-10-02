// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Link } from "react-router-dom";
import ImgCard from "../../../../../assets/Image/Exam_test.png";
import { FaPeopleGroup } from "react-icons/fa6";
import { FaPlusCircle } from "react-icons/fa";

const ExamLibraryQuestion = () => {
  return (
    <>
        <div className="ContentLibrary flex px-40 shadow-top pt-10">
            <div className="wrapperContainer flex flex-col w-full items-center">
              {/* Button Create Exam */}
              <div className="flex w-full justify-end">
                <Link to="/teacher/exam/createExam"><button className="flex bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full items-center" type="button">Tạo đề tiếng anh <FaPlusCircle className='ml-2 text-4xl py-1 font-bold' /></button></Link>
              </div>
              {/* Title Card prepare*/}
              <div className="titleCard font-bold w-full border-b-2 pb-5">
                <h2>Đang diễn ra</h2>
              </div>
              {/* Card prepare*/}
              <div className="cardContentContainer w-full  bg-white flex flex-wrap gap-5 py-3">
                <div className="w-1/3 h-[500px] max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                    <div className="w-full h-[40%] overflow-hidden">
                      <Link to="">
                          <img className="rounded-t-lg" src={ImgCard} alt="" /> 
                      </Link>
                    </div>
                    <div className="p-5 h-[60%] flex flex-col flex-wrap">
                      <div className="w-full h-2/7 overflow-hidden text-ellipsisTitle"> 
                        <Link to="">
                            <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white"><span className="free">FREE</span>Đề thi tiếng anh lớp 10 THPT Quốc Gia</h5>
                        </Link>
                      </div>
                      <div className="w-full h-2/7 overflow-hidden text-ellipsis">
                        <p className="mb-3 text-sm text-gray-700 dark:text-gray-400 text-ellipsis">Đề bao gồm các đề thi tiếng anh trong học kỳ của các trường THPT top 1 trong thành phố Hồ Chí Minh. Đề gồm nhiều bài thi hay và chi tiết cho học sinh có ý định ôn thi chuyển cấp từ 2 lên 3.</p>
                      </div>
                      <div className="w-full h-2/7 grid grid-cols-6">
                        <div className="peopleJoin flex items-center gap-2 col-start-1 col-end-3">
                          <FaPeopleGroup />
                          <span className="count text-sm">100</span>
                        </div>
                        <div className="startEvaluate py-2 col-end-7 col-span-2">
                            <div className="flex items-center">
                                <svg className="w-4 h-4 text-yellow-300 me-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
                                    <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"/>
                                </svg>
                                <svg className="w-4 h-4 text-yellow-300 me-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
                                    <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"/>
                                </svg>
                                <svg className="w-4 h-4 text-yellow-300 me-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
                                    <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"/>
                                </svg>
                                <svg className="w-4 h-4 text-yellow-300 me-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
                                    <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"/>
                                </svg>
                                <svg className="w-4 h-4 text-gray-300 me-1 dark:text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
                                    <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"/>
                                </svg>
                                <p className="ms-1 text-sm font-medium text-gray-500 dark:text-gray-400">4.5</p>
                                <p className="ms-1 text-sm font-medium text-gray-500 dark:text-gray-400">of</p>
                                <p className="ms-1 text-sm font-medium text-gray-500 dark:text-gray-400">5</p>
                            </div>
                        </div>
                        <div className="priceProduct py-1 col-start-1 col-end-7">
                          <div className="flex justify-start items-baseline">
                              <span className="mr-1 text-2xl font-extrabold text-red-600">0 đ</span>
                              <span className="text-gray-500 dark:text-gray-400 text-sm">/exam</span>
                          </div>
                        </div>
                      </div>
                      <div className="w-full h-1/7 flex items-center justify-end">
                        <Link to="" className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                            Chi tiết
                            <svg className="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
                            </svg>
                        </Link>
                      </div>
                    </div>
                </div>
              </div>
              {/* Title Card prepare*/}
              <div className="titleCard font-bold w-full border-b-2 pb-5 pt-10">
                <h2>Đang soạn</h2>
              </div>
              {/* Card prepare*/}
              <div className="cardContentContainer w-full  bg-white flex flex-wrap gap-5 py-3">
                <div className="w-1/3 h-[500px] max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                    <div className="w-full h-[40%] overflow-hidden">
                      <Link to="">
                          <img className="rounded-t-lg" src={ImgCard} alt="" /> 
                      </Link>
                    </div>
                    <div className="p-5 h-[60%] flex flex-col flex-wrap">
                      <div className="w-full h-2/7 overflow-hidden text-ellipsisTitle"> 
                        <Link to="">
                            <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white"><span className="free">FREE</span>Đề thi tiếng anh lớp 10 THPT Quốc Gia</h5>
                        </Link>
                      </div>
                      <div className="w-full h-2/7 overflow-hidden text-ellipsis">
                        <p className="mb-3 text-sm text-gray-700 dark:text-gray-400 text-ellipsis">Đề bao gồm các đề thi tiếng anh trong học kỳ của các trường THPT top 1 trong thành phố Hồ Chí Minh. Đề gồm nhiều bài thi hay và chi tiết cho học sinh có ý định ôn thi chuyển cấp từ 2 lên 3.</p>
                      </div>
                      <div className="w-full h-2/7 grid grid-cols-6">
                        <div className="peopleJoin flex items-center gap-2 col-start-1 col-end-3">
                          <FaPeopleGroup />
                          <span className="count text-sm">100</span>
                        </div>
                        <div className="startEvaluate py-2 col-end-7 col-span-2">
                            <div className="flex items-center">
                                <svg className="w-4 h-4 text-yellow-300 me-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
                                    <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"/>
                                </svg>
                                <svg className="w-4 h-4 text-yellow-300 me-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
                                    <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"/>
                                </svg>
                                <svg className="w-4 h-4 text-yellow-300 me-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
                                    <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"/>
                                </svg>
                                <svg className="w-4 h-4 text-yellow-300 me-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
                                    <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"/>
                                </svg>
                                <svg className="w-4 h-4 text-gray-300 me-1 dark:text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
                                    <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"/>
                                </svg>
                                <p className="ms-1 text-sm font-medium text-gray-500 dark:text-gray-400">4.5</p>
                                <p className="ms-1 text-sm font-medium text-gray-500 dark:text-gray-400">of</p>
                                <p className="ms-1 text-sm font-medium text-gray-500 dark:text-gray-400">5</p>
                            </div>
                        </div>
                        <div className="priceProduct py-1 col-start-1 col-end-7">
                          <div className="flex justify-start items-baseline">
                              <span className="mr-1 text-2xl font-extrabold text-red-600">0 đ</span>
                              <span className="text-gray-500 dark:text-gray-400 text-sm">/exam</span>
                          </div>
                        </div>
                      </div>
                      <div className="w-full h-1/7 flex items-center justify-end">
                        <Link to="" className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                            Chi tiết
                            <svg className="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
                            </svg>
                        </Link>
                      </div>
                    </div>
                </div>
                <div className="w-1/3 h-[500px] max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                    <div className="w-full h-[40%] overflow-hidden">
                      <Link to="">
                          <img className="rounded-t-lg" src={ImgCard} alt="" /> 
                      </Link>
                    </div>
                    <div className="p-5 h-[60%] flex flex-col flex-wrap">
                      <div className="w-full h-2/7 overflow-hidden text-ellipsisTitle"> 
                        <Link to="">
                            <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white"><span className="vip">VIP</span>Đề thi tiếng anh lớp 10 THPT Quốc Gia</h5>
                        </Link>
                      </div>
                      <div className="w-full h-2/7 overflow-hidden text-ellipsis">
                        <p className="mb-3 text-sm text-gray-700 dark:text-gray-400 text-ellipsis">Đề bao gồm các đề thi tiếng anh trong học kỳ của các trường THPT top 1 trong thành phố Hồ Chí Minh. Đề gồm nhiều bài thi hay và chi tiết cho học sinh có ý định ôn thi chuyển cấp từ 2 lên 3.</p>
                      </div>
                      <div className="w-full h-2/7 grid grid-cols-6">
                        <div className="peopleJoin flex items-center gap-2 col-start-1 col-end-3">
                          <FaPeopleGroup />
                          <span className="count text-sm">100</span>
                        </div>
                        <div className="startEvaluate py-2 col-end-7 col-span-2">
                            <div className="flex items-center">
                                <svg className="w-4 h-4 text-yellow-300 me-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
                                    <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"/>
                                </svg>
                                <svg className="w-4 h-4 text-yellow-300 me-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
                                    <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"/>
                                </svg>
                                <svg className="w-4 h-4 text-yellow-300 me-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
                                    <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"/>
                                </svg>
                                <svg className="w-4 h-4 text-yellow-300 me-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
                                    <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"/>
                                </svg>
                                <svg className="w-4 h-4 text-gray-300 me-1 dark:text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
                                    <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"/>
                                </svg>
                                <p className="ms-1 text-sm font-medium text-gray-500 dark:text-gray-400">4.5</p>
                                <p className="ms-1 text-sm font-medium text-gray-500 dark:text-gray-400">of</p>
                                <p className="ms-1 text-sm font-medium text-gray-500 dark:text-gray-400">5</p>
                            </div>
                        </div>
                        <div className="priceProduct py-1 col-start-1 col-end-7">
                          <div className="flex justify-start items-baseline">
                              <span className="mr-1 text-2xl font-extrabold text-red-600">100.000 vnđ</span>
                              <span className="text-gray-500 dark:text-gray-400 text-sm">/exam</span>
                          </div>
                        </div>
                      </div>
                      <div className="w-full h-1/7 flex items-center justify-end">
                        <Link to="" className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                            Chi tiết
                            <svg className="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
                            </svg>
                        </Link>
                      </div>
                    </div>
                </div>
                <div className="w-1/3 h-[500px] max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                    <div className="w-full h-[40%] overflow-hidden">
                      <Link to="">
                          <img className="rounded-t-lg" src={ImgCard} alt="" /> 
                      </Link>
                    </div>
                    <div className="p-5 h-[60%] flex flex-col flex-wrap">
                      <div className="w-full h-2/7 overflow-hidden text-ellipsisTitle"> 
                        <Link to="">
                            <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white"><span className="vip">VIP</span>Đề thi tiếng anh lớp 10 THPT Quốc Gia</h5>
                        </Link>
                      </div>
                      <div className="w-full h-2/7 overflow-hidden text-ellipsis">
                        <p className="mb-3 text-sm text-gray-700 dark:text-gray-400 text-ellipsis">Đề bao gồm các đề thi tiếng anh trong học kỳ của các trường THPT top 1 trong thành phố Hồ Chí Minh. Đề gồm nhiều bài thi hay và chi tiết cho học sinh có ý định ôn thi chuyển cấp từ 2 lên 3.</p>
                      </div>
                      <div className="w-full h-2/7 grid grid-cols-6">
                        <div className="peopleJoin flex items-center gap-2 col-start-1 col-end-3">
                          <FaPeopleGroup />
                          <span className="count text-sm">100</span>
                        </div>
                        <div className="startEvaluate py-2 col-end-7 col-span-2">
                            <div className="flex items-center">
                                <svg className="w-4 h-4 text-yellow-300 me-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
                                    <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"/>
                                </svg>
                                <svg className="w-4 h-4 text-yellow-300 me-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
                                    <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"/>
                                </svg>
                                <svg className="w-4 h-4 text-yellow-300 me-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
                                    <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"/>
                                </svg>
                                <svg className="w-4 h-4 text-yellow-300 me-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
                                    <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"/>
                                </svg>
                                <svg className="w-4 h-4 text-gray-300 me-1 dark:text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
                                    <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"/>
                                </svg>
                                <p className="ms-1 text-sm font-medium text-gray-500 dark:text-gray-400">4.5</p>
                                <p className="ms-1 text-sm font-medium text-gray-500 dark:text-gray-400">of</p>
                                <p className="ms-1 text-sm font-medium text-gray-500 dark:text-gray-400">5</p>
                            </div>
                        </div>
                        <div className="priceProduct py-1 col-start-1 col-end-7">
                          <div className="flex justify-start items-baseline">
                              <span className="mr-1 text-2xl font-extrabold text-red-600">100.000 vnđ</span>
                              <span className="text-gray-500 dark:text-gray-400 text-sm">/exam</span>
                          </div>
                        </div>
                      </div>
                      <div className="w-full h-1/7 flex items-center justify-end">
                        <Link to="" className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                            Chi tiết
                            <svg className="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
                            </svg>
                        </Link>
                      </div>
                    </div>
                </div>
                <div className="w-1/3 h-[500px] max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                    <div className="w-full h-[40%] overflow-hidden">
                      <Link to="">
                          <img className="rounded-t-lg" src={ImgCard} alt="" /> 
                      </Link>
                    </div>
                    <div className="p-5 h-[60%] flex flex-col flex-wrap">
                      <div className="w-full h-2/7 overflow-hidden text-ellipsisTitle"> 
                        <Link to="">
                            <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white"><span className="vip">VIP</span>Đề thi tiếng anh lớp 10 THPT Quốc Gia</h5>
                        </Link>
                      </div>
                      <div className="w-full h-2/7 overflow-hidden text-ellipsis">
                        <p className="mb-3 text-sm text-gray-700 dark:text-gray-400 text-ellipsis">Đề bao gồm các đề thi tiếng anh trong học kỳ của các trường THPT top 1 trong thành phố Hồ Chí Minh. Đề gồm nhiều bài thi hay và chi tiết cho học sinh có ý định ôn thi chuyển cấp từ 2 lên 3.</p>
                      </div>
                      <div className="w-full h-2/7 grid grid-cols-6">
                        <div className="peopleJoin flex items-center gap-2 col-start-1 col-end-3">
                          <FaPeopleGroup />
                          <span className="count text-sm">100</span>
                        </div>
                        <div className="startEvaluate py-2 col-end-7 col-span-2">
                            <div className="flex items-center">
                                <svg className="w-4 h-4 text-yellow-300 me-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
                                    <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"/>
                                </svg>
                                <svg className="w-4 h-4 text-yellow-300 me-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
                                    <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"/>
                                </svg>
                                <svg className="w-4 h-4 text-yellow-300 me-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
                                    <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"/>
                                </svg>
                                <svg className="w-4 h-4 text-yellow-300 me-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
                                    <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"/>
                                </svg>
                                <svg className="w-4 h-4 text-gray-300 me-1 dark:text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
                                    <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"/>
                                </svg>
                                <p className="ms-1 text-sm font-medium text-gray-500 dark:text-gray-400">4.5</p>
                                <p className="ms-1 text-sm font-medium text-gray-500 dark:text-gray-400">of</p>
                                <p className="ms-1 text-sm font-medium text-gray-500 dark:text-gray-400">5</p>
                            </div>
                        </div>
                        <div className="priceProduct py-1 col-start-1 col-end-7">
                          <div className="flex justify-start items-baseline">
                              <span className="mr-1 text-2xl font-extrabold text-red-600">100.000 vnđ</span>
                              <span className="text-gray-500 dark:text-gray-400 text-sm">/exam</span>
                          </div>
                        </div>
                      </div>
                      <div className="w-full h-1/7 flex items-center justify-end">
                        <Link to="" className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                            Chi tiết
                            <svg className="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
                            </svg>
                        </Link>
                      </div>
                    </div>
                </div>
              </div>
            </div>
        </div>
    </>
  )
}

export default ExamLibraryQuestion