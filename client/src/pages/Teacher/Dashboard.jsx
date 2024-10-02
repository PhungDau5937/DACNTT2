// Dashboard.jsx (Teacher Dashboard)

import React from "react";
import { Link } from "react-router-dom";

function Dashboard (){
  return (
    <div>
      <h2>Teacher Dashboard</h2>
      <ul>
        <li>
          <Link to="/teacher/exam">Exam Management</Link>
        </li>
        <li>
          <Link to="/teacher/student">Student Management</Link>
        </li>
        <li>
          <Link to="/teacher/grading">Grading</Link>
        </li>
        <li>
          <Link to="/teacher/reports">Reports and Statistics</Link>
        </li>
        <li>
          <Link to="/teacher/course">Course Management</Link>
        </li>
      </ul>
    </div>
  );
};

export default Dashboard;
