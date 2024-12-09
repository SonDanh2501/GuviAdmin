import React, { useEffect, useState } from "react";
import "./index.scss";

import icons from "../../../../utils/icons";
import { message, Pagination, Popover, Tooltip } from "antd";
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
} from "../../../../api/affeliate";
import { errorNotify, successNotify } from "../../../../helper/toast";
import { useDispatch } from "react-redux";
import { loadingAction } from "../../../../redux/actions/loading";

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
} = icons;

const RefferendList = () => {
  const dispatch = useDispatch();
  /* ~~~ Value ~~~ */
  const [selectTab, setSelectTab] = useState(0);
  const [valueUserInfo, setValueUserInfo] = useState([]);
  const [isChangeReferralCode, setIsChangeReferralCode] = useState(false);
  const [valueReferralCode, setValueReferralCode] = useState("");
  const [dataListReferralPerson, setDataListReferralPerson] = useState([]);
  const [dataHistoryDiscount, setDataHistoryDiscount] = useState([]);
  const [startPage, setStartPage] = useState(0);
  const [lengthPage, setLengthPage] = useState(
    JSON.parse(localStorage.getItem("linePerPage"))
      ? JSON.parse(localStorage.getItem("linePerPage")).value
      : 20
  );
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
      const res = await updateReferralCodeApi({ referral_code: code });
      setIsChangeReferralCode(false);
      setValueReferralCode("");
      fetchCustomerInfo();
      successNotify({
        message: "Thay đổi mã giới thiệu thành công",
      });
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
      console.log("check lịch sử nhận chiết khấu >>>", res);
      setDataHistoryDiscount(res);
    } catch (err) {
      errorNotify({
        message: err?.message,
      });
    }
  }
  /* ~~~ Use effect ~~~ */
  // 1. Lấy thông tin khách hàng đang đăng nhập hiện tại (việc gọi API này để tránh việc token khi bị mã hóa sẽ bị lộ những thông tin nhạy cảm)
  useEffect(() => {
    fetchCustomerInfo();
    fetchListReferralPerson();
    fetchHistoryDiscount();
  }, []);
  /* ~~~ Other  ~~~ */
  const copyToClipBoard = (text) => {
    navigator.clipboard.writeText(text);
    successNotify({
      message: `Sao chép thành công ${text}`,
    });
  };
  return (
    <div className="refferend-list-affiliate">
      <div className="refferend-list-affiliate__content">
        <div className="refferend-list-affiliate__content--left">
          {/* Tổng người giới thiệu */}
          <div className="refferend-list-affiliate__content--left-card card-shadow">
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
              <div className="refferend-list-affiliate__content--left-card-content-icon blue">
                <IoPeople />
              </div>
            </div>
            {/* So với 30 ngày trước */}
            <div className="refferend-list-affiliate__content--left-card-previous">
              <span>30 ngày trước: 2 người</span>
            </div>
          </div>
          {/* Tổng tiền nhận được */}
          <div className="refferend-list-affiliate__content--left-card card-shadow">
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
              <div className="refferend-list-affiliate__content--left-card-content-icon green">
                <IoCash />
              </div>
            </div>
            {/* So với 30 ngày trước */}
            <div className="refferend-list-affiliate__content--left-card-previous">
              <span>30 ngày trước: 50.000 VNĐ</span>
            </div>
          </div>
          {/* Tổng đơn hoàn thành */}
          <div className="refferend-list-affiliate__content--left-card card-shadow">
            <div className="refferend-list-affiliate__content--left-card-content">
              {/* label và value */}
              <div className="refferend-list-affiliate__content--left-card-content-describe">
                <span className="refferend-list-affiliate__content--left-card-content-describe-label">
                  Tổng đơn giới thiệu
                </span>
                <span className="refferend-list-affiliate__content--left-card-content-describe-value">
                  15 <span className="unit">đơn</span>
                </span>
              </div>
              {/* icon */}
              <div className="refferend-list-affiliate__content--left-card-content-icon yellow">
                <IoReader />
              </div>
            </div>
            {/* So với 30 ngày trước */}
            <div className="refferend-list-affiliate__content--left-card-previous">
              <span>30 ngày trước: 2 đơn</span>
            </div>
          </div>
          {/* Mã giới thiệu không phải mã link */}
          <div className="refferend-list-affiliate__content--left-card no-padding card-shadow">
            <div className="refferend-list-affiliate__content--left-card-header">
              <span>Cách giới thiệu</span>
            </div>
            <div className="refferend-list-affiliate__content--left-card-body">
              <div className="refferend-list-affiliate__content--left-card-body-image">
                <img
                  className="refferend-list-affiliate__content--left-card-body-image"
                  src={affiliateLogo}
                ></img>
              </div>
              <div className="refferend-list-affiliate__content--left-card-body-steps">
                <div className="refferend-list-affiliate__content--left-card-body-steps-circle">
                  1
                </div>

                <div className="refferend-list-affiliate__content--left-card-body-steps-step">
                  <span>Chia sẻ đường link của bạn</span>
                </div>
              </div>
              <div className="refferend-list-affiliate__content--left-card-body-steps">
                <div className="refferend-list-affiliate__content--left-card-body-steps-circle">
                  2
                </div>
                <span className="refferend-list-affiliate__content--left-card-body-steps-step">
                  Người được giới thiệu hoàn thành đơn đầu tiên
                </span>
              </div>
              <div className="refferend-list-affiliate__content--left-card-body-steps">
                <div className="refferend-list-affiliate__content--left-card-body-steps-circle">
                  3
                </div>
                <span className="refferend-list-affiliate__content--left-card-body-steps-step">
                  Bạn nhận ngay 5% chiết khấu của đơn hoàn thành
                </span>
              </div>
              <div className="refferend-list-affiliate__content--left-card-body-code">
                <Tooltip title="Nhận ngay chiết khấu 5%">
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
                </Tooltip>
                <Tooltip title="Gửi voucher cho người được giới thiệu">
                  <div className="refferend-list-affiliate__content--left-card-body-code-content">
                    <span className="refferend-list-affiliate__content--left-card-body-code-content-label">
                      {valueUserInfo?.promotional_referral_code}
                    </span>
                    <span
                      onClick={() =>
                        copyToClipBoard(
                          valueUserInfo?.promotional_referral_code
                        )
                      }
                      className="refferend-list-affiliate__content--left-card-body-code-content-copy"
                    >
                      Sao chép
                    </span>
                  </div>
                </Tooltip>
                {isChangeReferralCode && (
                  <div className="refferend-list-affiliate__content--left-card-body-code-content">
                    <input
                      value={valueReferralCode}
                      onChange={(e) => setValueReferralCode(e.target.value)}
                      placeholder="Nhập mã mới"
                      className="refferend-list-affiliate__content--left-card-body-code-content-input"
                    ></input>
                    <span
                      onClick={() => {
                        updateReferralCode(valueReferralCode);
                      }}
                      className="refferend-list-affiliate__content--left-card-body-code-content-copy"
                    >
                      Lưu
                    </span>
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
                )}

                <div
                  onClick={() => getRandomReferralCodeAndUpdate()}
                  className="refferend-list-affiliate__content--left-card-body-code-random"
                >
                  <span className="refferend-list-affiliate__content--left-card-body-code-random-label">
                    Tạo mã mới ngẫu nhiên
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="refferend-list-affiliate__content--middle">
          {/* Danh sách người giới thiệu */}
          <div className="refferend-list-affiliate__content--middle-content card-shadow">
            {/* Header */}
            <div className="refferend-list-affiliate__content--middle-content-header">
              <span>
                {selectTab === 0
                  ? "Lịch sử nhận chiết khấu"
                  : selectTab === 1
                  ? "Lịch sử yêu cầu rút tiền"
                  : "Danh sách những người giới thiệu"}
              </span>
              <div className="refferend-list-affiliate__content--middle-content-header-options">
                <span
                  onClick={() => setSelectTab(0)}
                  className={`refferend-list-affiliate__content--middle-content-header-options-tab ${
                    selectTab === 0 && "activated"
                  }`}
                >
                  Lịch sử chiết khấu
                </span>
                <span
                  onClick={() => setSelectTab(1)}
                  className={`refferend-list-affiliate__content--middle-content-header-options-tab ${
                    selectTab === 1 && "activated"
                  }`}
                >
                  Yêu cầu rút tiền
                </span>
                <span
                  onClick={() => setSelectTab(2)}
                  className={`refferend-list-affiliate__content--middle-content-header-options-tab ${
                    selectTab === 2 && "activated"
                  }`}
                >
                  Danh sách người giới thiệu
                </span>
              </div>
            </div>
            {selectTab === 0 ? (
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
            ) : selectTab === 1 ? (
              <>
                {Array.from({ length: 10 }).map((_, index) => (
                  <div className="refferend-list-affiliate__content--middle-content-deposit-withdraw">
                    {/* Left */}
                    <div className="refferend-list-affiliate__content--middle-content-deposit-withdraw-left">
                      <span className="refferend-list-affiliate__content--middle-content-deposit-withdraw-left-time">
                        26 Thg 11, 2024 - 06:49
                      </span>
                      <span className="refferend-list-affiliate__content--middle-content-deposit-withdraw-left-date">
                        thứ ba
                      </span>
                    </div>
                    {/* Line */}
                    <div className="refferend-list-affiliate__content--middle-content-deposit-withdraw-middle">
                      <div
                        className={`refferend-list-affiliate__content--middle-content-deposit-withdraw-middle-icon admin setting`}
                      >
                        <IoSettings size={15} color="blue" />
                      </div>

                      <div
                        className={`refferend-list-affiliate__content--middle-content-deposit-withdraw-middle-line ${
                          index === 4 && "hidden"
                        }`}
                      ></div>
                    </div>
                    {/* Right */}
                    <div className="refferend-list-affiliate__content--middle-content-deposit-withdraw-right">
                      <div className="refferend-list-affiliate__content--middle-content-deposit-withdraw-right-top">
                        <div>
                          <span className="refferend-list-affiliate__content--middle-content-deposit-withdraw-right-top-title">
                            Yêu cầu lệnh rút #123123123
                          </span>
                          <>
                            <div className="refferend-list-affiliate__content--middle-content-deposit-withdraw-right-top-money ">
                              <span className="refferend-list-affiliate__content--middle-content-deposit-withdraw-right-top-money-title">
                                Ví:
                              </span>
                              <span className="">
                                {/* {formatMoney(item?.current_work_wallet)} */}
                                50.000đ
                              </span>
                              <IoTrendingDown color="red" />
                            </div>
                          </>
                        </div>
                        <div className="refferend-list-affiliate__content--middle-content-deposit-withdraw-right-top-transiction">
                          <span
                            className={`refferend-list-affiliate__content--middle-content-deposit-withdraw-right-top-transiction-number up`}
                          >
                            Hoàn thành
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
            ) : (
              <>
                <div className="refferend-list-affiliate__content--middle-content-refferend-list">
                  <div className="refferend-list-affiliate__content--middle-content-refferend-list-person">
                    {/* Info */}
                    <div className="refferend-list-affiliate__content--middle-content-refferend-list-person-info">
                      <div className="refferend-list-affiliate__content--middle-content-refferend-list-person-info-left">
                        {/* Avatar */}
                        <img
                          className="refferend-list-affiliate__content--middle-content-refferend-list-person-info-left-avatar"
                          src={notFoundImage}
                        ></img>
                        {/* Info */}
                        <div className="refferend-list-affiliate__content--middle-content-refferend-list-person-info-left-text">
                          <span className="refferend-list-affiliate__content--middle-content-refferend-list-person-info-left-text-name">
                            Danh Trường Sơn
                          </span>
                          <span className="refferend-list-affiliate__content--middle-content-refferend-list-person-info-left-text-date">
                            Ngày kích hoạt:{" "}
                            <span className="hight-light">29 Thg 11, 2024</span>
                          </span>
                          <span className="refferend-list-affiliate__content--middle-content-refferend-list-person-info-left-text-date">
                            Số đơn: <span className="hight-light">0 đơn</span>
                          </span>
                          <span className="refferend-list-affiliate__content--middle-content-refferend-list-person-info-left-text-date">
                            Tổng tiền:{" "}
                            <span className="hight-light">0 vnđ</span>
                          </span>
                        </div>
                      </div>
                      <div className="refferend-list-affiliate__content--middle-content-refferend-list-person-info-right yellow">
                        {/* Status */}
                        <span className="yellow">
                          Bước 1: Đăng ký tài khoản
                        </span>
                      </div>
                    </div>
                    {/* Progress bar */}
                    <div className="refferend-list-affiliate__content--middle-content-refferend-list-person-progress-bar">
                      <div className="refferend-list-affiliate__content--middle-content-refferend-list-person-progress-bar-container card-shadow yellow"></div>
                      <div className="refferend-list-affiliate__content--middle-content-refferend-list-person-progress-bar-container card-shadow"></div>
                      <div className="refferend-list-affiliate__content--middle-content-refferend-list-person-progress-bar-container card-shadow"></div>
                    </div>
                  </div>
                  <div className="refferend-list-affiliate__content--middle-content-refferend-list-person">
                    {/* Info */}
                    <div className="refferend-list-affiliate__content--middle-content-refferend-list-person-info">
                      <div className="refferend-list-affiliate__content--middle-content-refferend-list-person-info-left">
                        {/* Avatar */}
                        <img
                          className="refferend-list-affiliate__content--middle-content-refferend-list-person-info-left-avatar"
                          src={notFoundImage}
                        ></img>
                        {/* Info */}
                        <div className="refferend-list-affiliate__content--middle-content-refferend-list-person-info-left-text">
                          <span className="refferend-list-affiliate__content--middle-content-refferend-list-person-info-left-text-name">
                            Đặng Tuấn Tú
                          </span>
                          <span className="refferend-list-affiliate__content--middle-content-refferend-list-person-info-left-text-date">
                            Ngày kích hoạt:{" "}
                            <span className="hight-light">29 Thg 11, 2024</span>
                          </span>
                          <span className="refferend-list-affiliate__content--middle-content-refferend-list-person-info-left-text-date">
                            Số đơn: <span className="hight-light">0 đơn</span>
                          </span>
                          <span className="refferend-list-affiliate__content--middle-content-refferend-list-person-info-left-text-date">
                            Tổng tiền:{" "}
                            <span className="hight-light">0 vnđ</span>
                          </span>
                        </div>
                      </div>
                      <div className="refferend-list-affiliate__content--middle-content-refferend-list-person-info-right ">
                        {/* Status */}
                        <span className="blue">Bước 2: Đặt đơn đầu tiên</span>
                      </div>
                    </div>
                    {/* Progress bar */}
                    <div className="refferend-list-affiliate__content--middle-content-refferend-list-person-progress-bar">
                      <div className="refferend-list-affiliate__content--middle-content-refferend-list-person-progress-bar-container card-shadow blue"></div>
                      <div className="refferend-list-affiliate__content--middle-content-refferend-list-person-progress-bar-container card-shadow blue"></div>
                      <div className="refferend-list-affiliate__content--middle-content-refferend-list-person-progress-bar-container card-shadow"></div>
                    </div>
                  </div>
                  <div className="refferend-list-affiliate__content--middle-content-refferend-list-person">
                    {/* Info */}
                    <div className="refferend-list-affiliate__content--middle-content-refferend-list-person-info">
                      <div className="refferend-list-affiliate__content--middle-content-refferend-list-person-info-left">
                        {/* Avatar */}
                        <img
                          className="refferend-list-affiliate__content--middle-content-refferend-list-person-info-left-avatar"
                          src={notFoundImage}
                        ></img>
                        {/* Info */}
                        <div className="refferend-list-affiliate__content--middle-content-refferend-list-person-info-left-text">
                          <span className="refferend-list-affiliate__content--middle-content-refferend-list-person-info-left-text-name">
                            Nguyễn Lê
                          </span>
                          <span className="refferend-list-affiliate__content--middle-content-refferend-list-person-info-left-text-date">
                            Ngày kích hoạt:{" "}
                            <span className="hight-light">29 Thg 11, 2024</span>
                          </span>
                          <span className="refferend-list-affiliate__content--middle-content-refferend-list-person-info-left-text-date">
                            Số đơn: <span className="hight-light">0 đơn</span>
                          </span>
                          <span className="refferend-list-affiliate__content--middle-content-refferend-list-person-info-left-text-date">
                            Tổng tiền:{" "}
                            <span className="hight-light">0 vnđ</span>
                          </span>
                        </div>
                      </div>
                      <div className="refferend-list-affiliate__content--middle-content-refferend-list-person-info-right">
                        {/* Status */}
                        <span className="green">
                          Bước 3: Đặt đơn hoàn thành
                        </span>
                      </div>
                    </div>
                    {/* Progress bar */}
                    <div className="refferend-list-affiliate__content--middle-content-refferend-list-person-progress-bar">
                      <div className="refferend-list-affiliate__content--middle-content-refferend-list-person-progress-bar-container card-shadow green"></div>
                      <div className="refferend-list-affiliate__content--middle-content-refferend-list-person-progress-bar-container card-shadow green"></div>
                      <div className="refferend-list-affiliate__content--middle-content-refferend-list-person-progress-bar-container card-shadow green"></div>
                    </div>
                  </div>
                </div>
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
            )}
          </div>
        </div>
        <div className="refferend-list-affiliate__content--right">
          {/* Tài khoản ngân hàng */}
          <div className="refferend-list-affiliate__content--right-bank card-shadow">
            <div className="refferend-list-affiliate__content--right-bank-top">
              <div className="refferend-list-affiliate__content--right-bank-top-left">
                <span className="refferend-list-affiliate__content--right-bank-top-left-current">
                  Hiện có
                </span>
                <span className="refferend-list-affiliate__content--right-bank-top-left-money">
                  50.000đ
                </span>
              </div>
              <div className="refferend-list-affiliate__content--right-bank-top-right">
                <button className="refferend-list-affiliate__content--right-bank-top-right-withdraw">
                  Rút tiền
                </button>
              </div>
            </div>
            <div className="refferend-list-affiliate__content--right-bank-line"></div>
            <div className="refferend-list-affiliate__content--right-bank-bottom">
              <span className="refferend-list-affiliate__content--right-bank-bottom-withdraw">
                0đ
              </span>
              <span className="refferend-list-affiliate__content--right-bank-bottom-sub">
                đã rút
              </span>
            </div>
          </div>
          {/* Lợi ích tham gia */}
          <div className="refferend-list-affiliate__content--right-share card-shadow">
            <div className="refferend-list-affiliate__content--right-share-header">
              <span className="">
                Lợi ích khi tham gia chương trình Affiliate
              </span>
            </div>
            <div className="refferend-list-affiliate__content--right-share-content">
              <div className="refferend-list-affiliate__content--right-share-content-highlight">
                <span className="refferend-list-affiliate__content--right-share-content-highlight-title">
                  đ50.000
                </span>
                <span className="refferend-list-affiliate__content--right-share-content-highlight-sub-title">
                  Đơn hoàn thành đầu tiên
                </span>
              </div>
              <div className="refferend-list-affiliate__content--right-share-content-highlight">
                <span className="refferend-list-affiliate__content--right-share-content-highlight-title">
                  5%
                </span>
                <span className="refferend-list-affiliate__content--right-share-content-highlight-sub-title">
                  Chiết khấu mỗi đơn
                </span>
              </div>
              <div className="refferend-list-affiliate__content--right-share-content-share">
                <span className="refferend-list-affiliate__content--right-share-content-share-header">
                  Nhận chiết khấu ngay
                  <IoCopy color="orange" />
                </span>
                <span className="refferend-list-affiliate__content--right-share-content-share-link">
                  {valueUserInfo?.referral_link}
                </span>
              </div>
              <div className="refferend-list-affiliate__content--right-share-content-share">
                <span className="refferend-list-affiliate__content--right-share-content-share-header">
                  Gửi voucher giảm giá
                  <IoCopy color="orange" />
                </span>
                <span className="refferend-list-affiliate__content--right-share-content-share-link">
                  {valueUserInfo?.promotional_referral_link}
                </span>
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
              Hồ Chí Minh
            </span>
            <span className="refferend-list-affiliate__footer--content-information-description">
              Chi nhánh Hà Nội: NV 4.7 Liền Kề Hải Âu, Khu Đô Thị Cầu Bươu,
              Thanh Trì, Hà Nội
            </span>
            <span className="refferend-list-affiliate__footer--content-information-description">
              Chi nhánh Đà Nẵng: 27 Trần Lê, Hoà Xuân, Cẩm Lệ, Đà Nẵng
            </span>
            <span className="refferend-list-affiliate__footer--content-information-description">
              Chi nhánh Bình Dương: 106 Đường Nguyễn Văn Lộng, TP.Thủ Dầu Một,
              Bình Dương
            </span>
          </div>
          {/* Download app */}
          <div className="refferend-list-affiliate__footer--content-information">
            <span className="refferend-list-affiliate__footer--content-information-header">
              Tải ứng dụng
            </span>
            <img
              className="refferend-list-affiliate__footer--content-information-image"
              src={chStoreImage}
            ></img>
            <img
              className="refferend-list-affiliate__footer--content-information-image"
              src={appleStoreImage}
            ></img>
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
            <IoLogoFacebook size="40px" color="white" />
            <IoLogoTiktok size="40px" color="white" />
            <IoLogoYoutube size="40px" color="white" />
          </div>
        </div>
        {/* Copy right */}
        <div className="refferend-list-affiliate__footer--content-copy-right">
          <span className="refferend-list-affiliate__footer--content-copy-right-label">
            @ 2024 Công ty TNHH Giải pháp Công nghệ Guvi sở hữu bản quyền.
          </span>
        </div>
      </div>
    </div>
  );
};

export default RefferendList;
