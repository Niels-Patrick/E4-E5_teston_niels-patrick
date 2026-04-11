/**
 * Rules module.
 * 
 * This module stores the rules to follow when filling forms' fields (like
 * regular expressions).
 */

import { formUser } from "../api/users";


// Name rules definition
export const nameRules = [
    (value: string) => {
        if (/^(?=.{3,32}$)(?![_.-])(?!.*[_.]{2})[a-zA-Z0-9]+(?<![_.])$/.test(value)) return true
        return 'Must be at least 3 characters long and contain only letters and/or numbers.'
    }
];

// Password rules definition
export const passwordRules = [
    (value: string) => {
        if (/^((?=\S*?[A-Z])(?=\S*?[a-z])(?=\S*?[0-9])(?=\S*?[^!@#$%]*[!@#$%]).{9,})\S$/.test(value)) return true
        return 'Password must be at least 10 characters long, have at least 1 upper case letter, 1 number and 1 special character.'
    }
];

// Confirm password rules definition
export const confirmPasswordRules = [
    (value: string) => {
        if (formUser.value.password == value) return true
        return "Passwords must match."
    }
]

// Old password rules definition
export const oldPasswordRules = [
    (value: string) => {
        if (value != null) return true
        return "Must enter the old password."
    }
]

// Email rules definition
export const emailRules = [
    (value: string) => {
        if (/^[\w\-.]+@([\w-]+\.)+[\w-]{2,}$/.test(value)) return true
        return 'Invalid email.'
    }
];

// Dropdown lists rules definition
export const selectRules = [
    (value: string | null) => !!value || 'Must select one.'
];

// Username login rules definition
export const usernameLoginRules = [
    (value: string) => {
        if (value?.length >=1) return true
        return 'You must enter a username.'
    }
];

// Password login rules definition
export const passwordLoginRules = [
    (value: string) => {
        if (value?.length >=1) return true
        return 'You must enter a password.'
    }
];

// Numbers rules definition
export const numbersRules = [
    (value: number) => {
        if (value != null) return true
        return 'You must enter a number.'
    }
];
