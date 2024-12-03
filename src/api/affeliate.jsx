import axiosClient from "../axios";

export const loginAffiliateApi = (payload) => {
    return axiosClient.post("api/customer_web/auth/login", payload);
}

export const registerPhoneAffiliateApi = (payload) => {
    return axiosClient.post("api/customer_web/auth/register_phone", payload);
}

export const checkOTPAffiliateApi = (payload) => {
    return axiosClient.post("api/customer_web/auth/check_otp", payload);
}