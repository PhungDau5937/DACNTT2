import React from "react";
import { Routes, Route } from "react-router-dom";

import PracticeTests from "../pages/Student/PracticeTests.jsx";
import PracticeTestsDetails from "../components/Student/PracticeTests/PracticeDetails.jsx";

import ScoreManagement from "../pages/Student/ScoreManagent";
import ScoreDetails from "../components/Student/ScoreDetails/ScoreDetails.jsx";

import MyCourses from "../pages/Student/MyCourses";
import LearningMaterials from "../pages/Student/LearningMaterials";

import DiscussionAndSupport from "../pages/Student/DiscussionAndSupport ";
import Notifications from "../pages/Student/Notifications";
import Exam from "../pages/Student/Exam.jsx";

import Profile from "../components/Profile/Profile";
import PublicProfile from "../components/Profile/PublicProfile.jsx";

import Message from '../components/Message/Message'

const practiceTestsPath =`${process.env.REACT_APP_URL}/practicetests/:examId`

const StudentRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Exam />} />
      <Route path="/exam" element={<Exam />} />
      <Route path="/practicetests" element={<PracticeTests />} />
      <Route path="/practicetests/:examId" element={<PracticeTestsDetails />} />
      {/* <Route path=`${process.en}/practicetests/:examId` element={<PracticeTestsDetails />} /> */}

      <Route path="/mycourses" element={<MyCourses />} />
      <Route path="/learningmaterials" element={<LearningMaterials />} />
      <Route path={practiceTestsPath} element={<LearningMaterials />} />
      {/* <Route path="/profile" element={<Profile />} /> */}
      <Route path="/discussionandsupport" element={<DiscussionAndSupport />} />
      <Route path="/notifications" element={<Notifications />} />

      <Route path="/score" element={<ScoreManagement />} />
      <Route path="/score/:classId" element={<ScoreDetails />} />



      <Route path="/message" element={<Message />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/publicprofile/:userId" element={<PublicProfile />} />

    </Routes>
  );
};

export default StudentRoutes;
