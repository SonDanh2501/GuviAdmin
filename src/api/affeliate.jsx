import axiosClient from "../axios";

export const loginAffiliateApi = (payload) => {
    return axiosClient.post("api/customer_web/auth/login", payload);
}