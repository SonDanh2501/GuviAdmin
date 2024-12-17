import React, { useCallback, useEffect, useRef, useState } from "react";
import "./index.scss";
import _ from "lodash";

import icons from "../../../../utils/icons";
import { Button, message, Modal, Pagination, Popover, Tooltip } from "antd";
import { Link } from "react-router-dom";

import appleStoreImage from "../../../../assets/images/apple_store.svg";
import chStoreImage from "../../../../assets/images/google_play.svg";
import appScreenImage from "../../../../assets/images/app_screen.png";
import copyRightImage from "../../../../assets/images/copy_right.png";
import notFoundImage from "../../../../assets/images/not_found_image.svg";
import affiliateLogo from "../../../../assets/images/affiliate_guide.svg";
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
} from "../../../../api/affeliate";
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
import { formatMoney, formatNumber } from "../../../../helper/formatMoney";
import { bankList, getInitials, sortList } from "../../../../utils/contant";
import referralPolicy from "../../../../assets/images/referral-policy.svg";
import overViewAffilaite from "../../../../assets/images/overViewAffiliate.svg";
const {
  IoChevronDown,
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
  IoRefresh,
  IoTime,
  IoCalendar,
  IoChatboxEllipses,
  IoArrowForward,
  IoLocation,
  IoArrowUpCircleOutline,
  IoArrowUp,
  MdDoubleArrow,
  IoAdd,
} = icons;

const RefferendList = () => {
  const sliderRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

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
  const [lengthPage, setLengthPage] = useState(
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
  const [isChangeReferralCode, setIsChangeReferralCode] = useState(false);
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
  const [isCheckBankExist, setIsCheckBankExist] = useState(false); // Giá trị kiểm tra tài khoản đã có tài khoản ngân hàng hay chưa
  const [showModalWithdrawal, setShowModalWithdrawal] = useState(false);
  const [showModalBankInfo, setShowModalBankInfo] = useState(false);
  /* ~~~ List ~~~ */
  // 1. Danh sách các loại trạng thái
  const [statusList, setStatusList] = useState([
    { code: "", label: "Tất cả", total: 0 },
    { code: "pending", label: "Đang xử lí", total: 0 },
    { code: "transferred", label: "Đã chuyển tiền", total: 0 },
    { code: "holding", label: "Tạm giữ", total: 0 },
    { code: "done", label: "Hoàn thành", total: 0 },
    { code: "cancel", label: "Đã hủy", total: 0 },
  ]);
  // 2. Danh sách các đối tượng
  const objectList = [
    { code: "", label: "Tất cả" },
    { code: "collaborator", label: "Đối tác" },
    { code: "customer", label: "Khách hàng" },
    { code: "other", label: "Khác" },
  ];
  // 3. Danh sách các loại giao dịch
  const transferTypeList = [
    { code: "", label: "Tất cả" },
    { code: "withdraw", label: "Phiếu chi" },
    { code: "top_up", label: "Phiếu thu" },
  ];
  // 4. Danh sách các loại phương thức thanh toán
  const paymentMethodList = [
    { code: "", label: "Tất cả" },
    { code: "bank", label: "Chuyển khoản" },
    { code: "momo", label: "MoMo" },
    { code: "vnpay", label: "VN Pay" },
    { code: "viettel_money", label: "Viettel Money" },
  ];
  // 5. Danh sách các loại ví
  const walletTypeList = [
    { code: "", label: "Tất cả" },
    { code: "collaborator_wallet", label: "Ví CTV" },
    { code: "work_wallet", label: "Ví công việc" },
    { code: "pay_point", label: "Ví Pay Point" },
    { code: "other", label: "Ví Khác" },
  ];
  // 6. Danh sách các cột của bảng
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
    // {
    //   customTitle: (
    //     <CustomHeaderDatatable
    //       title="Mã giao dịch"
    //       textToolTip="Mã giao dịch của lệnh giao dịch"
    //     />
    //   ),
    //   dataIndex: "code_transaction",
    //   key: "code_transaction",
    //   width: 40,
    // },
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
    // {
    //   customTitle: (
    //     <CustomHeaderDatatable
    //       title="Loại giao dịch"
    //       textToolTip="Loại giao dịch (Phiếu thu/ Phiếu chi)"
    //     />
    //   ),
    //   dataIndex: "type_transfer",
    //   key: "type_transfer",
    //   width: 35,
    // },
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
    // {
    //   customTitle: (
    //     <CustomHeaderDatatable
    //       title="Phương thức TT"
    //       textToolTip="Phương thức thanh toán (Momo, Chuyển khoản NH, Ví VNPAY, Tiền mặt)"
    //     />
    //   ),
    //   dataIndex: "",
    //   key: "payment_out",
    //   width: 45,
    // },

    // {
    //   customTitle: (
    //     <CustomHeaderDatatable
    //       title="Mô tả giao dịch"
    //       textToolTip="Nội dung của giao dịch"
    //     />
    //   ),
    //   dataIndex: "transfer_note",
    //   key: "text",
    //   width: 50,
    // },
    // {
    //   customTitle: (
    //     <CustomHeaderDatatable
    //       title="Xác nhận bởi"
    //       textToolTip="Thông tin cơ bản của người xác nhận (Họ tên và chức vụ) hoặc hệ thống xác nhận (Automation)"
    //     />
    //   ),
    //   dataIndex: "id_admin_verify",
    //   key: "admin_verify",
    //   width: 35,
    // },
    // {
    //   customTitle: (
    //     <CustomHeaderDatatable
    //       title="Thời gian xác nhận"
    //       textToolTip="Thời gian yêu cầu được duyệt"
    //     />
    //   ),
    //   dataIndex: "date_verify_created",
    //   key: "date_verify",
    //   width: 45,
    //   position: "center",
    // },
  ];
  // 7. Danh sách các bước hướng dẫn
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
  // 4. Hàm fetch danh sách những người giới thiệu của khách hàng (cần check lại dữ liệu hiển thị sao để sửa những chỗ hard code)
  const fetchListReferralPerson = async () => {
    try {
      const res = await getListReferralPersonApi(0, 10);
      console.log("check danh sách những người giới thiệu >>>", res);
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
      const res = await getListActivityAffiliateApi(0, 10);
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
      const res = await getListTransactionAffiliateApi(0, 10, query);
      // console.log("Danh sách lệnh nạp rút >>>", res);
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
  const onChangePage = (value) => {
    setStartPage(value);
  };
  const handleSearch = useCallback(
    _.debounce((value) => {
      setValueSearch(value);
      setStartPage(0);
    }, 500),
    []
  );
  /* ~~~ Use effect ~~~ */
  // 1. Fetch các dữ liệu
  useEffect(() => {
    fetchCustomerInfo();
    fetchListReferralPerson();
    fetchHistoryDiscount();
    fetchListTransaction();
    checkBankAccountExist();
  }, []);
  // 2. Gợi ý số tiền và cập nhật lại lời nhắc
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

  /* ~~~ Main  ~~~ */
  return (
    <div className="refferend-list-affiliate">
      <div className="refferend-list-affiliate__content">
        <div className="refferend-list-affiliate__content--left">
          {/* Total person introduced */}
          <div className="refferend-list-affiliate__content--left-card border-left-highlight border-red card-shadow">
            {/* Số lượng thống kê */}
            <div className="refferend-list-affiliate__content--left-card-content">
              {/* label và value */}
              <div className="refferend-list-affiliate__content--left-card-content-describe">
                <span className="refferend-list-affiliate__content--left-card-content-describe-label">
                  Tổng người giới thiệu
                </span>
                <span className="refferend-list-affiliate__content--left-card-content-describe-value">
                  10 <span className="unit">người</span>
                </span>
              </div>
              {/* icon */}
              <div className="refferend-list-affiliate__content--left-card-content-icon red">
                <IoPeople />
              </div>
            </div>
            {/* So với 30 ngày trước */}
            <div className="refferend-list-affiliate__content--left-card-previous">
              <span>30 ngày trước: 2 người</span>
            </div>
          </div>
          {/* Total money received */}
          <div className="refferend-list-affiliate__content--left-card border-left-highlight border-blue card-shadow">
            <div className="refferend-list-affiliate__content--left-card-content">
              {/* label và value */}
              <div className="refferend-list-affiliate__content--left-card-content-describe">
                <span className="refferend-list-affiliate__content--left-card-content-describe-label">
                  Tổng tiền
                </span>
                <span className="refferend-list-affiliate__content--left-card-content-describe-value">
                  150.000 <span className="unit">VNĐ</span>
                </span>
              </div>
              {/* icon */}
              <div className="refferend-list-affiliate__content--left-card-content-icon blue">
                <IoCash />
              </div>
            </div>
            {/* So với 30 ngày trước */}
            <div className="refferend-list-affiliate__content--left-card-previous">
              <span>30 ngày trước: 50.000 VNĐ</span>
            </div>
          </div>
          {/* Total order */}
          <div className="refferend-list-affiliate__content--left-card border-left-highlight border-green card-shadow">
            {/* Số lượng thống kê */}
            <div className="refferend-list-affiliate__content--left-card-content">
              {/* label và value */}
              <div className="refferend-list-affiliate__content--left-card-content-describe">
                <span className="refferend-list-affiliate__content--left-card-content-describe-label">
                  Tổng đơn
                </span>
                <span className="refferend-list-affiliate__content--left-card-content-describe-value">
                  15 <span className="unit">đơn</span>
                </span>
              </div>
              {/* icon */}
              <div className="refferend-list-affiliate__content--left-card-content-icon green">
                <IoReader />
              </div>
            </div>
            {/* So với 30 ngày trước */}
            <div className="refferend-list-affiliate__content--left-card-previous">
              <span>30 ngày trước: 3 đơn</span>
            </div>
          </div>
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
                    {valueUserInfo?.referral_code}
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
                <div className="refferend-list-affiliate__content--left-card-body-code-content">
                  <span className="refferend-list-affiliate__content--left-card-body-code-content-label">
                    {valueUserInfo?.promotional_referral_code}
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
                  // onClick={() => getRandomReferralCodeAndUpdate()}
                  className="refferend-list-affiliate__content--left-card-body-code-random"
                >
                  <span className="refferend-list-affiliate__content--left-card-body-code-random-label">
                    Chia sẻ ngay
                  </span>
                </div>
              </div>
            </div>
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
                {Array.from({ length: 10 }).map((_, index) => (
                  <div className="refferend-list-affiliate__content--middle-content-history-receiving">
                    {/* Left */}
                    <div className="refferend-list-affiliate__content--middle-content-history-receiving-left">
                      <span className="refferend-list-affiliate__content--middle-content-history-receiving-left-time">
                        26 Thg 11, 2024 - 06:49
                      </span>
                      <span className="refferend-list-affiliate__content--middle-content-history-receiving-left-date">
                        thứ ba
                      </span>
                    </div>
                    {/* Line */}
                    <div className="refferend-list-affiliate__content--middle-content-history-receiving-middle">
                      <div
                        className={`refferend-list-affiliate__content--middle-content-history-receiving-middle-icon admin setting`}
                      >
                        <IoSettings size={15} color="blue" />
                      </div>

                      <div
                        className={`refferend-list-affiliate__content--middle-content-history-receiving-middle-line ${
                          index === 9 && "hidden"
                        }`}
                      ></div>
                    </div>
                    {/* Right */}
                    <div className="refferend-list-affiliate__content--middle-content-history-receiving-right">
                      <div className="refferend-list-affiliate__content--middle-content-history-receiving-right-top">
                        <div>
                          <span className="refferend-list-affiliate__content--middle-content-history-receiving-right-top-title">
                            Nhận chiếu khấu đơn hàng 0389888952
                          </span>
                          <>
                            <div className="refferend-list-affiliate__content--middle-content-history-receiving-right-top-money ">
                              <span className="refferend-list-affiliate__content--middle-content-history-receiving-right-top-money-title">
                                Ví:
                              </span>
                              <span className="">
                                {/* {formatMoney(item?.current_work_wallet)} */}
                                50.000đ
                              </span>
                              <IoTrendingUp color="green" />
                            </div>
                          </>
                        </div>
                        <div className="refferend-list-affiliate__content--middle-content-history-receiving-right-top-transiction">
                          <span
                            className={`refferend-list-affiliate__content--middle-content-history-receiving-right-top-transiction-number up`}
                          >
                            {/* {`${item?.value > 0 ? "+" : ""}` +
                          formatMoney(item?.value)} */}
                            20.000đ
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="refferend-list-affiliate__content--middle-content-pagination">
                  <div></div>
                  <Pagination
                    current={0}
                    // onChange={calculateCurrentPage}
                    total={100}
                    showSizeChanger={false}
                    // pageSize={pageSize}
                  />
                </div>
              </>
            ) : selectTab === 2 ? (
              // Withdrawal request list
              <>
                <div style={{ padding: "12px" }}>
                  <DataTable
                    columns={columns}
                    data={dataWithdrawalHistory}
                    start={startPage}
                    pageSize={lengthPage}
                    setLengthPage={setLengthPage}
                    totalItem={setTotalDataHistoryDiscount}
                    onCurrentPageChange={onChangePage}
                    // scrollX={2300}
                    getItemRow={setItem}
                    loading={isLoading}
                    headerRightContent={
                      <div className="manage-top-up-with-draw__table--right-header">
                        <div className="manage-top-up-with-draw__table--right-header--search-field">
                          <InputTextCustom
                            type="text"
                            placeHolderNormal="Tìm kiếm"
                            onChange={(e) => {
                              handleSearch(e.target.value);
                            }}
                          />
                        </div>
                      </div>
                    }
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
                      {Array.from({ length: 8 }).map((_, index) => (
                        <div className={`refferend-list-affiliate__content--middle-content-refferend-list-container-persons-person ${index === 0 && "not-first-item"}`}>
                          <div className="refferend-list-affiliate__content--middle-content-refferend-list-container-persons-person-value">
                            <div className="refferend-list-affiliate__content--middle-content-refferend-list-container-persons-person-value-unit">
                              <span className="refferend-list-affiliate__content--middle-content-refferend-list-container-persons-person-value-unit-label">
                                Số đơn
                              </span>
                              <span className="refferend-list-affiliate__content--middle-content-refferend-list-container-persons-person-value-unit-number">
                                15
                              </span>
                            </div>
                          </div>
                          <div className="refferend-list-affiliate__content--middle-content-refferend-list-container-persons-person-info">
                            <span className="refferend-list-affiliate__content--middle-content-refferend-list-container-persons-person-info-name">
                              {getInitials("Danh Trường Sơn")}
                            </span>
                          </div>
                          <div className="refferend-list-affiliate__content--middle-content-refferend-list-container-persons-person-counting newest-person">
                            <span>Người giới thiệu {index + 1}</span>
                            <span className="refferend-list-affiliate__content--middle-content-refferend-list-container-persons-person-counting-phone">
                              *** *** 0027
                            </span>
                          </div>
                        </div>
                      ))}
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
                {/* <div className="refferend-list-affiliate__content--middle-content-pagination">
                  <div></div>
                  <Pagination
                    current={0}
                    // onChange={calculateCurrentPage}
                    total={100}
                    showSizeChanger={false}
                    // pageSize={pageSize}
                  />
                </div> */}
              </>
            )}
          </div>
        </div>
        <div className="refferend-list-affiliate__content--right">
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
                        1234 **** 5678
                      </span>
                    </div>
                    {/* Thông tin số 2 */}
                    <div className="refferend-list-affiliate__content--right-bank-content-middle-info">
                      <span className="refferend-list-affiliate__content--right-bank-content-middle-info-label">
                        Số dư
                      </span>
                      <span className="refferend-list-affiliate__content--right-bank-content-middle-info-value">
                        1.000.000 VNĐ
                      </span>
                    </div>
                  </div>
                </div>
                <div className="refferend-list-affiliate__content--right-bank-bottom">
                  <span className="refferend-list-affiliate__content--right-bank-bottom-name">
                    DANH TRUONG SON
                  </span>
                  <div
                    onClick={() => setShowModalWithdrawal(true)}
                    className="refferend-list-affiliate__content--right-bank-bottom-icon"
                  >
                    <Tooltip placement="top" title="Rút tiền">
                      <div className="refferend-list-affiliate__content--right-bank-bottom-icon-icon">
                        <IoArrowUp color="black" />
                      </div>
                    </Tooltip>
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
              <span className="refferend-list-affiliate__content--right-referral-policy-content-read-more">
                Đọc thêm <IoArrowForward />
              </span>
            </div>
          </div>
          {/* Benefit of join the event */}
          <div className="refferend-list-affiliate__content--right-share card-shadow">
            {/* Header */}
            <div className="refferend-list-affiliate__content--right-share-header">
              <span className="">Đường dẫn chia sẻ của chương trình</span>
            </div>
            {/* Content */}
            <div className="refferend-list-affiliate__content--right-share-content">
              {/* Nhận ngay chiết khấu */}
              <div className="refferend-list-affiliate__content--right-share-content-share">
                <div className="refferend-list-affiliate__content--right-share-content-share-header">
                  <span>Nhận chiết khấu ngay:</span>
                </div>
                <div className="refferend-list-affiliate__content--right-share-content-share-link">
                  <span className="refferend-list-affiliate__content--right-share-content-share-link-url">
                    {valueUserInfo?.referral_link || ""}
                  </span>
                  <span className="refferend-list-affiliate__content--right-share-content-share-link-url-copy">
                    Sao chép
                  </span>
                </div>
              </div>
              {/* Gửi voucher giảm giá ngay */}
              <div className="refferend-list-affiliate__content--right-share-content-share">
                <div className="refferend-list-affiliate__content--right-share-content-share-header">
                  <span>Gửi voucher giảm giá ngay:</span>
                </div>
                <div className="refferend-list-affiliate__content--right-share-content-share-link">
                  <span className="refferend-list-affiliate__content--right-share-content-share-link-url">
                    {valueUserInfo?.promotional_referral_link || ""}
                  </span>
                  <span className="refferend-list-affiliate__content--right-share-content-share-link-url-copy">
                    Sao chép
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="refferend-list-affiliate__footer">
        <div className="refferend-list-affiliate__footer--content">
          {/* Address */}
          <div className="refferend-list-affiliate__footer--content-information">
            <span className="refferend-list-affiliate__footer--content-information-header">
              CÔNG TY TNHH GIẢI PHÁP CÔNG NGHỆ GUVI
            </span>
            <span className="refferend-list-affiliate__footer--content-information-description">
              Văn phòng: 137D đường số 11, Phường Trường Thọ, TP. Thủ Đức, TP.
              Hồ Chí Minh{" "}
            </span>
            <span className="refferend-list-affiliate__footer--content-information-description">
              Hotline: 1900 0027
            </span>
            <span className="refferend-list-affiliate__footer--content-information-description">
              Email: cskh@guvico.com - marketing@guvico.com
            </span>
          </div>
          {/* Download app */}
          <div className="refferend-list-affiliate__footer--content-information">
            <span className="refferend-list-affiliate__footer--content-information-header">
              Tải ứng dụng
            </span>
            <div className="refferend-list-affiliate__footer--content-information-image-container">
              <img
                className="refferend-list-affiliate__footer--content-information-image"
                src={chStoreImage}
              ></img>
              <img
                className="refferend-list-affiliate__footer--content-information-image"
                src={appleStoreImage}
              ></img>
            </div>
            <img
              className="refferend-list-affiliate__footer--content-information-image"
              src={copyRightImage}
            ></img>
          </div>
          {/* Contact */}
          <div className="refferend-list-affiliate__footer--content-information">
            <span className="refferend-list-affiliate__footer--content-information-header">
              Liên hệ với GUVI
            </span>
            <div className="refferend-list-affiliate__footer--content-information-image-container">
              <IoLogoFacebook size="40px" color="white" />
              <IoLogoTiktok size="40px" color="white" />
              <IoLogoYoutube size="40px" color="white" />
            </div>
          </div>
        </div>
        {/* Copy right */}
        <div className="refferend-list-affiliate__footer--content-copy-right">
          <span className="refferend-list-affiliate__footer--content-copy-right-label">
            @ 2024 Công ty TNHH Giải pháp Công nghệ Guvi sở hữu bản quyền.
          </span>
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
    </div>
  );
};

export default RefferendList;
