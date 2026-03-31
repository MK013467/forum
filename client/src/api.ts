import axios from "axios";

const baseURL = import.meta.env.DEV
  ? "http://localhost:3000"
  : "https://forum-app-production.up.railway.app";
export const api = axios.create({
    baseURL: baseURL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
      },
  });