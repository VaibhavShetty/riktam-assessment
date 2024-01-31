const mongoose = require('mongoose');
const Message = require('./Message')

const groupSchema = new mongoose.Schema({
  name: String,
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
});

groupSchema.pre('remove', async function (next) {
  try {
    // Remove all messages associated with this group
    await Message.deleteMany({ group: this._id });
    next();
  } catch (error) {
    next(error);
  }
});

const Group = mongoose.model('Group', groupSchema);

module.exports = Group;
        