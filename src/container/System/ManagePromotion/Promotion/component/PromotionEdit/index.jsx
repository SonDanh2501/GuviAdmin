import {
  CloseOutlined,
  PlusCircleFilled,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import {
  Button,
  Checkbox,
  DatePicker,
  Divider,
  FloatButton,
  Input,
  InputNumber,
  List,
  Popover,
  Radio,
  Select,
  Space,
  Switch,
  Tour,
} from "antd";
import locale from "antd/es/date-picker/locale/vi_VN";
import _debounce from "lodash/debounce";
import "moment/locale/vi";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { searchCustomersApi } from "../../../../../../api/customer";
import { DATA_PAYMENT, DATA_TIME_APPLY } from "../../../../../../api/fakeData";
import {
  activePromotion,
  deletePromotion,
  getGroupCustomerApi,
  getPromotionDetails,
  updatePromotion,
} from "../../../../../../api/promotion";
import backgroundImage from "../../../../../../assets/images/backgroundContent.png";
import descriptionImage from "../../../../../../assets/images/description.png";
import shortDescriptionImage from "../../../../../../assets/images/shortDescription.png";
import thumnailImage from "../../../../../../assets/images/thumnailContent.png";
import titleImage from "../../../../../../assets/images/title.png";
import CustomTextEditor from "../../../../../../components/customTextEdittor";
import LoadingPagination from "../../../../../../components/paginationLoading";
import InputCustom from "../../../../../../components/textInputCustom";
import UploadImage from "../../../../../../components/uploadImage";
import { errorNotify } from "../../../../../../helper/toast";
import i18n from "../../../../../../i18n";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { getLanguageState } from "../../../../../../redux/selectors/auth";
import {
  getProvince,
  getService,
} from "../../../../../../redux/selectors/service";
import "./styles.scss";
import ModalCustom from "../../../../../../components/modalCustom";
import { useCookies } from "../../../../../../helper/useCookies";
const { Option } = Select;

const EditPromotion = () => {
  const { state } = useLocation();
  const { id } = state;
  const [saveToCookie, readCookie] = useCookies();
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
  const [serviceApply, setServiceApply] = useState([]);
  const [limitedQuantity, setLimitedQuantity] = useState(true);
  const [amount, setAmount] = useState(0);
  const [isUsePromo, setIsUsePromo] = useState(true);
  const [usePromo, setUsePromo] = useState(0);
  const [limitedDate, setLimitedDate] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isCheckEndDate, setIsCheckEndDate] = useState(true);
  const [isApplyArea, setIsApplyArea] = useState(false);
  const [ratioApplyArea, setRatioApplyArea] = useState(1);
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
  const [namebrand, setNamebrand] = useState("");
  const [isApplyTimeUse, setIsApplyTimeUse] = useState(false);
  const [timeApply, setTimeApply] = useState(DATA_APPLY_TIME);
  const [isDateSchedule, setIsDateSchedule] = useState(false);
  const [dateExchange, setDateExchange] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [ratioTypeDateApply, setRatioTypeDateApply] = useState(1);
  const [typeDateApply, setTypeDateApply] = useState("date_create");
  const [isActive, setIsActive] = useState(false);
  const [modalDelete, setModalDelete] = useState(false);
  const [stepTuor, setStepTuor] = useState(false);
  const ref1 = useRef(null);
  const options = [];
  const serviceOption = [];
  const cityOption = [];
  const dateFormat = "YYYY-MM-DD";
  const service = useSelector(getService);
  const province = useSelector(getProvince);
  const lang = useSelector(getLanguageState);
  const navigate = useNavigate();

  const selectAfter = (
    <Select
      defaultValue="VND"
      style={{ width: 50 }}
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

  useEffect(() => {
    getPromotionDetails(id)
      .then((res) => {
        setTitleVN(res?.title?.vi);
        setTitleEN(res?.title?.en);
        setShortDescriptionVN(res?.short_description?.vi);
        setShortDescriptionEN(res?.short_description?.en);
        setDescriptionVN(res?.description?.vi);
        setDescriptionEN(res?.description?.en);
        setImgThumbnail(res?.thumbnail);
        setImgBackground(res?.image_background);
        setLimitedDate(res?.is_limit_date);
        setIsApllyTime(res?.is_limit_date ? 2 : 1);
        setStartDate(res?.is_limit_date ? res?.limit_start_date : "");
        setEndDate(res?.is_limit_date ? res?.limit_end_date : "");
        setLimitedQuantity(res?.is_limit_count);
        setAmount(res?.limit_count);
        setIsGroupCustomer(res?.is_id_group_customer);
        setGroupCustomer(res?.id_group_customer);
        setIsCustomer(res?.is_id_customer);
        setIsObjectCustomer(
          res?.is_id_customer ? 3 : res?.is_id_group_customer ? 2 : 1
        );
        setListNameCustomers(res?.id_customer);
        setIsUsePromo(res?.is_limited_use);
        setUsePromo(res?.limited_use);
        setDiscountUnit(res?.discount_unit);
        setMaximumDiscount(res?.discount_max_price);
        setReducedValue(res?.discount_value);
        setIsExchangePoint(res?.is_exchange_point);
        setRadioExchangePoint(res?.is_exchange_point ? 2 : 1);
        setExchangePoint(res?.exchange_point);
        setNamebrand(res?.brand);
        setPromoCode(res?.code);
        setServiceApply(res?.service_apply[0]);
        setMinimumOrder(res?.price_min_order);
        setCheckMininum(res?.price_min_order > 0 ? 2 : 1);
        setDateExchange(res?.exp_date_exchange);
        setIsPaymentMethod(res?.is_payment_method);
        setPaymentMethod(res?.payment_method);
        setListCustomers(res?.id_customer);
        res?.id_customer?.map((item) => {
          listCustomers.push(item?._id);
        });
        setIsApplyTimeUse(res?.is_loop);
        setRatioTypeDateApply(
          res?.is_loop
            ? 1
            : res?.is_loop && res?.type_date_apply === "date_create"
            ? 2
            : 3
        );
        setTimeApply(
          res?.day_loop?.length > 0 ? res?.day_loop : DATA_APPLY_TIME
        );
        setIsParrentPromotion(res?.is_parrent_promotion);
        setTotalChildPromotion(res?.total_child_promotion);
        setIsShowInApp(res?.is_show_in_app);
        setRatioApplyArea(res?.is_apply_area ? 2 : 1);
        setIsApplyArea(res?.is_apply_area);
        setRatioApplyArea(res?.is_apply_area ? 2 : 1);
        setCity(res?.city);
        setRatioTypeVoucher(res?.brand === "guvi" ? 1 : 2);
        setIsCheckVoucher(res?.type_promotion === "code" ? true : false);
        setIsCheckProgram(res?.type_promotion === "event" ? true : false);
        setTypeDateApply(res?.type_date_apply);
        setIsActive(res?.is_active);
        setRatioTypeDateApply(
          res?.type_date_apply === "date_create"
            ? 2
            : res?.type_date_apply === "date_work"
            ? 3
            : 1
        );
      })
      .catch((err) => console.log(err));
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

  const changeCheckApply = (value, index) => {
    const arr = [...timeApply];
    timeApply[index].is_check_loop = value;
    setTimeApply(arr);
  };

  const addTime = (index) => {
    const arr = [...timeApply];
    timeApply[index].time_loop.push({
      start_time_local: "",
      end_time_local: "",
    });
    setTimeApply(arr);
  };

  const deleteTime = (index, indexTime) => {
    timeApply[index].time_loop.splice(indexTime, 1);
    setTimeApply([...timeApply]);
  };

  const changeTimeStartApply = (value, index, indexTime) => {
    const arr = [...timeApply];
    timeApply[index].time_loop[indexTime].start_time_local = value;
    setTimeApply(arr);
  };
  const changeTimeEndApply = (value, index, indexTime) => {
    const arr = [...timeApply];
    timeApply[index].time_loop[indexTime].end_time_local = value;
    setTimeApply(arr);
  };

  const onActive = useCallback((id, is_active) => {
    setIsLoading(true);
    if (is_active) {
      activePromotion(id, { is_active: false })
        .then((res) => {
          setIsLoading(false);
          setIsActive(false);
        })
        .catch((err) => {
          errorNotify({
            message: err,
          });
          setIsLoading(false);
        });
    } else {
      activePromotion(id, { is_active: true })
        .then((res) => {
          setIsLoading(false);
          setIsActive(true);
        })
        .catch((err) => {
          errorNotify({
            message: err,
          });
          setIsLoading(false);
        });
    }
  }, []);

  const onDelete = useCallback((id) => {
    setIsLoading(true);
    deletePromotion(id)
      .then((res) => {
        navigate(-1);
        setIsLoading(false);
      })
      .catch((err) => {
        errorNotify({
          message: err,
        });
        setIsLoading(false);
      });
  }, []);

  const onEditPromotion = useCallback(() => {
    setIsLoading(true);
    updatePromotion(id, {
      title: {
        vi: titleVN,
        en: titleEN,
      },
      short_description: {
        vi: shortDescriptionVN,
        en: shortDescriptionEN,
      },
      description: {
        vi: descriptionVN,
        en: descriptionEN,
      },
      thumbnail: imgThumbnail,
      image_background: imgBackground,
      code: promoCode,
      is_limit_date: limitedDate,
      limit_start_date: limitedDate ? new Date(startDate).toISOString() : null,
      limit_end_date: limitedDate ? new Date(endDate).toISOString() : null,
      is_limit_count: limitedQuantity,
      limit_count: limitedQuantity ? amount : 0,
      is_id_group_customer: isGroupCustomer,
      id_group_customer: groupCustomer,
      is_id_customer: isCustomer,
      id_customer: listCustomers,
      service_apply: serviceApply?.length > 0 ? [serviceApply] : [],
      is_limited_use: isUsePromo,
      limited_use: isUsePromo ? usePromo : 0,
      type_discount: ratioTypeVoucher === 2 ? "partner_promotion" : "order",
      type_promotion: isCheckProgram ? "event" : "code",
      price_min_order: minimumOrder,
      discount_unit: discountUnit,
      discount_max_price: maximumDiscount,
      discount_value: reducedValue,
      is_delete: false,
      is_exchange_point: isExchangePoint,
      exchange_point: exchangePoint,
      brand: namebrand.toUpperCase(),
      exp_date_exchange: dateExchange,
      position: 0,
      is_payment_method: isPaymentMethod,
      payment_method: paymentMethod,
      is_parrent_promotion: isParrentPromotion,
      total_child_promotion: totalChildPromotion,
      is_loop: isApplyTimeUse,
      day_loop: isApplyTimeUse ? timeApply : [],
      is_show_in_app: isShowInApp,
      is_apply_area: isApplyArea,
      city: city,
      district: [],
      timezone: "Asia/Ho_Chi_Minh",
      type_date_apply: typeDateApply,
    })
      .then((res) => {
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
        errorNotify({
          message: err,
        });
      });
  }, [
    titleVN,
    titleEN,
    shortDescriptionVN,
    shortDescriptionEN,
    descriptionVN,
    descriptionEN,
    imgThumbnail,
    imgBackground,
    limitedDate,
    startDate,
    endDate,
    limitedQuantity,
    amount,
    isGroupCustomer,
    groupCustomer,
    isCustomer,
    isUsePromo,
    usePromo,
    discountUnit,
    isExchangePoint,
    exchangePoint,
    namebrand,
    maximumDiscount,
    reducedValue,
    serviceApply,
    promoCode,
    dateExchange,
    minimumOrder,
    isPaymentMethod,
    paymentMethod,
    listCustomers,
    isSendNotification,
    titleNoti,
    descriptionNoti,
    isDateSchedule,
    dateSchedule,
    isParrentPromotion,
    totalChildPromotion,
    isApplyTimeUse,
    timeApply,
    isShowInApp,
    isApplyArea,
    city,
    id,
  ]);

  return (
    <>
      <div className="div-head-add-promotion">
        <a>Chỉnh sửa khuyến mãi</a>
        <div>
          {isActive ? (
            <Button
              className={"btn-stop-activation"}
              onClick={() => onActive(id, isActive)}
              style={{ width: "auto" }}
              ref={ref1}
            >
              Dừng kích hoạt
            </Button>
          ) : (
            <Button
              className={"btn-activation"}
              onClick={() => onActive(id, isActive)}
              style={{ width: "auto" }}
            >
              Kích hoạt
            </Button>
          )}

          {!isActive && (
            <Button
              type="primary"
              onClick={onEditPromotion}
              style={{ width: "auto" }}
            >
              Chỉnh sửa
            </Button>
          )}
        </div>
      </div>
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
                  value={serviceApply}
                />
              </div>
            )}
            {ratioTypeVoucher === 2 && (
              <div className="ml-3">
                <InputCustom
                  title="Tên đối tác"
                  value={namebrand}
                  onChange={(e) => setNamebrand(e.target.value)}
                  placeholder="Nhập tên đối tác"
                />
              </div>
            )}
          </div>
          {(serviceApply?.length > 0 || ratioTypeVoucher === 2) && (
            <>
              <div className="div-input">
                <a className="title-input">Thời gian hiệu lực</a>
                <Radio.Group
                  value={isApllyTime}
                  style={{ marginTop: 10 }}
                  onChange={(e) => {
                    setIsApllyTime(e.target.value);
                    if (e.target.value === 1) {
                      setLimitedDate(false);
                    } else {
                      setLimitedDate(true);
                    }
                  }}
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
                          onChange={(date, dateString) => {
                            setStartDate(dateString);
                          }}
                          style={{ width: "90%", marginTop: 3 }}
                          locale={locale}
                          format={dateFormat}
                          value={
                            startDate
                              ? dayjs(startDate?.slice(0, 11), dateFormat)
                              : ""
                          }
                        />
                      </div>
                      <div className="div-time">
                        <Checkbox checked={isCheckEndDate} onChange={(e) => {}}>
                          Có thời gian kết thúc
                        </Checkbox>
                        <DatePicker
                          onChange={(date, dateString) =>
                            setEndDate(dateString)
                          }
                          style={{ width: "90%", marginTop: 2 }}
                          locale={locale}
                          format={dateFormat}
                          value={
                            endDate
                              ? dayjs(endDate?.slice(0, 11), dateFormat)
                              : ""
                          }
                        />
                      </div>
                    </div>
                    {/* <Checkbox
                      checked={isApplyTimeUse}
                      onChange={(e) => setIsApplyTimeUse(e.target.checked)}
                      style={{ marginTop: 10 }}
                    >
                      Giới hạn ngày và giờ áp dụng trong tuần
                    </Checkbox> */}
                    <a className="title-input mt-2">
                      Thời gian áp dụng trong tuần
                    </a>

                    <Radio.Group
                      value={ratioTypeDateApply}
                      style={{ marginTop: 10, width: "100%" }}
                      onChange={(e) => {
                        setRatioTypeDateApply(e.target.value);
                        if (e.target.value === 1) {
                          setIsApplyTimeUse(false);
                        } else if (e.target.value === 2) {
                          setIsApplyTimeUse(true);
                          setTypeDateApply("date_create");
                        } else {
                          setIsApplyTimeUse(true);
                          setTypeDateApply("date_work");
                        }
                      }}
                    >
                      <Space direction="vertical">
                        <Radio value={1}>Tất cả các ngày</Radio>
                        <Radio value={2}>Theo ngày tạo đơn</Radio>
                        <Radio value={3} disabled>
                          Theo ngày làm
                        </Radio>
                      </Space>
                    </Radio.Group>
                    {isApplyTimeUse && (
                      <div className="div-list-time-apply">
                        {timeApply?.map((item, index) => {
                          return (
                            <div key={index} className="div-item-time-apply">
                              <div className="div-item-right">
                                <Checkbox
                                  checked={item?.is_check_loop}
                                  onChange={(e) =>
                                    changeCheckApply(e.target.checked, index)
                                  }
                                  className="checkbox-date"
                                >
                                  {item?.day_local === 1
                                    ? "Thứ Hai"
                                    : item?.day_local === 2
                                    ? "Thứ Ba"
                                    : item?.day_local === 3
                                    ? "Thứ Tư"
                                    : item?.day_local === 4
                                    ? "Thứ Năm"
                                    : item?.day_local === 5
                                    ? "Thứ Sáu"
                                    : item?.day_local === 6
                                    ? "Thứ Bảy"
                                    : "Chủ Nhật"}
                                </Checkbox>
                                {(!item?.is_check_loop ||
                                  (item?.time_loop?.length === 0 &&
                                    item.is_check_loop)) && (
                                  <a
                                    className={
                                      item?.is_check_loop
                                        ? "text-all"
                                        : "text-all-italic"
                                    }
                                  >
                                    Cả ngày
                                  </a>
                                )}

                                {item?.is_check_loop && (
                                  <div className="div-list-time">
                                    {item?.time_loop?.map((i, indexTime) => {
                                      return (
                                        <div
                                          key={indexTime}
                                          className="div-item-time"
                                        >
                                          <div className="div-select-time">
                                            <div className="div-row">
                                              <Select
                                                options={DATA_TIME_APPLY}
                                                style={{ width: 100 }}
                                                size="small"
                                                onChange={(e) =>
                                                  changeTimeStartApply(
                                                    e,
                                                    index,
                                                    indexTime
                                                  )
                                                }
                                              />
                                              <a className="minus">-</a>

                                              <Select
                                                options={DATA_TIME_APPLY}
                                                style={{ width: 100 }}
                                                size="small"
                                                onChange={(e) =>
                                                  changeTimeEndApply(
                                                    e,
                                                    index,
                                                    indexTime
                                                  )
                                                }
                                              />
                                              <CloseOutlined
                                                className="icon-remove"
                                                onClick={() =>
                                                  deleteTime(index, indexTime)
                                                }
                                              />
                                            </div>
                                            <a className="text-from-time">
                                              (
                                              {`từ ${i?.start_time_local.slice(
                                                0,
                                                5
                                              )} đến trước ${i?.end_time_local.slice(
                                                0,
                                                5
                                              )}`}
                                              )
                                            </a>
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                )}
                              </div>
                              {item?.is_check_loop && (
                                <>
                                  {item?.time_loop?.length > 0 ? (
                                    <PlusCircleFilled
                                      className="icon-add-time"
                                      onClick={() => addTime(index)}
                                    />
                                  ) : (
                                    <a
                                      className="choose-time"
                                      onClick={() => addTime(index)}
                                    >
                                      Chọn giờ
                                    </a>
                                  )}
                                </>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </>
                )}
              </div>
              {!isCheckProgram && (
                <div className="div-background-thumnail">
                  <a className="title-input">Hình ảnh khuyến mãi</a>
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
              )}
              {ratioTypeVoucher === 1 && (
                <div className="div-input">
                  <a className="title-input">
                    {`${i18n.t("Giảm giá đơn hàng", { lng: lang })}`}
                  </a>
                  <div className="div-reduced-order">
                    <div className="div-body-reduced">
                      <a>{`${i18n.t("Mức giảm", { lng: lang })}`}</a>
                      <InputNumber
                        formatter={(value) =>
                          `${value}`.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")
                        }
                        min={0}
                        max={discountUnit === "percent" && 100}
                        value={
                          discountUnit === "amount"
                            ? maximumDiscount
                            : reducedValue
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
                          onChange={(e) =>
                            setIsMaximumDiscount(e.target.checked)
                          }
                          disabled
                        >
                          Giới hạn số tiền giảm tối đa
                        </Checkbox>
                        <InputNumber
                          formatter={(value) =>
                            `${value}`.replace(
                              /(\d)(?=(\d\d\d)+(?!\d))/g,
                              "$1,"
                            )
                          }
                          min={0}
                          value={maximumDiscount}
                          onChange={(e) => setMaximumDiscount(e)}
                          addonAfter="đ"
                          style={{ width: "100%", marginTop: 4 }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}
              {ratioTypeVoucher === 1 && (
                <div className="div-input">
                  <a className="title-input">
                    {`${i18n.t("Điều kiện tối thiểu", { lng: lang })}`}
                  </a>
                  <Radio.Group
                    style={{ marginTop: 10 }}
                    value={checkMininum}
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
                          `${value} ₫`.replace(
                            /(\d)(?=(\d\d\d)+(?!\d))/g,
                            "$1,"
                          )
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
              )}

              <div className="div-input">
                <a className="title-input">
                  {`${i18n.t("Đối tượng khách hàng", { lng: lang })}`}
                </a>
                <Radio.Group
                  value={isObjectCustomer}
                  onChange={(e) => {
                    setIsObjectCustomer(e.target.value);
                    if (e.target.value === 2) {
                      setIsGroupCustomer(true);
                    } else if (e.target.value === 3) {
                      setIsCustomer(true);
                    }
                  }}
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
                      onChange={(value) => {
                        setGroupCustomer(value);
                      }}
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
                      {data?.length > 0 && (
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

                      {listNameCustomers?.length > 0 && (
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
                  value={ratioApplyArea}
                  onChange={(e) => {
                    setRatioApplyArea(e.target.value);
                    if (e.target.value === 1) {
                      setIsApplyArea(false);
                    } else {
                      setIsApplyArea(true);
                    }
                  }}
                >
                  <Space direction="vertical">
                    <Radio value={1}>Toàn quốc</Radio>
                    <Radio value={2}>Tuỳ chọn tỉnh/thành phố</Radio>
                  </Space>
                </Radio.Group>

                {ratioApplyArea === 2 && (
                  <Select
                    mode="multiple"
                    allowClear
                    style={{ width: "100%", marginTop: 10 }}
                    onChange={(e) => {
                      setCity(e);
                    }}
                    options={cityOption}
                    optionLabelProp="label"
                    value={city}
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
              {!isCheckProgram && (
                <div className="div-input">
                  <a className="title-input">Điểm G-point quy đổi</a>
                  <Radio.Group
                    value={radioExchangePoint}
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
                    <div className="div-exchange">
                      <InputNumber
                        min={0}
                        defaultValue={exchangePoint}
                        onChange={(e) => setExchangePoint(e)}
                        style={{ width: "50%", marginTop: 10 }}
                      />
                      <a className="label-exchange">
                        Thời gian sử dụng sau khi đổi
                      </a>
                      <InputNumber
                        min={0}
                        defaultValue={dateExchange}
                        onChange={(e) => setDateExchange(e)}
                        style={{ width: "50%", marginTop: 10 }}
                      />
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
        <div className="div-detail">
          <div className="div-input">
            <a className="title-input">Cài đặt</a>
            {isCheckVoucher && ratioTypeVoucher === 1 && (
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
            )}
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
                    value={isApplyPushNoti}
                    style={{ marginTop: 10 }}
                    onChange={(e) => {
                      setIsApplyPushNoti(e.target.value);
                      if (e.target.value) {
                        setIsDateSchedule(false);
                      } else {
                        setIsDateSchedule(true);
                      }
                    }}
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
            <a className="title-input mt-2">
              Phương thức thanh toán được áp dụng
            </a>
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
                value={radioPaymentMethod}
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
      <Button
        type="primary"
        danger
        style={{ width: "auto", marginBottom: 50, marginTop: 20 }}
        onClick={() => setModalDelete(true)}
      >
        Xoá khuyến mãi
      </Button>

      <ModalCustom
        title="Xoá khuyến mãi"
        isOpen={modalDelete}
        handleOk={() => onDelete(id)}
        textOk={"Xoá"}
        handleCancel={() => setModalDelete(false)}
        body={
          <div style={{ display: "flex", flexDirection: "column" }}>
            <a>Bạn có chắc muốn xoá mã khuyến mãi này?</a>
            <a style={{ color: "red" }}>{titleVN}</a>
          </div>
        }
      />
      {/* <Tour
        open={stepTuor}
        onClose={() => {
          setStepTuor(false);
          saveToCookie("tour-edit-promotion", false);
        }}
        steps={steps}
      /> */}
      <FloatButton.BackTop />
      {isLoading && <LoadingPagination />}
    </>
  );
};
export default EditPromotion;

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

const DATA_APPLY_TIME = [
  {
    day_local: 1,
    time_loop: [],
    timezone: "Asia/Ho_Chi_Minh",
    is_check_loop: false,
  },
  {
    day_local: 2,
    time_loop: [],
    timezone: "Asia/Ho_Chi_Minh",
    is_check_loop: false,
  },
  {
    day_local: 3,
    time_loop: [],
    timezone: "Asia/Ho_Chi_Minh",
    is_check_loop: false,
  },
  {
    day_local: 4,
    time_loop: [],
    timezone: "Asia/Ho_Chi_Minh",
    is_check_loop: false,
  },
  {
    day_local: 5,
    time_loop: [],
    timezone: "Asia/Ho_Chi_Minh",
    is_check_loop: false,
  },
  {
    day_local: 6,
    time_loop: [],
    timezone: "Asia/Ho_Chi_Minh",
    is_check_loop: false,
  },
  {
    day_local: 0,
    time_loop: [],
    timezone: "Asia/Ho_Chi_Minh",
    is_check_loop: false,
  },
];
