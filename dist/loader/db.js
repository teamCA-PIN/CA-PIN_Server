"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = __importDefault(require("../config"));
const User_1 = __importDefault(require("../models/User"));
const Cafeti_1 = __importDefault(require("../models/Cafeti"));
const Category_1 = __importDefault(require("../models/Category"));
const Cafe_1 = __importDefault(require("../models/Cafe"));
const Review_1 = __importDefault(require("../models/Review"));
const Tag_1 = __importDefault(require("../models/Tag"));
const Menu_1 = __importDefault(require("../models/Menu"));
const Report_1 = __importDefault(require("../models/Report"));
const connectDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield mongoose_1.default.connect(config_1.default.mongoURI, {
            useNewUrlParser: true,
            useCreateIndex: true,
            useUnifiedTopology: true,
        });
        console.log("Mongoose Connected ...");
        User_1.default.createCollection().then(function (collection) {
            console.log("User Collection is created!");
        });
        Cafeti_1.default.createCollection().then(function (collection) {
            console.log("Cafeti Collection is created!");
        });
        Category_1.default.createCollection().then(function (collection) {
            console.log("Category Collection is created!");
        });
        Cafe_1.default.createCollection().then(function (collection) {
            console.log("Cafe Collection is created!");
        });
        Review_1.default.createCollection().then(function (collection) {
            console.log("Review Collection is created!");
        });
        Tag_1.default.createCollection().then(function (collection) {
            console.log("Tag Collection is created!");
        });
        Menu_1.default.createCollection().then(function (collection) {
            console.log("Menu Collection is created!");
        });
        Report_1.default.createCollection().then(function (collection) {
            console.log("Report Collections is created!");
        });
    }
    catch (err) {
        console.error(err.message);
        process.exit(1);
    }
});
exports.default = connectDB;
//# sourceMappingURL=db.js.map