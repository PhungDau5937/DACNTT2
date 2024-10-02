import React from "react";

const TitleExam = ({ examForm, handleChangeExamForm }) => {

  return (
    <div className="titleExam">
      <div className="relative z-0 w-full mb-5 group">
        <input
          type="text"
          id="title-Exam"
          className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
          name="titleExam"
          value={examForm.titleExam}
          onChange={handleChangeExamForm}
          required
        />
        <label
          htmlFor="title-Exam"
          className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
        >
          Tên đề thi <span className="text-red-500">*</span>
        </label>
      </div>
      <div className="grid md:grid-cols-2 md:gap-6">
        <div className="z-0 w-full mb-5 group">
          <label
            htmlFor="countries"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Chọn Lớp học: <span className="text-red-500">*</span>
          </label>
          <select
            id="countries"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            name="classExam"
            value={examForm.classExam}
            onChange={handleChangeExamForm}
          >
            <option value="10">Tiếng anh lớp 10</option>
            <option value="11">Tiếng anh lớp 11</option>
            <option value="12">Tiếng anh lớp 12</option>
          </select>
        </div>
        <div className="relative z-0 w-full mb-5 group">
          <label
            htmlFor="countries"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Chọn thời gian: <span className="text-red-500">*</span>
          </label>
          <select 
            id="countries"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            name="time"
            value={examForm.time}
            onChange={handleChangeExamForm}
          >
            <option value="Miệng">Miệng</option>
            <option value="15 phút">15 phút</option>
            <option value="45 phút">45 phút</option>
            <option value="Giữa kỳ">Giữa kỳ</option>
            <option value="Cuối kỳ">Cuối kỳ</option>
          </select>
        </div>
      </div>
      <div className="relative z-0 w-full mb-5 group">
        <input
          type="text"
          id="floating_repeat_text_point"
          className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
          name="score"
          value="10"
          readOnly
          required
        />
        <label
          htmlFor="floating_repeat_text_point"
          className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
          Thang điểm <span className="text-red-500">*</span>
        </label>
      </div>
      <div className="z-0 w-full mb-5 group">
        <label
          htmlFor="message"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          Mô tả:
        </label>
        <textarea
          id="message"
          rows="4"
          className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Viết mô tả cho đề thi...."
          name="description"
          value={examForm.description}
          onChange={handleChangeExamForm}
        ></textarea>
      </div>
    </div>
  );
};

export default TitleExam;
