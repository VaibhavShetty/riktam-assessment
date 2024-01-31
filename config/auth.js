// var redis = require('redis');
// var JWTR =  require('jwt-redis').default;
// var redisClient = redis.createClient();
async() => await redisClient.connect()();
// console.log(redisClient)

var Redis = require('ioredis');
var redis = new Redis();
var JWTR =  require('jwt-redis').default;
var jwtr = new JWTR(redis);

module.exports