// redis.util.js
const redisUtil = require('redis');
const redis = require("redis");

//dockerfile 연동
const redisHost = 'redis';

const redisClient = redis.createClient({
    host: redisHost,
    port: 6379,
});
redisClient.on('connect', () => console.log('Connected to Redis!'));
redisClient.on('error', (err) => console.log('Redis Client Error', err));
redisClient.connect();

module.exports = redisClient;