import React, { useState } from "react";

function AddExam({ onClose, onSubmitExam, selectedSemester, selectedGrade }) {
  const [examType, setExamType] = useState("Midterm"); // Midterm or Final
  const [time, setTime] = useState(""); // ISO string format for datetime

  const handleSubmit = (e) => {
    e.preventDefault();
    const examData = {
      examType,
      time,
      semesterId: selectedSemester._id,
      grade: selectedGrade,
    };
    onSubmitExam(examData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-4">Thêm bài kiểm tra</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Loại bài kiểm tra</label>
            <select
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none"
              value={examType}
              onChange={(e) => setExamType(e.target.value)}
              required
            >
              <option value="midTerm">Giữa kỳ</option>
              <option value="final">Cuối kỳ</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Thời gian</label>
            <input
              type="datetime-local"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
            />
          </div>
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
              onClick={onClose}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
              Thêm
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddExam;