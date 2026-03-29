import axios, {AxiosInstance} from "axios";
const url = process.env.NODE_ENV === "development"? "http://localhost:5173": "https://forum-app-production.up.railway.app";
export const api:AxiosInstance = axios.create({
    baseURL: "https://forum-app-production.up.railway.app",
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
      },
  });