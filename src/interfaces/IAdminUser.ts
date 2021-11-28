export interface IAdminUser {
    email: string;
    password: string; 
    created_at?: Date;
    deleted_at?: Date;
    token_refresh?: string;
}