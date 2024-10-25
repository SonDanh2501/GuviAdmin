import axiosClient from "../axios";

export const checkActiveAffeliate = (payload) => {
    return axiosClient.post("api/customer/auth/login_affiliate", payload);
}