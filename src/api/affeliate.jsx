import axiosClient from "../axios";

/* ~~~ Auth ~~~ */
// API đăng nhập affiliate
export const loginAffiliateApi = (payload) => {
  return axiosClient.post("api/customer_web/auth/login", payload);
};

// API này dùng để kiểm tra số điện thoại đã được đăng ký hay chưa, nếu chưa thì gửi OTP
export const registerPhoneAffiliateApi = (payload) => {
  return axiosClient.post("api/customer_web/auth/register_phone", payload);
};

// API này dùng để check OTP và trả về một token (token này không phải accessToken mà là token lưu các giá trị số điện thoại, ngày tạo nhưng dưới dạng mã hóa)
export const checkOTPAffiliateApi = (payload) => {
  return axiosClient.post("api/customer_web/auth/check_otp", payload);
};

// API đăng ký tài khoản sau khi mà check otp hợp lệ
export const registerAffiliateApi = (payload) => {
  return axiosClient.post("api/customer_web/auth/register", payload);
};

// API này truyền lên access token rồi BE sẽ mã hóa để lấy ra ID và get Customer sau đó truyền thông tin tìm được về
export const getCustomerInfoAffiliateApi = () => {
  return axiosClient.get("api/customer_web/auth/get_customer_info");
};

// API cập nhật mã giới thiệu
export const updateReferralCodeApi = (payload) => {
  return axiosClient.post(
    "api/customer_web/auth/update_referral_code",
    payload
  );
};

// API quên mật khẩu
export const forgotPasswordAffiliateApi = (payload) => {
  return axiosClient.post("api/customer_web/auth/forgot_password", payload);
};

// API gửi mã OTP để xác thực số điện thoại
export const sendOtpAffiliateApi = (payload) => {
  return axiosClient.post("api/customer_web/auth/send_otp", payload);
};

// API cập nhật mật khẩu
export const updatePasswordAffiliateApi = (payload) => {
  return axiosClient.post("api/customer_web/auth/update_new_password", payload);
};
/* ~~~ Affiliate ~~~ */
// API tạo mã giới thiệu random
export const getRandomReferralCodeApi = () => {
  return axiosClient.get("api/customer_web/affiliate/get_random_referral_code");
};
// API lấy lịch sử nhận chiết khấu của khách hàng
export const getListActivityAffiliateApi = (start, length) => {
  return axiosClient.get(
    `api/customer_web/affiliate/get_list_activity?start=${start}&length=${length}`
  );
};
// API lấy danh sách người được giới thiệu bởi một khách hàng
export const getListReferralPersonApi = (start, length) => {
  return axiosClient.get(
    `api/customer_web/affiliate/get_list_referral_person?start=${start}&length=${length}`
  );
};
// API lấy danh sách lệnh nạp rút affiliate
export const getListTransactionAffiliateApi = (start, length, query, search) => {
  return axiosClient.get(
    `api/customer_web/affiliate/get_list_transaction?start=${start}&length=${length}&search=${search}${query}`
  );
};
// API tạo mã lệnh rút
export const createWithdrawalRequestApi = (payload) => {
  return axiosClient.post(
    "api/customer_web/affiliate/create_withdrawal_request",
    payload
  );
};
// API tạo tài khoản ngân hàng
export const createBankAccountApi = (payload) => {
  return axiosClient.post(
    "api/customer_web/affiliate/create_bank_account",
    payload
  );
};
// API check tài khoản khách hàng đã có tài khoản ngân hàng hay chưa
export const checkBankAccountExistApi = () => {
  return axiosClient.get("api/customer_web/affiliate/check_bank_account_exist");
}
