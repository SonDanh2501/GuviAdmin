import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getToken } from "./helper/tokenHelper";

let token;
getToken().then((res) => (token = res));

// baseURL: 'https://guvico-be-production.up.railway.app'
// https://server.guvico.com/

const axiosClient = axios.create({
  baseURL: "https://guvico-be-develop.up.railway.app",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
  timeout: 30000,
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
    return Promise.reject(error?.response.data[0].message);
  }
);

export default axiosClient;
