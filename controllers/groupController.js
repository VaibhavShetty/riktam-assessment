const Group = require('../models/Group')
const Message = require('../models/Message')


exports.createGroup = async (req, res) => {
  const { name } = req.body
  try {
    const newGroup = await Group.create({ name, members: [req.user._id] })
    res.json(newGroup)
  } catch (error) {
    res.status(500).json({ message: error.message})
  }
}

exports.deleteGroup = async (req, res) => {
  const { groupId } = req.params
  try {
    const deletedGroup = await Group.findByIdAndRemove(groupId)
        
    res.json(deletedGroup)
  } catch (error) {
    res.status(500).json({ message: error.message})
  }
}

exports.searchGroup = async (req, res) => {
  const { groupName } = req.params
  try {
    const groups = await Group.find({ name: { $regex: groupName, $options: 'i' } })
    res.json(groups)
  } catch (error) {
    res.status(500).json({ message: error.message})
  }
}

exports.addMember = async (req, res) => {
  const { groupId, userId } = req.params
  try {
    const group = await Group.findByIdAndUpdate(groupId, { $push: { members: userId } }, { new: true })
    if (!group) return res.status(404).json({ message: "Group not found" })
    res.json(group)
  } catch (error) {
    res.status(500).json({ message: error.message})
  }
}
