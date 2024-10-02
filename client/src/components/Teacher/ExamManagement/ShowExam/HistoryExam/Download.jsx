import React from 'react';
import { saveAs } from 'file-saver';
import { jsPDF } from 'jspdf';

const Download = ({ exam }) => {
    const handleDownload = () => {
        // Convert the exam object to JSON string
        const examJson = JSON.stringify(exam);

        // Create a Blob object with the JSON data
        const blob = new Blob([examJson], { type: 'application/json' });

        // Save the Blob object as a file
        saveAs(blob, 'exam.json');
    };

    return (
        <button onClick={handleDownload}>Download Exam</button>
    );
};

export default Download;