// src/utils/constants.js

export const API_ENDPOINTS = {

    GROUPS: {

        BASE: '/groups',

        CREATE: '/groups',

        GET_ALL: '/groups',

        GET_BY_ID: (groupId) => `/groups/${groupId}`,

        ADD_MEMBER: '/groups/add-member',

        ADD_MEMBER_BY_ID: (groupId) => `/groups/${groupId}/add-member`,

        DELETE: (groupId) => `/groups/${groupId}`,

        EXPENSES: (groupId) => `/groups/${groupId}/expenses`,

        BALANCES: (groupId) => `/groups/${groupId}/balances`,

        TOTAL: (groupId) => `/groups/${groupId}/total`

    },

    EXPENSES: {

        BASE: '/expenses',

        GET_BY_ID: (expenseId) => `/expenses/${expenseId}`,

        UPDATE: (expenseId) => `/expenses/${expenseId}`,

        DELETE: (expenseId) => `/expenses/${expenseId}`

    },

    USERS: {

        BASE: '/users',

        CREATE: '/users',

        GET_ALL: '/users',

        GET_BY_ID: (userId) => `/users/${userId}`,

        GET_BY_USERNAME: (username) => `/users/username/${username}`,

        UPDATE: (userId) => `/users/${userId}`,

        DELETE: (userId) => `/users/${userId}`

    }

};



export const APP_ROUTES = {

    HOME: '/',

    GROUPS: {

        BASE: '/groups',

        CREATE: '/groups/new',

        DETAIL: (groupId) => `/groups/${groupId}`,

        EDIT: (groupId) => `/groups/${groupId}/edit`,

        EXPENSES: (groupId) => `/groups/${groupId}/expenses`

    },

    USERS: {

        BASE: '/users',

        CREATE: '/users/new',

        EDIT: (userId) => `/users/${userId}/edit`

    }

};



export const VALIDATION = {

    GROUP: {

        NAME_MIN_LENGTH: 3,

        NAME_MAX_LENGTH: 50,

        MEMBERS_MIN: 1

    },

    EXPENSE: {

        DESCRIPTION_MIN_LENGTH: 3,

        DESCRIPTION_MAX_LENGTH: 100,

        AMOUNT_MIN: 0.01,

        AMOUNT_MAX: 1000000,

        DATE_FORMAT: 'yyyy-MM-dd'

    },

    MEMBER: {

        NAME_MIN_LENGTH: 2,

        NAME_MAX_LENGTH: 50

    },

    USER: {

        USERNAME_MIN_LENGTH: 3,

        USERNAME_MAX_LENGTH: 30,

        EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    }

};



export const UI = {

    CURRENCY_SYMBOL: '₹',

    DATE_FORMAT: 'dd MMM yyyy',

    DATE_TIME_FORMAT: 'dd MMM yyyy, hh:mm a',

    ITEMS_PER_PAGE: 10,

    DEBOUNCE_DELAY: 300

};



export const ERROR_MESSAGES = {

    COMMON: {

        REQUIRED_FIELD: 'This field is required',

        NETWORK_ERROR: 'Network error. Please try again.',

        UNKNOWN_ERROR: 'An unknown error occurred'

    },

    GROUP: {

        NAME_UNIQUE: 'Group name already exists',

        NOT_FOUND: 'Group not found'

    },

    EXPENSE: {

        INVALID_AMOUNT: 'Amount must be a positive number',

        PAYER_REQUIRED: 'Payer must be a group member',

        NOT_FOUND: 'Expense not found'

    },

    MEMBER: {

        ALREADY_EXISTS: 'Member already exists in this group'

    },

    USER: {

        USERNAME_EXISTS: 'Username already taken',

        EMAIL_EXISTS: 'Email already registered'

    }

};



export const SUCCESS_MESSAGES = {

    GROUP: {

        CREATED: 'Group created successfully',

        UPDATED: 'Group updated successfully',

        DELETED: 'Group deleted successfully',

        MEMBER_ADDED: 'Member added successfully'

    },

    EXPENSE: {

        ADDED: 'Expense added successfully',

        UPDATED: 'Expense updated successfully',

        DELETED: 'Expense deleted successfully'

    },

    USER: {

        CREATED: 'User created successfully',

        UPDATED: 'User updated successfully',

        DELETED: 'User deleted successfully'

    }

};



export const STORAGE_KEYS = {

    AUTH_TOKEN: 'expenseSplitterAuthToken',

    LAST_ACTIVE_GROUP: 'lastActiveGroupId',

    USER_PREFERENCES: 'userPreferences'

};