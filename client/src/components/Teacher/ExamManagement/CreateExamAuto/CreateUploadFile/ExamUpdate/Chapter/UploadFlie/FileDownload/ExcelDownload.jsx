import React from "react";
/* import * as XLSX from "xlsx"; */ //Không có các ánh xạ underline, bold,...
import ExcelJS from "exceljs"; // Đây mới có các ánh xạ
import { saveAs } from "file-saver";
import { FaRegFileExcel } from "react-icons/fa";
import { MdDownload } from "react-icons/md";

//["STT Câu hỏi", "Loại", "Tiêu đề câu hỏi", "Đáp Án A", "Đáp Án B", "Đáp Án C", "Đáp Án D", "Câu trả lời", "Mức độ"]


const examDataSample = {
  chapters: [
    {
      chapterID: 1,
      titleChapter:
        "I. Find the word which has a different sound in the underlined part.",
      questions: [
        {
          questionID: 1,
          type: "trọng âm",
          titleQuestion: "",
          options: [
            "<u>co</u>me",
            "mon<u>th</u>",
            "mo<u>th</u>er",
            "o<u>pe</u>n",
          ],
          answer: "come",
          level: "Dễ",
          optionsDoc: [],
          answerDoc: [],
        },
        {
          questionID: 2,
          type: "trọng âm",
          titleQuestion: "",
          options: [
            "<u>ho</u>pe",
            "ho<u>me</u>work",
            "o<u>ne</u>",
            "po<u>st</u>",
          ],
          answer: "hope",
          level: "Dễ",
          optionsDoc: [],
          answerDoc: [],
        },
      ],
    },
    {
      chapterID: 2,
      titleChapter:
        "II. Choose the word /phrase (A, B, C or D) that best fits the blank space in each sentence",
      questions: [
        {
          questionID: 1,
          type: "điền khuyết",
          titleQuestion: "How____________ money do you have left?",
          options: ["many", "much", "a lot", "lots of"],
          answer: "a lot",
          level: "Dễ",
          optionsDoc: [],
          answerDoc: [],
        },
        {
          questionID: 2,
          type: "điền khuyết",
          titleQuestion: "There aren’t __________ oranges on the table.",
          options: ["much", "any", "some", "an"],
          answer: "much",
          level: "Dễ",
          optionsDoc: [],
          answerDoc: [],
        },
      ],
    },
    {
      chapterID: 3,
      titleChapter:
        "III. Choose the word or phrase among A, B, C or D that best fits the blank space in the following passage.",
      questions: [
        {
          questionID: 1,
          type: "đục lỗ",
          titleQuestion:
            "Global warming is a serious issue that (1) ________ the entire planet. It (2) ________ by the increased levels of greenhouse gases (3) ________ are produced by human activities such as burning fossil fuels and deforestation. As a result, the Earth's temperature (4) ________, leading to melting ice caps, rising sea levels, and extreme weather events. It is important that we (5) ________ action to reduce our carbon footprint and protect the environment.",
          optionsDoc: [
            ["affects", "effects", "affecting", "effecting"],
            ["is caused", "caused", "is causing", "cause"],
            ["which", "that", "who", "whose"],
            ["is rising", "rise", "rises", "rose"],
            ["take", "taking", "taken", "took"],
          ],
          answerDoc: ["affects", "is caused", "that", "is rising", "take"],
          level: "Dễ",
          options: [],
          answer: "",
        },
      ],
    },
    {
      chapterID: 4,
      titleChapter:
        "IV. Rewrite each of the following sentences in another way so that it means almost the same as the sentence printed before it",
      questions: [
        {
          questionID: 1,
          type: "shortAnswer",
          titleQuestion: "She is the fastest runner in the team.",
          options: [],
          answer: "No one in the team runs faster than she does.",
          level: "Dễ",
          optionsDoc: [],
          answerDoc: [],
        },
        {
          questionID: 2,
          type: "shortAnswer",
          titleQuestion: "The book is very interesting.",
          options: [],
          answer: "I find the book very interesting.",
          level: "Dễ",
          optionsDoc: [],
          answerDoc: [],
        },
      ],
    },
  ],
};
const ExcelDownload = () => {
  // Hàm để làm sạch tên sheet (xóa các ký tự không hợp lệ và cắt tên dài hơn 31 ký tự)
  const sanitizeSheetName = (name) => {
    return (
      name
        // eslint-disable-next-line no-useless-escape
        .replace(/[\\\/\?\*\[\]:]/g, "") // Xóa các ký tự không hợp lệ
        .substring(0, 31) // Cắt tên nếu dài hơn 31 ký tự
    );
  };

  // Hàm để phân tích rich text (text có định dạng)
  const parseRichText = (text) => {
    const parts = text.split(/(<u>.*?<\/u>)/).filter(Boolean); // Tách các phần của text có thẻ <u>

    return parts.map((part) => {
      if (part.startsWith("<u>") && part.endsWith("</u>")) {
        return { text: part.replace(/<\/?u>/g, ""), font: { underline: true } }; // Định dạng gạch chân
      } else {
        return { text: part }; // Không định dạng
      }
    });
  };

  // Hàm xử lý khi tải xuống file Excel
  const handleDownload = async () => {
    const workbook = new ExcelJS.Workbook(); // Tạo workbook mới

    examDataSample.chapters.forEach((chapter) => {
      const sheetName = sanitizeSheetName(chapter.titleChapter); // Xử lý tên sheet
      const worksheet = workbook.addWorksheet(sheetName); // Thêm sheet mới với tên đã xử lý

      // Thêm tiêu đề chương ở hàng đầu tiên
      worksheet.addRow([chapter.titleChapter]);

      // Thêm hàng tiêu đề cột
      const header = [
        "STT Câu hỏi",
        "Loại",
        "Tiêu đề câu hỏi",
        "Vị trí đáp án",
        "Đáp Án A",
        "Đáp Án B",
        "Đáp Án C",
        "Đáp Án D",
        "Câu trả lời",
        "Mức độ",
      ];
      worksheet.addRow(header);

      // Thêm các hàng câu hỏi
      chapter.questions.forEach((q) => {
        let row;

        if (q.type === "shortAnswer") { // Nếu câu hỏi dạng trả lời ngắn
          row = [
            q.questionID,
            q.type,
            q.titleQuestion,
            "", // Các giá trị trống cho Đáp Án A, B, C, D
            "",
            "",
            "",
            "",
            {
              richText: [
                { text: q.answer, font: { color: { argb: "000000" } } }, // Định dạng màu chữ đen
              ],
            },
            q.level,
          ];
          worksheet.addRow(row).eachCell({ includeEmpty: true }, (cell, colNumber) => {
            if (colNumber === 9) { // Áp dụng màu nền xanh lá cho ô Câu trả lời
              cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: '00FF00' }, // Màu xanh lá
              };
            }
          });
        } else if (q.type === "đục lỗ") { // Nếu câu hỏi dạng đục lỗ
          worksheet.addRow([
            q.questionID,
            q.type,
            q.titleQuestion,
            "", // Các giá trị trống cho Đáp Án A, B, C, D
            "",
            "",
            "",
            "",
            "",
            q.level,
          ]);

          // Thêm các hàng cho từng tùy chọn đục lỗ
          q.optionsDoc.forEach((options, index) => {
            const optionRow = [
              "", // STT Câu hỏi (trống cho hàng tùy chọn)
              "", // Loại (trống cho hàng tùy chọn)
              "", // Tiêu đề câu hỏi (trống cho hàng tùy chọn)
              `Option ${index + 1}`, // Vị trí đáp án
              ...options, // Đáp Án A, B, C, D
              {
                richText: [
                  {
                    text: q.answerDoc[index] || "", // Câu trả lời
                    font: { color: { argb: "000000" } }, // Định dạng màu chữ đen
                  },
                ],
              },
              "",
            ];
            worksheet.addRow(optionRow).eachCell({ includeEmpty: true }, (cell, colNumber) => {
              if (colNumber === 9) { // Áp dụng màu nền xanh lá cho ô Câu trả lời
                cell.fill = {
                  type: 'pattern',
                  pattern: 'solid',
                  fgColor: { argb: '00FF00' }, // Màu xanh lá
                };
              }
            });
          });
        } else { // Nếu câu hỏi dạng khác
          row = [
            q.questionID,
            q.type,
            q.titleQuestion,
            "",
            ...q.options.map((option) => {
              return { richText: parseRichText(option) }; // Phân tích rich text cho các tùy chọn
            }),
            {
              richText: [
                { text: q.answer, font: { color: { argb: "000000" } } }, // Định dạng màu chữ đen
              ],
            },
            q.level,
          ];
          worksheet.addRow(row).eachCell({ includeEmpty: true }, (cell, colNumber) => {
            if (colNumber === 9) { // Áp dụng màu nền xanh lá cho ô Câu trả lời
              cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: '00FF00' }, // Màu xanh lá
              };
            }
          });
        }
      });
    });

    const buffer = await workbook.xlsx.writeBuffer(); // Tạo buffer từ workbook
    saveAs(new Blob([buffer]), "examDataSample.xlsx"); // Tải file Excel xuống
  };
  

  return (
    <>
      <button
      type="button"
      onClick={handleDownload}
      className="flex items-center justify-center w-full px-4 py-3 rounded-lg text-sm tracking-wider font-medium border border-green-700 dark:border-green-400 outline-none bg-transparent hover:bg-green-700 text-green-700 dark:text-green-400 hover:text-white transition-all duration-300"
    >
      <FaRegFileExcel size={20} className="mr-2" />
      Excel (Tải mẫu)
      <MdDownload size={20} />
    </button>
    </>
  );
};

export default ExcelDownload;
