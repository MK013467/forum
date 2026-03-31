import axios, {type AxiosInstance} from "axios";
const baseURL = import.meta.env.DEV
  ? "http://localhost:3000"
  : "https://forum-app-production.up.railway.app";
export const api:AxiosInstance = axios.create({
    baseURL: "https://forum-app-production.up.railway.app",
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
      },
  });