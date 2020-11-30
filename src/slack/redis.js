var redis = require("redis");

exports.CLIENT_REDIS = redis.createClient({
  host: process.env.REDIS_HOST,
  port: 6379,
  retry_strategy: (options) => {
    return Math.max(options.attempt * 100, 3000);
  },
});
