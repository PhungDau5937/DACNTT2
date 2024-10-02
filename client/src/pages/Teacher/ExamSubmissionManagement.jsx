import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import moment from "moment";
import ExamDetails from '../../components/Teacher/ExamSubmissionDetails/ExamDetails';
import { MdEvent, MdDone, MdClose, MdEdit } from "react-icons/md";

function ExamSubmissionManagement() {
  const [activeSemesters, setActiveSemesters] = useState([]);
  const [selectedSemester, setSelectedSemester] = useState(null);
  const [examSubmissions, setExamSubmissions] = useState({});
  const [teacherExams, setTeacherExams] = useState({});
  const [selectedExam, setSelectedExam] = useState(null);
  const [approvedExams, setApprovedExams] = useState({});
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  console.log("approvedExams: ", approvedExams);

  useEffect(() => {
    fetchActiveSemesters();
  }, []);

  useEffect(() => {
    if (selectedSemester) {
      fetchExamSubmissions(selectedSemester._id);
      fetchTeacherExams(selectedSemester._id);
    }
  }, [selectedSemester]);

  useEffect(() => {
    if (selectedSemester) {
      const allExamIds = Object.values(examSubmissions[selectedSemester._id] || [])
        .map(exam => exam._id);

      allExamIds.forEach(examId => fetchApprovedExams(examId));
    }
  }, [examSubmissions, selectedSemester]);

  const handleSelectSemester = (semester) => {
    setSelectedSemester(semester);
  };

  const fetchActiveSemesters = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}teacher/getactivesemesters`
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

  const fetchExamSubmissions = async (semesterId) => {
    const teacherId = localStorage.getItem("username");

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}teacher/examsubmissions/semester/${semesterId}?teacherId=${teacherId}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch exam submissions");
      }

      const data = await response.json();
      setExamSubmissions((prevState) => ({
        ...prevState,
        [semesterId]: data,
      }));
    } catch (error) {
      console.error("Error fetching exam submissions:", error.message);
    }
  };

  const fetchTeacherExams = async (semesterId) => {
    const teacherId = localStorage.getItem("username");

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}teacher/exam?teacherID=${teacherId}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch teacher's exams");
      }
      const data = await response.json();
      setTeacherExams((prevState) => ({
        ...prevState,
        [semesterId]: data,
      }));
    } catch (error) {
      console.error("Error fetching teacher's exams:", error.message);
    }
  };

  const fetchApprovedExams = async (submissionId) => {
    const teacherId = localStorage.getItem("username");

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}teacher/approvedexams/${teacherId}/${submissionId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch approved exam");
      }
      const approvedExamData = await response.json();

      setApprovedExams((prevState) => ({
        ...prevState,
        [submissionId]: approvedExamData
      }));
    } catch (error) {
      console.log("Error fetching approved exam:", error.message);
    }
  };

  const handleSubmitExamQuestions = async (semesterId, grade, examId, examSubmissions, examType) => {
    if (!examId) {
      alert("Please select an exam before submitting.");
      return;
    }

    const teacherId = localStorage.getItem('username');
    if (!teacherId) {
      alert("Teacher ID not found in local storage. Please log in again.");
      return;
    }

    setLoading(true);

    try {
      const body = {
        teacherId: teacherId,
        semesterId: semesterId,
        grade: grade,
        submissionId: examSubmissions,
        examType: examType
      };

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}teacher/exam/${examId}/submit`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );

      if (!response.ok) {
        const errorResponse = await response.text();
        console.error("Error response from server:", errorResponse);
        throw new Error("Failed to submit exam questions");
      }

      await fetchTeacherExams(semesterId);
      await fetchExamSubmissions(semesterId);

      alert("Exam questions submitted successfully!");
    } catch (error) {
      console.error("Error submitting exam questions:", error.message);
      alert(`Failed to submit exam questions: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const formatDateForInput = (dateString) => {
    return moment(dateString).format("YYYY-MM-DDTHH:mm");
  };

  const handleCopyPassword = (password) => {
    navigator.clipboard.writeText(password).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset copy status after 2 seconds
    });
  };

  return (
    <div className="text-xs">
      <header className="flex flex-col sm:flex-row justify-between items-end pb-2 border-b border-stone-300 dark:border-stone-700">
        <h1 className="text-2xl font-semibold text-stone-900 dark:text-white">
        QUẢN LÝ ĐỀ THI
        </h1>
      </header>

      <div className="mt-4 space-y-6">
        {activeSemesters.length === 0 ? (
          <p className="text-stone-500 dark:text-stone-400">No active semesters available.</p>
        ) : (
          activeSemesters.map((semester) => (
            <div
              key={semester._id}
              className="p-4 bg-white dark:bg-stone-800 rounded-lg shadow"
            >
              <button
                className="text-2xl font-bold mb-2 dark:text-white hover:underline focus:outline-none flex items-center"
                onClick={() => handleSelectSemester(semester)}
              >
                <MdEvent className="mr-2" />
                {`Học kỳ: ${semester.name} - Năm học: ${semester.schoolYear}`}
              </button>

              {selectedSemester && selectedSemester._id === semester._id && (
                <>
                  {["10", "11", "12"].map((grade) => {
                    const examsForGrade = examSubmissions[selectedSemester._id]?.filter(exam => exam.grade === grade) || [];

                    return examsForGrade.length > 0 && (
                      <motion.div
                        key={grade}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.5 }}
                        className="mt-6 border-t border-stone-300 dark:border-stone-700 pt-6"
                      >
                        <h3 className="text-2xl font-semibold text-stone-800 dark:text-white">
                          Khối lớp {grade}
                        </h3>

                        <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
                          {examsForGrade.map((exam) => (
                            <div
                              key={exam._id}
                              className="p-4 border border-stone-500 dark:border-stone-100 bg-100 dark:bg-stone-800 rounded-lg"
                            >
                              <h4 className="text-lg font-semibold text-stone-800 dark:text-white">
                                {`Kỳ Thi: ${exam.examType} - Trạng thái: ${exam.isActive ? "Kích hoạt" : "Không kích hoạt"}`}
                              </h4>

                              <h1 className="text-xs pt-2 font-medium text-white">
                                <span
                                  className={`inline-flex items-center ${approvedExams[exam._id] ? 'bg-green-500' : 'bg-red-500'} text-white p-2 rounded-lg`}
                                >
                                  {approvedExams[exam._id] ? (
                                    <>
                                      Approved
                                    </>
                                  ) : (
                                    <>
                                      Not Approved
                                    </>
                                  )}
                                </span>
                              </h1>

                              <div className="mt-2">
                                <div className="flex sm:flex-row items-center space-y-4 sm:space-y-0">
                                  <div className="flex-1">
                                    <label className="block text-xs text-stone-600 dark:text-stone-400">
                                      Ngày & Giờ thi:
                                      <input
                                        type="datetime-local"
                                        value={formatDateForInput(exam.examTime) || ''}
                                        disabled
                                        className="w-full mt-1 bg-stone-200 dark:bg-stone-600 text-stone-800 dark:text-white p-2 rounded-lg border border-stone-300 dark:border-stone-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                      />
                                    </label>

                                    {exam.isActive && (approvedExams[exam._id]?.status !== 'approved') && (approvedExams[exam._id]?.status !== 'rejected') ? (
                                      <div>
                                        <select
                                          onChange={(e) => setSelectedExam(teacherExams[selectedSemester._id]?.find(exam => exam._id === e.target.value))}
                                          className="w-full mt-2 bg-stone-200 dark:bg-stone-600 text-stone-800 dark:text-white p-2 rounded-lg border border-stone-300 dark:border-stone-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                          <option value="">Chọn đề thi</option>
                                          {teacherExams[selectedSemester._id]?.map(teacherExam => (
                                            <option key={teacherExam._id} value={teacherExam._id}>
                                              {teacherExam.titleExam}
                                            </option>
                                          ))}
                                        </select>
                                        <button
                                          onClick={() =>
                                            handleSubmitExamQuestions(
                                              selectedSemester._id,
                                              grade,
                                              selectedExam?._id,
                                              exam._id,
                                              exam.examType
                                            )
                                          }
                                          className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2 flex items-center"
                                          disabled={loading}
                                        >
                                          <MdEdit className="mr-2" />
                                          {loading ? 'Submitting...' : 'Submit Exam'}
                                        </button>

                                        
                                      </div>
                                    ) : (
                                      <p className="text-red-500 font-medium py-2">
                                        Nộp/thay đổi đề thi không khả dụng!
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <ExamDetails exam={approvedExams[exam._id]} />
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

                                    </div>
                                  )}

                                </div>
                              </div>
                            </div>

                          ))}
                        </div>
                      </motion.div>
                    );
                  })}
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ExamSubmissionManagement;
