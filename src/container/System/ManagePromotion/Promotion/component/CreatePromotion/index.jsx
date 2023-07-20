import { useCallback, useEffect, useState } from "react";
import InputCustom from "../../../../../../components/textInputCustom";
import i18n from "../../../../../../i18n";
import _debounce from "lodash/debounce";
import "./styles.scss";
import { useSelector } from "react-redux";
import { getLanguageState } from "../../../../../../redux/selectors/auth";
import CustomTextEditor from "../../../../../../components/customTextEdittor";
import UploadImage from "../../../../../../components/uploadImage";
import {
  Checkbox,
  DatePicker,
  FloatButton,
  Input,
  InputNumber,
  List,
  Popover,
  Radio,
  Select,
  Space,
  Switch,
} from "antd";
import { getGroupCustomerApi } from "../../../../../../api/promotion";
import { searchCustomersApi } from "../../../../../../api/customer";
import {
  getProvince,
  getService,
} from "../../../../../../redux/selectors/service";
import { CloseOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import vi from "antd/lib/locale/vi_VN";
import shortDescriptionImage from "../../../../../../assets/images/shortDescription.png";
import titleImage from "../../../../../../assets/images/title.png";
import descriptionImage from "../../../../../../assets/images/description.png";
import thumnailImage from "../../../../../../assets/images/thumnailContent.png";
import backgroundImage from "../../../../../../assets/images/backgroundContent.png";
import { DATA_PAYMENT } from "../../../../../../api/fakeData";
const { Option } = Select;

const CreatePromotion = () => {
  const [titleVN, setTitleVN] = useState("");
  const [titleEN, setTitleEN] = useState("");
  const [shortDescriptionVN, setShortDescriptionVN] = useState("");
  const [shortDescriptionEN, setShortDescriptionEN] = useState("");
  const [descriptionVN, setDescriptionVN] = useState("");
  const [descriptionEN, setDescriptionEN] = useState("");
  const [imgThumbnail, setImgThumbnail] = useState("");
  const [imgBackground, setImgBackground] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [minimumOrder, setMinimumOrder] = useState(0);
  const [checkMininum, setCheckMininum] = useState(1);
  const [discountUnit, setDiscountUnit] = useState("amount");
  const [maximumDiscount, setMaximumDiscount] = useState(0);
  const [isMaximumDiscount, setIsMaximumDiscount] = useState(true);
  const [reducedValue, setReducedValue] = useState(0);
  const [isGroupCustomer, setIsGroupCustomer] = useState(false);
  const [isObjectCustomer, setIsObjectCustomer] = useState(1);
  const [groupCustomer, setGroupCustomer] = useState([]);
  const [dataGroupCustomer, setDataGroupCustomer] = useState([]);
  const [isCustomer, setIsCustomer] = useState(false);
  const [name, setName] = useState("");
  const [data, setData] = useState([]);
  const [listCustomers, setListCustomers] = useState([]);
  const [listNameCustomers, setListNameCustomers] = useState([]);
  const [serviceApply, setServiceApply] = useState("");
  const [limitedQuantity, setLimitedQuantity] = useState(true);
  const [amount, setAmount] = useState(0);
  const [isUsePromo, setIsUsePromo] = useState(true);
  const [usePromo, setUsePromo] = useState(0);
  const [limitedDate, setLimitedDate] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isCheckEndDate, setIsCheckEndDate] = useState(true);
  const [isApplyArea, setIsApplyArea] = useState(1);
  const [city, setCity] = useState([]);
  const [isApllyTime, setIsApllyTime] = useState(1);
  const [isShowInApp, setIsShowInApp] = useState(false);
  const [isSendNotification, setIsSendNotification] = useState(false);
  const [isApplyPushNoti, setIsApplyPushNoti] = useState(1);
  const [titleNoti, setTitleNoti] = useState("");
  const [descriptionNoti, setDescriptionNoti] = useState("");
  const [dateSchedule, setDateSchedule] = useState("");
  const [isParrentPromotion, setIsParrentPromotion] = useState(false);
  const [totalChildPromotion, setTotalChildPromotion] = useState(0);
  const [isPaymentMethod, setIsPaymentMethod] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState([]);
  const [radioPaymentMethod, setRadioPaymentMethod] = useState(1);
  const [isExchangePoint, setIsExchangePoint] = useState(false);
  const [radioExchangePoint, setRadioExchangePoint] = useState(1);
  const [exchangePoint, setExchangePoint] = useState(0);
  const [ratioTypeVoucher, setRatioTypeVoucher] = useState(1);
  const [isCheckVoucher, setIsCheckVoucher] = useState(true);
  const [isCheckProgram, setIsCheckProgram] = useState(false);
  const options = [];
  const serviceOption = [];
  const cityOption = [];
  const service = useSelector(getService);
  const province = useSelector(getProvince);
  const lang = useSelector(getLanguageState);
  const selectAfter = (
    <Select
      defaultValue="VND"
      style={{ width: 60 }}
      onChange={(e) => {
        if (e === "VND") {
          setDiscountUnit("amount");
        } else {
          setDiscountUnit("percent");
        }
      }}
    >
      <Option value="VND">₫</Option>
      <Option value="%">%</Option>
    </Select>
  );

  useEffect(() => {
    getGroupCustomerApi(0, 10)
      .then((res) => setDataGroupCustomer(res.data))
      .catch((err) => {});
  }, []);

  dataGroupCustomer.map((item) => {
    options.push({
      label: item?.name,
      value: item?._id,
    });
  });

  province?.map((item) => {
    cityOption?.push({
      value: item?.code,
      label: item?.name,
      district: item?.districts,
    });
  });

  service.map((item) => {
    serviceOption.push({
      label: item?.title?.[lang],
      value: item?._id,
    });
  });

  const searchCustomer = useCallback(
    _debounce((value) => {
      setName(value);
      if (value) {
        searchCustomersApi(value)
          .then((res) => {
            if (value === "") {
              setData([]);
            } else {
              setData(res.data);
            }
          })
          .catch((err) => console.log(err));
      } else {
        setData([]);
      }
    }, 500),
    []
  );

  const onChooseCustomer = (item) => {
    setName("");
    setData([]);
    const newData = listCustomers.concat(item?._id);
    const newNameData = listNameCustomers.concat({
      _id: item?._id,
      full_name: item?.full_name,
      phone: item?.phone,
      id_view: item?.id_view,
    });
    setListCustomers(newData);
    setListNameCustomers(newNameData);
  };

  const removeItemCustomer = (item) => {
    const newNameArray = listNameCustomers.filter((i) => i?._id !== item?._id);
    const newArray = listCustomers.filter((i) => i !== item?._id);
    setListNameCustomers(newNameArray);
    setListCustomers(newArray);
  };

  const shortDescriptionPrommo = (
    <div className="div-content-title">
      <a>Mã khuyến mãi ở trang thanh toán</a>
      <img src={shortDescriptionImage} className="img-short" />
    </div>
  );

  const titlePrommo = (
    <div className="div-content-title">
      <a>Mã khuyến mãi ở trang chủ</a>
      <img src={titleImage} className="img-title" />
    </div>
  );

  const desciptionPrommo = (
    <div className="div-content-title">
      <a>Chi tiết mã khuyến mãi</a>
      <img src={descriptionImage} className="img-description" />
    </div>
  );

  const thumnailPrommo = (
    <div className="div-content-title">
      <a>Chi tiết mã khuyến mãi</a>
      <img src={thumnailImage} className="img-description" />
    </div>
  );

  const backgroundPrommo = (
    <div className="div-content-title">
      <a>Chi tiết mã khuyến mãi</a>
      <img src={backgroundImage} className="img-description" />
    </div>
  );

  return (
    <>
      <div className="div-container-create">
        <div className="div-body">
          <div className="div-input">
            <div className="div-parrent-promo">
              <div className="div-code-promo">
                <a className="label-promo">Mã khuyến mãi</a>
                <Input
                  placeholder={`${i18n.t("Nhập mã khuyến mãi", { lng: lang })}`}
                  type="text"
                  value={promoCode.toUpperCase()}
                  onChange={(e) => setPromoCode(e.target.value)}
                  style={{ marginTop: 5, width: "100%", height: 30 }}
                />
              </div>

              <div className="div-child-promo">
                <Checkbox
                  checked={isParrentPromotion}
                  onChange={(e) => setIsParrentPromotion(e.target.checked)}
                >
                  Tạo nhiều mã tự động
                </Checkbox>
                {isParrentPromotion && (
                  <InputNumber
                    min={0}
                    value={totalChildPromotion}
                    onChange={(e) => setTotalChildPromotion(Number.parseInt(e))}
                    style={{ width: "100%", marginTop: 2, height: 30 }}
                  />
                )}
              </div>
            </div>
            <a className="text-note">
              Khách hàng sẽ nhập hoặc chọn mã này lúc thanh toán
            </a>
          </div>
          <div className="div-input">
            <div className="div-head-title">
              <a className="title-input">Tiêu đề </a>
              <Popover content={titlePrommo} trigger="click" placement="right">
                <QuestionCircleOutlined className="icon-question" />
              </Popover>
            </div>
            <InputCustom
              title={`${i18n.t("vietnamese", { lng: lang })}`}
              value={titleVN}
              onChange={(e) => setTitleVN(e.target.value)}
            />
            <InputCustom
              title={`${i18n.t("english", { lng: lang })}`}
              value={titleEN}
              onChange={(e) => setTitleEN(e.target.value)}
            />
          </div>
          <div className="div-input">
            <div className="div-head-title">
              <a className="title-input">
                {`${i18n.t("describe", { lng: lang })}`}
              </a>

              <Popover
                content={shortDescriptionPrommo}
                trigger="click"
                placement="right"
              >
                <QuestionCircleOutlined className="icon-question" />
              </Popover>
            </div>
            <InputCustom
              title={`${i18n.t("vietnamese", { lng: lang })}`}
              value={shortDescriptionVN}
              onChange={(e) => setShortDescriptionVN(e.target.value)}
              textArea={true}
            />
            <InputCustom
              title={`${i18n.t("english", { lng: lang })}`}
              value={shortDescriptionEN}
              onChange={(e) => setShortDescriptionEN(e.target.value)}
              textArea={true}
            />
          </div>
          <div className="div-input">
            <div className="div-head-title">
              <a className="title-input">
                {`${i18n.t("detailed_description", { lng: lang })}`}
              </a>
              <Popover
                content={desciptionPrommo}
                trigger="click"
                placement="right"
              >
                <QuestionCircleOutlined className="icon-question" />
              </Popover>
            </div>
            <div>
              <a>{`${i18n.t("vietnamese", { lng: lang })}`}</a>
              <CustomTextEditor
                value={descriptionVN}
                onChangeValue={setDescriptionVN}
              />
            </div>
            <div className="mt-2">
              <a>{`${i18n.t("english", { lng: lang })}`}</a>
              <CustomTextEditor
                value={descriptionEN}
                onChangeValue={setDescriptionEN}
              />
            </div>
          </div>
          <div className="div-input">
            <a className="title-input">Loại khuyến mãi</a>
            <Radio.Group
              value={ratioTypeVoucher}
              onChange={(e) => setRatioTypeVoucher(e.target.value)}
              style={{
                marginTop: 10,
              }}
            >
              <Space>
                <Radio value={1}>GUVI</Radio>
                <Radio value={2} style={{ marginLeft: 120 }}>
                  Đối tác
                </Radio>
              </Space>
            </Radio.Group>
            {ratioTypeVoucher === 1 && (
              <div className="div-voucher">
                <Checkbox
                  checked={isCheckVoucher}
                  onChange={(e) => {
                    setIsCheckVoucher(e.target.checked);
                    setIsCheckProgram(false);
                  }}
                >
                  Voucher
                </Checkbox>
                <Checkbox
                  checked={isCheckProgram}
                  onChange={(e) => {
                    setIsCheckProgram(e.target.checked);
                    setIsCheckVoucher(false);
                  }}
                  style={{ margin: 0, marginTop: 10 }}
                >
                  Chương trình khuyến mãi
                </Checkbox>
                <Select
                  onChange={(e) => {
                    setServiceApply(e);
                  }}
                  options={serviceOption}
                  allowClear={true}
                  placeholder="Chọn dịch vụ áp dụng"
                  style={{ marginTop: 10 }}
                />
              </div>
            )}
          </div>
          <div className="div-input">
            <a className="title-input">Thời gian hiệu lực</a>
            <Radio.Group
              defaultValue={isApllyTime}
              style={{ marginTop: 10 }}
              onChange={(e) => setIsApllyTime(e.target.value)}
            >
              <Space direction="vertical">
                <Radio value={1}>Không giới hạn</Radio>
                <Radio value={2}>Thời gian áp dụng</Radio>
              </Space>
            </Radio.Group>
            {isApllyTime === 2 && (
              <>
                <div className="div-time-select">
                  <div className="div-time">
                    <a>{`${i18n.t("start_date", { lng: lang })}`}</a>
                    <DatePicker
                      onChange={(date, dateString) => setStartDate(dateString)}
                      style={{ width: "90%", marginTop: 3 }}
                      locale={vi}
                    />
                  </div>
                  <div className="div-time">
                    <Checkbox checked={isCheckEndDate} onChange={(e) => {}}>
                      Có thời gian kết thúc
                    </Checkbox>
                    <DatePicker
                      onChange={(date, dateString) => setEndDate(dateString)}
                      style={{ width: "90%" }}
                    />
                  </div>
                </div>
                <Checkbox
                  checked={limitedDate}
                  onChange={(e) => setLimitedDate(e.target.checked)}
                  style={{ marginTop: 10 }}
                >
                  Giới hạn ngày và giờ áp dụng trong tuần
                </Checkbox>
              </>
            )}
          </div>
          <div className="div-background-thumnail">
            <a className="title-input">Hỉnh ảnh khuyến mãi</a>
            <div>
              <UploadImage
                title={"Ảnh khuyến mãi 160px * 170px"}
                icon={
                  <Popover
                    content={thumnailPrommo}
                    trigger="click"
                    placement="right"
                  >
                    <QuestionCircleOutlined className="icon-question" />
                  </Popover>
                }
                image={imgThumbnail}
                setImage={setImgThumbnail}
                classImg={"img-thumbnail"}
              />

              <UploadImage
                title={"Ảnh bìa 414px * 200px"}
                icon={
                  <Popover
                    content={backgroundPrommo}
                    trigger="click"
                    placement="right"
                  >
                    <QuestionCircleOutlined className="icon-question" />
                  </Popover>
                }
                image={imgBackground}
                setImage={setImgBackground}
                classImg={"img-background"}
              />
            </div>
          </div>
          <div className="div-input">
            <a className="title-input">
              {`${i18n.t("Giảm giá đơn hàng", { lng: lang })}`}
            </a>
            <div className="div-reduced">
              <div className="div-body-reduced">
                <a>{`${i18n.t("Mức giảm", { lng: lang })}`}</a>
                <InputNumber
                  formatter={(value) =>
                    `${value}`.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")
                  }
                  min={0}
                  max={discountUnit === "percent" && 100}
                  value={
                    discountUnit === "amount" ? maximumDiscount : reducedValue
                  }
                  onChange={(e) => {
                    if (discountUnit === "amount") {
                      setMaximumDiscount(e);
                    } else {
                      setReducedValue(e);
                    }
                  }}
                  style={{ width: "100%", marginTop: 5 }}
                  addonAfter={selectAfter}
                />
              </div>
              {discountUnit === "percent" && (
                <div className="div-body-reduced">
                  {/* <a>{`${i18n.t("discount_max", { lng: lang })}`}</a> */}
                  <Checkbox
                    checked={isMaximumDiscount}
                    onChange={(e) => setIsMaximumDiscount(e.target.checked)}
                    disabled
                  >
                    Giới hạn số tiền giảm tối đa
                  </Checkbox>
                  <InputNumber
                    formatter={(value) =>
                      `${value}`.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")
                    }
                    min={0}
                    value={maximumDiscount}
                    onChange={(e) => setMaximumDiscount(e)}
                    addonAfter="đ"
                    style={{ width: "100%", marginTop: 3 }}
                  />
                </div>
              )}
            </div>
          </div>
          <div className="div-input">
            <a className="title-input">
              {`${i18n.t("Điều kiện tối thiểu", { lng: lang })}`}
            </a>
            <Radio.Group
              style={{ marginTop: 10 }}
              defaultValue={checkMininum}
              onChange={(e) => {
                setCheckMininum(e.target.value);
                if (e.target.value === 1) {
                  setMinimumOrder(0);
                }
              }}
            >
              <Space direction="vertical">
                <Radio value={1}>Không yêu cầu</Radio>
                <Radio value={2}>Giá trị đơn tối thiểu</Radio>
              </Space>
            </Radio.Group>
            {checkMininum === 2 && (
              <div className="div-minimum-order">
                <InputNumber
                  formatter={(value) =>
                    `${value} ₫`.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")
                  }
                  min={0}
                  value={minimumOrder}
                  onChange={(e) => setMinimumOrder(e)}
                  className="input-price-minimum"
                />
                <a className="text-note">Áp dụng cho tất cả đơn hàng</a>
              </div>
            )}
          </div>
          <div className="div-input">
            <a className="title-input">
              {`${i18n.t("Đối tượng khách hàng", { lng: lang })}`}
            </a>
            <Radio.Group
              defaultValue={isObjectCustomer}
              onChange={(e) => setIsObjectCustomer(e.target.value)}
              style={{ marginTop: 10 }}
            >
              <Space direction="vertical">
                <Radio value={1}>Không giới hạn khách hàng</Radio>
                <Radio value={2}>Nhóm khách hàng</Radio>
                <Radio value={3}>Tuỳ chọn khách hàng</Radio>
              </Space>
            </Radio.Group>
            <div>
              {isObjectCustomer === 2 && (
                <Select
                  mode="multiple"
                  allowClear
                  style={{
                    width: "100%",
                    marginTop: 10,
                  }}
                  placeholder="Please select"
                  onChange={(value) => setGroupCustomer(value)}
                  options={options}
                />
              )}
            </div>
            <div>
              {isObjectCustomer === 3 && (
                <div>
                  <Input
                    placeholder={`${i18n.t("search", { lng: lang })}`}
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      searchCustomer(e.target.value);
                    }}
                    style={{ marginTop: 10 }}
                  />
                  {data.length > 0 && (
                    <List className="list-item-kh">
                      {data?.map((item, index) => {
                        return (
                          <div
                            className="div-item"
                            key={index}
                            onClick={() => onChooseCustomer(item)}
                          >
                            <a className="text-name">
                              {item?.full_name} - {item?.phone} -{" "}
                              {item?.id_view}
                            </a>
                          </div>
                        );
                      })}
                    </List>
                  )}

                  {listNameCustomers.length > 0 && (
                    <div className="div-list-customer">
                      <List type={"unstyled"}>
                        {listNameCustomers.map((item) => {
                          return (
                            <div className="div-item-customer">
                              <a className="text-name-list">
                                - {item?.full_name} . {item?.phone} .{" "}
                                {item?.id_view}
                              </a>
                              <CloseOutlined
                                className="icon-delete"
                                size={70}
                                onClick={() => removeItemCustomer(item)}
                              />
                            </div>
                          );
                        })}
                      </List>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="div-input">
            <a className="title-input">
              {`${i18n.t("Khu vực áp dụng", { lng: lang })}`}
            </a>
            <Radio.Group
              style={{ marginTop: 10 }}
              defaultValue={isApplyArea}
              onChange={(e) => {
                setIsApplyArea(e.target.value);
              }}
            >
              <Space direction="vertical">
                <Radio value={1}>Toàn quốc</Radio>
                <Radio value={2}>Tuỳ chọn tỉnh/thành phố</Radio>
              </Space>
            </Radio.Group>

            {isApplyArea === 2 && (
              <Select
                mode="multiple"
                allowClear
                style={{ width: "100%", marginTop: 10 }}
                onChange={(e) => {
                  setCity(e);
                }}
                options={cityOption}
                optionLabelProp="label"
              />
            )}
          </div>
          <div className="div-input">
            <a className="title-input">Giới hạn sử dụng</a>

            <div className="div-column-limit">
              <Checkbox
                checked={limitedQuantity}
                onChange={(e) => setLimitedQuantity(e.target.checked)}
              >
                Giới hạn tổng số có thể sử dụng khuyến mãi
              </Checkbox>
              {limitedQuantity && (
                <InputNumber
                  min={0}
                  value={amount}
                  onChange={(e) => setAmount(e)}
                  className="input-price"
                />
              )}
            </div>
            <div className="div-column-limit">
              <Checkbox
                checked={isUsePromo}
                onChange={(e) => setIsUsePromo(e.target.checked)}
              >
                Giới hạn số lần sử dụng cho mỗi khách hàng
              </Checkbox>
              {isUsePromo && (
                <InputNumber
                  min={0}
                  value={usePromo}
                  onChange={(e) => setUsePromo(e)}
                  className="input-price"
                />
              )}
            </div>
          </div>
          <div className="div-input">
            <a className="title-input">Điểm G-point quy đổi</a>
            <Radio.Group
              defaultValue={radioExchangePoint}
              style={{ marginTop: 10 }}
              onChange={(e) => {
                setRadioExchangePoint(e.target.value);
                if (e.target.value === 1) {
                  setIsExchangePoint(false);
                } else {
                  setIsExchangePoint(true);
                }
              }}
            >
              <Space direction="vertical">
                <Radio value={1}>Không yêu cầu</Radio>
                <Radio value={2}>Giá trị đổi khuyến mãi</Radio>
              </Space>
            </Radio.Group>
            {radioExchangePoint === 2 && (
              <InputNumber
                min={0}
                defaultValue={exchangePoint}
                onChange={(e) => setExchangePoint(e)}
                style={{ width: "50%", marginTop: 10, marginLeft: 20 }}
              />
            )}
          </div>
        </div>
        <div className="div-detail">
          <div className="div-input">
            <a className="title-input">Cài đặt</a>
            <div className="div-show-in-app">
              <Switch
                checked={isShowInApp}
                onChange={(e, permission) => {
                  setIsShowInApp(e);
                }}
                size="small"
                className={isShowInApp ? "switch-select" : "switch"}
              />
              <a className="label-display">Hiển thị trên App</a>
            </div>

            <div className="div-push-noti">
              <div>
                <Switch
                  checked={isSendNotification}
                  onChange={(e) => setIsSendNotification(e)}
                  size="small"
                  className={isSendNotification ? "switch-select" : "switch"}
                />
                <a className="title-input">Push notification</a>
              </div>
              {isSendNotification && (
                <div className="div-body-push">
                  <Radio.Group
                    defaultValue={isApplyPushNoti}
                    style={{ marginTop: 10 }}
                    onChange={(e) => setIsApplyPushNoti(e.target.value)}
                  >
                    <Space direction="vertical">
                      <Radio value={1}>Đẩy thông báo ngay lập tức</Radio>
                      <Radio value={2}>Đẩy thông báo theo thời gian</Radio>
                    </Space>
                  </Radio.Group>

                  <div>
                    <InputCustom
                      title={`${i18n.t("title", { lng: lang })}`}
                      type="text"
                      value={titleNoti}
                      onChange={(e) => setTitleNoti(e.target.value)}
                      style={{ width: "100%" }}
                    />
                    <InputCustom
                      title={`${i18n.t("describe", { lng: lang })}`}
                      textArea={true}
                      value={descriptionNoti}
                      onChange={(e) => setDescriptionNoti(e.target.value)}
                      style={{ marginTop: 5, width: "100%" }}
                    />
                    {isApplyPushNoti === 2 && (
                      <Input
                        type="datetime-local"
                        value={dateSchedule}
                        onChange={(e) => setDateSchedule(e.target.value)}
                        style={{ width: "100%", marginTop: 5 }}
                      />
                    )}
                  </div>
                </div>
              )}
            </div>
            <a className="title-input mt-2">Hinh thức được áp dụng</a>
            <div className="div-exchange-point">
              <Radio.Group
                style={{ marginTop: 5, marginLeft: 5 }}
                onChange={(e) => {
                  setRadioPaymentMethod(e.target.value);
                  if (e.target.value === 1) {
                    setIsPaymentMethod(false);
                  } else {
                    setIsPaymentMethod(true);
                  }
                }}
                defaultValue={radioPaymentMethod}
              >
                <Space direction="vertical">
                  <Radio value={1}>Tất cả loại thanh toán</Radio>
                  <Radio value={2}>Tuỳ chọn thanh toán</Radio>
                </Space>
              </Radio.Group>
              {radioPaymentMethod === 2 && (
                <Select
                  mode="multiple"
                  allowClear
                  style={{
                    width: "100%",
                    marginTop: 10,
                  }}
                  placeholder="Chọn phương thức"
                  onChange={(e) => setPaymentMethod(e)}
                  options={DATA_PAYMENT}
                />
              )}
            </div>
          </div>
        </div>
      </div>
      <FloatButton.BackTop />
    </>
  );
};
export default CreatePromotion;

const TAB_DISCOUNT = [
  {
    value: "amount",
    title: "direct_discount",
  },
  {
    value: "percent",
    title: "percentage_discount",
  },
];
