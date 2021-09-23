"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const CafetiSchema = new mongoose_1.default.Schema({
    cafetiIdx: {
        type: Number,
        required: true,
        unique: true,
        index: true
    },
    type: {
        type: String,
        required: true,
        unique: true
    },
    modifier: {
        type: String,
        required: true
    },
    modifierDetail: {
        type: String,
    },
    introduction: {
        type: String,
        required: true
    },
    img: {
        type: String,
        required: true
    },
    plainImg: {
        type: String,
        required: true
    }
}, {
    collection: "cafeti",
    versionKey: false
});
exports.default = mongoose_1.default.model("Cafeti", CafetiSchema);
//# sourceMappingURL=Cafeti.js.map