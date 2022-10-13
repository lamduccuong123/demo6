const messageModel = require("../model/mesagerModel");

module.exports.addMessage = async (req, res, next) => {
  try {
    const { from, to, message } = req.body;
    // console.log("tin nhan dau: ????", req.body);
    const data = await messageModel.create({
      message: { text: message },
      users: [from, to],
      sender: from,
    });
    if (data) return res.json({ msg: "Message added successfully" });
    return res.json({ msg: "fail to add message to database" });
  } catch (error) {
    next(error);
  }
};
module.exports.getAllMessage = async (req, res, next) => {
  try {
    // NOTE: Lấy toàn bộ tin nhắn từ 2 phía (toàn bộ nội dung hội thoại, $ALL)
    const { from, to } = req.body;
    const messages = await messageModel
      .find({
        users: {
          $all: [from, to],
        },
      })
      .sort({ updateAt: 1 });
    // console.log("DS tin nhan", messages);
    const projectMessages = messages.map((msg) => {
      return {
        fromSelf: msg.sender.toString() === from,
        message: msg.message.text,
      };
    });
    res.json(projectMessages);
  } catch (error) {
    next(error);
  }
};
