/**
 * Module to store all types related to games.
 */

import type { User } from "./users";


export type Game = {
    gameDate?: string
    gameResult?: string
    moves?: Record<string, any>
    idUserX?: string
    idUserO?: string
};

export type GameRead = Game & {
    idGame?: string
    userX?: User
    userO?: User
};
