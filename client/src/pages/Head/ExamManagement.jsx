import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import moment from "moment";
import { Link } from "react-router-dom";

function ExamManagement() {
  const [activeSemesters, setActiveSemesters] = useState([]);
  const [selectedSemester, setSelectedSemester] = useState(null);
  const [examTypes, setExamTypes] = useState({});
  const [examTypeByGrade, setExamTypeByGrade] = useState({});
  const [examSubmissions, setExamSubmissions] = useState({});
  const [modifiedExams, setModifiedExams] = useState({});
  const [newPassword, setNewPassword] = useState('');
  const [copied, setCopied] = useState(false);

  // Fetch active semesters on component mount
  useEffect(() => {
    fetchActiveSemesters();
  }, []);

  // Fetch exam types when a semester is selected
  useEffect(() => {
    if (selectedSemester) {
      fetchExamsBySemester(selectedSemester._id);
      fetchExamSubmissions(selectedSemester._id);
    } else {
      setExamTypes({});
    }
  }, [selectedSemester]);

  // Fetch active semesters from API
  const fetchActiveSemesters = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}head/getactivesemesters`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch active semesters");
      }
      const data = await response.json();
      setActiveSemesters(data);
      if (data.length > 0) {
        setSelectedSemester(data[0]);
      }
    } catch (error) {
      console.error("Error fetching active semesters:", error.message);
    }
  };


  const handlePasswordChange = (semesterId, grade, examId) => {
    const password = generateRandomPassword(); // Generate a random password

    fetch(`${process.env.REACT_APP_API_URL}head/setexampassword/${examId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error("Failed to set exam password");
        }
        return response.json();
      })
      .then(console.log(password))
      .then(() => {
        fetchExamSubmissions(selectedSemester._id);
        alert("Password updated successfully!");
      })
      .catch(error => {
        console.error("Error updating exam password:", error.message);
        alert("Failed to update exam password. Please try again.");
      });
  };

  const handleRemovePassword = (semesterId, grade, examId) => {
    fetch(`${process.env.REACT_APP_API_URL}head/removeexampassword/${examId}`, {
      method: "PUT",
    })
      .then(response => {
        if (!response.ok) {
          throw new Error("Failed to remove exam password");
        }
        return response.json();
      })
      .then(() => {
        fetchExamSubmissions(selectedSemester._id);
        alert("Password removed successfully!");
      })
      .then(() => setNewPassword(''))
      .catch(error => {
        console.error("Error removing exam password:", error.message);
        alert("Failed to remove exam password. Please try again.");
      });
  };

  const handleCopyPassword = (password) => {
    navigator.clipboard.writeText(password).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset copy status after 2 seconds
    });
  };

  // Fetch exam types by semester ID
  const fetchExamsBySemester = async (semesterId) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}head/examsubmissions/semester/${semesterId}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch exams by semester");
      }
      const data = await response.json();
      setExamTypes(data);
    } catch (error) {
      console.error("Error fetching exams by semester:", error.message);
    }
  };

  // Fetch exam submissions by semester ID
  const fetchExamSubmissions = async (semesterId) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}head/examsubmissions/semester/${semesterId}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch exam submissions");
      }
      const data = await response.json();
      const organizedData = data.reduce((acc, exam) => {
        const { grade } = exam;
        if (!acc[grade]) {
          acc[grade] = [];
        }
        acc[grade].push(exam);
        console.log(acc);
        return acc;

      }, {});
      setExamSubmissions((prevState) => ({
        ...prevState,
        [semesterId]: organizedData,
      }));
    } catch (error) {
      console.error("Error fetching exam submissions:", error.message);
    }
  };

  // Update selected semester when user clicks on it
  const handleSelectSemester = (semester) => {
    setSelectedSemester(semester);
  };

  // Handle change in exam type selection for a grade
  const handleExamTypeChange = (grade, examType) => {
    setExamTypeByGrade((prevState) => ({
      ...prevState,
      [grade]: examType,
    }));
  };

  // Handle local modification of exam fields (examTime, isActive)
  const handleExamFieldChange = (semesterId, grade, examId, field, value) => {
    setModifiedExams((prevState) => {
      const semesterState = { ...prevState[semesterId] } || {};
      const gradeState = semesterState[grade] || [];
      const examIndex = gradeState.findIndex((exam) => exam._id === examId);

      if (examIndex > -1) {
        const updatedExam = { ...gradeState[examIndex], [field]: value };
        const updatedGradeState = [...gradeState];
        updatedGradeState[examIndex] = updatedExam;

        return {
          ...prevState,
          [semesterId]: {
            ...semesterState,
            [grade]: updatedGradeState,
          },
        };
      } else {
        // Nếu không tìm thấy exam trong state, thêm mới
        const newExam = { _id: examId, [field]: value };
        const updatedGradeState = [...gradeState, newExam];

        return {
          ...prevState,
          [semesterId]: {
            ...semesterState,
            [grade]: updatedGradeState,
          },
        };
      }
    });
  };

  // Handle submission of exam time to server
  const handleSubmitExamTime = async (semesterId, grade, examId) => {
    const exam = (modifiedExams[semesterId]?.[grade] || []).find((e) => e._id === examId);
    if (!exam) return;

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}head/setexamtime/${examId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            examTime: exam.examTime,
            testTime: exam.testTime, // Include testTime in the request
          }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to update exam time");
      }

      // After successful update, fetch updated exam submissions
      fetchExamSubmissions(selectedSemester._id);
      alert("Exam time updated successfully!");
    } catch (error) {
      console.error("Error updating exam time:", error.message);
      alert("Failed to update exam time. Please try again.");
    }
  };


  // Handle submission of exam status to server
  // Handle submission of exam status to server
  const handleSubmitExamStatus = async (semesterId, grade, examId) => {
    const exam = (examSubmissions[semesterId]?.[grade] || []).find(
      (exam) => exam._id === examId
    );
    if (!exam) return;

    if(examSubmissions.length === 0 || examSubmissions === undefined || examSubmissions === null) {
      return alert("No exam submissions found");
    }

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}head/toggleexamstatus/${examId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            examTime: exam.examTime,
            isActive: exam.isActive,
            grade,
          }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to update exam status");
      }

      // After successful update, fetch updated exam submissions
      fetchExamSubmissions(selectedSemester._id);
      alert("Exam status updated successfully!");
    } catch (error) {
      console.error("Error updating exam status:", error.message);
      alert("Failed to update exam status. Please try again.");
    }
  };


  // Handle addition of a new exam for a grade
  const handleAddExam = async (grade) => {
    const examType = examTypeByGrade[grade] || "midterm";
    if (!examType) {
      alert("Exam type is required");
      return;
    }

    const existingExam = examSubmissions[selectedSemester?._id]?.[grade]?.find(
      (exam) => exam.examType === examType
    );
    if (existingExam) {
      alert(`An exam of type ${examType} already exists for grade ${grade}`);
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}head/examsubmissions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          grade,
          examType,
          semesterID: selectedSemester._id,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to add exam");
      }

      // After successful addition, fetch updated exam submissions
      fetchExamSubmissions(selectedSemester._id);
      alert(`Exam added successfully for grade ${grade}`);
    } catch (error) {
      console.error("Error adding exam:", error.message);
      alert("Failed to add exam. Please try again.");
    }
  };

  const formatDateForInput = (dateString) => {
    return moment(dateString).format("YYYY-MM-DDTHH:mm");
  };

  function generateRandomPassword(length = 6) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }



  return (
    <div className="py-6">
      <header className="flex flex-col sm:flex-row justify-between items-end pb-2">
        <h1 className="text-2xl font-semibold text-stone-900 dark:text-white">
          QUẢN LÝ ĐỀ THI
        </h1>
      </header>

      <div className="mt-4 space-y-6">
        {activeSemesters.map((semester) => (
          <div
            key={semester._id}
            className="p-4 bg-white dark:bg-stone-800 rounded-lg shadow"
          >
            <button
              className="text-2xl font-bold mb-2 dark:text-white focus:outline-none"
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
                    <div className="flex items-center justify-between">
                      <h3 className="text-2xl font-semibold text-stone-800 dark:text-white">
                        Khối lớp {grade}
                      </h3>
                      <div className="flex items-center space-x-4">
                        <select
                          value={examTypeByGrade[grade] || "midterm"}
                          onChange={(e) =>
                            handleExamTypeChange(grade, e.target.value)
                          }
                          className="bg-stone-200 dark:bg-stone-700 text-xs text-stone-800 dark:text-white p-2 rounded-md"
                        >
                          <option value="midterm">Kỳ Thi Giữa Kỳ</option>
                          <option value="final">Kỳ Thi Cuối Kỳ</option>
                        </select>
                        <button
                          onClick={() => handleAddExam(grade)}
                          className="bg-blue-500 text-xs text-white p-2 rounded-md hover:bg-blue-600 transition duration-300"
                        >
                          Thêm
                        </button>
                      </div>
                    </div>

                    {examSubmissions[selectedSemester._id]?.[grade] &&
                      examSubmissions[selectedSemester._id][grade].map(
                        (exam) => (
                          <div
                            key={exam._id}
                            className="mt-4 p-4 bg-stone-100 dark:bg-stone-700 rounded-md"
                          >
                            <h4 className="text-lg font-semibold text-stone-800 dark:text-white">
                              <Link
                                to={`/head/exam/${exam._id}`} // Link to the exam details page
                                className="hover:underline"
                              >
                                {`Kỳ Thi: ${exam.examType} - Trạng thái: ${exam.isActive ? "Kích hoạt" : "Không kích hoạt"}`}
                              </Link>
                            </h4>
                            <div className="mt-2">
                              <div className="flex flex-col sm:flex-row sm:items-end sm:space-x-4">
                                <div className="flex-1">
                                  <label className="block text-xs text-stone-600 dark:text-stone-400">
                                    Ngày & Giờ thi:
                                    <input
                                      type="datetime-local"
                                      value={
                                        formatDateForInput(
                                          modifiedExams[selectedSemester._id]?.[grade]?.find((e) => e._id === exam._id)?.examTime ||
                                          exam.examTime
                                        ) || ''
                                      }
                                      onChange={(e) =>
                                        handleExamFieldChange(
                                          selectedSemester._id,
                                          grade,
                                          exam._id,
                                          "examTime",
                                          e.target.value
                                        )
                                      }
                                      className="w-full mt-1 text-xs bg-stone-200 dark:bg-stone-600 text-stone-800 dark:text-white p-2 rounded-md"
                                    />
                                  </label>
                                </div>
                                <div className="flex-1 mt-4 sm:mt-0">
                                  <label className="block text-xs text-stone-600 dark:text-stone-400">
                                    Thời gian (p):
                                    <select
                                      value={
                                        modifiedExams[selectedSemester._id]?.[grade]?.find((e) => e._id === exam._id)?.testTime ||
                                        exam.testTime
                                      }
                                      onChange={(e) =>
                                        handleExamFieldChange(
                                          selectedSemester._id,
                                          grade,
                                          exam._id,
                                          "testTime",
                                          e.target.value
                                        )
                                      }
                                      className="w-full mt-1 text-xs bg-stone-200 dark:bg-stone-600 text-stone-800 dark:text-white p-2 rounded-md"
                                    >
                                      <option value="45">45 phút</option>
                                      <option value="90">90 phút</option>
                                      <option value="120">120 phút</option>
                                    </select>
                                  </label>
                                </div>
                                <button
                                  onClick={() =>
                                    handleSubmitExamTime(
                                      selectedSemester._id,
                                      grade,
                                      exam._id
                                    )
                                  }
                                  className="mt-4 sm:mt-0 bg-green-500 text-xs text-white p-2 rounded-md hover:bg-green-600 transition duration-300"
                                >
                                  Submit Time
                                </button>
                              </div>
                            </div>

                            <div className="mt-2">
                              <label className="inline-flex items-center cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={exam.isActive}
                                  onChange={(e) => {
                                    const isChecked = e.target.checked;
                                    handleExamFieldChange(
                                      selectedSemester._id,
                                      grade,
                                      exam._id,
                                      "isActive",
                                      isChecked
                                    );
                                    handleSubmitExamStatus(selectedSemester._id, grade, exam._id);
                                  }}
                                  className="sr-only peer"
                                />
                                <div className="relative w-11 h-6 bg-stone-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-stone-600 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-stone-600 peer-checked:bg-blue-600"></div>
                                <span className="ms-3 text-xs font-medium text-stone-900 dark:text-stone-300">Kích hoạt</span>
                              </label>
                            </div>

                            <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:space-x-6 space-y-2 sm:space-y-0">
                              {/* Hiển thị mật khẩu ngẫu nhiên được tạo */}
                              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 w-full">
                                <span className="text-xs py-2 font-medium text-stone-900 dark:text-stone-300 flex-grow">
                                  Password:
                                  <span className="font-bold text-sm ml-2">
                                    {exam.examPassword || "Not set"}
                                  </span>
                                </span>
                                {exam.examPassword && (
                                  <div className="flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0">
                                    <button
                                      onClick={() => handleCopyPassword(exam.examPassword)}
                                      className="bg-gray-500 text-xs text-white p-2 rounded-md hover:bg-gray-600 transition duration-300"
                                    >
                                      {copied ? "Copied!" : "Copy"}
                                    </button>
                                    <button
                                      onClick={() => handleRemovePassword(selectedSemester._id, grade, exam._id)}
                                      className="bg-red-500 text-xs text-white p-2 rounded-md hover:bg-red-600 transition duration-300"
                                    >
                                      Remove Password
                                    </button>
                                  </div>
                                )}
                                {exam.examPassword === "" && (
                                  <button
                                    onClick={() => handlePasswordChange(selectedSemester._id, grade, exam._id)}
                                    className="bg-blue-500 text-xs text-white p-2 rounded-md hover:bg-blue-600 transition duration-300 mt-2 sm:mt-0"
                                  >
                                    Set Password
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        )
                      )}
                  </motion.div>
                ))}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );

}

export default ExamManagement;
