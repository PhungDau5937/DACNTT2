const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const chatSchema = new Schema({
    room: { type: String, required: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to User model
    message: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
  });

const Chat = mongoose.model('Chat', chatSchema);

module.exports = Chat;