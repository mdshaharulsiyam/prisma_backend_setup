import dotenv from "dotenv";
dotenv.config();

export default Object.freeze({
  PORT: process.env.PORT || 5000,
  IP: process.env.IP || "localhost",
  ALLOWED_ORIGIN: process.env.ALLOWED_ORIGIN || [
    "http://localhost:5000",
    "http://localhost:5000",
  ],
  MAIL_PASSWORD: process.env.MAIL_PASSWORD,
  MAIL_EMAIL: process.env.MAIL_EMAIL,
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET || "token_secret",
  DATABASE_URL: process.env.DATABASE_URL,
  NODE_ENV: process.env.NODE_ENV,
  SRTRIPE_KEY: process.env.SRTRIPE_KEY || "",
  WEBHOOK: process.env.WEBHOOK || "",
  DB_NAME: process.env.DB_NAME,
  TOKEN_NAME: process.env.TOKEN_NAME || "",
  ACCESS_TOKEN_NAME: process.env.ACCESS_TOKEN_NAME || "",
  // aws s3
  SECRET_KEY: process.env.SECRET_KEY || "",
  ACCESS_KEY: process.env.ACCESS_KEY || "",

  ADMIN: ["ADMIN", "SUPER_ADMIN"],
  SUPER_ADMIN: ["SUPER_ADMIN"],
  PROFESSIONAL: ["ADMIN", "SUPER_ADMIN", "PROFESSIONAL"],
  USER: ["ADMIN", "SUPER_ADMIN", "PROFESSIONAL", "RIDER", "VENDOR", "USER"],
  VENDOR: ["ADMIN", "SUPER_ADMIN", "VENDOR"],
  RIDER: ["ADMIN", "SUPER_ADMIN", "RIDER"],
  WEEK: [
    "SUNDAY",
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY",
  ],
  SeedAdminEmail: process.env.SeedAdminEmail || "",
  SeedAdminPassword: process.env.SeedAdminPassword || "",
  SUBSCRIPTION_PRICE: process.env.SUBSCRIPTION_PRICE || "",
  CREDITS_PER_DOLLAR: Number(process.env.CREDITS_PER_DOLLAR) || 0,
  STORE_ID: process.env.STORE_ID || "",
  STORE_PASSWORD: process.env.STORE_PASSWORD || "",
  IS_ALIVE: process.env.IS_ALIVE == "true" ? true : false,

});

export const HttpStatus = Object.freeze({
  SUCCESS: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  SERVER_ERROR: 500,
  NOT_IMPLEMENTED: 501,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
});
