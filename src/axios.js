import axios from "axios";
import { getToken } from "./helper/tokenHelper";

let token;
getToken().then((res) => (token = res));

// baseURL: 'https://guvico-be-production.up.railway.app'

const axiosClient = axios.create({
  baseURL: "https://guvico-be-develop.up.railway.app",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
  timeout: 10000,
});
axiosClient.interceptors.request.use(async (req) => {
  if (!token) {
    token = await getToken();
    req.headers.Authorization = `Bearer ${token}`;
  }
  token = await getToken();

  req.headers.Authorization = `Bearer ${token}`;
  return req;
});
axiosClient.interceptors.response.use(
  function (response) {
    return response.data;
  },
  function (error) {
    return Promise.reject(error);
  }
);

export default axiosClient;
