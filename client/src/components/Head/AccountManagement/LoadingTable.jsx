import React from 'react';

const LoadingTable = () => {
  const skeletonRows = new Array(10).fill(0); // Giả sử bạn muốn 5 hàng chờ
  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      <table className="w-full text-sm text-left rtl:text-right text-black dark:text-white">
        <thead className="text-xs uppercase bg-stone-200 dark:bg-stone-700 dark:text-white">
          <tr>
            <th scope="col" className="px-6 py-3">
              <input type="checkbox" name='checkbox' disabled />
            </th>
            <th scope="col" className="px-6 py-3">ID</th>
            <th scope="col" className="px-6 py-3">Name</th>
            <th scope="col" className="px-6 py-3">Address</th>
            <th scope="col" className="px-6 py-3">Status</th>
            <th scope="col" className="px-6 py-3">Number</th>
            <th scope="col" className="px-6 py-3">Created</th>
            <th scope="col" className="px-6 py-3">Updated</th>
            <th scope="col" className="px-6 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {skeletonRows.map((_, index) => (
            <tr key={index} className="animate-pulse">
              <td className="px-6 py-4">
                <div className="bg-gray-300 rounded h-4 w-4"></div>
              </td>
              <td className="px-6 py-4">
                <div className="bg-gray-300 rounded h-4 w-full"></div>
              </td>
              <td className="px-6 py-4">
                <div className="bg-gray-300 rounded h-4 w-full"></div>
              </td>
              <td className="px-6 py-4">
                <div className="bg-gray-300 rounded h-4 w-full"></div>
              </td>
              <td className="px-6 py-4">
                <div className="bg-gray-300 rounded h-4 w-full"></div>
              </td>
              <td className="px-6 py-4">
                <div className="bg-gray-300 rounded h-4 w-full"></div>
              </td>
              <td className="px-6 py-4">
                <div className="bg-gray-300 rounded h-4 w-full"></div>
              </td>
              <td className="px-6 py-4">
                <div className="bg-gray-300 rounded h-4 w-full"></div>
              </td>
              <td className="px-6 py-4">
                <div className="bg-gray-300 rounded h-4 w-full"></div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};


export default LoadingTable;