const User = require('../models/User')
const jwt = require('jsonwebtoken');
const { secretKey, expiresInHours, expiresInSeconds } = require('../config')
const redis = require('../config/redisConnect')
const bcrypt = require('bcrypt');

exports.login = async (req, res) => {
  const { username, password } = req.body

  const loginUser = await User.findOne({ username })

  if (!loginUser) {
      return res.status(404).json({ message: "User Not Found"});
  }

  const match = await bcrypt.compare(password, loginUser.password);

  if (!match) return res.status(401).json({ message: 'Unauthorized: Username or password is wrong' })

  const token = jwt.sign({ username, isAdmin: loginUser.isAdmin, _id: loginUser._id }, secretKey, { expiresIn: expiresInHours })
  res.json({ token })
}

exports.logout = (req, res) => {
  redis.set(req.header('Authorization'), 'true', 'EX', expiresInSeconds);

  req.header('Authorization', '')
  res.send({ message: 'User logged out'})
}
