import React from "react";
import { Routes, Route } from "react-router-dom";
import Dashboard from "../pages/Head/Dashboard";
import ExamManagement from "../pages/Head/ExamManagement";
import ExamSubmissionDetails from "../pages/Head/ExamSubmissionDetails";
import GradeManagement from "../pages/Head/GradeManagement.jsx";
// import TeacherManagement from "../pages/Head/TeacherManagement";
// import StudentManagement from "../pages/Head/StudentManagement";
import ReportsAndStatistics from "../pages/Head/ReportsAndStatistics";
import ReportsClass from "../components/Head/ReportsAndStatistics/ClassDetails.jsx";
import SystemSettings from "../pages/Head/SystemSettings";
import AccountManagement from "../pages/Head/AccountManagement";
import Message from '../components/Message/Message'
import SemesterManagement from '../pages/Head/SemesterManagement'
import ClassManagement from '../pages/Head/ClassManagement.jsx'

import Profile from "../components/Profile/Profile.jsx";
import PublicProfile from "../components/Profile/PublicProfile.jsx";


import ErrorPage from "../pages/Auth/ErrorPage.jsx"


const HeadRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/exam" element={<ExamManagement />} />
      <Route path="/exam/:examSubmissionId" element={<ExamSubmissionDetails />} />
      <Route path="/semester" element={<SemesterManagement />} />
      <Route path="/head/grade/:semesterId" element={<GradeManagement />} />
      <Route path="/grade/class/:classId" element={<ClassManagement />} />
      <Route path="/grade" element={<GradeManagement />} />

      <Route path="/reports" element={<ReportsAndStatistics />} />
      <Route path="/reports/class/:classId" element={<ReportsClass />} />
      <Route path="/settings" element={<SystemSettings />} />
      <Route path="/account" element={<AccountManagement />} />
      <Route path="/message" element={<Message />} />
      <Route path="*" element={<ErrorPage />} />

      <Route path="/profile" element={<Profile />} />
      <Route path="/publicprofile/:userId" element={<PublicProfile />} />
      
      {/* <Route path="/semester" element={<SemesterManagement />} /> */}



    </Routes>
  );
};

export default HeadRoutes;
