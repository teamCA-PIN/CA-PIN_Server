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
        default: 1,
        required: true
    }

},
{
    collection: "reports",
    versionKey: false
});

export default mongoose.model<IReport & mongoose.Document>("Report",ReportSchema);