import axiosClient from "../axios";

export const loginAffiliateApi = (payload) => {
  return axiosClient.post("api/customer_web/auth/login", payload);
};

export const registerPhoneAffiliateApi = (payload) => {
  return axiosClient.post("api/customer_web/auth/register_phone", payload);
};

// API này dùng để check OTP và trả về một token (token này không phải accessToken mà là token lưu các giá trị số điện thoại, ngày tạo nhưng dưới dạng mã hóa)
export const checkOTPAffiliateApi = (payload) => {
  return axiosClient.post("api/customer_web/auth/check_otp", payload);
};

export const registerAffiliateApi = (payload) => {
  return axiosClient.post("api/customer_web/auth/register", payload);
};
