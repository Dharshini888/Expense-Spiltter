// src/utils/constants.js

const getBaseUrl = () => {
    const origin = window.location.origin;
    if (origin.includes("8081")) return origin.replace("8081", "8082").replace("https://", "http://");
    if (origin.includes("localhost")) return "http://localhost:8082";
    return "http://8082-efefdedbcfdddbcbdbdafadccbeceaccf.premiumproject.examly.io";
};

export const BASE_URL = getBaseUrl();



export const API_ENDPOINTS = {

    AUTH: {

        LOGIN: `${BASE_URL}/api/auth/login`,

        REGISTER: `${BASE_URL}/api/auth/register`,

        ME: `${BASE_URL}/api/users/me`,

    },

    GROUPS: {

        BASE: `${BASE_URL}/groups`,

        BY_ID: (id) => `${BASE_URL}/groups/${id}`,

        MEMBERS: (id) => `${BASE_URL}/groups/${id}/members`,

        EXPENSES: (id) => `${BASE_URL}/groups/${id}/expenses`,

        BALANCES: (id) => `${BASE_URL}/groups/${id}/balances`,

        SETTLE: (id) => `${BASE_URL}/groups/${id}/settle`, // POST {payer, payee, amount}

    },

    SEARCH: {

        GROUPS: (q) => `${BASE_URL}/api/search/groups?q=${encodeURIComponent(q)}`,

        EXPENSES: (groupId, q) =>

            `${BASE_URL}/api/search/expenses?groupId=${groupId}&q=${encodeURIComponent(q)}`,

    },

    NOTIFICATIONS: {

        LIST: `${BASE_URL}/api/notifications`,

        READ: (id) => `${BASE_URL}/api/notifications/${id}/read`,

    },

    EXPORT: {

        CSV: `${BASE_URL}/api/export/csv`, // optional backend; UI also supports client CSV

    },

    USERS: {

        GET_ALL: `${BASE_URL}/api/admin/users`,

        CREATE: `${BASE_URL}/api/admin/users`,

        UPDATE: (id) => `${BASE_URL}/api/admin/users/${id}`,

        DELETE: (id) => `${BASE_URL}/api/admin/users/${id}`,

    },

};



export const ERROR_MESSAGES = {

    COMMON: {

        UNKNOWN_ERROR: "Something went wrong. Please try again.",

        NETWORK: "Network error. Please check your connection.",

    },

    MEMBER: {

        ALREADY_EXISTS: "Member already exists in this group.",

    },

};



export const VALIDATION = {

    GROUP: {

        NAME_MIN_LENGTH: 3,

        NAME_MAX_LENGTH: 80,

        MEMBERS_MIN: 1,

    },

    MEMBER: {

        NAME_MIN_LENGTH: 1,

        NAME_MAX_LENGTH: 60,

    },

    USER: {

        USERNAME_MIN_LENGTH: 3,

        USERNAME_MAX_LENGTH: 50,

        EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,

        PASSWORD_MIN_LENGTH: 6,

    },

};