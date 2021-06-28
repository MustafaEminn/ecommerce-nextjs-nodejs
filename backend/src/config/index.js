require("dotenv").config(); //load .env file

module.exports = {
  port: process.env.PORT,
  app: process.env.APP,
  env: process.env.NODE_ENV,
  secret: process.env.APP_SECRET,
  hostname: process.env.HOSTNAME,
  hashKey: process.env.HASH_KEY,
  adminMail: process.env.ADMIN_MAIL,
  adminMailPass: process.env.ADMIN_MAIL_PASS,
  clientUrl: process.env.CLIENT_URL,
  emailHashCode: process.env.EMAIL_HASH_CODE,
};
