/**
 * Module to store the headers for User table.
 */

// Headers for User table
export const userHeaders = [
    {
        align: 'end',
        key: 'username',
        sortable: true,
        title: 'Username',
    },
    {
        align: 'end',
        key: 'email',
        sortable: true,
        title: 'Email',
    },
    {
        align: 'end',
        key: 'role.name',
        sortable: true,
        title: 'Role',
    },
    {
        align: 'center',
        key: 'edit',
        sortable: false,
        title: 'Edit',
    }
] as const;
