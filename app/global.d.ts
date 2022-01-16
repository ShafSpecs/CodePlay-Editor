declare module 'db.sever'

export type UserSelect = {
    id?: boolean;
    username?: boolean;
    password?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    pens?: boolean | any[];
}