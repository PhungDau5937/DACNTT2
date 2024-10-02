import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom'
import { motion } from "framer-motion";
import {
  getSchoolYears,
  createSchoolYear,
  getSemesters,
  createSemester,
  deleteSchoolYear,
  updateSemesterDates,
  deleteSemester,
  toggleSemesterActive,
} from "../../services/schoolYearService";
import calculateCurrentSemester from "../../services/calculateCurrentSemester";

const SemesterManagement = () => {
  const [schoolYears, setSchoolYears] = useState([]);
  const [selectedSchoolYearId, setSelectedSchoolYearId] = useState("");
  const [semesters, setSemesters] = useState([]);
  const [newYear, setNewYear] = useState("");
  const [newSemester, setNewSemester] = useState({
    name: "",
    startDate: "",
    endDate: "",
  });
  const [currentSemester, setCurrentSemester] = useState(null);

  useEffect(() => {
    const currentDate = new Date();
    const semester = calculateCurrentSemester(currentDate);
    setCurrentSemester(semester);
  }, []);

  useEffect(() => {
    fetchSchoolYears();
  }, []);

  useEffect(() => {
    if (selectedSchoolYearId) {
      handleSchoolYearSelect(selectedSchoolYearId);
    }
  }, [selectedSchoolYearId]);

  useEffect(() => {
    if (schoolYears.length > 0 && !selectedSchoolYearId) {
      setSelectedSchoolYearId(schoolYears[0]._id);
    }
  }, [schoolYears, selectedSchoolYearId]);

  const fetchSchoolYears = async () => {
    try {
      const data = await getSchoolYears();
      setSchoolYears(data);
    } catch (error) {
      console.error("Error fetching school years:", error);
    }
  };

  const handleSchoolYearSelect = async (schoolYearId) => {
    setSelectedSchoolYearId(schoolYearId);
    try {
      const data = await getSemesters(schoolYearId);
      setSemesters(data);
    } catch (error) {
      console.error("Error fetching semesters:", error);
    }
  };

  const handleCreateSchoolYear = async () => {
    try {
      await createSchoolYear(newYear);
      setNewYear("");
      fetchSchoolYears();
      alert("Thêm niên khóa học thành công");
    } catch (error) {
      alert("Niên khóa đã tồn tại!");
      console.error("Error creating school year:", error);
    }
  };

  const handleDeleteSchoolYear = async (schoolYearId) => {
    try {
      // Check if there are semesters for the school year
      const semesters = await getSemesters(schoolYearId);
      if (semesters.length > 0) {
        // If there are semesters, do not allow deletion
        alert("Cannot delete school year with existing semesters.");
        return;
      }

      // Delete the school year if no semesters exist
      const deleted = await deleteSchoolYear(schoolYearId);
      if (deleted) {
        alert("School year deleted successfully.");

        // Fetch updated list of school years and set state
        const updatedSchoolYears = await getSchoolYears();
        setSchoolYears(updatedSchoolYears);
      }
    } catch (error) {
      console.error("Error deleting school year:", error);
      alert("Error deleting school year. Please try again later.");
    }
  };

  const handleCreateSemester = async () => {
    try {
      const semesterData = {
        ...newSemester,
        startDate:
          newSemester.startDate ||
          currentSemester.startDate ||
          defaultSemesterDates[newSemester.name]?.startDate ||
          "",
        endDate:
          newSemester.endDate ||
          currentSemester.endDate ||
          defaultSemesterDates[newSemester.name]?.endDate ||
          "",
      };

      await createSemester(selectedSchoolYearId, semesterData);
      setNewSemester((prevState) => ({
        ...prevState,
        name: "",
        startDate: "",
        endDate: "",
      }));
      const updatedSemesters = await getSemesters(selectedSchoolYearId);
      setSemesters(updatedSemesters);
      alert("Thêm học kỳ thành công");

      fetchSchoolYears(); // Cập nhật lại danh sách niên khóa // Cập nhật lại danh sách niên khóa
    } catch (error) {
      console.error("Error creating semester:", error);
    }
  };

  const handleDeleteSemester = async (semesterId) => {
    try {
      // Kiểm tra xem học kỳ có lớp học nào không
      const semester = semesters.find((sem) => sem._id === semesterId);
      if (semester.classes.length > 0) {
        // Nếu có lớp học, không cho phép xóa
        alert("Không thể xóa học kỳ có lớp học.");
        return;
      }

      // Thực hiện xóa học kỳ nếu không có lớp học
      const deleted = await deleteSemester(semesterId);
      if (deleted) {
        alert("Xóa học kỳ thành công.");

        // Cập nhật danh sách học kỳ sau khi xóa
        const updatedSemesters = semesters.filter(
          (sem) => sem._id !== semesterId
        );
        setSemesters(updatedSemesters);
        fetchSchoolYears();
      }
    } catch (error) {
      console.error("Lỗi xóa học kỳ:", error);
      alert("Đã xảy ra lỗi khi xóa học kỳ. Vui lòng thử lại sau.");
    }
  };

  const handleSemesterDateChange = async (
    semesterId,
    newStartDate,
    newEndDate
  ) => {
    try {
      // Cập nhật thông tin ngày học kỳ
      await updateSemesterDates(semesterId, newStartDate, newEndDate);

      // Cập nhật lại danh sách học kỳ sau khi thay đổi ngày
      const updatedSemesters = semesters.map((semester) =>
        semester._id === semesterId
          ? {
            ...semester,
            startDate: newStartDate,
            endDate: newEndDate,
            editing: false,
          }
          : semester
      );
      setSemesters(updatedSemesters);
      alert("Cập nhật ngày thành công");
      fetchSchoolYears();
    } catch (error) {
      console.error("Error updating semester dates:", error);
      alert("Lỗi cập nhật ngày học kỳ. Vui lòng thử lại sau.");
    }
  };

  const handleToggleSemesterActive = async (semesterId, isActive) => {
    try {
      await toggleSemesterActive(semesterId, isActive);

      // Cập nhật lại state semesters sau khi thay đổi isActive
      setSemesters((prevSemesters) =>
        prevSemesters.map((sem) =>
          sem._id === semesterId ? { ...sem, isActive: isActive } : sem
        )
      );
      alert(`Học kỳ đã được ${isActive ? "kích hoạt" : "hủy kích hoạt"}.`);
    } catch (error) {
      console.error("Lỗi khi thay đổi trạng thái học kỳ:", error);
      alert(
        "Đã xảy ra lỗi khi thay đổi trạng thái học kỳ. Vui lòng thử lại sau."
      );
    }
  };

  // Thời gian mặc định cho các học kỳ
  const defaultSemesterDates = {
    "I": { startDate: "2024-09-01", endDate: "2024-12-31" },
    "II": { startDate: "2025-01-01", endDate: "2025-05-31" },
    "III": { startDate: "2025-06-01", endDate: "2025-08-31" },
  };

  // ...

  return (
    <div className="mb-8">
      <h1 className="text-2xl font-bold dark:text-white mb-4">
        Quản lý Niên khóa
      </h1>
      <div className="grid sm:grid-cols-3 gap-4 text-sm">
        <div className="container mx-auto p-4 rounded-lg shadow bg-white sm:mr-2 dark:bg-stone-800 dark:text-white">
          <div className="mb-4">
            <h2 className="mb-2 font-bold">Thêm Niên khóa</h2>
            <input
              type="text"
              value={newYear}
              onChange={(e) => setNewYear(e.target.value)}
              placeholder="YYYY"
              pattern="\d{4}"
              title="Enter a 4-digit year"
              className="w-full p-2 border border-gray-300 rounded-md mb-2 focus:outline-none focus:ring-2  focus:ring-blue-500 dark:bg-stone-200 dark:text-black"
            />
            {newYear && (
              <span className="block text-stone-400 mb-2">
                Năm kết thúc: {parseInt(newYear) + 1}
              </span>
            )}
            <button
              onClick={handleCreateSchoolYear}
              className="w-full bg-stone-500 text-white p-2 rounded-md hover:bg-stone-600 transition duration-300">
              Thêm Niên khóa
            </button>
          </div>

          <h2 className="mb-2 font-bold">Niên khóa</h2>
          <div className="overflow-y-auto max-h-96">
            <ul className="list-disc list-inside space-y-2">
              {schoolYears.map((year) => (
                <li
                  key={year._id}
                  onClick={() => handleSchoolYearSelect(year._id)}
                  className={`flex justify-between items-center cursor-pointer hover:text-stone-400 p-2 rounded-md ${selectedSchoolYearId === year._id
                      ? "bg-stone-100 dark:bg-stone-600"
                      : ""
                    }`}>
                  {year.year}
                  {year.semesters.length === 0 ? (
                    <button
                      onClick={() => handleDeleteSchoolYear(year._id)}
                      className="ml-2 text-red-400 hover:text-red-600 focus:outline-none">
                      Xóa
                    </button>
                  ) : (
                    <span></span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="container p-4 sm:col-span-2 bg-white rounded-lg shadow dark:bg-stone-800 dark:text-white">
          {selectedSchoolYearId && (
            <div className="mb-4 dark:text-black">
              <h2 className="text-sm mb-2 dark:text-white font-bold">
                Thêm Học kỳ
              </h2>
              <select
                value={newSemester.name}
                onChange={(e) =>
                  setNewSemester({ ...newSemester, name: e.target.value })
                }
                className="w-full p-2 border border-gray-300 rounded-md mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-stone-200">
                <option value="">Chọn Học kỳ</option>
                {Object.keys(defaultSemesterDates).map((semesterName) => (
                  <option key={semesterName} value={semesterName}>
                    {semesterName}
                  </option>
                ))}
              </select>
              <input
                type="date"
                value={
                  newSemester.startDate ||
                  defaultSemesterDates[newSemester.name]?.startDate ||
                  ""
                }
                onChange={(e) =>
                  setNewSemester({ ...newSemester, startDate: e.target.value })
                }
                placeholder="Ngày Bắt đầu"
                className="w-full p-2 border border-gray-300 rounded-md mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-stone-200"
              />
              <input
                type="date"
                value={
                  newSemester.endDate ||
                  defaultSemesterDates[newSemester.name]?.endDate ||
                  ""
                }
                onChange={(e) =>
                  setNewSemester({ ...newSemester, endDate: e.target.value })
                }
                placeholder="Ngày Kết thúc"
                className="w-full p-2 border border-gray-300 rounded-md mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-stone-200"
              />
              <button
                onClick={handleCreateSemester}
                className="w-full bg-stone-500 text-white p-2 rounded-md hover:bg-stone-600 transition duration-300">
                Thêm Học kỳ
              </button>
            </div>
          )}

          <h2 className="text-sm font-bold mb-4">
            Học kỳ trong Niên khóa{" "}
            {
              schoolYears.find((year) => year._id === selectedSchoolYearId)
                ?.year
            }
          </h2>
          {semesters.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}>
              <ul className="space-y-4 min-h-72">
                {semesters.map((semester) => (
                  <motion.li
                    key={semester._id}
                    className="border rounded-md overflow-hidden"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}>
                    <div className="p-4 flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold">
                          <Link to={`/head/grade`}>
                            Học kỳ {semester.name}
                          </Link>
                        </h3>
                        <p className="text-sm text-stone-500">
                          {semester.editing ? (
                            <>
                              <input
                                type="date"
                                value={new Date(semester.startDate)
                                  .toISOString()
                                  .slice(0, 10)}
                                onChange={(e) =>
                                  setSemesters((prevSemesters) =>
                                    prevSemesters.map((sem) =>
                                      sem._id === semester._id
                                        ? {
                                          ...sem,
                                          startDate: e.target.value,
                                        }
                                        : sem
                                    )
                                  )
                                }
                                className="text-gray-700 p-2 border border-gray-300 rounded-md mr-2"
                              />
                              -
                              <input
                                type="date"
                                value={new Date(semester.endDate)
                                  .toISOString()
                                  .slice(0, 10)}
                                onChange={(e) =>
                                  setSemesters((prevSemesters) =>
                                    prevSemesters.map((sem) =>
                                      sem._id === semester._id
                                        ? {
                                          ...sem,
                                          endDate: e.target.value,
                                        }
                                        : sem
                                    )
                                  )
                                }
                                className="text-gray-700 p-2 border border-gray-300 rounded-md"
                              />
                            </>
                          ) : (
                            <>
                              <span className="font-medium">
                                {new Date(
                                  semester.startDate
                                ).toLocaleDateString("vi-VN", {
                                  day: "2-digit",
                                  month: "2-digit",
                                  year: "numeric",
                                })}
                              </span>
                              -
                              <span className="font-medium">
                                {new Date(semester.endDate).toLocaleDateString(
                                  "vi-VN",
                                  {
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "numeric",
                                  }
                                )}
                              </span>
                            </>
                          )}
                        </p>
                      </div>

                      <div className="flex justify-between items-center mb-2">
                        <button
                          onClick={() => {
                            if (semester.editing) {
                              handleSemesterDateChange(
                                semester._id,
                                semester.startDate,
                                semester.endDate
                              );
                            }
                            setSemesters((prevSemesters) =>
                              prevSemesters.map((sem) =>
                                sem._id === semester._id
                                  ? { ...sem, editing: !sem.editing }
                                  : sem
                              )
                            );
                          }}
                          className="text-blue-400 hover:text-blue-600 focus:outline-none py-2 ml-2">
                          {semester.editing ? "Lưu" : "Sửa"}
                        </button>

                        {semester.classes.length === 0 && (
                          <button
                            onClick={() => handleDeleteSemester(semester._id)}
                            className="text-red-400 hover:text-red-600 focus:outline-none py-2 ml-2">
                            Xóa
                          </button>
                        )}

                        {/* Toggle isActive */}
                        <label className="inline-flex items-center cursor-pointer mx-2">
                          <input
                            type="checkbox"
                            checked={semester.isActive}
                            onChange={() =>
                              handleToggleSemesterActive(
                                semester._id,
                                !semester.isActive
                              )
                            }
                            className="sr-only peer"
                          />
                          <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:bg-blue-600 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600">
                          </div>
                          <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                            Active
                          </span>
                        </label>

                      </div>
                    </div>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SemesterManagement;
