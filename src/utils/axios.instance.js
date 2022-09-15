import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "https://api.npms.io/v2",
  timeout: 3000,
});
