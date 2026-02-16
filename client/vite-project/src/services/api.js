const BASE_URL = "http://localhost:5000/api";

// ─── Helper to get auth headers ───
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const handleResponse = async (res) => {
  const data = await res.json();
  if (!res.ok) {
    // If token expired, clear storage
    if (res.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
    throw new Error(data.message || "Request failed");
  }
  return data;
};

// ─── Auth ───
export const signup = async (name, email, password) => {
  const res = await fetch(`${BASE_URL}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });
  return handleResponse(res);
};

export const login = async (email, password) => {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return handleResponse(res);
};

export const getMe = async () => {
  const res = await fetch(`${BASE_URL}/auth/me`, {
    headers: getAuthHeaders(),
  });
  return handleResponse(res);
};

// ─── Auctions ───
export const getAllAuctions = async () => {
  const res = await fetch(`${BASE_URL}/auctions`);
  return res.json();
};

export const getActiveAuctions = async () => {
  const res = await fetch(`${BASE_URL}/auctions/active`);
  return res.json();
};

export const getAuctionById = async (id) => {
  const res = await fetch(`${BASE_URL}/auctions/${id}`);
  return res.json();
};

export const createAuction = async (data) => {
  const res = await fetch(`${BASE_URL}/auctions`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse(res);
};

export const closeAuction = async (id) => {
  const res = await fetch(`${BASE_URL}/auctions/${id}/close`, {
    method: "POST",
    headers: getAuthHeaders(),
  });
  return handleResponse(res);
};

export const getMyAuctions = async () => {
  const res = await fetch(`${BASE_URL}/auctions/user/my-auctions`, {
    headers: getAuthHeaders(),
  });
  return handleResponse(res);
};

// ─── Bids ───
export const placeBid = async (auctionId, bidAmount) => {
  const res = await fetch(`${BASE_URL}/bids`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ auctionId, bidAmount }),
  });
  return handleResponse(res);
};

export const getBidsForAuction = async (auctionId) => {
  const res = await fetch(`${BASE_URL}/bids/${auctionId}`);
  return res.json();
};

export const getMyBids = async () => {
  const res = await fetch(`${BASE_URL}/bids/user/my-bids`, {
    headers: getAuthHeaders(),
  });
  return handleResponse(res);
};

export const getLeaderboard = async () => {
  const res = await fetch(`${BASE_URL}/bids/leaderboard`);
  return res.json();
};