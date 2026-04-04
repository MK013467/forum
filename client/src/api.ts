import axios from "axios";

const baseURL = import.meta.env.VITE_ENV === "DEV"
  ? "http://localhost:3000":"https://forum-app-production.up.railway.app";

  export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
  });
  api.interceptors.response.use(
    (response) => {
        return {
          ...response,
          data:response.data
        }
    }
);