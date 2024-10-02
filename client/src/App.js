import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { useSelector } from "react-redux";
import HeadLayout from "./components/Layout/HeadLayout";
import TeacherLayout from "./components/Layout/TeacherLayout";
import StudentLayout from "./components/Layout/StudentLayout";
import Login from "./pages/Auth/LoginPage";
import TeacherLogin from "./pages/Auth/TeacherLoginPage";
import ForgotPassword from "./pages/Auth/ForgotPassword";

import ProtectedRoute from "./routes/ProtectedRoute";
import HeadRoutes from "./routes/HeadRoutes";
import TeacherRoutes from "./routes/TeacherRoutes";
import StudentRoutes from "./routes/StudentRoutes";
import {
  selectIsAuthenticated,
  selectUserRole,
} from "./Redux/Auth/authSelectors";

import PracticeTestsDetails from "./components/Student/PracticeTests/PracticeDetails.jsx";
import ExamDetails from "./components/Student/Exam/ExamDetails.jsx";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import Profile from "./components/Head/Profile/Profile";

const App = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const userRole = useSelector(selectUserRole);

  const getRedirectPath = () => {
    switch (userRole) {
      case "Head":
        return "/head";
      case "Teacher":
        return "/teacher";
      case "Student":
        return "/student";
      default:
        return "/";
    }
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={
            !isAuthenticated ? (
              <Login />
            ) : (
              <Navigate to={getRedirectPath()} replace />
            )
          }
        />
        <Route
          path="/teacher/login"
          element={
            !isAuthenticated ? (
              <TeacherLogin />
            ) : (
              <Navigate to={getRedirectPath()} replace />
            )
          }
        />
        <Route
          path="/forgotpassword"
          element={<ForgotPassword />}
        />
        <Route
          path="/"
          element={
            <Navigate to={isAuthenticated ? getRedirectPath() : "/login"} />
            
          }
        />
        <Route path="/practicetests/:examId/" element={<PracticeTestsDetails />} />
        <Route path="/exam/:examId/submissionId/:submissionId" element={<ExamDetails />} />
        <Route element={<ProtectedRoute allowedRoles={"Head"} />}>
          <Route
            path="/head/*"
            element={
              <HeadLayout>
                <HeadRoutes />
              </HeadLayout>
            }
          />
        </Route>
        <Route element={<ProtectedRoute allowedRoles={"Teacher"} />}>
          <Route
            path="/teacher/*"
            element={
              <TeacherLayout>
                <TeacherRoutes />
              </TeacherLayout>
            }
          />
        </Route>
        <Route element={<ProtectedRoute allowedRoles={"Student"} />}>
          <Route
            path="/student/*"
            element={
              <StudentLayout>
                <StudentRoutes />
              </StudentLayout>
            }
          />
        </Route>
      </Routes>
      <ToastContainer autoClose={3500} />
    </Router>
  );
};

export default App;