import axios, {AxiosInstance} from "axios";
const url = process.env.NODE_ENV === "development"? "http://localhost:3000": "https://forum-app-production.up.railway.app";
export const api:AxiosInstance = axios.create({
    baseURL: "http://localhost:3000",
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
      },
  });