export default {
  mongoUrl: process.env.MONGO_URL ?? 'mongodb://172.18.0.2:27017/clean-node-api',
  port: process.env.PORT ?? 3000
}
