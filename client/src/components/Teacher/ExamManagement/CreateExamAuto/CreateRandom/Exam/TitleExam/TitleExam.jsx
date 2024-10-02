import React, { useState, useRef, useEffect } from "react";

const TitleExam = ({ examForm, handleChangeExamForm, onChaptersData }) => {
  // Trạng thái để điều khiển việc hiển thị form nhập số chương
  const [showFromQuantity, setShowFromQuantity] = useState(false);
  const [quantityChapters, setQuantityChapters] = useState(0); // State to keep track of quantity chapters
  const [valueQuantityChapters, setValueQuantityChapters] = useState([]);

  console.log(quantityChapters);
  // Tạo một tham chiếu (ref) để lưu trữ giá trị của trường nhập số chương
  const quantityChapterRef = useRef(null);

  // Hàm xử lý khi nhấn nút "Nhập form Random"
  const handleShowQuantityChapter = () => {
    // Lấy giá trị hiện tại của trường nhập số chương từ tham chiếu
    const quantityChapterValue = quantityChapterRef.current.value;

    if (quantityChapterValue === "") {
      alert("Vui lòng nhập số chương muốn tạo Random!");
      return;
    }

    console.log("Số chương:", quantityChapterValue); // In giá trị ra console hoặc xử lý theo nhu cầu

    setQuantityChapters(Number(quantityChapterValue));
    setValueQuantityChapters(
      Array.from({ length: Number(quantityChapterValue) }, () => ({
        titleChapterRandom: "",
        quantityQuestionRandom: "",
        difficulty: "random",
        typeQuestionRandom: "",
      }))
    );
    // Hiển thị thông tin về Chương
    setShowFromQuantity(true);
  };

  // Hàm lấy giá trị của các td tương ứng
  const handleChapterChange = (index, field, value) => {
    setValueQuantityChapters((prevChapters) => {
      const newChapters = [...prevChapters];
      newChapters[index] = { ...newChapters[index], [field]: value };
      return newChapters;
    });
  };

  // Hàm tạo tbody trên số lượng Chapter đã nhập
  const generateRows = () => {
    return valueQuantityChapters.map((chapter, index) => (
      <tr key={index}>
        {/* Index */}
        <td className="px-2 py-2 whitespace-nowrap text-sm text-center">
          {index + 1}
        </td>

        {/* Tiêu đè Chapter */}
        <td className="px-4 py-2 whitespace-nowrap text-sm text-center">
          <input
            type="text"
            value={valueQuantityChapters.titleChapterRandom}
            onChange={(e) =>
              handleChapterChange(index, "titleChapterRandom", e.target.value)
            }
            className="w-full text-center"
            placeholder="Nhập tiêu đề Chương"
          />
        </td>

        {/* Số lượng câu hỏi */}
        <td className="px-4 py-2 whitespace-nowrap text-sm text-center">
          <input
            type="text"
            value={valueQuantityChapters.quantityQuestionRandom}
            onChange={(e) =>
              handleChapterChange(
                index,
                "quantityQuestionRandom",
                e.target.value
              )
            }
            className="w-[60px] text-center"
            placeholder="Nhập số"
          />
        </td>

        {/* Loại câu hỏi */}
        <td className="px-4 py-2 whitespace-nowrap text-sm text-center">
          <select
            value={valueQuantityChapters[index].typeQuestionRandom}
            onChange={(e) =>
              handleChapterChange(index, "typeQuestionRandom", e.target.value)
            }
            className="border border-gray-300 text-xs">
            <option value="">----------</option>
            <option value="trắc nghiệm">Trắc nghiệm</option>
            <option value="điền khuyết">Điền khuyết</option>
            <option value="đục lỗ">Đục lỗ(1 đoạn văn bản)</option>
            <option value="nghe">Nghe</option>
            <option value="trọng âm">Trọng âm</option>
            <option value="shortAnswer">Câu hỏi ngắn</option>
          </select>
        </td>

        {/* Mức độ */}
        <td className="px-4 py-2 whitespace-nowrap text-sm text-center">
          <select
            value={valueQuantityChapters[index].difficulty}
            onChange={(e) =>
              handleChapterChange(index, "difficulty", e.target.value)
            }
            className="border border-gray-300 text-xs">
            <option value="random">Ngẫu nhiên</option>
            <option value="Dễ">Dễ</option>
            <option value="Trung bình">Trung bình</option>
            <option value="Khó">Khó</option>
          </select>
        </td>
      </tr>
    ));
  };

  console.log("Tương ứng: ", valueQuantityChapters);
  // Gửi qua Exam
  useEffect(() => {
    if (onChaptersData) {
      onChaptersData(valueQuantityChapters);
    }
  }, [valueQuantityChapters, onChaptersData]);

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
          className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
          Tên đề thi <span className="text-red-500">*</span>
        </label>
      </div>
      <div className="grid md:grid-cols-2 md:gap-6">
        <div className="z-0 w-full mb-5 group">
          <label
            htmlFor="countries"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Chọn Lớp học: <span className="text-red-500">*</span>
          </label>
          <select
            id="countries"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            name="classExam"
            value={examForm.classExam}
            onChange={handleChangeExamForm}>
            <option value="10">Tiếng anh lớp 10</option>
            <option value="11">Tiếng anh lớp 11</option>
            <option value="12">Tiếng anh lớp 12</option>
          </select>
        </div>
        <div className="relative z-0 w-full mb-5 group">
          <label
            htmlFor="countries"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Chọn thời gian: <span className="text-red-500">*</span>
          </label>
          <select
            id="countries"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            name="time"
            value={examForm.time}
            onChange={handleChangeExamForm}>
            <option value="">----------</option>
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
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Mô tả:
        </label>
        <textarea
          id="message"
          rows="4"
          className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Viết mô tả cho đề thi...."
          name="description"
          value={examForm.description}
          onChange={handleChangeExamForm}></textarea>
      </div>

      <div className="relative flex gap-5 z-0 w-full mb-5 group mt-16 justify-end">
        <div className="w-24">
          <div className="relative w-full min-w-[100px] h-10">
            <input
              id="quantityChapter"
              ref={quantityChapterRef}
              name="quantityChapter"
              className="peer w-full h-full bg-transparent text-blue-gray-700 font-sans font-normal outline outline-0 focus:outline-0 disabled:bg-blue-gray-50 disabled:border-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 border focus:border-2 border-t-transparent focus:border-t-transparent text-sm px-3 py-2.5 rounded-[7px] border-blue-gray-200 focus:border-gray-900"
              placeholder=" "
            />
            <label className="flex w-full h-full select-none pointer-events-none absolute left-0 font-normal !overflow-visible truncate peer-placeholder-shown:text-blue-gray-500 leading-tight peer-focus:leading-tight peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500 transition-all -top-1.5 peer-placeholder-shown:text-sm text-[11px] peer-focus:text-[11px] before:content[' '] before:block before:box-border before:w-2.5 before:h-1.5 before:mt-[6.5px] before:mr-1 peer-placeholder-shown:before:border-transparent before:rounded-tl-md before:border-t peer-focus:before:border-t-2 before:border-l peer-focus:before:border-l-2 before:pointer-events-none before:transition-all peer-disabled:before:border-transparent after:content[' '] after:block after:flex-grow after:box-border after:w-2.5 after:h-1.5 after:mt-[6.5px] after:ml-1 peer-placeholder-shown:after:border-transparent after:rounded-tr-md after:border-t peer-focus:after:border-t-2 after:border-r peer-focus:after:border-r-2 after:pointer-events-none after:transition-all peer-disabled:after:border-transparent peer-placeholder-shown:leading-[3.75] text-gray-500 peer-focus:text-gray-900 before:border-blue-gray-200 peer-focus:before:!border-gray-900 after:border-blue-gray-200 peer-focus:after:!border-gray-900">
              Số Chương
            </label>
          </div>
        </div>

        <div className="">
          <button
            type="button"
            onClick={handleShowQuantityChapter}
            className="focus:outline-none text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900">
            Nhập form Random
          </button>
        </div>
      </div>
      {showFromQuantity && (
        <div className="formQuantityChapter flex rounded-md border-2 p-5 mb-5">
          <table className="min-w-full divide-y divide-gray-200 border-2">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-0 py-2 text-center text-xs font-bold text-black uppercase tracking-wider w-1/12">
                  STT
                </th>
                <th className="px-4 py-2 text-center text-xs font-bold text-black uppercase tracking-wider w-1/3">
                  Tiêu đề Chương
                </th>
                <th className="px-4 py-2 text-center text-xs font-bold text-black uppercase tracking-wider w-1/12">
                  Số lượng câu hỏi
                </th>
                <th className="px-4 py-2 text-center text-xs font-bold text-black uppercase tracking-wider w-1/6">
                  Loại câu hỏi
                </th>
                <th className="px-4 py-2 text-center text-xs font-bold text-black uppercase tracking-wider w-1/6">
                  Mức độ
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {generateRows()}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TitleExam;
