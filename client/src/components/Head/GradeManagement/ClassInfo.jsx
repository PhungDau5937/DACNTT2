import React, { useState, useEffect } from 'react';

const ClassInfo = ({ onClose, selectedSemester, classInfo, onUpdateClass }) => {
  const [className, setClassName] = useState(classInfo ? classInfo.name : '');

  useEffect(() => {
    if (classInfo) {
      setClassName(classInfo.name);
    }
  }, [classInfo]);

  const handleClassNameChange = (e) => {
    setClassName(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const updatedClass = {
      ...classInfo,
      name: className,
      semesterId: selectedSemester._id,
    };

    onUpdateClass(updatedClass);
    onClose();
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 p-4 rounded-md w-96">
        <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
          Sửa lớp học
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="className"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Tên lớp học
            </label>
            <input
              type="text"
              id="className"
              name="className"
              value={className}
              onChange={handleClassNameChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Nhập tên lớp học..."
              required
            />
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              className="bg-red-500 text-white px-4 py-2 rounded-md mr-2 focus:outline-none"
              onClick={onClose}
            >
              Đóng
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-md focus:outline-none"
            >
              Cập nhật
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClassInfo;