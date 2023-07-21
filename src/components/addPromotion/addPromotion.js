import {
  Button,
  Checkbox,
  Col,
  DatePicker,
  Input,
  InputNumber,
  List,
  Modal,
  Row,
  Select,
  TimePicker,
} from "antd";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import _debounce from "lodash/debounce";
import moment from "moment";
import React, { memo, useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { searchCustomersApi } from "../../api/customer";
import { DATA_PAYMENT, date } from "../../api/fakeData";
import { createPushNotification } from "../../api/notification";
import {
  createPromotion,
  fetchPromotion,
  getGroupCustomerApi,
} from "../../api/promotion";
import { errorNotify } from "../../helper/toast";
import i18n from "../../i18n";
import { loadingAction } from "../../redux/actions/loading";
import { getLanguageState } from "../../redux/selectors/auth";
import { getProvince, getService } from "../../redux/selectors/service";
import CustomButton from "../customButton/customButton";
import CustomTextEditor from "../customTextEdittor";
import UploadImage from "../uploadImage";
import "./addPromotion.scss";
import InputCustom from "../textInputCustom";
dayjs.extend(customParseFormat);
const { TextArea } = Input;

const AddPromotion = (props) => {
  const {
    tab,
    startPage,
    setDataPromo,
    setTotalPromo,
    type,
    brand,
    idService,
    exchange,
    search,
    status,
    typeSort,
  } = props;
  const [state, setState] = useState(false);
  const [formDiscount, setFormDiscount] = useState("amount");
  const [discountUnit, setDiscountUnit] = useState("amount");
  const [dataGroupCustomer, setDataGroupCustomer] = useState([]);
  const [isGroupCustomer, setIsGroupCustomer] = useState(false);
  const [groupCustomer, setGroupCustomer] = useState([]);
  const [dataCustomer, setDataCustomer] = useState([]);
  const [isCustomer, setIsCustomer] = useState(false);
  const [customer, setCustomer] = useState([]);
  const [titleVN, setTitleVN] = useState("");
  const [titleEN, setTitleEN] = useState("");
  const [shortDescriptionVN, setShortDescriptionVN] = useState("");
  const [shortDescriptionEN, setShortDescriptionEN] = useState("");
  const [descriptionVN, setDescriptionVN] = useState("");
  const [descriptionEN, setDescriptionEN] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [promoType, setPromoType] = useState("order");
  const [unitPrice, setUnitPrice] = useState("");
  const [minimumOrder, setMinimumOrder] = useState();
  const [namebrand, setNamebrand] = useState("");
  const [codebrand, setCodebrand] = useState("");
  const [reducedValue, setReducedValue] = useState(0);
  const [maximumDiscount, setMaximumDiscount] = useState(0);
  const [limitedQuantity, setLimitedQuantity] = useState(false);
  const [amount, setAmount] = useState("");
  const [limitedDate, setLimitedDate] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isExchangePoint, setIsExchangePoint] = useState(false);
  const [exchangePoint, setExchangePoint] = useState("");
  const [isUsePromo, setIsUsePromo] = useState(false);
  const [usePromo, setUsePromo] = useState("");
  const [imgThumbnail, setImgThumbnail] = useState("");
  const [imgBackground, setImgBackground] = useState("");
  const [serviceApply, setServiceApply] = useState("");
  const [dateExchange, setDateExchange] = useState();
  const [position, setPosition] = useState(0);
  const [isPaymentMethod, setIsPaymentMethod] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState([]);
  const [data, setData] = useState([]);
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [listCustomers, setListCustomers] = useState([]);
  const [listNameCustomers, setListNameCustomers] = useState([]);
  const [isSendNotification, setIsSendNotification] = useState(false);
  const [titleNoti, setTitleNoti] = useState("");
  const [descriptionNoti, setDescriptionNoti] = useState("");
  const [imgNoti, setImgNoti] = useState("");
  const [isDateSchedule, setIsDateSchedule] = useState(true);
  const [dateSchedule, setDateSchedule] = useState("");
  const [isApplyTime, setIsApplyTime] = useState(false);
  const [timeApply, setTimeApply] = useState([
    {
      day_local: 0,
      start_time_local: "",
      end_time_local: "",
      timezone: "Asia/Ho_Chi_Minh",
    },
  ]);
  const [isParrentPromotion, setIsParrentPromotion] = useState(false);
  const [totalChildPromotion, setTotalChildPromotion] = useState();
  const [isShowInApp, setIsShowInApp] = useState(false);
  const [isApplyArea, setIsApplyArea] = useState(false);
  const [city, setCity] = useState([]);
  const [district, setDistrict] = useState([]);
  const lang = useSelector(getLanguageState);
  const options = [];
  const optionsCustomer = [];
  const serviceOption = [];
  const cityOption = [];
  const districtOption = [];
  const dispatch = useDispatch();
  const fomart = "HH:mm";
  const dateFormat = "DD-MM-YYYY";
  const service = useSelector(getService);
  const province = useSelector(getProvince);

  useEffect(() => {
    getGroupCustomerApi(0, 10)
      .then((res) => setDataGroupCustomer(res.data))
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    setServiceApply(service[0]?._id);
  }, [service]);

  province?.map((item) => {
    cityOption?.push({
      value: item?.code,
      label: item?.name,
      district: item?.districts,
    });
  });

  dataGroupCustomer.map((item, index) => {
    options.push({
      label: item?.name,
      value: item?._id,
    });
  });

  dataCustomer.map((item, index) => {
    optionsCustomer.push({
      label: item?.full_name,
      value: item?._id,
    });
  });

  service.map((item, index) => {
    serviceOption.push({
      label: item?.title?.[lang],
      value: item?._id,
    });
  });

  const onFormDiscount = (title) => {
    setFormDiscount(title);
    if (title === "amount") {
      setDiscountUnit("amount");
    } else {
      setDiscountUnit("percent");
    }
    // else {
    //   setDiscountUnit("same-price");
    // }
  };
  const handleChange = (value) => {
    setGroupCustomer(value);
  };

  const handleChangePaymentMethod = (value) => {
    setPaymentMethod(value);
  };

  const changeValue = (value) => {
    setName(value);
  };

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
      setId("");
    }, 500),
    []
  );

  const onChooseCustomer = (item) => {
    setId(item?._id);
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

  const addTimeApply = () => {
    setTimeApply((time) => [
      ...time,
      {
        day_local: 0,
        start_time_local: "",
        end_time_local: "",
        timezone: "Asia/Ho_Chi_Minh",
      },
    ]);
  };

  const deleteTimeApply = (index) => {
    timeApply.splice(index, 1);
    setTimeApply([...timeApply]);
  };

  const changeDayApply = (value, index) => {
    const arr = [...timeApply];
    timeApply[index].day_local = value;
    setTimeApply(arr);
  };

  const changeTimeStartApply = (value, index) => {
    const arr = [...timeApply];
    timeApply[index].start_time_local = value;
    setTimeApply(arr);
  };

  const changeTimeEndApply = (value, index) => {
    const arr = [...timeApply];
    timeApply[index].end_time_local = value;
    setTimeApply(arr);
  };

  const onCreatePromotion = useCallback(() => {
    dispatch(loadingAction.loadingRequest(true));

    createPromotion({
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
      code: promoCode ? promoCode : codebrand,
      is_limit_date: limitedDate,
      limit_start_date: limitedDate ? new Date(startDate).toISOString() : null,
      limit_end_date: limitedDate ? new Date(endDate).toISOString() : null,
      is_limit_count: limitedQuantity,
      limit_count: limitedQuantity ? amount : 0,
      is_id_group_customer: isGroupCustomer,
      id_group_customer: groupCustomer,
      is_id_customer: isCustomer,
      id_customer: listCustomers,
      service_apply: tab === "tat_ca" ? [serviceApply] : [idService],
      is_limited_use: isUsePromo,
      limited_use: isUsePromo ? usePromo : 0,
      type_discount: "order",
      type_promotion: "code",
      price_min_order: minimumOrder,
      discount_unit: discountUnit,
      discount_max_price: maximumDiscount,
      discount_value: reducedValue,
      is_delete: false,
      is_exchange_point: isExchangePoint,
      exchange_point: exchangePoint,
      brand: namebrand.toUpperCase(),
      exp_date_exchange: dateExchange,
      position: position,
      is_payment_method: isPaymentMethod,
      payment_method: paymentMethod,
      is_parrent_promotion: isParrentPromotion,
      total_child_promotion: totalChildPromotion,
      is_loop: isApplyTime,
      day_loop: isApplyTime ? timeApply : [],
      is_show_in_app: isShowInApp,
      is_apply_area: isApplyArea,
      city: city,
      district: district,
    })
      .then((res) => {
        if (isSendNotification) {
          createPushNotification({
            title: titleNoti,
            body: descriptionNoti,
            is_date_schedule: isDateSchedule,
            date_schedule: moment(dateSchedule).toISOString(),
            is_id_customer: isCustomer,
            id_customer: listCustomers,
            is_id_group_customer: isGroupCustomer,
            id_group_customer: groupCustomer,
            image_url: imgBackground,
          })
            .then(() => {
              dispatch(loadingAction.loadingRequest(false));
              setState(false);
              fetchPromotion(
                search,
                status,
                startPage,
                20,
                type,
                brand,
                idService,
                exchange,
                typeSort
              )
                .then((res) => {
                  setDataPromo(res?.data);
                  setTotalPromo(res?.totalItem);
                })
                .catch((err) => {});
            })
            .catch((err) => {
              errorNotify({
                message: err,
              });
              dispatch(loadingAction.loadingRequest(false));
            });
        } else {
          dispatch(loadingAction.loadingRequest(false));
          setState(false);
          fetchPromotion(
            search,
            status,
            startPage,
            20,
            type,
            brand,
            idService,
            exchange,
            typeSort
          )
            .then((res) => {
              setDataPromo(res?.data);
              setTotalPromo(res?.totalItem);
            })
            .catch((err) => {});
        }
      })
      .catch((err) => {
        if (isParrentPromotion) {
          setState(false);
          fetchPromotion(
            search,
            status,
            startPage,
            20,
            type,
            brand,
            idService,
            exchange,
            typeSort
          )
            .then((res) => {
              setDataPromo(res?.data);
              setTotalPromo(res?.totalItem);
            })
            .catch((err) => {});
          dispatch(loadingAction.loadingRequest(false));
        } else {
          errorNotify({
            message: err,
          });
          dispatch(loadingAction.loadingRequest(false));
        }
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
    codebrand,
    limitedDate,
    startDate,
    endDate,
    limitedQuantity,
    amount,
    isGroupCustomer,
    groupCustomer,
    isCustomer,
    customer,
    isUsePromo,
    usePromo,
    promoType,
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
    position,
    isPaymentMethod,
    paymentMethod,
    idService,
    listCustomers,
    isSendNotification,
    titleNoti,
    descriptionNoti,
    isDateSchedule,
    dateSchedule,
    isParrentPromotion,
    totalChildPromotion,
    isApplyTime,
    timeApply,
    type,
    brand,
    idService,
    exchange,
    startPage,
    isShowInApp,
    isApplyArea,
    city,
    district,
    search,
    status,
    typeSort,
  ]);

  return (
    <>
      {/* Button trigger modal */}
      <CustomButton
        title={`${i18n.t("add_promotion", { lng: lang })}`}
        className="btn-add-promotion"
        type="button"
        onClick={() => setState(!state)}
      />

      {/* Modal */}
      <Modal
        centered
        open={state}
        width={1200}
        onCancel={() => setState(!state)}
        footer={null}
        title={`${i18n.t("add_promotion", { lng: lang })}`}
      >
        <div className="modal-body">
          <Row>
            <Col span={8}>
              <div>
                <a className="title-add-promo">
                  1. {`${i18n.t("title", { lng: lang })}`}
                </a>
                <InputCustom
                  title={`${i18n.t("vietnamese", { lng: lang })}`}
                  value={titleVN}
                  onChange={(e) => setTitleVN(e.target.value)}
                />
                <InputCustom
                  title={`${i18n.t("english", { lng: lang })}`}
                  value={titleEN}
                  onChange={(e) => setTitleEN(e.target.value)}
                  style={{ marginTop: 5 }}
                />
              </div>
              <div className="mt-2">
                <a className="title-add-promo">
                  2. {`${i18n.t("describe", { lng: lang })}`}
                </a>
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
                  style={{ marginTop: 5 }}
                  textArea={true}
                />
              </div>
              <div className="mt-2">
                <a className="title-add-promo">
                  3. {`${i18n.t("detailed_description", { lng: lang })}`}
                </a>
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
            </Col>
            <Col span={8} className="ml-3">
              <div>
                <a className="title-add-promo">4. Thumbnail/Background</a>
                <UploadImage
                  title={"Thumbnail 160px * 170px"}
                  image={imgThumbnail}
                  setImage={setImgThumbnail}
                  classImg={"img-thumbnail"}
                />

                <UploadImage
                  title={"Background 414px * 200px"}
                  image={imgBackground}
                  setImage={setImgBackground}
                  classImg={"img-background"}
                />
              </div>
              <div className="mt-2">
                <a className="title-add-promo">
                  5. {`${i18n.t("promotion_code", { lng: lang })}`}
                </a>
                <Input
                  placeholder={`${i18n.t("placeholder", { lng: lang })}`}
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                />
              </div>
              <div className="mt-2">
                <a className="title-add-promo">
                  6. {`${i18n.t("minimum_order_price", { lng: lang })}`}
                </a>
                <InputNumber
                  formatter={(value) =>
                    `${value}  đ`.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")
                  }
                  min={0}
                  value={minimumOrder}
                  onChange={(e) => setMinimumOrder(e)}
                  style={{ width: "100%" }}
                />
              </div>

              <div className="mt-2">
                <a className="title-add-promo">
                  7. {`${i18n.t("discount_form", { lng: lang })}`}
                </a>
                <Row>
                  <Button
                    className={
                      discountUnit === "amount"
                        ? "btn-form-amount-promotion"
                        : "btn-form-amount-promotion-default"
                    }
                    outline
                    onClick={() => onFormDiscount("amount")}
                  >
                    {`${i18n.t("direct_discount", { lng: lang })}`}
                  </Button>
                  <Button
                    className={
                      discountUnit === "percent"
                        ? "btn-form-amount-promotion"
                        : "btn-form-amount-promotion-default"
                    }
                    outline
                    onClick={() => onFormDiscount("percent")}
                  >
                    {`${i18n.t("percentage_discount", { lng: lang })}`}
                  </Button>
                  {discountUnit === "amount" ? (
                    <div className="ml-3">
                      <a>{`${i18n.t("reduced_price", { lng: lang })}`}</a>
                      <InputNumber
                        formatter={(value) =>
                          `${value}  đ`.replace(
                            /(\d)(?=(\d\d\d)+(?!\d))/g,
                            "$1,"
                          )
                        }
                        min={0}
                        value={maximumDiscount}
                        onChange={(e) => setMaximumDiscount(e)}
                        style={{ width: "100%" }}
                      />
                    </div>
                  ) : (
                    <Row className="row-discount">
                      <div className="div-reduced ml-2">
                        <a>{`${i18n.t("reduced_value", { lng: lang })}`}</a>
                        <InputNumber
                          min={0}
                          max={100}
                          formatter={(value) => `${value} %`}
                          parser={(value) => value.replace("%", "")}
                          value={reducedValue}
                          onChange={(e) => setReducedValue(e)}
                          style={{ width: "90%" }}
                        />
                      </div>
                      <div className="div-reduced">
                        <a>{`${i18n.t("discount_max", { lng: lang })}`}</a>
                        <InputNumber
                          formatter={(value) =>
                            `${value}  đ`.replace(
                              /(\d)(?=(\d\d\d)+(?!\d))/g,
                              "$1,"
                            )
                          }
                          min={0}
                          value={maximumDiscount}
                          onChange={(e) => setMaximumDiscount(e)}
                          style={{ width: "90%" }}
                        />
                      </div>
                    </Row>
                  )}
                </Row>
              </div>
              {tab === "tat_ca" && (
                <div className="mt-2">
                  <a className="title-add-promo">
                    9. {`${i18n.t("apply_service", { lng: lang })}`}
                  </a>
                  <Select
                    style={{ width: "100%" }}
                    onChange={(e) => {
                      setServiceApply(e);
                    }}
                    options={serviceOption}
                  />
                </div>
              )}
              <div className="mt-2">
                <a className="title-add-promo">
                  10. {`${i18n.t("applicable_object", { lng: lang })}`}
                </a>
                <div>
                  <Checkbox
                    checked={isGroupCustomer}
                    onChange={(e) => setIsGroupCustomer(e.target.checked)}
                  >
                    {`${i18n.t("customer_group", { lng: lang })}`}
                  </Checkbox>
                  {isGroupCustomer && (
                    <Select
                      mode="multiple"
                      allowClear
                      style={{
                        width: "100%",
                      }}
                      placeholder="Please select"
                      onChange={handleChange}
                      options={options}
                    />
                  )}
                </div>
                <div>
                  <Checkbox
                    checked={isCustomer}
                    onChange={(e) => setIsCustomer(e.target.checked)}
                  >
                    {`${i18n.t("customer_apply", { lng: lang })}`}
                  </Checkbox>
                  {isCustomer && (
                    <div>
                      <Input
                        placeholder={`${i18n.t("search", { lng: lang })}`}
                        value={name}
                        onChange={(e) => {
                          changeValue(e.target.value);
                          searchCustomer(e.target.value);
                        }}
                      />
                      {data.length > 0 && (
                        <List type={"unstyled"} className="list-item-kh">
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
                                  <i
                                    class="uil uil-times-circle"
                                    onClick={() => removeItemCustomer(item)}
                                  ></i>
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
            </Col>
            <Col span={7} className="ml-3">
              <div>
                <a className="title-add-promo">
                  11. {`${i18n.t("number_promo", { lng: lang })}`}
                </a>
                <div>
                  <Checkbox
                    checked={limitedQuantity}
                    onChange={(e) => setLimitedQuantity(e.target.checked)}
                  >
                    {`${i18n.t("limited_quantity", { lng: lang })}`}
                  </Checkbox>
                  {limitedQuantity && (
                    <Input
                      className="input-promo-code"
                      type="number"
                      min={0}
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                    />
                  )}
                </div>
              </div>
              <div className="mt-2">
                <a className="title-add-promo">
                  12. {`${i18n.t("number_use_promotion", { lng: lang })}`}
                </a>
                <div>
                  <Checkbox
                    checked={isUsePromo}
                    onChange={(e) => setIsUsePromo(e.target.checked)}
                  >
                    {`${i18n.t("promo_use_time", { lng: lang })}`}
                  </Checkbox>
                  {isUsePromo && (
                    <Input
                      className="input-promo-code"
                      min={0}
                      type="number"
                      value={usePromo}
                      onChange={(e) => setUsePromo(e.target.value)}
                    />
                  )}
                </div>
              </div>
              <div className="mt-2">
                <a className="title-add-promo">
                  13. {`${i18n.t("promotion_time", { lng: lang })}`}
                </a>
                <div>
                  <Checkbox
                    checked={limitedDate}
                    onChange={(e) => setLimitedDate(e.target.checked)}
                  >
                    {`${i18n.t("limit_date", { lng: lang })}`}
                  </Checkbox>
                  {limitedDate && (
                    <>
                      <div>
                        <a>{`${i18n.t("start_date", { lng: lang })}`}</a>
                        <DatePicker
                          onChange={(date, dateString) =>
                            setStartDate(dateString)
                          }
                          style={{ marginLeft: 5, width: "100%" }}
                        />
                      </div>
                      <div>
                        <a>{`${i18n.t("end_date", { lng: lang })}`}</a>
                        <DatePicker
                          onChange={(date, dateString) =>
                            setEndDate(dateString)
                          }
                          style={{ marginLeft: 5, width: "100%" }}
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>
              <div className="mt-2">
                <a className="title-add-promo">
                  14. {`${i18n.t("redemption_points", { lng: lang })}`}
                </a>
                <div>
                  <Checkbox
                    checked={isExchangePoint}
                    onChange={(e) => setIsExchangePoint(e.target.checked)}
                  >
                    {`${i18n.t("redemption_points", { lng: lang })}`}
                  </Checkbox>
                  {isExchangePoint && (
                    <Input
                      type="number"
                      min={0}
                      value={exchangePoint}
                      onChange={(e) => setExchangePoint(e.target.value)}
                    />
                  )}
                </div>
              </div>
              <div className="mt-2">
                <a className="title-add-promo">
                  15. {`${i18n.t("payment_method", { lng: lang })}`}
                </a>
                <div>
                  <Checkbox
                    checked={isPaymentMethod}
                    onChange={(e) => setIsPaymentMethod(e.target.checked)}
                  >
                    {`${i18n.t("payment", { lng: lang })}`}
                  </Checkbox>
                  {isPaymentMethod && (
                    <Select
                      mode="multiple"
                      allowClear
                      style={{
                        width: "100%",
                      }}
                      placeholder="Please select"
                      onChange={handleChangePaymentMethod}
                      options={DATA_PAYMENT}
                    />
                  )}
                </div>
              </div>
              {isExchangePoint && (
                <div className="mt-2">
                  <a className="title-add-promo">
                    16.{" "}
                    {`${i18n.t("usage_time_after_exchange", { lng: lang })}`}
                  </a>
                  <Input
                    className="input-promo-code"
                    type="number"
                    min={0}
                    value={dateExchange}
                    onChange={(e) => setDateExchange(e.target.value)}
                  />{" "}
                </div>
              )}

              <div className="mt-2">
                <a className="title-add-promo">
                  17. {`${i18n.t("position", { lng: lang })}`}
                </a>
                <Input
                  placeholder="Nhập số thứ tự (1,2,3...,n"
                  className="input-promo-code"
                  type="number"
                  min={0}
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                />
              </div>
              <div className="mt-2">
                <div>
                  <a className="title-add-promo">
                    18. {`${i18n.t("send_notifications", { lng: lang })}`}
                  </a>
                  <Checkbox
                    checked={isSendNotification}
                    onChange={(e) => setIsSendNotification(e.target.checked)}
                    style={{ marginLeft: 5 }}
                  />
                </div>

                {isSendNotification && (
                  <div>
                    <InputCustom
                      title={`${i18n.t("title", { lng: lang })}`}
                      className="input-promo-code mt-2"
                      type="text"
                      value={titleNoti}
                      onChange={(e) => setTitleNoti(e.target.value)}
                    />
                    <InputCustom
                      title={`${i18n.t("describe", { lng: lang })}`}
                      className="input-promo-code"
                      type="textarea"
                      value={descriptionNoti}
                      onChange={(e) => setDescriptionNoti(e.target.value)}
                      style={{ marginTop: 5 }}
                    />

                    <div>
                      <Checkbox
                        checked={isDateSchedule}
                        onChange={(e) => setIsDateSchedule(e.target.checked)}
                      >
                        {`${i18n.t("time_notification", { lng: lang })}`}
                      </Checkbox>
                      {isDateSchedule && (
                        <Input
                          type="datetime-local"
                          value={dateSchedule}
                          onChange={(e) => setDateSchedule(e.target.value)}
                        />
                      )}
                    </div>
                  </div>
                )}
              </div>
              <div className="mt-2">
                <div>
                  <a className="title-add-promo">
                    19. {`${i18n.t("various_promotions", { lng: lang })}`}
                  </a>
                  <Checkbox
                    checked={isParrentPromotion}
                    onChange={(e) => setIsParrentPromotion(e.target.checked)}
                    style={{ marginLeft: 5 }}
                  ></Checkbox>
                </div>
                {isParrentPromotion && (
                  <Input
                    className="input-promo-code mt-2"
                    type="number"
                    value={totalChildPromotion}
                    onChange={(e) =>
                      setTotalChildPromotion(Number.parseInt(e.target.value))
                    }
                  />
                )}
              </div>
              <div className="div-loop-time">
                <div>
                  <a className="title-add-promo">
                    20. {`${i18n.t("time_apply", { lng: lang })}`}
                  </a>
                  <Checkbox
                    checked={isApplyTime}
                    onChange={(e) => setIsApplyTime(e.target.checked)}
                    style={{ marginLeft: 5 }}
                  />
                </div>
                {isApplyTime && (
                  <div className="mb-3">
                    {timeApply.map((item, index) => {
                      return (
                        <div key={index} className="div-body-loop">
                          {index !== 0 && (
                            <div
                              className="btn-close-day"
                              onClick={() => deleteTimeApply(index)}
                            >
                              <i class="uil uil-multiply"></i>
                            </div>
                          )}
                          <div className="div-body-loop-time">
                            <div className="div-day-time">
                              {date.map((it, i) => {
                                return (
                                  <div
                                    key={i}
                                    className={
                                      item.day_local === it.value
                                        ? "div-day-select"
                                        : "div-day"
                                    }
                                    onClick={() =>
                                      changeDayApply(it.value, index)
                                    }
                                  >
                                    <a className="text-day">
                                      {it?.title?.[lang]}
                                    </a>
                                  </div>
                                );
                              })}
                            </div>
                            <a>{`${i18n.t("start_time", { lng: lang })}`}</a>
                            <TimePicker
                              defaultValue={dayjs("00:00", fomart)}
                              format={fomart}
                              onChange={(time, timeString) =>
                                changeTimeStartApply(timeString, index)
                              }
                              allowClear={false}
                            />
                            <a>{`${i18n.t("end_time", { lng: lang })}`}</a>
                            <TimePicker
                              defaultValue={dayjs("00:00", fomart)}
                              format={fomart}
                              onChange={(time, timeString) =>
                                changeTimeEndApply(timeString, index)
                              }
                              allowClear={false}
                            />
                          </div>
                        </div>
                      );
                    })}
                    <div className="btn-add-day" onClick={addTimeApply}>
                      <i class="uil uil-plus"></i>
                    </div>
                  </div>
                )}
              </div>

              <div className="div-check-show-app">
                <a className="title-check">
                  21. {`${i18n.t("show_code_app", { lng: lang })}`}
                </a>
                <Checkbox
                  onChange={(e) => {
                    setIsShowInApp(e.target.checked);
                  }}
                  checked={isShowInApp}
                  style={{ marginLeft: 5 }}
                />
              </div>

              <div>
                <div>
                  <a className="title-add-promo">22. Áp dụng khu vực</a>
                  <Checkbox
                    checked={isApplyArea}
                    onChange={(e) => setIsApplyArea(e.target.checked)}
                    style={{ marginLeft: 5 }}
                  />
                </div>
                {isApplyArea && (
                  <div>
                    <Select
                      mode="multiple"
                      allowClear
                      style={{ width: "100%" }}
                      onChange={(e, label) => {
                        setCity(e);
                      }}
                      options={cityOption}
                      optionLabelProp="label"
                    />
                  </div>
                )}
              </div>

              <Button
                className="btn-create-promotion mt-5"
                onClick={onCreatePromotion}
              >
                {`${i18n.t("add_promotion", { lng: lang })}`}
              </Button>
            </Col>
          </Row>
        </div>
      </Modal>
    </>
  );
};

export default memo(AddPromotion);
