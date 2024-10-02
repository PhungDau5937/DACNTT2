import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { MdEdit, MdSave, MdCancel } from "react-icons/md";
import { FaSpinner } from "react-icons/fa";

function ClassDetails() {
  const { classId } = useParams();
  const [classDetails, setClassDetails] = useState(null);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const fetchClassDetails = useCallback(async (classId) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}teacher/getclassdetails/${classId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch class details");
      const data = await response.json();

      if (data && data.semester && data.students && data.teacher) {
        const studentsWithInitializedScores = data.students.map((student) => ({
          ...student,
          oralScores: student.oralScores || [null, null, null],
          fifteenMinuteScores: student.fifteenMinuteScores || [null, null, null],
          fortyFiveMinuteScore: student.fortyFiveMinuteScore || null,
          finalScore: student.finalScore || null,
        }));
        setClassDetails({ ...data, students: studentsWithInitializedScores });
        setIsEditing(false);
        getScores(classId);
      } else {
        throw new Error("Class details not found");
      }
    } catch (error) {
      console.error("Error fetching class details:", error);
      setError(error.message);
    }
  }, []);

  useEffect(() => {
    if (classId) {
      fetchClassDetails(classId);
    }
  }, [classId, fetchClassDetails]);

  const getScores = async (classId) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}teacher/getscores/${classId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch scores");
      const scoresData = await response.json();

      if (scoresData) {
        setClassDetails((prevDetails) => {
          const updatedStudents = prevDetails.students.map((student) => {
            const studentScores = scoresData.students.find(
              (score) => score.studentId === student._id
            );
            const updatedStudent = studentScores
              ? {
                  ...student,
                  oralScores: studentScores.scores.oral || [null, null, null],
                  fifteenMinuteScores: studentScores.scores.fifteenMinutes || [null, null, null],
                  fortyFiveMinuteScore: studentScores.scores.midTerm || null,
                  finalScore: studentScores.scores.finalExam || null,
                  averageScore: studentScores.scores.averageScore !== null ? parseFloat(studentScores.scores.averageScore.toFixed(2)) : null
                }
              : student;

            return updatedStudent;
          });

          return { ...prevDetails, students: updatedStudents };
        });
      } else {
        throw new Error("Scores not found");
      }
    } catch (error) {
      console.error("Error fetching scores:", error);
      setError(error.message);
    }
  };

  const handleScoreChange = (studentId, scoreType, index, newScore) => {
    const parsedScore = newScore === "" ? null : parseFloat(newScore);
    if (isNaN(parsedScore) || parsedScore < 0 || parsedScore > 10) return;

    setClassDetails((prevDetails) => {
      const updatedStudents = prevDetails.students.map((student) => {
        if (student._id === studentId) {
          let updatedScores = [...student[scoreType]];
          if (index >= updatedScores.length) {
            updatedScores.push(parsedScore);
          } else {
            updatedScores[index] = parsedScore;
          }
          const updatedStudent = { ...student, [scoreType]: updatedScores, averageScore: null };
          
          return updatedStudent;
        }
        return student;
      });

      return { ...prevDetails, students: updatedStudents };
    });
  };

  const handleSingleScoreChange = (studentId, scoreType, newScore) => {
    const parsedScore = newScore === "" ? null : parseFloat(newScore);
    if (isNaN(parsedScore) || parsedScore < 0 || parsedScore > 10) return;

    setClassDetails((prevDetails) => {
      const updatedStudents = prevDetails.students.map((student) =>
        student._id === studentId
          ? {
              ...student,
              [scoreType]: parsedScore,
              averageScore: null
            }
          : student
      );

      return { ...prevDetails, students: updatedStudents };
    });
  };

  const saveScore = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}teacher/savescore/${classId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ students: classDetails.students }),
        }
      );
    
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save scores");
      }
    
      const result = await response.json();
      alert(result.message);
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving scores:", error);
      setError(error.message);
      alert("Failed to save scores: " + error.message);
    }
  };

  const renderScoreInput = (student, scoreType, index) => {
    const value =
      (student[scoreType][index] !== null && student[scoreType][index] !== undefined)
        ? student[scoreType][index].toString()
        : "";
    return (
      <input
        type="number"
        step="0.25"
        min="0"
        max="10"
        value={value}
        onChange={(e) =>
          handleScoreChange(student._id, scoreType, index, e.target.value)
        }
        className="w-16 p-1 border border-stone-600 rounded-lg dark:border-stone-600 dark:bg-stone-800 dark:text-white"
      />
    );
  };

  const renderSingleScoreInput = (student, scoreType) => {
    const value =
      (student[scoreType] !== null && student[scoreType] !== undefined ) ? student[scoreType].toString() : "";
    return (
      <input
        type="number"
        step="0.25"
        min="0"
        max="10"
        value={value}
        onChange={(e) =>
          handleSingleScoreChange(student._id, scoreType, e.target.value)
        }
        className="w-16 p-1 border border-stone-600 rounded-lg dark:border-stone-600 dark:bg-stone-800 dark:text-white"
      />
    );
  };

  if (error) return <p className="text-red-600 dark:text-red-400">Error: {error}</p>;

  return (
    <div className="container mx-auto p-6 bg-white shadow rounded-lg min-h-96 dark:bg-stone-900 dark:text-white">
      <h2 className="text-2xl font-bold mb-4">Class Details</h2>
      {classDetails ? (
        <div>
          <div className="mb-4">
            <p className="text-lg font-semibold">Class Name: {classDetails.name}</p>
            <p>Homeroom Teacher: {classDetails.teacher.lastName} {classDetails.teacher.firstName}</p>
            <p>Semester {classDetails.semester.name} - School Year {classDetails.semester.schoolYear.year}</p>
            <p>Semester Status: {classDetails.semester.isActive ? "Active" : "Inactive"}</p>
            <p>Number of Students: {classDetails.students.length}</p>
          </div>
          <div className="relative overflow-x-auto shadow rounded-lg mt-6">
            <table className="w-full text-sm text-left rtl:text-right text-black dark:text-white">
              <thead className="text-xs uppercase bg-stone-200 dark:bg-stone-700 dark:text-white">
                <tr>
                  <th rowSpan="2" className="px-6 py-3 whitespace-nowrap">ID</th>
                  <th rowSpan="2" className="px-6 py-3 whitespace-nowrap">Student Name</th>
                  <th colSpan="3" className="px-6 py-3 whitespace-nowrap">Oral Scores</th>
                  <th colSpan="3" className="px-6 py-3 whitespace-nowrap">15-Minute Scores</th>
                  <th rowSpan="2" className="px-6 py-3 whitespace-nowrap">Mid-term Score</th>
                  <th rowSpan="2" className="px-6 py-3 whitespace-nowrap">Final Exam Score</th>
                  <th rowSpan="2" className="px-6 py-3 whitespace-nowrap">Average Score</th>
                </tr>
                <tr>
                  <th className="px-6 py-3 whitespace-nowrap">1</th>
                  <th className="px-6 py-3 whitespace-nowrap">2</th>
                  <th className="px-6 py-3 whitespace-nowrap">3</th>
                  <th className="px-6 py-3 whitespace-nowrap">1</th>
                  <th className="px-6 py-3 whitespace-nowrap">2</th>
                  <th className="px-6 py-3 whitespace-nowrap">3</th>
                </tr>
              </thead>
              <tbody>
                {classDetails.students.map((student) => (
                  <tr key={student._id} className="border-b dark:border-stone-600">
                    <td className="px-6 py-4">{student.username}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{student.lastName} {student.firstName}</td>
                    {[0, 1, 2].map((index) => (
                      <td key={`oral-${index}`} className="px-6 py-4">
                        {isEditing ? (
                          renderScoreInput(student, "oralScores", index)
                        ) : (
                          student.oralScores[index] !== null
                            ? student.oralScores[index]
                            : "-"
                        )}
                      </td>
                    ))}
                    {[0, 1, 2].map((index) => (
                      <td key={`fifteen-${index}`} className="px-6 py-4">
                        {isEditing ? (
                          renderScoreInput(student, "fifteenMinuteScores", index)
                        ) : (
                          student.fifteenMinuteScores[index] !== null
                            ? student.fifteenMinuteScores[index]
                            : "-"
                        )}
                      </td>
                    ))}
                    <td className="px-6 py-4">
                      {isEditing ? (
                        renderSingleScoreInput(student, "fortyFiveMinuteScore")
                      ) : (
                        student.fortyFiveMinuteScore !== null
                          ? student.fortyFiveMinuteScore
                          : "-"
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {isEditing ? (
                        renderSingleScoreInput(student, "finalScore")
                      ) : (
                        student.finalScore !== (null||undefined)
                          ? student.finalScore
                          : "-"
                      )}
                    </td>
                    <td className="px-6 py-4 font-bold">
                      {student.averageScore !== (null||undefined)
                        ? student.averageScore
                        : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex justify-end space-x-2">
            {isEditing ? (
              <>
                <button 
                  onClick={saveScore} 
                  className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-600"
                >
                  <MdSave className="mr-2" /> Save Scores
                </button>
                <button 
                  onClick={() => setIsEditing(false)} 
                  className="flex items-center px-4 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600 dark:bg-red-700 dark:hover:bg-red-600"
                >
                  <MdCancel className="mr-2" /> Cancel
                </button>
              </>
            ) : (
              <button 
                onClick={() => setIsEditing(true)} 
                className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg shadow hover:bg-green-600 dark:bg-green-700 dark:hover:bg-green-600"
              >
                <MdEdit className="mr-2" /> Edit Scores
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center h-48">
          <FaSpinner className="animate-spin text-blue-500 text-3xl" />
        </div>
      )}
    </div>
  );
}

export default ClassDetails;
