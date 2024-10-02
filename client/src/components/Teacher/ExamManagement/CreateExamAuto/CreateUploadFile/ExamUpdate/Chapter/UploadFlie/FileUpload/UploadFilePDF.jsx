/* eslint-disable no-loop-func */
import React, { useState, useEffect } from "react";
import * as pdfjsLib from "pdfjs-dist/webpack";

// Set the workerSrc property
pdfjsLib.GlobalWorkerOptions.workerSrc = `//mozilla.github.io/pdf.js/build/pdf.worker.js`;

const UploadFilePdf = ({ sendDataToExam, sendFileToChildrenPdf }) => {
  const [examDataUpload, setExamDataUpload] = useState(null);

  useEffect(() => {
    const processPdf = async (file) => {
      try {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        const numPages = pdf.numPages;

        let textContent = "";
        for (let pageNum = 1; pageNum <= numPages; pageNum++) {
          const page = await pdf.getPage(pageNum);
          const text = await page.getTextContent();
          textContent += text.items
            .map((item) => {
              if (item.hasOwnProperty("font")) {
                // Xem xét thuộc tính font hoặc style ở đây
                // Bạn có thể cần kiểm tra font hoặc kiểu chữ có gạch chân
                console.log("Gach chan")
              }
              return item.str;
            })
            .join("");
        }

        const parsedExamData = parseExamData(textContent);
        console.log("textContent:", textContent);
        setExamDataUpload(parsedExamData);
      } catch (error) {
        console.error("Error processing PDF:", error);
      }
    };

    if (sendFileToChildrenPdf) {
      processPdf(sendFileToChildrenPdf);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sendFileToChildrenPdf]);

  // Hàm phân tích dữ liệu bài thi từ văn bản
  const parseExamData = (text) => {
    const textLines = text
      .replace(/(Chương \d+:)/g, "\n$1")
      .replace(/(Câu hỏi \d+:)/g, "\n$1")
      .replace(/(Mức độ)/g, "\n$1")
      .replace(/(Loại)/g, "\n$1")
      .replace(/(Đáp án)/g, "\n$1")
      .replace(/(Câu trả lời đúng)/g, "\n$1");

    console.log("textLines: ", textLines);

    console.log("text: ", text);
    const chapters = [];

    const lines = textLines.split(/\n/).filter(Boolean);
    console.log("lines: ", lines);

    let currentChapter = null;
    let currentQuestion = null;
    let chapterIDCounter = 1;

    lines.forEach((line) => {
      if (line.startsWith("Chương ")) {
        if (currentChapter) {
          if (currentQuestion) {
            currentChapter.questions.push(currentQuestion);
          }
          chapters.push(currentChapter);
        }
        currentChapter = {
          chapterID: chapterIDCounter++,
          titleChapter: line.replace(/Chương \d+:\s*/, "").trim(),
          questions: [],
        };
        currentQuestion = null;
      } else if (line.startsWith("Câu hỏi ")) {
        if (currentQuestion) {
          currentChapter.questions.push(currentQuestion);
        }
        currentQuestion = {
          questionID: currentChapter.questions.length + 1,
          titleQuestion: line.replace(/Câu hỏi \d+:\s*/, "").trim(),
          options: [],
          optionsDoc: [],
          type: "",
          level: "",
          answer: "",
          answerDoc: [],
        };
      } else if (line.startsWith("Loại: ")) {
        currentQuestion.type = line.replace("Loại: ", "").trim();
      } else if (line.startsWith("Mức độ: ")) {
        currentQuestion.level = line.replace("Mức độ: ", "").trim();
      } else if (
        line.startsWith("Đáp án ") &&
        currentQuestion.type === "đục lỗ"
      ) {
        currentQuestion.optionsDoc.push(parseOptionsDoc(line));
      } else if (line.startsWith("Đáp án ")) {
        currentQuestion.options.push(parseOptionsStress(line));
      } else if (
        line.startsWith("Câu trả lời đúng: ") &&
        currentQuestion.type === "đục lỗ"
      ) {
        currentQuestion.answerDoc = parseOptionsDoc(line);
      } else if (line.startsWith("Câu trả lời đúng: ")) {
        currentQuestion.answer = line.replace("Câu trả lời đúng: ", "").trim();
      }
    });

    if (currentChapter) {
      if (currentQuestion) {
        currentChapter.questions.push(currentQuestion);
      }
      chapters.push(currentChapter);
    }

    return { chapters };
  };

  // Hàm lấy giá trị và đưa vào mảng
  const parseOptionsDoc = (line) => {
    const matchOptionDoc = line.match(/Đáp án \d+: (.*)/);
    const matchAnswer = line.match(/Câu trả lời đúng: (.*)/);

    if (matchOptionDoc) {
      const optionsString = matchOptionDoc[1].trim(); // Lấy phần lựa chọn sau "Đáp án x: "
      const options = optionsString.split(/,\s*/).map((option) => {
        const trimmedOption = option.trim();
        // Loại bỏ "a)", "b)", "c)", "d)" và khoảng trắng xung quanh
        return trimmedOption.substring(trimmedOption.indexOf(")") + 2).trim();
      });
      return options;
    } else if (matchAnswer) {
      const answersString = matchAnswer[1].trim(); // Lấy phần câu trả lời sau "Câu trả lời đúng: "
      const answers = answersString.split(",").map((answer) => answer.trim());
      return answers;
    }
    return [];
  };

  // Gạch chân
  const parseOptionsStress = (line) => {
    const match = line.match(/Đáp án \d+: (.*)/);
    if (match) {
      let optionsString = match[1].trim();

      // Thêm tag <u> vào các từ được gạch chân
      const parser = new DOMParser();
      const doc = parser.parseFromString(optionsString, "text/html");
      const underlinedWords = doc.getElementsByTagName("u");

      for (let word of underlinedWords) {
        word.outerHTML = `<u>${word.textContent}</u>`;
      }

      return doc.body.innerHTML;
    }
    return [];
  };

  // In đậm
  /* const parseBold = (line) => {
    // Thay thế các thẻ <strong> bằng thẻ <b>
    const replacedString = line.replace(
      /<strong>Chương \d+: ([IVXLCDM]+\..+?)<\/strong>/g,
      "$1"
    ); // '<b>$1</b>'

    return replacedString;
  }; */

  /* console.log("examDataUpload: ", JSON.stringify(examDataUpload, null, 2));
   */
  // Sử dụng useEffect để gọi sendDataToExam khi examDataUpload thay đổi
  useEffect(() => {
    if (examDataUpload !== null) {
      sendDataToExam(examDataUpload);
      return;
    }
  }, [examDataUpload, sendDataToExam]);

  return (
    <div>
      <p>Processing PDF file...</p>
    </div>
  );
};

export default UploadFilePdf;
