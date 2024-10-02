import React, { useState } from "react";
import CreateExam from "../CreateExam";

const ExamData = () => {
  const [examData, setExamData] = useState(null);

  const getExamData =  (data) => {
    console.log("Json:",data)
    setExamData(data);
  };

  const dataJson = JSON.stringify(examData, null, 2);
  console.log("Data Json: ",dataJson);

  return (
    <div className="examData">
      <div className="jsonData">
        <div className="wrapper">
          <p>Data Exam Json</p>
          <div className="border-4">{examData}</div>
          <CreateExam submitExam={getExamData}/>
        </div>
      </div>
    </div>
  );
};

export default ExamData;
