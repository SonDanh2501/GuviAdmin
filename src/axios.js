import axios from "axios";
import { store } from ".";
import { getToken, removeToken } from "./helper/tokenHelper";
import { logoutAction } from "./redux/actions/auth";

let token;
getToken().then((res) => (token = res));

const BaseUrl = process.env.REACT_APP_BASE_URL;
const TestUrl = process.env.REACT_APP_TEST_URL;

const axiosClient = axios.create({
  baseURL: TestUrl,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
  timeout: 100000,
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
    // if (error?.response.status === 401 && token) {
    //   removeToken();
    //   window.location = "/auth/login";
    //   store.dispatch(logoutAction.logoutRequest());
    // }
    return Promise.reject(error?.response.data[0].message);
  }
);

export default axiosClient;
