import React, { useState } from "react";

function ExamDetails({ onClose, selectedExam, onSubmitExamTime }) {
  const [examTime, setExamTime] = useState(selectedExam.examTime || "");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmitExamTime(selectedExam._id, examTime);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-4">Cài đặt thời gian thi</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Thời gian thi</label>
            <input
              type="datetime-local"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none"
              value={examTime}
              onChange={(e) => setExamTime(e.target.value)}
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
              Cài đặt
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ExamDetails;