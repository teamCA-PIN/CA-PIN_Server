"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const ReportSchema = new mongoose_1.default.Schema({
    review: {
        type: mongoose_1.default.SchemaTypes.ObjectId,
        ref: "Review",
        required: true
    },
    count: {
        type: Number,
        default: 0,
        required: true
    },
    reporters: {
        type: [mongoose_1.default.SchemaTypes.ObjectId],
        default: [],
        ref: "User",
        required: true
    }
}, {
    collection: "reports",
    versionKey: false
});
exports.default = mongoose_1.default.model("Report", ReportSchema);
//# sourceMappingURL=Report.js.map