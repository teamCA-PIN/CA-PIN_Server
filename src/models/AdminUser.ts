import mongoose from "mongoose";
import {IAdminUser} from "../interfaces/IAdminUser";

const AdminUserSchema = new mongoose.Schema({
    email: {
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
        type: String,
        required: true,
    }

},
{
    collection: "AdminUser",
    versionKey: false
});

export default mongoose.model<IAdminUser & mongoose.Document>("AdminUser", AdminUserSchema);