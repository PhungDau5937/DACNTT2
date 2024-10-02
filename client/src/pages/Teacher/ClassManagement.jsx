import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MdSearch } from 'react-icons/md';
import { HiPencilAlt } from 'react-icons/hi';
import { TbListDetails } from 'react-icons/tb';
import { MdDelete } from 'react-icons/md';
import { IoMdArrowRoundBack } from 'react-icons/io';

function ClassManagement() {
  const [classes, setClasses] = useState([]);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const teacherId = localStorage.getItem('username'); // Giả sử username là ID giáo viên

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}teacher/getclasses/${teacherId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) throw new Error('Failed to fetch classes');
      const data = await response.json();
      setClasses(data);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredClasses = classes.filter((classItem) =>
    classItem.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (error) return <p>Error: {error}</p>;

  return (
    <div className="container mx-auto p-6 bg-white shadow rounded-lg min-h-96 dark:bg-stone-800">
      <header className="flex flex-col sm:flex-row justify-between items-end pb-4 border-b border-stone-300 dark:border-stone-600">
        <div className="mb-4 sm:mb-0">
          <h1 className="text-2xl font-bold dark:text-white">Class Management</h1>
          <p className="text-sm text-stone-600 dark:text-white pr-4">
            Manage your classes and view details.
          </p>
        </div>
        <div className="relative">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none p-1">
            <MdSearch className="w-5 h-5 text-stone-400 dark:text-stone-300" />
          </div>
          <input
            type="text"
            name="search_text"
            id="floating_text"
            className="block w-full p-2 ps-10 text-sm text-black border border-stone-600 rounded-lg bg-stone-100 focus:ring-blue-500 focus:border-blue-500 dark:bg-stone-800 dark:border-stone-600 dark:placeholder-stone-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Search for class"
            value={searchQuery}
            onChange={handleSearchChange}
            required
          />
        </div>
      </header>

      <div className="relative overflow-x-auto shadow rounded-lg mt-6">
        <table className="w-full text-sm text-left rtl:text-right text-black dark:text-white">
          <thead className="text-xs uppercase bg-stone-200 dark:bg-stone-700 dark:text-white">
            <tr>
              <th scope="col" className="px-6 py-3 whitespace-nowrap">STT</th>
              <th scope="col" className="px-6 py-3 whitespace-nowrap">Class Name</th>
              <th scope="col" className="px-6 py-3 whitespace-nowrap">Homeroom Teacher</th>
              <th scope="col" className="px-6 py-3 whitespace-nowrap">School Year</th>
              <th scope="col" className="px-6 py-3 whitespace-nowrap">Semester</th>
              <th scope="col" className="px-6 py-3 whitespace-nowrap">Status</th>
              <th scope="col" className="px-6 py-3 whitespace-nowrap">Number of Students</th>
              <th scope="col" className="px-6 py-3 whitespace-nowrap">Actions</th>
            </tr>
          </thead>

          <tbody className="text-sm">
            {filteredClasses.length !== 0 ? (
              filteredClasses.map((classItem, index) => (
                <tr key={classItem._id} className="even:bg-stone-100 odd:bg-white dark:even:bg-stone-800 dark:odd:bg-stone-900 border-b dark:border-stone-700">
                  <td className="px-6 py-1 text-xs whitespace-nowrap">{index + 1}</td>
                  <td className="px-6 py-1 text-xs whitespace-nowrap">{classItem.name}</td>
                  <td className="px-6 py-1 text-xs whitespace-nowrap">{classItem.teacher.lastName + " " + classItem.teacher.firstName}</td>
                  <td className="px-6 py-1 text-xs whitespace-nowrap">{classItem.semester.schoolYear ? classItem.semester.schoolYear.year : 'N/A'}</td>
                  <td className="px-6 py-1 text-xs whitespace-nowrap">{classItem.semester.name}</td>
                  <td className="px-6 py-1 text-xs whitespace-nowrap">{classItem.semester.isActive ? 'Active' : 'Inactive'}</td>
                  <td className="px-6 py-1 text-xs whitespace-nowrap">{classItem.students.length}</td>
                  <td className="px-6 py-1 text-xs whitespace-nowrap flex justify-center items-center space-x-2">
                    <Link to={`/teacher/class/${classItem._id}`}>
                      <button
                        type="button"
                        className="text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 font-medium rounded-lg text-xs px-3 py-2 transition duration-200 ease-in-out dark:bg-green-500 dark:hover:bg-green-600 dark:focus:ring-green-700"
                      >
                        <HiPencilAlt size={18} />
                      </button>
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center py-4 text-stone-500 dark:text-stone-400">No classes found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ClassManagement;
