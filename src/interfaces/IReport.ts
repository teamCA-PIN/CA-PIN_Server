import mongoose from "mongoose";
import { IReview } from "./IReview";
import { IUser } from "./IUser";

export interface IReport {
    review: IReview;
    count: number;
    reporters: [IUser];
}