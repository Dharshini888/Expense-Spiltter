import axios from "axios";

const getBaseUrl = () => {
  if (process.env.REACT_APP_API_BASE_URL) return process.env.REACT_APP_API_BASE_URL;
  const origin = window.location.origin;
  if (origin.includes("8081")) {
    return origin.replace("8081", "8082").replace("https://", "http://");
  }
  if (origin.includes("localhost")) {
    return "http://localhost:8082";
  }
  return "http://8082-efefdedbcfdddbcbdbdafadccbeceaccf.premiumproject.examly.io";
};

const API_BASE = getBaseUrl();
const api = axios.create({ baseURL: API_BASE });

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) config.headers["Authorization"] = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// ===== Groups =====
export const fetchGroups = async (ownerId) => {
  const res = await api.get("/groups", { params: { ownerId } });
  return res.data;
};

export const createGroup = async (groupData) => {
  const res = await api.post("/groups", groupData);
  return res.data;
};

export const deleteGroup = async (id) => {
  const res = await api.delete(`/groups/${id}`);
  return res.data;
};

export const searchGroups = async (query, ownerId) => {
  const res = await api.get(`/groups/search`, { params: { q: query, ownerId } });
  return res.data;
};

// ===== Members =====
export const addMember = async (groupId, name) => {
  const res = await api.post("/members", { groupId, name });
  return res.data;
};

export const fetchMembers = async (groupId) => {
  const res = await api.get(`/groups/${groupId}/members`);
  return res.data.map(m => ({ id: m.memberId, name: m.name }));
};

// ===== Expenses =====
export const addExpense = async (groupId, expenseData) => {
  const res = await api.post(`/groups/${groupId}/expenses`, expenseData);
  return { ...res.data, payer: res.data.payer || "Unknown" };
};

export const fetchExpenses = async (groupId) => {
  const res = await api.get(`/groups/${groupId}/expenses`);
  return res.data.map(e => ({ ...e, payer: e.payer || "Unknown" }));
};

export const searchExpenses = async (groupId, query) => {
  const res = await api.get(`/groups/${groupId}/expenses/search`, { params: { q: query } });
  return res.data;
};

export const fetchGroupBalances = async (groupId) => {
  const res = await api.get(`/groups/${groupId}/expenses/balances`);
  return (res.data.balances || []).map(b => ({
    memberName: b.member || "Unknown",
    balance: b.balance,
  }));
};

// ===== Payments & Settlements =====
export const addPayment = async (groupId, paymentData) => {
  const res = await api.post(`/payments/${groupId}`, paymentData);
  return { ...res.data, payer: res.data.payer || "Unknown", receiver: res.data.receiver || "Unknown" };
};

export const fetchPayments = async (groupId) => {
  const res = await api.get(`/payments/${groupId}`);
  return res.data.map(p => ({ ...p, payer: p.payer || "Unknown", receiver: p.receiver || "Unknown" }));
};

export const optimizeSettlements = async (groupId) => {
  const res = await api.get(`/groups/${groupId}/settlements/optimize`);
  return res.data;
};

export const fetchSmartSuggestions = async (groupId, userName) => {
  const res = await api.get(`/groups/${groupId}/settlements/suggestions`, { params: { userName } });
  return res.data;
};

// ===== Activity & Dashboards =====
export const fetchActivities = async (groupId) => {
  const res = await api.get(`/api/dashboard/groups/${groupId}/activities`);
  return res.data;
};

export const fetchNotifications = async (memberId) => {
  const res = await api.get(`/api/dashboard/members/${memberId}/notifications`);
  return res.data;
};

export const fetchCategoryAnalytics = async (groupId) => {
  const res = await api.get(`/api/dashboard/groups/${groupId}/analytics/categories`);
  return res.data;
};

// ===== Auth =====
export const login = async (credentials) => {
  const res = await api.post("/auth/login", credentials);
  return res.data;
};

export const register = async (userData) => {
  const res = await api.post("/auth/register", userData);
  return res.data;
};

export const getCurrentUser = async () => {
  const res = await api.get("/auth/current-user");
  return res.data;
};

const apiEndpoints = {
  fetchGroups, createGroup, deleteGroup, searchGroups,
  addMember, fetchMembers,
  addExpense, fetchExpenses, searchExpenses, fetchGroupBalances,
  addPayment, fetchPayments, optimizeSettlements, fetchSmartSuggestions,
  fetchActivities, fetchNotifications, fetchCategoryAnalytics,
  login, register, getCurrentUser
};

export default apiEndpoints;