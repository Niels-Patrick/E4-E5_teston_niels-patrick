/**
 * Module to store all types related to games.
 */

import type { User } from "./users";


export type Game = {
    gameDate?: string
    gameResult?: string
    moves?: Record<string, Array<string>>
    idUserX?: string
    idUserO?: string
};

export type GameRead = Game & {
    idGame?: string
    userX?: User
    userO?: User
};
