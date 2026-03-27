import axios, {AxiosInstance} from "axios";

export const api:AxiosInstance = axios.create({
    baseURL: "https://forum-app-production.up.railway.app",
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
      },
  });