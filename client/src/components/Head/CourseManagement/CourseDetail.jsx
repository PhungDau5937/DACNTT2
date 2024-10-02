import React from 'react';
import { Link, useParams } from 'react-router-dom';

const CourseDetail = ({ courses }) => {
  const { courseId } = useParams();
  const course = courses.find((c) => c.id === courseId);

  if (!course) {
    return <div>Khóa học không tồn tại</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">{course.name} - {course.year}</h2>
      <h3 className="text-xl font-bold mb-2">Danh sách lớp học</h3>
      <ul>
        {course.classes.map((classItem) => (
          <li key={classItem.id} className="mb-2">
            <Link to={`/class/${classItem.id}`} className="text-blue-500 hover:underline">
              {classItem.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CourseDetail;