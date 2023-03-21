// redis.util.js
const redisUtil = require('redis');
const redis = require("redis");
const redisClient = redis.createClient({
    port: 6379,
});
redisClient.on('connect', () => console.log('Connected to Redis!'));
redisClient.on('error', (err) => console.log('Redis Client Error', err));
redisClient.connect();

module.exports = redisClient;