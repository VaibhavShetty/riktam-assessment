const Message = require('../models/Message')

exports.sendMessage = async (req, res) => {
  const { groupId } = req.params
  const { content } = req.body
  try {
    // find group by id
    let group = await Group.findById(groupId)
    if (!group) return res.status(404).json({ message: "Group doesn't exist"})
    const newMessage = await Message.create({ content, user: req.user._id, group: groupId, likes: 0 })
    res.json(newMessage)
  } catch (error) {
    res.status(500).json({ message: error.message})
  }
}

exports.likeMessage = async (req, res) => {
  const { messageId } = req.params
  try {
    const likedMessage = await Message.findByIdAndUpdate(messageId, { $inc: { likes: 1 } }, { new: true })
    res.json(likedMessage)
  } catch (error) {
    res.status(500).json({ message: error.message})
  }
}
