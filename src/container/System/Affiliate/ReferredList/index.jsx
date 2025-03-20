import React, { useCallback, useEffect, useRef, useState } from "react";
import "./index.scss";
import _ from "lodash";

import {
  getCustomerInfoAffiliateApi,
  getRandomReferralCodeApi,
  updateReferralCodeApi,
  getListReferralPersonApi,
  getListActivityAffiliateApi,
  createWithdrawalRequestApi,
  getListTransactionAffiliateApi,
  createBankAccountApi,
  checkBankAccountExistApi,
  getTotalDiscountApi,
  getTotalReferralPersonApi,
  checkOTPAffiliateApi,
  forgotPasswordAffiliateApi,
  updatePasswordAffiliateApi,
  checkOldPasswordApi,
  updatePasswordApi,
} from "../../../../api/affiliate";

import icons from "../../../../utils/icons";
import {
  Button,
  message,
  Modal,
  Pagination,
  Popover,
  QRCode,
  Space,
  Tooltip,
} from "antd";
import { Link, useNavigate } from "react-router-dom";
import {
  FacebookIcon,
  FacebookShareButton,
  InstapaperShareButton,
  InstapaperIcon,
  EmailShareButton,
  EmailIcon,
} from "react-share";
import appleStoreImage from "../../../../assets/images/apple_store.svg";
import chStoreImage from "../../../../assets/images/google_play.svg";
import copyRightImage from "../../../../assets/images/copy_right.png";
import affiliateLogo from "../../../../assets/images/affiliate_guide.svg";
import userDefault from "../../../../assets/images/user.png";

import { errorNotify, successNotify } from "../../../../helper/toast";
import { useDispatch, useSelector } from "react-redux";
import { loadingAction } from "../../../../redux/actions/loading";
import { getListTransactionApi } from "../../../../api/transaction";
import DataTable from "../../../../components/tables/dataTable";
import CustomHeaderDatatable from "../../../../components/tables/tableHeader";
import InputTextCustom from "../../../../components/inputCustom";
import i18n from "../../../../i18n";
import { getLanguageState, getUser } from "../../../../redux/selectors/auth";
import ButtonCustom from "../../../../components/button";
import {
  formatCardNumber,
  formatMoney,
  formatNumber,
} from "../../../../helper/formatMoney";
import {
  bankList,
  checkPasswordRequired,
  getInitials,
  province,
  sortList,
} from "../../../../utils/contant";
import referralPolicy from "../../../../assets/images/referral-policy.svg";
import overViewAffilaite from "../../../../assets/images/overViewAffiliate.svg";
import logoGuvi from "../../../../assets/images/LogoS.svg";
import logoGuviCircle from "../../../../assets/images/Logo.svg";
import notFoundImage from "../../../../assets/images/empty_data.svg";
import moment from "moment";
import { removeToken } from "../../../../helper/tokenHelper";
import { logoutAffiliateAction } from "../../../../redux/actions/auth";
import useWindowDimensions from "../../../../helper/useWindowDimensions";

const {
  IoSettings,
  IoTrendingDown,
  IoTrendingUp,
  IoLogoFacebook,
  IoLogoTiktok,
  IoLogoYoutube,
  IoPeople,
  IoCash,
  IoReader,
  IoCopy,
  IoTime,
  IoCalendar,
  IoChatboxEllipses,
  IoArrowForward,
  IoLocation,
  IoArrowUp,
  MdDoubleArrow,
  IoAdd,
  IoArrowDown,
  IoRemove,
  IoExit,
  IoCreateOutline,
  IoEye,
  IoEyeOff,
  IoCheckmark,
  IoClose,
  IoCheckmarkCircleOutline,
  IoDownloadOutline,
} = icons;

const ReferredList = () => {
  const { width } = useWindowDimensions();
  const sliderRef = useRef(null);
  const navigate = useNavigate();
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [isEnd, setIsEnd] = useState(false);
  const [startPageHistoryReceive, setStartPageHistoryReceive] = useState(0); // Giá trị bắt đầu trang của lịch sử nhận chiết khấu
  const [currentPageHistoryReceive, setCurrentPageHistoryReceive] = useState(1);

      const [valueSelectProvince, setValueSelectProvince] = useState(""); // Giá trị lựa chọn tỉnh/thành phố
      const [valueSelectDistrict, setValueSelectDistrict] = useState(""); // Giấ trị lựa chọn quận/huyện

  const onChangePageHistoryReceive = (value) => {
    setStartPageHistoryReceive(value);
  };
  const calculateCurrentPage = (event) => {
    setCurrentPageHistoryReceive(event);
    onChangePageHistoryReceive(event * lengthPage - lengthPage);
  };
  // Hàm kiểm tra khi nào cuộn tới cuối
  const checkIfEnd = () => {
    if (sliderRef.current) {
      const atEnd =
        sliderRef.current.scrollLeft >=
          sliderRef.current.scrollWidth - sliderRef.current.clientWidth &&
        sliderRef.current.scrollLeft !== 0; // Trừ đi 5 để tránh sai số
      setIsEnd(atEnd);
    }
  };
  // Hàm cuộn một đoạn xác định
  const scrollByDistance = (distance) => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: distance, behavior: "smooth" });
      setScrollLeft(sliderRef.current.scrollLeft + distance);
    }
  };
  const onMouseDown = (e) => {
    setIsDragging(true);
    setStartPos(e.pageX - sliderRef.current.offsetLeft);
    setScrollLeft(sliderRef.current.scrollLeft);
  };
  const onMouseLeave = () => {
    setIsDragging(false);
  };
  const onMouseUp = () => {
    setIsDragging(false);
  };
  const onMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - sliderRef.current.offsetLeft;
    const walk = (x - startPos) * 2; // Số pixel để cuộn
    sliderRef.current.scrollLeft = scrollLeft - walk;
  };
  // Xử lý sự kiện cảm ứng
  const onTouchStart = (e) => {
    setIsDragging(true);
    setStartPos(e.touches[0].pageX - sliderRef.current.offsetLeft);
    setScrollLeft(sliderRef.current.scrollLeft);
  };
  const onTouchEnd = () => {
    setIsDragging(false);
  };
  const onTouchMove = (e) => {
    if (!isDragging) return;
    const x = e.touches[0].pageX - sliderRef.current.offsetLeft;
    const walk = (x - startPos) * 2; // Số pixel để cuộn
    sliderRef.current.scrollLeft = scrollLeft - walk;
  };
  const user = useSelector(getUser);
  const currentData = localStorage.getItem("access_token");
  const formatData = JSON.parse(currentData);
  const currentData1 = localStorage.getItem("persist:auth");
  const formatData1 = JSON.parse(currentData1);
  const dispatch = useDispatch();
  const [startPage, setStartPage] = useState(0);
  const [startPageWithdrawal, setStartPageWithdrawal] = useState(0);
  const [lengthPage, setLengthPage] = useState(5);
  const [lengthPageWithdrawalRequest, setLengthPageWithdrawalRequest] =
    useState(
      JSON.parse(localStorage.getItem("linePerPage"))
        ? JSON.parse(localStorage.getItem("linePerPage")).value
        : 20
    );
  const [isLoading, setIsLoading] = useState(false);
  const [item, setItem] = useState();
  const lang = useSelector(getLanguageState);
  const [valueSearch, setValueSearch] = useState("");

  /* ~~~ Value ~~~ */
  const [selectStatus, setSelectStatus] = useState(""); // Giá trị lựa chọn trạng thái
  const [selectObject, setSelectObject] = useState(""); // Giá trị lựa chọn đối tượng (mặc định là đối tác)
  const [selectTransferType, setSelectTransferType] = useState(""); // Giá trị lựa chọn loại giao dịch
  const [selectPaymentMetod, setSelectPaymentMetod] = useState(""); // Giá trị lựa chọn phương thức thanh toán
  const [selectWalletType, setSelectWalletMetod] = useState(""); // Giá trị lựa chọn phương thức thanh toán
  const [selectTab, setSelectTab] = useState(0);
  const [valueUserInfo, setValueUserInfo] = useState([]);
  const [valueReferralCode, setValueReferralCode] = useState("");
  const [dataListReferralPerson, setDataListReferralPerson] = useState([]);
  const [dataHistoryDiscount, setDataHistoryDiscount] = useState([]);
  const [totalDataHistoryDiscount, setTotalDataHistoryDiscount] = useState(0);
  const [dataWithdrawalHistory, setDataWithdrawalHistory] = useState([]);
  const [startDate, setStartDate] = useState(""); // Giá trị ngày bắt đầu
  const [endDate, setEndDate] = useState(""); // Giá trị ngày kết thúc
  const [selectFilter, setSelectFilter] = useState([
    { key: "status", code: "" },
    { key: "subject", code: "" },
    { key: "type_transfer", code: "" },
    { key: "payment_out", code: "" },
    { key: "payment_in", code: "" },
  ]);
  const [valueMoneyWithdrawal, setValueMoneyWithdrawal] = useState(""); // Giá trị nhập số tiền muốn rút
  const [valueSuggestMoney, setValueSuggestMoney] = useState([]); // Giá trị gợi ý số tiền
  const [valueDescribeMoney, setValueDescribeMoney] = useState(
    "Vui lòng nhập số tiền muốn rút"
  ); // Giá trị nhắc nhở số tiền cần nạp là bao nhiều
  const [valueCardHolder, setValueCardHolder] = useState(""); // Giá trị tên của chủ thẻ tài khoản ngân hàng
  const [valueCardNumber, setValueCardNumber] = useState(""); // Giá trị số tài khoản của thẻ tài khoản ngân hàng
  const [valueSelectBank, setValueSelectBank] = useState(""); // Giá trị lựa chọn ngân hàng

  /* ~~~ Flag ~~~ */
  const [showModalWithdrawal, setShowModalWithdrawal] = useState(false);
  const [showModalBankInfo, setShowModalBankInfo] = useState(false);
  const [showModalPolicy, setShowModalPolicy] = useState(false);
  const [showModalShareLink, setShowModalShareLink] = useState(false);
  const [showModalInformation, setShowModalInformation] = useState(false);
  const [isCheckBankExist, setIsCheckBankExist] = useState(false); // Giá trị kiểm tra tài khoản đã có tài khoản ngân hàng hay chưa
  const [isChangeReferralCode, setIsChangeReferralCode] = useState(false);
  const [isShowCardNumber, setIsShowCardNumber] = useState(false);
  const [isShowChangePassword, setIsShowChangePassword] = useState(false);
  const [showChangePasswordInput, setShowChangePasswordInput] = useState(false);

  const [valuePerviousReferralPerson, setValuePerviousReferralPerson] =
    useState(0);
  const [valuePerviousDiscount, setValuePerviousDiscount] = useState(0);
  const [saveToken, setSaveToken] = useState(""); // Giá trị Token lưu lại thông tin số điện thoại, mã vùng số điện thoại và ngày tạo (không phải token đăng nhập)
  const [otp, setOtp] = useState(Array(6).fill("")); // Trạng thái lưu giá trị từng ô
  const [valueCurrentPassword, setValueCurrentPassword] = useState(""); // Giá trị mật khẩu hiện tại
  const [valueNewPassword, setValueNewPassword] = useState(""); // Giá trị mật khẩu mới
  const [valueConfirmPassword, setValueConfirmPassword] = useState(""); // Giá trị xác nhận mật khẩu mới
    const [listDistrict, setListDistrict] = useState([]); // Giá trị danh sách quận/huyện sau khi chọn tỉnh/thành phố

  /* ~~~ List ~~~ */
  // 1. Danh sách các cột của bảng
  const columns = [
    {
      customTitle: (
        <CustomHeaderDatatable title="STT" textToolTip="Số thứ tự" />
      ),
      dataIndex: "",
      key: "ordinal",
      width: 20,
    },
    {
      customTitle: (
        <CustomHeaderDatatable
          title="Ngày tạo"
          textToolTip="Ngày tạo của lệnh giao dịch"
        />
      ),
      dataIndex: "date_create",
      key: "date_create",
      width: 30,
      position: "center",
    },
    {
      customTitle: (
        <CustomHeaderDatatable
          title="Trạng thái"
          textToolTip="Trạng thái hiện tại của lệnh giao dịch"
        />
      ),
      dataIndex: "status",
      key: "transfer_status",
      width: 35,
    },
    {
      customTitle: (
        <CustomHeaderDatatable
          title="Số tiền"
          textToolTip="Giá trị của giao dịch"
          position="right"
        />
      ),
      dataIndex: "money",
      key: "money",
      width: 35,
    },
  ];
  // 2. Danh sách các bước hướng dẫn
  const shareLinkSteps = [
    {
      id: 1,
      step: "Chia sẻ đường link của bạn cho những người muốn giới thiệu",
    },
    {
      id: 2,
      step: "Người được giới thiệu hoàn thành đơn hàng của họ sau khi nhập mã giới thiệu",
    },
    {
      id: 3,
      step: "Nhận chiết khấu 5% từ những đơn hàng hoàn thành",
    },
  ];

  /* ~~~ Handle function ~~~ */
  // 1. Hàm fetch thông tin của khách hàng hiện tại
  const fetchCustomerInfo = async () => {
    try {
      const res = await getCustomerInfoAffiliateApi();
      setValueUserInfo(res);
    } catch (err) {
      errorNotify({
        message: err?.message,
      });
    }
  };
  // 2. Hàm random mã giới thiệu mới
  const getRandomReferralCodeAndUpdate = async () => {
    try {
      dispatch(loadingAction.loadingRequest(true));
      const randomReferralCode = await getRandomReferralCodeApi();
      updateReferralCode(randomReferralCode.referral_code);
      successNotify({
        message: "Tạo mã ngẫu nhiên mới thành công",
      });
      dispatch(loadingAction.loadingRequest(false));
    } catch (err) {
      // console.log("check err ", err.message);
      errorNotify({
        message: err?.message + ", xin thử lại sau vài giây",
      });
      dispatch(loadingAction.loadingRequest(false));
    }
  };
  // 3. Hàm thay đổi mã giới thiệu
  const updateReferralCode = async (code) => {
    try {
      if (code.length > 11) {
        errorNotify({
          message: "Vui lòng nhập mã không quá 11 ký tự",
        });
      } else {
        const res = await updateReferralCodeApi({ referral_code: code });
        setIsChangeReferralCode(false);
        setValueReferralCode("");
        fetchCustomerInfo();
        successNotify({
          message: "Thay đổi mã giới thiệu thành công",
        });
      }
    } catch (err) {
      errorNotify({
        message: err?.message + ", xin thử lại sau vài giây",
      });
    }
  };
  // 4. Hàm fetch danh sách những người giới thiệu của khách hàng
  const fetchListReferralPerson = async () => {
    try {
      const res = await getListReferralPersonApi(0, 100);
      setDataListReferralPerson(res);
    } catch (err) {
      errorNotify({
        message: err?.message,
      });
    }
  };
  // 5. Hàm fetch danh sách nhận chiết khấu của khách hàng
  const fetchHistoryDiscount = async () => {
    try {
      const res = await getListActivityAffiliateApi(
        startPageHistoryReceive,
        lengthPage
      );
      // console.log("check lịch sử nhận chiết khấu >>>", res);
      setDataHistoryDiscount(res);
    } catch (err) {
      errorNotify({
        message: err?.message,
      });
    }
  };
  // 6. Hàm tạo lệnh rút
  const createWithdrawalRequest = async (payload) => {
    try {
      if (convertToMoney(payload) < 500000) {
        errorNotify({
          message: "Chưa nhập đủ số tiền tối thiểu",
        });
      } else {
        const res = await createWithdrawalRequestApi({
          money: convertToMoney(payload),
        });
        if (res) {
          successNotify({
            message: "Tạo lệnh rút thành công",
          });
          setShowModalWithdrawal(false);
          fetchCustomerInfo();
        }
      }
    } catch (err) {
      errorNotify({
        message: err?.message,
      });
    }
  };
  // 7. Hàm lấy danh sách lệnh nạp/rút
  const fetchListTransaction = async (payload) => {
    try {
      let query =
        selectFilter.map((item) => `&${item.key}=${item.code}`).join("") +
        `&start_date=${startDate}&end_date=${endDate}`;
      const res = await getListTransactionAffiliateApi(
        startPageWithdrawal,
        lengthPageWithdrawalRequest,
        query,
        ""
      );
      setDataWithdrawalHistory(res);
    } catch (err) {
      errorNotify({
        message: err?.message,
      });
    }
  };
  // 8. Hàm tạo tài khoản ngân hàng
  const createBankAccount = async (payload) => {
    try {
      const res = await createBankAccountApi(payload);
      successNotify({
        message: "Tạo tài khoản ngân hàng thành công",
      });
      setShowModalBankInfo(false);
      fetchCustomerInfo();
      checkBankAccountExist();
    } catch (err) {
      errorNotify({
        message: err.message,
      });
    }
  };
  // 9. Hàm kiểm tra tài khoản ngân hàng
  const checkBankAccountExist = async () => {
    try {
      const res = await checkBankAccountExistApi();
      if (res) {
        setIsCheckBankExist(true);
      }
    } catch (err) {
      errorNotify({
        message: err.message,
      });
    }
  };
  // 10. Hàm đăng xuất
  const handleLogout = () => {
    removeToken();
    dispatch(loadingAction.loadingRequest(true));
    dispatch(logoutAffiliateAction.logoutAffiliateRequest(navigate));
  };
  // 11. Hàm kiểm tra mật khẩu hiện tại
  const handleCheckAndUpdatePassword = async (payload) => {
    try {
      const res = await checkOldPasswordApi(payload);
      if (res) {
        try {
          const updatePassword = await updatePasswordApi(payload);
          setShowModalInformation(false);
          setIsShowChangePassword(false);
          setValueCurrentPassword("");
          setValueNewPassword("");
          setValueConfirmPassword("");
          successNotify({ message: "Cập nhật mật khẩu thành công" });
        } catch (err) {
          errorNotify({ message: err?.message || err });
        }
      }
    } catch (err) {
      errorNotify({ message: err?.message || err });
    }
  };

  /* ~~~ Use effect ~~~ */
  // 1. Fetch các dữ liệu ban đầu (thông tin khách hàng, giới thiệu chung, kiểm tra tòi khoản ngân hàng)
  useEffect(() => {
    fetchCustomerInfo();
    fetchListReferralPerson();
    checkBankAccountExist();
  }, []);
  // 2. Fetch dữ liệu lịch sử nhận chiết khấu
  useEffect(() => {
    fetchHistoryDiscount();
  }, [startPageHistoryReceive]);
  // 3. Fetch dữ liệu yêu cầu rút
  useEffect(() => {
    fetchListTransaction();
  }, [startPageWithdrawal, lengthPageWithdrawalRequest]);
  // 4. Gợi ý số tiền và cập nhật lại lời nhắc
  useEffect(() => {
    const res = generateSuggestMoney(Number(valueMoneyWithdrawal)); // Loại bỏ dấu chấm và chuyển thành kiểu number
    setValueSuggestMoney(res);
    const tempMoney = valueMoneyWithdrawal.replace(/\./g, "");
    if (Number(tempMoney) > 5000000) {
      setValueDescribeMoney("Giá tiền tối đa là 5.000.000đ");
    } else if (Number(tempMoney) < 500000 && Number(tempMoney) > 0) {
      setValueDescribeMoney("Số tiền tối thiểu để rút là 500.000đ");
    } else if (Number(tempMoney) >= 500000 && Number(tempMoney) <= 5000000) {
      setValueDescribeMoney("");
    } else {
      setValueDescribeMoney("Vui lòng nhập số tiền muốn rút");
    }
  }, [valueMoneyWithdrawal]);
  // 5. Cập nhật là danh sách giới thiệu chung đã đến cuối danh sách chưa
  useEffect(() => {
    checkIfEnd();
  }, [scrollLeft]);
  // 6. Hàm tự động kiểm tra mật khẩu hiện tại là đúng hay sai
  /* ~~~ Other  ~~~ */
  const copyToClipBoard = (text) => {
    if (text && text.length > 0) {
      navigator.clipboard.writeText(text);
      successNotify({
        message: `Sao chép thành công`,
      });
    }
  };
  const generateSuggestMoney = (money) => {
    if (money === 0 || money === "") {
      return ["500000", "700000", "1000000"];
    } else {
      if (money > 0 && money < 100) {
        return [
          String(money * 1000),
          String(money * 10000),
          String(money * 100000),
        ];
      } else if (money >= 100 && money < 1000) {
        return [String(money * 1000), String(money * 10000)];
      } else {
        return ["500000", "1000000", "5000000"];
      }
    }
  };
  const convertToMoney = (value) => {
    const tempMoney = value.replace(/\./g, "");
    return Number(tempMoney);
  };

  const inputRefs = useRef([]);

  const handleChange = (e, index) => {
    const value = e.target.value;

    // Chỉ cho phép nhập số
    if (!/^\d*$/.test(value)) {
      return;
    }
    // Cập nhật giá trị vào state
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Chuyển focus sang ô tiếp theo
    if (value && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && index > 0 && !e.target.value) {
      // Quay lại ô trước nếu nhấn Backspace khi ô hiện tại đang trống
      inputRefs.current[index - 1].focus();
    }
  };

  const onChangePage = (value) => {
    setStartPageWithdrawal(value);
  };

  const handleSearch = useCallback(
    _.debounce((value) => {
      setValueSearch(value);
      setStartPage(0);
    }, 500),
    []
  );

  function doDownload(url, fileName) {
    const a = document.createElement("a");
    a.download = fileName;
    a.href = url;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  const downloadCanvasQRCode = (elementId) => {
    const canvas = document.getElementById(elementId)?.querySelector("canvas");
    if (canvas) {
      const url = canvas.toDataURL();
      doDownload(url, "QRCode.png");
    }
  };

  /* ~~~ Main  ~~~ */
  return (
    <div className="refferend-list-affiliate">
      <div className="refferend-list-affiliate__content">
        <div className="refferend-list-affiliate__content--left">
          {/* Guide for invite new person */}
          <div className="refferend-list-affiliate__content--left-card no-padding card-shadow">
            <div className="refferend-list-affiliate__content--left-card-header">
              <span>Cách giới thiệu</span>
            </div>
            <div className="refferend-list-affiliate__content--left-card-body">
              {/* Ảnh bìa */}
              <div className="refferend-list-affiliate__content--left-card-body-image">
                <img
                  className="refferend-list-affiliate__content--left-card-body-image"
                  src={affiliateLogo}
                ></img>
              </div>
              {shareLinkSteps?.map((el, index) => (
                <div className="refferend-list-affiliate__content--left-card-body-steps">
                  <div className="refferend-list-affiliate__content--left-card-body-steps-count">
                    <div className="refferend-list-affiliate__content--left-card-body-steps-count-circle">
                      {index + 1}
                    </div>
                    {index < shareLinkSteps.length - 1 && (
                      <div className="refferend-list-affiliate__content--left-card-body-steps-count-line"></div>
                    )}
                  </div>
                  <div className="refferend-list-affiliate__content--left-card-body-steps-step">
                    <span>{el.step}</span>
                  </div>
                </div>
              ))}
              {/* Mã sao chép */}
              <div className="refferend-list-affiliate__content--left-card-body-code">
                <div className="refferend-list-affiliate__content--left-card-body-code-content">
                  <span className="refferend-list-affiliate__content--left-card-body-code-content-label">
                    {valueUserInfo?.referral_code || ""}
                  </span>
                  <span
                    onClick={() =>
                      copyToClipBoard(valueUserInfo?.referral_code)
                    }
                    className="refferend-list-affiliate__content--left-card-body-code-content-copy"
                  >
                    Sao chép
                  </span>
                </div>
                <div className="refferend-list-affiliate__content--left-card-body-code-describe">
                  <span>Mã nhận chiết khấu</span>
                </div>
                <div className="refferend-list-affiliate__content--left-card-body-code-content">
                  <span className="refferend-list-affiliate__content--left-card-body-code-content-label">
                    {valueUserInfo?.promotional_referral_code || ""}
                  </span>
                  <span
                    onClick={() =>
                      copyToClipBoard(valueUserInfo?.promotional_referral_code)
                    }
                    className="refferend-list-affiliate__content--left-card-body-code-content-copy"
                  >
                    Sao chép
                  </span>
                </div>
                <div className="refferend-list-affiliate__content--left-card-body-code-describe">
                  <span>Mã gửi voucher 15%</span>
                </div>
                {/* Thay đổi mã code */}
                {/* {isChangeReferralCode && (
                  <div className="refferend-list-affiliate__content--left-card-body-code-content">
                    <input
                      value={valueReferralCode}
                      onChange={(e) => setValueReferralCode(e.target.value)}
                      placeholder="Nhập mã mới"
                      className="refferend-list-affiliate__content--left-card-body-code-content-input"
                    ></input>
                    {valueReferralCode.length <= 0 ? (
                      <span className="refferend-list-affiliate__content--left-card-body-code-content-copy not-allow-save">
                        Lưu
                      </span>
                    ) : (
                      <span
                        onClick={() => {
                          updateReferralCode(valueReferralCode);
                        }}
                        className="refferend-list-affiliate__content--left-card-body-code-content-copy"
                      >
                        Lưu
                      </span>
                    )}
                  </div>
                )}
                {!isChangeReferralCode && (
                  <div
                    onClick={() => setIsChangeReferralCode(true)}
                    className="refferend-list-affiliate__content--left-card-body-code-random"
                  >
                    <span className="refferend-list-affiliate__content--left-card-body-code-random-label">
                      Chỉnh sửa mã giới thiệu
                    </span>
                  </div>
                )} */}
                {/* <div
                  onClick={() => getRandomReferralCodeAndUpdate()}
                  className="refferend-list-affiliate__content--left-card-body-code-random"
                >
                  <span className="refferend-list-affiliate__content--left-card-body-code-random-label">
                    Tạo mã mới ngẫu nhiên
                  </span>
                </div> */}
                <div
                  onClick={() => setShowModalShareLink(true)}
                  className="refferend-list-affiliate__content--left-card-body-code-random"
                >
                  <span className="refferend-list-affiliate__content--left-card-body-code-random-label">
                    Chia sẻ ngay
                  </span>
                </div>
              </div>
            </div>
          </div>
          {/* Benefit of join the event */}
          <div className="refferend-list-affiliate__content--left-share card-shadow">
            {/* Header */}
            <div className="refferend-list-affiliate__content--left-share-header">
              <span className="">Đường dẫn chia sẻ của chương trình</span>
            </div>
            {/* Content */}
            <div className="refferend-list-affiliate__content--left-share-content">
              {/* Nhận ngay chiết khấu */}
              <div className="refferend-list-affiliate__content--left-share-content-share">
                <div className="refferend-list-affiliate__content--left-share-content-share-header">
                  <span>Nhận chiết khấu ngay:</span>
                </div>
                <div className="refferend-list-affiliate__content--left-share-content-share-link">
                  <span className="refferend-list-affiliate__content--left-share-content-share-link-url">
                    {valueUserInfo?.referral_link || ""}
                  </span>
                  <span
                    onClick={() => {
                      copyToClipBoard(valueUserInfo?.referral_link);
                    }}
                    className="refferend-list-affiliate__content--left-share-content-share-link-url-copy"
                  >
                    Sao chép
                  </span>
                </div>
              </div>
              {/* Gửi voucher giảm giá ngay */}
              <div className="refferend-list-affiliate__content--left-share-content-share">
                <div className="refferend-list-affiliate__content--left-share-content-share-header">
                  <span>Gửi voucher giảm giá ngay:</span>
                </div>
                <div className="refferend-list-affiliate__content--left-share-content-share-link">
                  <span className="refferend-list-affiliate__content--left-share-content-share-link-url">
                    {valueUserInfo?.promotional_referral_link || ""}
                  </span>
                  <span
                    onClick={() => {
                      copyToClipBoard(valueUserInfo?.promotional_referral_link);
                    }}
                    className="refferend-list-affiliate__content--left-share-content-share-link-url-copy"
                  >
                    Sao chép
                  </span>
                </div>
              </div>
            </div>
          </div>
          {/* Loggout */}
          <div
            onClick={() => navigate("/", { state: { closePopup: true } })}
            className="refferend-list-affiliate__content--left-exit card-shadow"
          >
            <span className="refferend-list-affiliate__content--left-exit-title">
              Trở về trang giới thiệu
            </span>
            <span className="refferend-list-affiliate__content--left-exit-icon">
              <IoExit />
            </span>
          </div>
        </div>
        <div className="refferend-list-affiliate__content--middle">
          {/* Container for: overview, history receive money, withdrawal request */}
          <div className="refferend-list-affiliate__content--middle-content card-shadow">
            {/* Header */}
            <div className="refferend-list-affiliate__content--middle-content-header">
              <span>
                {selectTab === 0
                  ? "Giới thiệu chương trình"
                  : selectTab === 1
                  ? "Lịch sử nhận chiết khấu"
                  : "Lịch sử yêu cầu rút"}
              </span>
              <div className="refferend-list-affiliate__content--middle-content-header-options">
                <span
                  onClick={() => setSelectTab(0)}
                  className={`refferend-list-affiliate__content--middle-content-header-options-tab ${
                    selectTab === 0 && "activated"
                  }`}
                >
                  Giới thiệu chung
                </span>
                <span
                  onClick={() => setSelectTab(1)}
                  className={`refferend-list-affiliate__content--middle-content-header-options-tab ${
                    selectTab === 1 && "activated"
                  }`}
                >
                  Lịch sử nhận chiết khấu
                </span>
                <span
                  onClick={() => setSelectTab(2)}
                  className={`refferend-list-affiliate__content--middle-content-header-options-tab ${
                    selectTab === 2 && "activated"
                  }`}
                >
                  Yêu cầu rút
                </span>
              </div>
            </div>
            {selectTab === 1 ? (
              // History receive money
              <>
                {dataHistoryDiscount?.data?.length > 0 ? (
                  <>
                    {dataHistoryDiscount?.data?.map((el, index) => (
                      <div className="refferend-list-affiliate__content--middle-content-history-receiving">
                        {/* Left */}
                        <div className="refferend-list-affiliate__content--middle-content-history-receiving-left">
                          <span className="refferend-list-affiliate__content--middle-content-history-receiving-left-time">
                            {moment(new Date(el?.date_create)).format(
                              "DD MMM, YYYY - HH:mm"
                            )}
                          </span>
                          <span className="refferend-list-affiliate__content--middle-content-history-receiving-left-date">
                            {moment(new Date(el?.date_create)).format("dddd")}
                          </span>
                        </div>
                        {/* Line */}
                        <div className="refferend-list-affiliate__content--middle-content-history-receiving-middle">
                          <div
                            className={`refferend-list-affiliate__content--middle-content-history-receiving-middle-icon admin ${
                              el?.type === "system_receive_discount"
                                ? "up"
                                : el?.type ===
                                  "customer_request_withdraw_affiliate"
                                ? "down"
                                : "setting"
                            }`}
                          >
                            {el?.type === "system_receive_discount" ? (
                              <IoArrowUp size={16} color="green" />
                            ) : el?.type ===
                              "customer_request_withdraw_affiliate" ? (
                              <IoArrowDown size={16} color="red" />
                            ) : (
                              <IoSettings size={16} color="setting" />
                            )}
                          </div>

                          <div
                            className={`refferend-list-affiliate__content--middle-content-history-receiving-middle-line ${
                              index === dataHistoryDiscount?.data?.length - 1 &&
                              "hidden"
                            }`}
                          ></div>
                        </div>
                        {/* Right */}
                        <div className="refferend-list-affiliate__content--middle-content-history-receiving-right">
                          <div className="refferend-list-affiliate__content--middle-content-history-receiving-right-top">
                            <div>
                              <span className="refferend-list-affiliate__content--middle-content-history-receiving-right-top-title">
                                {el?.title?.vi}
                              </span>
                              <>
                                <div className="refferend-list-affiliate__content--middle-content-history-receiving-right-top-money ">
                                  <span className="refferend-list-affiliate__content--middle-content-history-receiving-right-top-money-title">
                                    Ví A Pay:
                                  </span>
                                  <span>{formatMoney(el?.current_a_pay)}</span>
                                  {el?.status_current_a_pay === "up" ? (
                                    <IoTrendingUp color="green" />
                                  ) : el?.status_current_a_pay === "down" ? (
                                    <IoTrendingDown color="red" />
                                  ) : (
                                    <IoRemove color="black" />
                                  )}
                                </div>
                              </>
                            </div>
                            {el?.value !== 0 && (
                              <div className="refferend-list-affiliate__content--middle-content-history-receiving-right-top-transiction">
                                <span
                                  className={`refferend-list-affiliate__content--middle-content-history-receiving-right-top-transiction-number ${
                                    el?.status_current_a_pay === "up"
                                      ? "up"
                                      : el?.status_current_a_pay === "down"
                                      ? "down"
                                      : "none"
                                  }`}
                                >
                                  {formatMoney(el?.value)}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                    <div className="refferend-list-affiliate__content--middle-content-pagination">
                      <div></div>
                      <Pagination
                        current={currentPageHistoryReceive}
                        onChange={calculateCurrentPage}
                        total={dataHistoryDiscount?.totalItem}
                        showSizeChanger={false}
                        pageSize={lengthPage}
                      />
                    </div>
                  </>
                ) : (
                  <div className="refferend-list-affiliate__content--middle-content-history-receiving">
                    <div className="refferend-list-affiliate__content--middle-content-history-receiving-not-found">
                      <img className="" src={notFoundImage}></img>
                      <span className="refferend-list-affiliate__content--middle-content-history-receiving-not-found-label">
                        Chưa có dữ liệu
                      </span>
                    </div>
                  </div>
                )}
              </>
            ) : selectTab === 2 ? (
              // Withdrawal request list
              <>
                <div style={{ padding: "12px" }}>
                  <DataTable
                    columns={columns}
                    data={dataWithdrawalHistory?.data}
                    start={startPageWithdrawal}
                    pageSize={lengthPageWithdrawalRequest}
                    setLengthPage={setLengthPageWithdrawalRequest}
                    totalItem={dataWithdrawalHistory?.totalItem}
                    onCurrentPageChange={onChangePage}
                    // scrollX={2300}
                    getItemRow={setItem}
                    loading={isLoading}
                    // headerRightContent={
                    //   <div className="manage-top-up-with-draw__table--right-header">
                    //     <div className="manage-top-up-with-draw__table--right-header--search-field">
                    //       <InputTextCustom
                    //         type="text"
                    //         placeHolderNormal="Tìm kiếm"
                    //         onChange={(e) => {
                    //           handleSearch(e.target.value);
                    //         }}
                    //       />
                    //     </div>
                    //   </div>
                    // }
                  />
                </div>
              </>
            ) : (
              // Reference person list
              <>
                <div className="refferend-list-affiliate__content--middle-content-refferend-list">
                  <div className="refferend-list-affiliate__content--middle-content-refferend-list-container">
                    <div
                      ref={sliderRef}
                      onMouseDown={onMouseDown}
                      onMouseLeave={onMouseLeave}
                      onMouseUp={onMouseUp}
                      onMouseMove={onMouseMove}
                      onTouchStart={onTouchStart}
                      onTouchEnd={onTouchEnd}
                      onTouchMove={onTouchMove}
                      className="refferend-list-affiliate__content--middle-content-refferend-list-container-persons"
                    >
                      {dataListReferralPerson?.data?.map((el, index) => (
                        <div
                          className={`refferend-list-affiliate__content--middle-content-refferend-list-container-persons-person ${
                            index === 0 && "first-item"
                          }`}
                        >
                          <div className="refferend-list-affiliate__content--middle-content-refferend-list-container-persons-person-value">
                            <div className="refferend-list-affiliate__content--middle-content-refferend-list-container-persons-person-value-unit">
                              <span className="refferend-list-affiliate__content--middle-content-refferend-list-container-persons-person-value-unit-label">
                                Số đơn
                              </span>
                              <span className="refferend-list-affiliate__content--middle-content-refferend-list-container-persons-person-value-unit-number">
                                {el?.total_done_order}
                              </span>
                            </div>
                          </div>
                          <div className="refferend-list-affiliate__content--middle-content-refferend-list-container-persons-person-info">
                            <span className="refferend-list-affiliate__content--middle-content-refferend-list-container-persons-person-info-name">
                              {getInitials(el?.full_name)}
                            </span>
                          </div>
                          <div className="refferend-list-affiliate__content--middle-content-refferend-list-container-persons-person-counting newest-person">
                            <span>Người giới thiệu {index + 1}</span>
                            <span className="refferend-list-affiliate__content--middle-content-refferend-list-container-persons-person-counting-phone">
                              *** *** {el?.phone?.slice(-4) || ""}
                            </span>
                          </div>
                        </div>
                      ))}
                      {dataListReferralPerson?.data?.length < 20 &&
                        Array.from({
                          length: 20 - dataListReferralPerson?.data?.length,
                        }).map((_, index) => (
                          <div
                            className={`refferend-list-affiliate__content--middle-content-refferend-list-container-persons-person `}
                          >
                            <div className="refferend-list-affiliate__content--middle-content-refferend-list-container-persons-person-value">
                              <div className="refferend-list-affiliate__content--middle-content-refferend-list-container-persons-person-value-unit">
                                <span className="refferend-list-affiliate__content--middle-content-refferend-list-container-persons-person-value-unit-label">
                                  Thưởng
                                </span>
                                <span className="refferend-list-affiliate__content--middle-content-refferend-list-container-persons-person-value-unit-number">
                                  ?
                                </span>
                              </div>
                            </div>
                            <div className="refferend-list-affiliate__content--middle-content-refferend-list-container-persons-person-info adding">
                              <span className="refferend-list-affiliate__content--middle-content-refferend-list-container-persons-person-info-name adding">
                                +
                              </span>
                            </div>
                            <div className="refferend-list-affiliate__content--middle-content-refferend-list-container-persons-person-counting newest-person">
                              <span>
                                Người giới thiệu{" "}
                                {index +
                                  dataListReferralPerson?.data?.length +
                                  1}
                              </span>
                              <span className="refferend-list-affiliate__content--middle-content-refferend-list-container-persons-person-counting-phone">
                                *** *** ***
                              </span>
                            </div>
                          </div>
                        ))}
                    </div>
                    <div
                      onClick={() => scrollByDistance(-400)}
                      className={`refferend-list-affiliate__content--middle-content-refferend-list-container-navigate left ${
                        sliderRef?.current?.scrollLeft === 0 && "hidden"
                      }`}
                    >
                      <div className="refferend-list-affiliate__content--middle-content-refferend-list-container-navigate-icon left">
                        <MdDoubleArrow className="rotate-left" />
                      </div>
                    </div>
                    <div
                      onClick={() => scrollByDistance(400)}
                      className={`refferend-list-affiliate__content--middle-content-refferend-list-container-navigate right ${
                        isEnd && "hidden"
                      }`}
                    >
                      <div className="refferend-list-affiliate__content--middle-content-refferend-list-container-navigate-icon right">
                        <MdDoubleArrow />
                      </div>
                    </div>
                    <div className="refferend-list-affiliate__content--middle-content-refferend-list-container-note">
                      {/* Half left */}
                      <div className="refferend-list-affiliate__content--middle-content-refferend-list-container-note-child">
                        <span className="refferend-list-affiliate__content--middle-content-refferend-list-container-note-child-header">
                          Lưu ý khi thực hiện rút tiền rút tiền:
                        </span>
                        <span>
                          1. Số tiền tối thiểu để yêu cầu lệnh rút là{" "}
                          <span className="high-light">500.000</span> VNĐ.
                        </span>
                        <span>
                          2. Sau khi thực hiện giao dịch, vui lòng đợi{" "}
                          <span className="high-light">GUVI</span> xác nhận giao
                          dịch của bạn.
                        </span>
                        <span>
                          3. Để được duyệt nhanh hơn bạn nên giao dịch vào giờ
                          hành chính. Những giao dịch sau{" "}
                          <span className="high-light">17h</span> giờ và{" "}
                          <span className="high-light">thứ 7, chủ nhật</span> sẽ
                          được ghi nhận vào ngày thứ 2 tuần sau.
                        </span>
                        <span>
                          4. Xin vui lòng liên hệ GUVI vào số hotline:{" "}
                          <span className="high-light">1900.0027</span> nếu bạn
                          chưa được xác nhận thanh toán sau 72 giờ.
                        </span>
                      </div>
                      {/* Half right */}
                      <div className="refferend-list-affiliate__content--middle-content-refferend-list-container-note-image">
                        <img
                          className="refferend-list-affiliate__content--middle-content-refferend-list-container-note-image-child"
                          src={overViewAffilaite}
                        ></img>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
        <div className="refferend-list-affiliate__content--right">
          {/* Information card */}
          <div className="refferend-list-affiliate__content--right-info card-shadow">
            <div className="refferend-list-affiliate__content--right-info-content">
              <div className="refferend-list-affiliate__content--right-info-content-avatar">
                <img src={userDefault} alt=""></img>
              </div>
              <div className="refferend-list-affiliate__content--right-info-content-name">
                <span className="refferend-list-affiliate__content--right-info-content-name-title">
                  {valueUserInfo?.full_name || ""}{" "}
                </span>
                <span className="refferend-list-affiliate__content--right-info-content-name-sub">
                  {valueUserInfo?.phone || ""}{" "}
                </span>
              </div>
            </div>
            <div className="refferend-list-affiliate__content--right-info-action">
              <Tooltip placement="bottom" title="Chỉnh sửa thông tin">
                <div
                  onClick={() => setShowModalInformation(true)}
                  className="refferend-list-affiliate__content--right-info-action-child card-shadow"
                >
                  <span>
                    <IoCreateOutline size="16px" />
                  </span>
                </div>
              </Tooltip>
              <Tooltip placement="bottom" title="Đăng xuất">
                <div
                  onClick={() => handleLogout()}
                  className="refferend-list-affiliate__content--right-info-action-child card-shadow"
                >
                  <span>
                    <IoExit size="16px" />
                  </span>
                </div>
              </Tooltip>
            </div>
          </div>
          {/* Total person introduced */}
          <div className="refferend-list-affiliate__content--right-statistic border-left-highlight border-red card-shadow">
            {/* Số lượng thống kê */}
            <div className="refferend-list-affiliate__content--right-statistic-content">
              {/* label và value */}
              <div className="refferend-list-affiliate__content--right-statistic-content-describe">
                <span className="refferend-list-affiliate__content--right-statistic-content-describe-label">
                  Tổng người giới thiệu
                </span>
                <span className="refferend-list-affiliate__content--right-statistic-content-describe-value">
                  {/* {dataListReferralPerson?.totalItem || 0}{" "} */}
                  {valueUserInfo?.total_referral_person || 0}{" "}
                  <span className="unit">người</span>
                </span>
              </div>
              {/* icon */}
              <div className="refferend-list-affiliate__content--right-statistic-content-icon red">
                <IoPeople />
              </div>
            </div>
            {/* So với 30 ngày gần đây */}
            <div className="refferend-list-affiliate__content--right-statistic-previous">
              <span>
                30 ngày gần đây:{" "}
                {valueUserInfo?.total_referral_person_30_days_ago || 0} người
              </span>
            </div>
          </div>
          {/* Total money received */}
          <div className="refferend-list-affiliate__content--right-statistic border-left-highlight border-blue card-shadow">
            {/* Số lượng thống kê */}
            <div className="refferend-list-affiliate__content--right-statistic-content">
              {/* label và value */}
              <div className="refferend-list-affiliate__content--right-statistic-content-describe">
                <span className="refferend-list-affiliate__content--right-statistic-content-describe-label">
                  Tổng tiền
                </span>
                <span className="refferend-list-affiliate__content--right-statistic-content-describe-value">
                  {/* {dataListReferralPerson?.totalItem || 0}{" "} */}
                  {formatNumber(valueUserInfo?.total_discount || 0)}{" "}
                  <span className="unit">VNĐ</span>
                </span>
              </div>
              {/* icon */}
              <div className="refferend-list-affiliate__content--right-statistic-content-icon blue">
                <IoCash />
              </div>
            </div>
            {/* So với 30 ngày gần đây */}
            <div className="refferend-list-affiliate__content--right-statistic-previous">
              <span>
                30 ngày gần đây:{" "}
                {valueUserInfo?.total_discount_30_days_ago || 0} người
              </span>
            </div>
          </div>
          {/* Total money received */}
          <div className="refferend-list-affiliate__content--right-statistic border-left-highlight border-green card-shadow">
            {/* Số lượng thống kê */}
            <div className="refferend-list-affiliate__content--right-statistic-content">
              {/* label và value */}
              <div className="refferend-list-affiliate__content--right-statistic-content-describe">
                <span className="refferend-list-affiliate__content--right-statistic-content-describe-label">
                  Tổng đơn
                </span>
                <span className="refferend-list-affiliate__content--right-statistic-content-describe-value">
                  {formatNumber(valueUserInfo?.total_number_orders || 0)}{" "}
                  <span className="unit">đơn</span>
                </span>
              </div>
              {/* icon */}
              <div className="refferend-list-affiliate__content--right-statistic-content-icon green">
                <IoReader />
              </div>
            </div>
            {/* So với 30 ngày gần đây */}
            <div className="refferend-list-affiliate__content--right-statistic-previous">
              <span>
                30 ngày gần đây:{" "}
                {valueUserInfo?.total_number_orders_30_days_ago || 0} đơn
              </span>
            </div>
          </div>
          {/* Bank card */}
          <div className="refferend-list-affiliate__content--right-bank card-shadow">
            {isCheckBankExist ? (
              <>
                <div className="refferend-list-affiliate__content--right-bank-content">
                  {/* Đầu */}
                  <div className="refferend-list-affiliate__content--right-bank-content-top">
                    <div className="refferend-list-affiliate__content--right-bank-content-top-circle">
                      <div className="refferend-list-affiliate__content--right-bank-content-top-circle-shape red"></div>
                      <div className="refferend-list-affiliate__content--right-bank-content-top-circle-shape orange"></div>
                    </div>
                    <div className="refferend-list-affiliate__content--right-bank-content-top-location">
                      <IoLocation className="refferend-list-affiliate__content--right-bank-content-top-location-icon" />
                      <span className="refferend-list-affiliate__content--right-bank-content-top-location-label">
                        {valueUserInfo?.bank_account?.bank_name}
                      </span>
                    </div>
                  </div>
                  {/* Giữa */}
                  <div className="refferend-list-affiliate__content--right-bank-content-middle">
                    {/* Thông tin số 1 */}
                    <div className="refferend-list-affiliate__content--right-bank-content-middle-info">
                      <span className="refferend-list-affiliate__content--right-bank-content-middle-info-label">
                        Số thẻ
                      </span>
                      <span className="refferend-list-affiliate__content--right-bank-content-middle-info-value">
                        {formatCardNumber(
                          isShowCardNumber
                            ? valueUserInfo?.bank_account?.account_number
                            : valueUserInfo?.account_number
                        )}
                      </span>
                    </div>
                    {/* Thông tin số 2 */}
                    <div className="refferend-list-affiliate__content--right-bank-content-middle-info">
                      <span className="refferend-list-affiliate__content--right-bank-content-middle-info-label">
                        Số dư
                      </span>
                      <span className="refferend-list-affiliate__content--right-bank-content-middle-info-value">
                        {formatNumber(valueUserInfo?.a_pay || 0)} VNĐ
                      </span>
                    </div>
                  </div>
                </div>
                <div className="refferend-list-affiliate__content--right-bank-bottom">
                  <span className="refferend-list-affiliate__content--right-bank-bottom-name">
                    {valueUserInfo?.account_holder || ""}
                  </span>
                  <div className="refferend-list-affiliate__content--right-bank-bottom-icon">
                    <div
                      onClick={() => setIsShowCardNumber(!isShowCardNumber)}
                      className="refferend-list-affiliate__content--right-bank-bottom-icon-child"
                    >
                      <Tooltip placement="top" title="Xem số tài khoản">
                        <div className="refferend-list-affiliate__content--right-bank-bottom-icon-child-icon">
                          {isShowCardNumber ? (
                            <IoEyeOff color="black" />
                          ) : (
                            <IoEye color="black" />
                          )}
                        </div>
                      </Tooltip>
                    </div>
                    <div
                      onClick={() => setShowModalWithdrawal(true)}
                      className="refferend-list-affiliate__content--right-bank-bottom-icon-child"
                    >
                      <Tooltip placement="top" title="Rút tiền">
                        <div className="refferend-list-affiliate__content--right-bank-bottom-icon-child-icon">
                          <IoArrowUp color="black" />
                        </div>
                      </Tooltip>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="refferend-list-affiliate__content--right-bank-content">
                  {/* Đầu */}
                  <div className="refferend-list-affiliate__content--right-bank-content-top">
                    <div className="refferend-list-affiliate__content--right-bank-content-top-circle">
                      <div className="refferend-list-affiliate__content--right-bank-content-top-circle-shape red"></div>
                      <div className="refferend-list-affiliate__content--right-bank-content-top-circle-shape orange"></div>
                    </div>
                    <div className="refferend-list-affiliate__content--right-bank-content-top-location">
                      <IoLocation className="refferend-list-affiliate__content--right-bank-content-top-location-icon" />
                      <span className="refferend-list-affiliate__content--right-bank-content-top-location-label">
                        Viet Nam
                      </span>
                    </div>
                  </div>
                  {/* Giữa */}
                  <div className="refferend-list-affiliate__content--right-bank-content-middle">
                    {/* Thông tin số 1 */}
                    <div className="refferend-list-affiliate__content--right-bank-content-middle-info">
                      <span className="refferend-list-affiliate__content--right-bank-content-middle-info-label">
                        Số thẻ
                      </span>
                      <span className="refferend-list-affiliate__content--right-bank-content-middle-info-value">
                        Chưa đăng ký
                      </span>
                    </div>
                  </div>
                </div>
                <div className="refferend-list-affiliate__content--right-bank-bottom">
                  <span className="refferend-list-affiliate__content--right-bank-bottom-name">
                    NHẬP THÔNG TIN TK NGÂN HÀNG
                  </span>
                  <div className="refferend-list-affiliate__content--right-bank-bottom-icon">
                    <Tooltip placement="top" title="Nhập thông tin">
                      <div
                        onClick={() => setShowModalBankInfo(true)}
                        className="refferend-list-affiliate__content--right-bank-bottom-icon-icon"
                      >
                        <IoAdd color="black" />
                      </div>
                    </Tooltip>
                    {/* <span className="refferend-list-affiliate__content--right-bank-bottom-icon-label">
                  Rút tiền
                </span> */}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Event policy */}
          <div className="refferend-list-affiliate__content--right-referral-policy">
            <img
              className="refferend-list-affiliate__content--right-referral-policy-image"
              src={referralPolicy}
            ></img>
            <div className="refferend-list-affiliate__content--right-referral-policy-content">
              <span className="refferend-list-affiliate__content--right-referral-policy-content-header">
                Chính sách chương trình
              </span>
              <span className="refferend-list-affiliate__content--right-referral-policy-content-describe">
                Vui lòng đọc chính sách của chương trình trước khi tham gia
              </span>
              <span
                onClick={() => {
                  setShowModalPolicy(true);
                }}
                className="refferend-list-affiliate__content--right-referral-policy-content-read-more"
              >
                Đọc thêm <IoArrowForward />
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="refferend-list-affiliate__footer">
        <div className="refferend-list-affiliate__footer--container">
          <div className="refferend-list-affiliate__footer--container-information">
            <div className="refferend-list-affiliate__footer--container-information-item">
              <img src={logoGuvi} alt=""></img>
            </div>
            <div className="refferend-list-affiliate__footer--container-information-item">
              <span>
                Mã số:&nbsp;<span className="high-light">0317084672</span>
              </span>
            </div>
            <div className="refferend-list-affiliate__footer--container-information-item">
              <span>
                Hotline:&nbsp;<span className="high-light">1900.0027</span>
              </span>
            </div>
            <div className="refferend-list-affiliate__footer--container-information-item">
              <span>
                Email:&nbsp;
                <span className="high-light">
                  cskh@guvico.com – marketing@guvico.com
                </span>
              </span>
            </div>
          </div>
          <div className="refferend-list-affiliate__footer--container-copy-right">
            <div className="refferend-list-affiliate__footer--container-copy-right-item">
              <span>
                @ 2024 Công ty TNHH Giải pháp Công nghệ Guvi​ sở hữu bản quyền.
              </span>
            </div>
            <div
              onClick={() =>
                window.open(
                  "https://apps.apple.com/us/app/guvi-gi%C3%BAp-vi%E1%BB%87c-theo-gi%E1%BB%9D/id6443966297",
                  "_blank"
                )
              }
              className="refferend-list-affiliate__footer--container-copy-right-item"
            >
              <img src={appleStoreImage} alt=""></img>
            </div>
            {/* <Link
                        style={{ paddingBottom: "3px" }}
                        to={`/details-order/${item?.id_order?.id_group_order}`}
                        target="_blank"
                      >
                        <span className="history-activity__item--right-bottom-item-link">
                          {item?.id_order?.id_view}
                        </span>
                      </Link> */}
            <div
              onClick={() =>
                window.open(
                  "https://play.google.com/store/apps/details?id=com.guvico_customer",
                  "_blank"
                )
              }
              className="refferend-list-affiliate__footer--container-copy-right-item"
            >
              <img src={chStoreImage} alt=""></img>
            </div>
          </div>
        </div>
      </div>
      <Modal
        title="Rút tiền"
        onCancel={() => setShowModalWithdrawal(false)}
        open={showModalWithdrawal}
        width={350}
        footer={[
          <ButtonCustom
            label="Tạo giao dịch"
            fullScreen={true}
            onClick={() => createWithdrawalRequest(valueMoneyWithdrawal)}
          />,
        ]}
      >
        <div className="refferend-list-affiliate__withdrawal">
          <div className="refferend-list-affiliate__withdrawal--suggest">
            {valueSuggestMoney?.map((el) => (
              <span
                onClick={() => {
                  setValueMoneyWithdrawal(formatNumber(el));
                }}
                className="refferend-list-affiliate__withdrawal--suggest-money"
              >
                {formatMoney(el)}
              </span>
            ))}
          </div>
          <InputTextCustom
            type="text"
            value={valueMoneyWithdrawal}
            placeHolder="Số tiền muốn rút"
            onChange={(e) => setValueMoneyWithdrawal(e.target.value)}
            required={true}
            isNumber={true}
            describe={valueDescribeMoney}
          />
          <div className="refferend-list-affiliate__withdrawal--notice">
            <span className="refferend-list-affiliate__withdrawal--notice-header">
              Lưu ý khi rút tiền:
            </span>

            <div className="refferend-list-affiliate__withdrawal--notice-info">
              <div className="refferend-list-affiliate__withdrawal--notice-info-icon">
                <IoTime />
              </div>
              <span className="refferend-list-affiliate__withdrawal--notice-info-text">
                Sau khi thực hiện giao dịch, vui lòng đợi GUVI xác nhận giao
                dịch của bạn.
              </span>
            </div>
            <div className="refferend-list-affiliate__withdrawal--notice-info">
              <div className="refferend-list-affiliate__withdrawal--notice-info-icon">
                <IoCalendar />
              </div>
              <span className="refferend-list-affiliate__withdrawal--notice-info-text">
                Để được duyệt nhanh hơn bạn nên giao dịch vào giờ hành chính.
                Những giao dịch sau 17h giờ và thứ 7, chủ nhật sẽ được ghi nhận
                vào ngày hôm sau.
              </span>
            </div>
            <div className="refferend-list-affiliate__withdrawal--notice-info">
              <div className="refferend-list-affiliate__withdrawal--notice-info-icon">
                <IoChatboxEllipses />
              </div>
              <span className="refferend-list-affiliate__withdrawal--notice-info-text">
                Xin vui lòng liên hệ GUVI nếu bạn chưa được xác nhận thanh toán
                sau 72 giờ
              </span>
            </div>
          </div>
        </div>
      </Modal>
      <Modal
        title="Nhập thông tin ngân hàng"
        onCancel={() => setShowModalBankInfo(false)}
        open={showModalBankInfo}
        footer={[
          <ButtonCustom
            label="Cập nhật thông tin ngân hàng"
            fullScreen={true}
            onClick={() =>
              createBankAccount({
                bank_name: valueSelectBank,
                account_number: valueCardNumber,
                account_holder: valueCardHolder,
              })
            }
          />,
        ]}
      >
        <div className="refferend-list-affiliate__bank">
          <InputTextCustom
            type="text"
            value={valueCardHolder}
            placeHolder="Tên chủ thẻ"
            onChange={(e) => setValueCardHolder(e.target.value)}
          />
          <InputTextCustom
            type="text"
            value={valueCardNumber}
            placeHolder="Số tài khoản"
            onChange={(e) => setValueCardNumber(e.target.value)}
          />
          <InputTextCustom
            type="select"
            value={valueSelectBank}
            placeHolder="Tên ngân hàng"
            setValueSelectedProps={setValueSelectBank}
            options={sortList(bankList, "code")}
            previewImage={true}
          />
        </div>
      </Modal>
      <Modal
        title="Chính sách chương trình liên kết tiếp thị"
        open={showModalPolicy}
        onCancel={() => setShowModalPolicy(false)}
        footer={[]}
      >
        <div className="refferend-list-affiliate__policy">
          {/* Quá trình giới thiệu */}
          <div className="refferend-list-affiliate__policy--content">
            {/* Đề mục */}
            <span className="refferend-list-affiliate__policy--content-header">
              1. Quá trình giới thiệu:
            </span>
            <div className="refferend-list-affiliate__policy--content-body">
              {/* Dấu chấm đầu dòng */}
              <div className="refferend-list-affiliate__policy--content-body-dot"></div>
              {/* Nội dung */}
              <span className="refferend-list-affiliate__policy--content-body-text">
                Quý khách vui lòng gửi mã giới thiệu cá nhân cho người mà quý
                khách muốn giới thiệu. Khi người được giới thiệu đăng ký tài
                khoản và nhập mã giới thiệu này, họ sẽ được thêm vào danh sách
                của quý khách một cách thành công.
              </span>
            </div>
          </div>
          {/* Chính sách thưởng và Chiết khấu */}
          <div className="refferend-list-affiliate__policy--content">
            {/* Đề mục */}
            <span className="refferend-list-affiliate__policy--content-header">
              2. Chính Sách Thưởng và Chiết Khấu:
            </span>
            <div className="refferend-list-affiliate__policy--content-body">
              {/* Dấu chấm đầu dòng */}
              <div className="refferend-list-affiliate__policy--content-body-dot"></div>
              {/* Nội dung */}
              <span className="refferend-list-affiliate__policy--content-body-text">
                Quý khách sẽ nhận được{" "}
                <span className="high-light">50.000 VNĐ</span> (một lần duy nhất
                cho mỗi người) khi bất kỳ người nào trong danh sách của quý
                khách hoàn thành đơn hàng đầu tiên. Ngoài ra, quý khách sẽ nhận
                thêm <span className="high-light">5%</span> chiết khấu của đơn
                hàng vừa hoàn thành nếu mã giới thiệu bắt đầu bằng chữ cái{" "}
                <span className="high-light">d</span>. Trong trường hợp mã giới
                thiệu bắt đầu bằng chữ cái <span className="high-light">p</span>
                , người được giới thiệu sẽ nhận được mã giảm giá{" "}
                <span className="high-light">15%</span> và quý khách sẽ bắt đầu
                nhận chiết khấu{" "}
                <span className="high-light">5% từ đơn hàng thứ hai</span> của
                họ.
              </span>
            </div>
          </div>
          {/* Gửi mã liên kết*/}
          <div className="refferend-list-affiliate__policy--content">
            {/* Đề mục */}
            <span className="refferend-list-affiliate__policy--content-header">
              3. Gửi mã liên kết:
            </span>
            <div className="refferend-list-affiliate__policy--content-body">
              {/* Dấu chấm đầu dòng */}
              <div className="refferend-list-affiliate__policy--content-body-dot"></div>
              {/* Nội dung */}
              <span className="refferend-list-affiliate__policy--content-body-text">
                Quý khách cũng có thể gửi mã liên kết thay vì mã giới thiệu. Khi
                người được giới thiệu nhấn vào liên kết, họ sẽ được điều hướng
                đến trang tải ứng dụng (Apple Store nếu sử dụng iOS và CH Play
                nếu sử dụng Android). Sau khi tải và đăng ký tài khoản thành
                công, mã giới thiệu của quý khách sẽ tự động được điền.
              </span>
            </div>
          </div>
          {/* Yêu cầu rút tiền */}
          <div className="refferend-list-affiliate__policy--content">
            {/* Đề mục */}
            <span className="refferend-list-affiliate__policy--content-header">
              4. Yêu cầu rút tiền:
            </span>
            <div className="refferend-list-affiliate__policy--content-body">
              {/* Dấu chấm đầu dòng */}
              <div className="refferend-list-affiliate__policy--content-body-dot"></div>
              {/* Nội dung */}
              <span className="refferend-list-affiliate__policy--content-body-text">
                Để thực hiện yêu cầu rút tiền từ các chiết khấu đã nhận được
                thông qua chương trình giới thiệu, tổng số tiền chiết khấu phải
                đạt ít nhất <span className="high-light">500.000 VNĐ</span>
              </span>
            </div>
          </div>
        </div>
      </Modal>
      <Modal
        title="Chia sẻ để nhận thêm chiết khấu"
        open={showModalShareLink}
        onCancel={() => setShowModalShareLink(false)}
        footer={[]}
      >
        <div className="refferend-list-affiliate__share-link">
          <div className="refferend-list-affiliate__share-link--qr-code">
            <div className="refferend-list-affiliate__share-link--qr-code-child">
              <div
                onClick={() => downloadCanvasQRCode("referral_link")}
                className="refferend-list-affiliate__share-link--qr-code-child-download"
              >
                <IoDownloadOutline size={24} color="black" />
              </div>
              <span className="refferend-list-affiliate__share-link--qr-code-child-title">
                Nhận chiết khấu
              </span>
              <div className="refferend-list-affiliate__share-link--qr-code-child-container">
                <div className="refferend-list-affiliate__share-link--qr-code-child-container-rouded-border-vertical"></div>
                <div className="refferend-list-affiliate__share-link--qr-code-child-container-rouded-border-horizontal"></div>
                <div
                  id="referral_link"
                  className="refferend-list-affiliate__share-link--qr-code-child-container-rouded-border-qr-code"
                >
                  <QRCode
                    errorLevel="Q"
                    value={valueUserInfo?.referral_link}
                    icon={logoGuviCircle}
                    color="#3b82f6"
                    bgColor="#ffffff"
                    size={width < 768 ? 350 : 170}
                    bordered={false}
                  />
                </div>
              </div>
            </div>
            <div className="refferend-list-affiliate__share-link--qr-code-child">
              <div
                onClick={() =>
                  downloadCanvasQRCode("promotional_referral_link")
                }
                className="refferend-list-affiliate__share-link--qr-code-child-download"
              >
                <IoDownloadOutline size={24} color="black" />
              </div>
              <span className="refferend-list-affiliate__share-link--qr-code-child-title">
                Gửi voucher
              </span>
              <div className="refferend-list-affiliate__share-link--qr-code-child-container">
                <div className="refferend-list-affiliate__share-link--qr-code-child-container-rouded-border-vertical"></div>
                <div className="refferend-list-affiliate__share-link--qr-code-child-container-rouded-border-horizontal"></div>
                <div
                  id="promotional_referral_link"
                  className="refferend-list-affiliate__share-link--qr-code-child-container-rouded-border-qr-code"
                >
                  <QRCode
                    errorLevel="Q"
                    value={valueUserInfo?.promotional_referral_link}
                    icon={logoGuviCircle}
                    color="#eab308"
                    bgColor="#ffffff"
                    size={width < 768 ? 350 : 170}
                    bordered={false}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="refferend-list-affiliate__share-link--social">
            <div className="refferend-list-affiliate__share-link--social-child">
              <FacebookShareButton
                url={"https://www.guvico.com/"}
                hashtag="#guvi #giup_viec_nha"
              >
                <FacebookIcon size={48} round={true}></FacebookIcon>
              </FacebookShareButton>
              <span className="refferend-list-affiliate__share-link--social-child-label">
                Facebook
              </span>
            </div>
            <div className="refferend-list-affiliate__share-link--social-child">
              <EmailShareButton
                subject={`Lời mời tham gia chương trình Affiliate của Guvi từ ${valueUserInfo?.full_name}`}
                body={valueUserInfo?.referral_link}
              >
                <EmailIcon size={48} round={true}></EmailIcon>
              </EmailShareButton>
              <span className="refferend-list-affiliate__share-link--social-child-label">
                Email
              </span>
            </div>
          </div>
        </div>
      </Modal>
      <Modal
        title="Thông tin tài khoản"
        open={showModalInformation}
        onCancel={() => {
          setShowModalInformation(false);
          setIsShowChangePassword(false);
        }}
        footer={[]}
      >
        <div className="refferend-list-affiliate__information">
          <div className="refferend-list-affiliate__information--child">
            <div className="refferend-list-affiliate__information--child-item">
              <InputTextCustom
                type="text"
                disable={true}
                value={valueUserInfo?.full_name}
                placeHolder="Họ và tên"
              />
            </div>
            <div className="refferend-list-affiliate__information--child-item">
              <InputTextCustom
                type="text"
                disable={true}
                value={valueUserInfo?.phone}
                placeHolder="Số điện thoại"
              />
            </div>
          </div>
          <div className="refferend-list-affiliate__information--child">
            <div className="refferend-list-affiliate__information--child-item">
              <InputTextCustom
                type="text"
                disable={true}
                value={valueUserInfo?.email}
                placeHolder="Email"
              />
            </div>
            <div className="refferend-list-affiliate__information--child-item">
              <InputTextCustom
                type="select"
                value={valueUserInfo?.gender}
                placeHolder="Giới tính"
                disable={true}
                options={[
                  {
                    code: "other",
                    label: `${i18n.t("other", { lng: lang })}`,
                  },
                  {
                    code: "male",
                    label: `${i18n.t("male", { lng: lang })}`,
                  },
                  {
                    code: "female",
                    label: `${i18n.t("female", { lng: lang })}`,
                  },
                ]}
              />
            </div>
          </div>
          <div className="refferend-list-affiliate__information--child">
            <div className="refferend-list-affiliate__information--child-item">
              <InputTextCustom
                type="text"
                disable={true}
                value={valueUserInfo?.identity_number}
                placeHolder="CCCD/CMND"
              />
            </div>
            <div className="refferend-list-affiliate__information--child-item">
              <InputTextCustom
                type="text"
                disable={true}
                value={valueUserInfo?.tax_code}
                placeHolder="Mã số thuế"
              />
            </div>
          </div>
          <div className="refferend-list-affiliate__information--child">
            <div className="refferend-list-affiliate__information--child-item">
              {/* <InputTextCustom
                type="select"
                options={province}
                disable={true}
                value={valueUserInfo?.city}
                placeHolder="Tỉnh/Thành phố"
              /> */}
              <InputTextCustom
                type="province"
                searchField={true}
                disable={true}
                value={valueUserInfo?.city}
                placeHolder="Tỉnh/Thành phố (thường trú)"
                province={province}
                setValueSelectedProps={setValueSelectProvince}
                setValueSelectedPropsSupport={setValueSelectDistrict}
                setValueArrayProps={setListDistrict}
              />
            </div>
            <div className="refferend-list-affiliate__information--child-item">
              {/* <InputTextCustom
                  type="text"
                  disable={true}
                  value={valueUserInfo?.district}
                  placeHolder="Quận/Huyện"
                /> */}
              <InputTextCustom
                type="district"
                searchField={true}
                disable={true}
                value={valueUserInfo?.district}
                placeHolder="Quận/Huyện (thường trú)"
                district={listDistrict}
                setValueSelectedProps={setValueSelectDistrict}
              />
            </div>
          </div>
          <div className="refferend-list-affiliate__information--child">
            <div className="refferend-list-affiliate__information--child-item">
              <InputTextCustom
                type="text"
                disable={true}
                value={valueUserInfo?.account_holder}
                placeHolder="Chủ thẻ"
              />
            </div>
            <div className="refferend-list-affiliate__information--child-item">
              <InputTextCustom
                type="text"
                disable={true}
                value={valueUserInfo?.bank_account?.account_number}
                placeHolder="Số thẻ"
              />
            </div>
          </div>
          <InputTextCustom
            type="text"
            disable={true}
            value={
              bankList.find(
                (el) => el.code === valueUserInfo?.bank_account?.bank_name
              )?.name
            }
            placeHolder="Tên ngân hàng"
          />
          {!isShowChangePassword && (
            <div
              onClick={() => setIsShowChangePassword(true)}
              className="refferend-list-affiliate__information--forgot-password"
            >
              <div></div>
              <div>
                <span>Đổi mật khẩu</span>
              </div>
            </div>
          )}
          {/* Hiển thi khung đổi mật khẩu */}
          <div
            className={`refferend-list-affiliate__information--update-password ${
              !isShowChangePassword && "hide"
            }`}
          >
            {/* Mật khẩu hiện tại */}
            <div>
              <InputTextCustom
                type="text"
                value={valueCurrentPassword}
                placeHolder="Mật khẩu hiện tại"
                onChange={(e) => setValueCurrentPassword(e.target.value)}
                isPassword={true}
              />
            </div>
            {/* Mật khẩu cần đổi */}
            <div className="refferend-list-affiliate__change-password--new-password">
              <InputTextCustom
                type="text"
                value={valueNewPassword}
                placeHolder="Mật khẩu mới"
                onChange={(e) => setValueNewPassword(e.target.value)}
                isPassword={true}
              />
              <InputTextCustom
                type="text"
                value={valueConfirmPassword}
                placeHolder="Xác nhận mật khẩu mới"
                onChange={(e) => setValueConfirmPassword(e.target.value)}
                isPassword={true}
              />
              {/* Thanh kiểm tra dựa trên mật khẩu điền vào */}
              <div
                className={`login-affiliate__card--information-password-process-bar`}
              >
                <div
                  className={`login-affiliate__card--information-password-process-bar-child ${
                    checkPasswordRequired(valueNewPassword).level === 0
                      ? "empty"
                      : checkPasswordRequired(valueNewPassword).level === 1
                      ? "week"
                      : checkPasswordRequired(valueNewPassword).level === 2
                      ? "fear"
                      : checkPasswordRequired(valueNewPassword).level === 3
                      ? "good"
                      : checkPasswordRequired(valueNewPassword).level === 4
                      ? "strong"
                      : ""
                  }`}
                ></div>
              </div>
              {/* Các yêu cầu khi tạo mật khẩu */}
              <div className="login-affiliate__card--information-password-condition-required">
                {/* Ít nhất 8 ký tự */}
                <div
                  className={`login-affiliate__card--information-password-condition-required-child ${
                    checkPasswordRequired(valueNewPassword).isPassLength &&
                    "checked"
                  }`}
                >
                  <span>
                    <IoCheckmarkCircleOutline />
                  </span>
                  <span>Ít nhất 8 ký tự</span>
                </div>
                <div
                  className={`login-affiliate__card--information-password-condition-required-child ${
                    checkPasswordRequired(valueNewPassword).isHaveLetter &&
                    "checked"
                  }`}
                >
                  <span>
                    <IoCheckmarkCircleOutline />
                  </span>
                  <span>Ít nhất 1 chữ cái</span>
                </div>
                <div
                  className={`login-affiliate__card--information-password-condition-required-child ${
                    checkPasswordRequired(valueNewPassword).isHaveNumber &&
                    "checked"
                  }`}
                >
                  <span>
                    <IoCheckmarkCircleOutline />
                  </span>
                  <span>Ít nhất 1 chữ số</span>
                </div>
              </div>
              <ButtonCustom
                label="Xác nhận"
                fullScreen={true}
                borderRadiusFull={true}
                onClick={() =>
                  handleCheckAndUpdatePassword({
                    password: valueCurrentPassword,
                    new_password: valueNewPassword,
                    confirm_password: valueConfirmPassword,
                  })
                }
              ></ButtonCustom>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ReferredList;
