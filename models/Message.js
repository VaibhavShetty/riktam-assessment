const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  content: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  group: { type: mongoose.Schema.Types.ObjectId, ref: 'Group' },
  likes: Number,
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
