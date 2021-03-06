import mongoose from "mongoose";
import { IReport } from "../interfaces/IReport";

const ReportSchema = new mongoose.Schema({
    review:{
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Review",
        required: true
    },
    count: {
        type: Number,
        default: 0,
        required: true
    },
    reporters: {
        type: [mongoose.SchemaTypes.ObjectId],
        default: [],
        ref: "User",
        required: true
    }
},
{
    collection: "reports",
    versionKey: false
});

export default mongoose.model<IReport & mongoose.Document>("Report",ReportSchema);