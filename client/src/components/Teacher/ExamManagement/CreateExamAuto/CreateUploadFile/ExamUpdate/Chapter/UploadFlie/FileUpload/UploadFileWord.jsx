import React, { useState, useEffect } from "react";

import mammoth from "mammoth";

const UploadFileWord = ({ sendDataToExam, sendFileToChildrenWord }) => {
  // State để lưu trữ dữ liệu bài thi được tải lên
  const [examDataUpload, setExamDataUpload] = useState(null);

  // Hàm xử lý khi tải file lên
  useEffect(() => {
    if (sendFileToChildrenWord) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const arrayBuffer = e.target.result;
        const result = await mammoth.convertToHtml(
          { arrayBuffer, includeDefaultStyleMap: true },
          {
            styleMap: [
              "p[style-name='Heading 1'] => h1:fresh",
              "p[style-name='Heading 2'] => h2:fresh",
              "b => strong",
              "i => em",
              "u => u",
              "p => p:fresh",
              "br => br",
            ],
          }
        );
        const text = result.value;
        const parsedExamData = parseExamData(text);
        setExamDataUpload(parsedExamData);
      };
      reader.readAsArrayBuffer(sendFileToChildrenWord);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sendFileToChildrenWord]);

  
  // Hàm phân tích dữ liệu bài thi từ văn bản
  const parseExamData = (text) => {
    const chapters = []; // Mảng để lưu trữ các chương
  
    const lines = text.split(/<\/?p>/).filter(Boolean); // Tách văn bản thành các dòng
  
    let currentChapter = null; // Biến tạm để lưu chương hiện tại
    let currentQuestion = null; // Biến tạm để lưu câu hỏi hiện tại
  
    let chapterIDCounter = 1; // Biến đếm chapterID, bắt đầu từ 1
  
    lines.forEach((line) => {
      /* Chapters */
      if (line.startsWith("<strong>Chương ")) {
        if (currentChapter) {
          if (currentQuestion) {
            currentChapter.questions.push(currentQuestion); // Thêm câu hỏi cuối cùng vào chương nếu có
          }
          chapters.push(currentChapter); // Thêm chương hiện tại vào mảng nếu có
        }
        currentChapter = {
          chapterID: chapterIDCounter++,
          titleChapter: parseBold(line).replace("Chương ", "").trim(), // Lấy nội dung của chương
          questions: [], // Mảng để lưu các câu hỏi
        };
        currentQuestion = null; // Đặt lại biến câu hỏi hiện tại khi chuyển sang chương mới
  
        // Reset questionIDCounter for the new chapter
        currentChapter.questionIDCounter = 1;
      } else if (line.startsWith("Câu hỏi ")) {
        if (currentQuestion) {
          currentChapter.questions.push(currentQuestion); // Thêm câu hỏi hiện tại vào chương nếu có
        }
        currentQuestion = {
          questionID: currentChapter.questionIDCounter++, // Gán ID cho câu hỏi và tăng lên
          titleQuestion: line.replace(/Câu hỏi \d+:\s*/, "").trim(), // Lấy nội dung câu hỏi
          options: [], // Mảng để lưu các lựa chọn
          optionsDoc: [], // Mảng để lưu các đáp án dạng đục lỗ
          type: "", // Biến để lưu loại câu hỏi
          level: "", // Biến để lưu mức độ câu hỏi
          answer: "", // Biến để lưu câu trả lời đúng
          answerDoc: [], // Mảng để lưu các đáp án đúng dạng đục lỗ
        };
      } else if (line.startsWith("Loại: ")) {
        currentQuestion.type = line.replace("Loại: ", "").trim(); // Thêm lựa chọn vào mảng
      } else if (line.startsWith("Mức độ: ")) {
        currentQuestion.level = line.replace("Mức độ: ", "").trim(); // Thêm lựa chọn vào mảng
      } else if (
        line.startsWith("Đáp án ") &&
        currentQuestion.type === "đục lỗ"
      ) {
        currentQuestion.optionsDoc.push(parseOptionsDoc(line.trim())); // Thêm đáp án vào mảng optionsDoc
      } else if (line.startsWith("Đáp án ")) {
        currentQuestion.options.push(parseOptionsStress(line.trim())); // Thêm lựa chọn vào mảng
      } else if (
        line.startsWith("Câu trả lời đúng: ") &&
        currentQuestion.type === "đục lỗ"
      ) {
        const parsedAnswers = parseOptionsDoc(line.trim());
        parsedAnswers.forEach((answer) => {
          currentQuestion.answerDoc.push(answer);
        });
      } else if (line.startsWith("Câu trả lời đúng: ")) {
        currentQuestion.answer = line.replace("Câu trả lời đúng: ", "").trim(); // Lấy câu trả lời đúng
      }
    });
  
    // Sau khi duyệt hết các dòng, cần thêm câu hỏi và chương cuối cùng vào mảng
    if (currentChapter) {
      if (currentQuestion) {
        currentChapter.questions.push(currentQuestion); // Thêm câu hỏi cuối cùng vào chương nếu có
      }
      chapters.push(currentChapter); // Thêm chương cuối cùng vào mảng nếu có
    }
  
    return { chapters }; // Trả về đối tượng chứa mảng các chương
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
  const parseBold = (line) => {
    // Thay thế các thẻ <strong> bằng thẻ <b>
    const replacedString = line.replace(
      /<strong>Chương \d+: ([IVXLCDM]+\..+?)<\/strong>/g,
      "$1"
    ); // '<b>$1</b>'

    return replacedString;
  };

  /* console.log("examDataUpload: ", JSON.stringify(examDataUpload, null, 2));
 */
  // Sử dụng useEffect để gọi sendDataToExam khi examDataUpload thay đổi
  useEffect(() => {
    if (examDataUpload !== null) {
      sendDataToExam(examDataUpload);
      return;
    }
  }, [examDataUpload, sendDataToExam]);

};

export default UploadFileWord;
