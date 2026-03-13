/**
 * Utilities module to store common functions for the whole test request
 * process.
 */

import { jwtDecode } from "jwt-decode";
import type { JwtPayload } from "./token";


/**
 * Deep copies the source object into the target object, but only for
 * matching fields.
 * 
 * @function
 * 
 * @param target - The target object into which the deep copy should be done.
 * @param source - The source object from which to do the deep copy.
 */
export function copyMatchingKeys<T extends object>(target: T, source: Partial<T>) {
    Object.keys(target).forEach((key) => {
        const value = source[key as keyof T];
        if (value !== undefined) {
            target[key as keyof T] = structuredClone(value);
        }
    });
};


/**
 * Gets the current session user's data stored in the token.
 * 
 * @function
 * 
 * @returns The current user's data.
 */
export function getUserTokenData(): JwtPayload | undefined {
    const token = localStorage.getItem('access_token');

    if (token) {
            const decoded = jwtDecode<JwtPayload>(token);
            return decoded;
    }
    return;
};
