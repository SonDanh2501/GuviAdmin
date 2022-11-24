import axios from "axios";
let token;
const axiosClient = axios.create({
  baseURL: "https://guvico-be-develop.up.railway.app",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
  timeout: 30000,
});
// axiosClient.interceptors.request.use(async req => {
//   if (!token) {
//     token = await getToken();
//     req.headers!.Authorization = `Bearer ${token}`;
//   }
//   token = await getToken();

//   req.headers!.Authorization = `Bearer ${token}`;
//   return req;
// });
axiosClient.interceptors.response.use(
  function (response) {
    return response.data;
  },
  function (error) {
    return Promise.reject(error);
  }
);

export default axiosClient;
