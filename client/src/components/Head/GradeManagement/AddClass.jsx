import React, { useState } from 'react';

function AddClass({ onClose, onAddClass }) {
  const [className, setClassName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddClass(className); // Call the prop function with class name
    setClassName('');
  };
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-4 rounded-md">
        <h2 className="text-xl mb-4">Thêm lớp học</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium">Tên lớp</label>
            <input
              type="text"
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none"
              required
            />
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded-md mr-2"
            >
              Hủy
            </button>
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md">
              Thêm
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddClass;