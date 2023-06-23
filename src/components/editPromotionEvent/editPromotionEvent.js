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
import {
  fetchPromotion,
  getGroupCustomerApi,
  getPromotionDetails,
  updatePromotion,
} from "../../api/promotion";
import { errorNotify } from "../../helper/toast";
import { loadingAction } from "../../redux/actions/loading";
import { getService } from "../../redux/selectors/service";
import CustomTextEditor from "../customTextEdittor";
import "./editPromotionEvent.scss";
import { getLanguageState } from "../../redux/selectors/auth";
import InputCustom from "../textInputCustom";
import i18n from "../../i18n";
dayjs.extend(customParseFormat);

const EditPromotionEvent = (props) => {
  const {
    state,
    setState,
    data,
    startPage,
    setDataPromo,
    setTotalPromo,
    type,
    brand,
    exchange,
    idService,
    tab,
  } = props;
  const [formPromorion, setFormPromotion] = useState("Mã khuyến mãi");
  const [typePromotion, setTypePromotion] = useState("code");
  const [formDiscount, setFormDiscount] = useState("amount");
  const [discountUnit, setDiscountUnit] = useState("amount");
  const [create, setCreate] = useState(false);
  const [dataGroupCustomer, setDataGroupCustomer] = useState([]);
  const [isGroupCustomer, setIsGroupCustomer] = useState(false);
  const [groupCustomer, setGroupCustomer] = useState([]);
  const [dataCustomer, setDataCustomer] = useState([]);
  const [isCustomer, setIsCustomer] = useState(false);
  const [customer, setCustomer] = useState([]);
  const [titleVN, setTitleVN] = useState(data?.title?.vi);
  const [titleEN, setTitleEN] = useState(data?.title?.en);
  const [shortDescriptionVN, setShortDescriptionVN] = useState("");
  const [shortDescriptionEN, setShortDescriptionEN] = useState("");
  const [descriptionVN, setDescriptionVN] = useState("");
  const [descriptionEN, setDescriptionEN] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [promoType, setPromoType] = useState("order");
  const [unitPrice, setUnitPrice] = useState("");
  const [minimumOrder, setMinimumOrder] = useState("");
  const [namebrand, setNamebrand] = useState("");
  const [codebrand, setCodebrand] = useState("");
  const [reducedValue, setReducedValue] = useState();
  const [maximumDiscount, setMaximumDiscount] = useState();
  const [orderFirst, setOrderFirst] = useState(false);
  const [limitedQuantity, setLimitedQuantity] = useState(false);
  const [amount, setAmount] = useState("");
  const [limitedDate, setLimitedDate] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isExchangePoint, setIsExchangePoint] = useState(false);
  const [exchangePoint, setExchangePoint] = useState("");
  const [isUsePromo, setIsUsePromo] = useState(false);
  const [usePromo, setUsePromo] = useState("");
  const [serviceApply, setServiceApply] = useState("");
  const [isPaymentMethod, setIsPaymentMethod] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState([]);
  const [position, setPosition] = useState(0);
  const [dataL, setDataL] = useState([]);
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [listCustomers, setListCustomers] = useState([]);
  const [listNameCustomers, setListNameCustomers] = useState([]);
  const [isApplyTime, setIsApplyTime] = useState(false);
  const [timeApply, setTimeApply] = useState([
    {
      day_local: 0,
      start_time_local: "",
      end_time_local: "",
      timezone: "Asia/Ho_Chi_Minh",
    },
  ]);
  const options = [];
  const optionsCustomer = [];
  const serviceOption = [];
  const fomart = "HH:mm";
  const dateFormat = "YYYY-MM-DD";
  const dispatch = useDispatch();
  const service = useSelector(getService);
  const lang = useSelector(getLanguageState);

  useEffect(() => {
    getGroupCustomerApi(0, 10)
      .then((res) => setDataGroupCustomer(res.data))
      .catch((err) => console.log(err));
  }, []);

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
      label: item?.title?.vi,
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
    //   setDiscountUnit("same_price");
    // }
  };
  const handleChange = (value) => {
    setGroupCustomer(value);
  };

  const handleChangeCustomer = (value) => {
    setCustomer(value);
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
              setDataL([]);
            } else {
              setDataL(res.data);
            }
          })
          .catch((err) => console.log(err));
      } else {
        setDataL([]);
      }
      setId("");
    }, 500),
    []
  );

  useEffect(() => {
    getPromotionDetails(data?._id)
      .then((res) => {
        setTitleVN(res?.title?.vi);
        setTitleEN(res?.title?.en);
        setShortDescriptionVN(res?.short_description?.vi);
        setShortDescriptionEN(res?.short_description?.en);
        setDescriptionVN(res?.description?.vi);
        setDescriptionEN(res?.description?.en);
        setCodebrand(res?.code);
        setLimitedDate(res?.is_limit_date);
        setStartDate(res?.is_limit_date ? res?.limit_start_date : "");
        setEndDate(res?.is_limit_date ? res?.limit_end_date : "");
        setLimitedQuantity(res?.is_limit_count);
        setAmount(res?.limit_count);
        setIsGroupCustomer(res?.is_id_group_customer);
        setGroupCustomer(res?.id_group_customer);
        setIsCustomer(res?.is_id_customer);
        setCustomer(res?.id_customer);
        setListNameCustomers(res?.id_customer);
        setIsUsePromo(res?.is_limited_use);
        setUsePromo(res?.limited_use);
        setPromoType(res?.type_discount);
        setTypePromotion(res?.type_promotion);
        setDiscountUnit(res?.discount_unit);
        setMaximumDiscount(res?.discount_max_price);
        setReducedValue(res?.discount_value);
        setIsExchangePoint(res?.is_exchange_point);
        setExchangePoint(res?.exchange_point);
        setNamebrand(res?.brand);
        setPromoCode(res?.code);
        setServiceApply(res?.service_apply[0]);
        setMinimumOrder(res?.price_min_order);
        setIsPaymentMethod(res?.is_payment_method);
        setPaymentMethod(res?.payment_method);
        setPosition(res?.position);
        res?.id_customer?.map((item) => {
          listCustomers.push(item?._id);
        });
        setIsApplyTime(res?.is_loop);
        setTimeApply(res?.day_loop);
      })
      .catch((err) => console.log(err));
  }, [data]);

  const onChooseCustomer = (item) => {
    setId(item?._id);
    setName("");
    setDataL([]);
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
        start_time_local: "00:00:00",
        end_time_local: "00:00:00",
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

  const onEditPromotion = useCallback(() => {
    dispatch(loadingAction.loadingRequest(true));
    updatePromotion(data?._id, {
      title: {
        vi: titleVN,
        en: titleEN,
      },
      short_description: {
        vi: "",
        en: "",
      },
      description: {
        vi: descriptionVN,
        en: descriptionEN,
      },
      thumbnail: "",
      image_background: "",
      code: promoCode,
      is_limit_date: limitedDate,
      limit_start_date: limitedDate ? startDate : null,
      limit_end_date: limitedDate ? endDate : null,
      is_limit_count: limitedQuantity,
      limit_count: limitedQuantity ? amount : 0,
      is_id_group_customer: isGroupCustomer,
      id_group_customer: groupCustomer,
      is_id_customer: isCustomer,
      id_customer: id,
      service_apply: [serviceApply],
      is_limited_use: isUsePromo,
      limited_use: isUsePromo ? usePromo : 0,
      type_discount: "order",
      type_promotion: "event",
      price_min_order: minimumOrder,
      discount_unit: discountUnit,
      discount_max_price: maximumDiscount,
      discount_value: reducedValue,
      is_delete: false,
      is_exchange_point: false,
      exchange_point: 0,
      brand: namebrand.toUpperCase(),
      exp_date_exchange: 0,
      position: position,
      is_payment_method: isPaymentMethod,
      payment_method: paymentMethod,
      is_loop: isApplyTime,
      day_loop: isApplyTime ? timeApply : [],
    })
      .then((res) => {
        dispatch(loadingAction.loadingRequest(false));
        setState(false);
        fetchPromotion(startPage, 20, type, brand, idService, exchange)
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
  }, [
    titleVN,
    titleEN,
    descriptionVN,
    descriptionEN,
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
    discountUnit,
    namebrand,
    maximumDiscount,
    reducedValue,
    serviceApply,
    promoCode,
    minimumOrder,
    isPaymentMethod,
    paymentMethod,
    id,
    position,
    isApplyTime,
    timeApply,
  ]);

  return (
    <>
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
                  2. {`${i18n.t("detailed_description", { lng: lang })}`}
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
                <a className="title-add-promo">
                  3. {`${i18n.t("minimum_order_price", { lng: lang })}`}
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
                  4. {`${i18n.t("discount_form", { lng: lang })}`}
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
                      <div className="div-reduced ml-4">
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
                    5. {`${i18n.t("apply_service", { lng: lang })}`}
                  </a>
                  <Select
                    style={{ width: "100%" }}
                    value={serviceApply}
                    onChange={(e) => {
                      setServiceApply(e);
                    }}
                    options={serviceOption}
                  />
                </div>
              )}
              <div className="mt-2">
                <a className="title-add-promo">
                  6. {`${i18n.t("applicable_object", { lng: lang })}`}
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
                      value={groupCustomer}
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
                        placeholder="Tìm kiếm theo tên và số điện thoại"
                        value={name}
                        onChange={(e) => {
                          changeValue(e.target.value);
                          searchCustomer(e.target.value);
                        }}
                      />
                      {dataL.length > 0 && (
                        <List type={"unstyled"} className="list-item-kh">
                          {dataL?.map((item, index) => {
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
                  7. {`${i18n.t("number_promo", { lng: lang })}`}
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
                  8. {`${i18n.t("number_use_promotion", { lng: lang })}`}
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
                  9. {`${i18n.t("promotion_time", { lng: lang })}`}
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
                            setStartDate(
                              moment(moment(date?.$d).toISOString())
                                .add("hours", 7)
                                .toISOString()
                            )
                          }
                          style={{ marginLeft: 5, width: "100%" }}
                          format={dateFormat}
                          value={
                            startDate
                              ? dayjs(startDate?.slice(0, 11), dateFormat)
                              : ""
                          }
                          allowClear={false}
                        />
                      </div>
                      <div>
                        <a>{`${i18n.t("end_date", { lng: lang })}`}</a>
                        <DatePicker
                          onChange={(date, dateString) =>
                            setEndDate(
                              moment(moment(date?.$d).toISOString())
                                .add("hours", 7)
                                .toISOString()
                            )
                          }
                          style={{ marginLeft: 5, width: "100%" }}
                          format={dateFormat}
                          value={
                            endDate
                              ? dayjs(endDate?.slice(0, 11), dateFormat)
                              : ""
                          }
                          allowClear={false}
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>
              <div className="mt-2">
                <a className="title-add-promo">
                  10. {`${i18n.t("payment_method", { lng: lang })}`}
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
              <div className="mt-2">
                <a className="title-add-promo">11. Thứ tự hiện thị</a>
                <Input
                  placeholder="Nhập số thứ tự (1,2,3...,n"
                  className="input-promo-code"
                  type="number"
                  min={0}
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                />
              </div>
              <div className="div-loop-time">
                <div>
                  <a className="title-add-promo">
                    12. {`${i18n.t("time_apply", { lng: lang })}`}
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
                              value={dayjs(item?.start_time_local, fomart)}
                              format={fomart}
                              onChange={(time, timeString) =>
                                changeTimeStartApply(timeString, index)
                              }
                              allowClear={false}
                            />
                            <a>{`${i18n.t("end_time", { lng: lang })}`}</a>
                            <TimePicker
                              value={dayjs(item?.end_time_local, fomart)}
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

              <Button
                className="btn-edit-promotion-orther mt-5"
                color="warning"
                onClick={onEditPromotion}
              >
                {`${i18n.t("edit_promotion", { lng: lang })}`}
              </Button>
            </Col>
          </Row>
        </div>
      </Modal>
    </>
  );
};

export default memo(EditPromotionEvent);
