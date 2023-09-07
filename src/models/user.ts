export interface user {
    id?: number,
    _id: string,
    email: string,
    name: string,
    phone: string,
    password?: string,
    roles: string,
    isPasswordSet?: number,
    authToken: string
};