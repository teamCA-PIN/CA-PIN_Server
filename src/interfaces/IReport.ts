import mongoose from "mongoose";
import { IReview } from "./IReview";

export interface IReport {
    review: IReview;
    count: number;
}