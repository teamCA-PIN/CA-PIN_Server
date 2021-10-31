import {ICafeti} from "../interfaces/ICafeti";
export interface IUser {
    email: string;
    password: string; 
    nickname: string;
    cafeti?: ICafeti;
    profileImg?: string;
    created_at?: Date;
    deleted_at?: Date;
    token_refresh: string;
}

export interface IUserOutputDTO {
    email: string;
    password: string;
    nickname: string;
    cafeti?: ICafeti;
    profileImg?: string;
}

export interface IUserReviewDTO {
    _id: string;
    nickname: string;
    profileImg?: string;
    cafeti?: ICafeti;
}