/* eslint-disable no-undef */
import React, { useState } from "react";
import { MdDownload } from "react-icons/md";
import { FaRegFileWord } from "react-icons/fa";

import { saveAs } from "file-saver";
import { Document, Packer, Paragraph, TextRun } from "docx";
import FileUpload from "../FileUpload/FileUpload";
import ExcelDownload from "./ExcelDownload";

const WordDownload = ({ closeUploadFile, sendChapterToExam }) => {
  // Example exam data
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

  const handleDownload = () => {
    try {
      // Khởi tạo một tài liệu mới
      const doc = new Document({
        sections: [],
      });

      // Kiểm tra tính hợp lệ của dữ liệu đề thi
      if (
        !examDataSample ||
        !examDataSample.chapters ||
        examDataSample.chapters.length === 0
      ) {
        console.error("Dữ liệu câu hỏi không hợp lệ");
        return;
      }

      // Mảng để lưu trữ các đoạn văn bản của tài liệu
      const paragraphs = [];

      // Duyệt qua từng chương trong đề thi
      examDataSample.chapters.forEach((chapter, chapterIndex) => {
        // Thêm tiêu đề của chương vào tài liệu
        paragraphs.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `Chương ${chapterIndex + 1}: ${chapter.titleChapter}`,
                bold: true,
              }),
            ],
            heading: {
              level: 1,
            },
            spacing: { after: 300 }, // Thay đổi giá trị này để điều chỉnh khoảng cách
          })
        );

        // Duyệt qua từng câu hỏi trong chương
        chapter.questions.forEach((question, questionIndex) => {
          // Mảng để lưu trữ nội dung của câu hỏi
          const questionContent = [];

          // Thêm tiêu đề câu hỏi vào tài liệu
          questionContent.push(
            new Paragraph({
              text: `Câu hỏi ${questionIndex + 1}: ${question.titleQuestion}`,
              heading: {
                level: 2,
              },
              spacing: { after: 200 }, // Thay đổi giá trị này để điều chỉnh khoảng cách
            })
          );

          // Thêm loại câu hỏi vào tài liệu
          questionContent.push(
            new Paragraph({
              text: `Loại: ${question.type}`,
              spacing: { after: 100 }, // Thay đổi giá trị này để điều chỉnh khoảng cách
            })
          );

          // Thêm mức độ câu hỏi vào tài liệu
          questionContent.push(
            new Paragraph({
              text: `Mức độ: ${question.level}`,
              spacing: { after: 100 }, // Thay đổi giá trị này để điều chỉnh khoảng cách
            })
          );

          /* Xử lý tag <u> */
          const parseOptions = (options) => {
            return options.map((option) => {
              const parts = option.split(/(<u>|<\/u>)/).filter(Boolean);
              return parts.map((part) => {
                if (part === "<u>") return { type: "startUnderline" };
                if (part === "</u>") return { type: "endUnderline" };
                return { text: part };
              });
            });
          };

          const handleOptions = (options) => {
            options.forEach((option, optionIndex) => {
              const parsedOption = parseOptions([option]).flat();
              const children = [];
              let isUnderline = false;
              parsedOption.forEach((part) => {
                if (part.type === "startUnderline") {
                  isUnderline = true;
                } else if (part.type === "endUnderline") {
                  isUnderline = false;
                } else {
                  children.push(
                    new TextRun({
                      text: part.text,
                      underline: isUnderline ? {} : undefined,
                    })
                  );
                }
              });
              questionContent.push(
                new Paragraph({
                  children: [
                    new TextRun({ text: `Đáp án ${optionIndex + 1}: ` }),
                    ...children,
                  ],
                  spacing: { after: 100 },
                })
              );
            });
          };
          /* Xử lý tag <u> */

          // Xử lý các lựa chọn dựa trên loại câu hỏi
          if (question.type === "đục lỗ") {
            // Thêm các lựa chọn với câu trả lời đúng
            question.optionsDoc.forEach((optionGroup, optionIndex) => {
              const optionsText = optionGroup
                .map(
                  (option, innerOptionIndex) =>
                    `${String.fromCharCode(97 + innerOptionIndex)}) ${option}`
                )
                .join(", ");

              questionContent.push(
                new Paragraph({
                  text: `Đáp án ${optionIndex + 1}: ${optionsText}`,
                  spacing: { after: 100 }, // Thay đổi giá trị này để điều chỉnh khoảng cách
                })
              );
            });

            // Thêm câu trả lời đúng
            const correctAnswers = question.answerDoc
              .map((answerIndex) => `${parseInt(answerIndex) + 1}`)
              .join(", ");

            questionContent.push(
              new Paragraph({
                text: `Câu trả lời đúng: ${correctAnswers}`,
                spacing: { after: 500 }, // Thay đổi giá trị này để điều chỉnh khoảng cách
              })
            );
          } else if (question.type === "trọng âm") {
            handleOptions(question.options);
            questionContent.push(
              new Paragraph({
                text: `Câu trả lời đúng: ${question.answer.toString()}`,
                spacing: { after: 500 },
              })
            );
          } else {
            // Thêm các lựa chọn cho các loại câu hỏi khác
            question.options.forEach((option, optionIndex) => {
              questionContent.push(
                new Paragraph({
                  text: `Đáp án ${optionIndex + 1}: ${option}`,
                  spacing: { after: 100 }, // Thay đổi giá trị này để điều chỉnh khoảng cách
                })
              );
            });

            // Thêm câu trả lời đúng
            questionContent.push(
              new Paragraph({
                text: `Câu trả lời đúng: ${question.answer.toString()}`,
                spacing: { after: 500 }, // Thay đổi giá trị này để điều chỉnh khoảng cách
              })
            );
          }

          // Thêm nội dung của câu hỏi vào paragraphs
          paragraphs.push(...questionContent);
        });
      });

      // Thêm toàn bộ các đoạn văn bản vào tài liệu
      doc.addSection({
        properties: {},
        children: paragraphs,
      });

      /* alert("đã tải"); */

      // Sinh và lưu tài liệu
      Packer.toBlob(doc).then((blob) => {
        saveAs(blob, "Sample_Exam.docx");
      });
    } catch (error) {
      console.error("Lỗi khi khởi tạo tài liệu:", error);
    }
  };

  const [dataFromUploadFile, setDataFromUploadFile] = useState("");
  // Hiện tại dataFromUploadFile là: data đã được Upload từ file

  // Hàm lấy data(các chương) từ UploadFileWord.jsx
  const handleDataFromUpload = (data) => {
    setDataFromUploadFile(data);
  };

  const sendChapterToExamClick = () => {
    sendChapterToExam(dataFromUploadFile);
  };

  console.log("Data Upload gửi qua: ", dataFromUploadFile)

  return (
    <div className="fixed backdrop-blur-md inset-0 p-4 flex flex-wrap justify-center items-center w-full h-full z-[1000] behtmlFore:fixed behtmlFore:inset-0 behtmlFore:w-full behtmlFore:h-full behtmlFore:bg-[rgba(0,0,0,0.5)] overflow-auto font-[sans-serif]">
      <div className="w-full max-w-lg bg-white shadow-lg rounded-lg p-6 relative">
        <div className="flex items-center pb-3 border-b border-gray-200">
          <div className="flex-1">
            <h3 className="text-gray-800 text-xl font-bold">Upload File</h3>
            <p className="text-gray-600 text-xs mt-1">
              Upload file to this project
            </p>
          </div>

          <button type="button" onClick={closeUploadFile}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-3 ml-2 cursor-pointer shrink-0 fill-gray-400 hover:fill-red-500"
              viewBox="0 0 320.591 320.591"
            >
              <path
                d="M30.391 318.583a30.37 30.37 0 0 1-21.56-7.288c-11.774-11.844-11.774-30.973 0-42.817L266.643 10.665c12.246-11.459 31.462-10.822 42.921 1.424 10.362 11.074 10.966 28.095 1.414 39.875L51.647 311.295a30.366 30.366 0 0 1-21.256 7.288z"
                data-original="#000000"
              ></path>
              <path
                d="M287.9 318.583a30.37 30.37 0 0 1-21.257-8.806L8.83 51.963C-2.078 39.225-.595 20.055 12.143 9.146c11.369-9.736 28.136-9.736 39.504 0l259.331 257.813c12.243 11.462 12.876 30.679 1.414 42.922-.456.487-.927.958-1.414 1.414a30.368 30.368 0 0 1-23.078 7.288z"
                data-original="#000000"
              ></path>
            </svg>
          </button>
        </div>

        <FileUpload sendDataToExam={handleDataFromUpload} />

        <div className="flex items-center bg-gray-50 p-4 rounded-lg mt-4 gap-2">
          <button
            type="button"
            onClick={handleDownload}
            className="flex items-center justify-center w-[50%] px-2 py-2.5 rounded-lg text-sm tracking-wider font-medium border border-blue-700 outline-none bg-transparent hover:bg-blue-700 text-blue-700 hover:text-white transition-all duration-300"
          >
            <FaRegFileWord size={20} className="mr-2" />
            Word (Tải mẫu)
            <MdDownload size={30} />
          </button>

          <ExcelDownload />
        </div>

        <div className="border-t border-gray-200 pt-6 flex justify-between gap-4 mt-6">
          <button
            type="button"
            className="w-full px-4 py-2 rounded-lg text-gray-800 text-sm border-none outline-none tracking-wide bg-gray-200 hover:bg-gray-300 active:bg-gray-200"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              sendChapterToExamClick();
              closeUploadFile();
            }}
            className="w-full px-4 py-2 rounded-lg text-white text-sm border-none outline-none tracking-wide bg-blue-600 hover:bg-blue-700 active:bg-blue-600"
          >
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  );
};

export default WordDownload;
