/* eslint-disable no-undef */
import React, { useState } from "react";
import { MdDownload } from "react-icons/md";
import { FaRegFileWord } from "react-icons/fa";

import { saveAs } from "file-saver";
import { Document, Packer, Paragraph, TextRun } from "docx";
import FileUpload from "../FileUpload/FileUpload";
import ExcelDownload from "./ExcelDownload";

const WordDownload = ({ addDataUploadToChaptersIndex, openDetailUpload, closeShowUpdateFile, sendChapterToExam, dataFormUploadIndex }) => {
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
              .map((answerDocChild) => `${answerDocChild}`)
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
    console.log("data send to ulf:", data)

    setDataFromUploadFile(data);
  };

  const sendChapterToExamClick = () => {


    sendChapterToExam(dataFromUploadFile);
    addDataUploadToChaptersIndex(dataFromUploadFile);
  };

  console.log("Data Upload gửi qua: ", dataFromUploadFile)

  return (
    <div className="container mx-auto p-6 bg-white shadow rounded-lg min-h-96 dark:bg-stone-800">
      <header className="flex min-w-full flex-col sm:flex-row justify-between items-start pb-4 border-b border-stone-300 dark:border-stone-600">
        <div>
          <h3 className="text-gray-800 text-xl font-bold dark:text-white">Upload File</h3>
          <p className="text-gray-600 text-xs mt-1 dark:text-gray-400">
            Upload file to this project
          </p>
        </div>
      </header>
      <FileUpload sendDataToExam={handleDataFromUpload} />
      {/* <div className="container mx-auto  bg-white shadow rounded-lg min-h-96 dark:bg-stone-800"> */}
        <div className="flex text-sm justify-between flex-col sm:flex-row rounded-lg mt-4 gap-2">
          <button
            type="button"
            onClick={handleDownload}
            className="flex items-center justify-center w-full px-4 py-3 rounded-lg text-sm tracking-wider font-medium border border-blue-700 dark:border-blue-400 outline-none bg-transparent hover:bg-blue-700 text-blue-700 dark:text-blue-400 hover:text-white transition-all duration-300"
          >
            <FaRegFileWord size={20} className="mr-2" />
            Word (Tải mẫu)
            <MdDownload size={20} className="ml-2" />
          </button>
          <ExcelDownload />
        </div>
      {/* </div> */}
      <div className="border-t border-stone-300 pt-6 flex flex-col sm:flex-row justify-between gap-4 mt-6 dark:border-stone-600">
        <button
          type="button"
          onClick={() => {
            if (dataFromUploadFile === "") {
              alert("No data uploaded");
              return;
            } else {
              sendChapterToExamClick();
              openDetailUpload();
            }

          }}
          className="w-full sm:w-auto px-4 py-2 rounded-lg text-white text-sm border-none bg-blue-600 hover:bg-blue-700 active:bg-blue-600 dark:bg-blue-500 dark:hover:bg-blue-600"
        >
          Confirm
        </button>
      </div>
    </div>


  );

};

export default WordDownload;
