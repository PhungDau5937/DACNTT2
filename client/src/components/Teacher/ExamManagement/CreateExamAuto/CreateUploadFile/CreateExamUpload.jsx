// eslint-disable-next-line no-unused-vars
import React from "react";
import ExamUpdate from "./ExamUpdate/ExamUpdate"; // import để chuyển Exam có Id tương ứng từ client

// import "./CreateExam.css";

const CreateExamUpload = ({ dataFormUploadIndex }) => {
  const examForID = {
    examID: 1,
    titleExam: "Bài thi lớp 10 trường THPT Lê Quý Đôn năm học 2023-2024",
    classExam: "Tiếng anh lớp 10",
    time: "45 phút",
    score: "10",
    description:
      "Đề thi được các thầy cô trong ban quản trị nhà trường ra đề với các câu hỏi vừa sức cho học sinh và đúng chuyên môn.",
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
            answer: "0",
            level: "Dễ",
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
            answer: "0",
            level: "Dễ",
          },
          {
            questionID: 3,
            type: "trọng âm",
            titleQuestion: "",
            options: [
              "<u>bro</u>ther",
              "ju<u>do</u>",
              "go<u>in</u>g",
              "ro<u>de</u>",
            ],
            answer: "0",
            level: "Dễ",
          },
          {
            questionID: 4,
            type: "trọng âm",
            titleQuestion: "",
            options: [
              "<u>ci</u>ties",
              "wa<u>tch</u>es",
              "di<u>sh</u>es",
              "ho<u>us</u>es",
            ],
            answer: "0",
            level: "Dễ",
          },
          {
            questionID: 5,
            type: "trọng âm",
            titleQuestion: "",
            options: [
              "<u>gran</u>dparents",
              "bro<u>th</u>ers",
              "un<u>cl</u>es",
              "fa<u>th</u>ers",
            ],
            answer: "0",
            level: "Dễ",
          },
          {
            questionID: 6,
            type: "trọng âm",
            titleQuestion: "",
            options: [
              "<u>bo</u>oks",
              "wa<u>ll</u>s",
              "ro<u>om</u>s",
              "pi<u>ll</u>ows",
            ],
            answer: "0",
            level: "Dễ",
          },
          {
            questionID: 7,
            type: "trọng âm",
            titleQuestion: "",
            options: [
              "<u>fi</u>nger",
              "le<u>g</u>",
              "ne<u>ck</u>",
              "el<u>bo</u>w",
            ],
            answer: "0",
            level: "Dễ",
          },
          {
            questionID: 8,
            type: "trọng âm",
            titleQuestion: "",
            options: [
              "<u>wr</u>ites",
              "ma<u>ke</u>s",
              "ta<u>ke</u>s",
              "dri<u>ve</u>s",
            ],
            answer: "0",
            level: "Dễ",
          },
          {
            questionID: 9,
            type: "trọng âm",
            titleQuestion: "",
            options: [
              "<u>req</u>uest",
              "pr<u>oj</u>ect",
              "ne<u>ck</u>",
              "ex<u>ci</u>ting",
            ],
            answer: "0",
            level: "Dễ",
          },
          {
            questionID: 10,
            type: "trọng âm",
            titleQuestion: "",
            options: [
              "<u>Th</u>ursday",
              "<u>Th</u>anks",
              "<u>Th</u>ese",
              "bir<u>th</u>day",
            ],
            answer: "0",
            level: "Dễ",
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
            answer: "2",
            level: "Dễ",
          },
          {
            questionID: 2,
            type: "điền khuyết",
            titleQuestion: "There aren’t __________ oranges on the table.",
            options: ["much", "any", "some", "an"],
            answer: "0",
            level: "Dễ",
          },
          {
            questionID: 3,
            type: "điền khuyết",
            titleQuestion:
              "There are ___________ people who would like to come to Ed Sheeran’s concert.",
            options: ["a lot of", "lots", "a lots of", "much"],
            answer: "1",
            level: "Dễ",
          },
          {
            questionID: 0,
            type: "điền khuyết",
            titleQuestion: "He had _____________ friends in California.",
            options: ["a little", "any", "a few", "lots"],
            answer: "0",
            level: "Dễ",
          },
          {
            questionID: 5,
            type: "điền khuyết",
            titleQuestion: "I think I'll have _____ milk before I go to bed.",
            options: ["a little", "a few", "a", "many"],
            answer: "3",
            level: "Dễ",
          },
          {
            questionID: 6,
            type: "điền khuyết",
            titleQuestion: "Malaysia is ______________ than Canada.",
            options: [
              "much hotter",
              "further hotter",
              "more hotter",
              "much hot",
            ],
            answer: "2",
            level: "Dễ",
          },
          {
            questionID: 7,
            type: "điền khuyết",
            titleQuestion:
              "My Tho is ____ from Ho Chi Minh City than Bien Hoa is.",
            options: ["farer", "more far", "farther", "much far"],
            answer: "3",
            level: "Dễ",
          },
          {
            questionID: 8,
            type: "điền khuyết",
            titleQuestion: "Shakira is a _____ singer______ Milo.",
            options: [
              "better- to",
              "gooder- than",
              "much- good",
              "better- than",
            ],
            answer: "3",
            level: "Dễ",
          },
          {
            questionID: 9,
            type: "điền khuyết",
            titleQuestion: "I will be there ______ I can.",
            options: ["sooner as", "as soon as", "soonest as", "soonest as"],
            answer: "3",
            level: "Dễ",
          },
          {
            questionID: 10,
            type: "điền khuyết",
            titleQuestion: "The _________, the_________.",
            options: [
              "soon- best",
              "sooner- good",
              "sooner- better",
              "soonest- better",
            ],
            answer: "1",
            level: "Dễ",
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
              "Environmental pollution is a term that (1) ________ to all the ways by which man pollutes his surroundings. Man dirties the air with gases and smoke, poisons the water with chemicals and other substances, and damages the soil with (2) ________ many fertilizers and pesticides. Man also pollutes his surroundings in various other ways. (3) ________, people ruin natural beauty by disposing garbage and waste products on the land and in the water. They operate machines and motor vehicles that fill the air with (4) ________ noise. Badly polluted air can cause illness, and even death. Polluted water kills fish and other coastal life. Pollution of soil reduces the amount of land that is (5) ________ for growing food.",
            optionsDoc: [
              ["refers", "attend", "directs", "aims"],
              ["extreme", "too", "such", "all"],
              ["Besides", "As instance", "Therefore", "For example"],
              ["embarrassing", "disturbing", "Therefore", "dismissing"],
              ["able", "capable", "probable", "available"],
            ],
            answerDoc: ["0", "1", "3", "1", "3"],
            level: "Dễ",
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
            titleQuestion:
              "There is no one taller than my father in my family.",
            option: "",
            answer: "My father is the tallest (member) in my family.",
            level: "Dễ",
          },
          {
            questionID: 2,
            type: "shortAnswer",
            titleQuestion:
              "Other oceans in the world aren't as large as the Pacific Ocean.",
            option: "",
            answer: "Pacific Ocean is the largest (ocean) in the world.",
            level: "Dễ",
          },
          {
            questionID: 3,
            type: "shortAnswer",
            titleQuestion: "The white car is cheaper than the black car.",
            option: "",
            answer: "The black car is more expensive than the white car.",
            level: "Dễ",
          },
          {
            questionID: 4,
            type: "shortAnswer",
            titleQuestion: "The patient was too weak to get up.",
            option: "",
            answer: "The patient wasn’t strong enough to get up.",
            level: "Dễ",
          },
          {
            questionID: 5,
            type: "shortAnswer",
            titleQuestion: "Was the test not easy enough for you to do?",
            option: "",
            answer: "Was the test too difficult for you to do?",
            level: "Dễ",
          },
        ],
      },
      {
        chapterID: 5,
        titleChapter:
          "V. Listen to the conversation between Susan and Mr Johnson. Circle the best answer A, B, or C. You will listen TWICE.",
        questions: [
          {
            questionID: 1,
            type: "nghe",
            titleQuestion: "What does the guest do?",
            options: ["counselor", "principal", "school manager", "school"],
            answer: "1",
            level: "Dễ",
          },
          {
            questionID: 2,
            type: "nghe",
            titleQuestion: "How many years has the school won the best award?",
            options: ["One year", "Five years", "Seven years", "Ten years"],
            answer: "1",
            level: "Dễ",
          },
          {
            questionID: 3,
            type: "nghe",
            titleQuestion:
              "What is the most important factor in the school’s success?",
            options: [
              "Teachers’ effort",
              "Good facilities",
              "Curriculum and extra activities",
              "Good",
            ],
            answer: "2",
            level: "Dễ",
          },
          {
            questionID: 4,
            type: "nghe",
            titleQuestion: "The guest believes that _____________.",
            options: [
              "learning art and music is a waste of time",
              "students just need to study compulsory subjects",
              "extra activities are good for the development of students",
              "is a waste of time",
            ],
            answer: "0",
            level: "Dễ",
          },
          {
            questionID: 5,
            type: "nghe",
            titleQuestion:
              "Why do the students in the school learn to play musical instruments?",
            options: [
              "To become professional musicians",
              "To sharpen their brain function",
              "To complete the programme",
              "To become professional",
            ],
            answer: "1",
            level: "Dễ",
          },
          {
            questionID: 6,
            type: "nghe",
            titleQuestion: "What subject does the guest teach?",
            options: ["Mathematics", "Science", "History", "Literature"],
            answer: "1",
            level: "Dễ",
          },
          {
            questionID: 7,
            type: "nghe",
            titleQuestion:
              "How many extracurricular clubs does the school offer?",
            options: ["Five", "Ten", "Fifteen", "Twenty"],
            answer: "2",
            level: "Dễ",
          },
          {
            questionID: 8,
            type: "nghe",
            titleQuestion:
              "What technological tool is widely used in the school for learning?",
            options: [
              "Laptops",
              "Tablets",
              "Interactive whiteboards",
              "Virtual reality headsets",
            ],
            answer: "2",
            level: "Dễ",
          },
          {
            questionID: 9,
            type: "nghe",
            titleQuestion: "The guest thinks that _____________.",
            options: [
              "homework should be abolished",
              "standardized tests are necessary",
              "field trips enhance learning experiences",
              "students should have longer school hours",
            ],
            answer: "2",
            level: "Dễ",
          },
          {
            questionID: 10,
            type: "nghe",
            titleQuestion: "Why do students participate in community service?",
            options: [
              "To earn extra credit",
              "To gain work experience",
              "To fulfill graduation requirements",
              "To develop a sense of responsibility",
            ],
            answer: "3",
            level: "Dễ",
          },
        ],
      },
    ],
  };

  return (
    <ExamUpdate examForID={examForID} dataFormUploadIndex={dataFormUploadIndex}></ExamUpdate>
  );
};

export default CreateExamUpload;
