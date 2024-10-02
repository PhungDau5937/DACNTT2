import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";


const CurrentTeacherInfo = ({ teacher }) => (
  <div className="bg-white shadow rounded-lg p-6 mb-6 dark:bg-stone-800">
    <h3 className="text-xl font-semibold mb-2 dark:text-white">Current Teacher</h3>
    {teacher ? (
      <p className="text-sm dark:text-white">{teacher.firstName} {teacher.lastName}</p>
    ) : (
      <p className="text-sm text-stone-500 dark:text-stone-400">No teacher assigned</p>
    )}
  </div>
);

const AddedStudentsTable = ({ students = [], onRemoveStudent }) => (
  <div className="relative overflow-x-auto shadow rounded-lg mt-6">
    <table className="w-full text-sm text-left rtl:text-right text-black dark:text-white">
      <thead className="text-xs uppercase bg-stone-200 dark:bg-stone-700 dark:text-white">
        <tr>
          <th scope="col" className="px-6 py-3 whitespace-nowrap">Username</th>
          <th scope="col" className="px-6 py-3 whitespace-nowrap">Last Name</th>
          <th scope="col" className="px-6 py-3 whitespace-nowrap">First Name</th>
          <th scope="col" className="px-6 py-3 whitespace-nowrap">Actions</th>
        </tr>
      </thead>
      <tbody className="text-sm">
        {students.length > 0 ? (
          students.map((student) => (
            <tr key={student._id} className="even:bg-stone-100 odd:bg-white dark:even:bg-stone-800 dark:odd:bg-stone-900 border-b dark:border-stone-700">
              <td className="px-6 py-2 whitespace-nowrap">{student.username}</td>
              <td className="px-6 py-2 whitespace-nowrap">{student.lastName}</td>
              <td className="px-6 py-2 whitespace-nowrap">{student.firstName}</td>
              <td className="px-6 py-2 whitespace-nowrap text-center">
                <button
                  onClick={() => onRemoveStudent(student._id)}
                  className="text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400 font-medium rounded-lg text-xs px-3 py-1 transition duration-200 ease-in-out dark:bg-red-500 dark:hover:bg-red-600 dark:focus:ring-red-700"
                >
                  Remove
                </button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="4" className="text-center py-4 text-stone-500 dark:text-stone-400">No students found</td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
);



const StudentsWithoutClassTable = ({ students = [], onAddStudent }) => (
  <div className="relative overflow-x-auto shadow rounded-lg mt-6">
    <table className="w-full text-sm text-left rtl:text-right text-black dark:text-white">
      <thead className="text-xs uppercase bg-stone-200 dark:bg-stone-700 dark:text-white">
        <tr>
          <th scope="col" className="px-6 py-3 whitespace-nowrap">Username</th>
          <th scope="col" className="px-6 py-3 whitespace-nowrap">Last Name</th>
          <th scope="col" className="px-6 py-3 whitespace-nowrap">First Name</th>
          <th scope="col" className="px-6 py-3 whitespace-nowrap">Actions</th>
        </tr>
      </thead>
      <tbody className="text-sm">
        {students.length > 0 ? (
          students.map((student) => (
            <tr key={student._id} className="even:bg-stone-100 odd:bg-white dark:even:bg-stone-800 dark:odd:bg-stone-900 border-b dark:border-stone-700">
              <td className="px-6 py-2 whitespace-nowrap">{student.username}</td>
              <td className="px-6 py-2 whitespace-nowrap">{student.lastName}</td>
              <td className="px-6 py-2 whitespace-nowrap">{student.firstName}</td>
              <td className="px-6 py-2 whitespace-nowrap text-center">
                <button
                  onClick={() => onAddStudent(student._id)}
                  className="text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 font-medium rounded-lg text-xs px-3 py-1 transition duration-200 ease-in-out dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-700"
                >
                  Add
                </button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="4" className="text-center py-4 text-stone-500 dark:text-stone-400">No students found</td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
);


const TeachersWithoutClassTable = ({ teachers = [], onAddTeacher, onChangeTeacher, hasTeacher }) => (
  <div className="relative overflow-x-auto shadow rounded-lg mt-6">
    <table className="w-full text-sm text-left rtl:text-right text-black dark:text-white">
      <thead className="text-xs uppercase bg-stone-200 dark:bg-stone-700 dark:text-white">
        <tr>
          <th scope="col" className="px-6 py-3 whitespace-nowrap">Username</th>
          <th scope="col" className="px-6 py-3 whitespace-nowrap">Last Name</th>
          <th scope="col" className="px-6 py-3 whitespace-nowrap">First Name</th>
          <th scope="col" className="px-6 py-3 whitespace-nowrap">Actions</th>
        </tr>
      </thead>
      <tbody className="text-sm">
        {teachers.length > 0 ? (
          teachers.map((teacher) => (
            <tr key={teacher._id} className="even:bg-stone-100 odd:bg-white dark:even:bg-stone-800 dark:odd:bg-stone-900 border-b dark:border-stone-700">
              <td className="px-6 py-2 whitespace-nowrap">{teacher.username}</td>
              <td className="px-6 py-2 whitespace-nowrap">{teacher.lastName}</td>
              <td className="px-6 py-2 whitespace-nowrap">{teacher.firstName}</td>
              <td className="px-6 py-2 whitespace-nowrap text-center">
                <button
                  onClick={() => hasTeacher ? onChangeTeacher(teacher._id) : onAddTeacher(teacher._id)}
                  className={`text-white ${hasTeacher ? 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-400' : 'bg-green-600 hover:bg-green-700 focus:ring-green-400'} focus:outline-none focus:ring-2 font-medium rounded-lg text-xs px-3 py-1 transition duration-200 ease-in-out dark:${hasTeacher ? 'bg-yellow-500 dark:hover:bg-yellow-600 dark:focus:ring-yellow-700' : 'bg-green-500 dark:hover:bg-green-600 dark:focus:ring-green-700'}`}
                >
                  {hasTeacher ? 'Change' : 'Add'}
                </button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="4" className="text-center py-4 text-stone-500 dark:text-stone-400">No teachers found</td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
);


const ClassManagement = () => {
  const { classId } = useParams();
  const [teacher, setTeacher] = useState(null);
  const [students, setStudents] = useState([]);
  const [allStudents, setAllStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [classInfo, setClassInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [allTeachers, setAllTeachers] = useState([]);
  const [filteredTeachers, setFilteredTeachers] = useState([]);
  const [teacherSearchQuery, setTeacherSearchQuery] = useState("");

  useEffect(() => {
    const fetchClassDetails = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}head/class/${classId}`);
        if (response.ok) {
          const data = await response.json();
          setClassInfo(data);
          setTeacher(data.teacher);
          setStudents(data.students);
        } else {
          console.error("Error fetching class details:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching class details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (classId) {
      fetchClassDetails();
    }
  }, [classId]);

  useEffect(() => {
    const fetchAllStudents = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}head/class/studentswithoutclass/${classId}`);
        if (response.ok) {
          const data = await response.json();
          setAllStudents(data);
          setFilteredStudents(data);
        } else {
          console.error("Error fetching students without class:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching students without class:", error);
      }
    };

    if (classId) {
      fetchAllStudents();
    }
  }, [classId]);

  useEffect(() => {
    const fetchTeachersWithoutClass = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}head/class/teacherswithoutclass/${classId}`);
        if (response.ok) {
          const data = await response.json();
          setAllTeachers(data);
          setFilteredTeachers(data);
        } else {
          console.error("Error fetching teachers without class:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching teachers without class:", error);
      }
    };

    fetchTeachersWithoutClass();
  }, [classId]);

  const addTeacher = async (teacherId) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}head/class/${classId}/addteacher`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ teacherId }),
      });

      if (response.ok) {
        const data = await response.json();
        setTeacher(data.teacher);
        
        // Cập nhật lại danh sách giáo viên chưa có lớp
        const updatedTeachersResponse = await fetch(`${process.env.REACT_APP_API_URL}head/class/teacherswithoutclass/${classId}`);
        if (updatedTeachersResponse.ok) {
          const updatedTeachers = await updatedTeachersResponse.json();
          setAllTeachers(updatedTeachers);
          setFilteredTeachers(updatedTeachers);
        } else {
          console.error("Error fetching updated teachers without class:", updatedTeachersResponse.statusText);
        }
      } else {
        console.error("Class already has a teacher or error adding teacher");
      }
    } catch (error) {
      console.error("Error adding teacher:", error);
    }
  };

  const addStudent = async (studentId) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}head/class/${classId}/addstudent`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ studentId }),
      });

      if (response.ok) {
        const data = await response.json();
        setStudents(data.students);
        setAllStudents(allStudents.filter((student) => student._id !== studentId));
        setFilteredStudents(filteredStudents.filter((student) => student._id !== studentId));
      } else {
        console.error("Error adding student");
      }
    } catch (error) {
      console.error("Error adding student:", error);
    }
  };

  const removeStudent = async (studentId) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}head/class/${classId}/removestudent`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ studentId }),
      });

      if (response.ok) {
        const removedStudent = students.find((student) => student._id === studentId);
        setStudents(students.filter((student) => student._id !== studentId));
        if (removedStudent) {
          setAllStudents([...allStudents, removedStudent]);
          setFilteredStudents([...filteredStudents, removedStudent]);
        }
      } else {
        console.error("Error removing student:", response.statusText);
      }
    } catch (error) {
      console.error("Error removing student:", error);
    }
  };

  const handleSearchStudents = (event) => {
    setSearchQuery(event.target.value);
    if (event.target.value) {
      const lowercasedQuery = event.target.value.toLowerCase();
      setFilteredStudents(
        allStudents.filter((student) =>
          student.firstName.toLowerCase().includes(lowercasedQuery) ||
          student.lastName.toLowerCase().includes(lowercasedQuery) ||
          student.username.toLowerCase().includes(lowercasedQuery)
        )
      );
    } else {
      setFilteredStudents(allStudents);
    }
  };

  const handleSearchTeachers = (event) => {
    setTeacherSearchQuery(event.target.value);
    if (event.target.value) {
      const lowercasedQuery = event.target.value.toLowerCase();
      setFilteredTeachers(
        allTeachers.filter((teacher) =>
          teacher.firstName.toLowerCase().includes(lowercasedQuery) ||
          teacher.lastName.toLowerCase().includes(lowercasedQuery) ||
          teacher.username.toLowerCase().includes(lowercasedQuery)
        )
      );
    } else {
      setFilteredTeachers(allTeachers);
    }
  };

  return (
    <div className="p-6 bg-stone-50 dark:bg-stone-900 min-h-screen">
      <h2 className="text-2xl font-bold mb-6 dark:text-white">Class Management</h2>
      {loading ? (
        <p className="text-center text-lg text-stone-500 dark:text-stone-400">Loading...</p>
      ) : (
        <>
          <CurrentTeacherInfo teacher={teacher} />
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-4 dark:text-white">Manage Students</h3>
            <input
              type="text"
              placeholder="Search students..."
              value={searchQuery}
              onChange={handleSearchStudents}
              className="mb-4 p-2 border border-stone-300 rounded-lg shadow w-full dark:bg-stone-700 dark:border-stone-600 dark:text-white"
            />
            <StudentsWithoutClassTable
              students={filteredStudents}
              onAddStudent={addStudent}
            />
            <AddedStudentsTable
              students={students}
              onRemoveStudent={removeStudent}
            />
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-4 dark:text-white">Manage Teachers</h3>
            <input
              type="text"
              placeholder="Search teachers..."
              value={teacherSearchQuery}
              onChange={handleSearchTeachers}
              className="mb-4 p-2 border border-stone-300 rounded-lg shadow w-full dark:bg-stone-700 dark:border-stone-600 dark:text-white"
            />
            <TeachersWithoutClassTable
              teachers={filteredTeachers}
              onAddTeacher={addTeacher}
              onChangeTeacher={addTeacher}
              hasTeacher={!!teacher}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default ClassManagement;
