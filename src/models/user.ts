export interface user {
    id?: number,
    _id: string,
    email: string,
    name: string,
    phone: string,
    password?: string,
    projectId: string,
    projectName: string,
    designation?: string,
    categoriesDisplay?: string;
    roles: string,
    isPasswordSet?: number,
    authToken: string,
    categories?: string
};