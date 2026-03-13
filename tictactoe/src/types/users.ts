/**
 * Module to store all types related to users.
 */

import type { Role } from "../api/roles";


export type User = {
    username?: string
    password?: string
    email?: string
    idRole?: string
};

export type UserRead = User & {
    idUser?: string
    role?: Role
};
