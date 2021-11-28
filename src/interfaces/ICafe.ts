import mongoose from "mongoose";
import { ITag } from "./ITag";

export interface ICafe{
    _id: string;
    name: string;
    img?: string;
    address: string;
    tags: mongoose.Types.ObjectId;
    latitude: number;
    longitude: number;
    instagram?: string;
    opentime?: string;
    opentimeHoliday?: string;
    closetime?: string;
    closetimeHoliday?: string;
    offday?: [number];
    rating: number;
}

export interface ICafeLocationDTO{
    _id: string;
    latitude: number;
    longitude: number;
}

export interface ICafeCategoryDTO{
    name: string;
    tags: mongoose.Types.ObjectId;
    address: string;
    rating?: number;
}

export interface ICafeSearchDTO{
    _id: string;
    name: string;
    address: string;
    latitude?: number;
    longitude?: number;
    img?: string;
}

export interface ICafeAllDTO{
    _id: string;
    name: string;
    img?: string;
    address: string;
    latitude: number;
    longitude: number;
    tags: ITag;
    isSaved?: boolean;
    rating?: number;
}