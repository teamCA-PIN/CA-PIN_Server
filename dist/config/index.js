"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
// Set the NODE_ENV to 'development' by default
process.env.NODE_ENV = process.env.NODE_ENV || "development";
const envFound = dotenv_1.default.config();
if (envFound.error) {
    // This error should crash whole process
    throw new Error("⚠️  Couldn't find .env file  ⚠️");
}
exports.default = {
    /**
     * Your favorite port
     */
    port: parseInt(process.env.PORT, 10),
    /**
     * That long string from mlab
     */
    mongoURI: process.env.MONGODB_URI,
    /**
     * Your secret sauce
     */
    jwtSecret: process.env.JWT_SECRET,
    jwtAlgorithm: process.env.JWT_ALGO,
    awsS3AccessKey: process.env.S3_ACCESS_KEY,
    awsS3SecretKey: process.env.S3_SECRET_KEY,
    awsS3Bucket: process.env.S3_BUCKET,
    mapClientId: process.env.X_NCP_APIGW_API_KEY_ID,
    mapSecretKey: process.env.X_NCP_APIGW_API_KEY,
    adminSecretKey: process.env.ADMIN_SECRET_KEY
};
//# sourceMappingURL=index.js.map