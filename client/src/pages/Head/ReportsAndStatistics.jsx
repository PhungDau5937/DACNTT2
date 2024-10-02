import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  getActiveSemesters,
  getClass,
} from "../../services/gradeService";

import { Link } from 'react-router-dom';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

function GradeManagement() {
  const [semesters, setSemesters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSemester, setSelectedSemester] = useState(null);
  const [classData, setClassData] = useState([]);

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
  }, [selectedSemester]);

  const handleSelectSemester = (semester) => {
    setSelectedSemester(semester);
  };

  const renderPieChart = (grade) => {
    if (!classData || classData.length === 0) return null;
    
    const filteredClasses = classData.filter(
      (cls) => cls.grade === grade && cls.semester._id === selectedSemester._id
    );
    
    if (filteredClasses.length === 0) return null;
    
    const data = {
      labels: filteredClasses.map((cls) => cls.name),
      datasets: [
        {
          label: 'Number of Students',
          data: filteredClasses.map((cls) => cls.students.length),
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)',
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
          ],
          borderWidth: 1,
        },
      ],
    };
    
    const options = {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: `Number of Students in Grade ${grade}`,
        },
      },
    };
    
    return <Pie data={data} options={options} width={150} height={150} />;
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
                  {["10", "11", "12"].map((grade) => {
                    const filteredClasses = classData.filter(
                      (cls) =>
                        cls.grade === grade &&
                        cls.semester._id === semester._id
                    );

                    if (filteredClasses.length === 0) return null;

                    return (
                      <motion.div
                        key={grade}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.5 }}
                        className="mt-6 border-t border-stone-300 pt-6"
                      >
                        <div className="flex flex-col md:flex-row gap-4">
                          <div className="flex-1">
                            <h3 className="text-2xl font-semibold text-stone-800 dark:text-white">
                              Danh sách lớp {grade}
                            </h3>
                            <div className="overflow-x-auto mt-4">
                              <table className="min-w-full divide-y divide-stone-200 dark:divide-stone-700">
                                <thead className="bg-stone-50 dark:bg-stone-700">
                                  <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 dark:text-stone-300 uppercase tracking-wider">
                                      Tên lớp
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 dark:text-stone-300 uppercase tracking-wider">
                                      Giáo viên
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 dark:text-stone-300 uppercase tracking-wider">
                                      Số học sinh
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 dark:text-stone-300 uppercase tracking-wider">
                                      Thao tác
                                    </th>
                                  </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-stone-800 divide-y divide-stone-200 dark:divide-stone-700">
                                  {filteredClasses.map((cls) => (
                                    <tr key={cls._id}>
                                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-stone-900 dark:text-stone-300">
                                        <Link
                                          to={`/head/reports/class/${cls._id}`}
                                          className="hover:underline"
                                        >
                                          {cls.name}
                                        </Link>
                                      </td>
                                      <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-500 dark:text-stone-400">
                                        {cls.teacher
                                          ? `${cls.teacher.lastName} ${cls.teacher.firstName}`
                                          : "-"}
                                      </td>
                                      <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-500 dark:text-stone-400">
                                        {cls.students.length || 0}
                                      </td>
                                      <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-500 dark:text-stone-400">
                                        <Link
                                          to={`/head/reports/class/${cls._id}`}
                                          className="text-blue-500 hover:underline"
                                        >
                                          Xem chi tiết
                                        </Link>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                          <div className="flex-1 flex justify-center items-center">
                            {renderPieChart(grade)}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default GradeManagement;