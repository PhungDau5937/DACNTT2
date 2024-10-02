import React from "react";
import { useSelector } from "react-redux";

const TitleExam = ({ examForm, handleChangeExamForm, errors }) => {
  // Lấy ngôn ngữ từ localStorage
  const language = useSelector((state) => state.language.language);

  return (
    <div className="titleExam">
      {/* Tên đề thi */}
      <div className="relative z-0 w-full mb-5 group">
        <label
          htmlFor="title-Exam"
          className="block mb-2 text-xs font-medium text-gray-900 dark:text-white"
        >
          {language === 'vi' ? 'Tên đề thi' : 'Exam Title'}
        </label>
        <input
          type="text"
          id="title-Exam"
          className={`block py-2 px-3 w-full text-sm text-gray-900 bg-transparent border border-gray-300 rounded-lg dark:text-white dark:border-gray-600 focus:outline-none focus:ring-0 focus:border-blue-600 dark:focus:border-blue-500 ${errors.titleExam ? "border-red-500 dark:border-red-500" : ""
            }`}
          name="titleExam"
          value={examForm.titleExam}
          onChange={handleChangeExamForm}
          required
        />
      </div>

      {/* Chọn lớp học */}
      <div className="grid md:grid-cols-2 md:gap-6">
        <div className="relative z-0 w-full mb-5 group">
          <label
            htmlFor="classExam"
            className="block mb-2 text-xs font-medium text-gray-900 dark:text-white"
          >
            {language === 'vi' ? 'Chọn Lớp học' : 'Select Class'}
          </label>
          <select
            id="classExam"
            className={`bg-stone-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-stone-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ${errors.classExam ? "border-red-500 dark:border-red-500" : ""
              }`}
            name="classExam"
            value={examForm.classExam}
            onChange={handleChangeExamForm}
          >
            <option value="">-</option>
            <option value="10">
              {language === 'vi' ? 'Tiếng anh lớp 10' : 'English Class 10'}
            </option>
            <option value="11">
              {language === 'vi' ? 'Tiếng anh lớp 11' : 'English Class 11'}
            </option>
            <option value="12">
              {language === 'vi' ? 'Tiếng anh lớp 12' : 'English Class 12'}
            </option>
          </select>
        </div>

        {/* Loại đề thi */}
        <div className="relative z-0 w-full mb-5 group">
          <label
            htmlFor="time"
            className="block mb-2 text-xs font-medium text-gray-900 dark:text-white"
          >
            {language === 'vi' ? 'Loại đề thi' : 'Type of Exam'}
          </label>
          <select
            id="time"
            className={`bg-stone-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-stone-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ${errors.time ? "border-red-500 dark:border-red-500" : ""
              }`}
            name="time"
            value={examForm.time}
            onChange={handleChangeExamForm}
          >
            <option value="">-</option>
            <option value="Miệng">{language === 'vi' ? 'Miệng' : 'Oral'}</option>
            <option value="15 phút">{language === 'vi' ? '15 phút' : '15 minutes'}</option>
            <option value="45 phút">{language === 'vi' ? '45 phút' : '45 minutes'}</option>
            <option value="Giữa kỳ">{language === 'vi' ? 'Giữa kỳ' : 'Mid-term'}</option>
            <option value="Cuối kỳ">{language === 'vi' ? 'Cuối kỳ' : 'Final'}</option>
          </select>
        </div>
      </div>

      {/* Thang điểm */}
      <div className="relative z-0 w-full mb-5 group">
        <label
          htmlFor="score"
          className="block mb-2 text-xs font-medium text-gray-900 dark:text-white"
        >
          {language === 'vi' ? 'Thang điểm' : 'Score'}
        </label>
        <input
          type="text"
          id="score"
          className={`block py-2 px-3 w-full text-sm text-gray-900 bg-transparent border border-gray-300 rounded-lg dark:text-white dark:border-gray-600 focus:outline-none focus:ring-0 focus:border-blue-600 dark:focus:border-blue-500 ${errors.score ? "border-red-500 dark:border-red-500" : ""
            }`}
          name="score"
          value="10"
          readOnly
          required
        />
      </div>

      {/* Mô tả */}
      <div className="relative z-0 w-full mb-5 group">
        <label
          htmlFor="description"
          className="block mb-2 text-xs font-medium text-gray-900 dark:text-white"
        >
          {language === 'vi' ? 'Mô tả:' : 'Description:'}
        </label>
        <textarea
          id="description"
          rows="4"
          className={`block p-2.5 w-full text-sm text-gray-900 bg-stone-50 border border-gray-300 rounded-lg dark:bg-stone-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white focus:ring-blue-500 focus:border-blue-500 ${errors.description ? "border-red-500 dark:border-red-500" : ""
            }`}
          placeholder={language === 'vi' ? 'Viết mô tả cho đề thi....' : 'Write a description for the exam....'}
          name="description"
          value={examForm.description}
          onChange={handleChangeExamForm}
        ></textarea>
      </div>
    </div>
  );
};

export default TitleExam;
