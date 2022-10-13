const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const userRouters = require("./routers/userRouters");
const messageRouters = require("./routers/messagesRoutes");
const app = express();
const socket = require("socket.io");
require("dotenv").config();
app.use(cors());
app.use(express.json());

app.use("/api/auth", userRouters);
app.use("/api/messages", messageRouters);

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("connected..."))
  .catch((err) => console.log(err));

const server = app.listen(process.env.PORT, () => {
  console.log(`http://localhost:${process.env.PORT}/`);
});

const io = socket(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});

global.onlineUsers = new Map();
// UserId Socket và user Mongo là riếng, ko dính dáng z`` đến nhau cả
// Socket gui:  {
//   to: '633daa095064a727dccbc606',
//   from: '633c6ec52ba24f39a93c95bb',
//   msg: 'xxxxxxx'
//   from: '633c6ec52ba24f39a93c95bb',
//   to: '633daa095064a727dccbc606',
//   message: 'xxxxxxx'
// }
io.on("connection", (socket) => {
  (global.chatSocket = socket),
    socket.on("add-user", (userId) => {
      // data nhận được từ client : các userId
      onlineUsers.set(userId, socket.id);
    });
  socket.on("send-msg", (data) => {
    console.log("Socket xxx: ", { data });
    const sendUserSocket = onlineUsers.get(data.to);
    // console.log("ds online: ", onlineUsers);
    if (sendUserSocket) {
      // User có thể online hoặc offline .
      //Nếu online -> send. Offline: check database coi, gửi
      console.log("Send-smg", data);
      socket.to(sendUserSocket).emit("msg-receive", data.msg);
    } else {
      console.log("ko do day");
    }
  });
});
