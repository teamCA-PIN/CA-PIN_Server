import mongoose from "mongoose";
import { ICafeti } from "../interfaces/ICafeti";

const CafetiSchema = new mongoose.Schema ({
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
},
{
    collection: "cafeti",
    versionKey: false
});


export default mongoose.model<ICafeti & mongoose.Document>("Cafeti", CafetiSchema);