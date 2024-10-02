import React from "react";
import { Routes, Route } from "react-router-dom";
import ClassManagement from "../pages/Teacher/ClassManagement.jsx";
import Repository from "../pages/Teacher/Repository.jsx";
import Dashboard from "../pages/Teacher/Dashboard";
import ExamManagement from "../pages/Teacher/ExamManagement";
import DetailExam from '../components/Teacher/ExamManagement/ShowExam/HistoryExam/ExamDetail.jsx'
import Grading from "../pages/Teacher/Grading.jsx";
import ReportsAndStatistics from "../pages/Teacher/ReportsAndStatistics";
import ReportsClass from "../components/Teacher/ReportsAndStatistics/ClassDetails.jsx";

import ErrorPage from "../pages/Auth/ErrorPage.jsx";

import ClassDetails from "../components/Teacher/ClassManagement/ClassDetails.jsx";
import Profile from "../components/Profile/Profile.jsx";
import PublicProfile from "../components/Profile/PublicProfile.jsx";


// Nộp đề thi
import ExamSubmissionManagement from "../pages/Teacher/ExamSubmissionManagement";



import Message from '../components/Message/Message'


// Phụng
// import CreateExam from "../pages/Teacher/ExamManagement/CreateExam/CreateExam"; ///
import CreateExam from '../../src/components/Teacher/ExamManagement/CreateExam/CreateExam.jsx'
import CreateExamRandom from "../../src/components/Teacher/ExamManagement/CreateExamAuto/CreateRandom/CreateExamRandom";
import CreateExamUpload from "../../src/components/Teacher/ExamManagement/CreateExamAuto/CreateUploadFile/CreateExamUpload";

import ExamWareHouse from "../../src/components/Teacher/ExamManagement/ShowExam/WarehouseExam/ExamWareHouse.jsx";




const TeacherRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<ClassManagement />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/class" element={<ClassManagement />} />
      <Route path="/class/:classId" element={<ClassDetails />} />
      <Route path="/grading" element={<Grading />} />
      {/* exam */}
      <Route path="/exam" element={<ExamManagement />} />
      <Route path="/exam/:examId" element={<DetailExam />} />
      <Route path="/examsubmission" element={<ExamSubmissionManagement />} />
      
      <Route path="/reports" element={<ReportsAndStatistics />} />
      <Route path="/reports/class/:classId" element={<ReportsClass />} />
      <Route path="/" element={<ErrorPage />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/publicprofile/:userId" element={<PublicProfile />} />
      <Route path="/message" element={<Message />} />

      

      {/* Phung */}
      {/* create exam */}
      <Route path="/repository" element={<Repository />}>
        <Route path="" element={<ExamWareHouse />} />
        <Route path="warehouse" element={<ExamWareHouse />} />
        <Route path="createexam" element={<CreateExam />} />
        <Route path="createrandom" element={<CreateExamRandom />} />
        <Route path="createupload" element={<CreateExamUpload />} />
      </Route>
    </Routes>
  );
};

export default TeacherRoutes;
