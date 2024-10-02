import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  getActiveSemesters,
  getClass,
  addClass,
  updateClass,
  deleteClass,
} from "../../services/gradeService";
import ClassInfo from "../../components/Head/GradeManagement/ClassInfo";
import AddClass from "../../components/Head/GradeManagement/AddClass";
import { FiUser, FiUsers } from "react-icons/fi"; // Import icons from react-icons
import { Link } from 'react-router-dom'

function GradeManagement() {
  const [semesters, setSemesters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSemester, setSelectedSemester] = useState(null);
  const [isFormAddClassOpen, setIsFormAddClassOpen] = useState(false);
  const [selectedGrade, setSelectedGrade] = useState("");
  const [classData, setClassData] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);

  useEffect(() => {
    const fetchSemesters = async () => {
      try {
        const data = await getActiveSemesters();
        setSemesters(data);
        setLoading(false);

        // Tự động chọn học kỳ đầu tiên nếu danh sách không rỗng
        if (data.length > 0) {
          setSelectedSemester(data[0]);
        }
      } catch (error) {
        console.log("Error fetching semesters:", error.message);
        setLoading(false);
      }
    };

    fetchSemesters();
  }, []);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        if (selectedSemester) {
          const classes = await getClass(selectedSemester._id);
          setClassData(classes);
        } else {
          setClassData([]);
        }
      } catch (error) {
        console.log("Error fetching classes:", error.message);
      }
    };

    fetchClasses();
  }, [selectedSemester, isFormAddClassOpen]);

  const handleSelectSemester = (semester) => {
    setSelectedSemester(semester);
  };

  const openAddClassForm = (grade) => {
    setSelectedGrade(grade);
    setIsFormAddClassOpen(true);
  };

  const closeAddClassForm = () => {
    setIsFormAddClassOpen(false);
  };

  const handleAddClass = async (className) => {
    try {
      if (!selectedSemester) {
        console.log("Selected semester is not defined.");
        return;
      }

      const newClass = {
        name: className,
        grade: selectedGrade,
        semesterId: selectedSemester._id,
      };

      const addedClass = await addClass(newClass);

      if (!addedClass) {
        console.log("Failed to add class. No data returned.");
        return;
      }

      const updatedClasses = [...classData, addedClass];
      setClassData(updatedClasses);

      closeAddClassForm();
    } catch (error) {
      console.log("Error adding class:", error.message);
    }
  };

  const handleDeleteClass = async (classId) => {
    try {
      await deleteClass(classId);

      setClassData((prevClasses) =>
        prevClasses.filter((cls) => cls._id !== classId)
      );
    } catch (error) {
      console.log("Error deleting class:", error.message);
    }
  };

  const handleEditClass = (classInfo) => {
    setSelectedClass(classInfo);
    setIsEditing(true);
  };

  const handleUpdateClass = async (updatedClass) => {
    try {
      await updateClass(updatedClass);

      setClassData((prevClasses) =>
        prevClasses.map((cls) =>
          cls._id === updatedClass._id ? updatedClass : cls
        )
      );
      setIsEditing(false);
      setSelectedClass(null);
    } catch (error) {
      console.log("Error updating class:", error.message);
    }
  };


  return (
    <div className="py-6">
      <header className="flex flex-col sm:flex-row justify-between items-end pb-2">
        <h1 className="text-2xl font-semibold text-stone-900 dark:text-white">
          Quản lý khối lớp
        </h1>
      </header>
      {console.log(classData)}

      {loading ? (
        <p className="text-center text-xl font-semibold text-stone-600">
          Đang tải...
        </p>
      ) : (
        <div className="mt-4 space-y-6">
          {semesters.map((semester) => (
            <div
              key={semester._id}
              className="p-4 bg-white dark:bg-stone-800 rounded-lg shadow"
            >
              <button
                className="text-2xl font-bold mb-2 dark:text-white hover:underline focus:outline-none"
                onClick={() => handleSelectSemester(semester)}
              >
                {`Học kỳ: ${semester.name} - Năm học: ${semester.schoolYear}`}
              </button>
              {selectedSemester && selectedSemester._id === semester._id && (
                <>
                  {["10", "11", "12"].map((grade) => (
                    <motion.div
                      key={grade}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.5 }}
                      className="mt-6 border-t border-stone-300 pt-6"
                    >
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-2xl font-semibold text-stone-800 dark:text-white">
                          Danh sách lớp {grade}
                        </h3>
                        <motion.button
                          initial={{ scale: 1 }}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="bg-blue-500 text-xs text-stone-50 px-4 py-2 rounded-md hover:bg-blue-600"
                          onClick={() => openAddClassForm(grade)}
                        >
                          Thêm
                        </motion.button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                        {classData && classData.length > 0 ? (
                          classData
                            .filter(
                              (cls) =>
                                cls.grade === grade &&
                                cls.semester._id === semester._id
                            )
                            .map((cls) => (
                              <motion.div
                                key={cls._id}
                                initial={{ opacity: 0, y: -5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -5 }}
                                transition={{ duration: 0.5 }}
                                className="bg-stone-100 dark:bg-stone-900 p-4 rounded-md"
                              >
                                <Link
                                  to={`/head/grade/class/${cls._id}`}
                                  className="block"
                                >
                                  <div className="flex justify-between items-center">
                                    <div>
                                      <div className="text-stone-800 dark:text-stone-300 font-semibold">
                                        {cls.name}
                                      </div>
                                      <p className="text-xs text-stone-500 dark:text-stone-400 flex items-center pt-5">
                                        <FiUser className="mr-2" />{" "}
                                        {cls.teacher
                                          ? ` ${cls.teacher.lastName + " " + cls.teacher.firstName}`
                                          : "-"}
                                      </p>
                                      <p className="text-xs text-stone-500 dark:text-stone-400 flex items-center">
                                        <FiUsers className="mr-2" />{" "}
                                        {cls.students.length || 0}
                                      </p>
                                    </div>
                                    <div className="flex flex-col space-y-2 text-xs">
                                    {cls.students.length === 0 && (    
                                      <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        className="bg-red-500 text-stone-50 px-3 py-1 rounded-md hover:bg-red-700"
                                        onClick={(e) => {
                                          e.stopPropagation(); // Ngăn sự kiện click lan đến Link
                                          e.preventDefault(); // Ngăn liên kết đi đến trang khác
                                          handleDeleteClass(cls._id);
                                        }}
                                      >
                                        Xóa
                                      </motion.button>
                                      )}
                                      <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        className="bg-yellow-400 text-stone-50 px-3 py-1 rounded-md hover:bg-yellow-500"
                                        onClick={(e) => {
                                          e.stopPropagation(); // Ngăn sự kiện click lan đến Link
                                          e.preventDefault(); // Ngăn liên kết đi đến trang khác
                                          handleEditClass(cls);
                                        }}
                                      >
                                        Sửa
                                      </motion.button>
                                    </div>
                                  </div>
                                </Link>
                              </motion.div>
                            ))
                        ) : (
                          <p className="text-stone-500 dark:text-stone-300">
                            Không có lớp học
                          </p>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </>
              )}
            </div>
          ))}
        </div>
      )}

      {isFormAddClassOpen && (
        <AddClass onClose={closeAddClassForm} onAddClass={handleAddClass} />
      )}

      {isEditing && (
        <ClassInfo
          onClose={() => setIsEditing(false)}
          selectedSemester={selectedSemester}
          classInfo={selectedClass}
          onUpdateClass={handleUpdateClass}
        />
      )}
    </div>
  );
}

export default GradeManagement;