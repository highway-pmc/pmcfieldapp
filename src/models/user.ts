export interface user {
    id?: number,
    _id: string,
    email: string,
    name: string,
    phone: string,
    password?: string,
    role: string,
    isPasswordSet?: number,
    authToken: string
};