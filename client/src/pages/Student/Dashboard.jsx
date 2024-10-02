// Dashboard.jsx (Student Dashboard)

import React from "react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  return (
    <div>
      <h2>Student Dashboard</h2>
      <ul>
        <li>
          <Link to="/mycourses">My Courses</Link>
        </li>
        <li>
          <Link to="/examsassignments">Exams and Assignments</Link>
        </li>
        <li>
          <Link to="/learningmaterials">Learning Materials</Link>
        </li>
        <li>
          <Link to="/profile">Profile</Link>
        </li>
        <li>
          <Link to="/discussionandsupport">Discussion and Support</Link>
        </li>
        <li>
          <Link to="/notifications">Notifications</Link>
        </li>
      </ul>
    </div>
  );
};

export default Dashboard;
