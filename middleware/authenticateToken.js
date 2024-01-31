const jwt = require('jsonwebtoken')
const { secretKey } = require('../config')
const redis = require('../config/redisConnect')

const authenticateToken = async (req, res, next) => {
  const token = req.header('Authorization')
  console.log(await redis.get(token))
  if (!token || (await redis.get(token)))
    return res.status(401).json({ message: 'Access Denied or User session has ended' })
  console.log(token)
  jwt.verify(token, secretKey, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid Token' })
    req.user = user
    next()
  })
}

module.exports = authenticateToken
