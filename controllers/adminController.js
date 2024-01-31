const User = require('../models/User')
const { hashString } =  require('../util/hash')


exports.createUser = async (req, res) => {
  // if (!req.user.isAdmin) return res.status(403).json({ message: 'Permission Denied'});

  const { username, password, isAdmin } = req.body;
  const hashedPassword = hashString(password)
  try {
    const newUser = await User.create({ username, 'password': hashedPassword, isAdmin });
    res.json({...newUser._doc, password: undefined});
  } catch (error) {
    res.status(500).send(error.message);
  }
}

exports.editUser = async (req, res) => {
  if (!req.user.isAdmin) return res.status(403).json({ message: 'Permission Denied'});

  const { userId } = req.params;
  const { username, password, isAdmin } = req.body;
  const hashedPassword = hashString(password)

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { username, 'password': hashedPassword, isAdmin },
      { new: true }
    );
    res.json({...updatedUser._doc, password: undefined});
  } catch (error) {
    res.status(500).json({ message: error.message});
  }
}

exports.searchUser = async (req, res) => {
  const isAdmin = req.user.isAdmin;
  const username = req.body.username;

  try {
    const searchedUser = await User.findOne(
      { username, ...(isAdmin && {} || { isAdmin })  }
    );
    if (!searchedUser) return res.json({ message: 'User not found'});
    res.json({...searchedUser._doc, password: undefined});
  } catch (error) {
    res.status(500).json({ message: error.message});
  }
}
