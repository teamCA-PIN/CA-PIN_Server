"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const AdminUserSchema = new mongoose_1.default.Schema({
    admin_email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    created_at: {
        type: Date,
    },
    deleted_at: {
        type: Date,
    },
    token_refresh: {
        type: String
    }
}, {
    collection: "adminUser",
    versionKey: false
});
exports.default = mongoose_1.default.model("AdminUser", AdminUserSchema);
//# sourceMappingURL=AdminUser.js.map