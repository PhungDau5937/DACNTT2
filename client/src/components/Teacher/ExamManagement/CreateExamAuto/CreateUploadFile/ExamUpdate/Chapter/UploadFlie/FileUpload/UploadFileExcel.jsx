import React, { useEffect, useState } from "react";
import ExcelJS from "exceljs"; // Thư viện dùng để làm việc với file Excel

const UploadFileExcel = ({ sendDataToExam, sendFileToChildrenExcel }) => {
  const [examDataSample, setExamDataSample] = useState(null);
  const [dataSent, setDataSent] = useState(false); // Trạng thái để theo dõi xem dữ liệu đã được gửi chưa

  // Hàm parseRichText dùng để xử lý văn bản có các ánh xạ(u,i,b) cho câu hỏi
  const parseRichText = (dataOption) => {
    if (!Array.isArray(dataOption.richText)) {
      return dataOption || ""; // Trả về văn bản trực tiếp nếu không phải là mảng
    }

    // Chuyển đổi các phần của văn bản phong phú thành HTML
    const richTextChange = dataOption.richText
      .map((part) => {
        let text = part.text || ""; // Đặt văn bản thành chuỗi rỗng nếu văn bản không được xác định

        if (part.font) {
          if (part.font.bold) text = `<b>${text}</b>`; // Xử lý văn bản đậm
          if (part.font.italic) text = `<i>${text}</i>`; // Xử lý văn bản nghiêng
          if (part.font.underline) text = `<u>${text}</u>`; // Xử lý văn bản gạch chân
          if (part.font.color && part.font.color.argb) {
            text = `${text}`;
          }
        }

        return text;
      })
      .join(""); // Nối tất cả các phần thành một chuỗi

    return richTextChange;
  };

  useEffect(() => {
    // Hàm xử lý file khi được upload
    const handleFileUpload = async (file) => {
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(file); // Tải file Excel

      const chapters = []; // Mảng lưu trữ các chương

      // Duyệt qua từng sheet trong workbook
      workbook.eachSheet((worksheet, sheetId) => {
        const chapter = {
          chapterID: sheetId, // ID của sheet
          titleChapter: worksheet.name, // Tên của sheet
          questions: [], // Mảng lưu trữ các câu hỏi trong chương
        };

        let isFirstRow = true; // Biến để kiểm tra hàng đầu tiên

        let currentQuestion = null; // Biến để theo dõi câu hỏi hiện tại cho loại "đục lỗ"
        let optionsDoc = []; // Mảng lưu trữ các tùy chọn cho loại câu hỏi "đục lỗ"
        let answerDoc = []; // Mảng lưu trữ các đáp án cho loại câu hỏi "đục lỗ"

        // Duyệt qua từng hàng trong worksheet
        worksheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
          if (isFirstRow) {
            // Nếu là hàng đầu tiên, thiết lập titleChapter
            chapter.titleChapter = row.values[1] || worksheet.name;
            isFirstRow = false; // Đặt biến kiểm tra là false
            return; // Bỏ qua hàng đầu tiên
          }

          const cells = row.values; // Lấy giá trị của các ô trong hàng
          const questionType = cells[2]; // Lấy loại câu hỏi từ cột thứ 3

          // Kiểm tra số lượng cột dữ liệu
          if (cells.length < 11) {
            console.warn(`Hàng ${rowNumber} không có đủ cột dữ liệu.`);
            return;
          }

          // Xử lý các loại câu hỏi
          if (questionType === "shortAnswer" || questionType === "trọng âm") {
            // Xử lý loại câu hỏi "shortAnswer" và "trọng âm"
            const question = {
              questionID: cells[1],
              type: cells[2],
              titleQuestion: cells[3],
              options: [cells[5], cells[6], cells[7], cells[8]].map(
                parseRichText
              ),
              answer: parseRichText(cells[9]),
              level: cells[10],
              optionsDoc: [],
              answerDoc: [],
            };
            chapter.questions.push(question); // Thêm câu hỏi vào chương
          } else if (questionType === "điền khuyết") {
            // Xử lý loại câu hỏi "điền khuyết"
            const question = {
              questionID: cells[1], // ID câu hỏi
              type: cells[2], // Loại câu hỏi
              titleQuestion: cells[3], // Nội dung câu hỏi
              options: [cells[5], cells[6], cells[7], cells[8]].map(
                parseRichText
              ), // Xử lý các tùy chọn phong phú
              answer: parseRichText(cells[9]), // Đáp án
              level: cells[10], // Mức độ
              optionsDoc: [], // Mảng chứa tài liệu tùy chọn (để trống cho loại câu hỏi khác)
              answerDoc: [], // Mảng chứa tài liệu đáp án (để trống cho loại câu hỏi khác)
            };
            chapter.questions.push(question); // Thêm câu hỏi vào chương
          } else if (questionType === "đục lỗ") {
            // Xử lý loại câu hỏi "đục lỗ"
            if (currentQuestion) {
              // Nếu có câu hỏi hiện tại, cập nhật và thêm vào chương
              currentQuestion.optionsDoc = optionsDoc;
              currentQuestion.answerDoc = answerDoc;
              chapter.questions.push(currentQuestion);
            }

            // Khởi tạo câu hỏi mới
            currentQuestion = {
              questionID: cells[1],
              type: cells[2],
              titleQuestion: cells[3],
              options: [],
              answer: "",
              level: cells[10],
              optionsDoc: [],
              answerDoc: [],
            };

            optionsDoc = []; // Làm rỗng mảng tùy chọn
            answerDoc = []; // Làm rỗng mảng đáp án

            // Xử lý các tùy chọn và đáp án từ các hàng tiếp theo
            const startRow = rowNumber + 1;
            for (let i = startRow; i < startRow + 5; i++) {
              const optionRow = worksheet.getRow(i);
              if (!optionRow) break;

              const options = optionRow.values.slice(5, 9); // Lấy các tùy chọn từ các cột
              const answer = optionRow.values[9]; // Lấy đáp án từ cột
              optionsDoc.push(options); // Thêm tùy chọn vào optionsDoc
              answerDoc.push(parseRichText(answer)); // Thêm đáp án vào answerDoc
            }
          } else {
            // Xử lý các loại câu hỏi khác hoặc bỏ qua
          }
        });

        // Thêm câu hỏi cuối cùng nếu có
        if (currentQuestion) {
          currentQuestion.optionsDoc = optionsDoc;
          currentQuestion.answerDoc = answerDoc;
          chapter.questions.push(currentQuestion);
        }

        chapters.push(chapter); // Thêm chương vào mảng chapters
      });

      console.log("chapters: ", { chapters }); // In mảng các chương để kiểm tra
      setExamDataSample({ chapters }); // Lưu dữ liệu vào state examDataSample
    };

    if (sendFileToChildrenExcel) {
      handleFileUpload(sendFileToChildrenExcel); // Xử lý file nếu có
    }
  }, [sendFileToChildrenExcel]);

  /* useEffect(() => {
    // Hàm xử lý file khi được upload
    const handleFileUpload = async (file) => {
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(file); // Tải file Excel

      const chapters = []; // Mảng để lưu trữ các chương

      // Duyệt qua từng sheet trong workbook
      workbook.eachSheet((worksheet, sheetId) => {
        const chapter = {
          chapterID: sheetId, // ID của sheet
          titleChapter: worksheet.name, // Tên của sheet
          questions: [], // Mảng để lưu trữ các câu hỏi trong chương
        };

        let isFirstRow = true; // Biến kiểm tra xem hàng hiện tại có phải là hàng đầu tiên không

        // Duyệt qua từng hàng trong worksheet
        worksheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
          if (isFirstRow) {
            // Nếu là hàng đầu tiên, thiết lập titleChapter
            chapter.titleChapter = row.values[1] || worksheet.name; // Sử dụng giá trị từ cột đầu tiên của hàng đầu tiên
            isFirstRow = false; // Đặt biến kiểm tra là false để bỏ qua hàng đầu tiên trong các vòng lặp tiếp theo
            return; // Bỏ qua hàng tiêu đề
          }

          const cells = row.values; // Lấy giá trị của các ô trong hàng
          const questionType = cells[2]; // Lấy loại câu hỏi từ cột thứ 3

          // Kiểm tra xem hàng có đủ số cột yêu cầu không
          if (cells.length < 11) {
            console.warn(`Hàng ${rowNumber} không có đủ cột dữ liệu.`);
            return;
          }

          let question;

          // Xử lý câu hỏi theo loại
          if (questionType === "shortAnswer") {
            question = {
              questionID: cells[1], // ID câu hỏi
              type: cells[2], // Loại câu hỏi
              titleQuestion: cells[3], // Nội dung câu hỏi
              options: [], // Mảng chứa các tùy chọn (để trống cho loại câu hỏi ngắn)
              answer: cells[9], // Đáp án
              level: cells[10], // Mức độ
              optionsDoc: [], // Mảng chứa tài liệu tùy chọn (để trống cho loại câu hỏi ngắn)
              answerDoc: [], // Mảng chứa tài liệu đáp án (để trống cho loại câu hỏi ngắn)
            };
          } else if (questionType === "đục lỗ") {
            question = {
              questionID: cells[1], // ID câu hỏi
              type: cells[2], // Loại câu hỏi
              titleQuestion: cells[3], // Nội dung câu hỏi
              options: [], // Mảng chứa các tùy chọn (để trống cho loại câu hỏi đục lỗ)
              answer: "", // Đáp án (để trống cho loại câu hỏi đục lỗ)
              level: cells[10], // Mức độ
              optionsDoc: [], // Mảng chứa tài liệu tùy chọn
              answerDoc: [], // Mảng chứa tài liệu đáp án
            };

            // Xử lý tùy chọn và đáp án cho loại câu hỏi đục lỗ
            const startRow = rowNumber + 1; // Dòng bắt đầu chứa tùy chọn
            for (let i = startRow; i < startRow + 5; i++) {
              const optionRow = worksheet.getRow(i); // Lấy hàng tùy chọn
              if (!optionRow) break;

              const options = optionRow.values.slice(5, 9); // Lấy các tùy chọn từ các cột
              const answer = optionRow.values[9]; // Lấy đáp án từ cột
              question.optionsDoc.push(options); // Thêm tùy chọn vào optionsDoc
              question.answerDoc.push(parseRichText(answer)); // Thêm đáp án vào answerDoc
            }
          } else if (questionType === "trọng âm") {
            question = {
              questionID: cells[1], // ID câu hỏi
              type: cells[2], // Loại câu hỏi
              titleQuestion: cells[3], // Nội dung câu hỏi
              options: [cells[5], cells[6], cells[7], cells[8]].map(
                parseRichText
              ), // Xử lý các tùy chọn phong phú
              answer: parseRichText(cells[9]), // Đáp án
              level: cells[10], // Mức độ
              optionsDoc: [], // Mảng chứa tài liệu tùy chọn (để trống cho loại câu hỏi khác)
              answerDoc: [], // Mảng chứa tài liệu đáp án (để trống cho loại câu hỏi khác)
            };
          } else {
            question = {
              questionID: cells[1], // ID câu hỏi
              type: cells[2], // Loại câu hỏi
              titleQuestion: cells[3], // Nội dung câu hỏi
              options: [cells[5], cells[6], cells[7], cells[8]].map(parseRichText), // Xử lý các tùy chọn phong phú
              answer: parseRichText(cells[9]), // Đáp án
              level: cells[10], // Mức độ
              optionsDoc: [], // Mảng chứa tài liệu tùy chọn (để trống cho loại câu hỏi khác)
              answerDoc: [], // Mảng chứa tài liệu đáp án (để trống cho loại câu hỏi khác)
            };
          }

          // Kiểm tra và bỏ qua các câu hỏi chứa giá trị mặc định
          if (
            question.questionID === "STT Câu hỏi" &&
            question.type === "Loại" &&
            question.titleQuestion === "Tiêu đề câu hỏi" &&
            question.options.every((opt) =>
              ["Đáp Án A", "Đáp Án B", "Đáp Án C", "Đáp Án D"].includes(opt)
            ) &&
            question.answer === "Câu trả lời" &&
            question.level === "Mức độ"
          ) {
            return; // Bỏ qua câu hỏi nếu có giá trị mặc định
          }

          chapter.questions.push(question); // Thêm câu hỏi vào chương
        });

        chapters.push(chapter); // Thêm chương vào mảng chapters
      });

      console.log("chapters: ", { chapters }); // In ra mảng các chương để kiểm tra

      setExamDataSample({ chapters }); // Lưu dữ liệu vào state examDataSample
    };

    if (sendFileToChildrenExcel) {
      handleFileUpload(sendFileToChildrenExcel); // Xử lý file nếu có
    }
  }, [sendFileToChildrenExcel]); */

  useEffect(() => {
    // Gửi dữ liệu tới parent component khi examDataSample thay đổi và chưa được gửi
    if (examDataSample && sendDataToExam && !dataSent) {
      sendDataToExam(examDataSample);
      setDataSent(true); // Đánh dấu dữ liệu là đã gửi
    }
  }, [examDataSample, sendDataToExam, dataSent]);

  return (
    <div>
      <p>Processing Excel file...</p>{" "}
      {/* Hiển thị thông báo đang xử lý file Excel */}
    </div>
  );
};

export default UploadFileExcel;
