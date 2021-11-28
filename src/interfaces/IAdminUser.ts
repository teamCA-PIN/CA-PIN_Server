export interface IAdminUser {
    admin_email: string;
    password: string; 
    created_at?: Date;
    deleted_at?: Date;
    token_refresh?: string;
}