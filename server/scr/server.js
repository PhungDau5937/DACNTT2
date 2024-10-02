require('dotenv').config();
const express = require("express");
const http = require('http'); 
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
const corsOptions = require("../config/cors.js");
const connectDB = require("../config/database.js");
const setupSocket = require('../config/socket.js');

const app = express();
const server = http.createServer(app); // Khởi tạo server HTTP

connectDB();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../public"))); 
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));


app.use(cors(corsOptions));

const studentRoutes = require("./routes/studentRoutes.js");
const teacherRoutes = require("./routes/teacherRoutes.js");
const headRoutes = require("./routes/headRoutes.js");
const authRoutes = require('./routes/authRoutes.js');

app.use("/student", studentRoutes);
app.use("/teacher", teacherRoutes);
app.use("/head", headRoutes);
app.use("/auth", authRoutes);

// Khởi tạo socket.io
const io = setupSocket(server);

const port = process.env.PORT || 8000; // Sử dụng giá trị mặc định nếu không có PORT

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});


// mongodb+srv://Cluster59773:bankexamenglish@cluster59773.dghmqtd.mongodb.net/EnglishExamBankDB
