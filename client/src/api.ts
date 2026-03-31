import axios from "axios";

const baseURL = import.meta.env.VITE_ENV === "DEV"
  ?"https://forum-app-production.up.railway.app": "http://localhost:3000";
export const api = axios.create({
    baseURL: baseURL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
      },
  });