import {
  Checkbox,
  DatePicker,
  Input,
  InputNumber,
  List,
  Select,
  TimePicker,
} from "antd";
import _debounce from "lodash/debounce";
import React, { memo, useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Col, FormGroup, Label, Modal, Row } from "reactstrap";
import { searchCustomers, searchCustomersApi } from "../../api/customer";
import { DATA_PAYMENT, date } from "../../api/fakeData";
import { postFile } from "../../api/file";
import {
  createPromotion,
  fetchPromotion,
  getGroupCustomerApi,
} from "../../api/promotion";
import resizeFile from "../../helper/resizer";
import { errorNotify } from "../../helper/toast";
import { loadingAction } from "../../redux/actions/loading";
import { getService } from "../../redux/selectors/service";
import CustomTextInput from "../CustomTextInput/customTextInput";
import CustomButton from "../customButton/customButton";

import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { createPushNotification } from "../../api/notification";
import CustomTextEditor from "../customTextEdittor";
import "./addPromotionEvent.scss";
dayjs.extend(customParseFormat);

const AddPromotionEvent = (props) => {
  const {
    idService,
    tab,
    startPage,
    setDataPromo,
    setTotalPromo,
    type,
    brand,
    exchange,
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
  const [descriptionVN, setDescriptionVN] = useState("");
  const [descriptionEN, setDescriptionEN] = useState("");
  const [promoCode, setPromoCode] = useState("");
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
  const [isUsePromo, setIsUsePromo] = useState(false);
  const [usePromo, setUsePromo] = useState("");
  const [serviceApply, setServiceApply] = useState("");
  const [isPaymentMethod, setIsPaymentMethod] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState([]);
  const [position, setPosition] = useState(0);
  const [isSendNotification, setIsSendNotification] = useState(false);
  const [titleNoti, setTitleNoti] = useState("");
  const [descriptionNoti, setDescriptionNoti] = useState("");
  const [imgNoti, setImgNoti] = useState("");
  const [listCustomers, setListCustomers] = useState([]);
  const [listNameCustomers, setListNameCustomers] = useState([]);
  const [data, setData] = useState([]);
  const [id, setId] = useState("");
  const [name, setName] = useState("");
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

  const options = [];
  const optionsCustomer = [];
  const serviceOption = [];
  const dispatch = useDispatch();
  const fomart = "HH:mm";
  const service = useSelector(getService);

  useEffect(() => {
    getGroupCustomerApi(0, 10)
      .then((res) => setDataGroupCustomer(res.data))
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    setServiceApply(service[0]?._id);
  }, [service]);

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
    //   setDiscountUnit("same-price");
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
        if (isSendNotification) {
          createPushNotification({
            title: titleNoti,
            body: descriptionNoti,
            is_date_schedule: isDateSchedule,
            date_schedule: dateSchedule,
            is_id_customer: isCustomer,
            id_customer: listCustomers,
            is_id_group_customer: isGroupCustomer,
            id_group_customer: groupCustomer,
            image_url: "",
          })
            .then(() => {
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
        } else {
          dispatch(loadingAction.loadingRequest(false));
          setState(false);
          fetchPromotion(startPage, 20, type, brand, idService, exchange)
            .then((res) => {
              setDataPromo(res?.data);
              setTotalPromo(res?.totalItem);
            })
            .catch((err) => {});
        }
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
    position,
    idService,
    listCustomers,
    isSendNotification,
    titleNoti,
    descriptionNoti,
    isDateSchedule,
    dateSchedule,
    isApplyTime,
    timeApply,
    type,
    brand,
    idService,
    exchange,
    startPage,
  ]);

  return (
    <>
      {/* Button trigger modal */}
      <CustomButton
        title="Thêm khuyến mãi"
        className="btn-add-promotion"
        type="button"
        onClick={() => setState(!state)}
      />

      {/* Modal */}
      <Modal
        fullscreen={true}
        fade={true}
        isOpen={state}
        size="lg"
        style={{ maxWidth: "1200px", width: "100%" }}
        toggle={() => setState(!state)}
      >
        <div className="modal-header">
          <a className="modal-title">Thêm chương trình khuyến mãi</a>
          <button className="btn-close" onClick={() => setState(!state)}>
            <i className="uil uil-times-square"></i>
          </button>
        </div>
        <div className="modal-body">
          <Row>
            <Col md={4}>
              <div>
                <a className="title-add-promo">1. Tiêu đề</a>
                <Input
                  placeholder="Nhập tiêu đề tiếng việt"
                  value={titleVN}
                  onChange={(e) => setTitleVN(e.target.value)}
                />
                <Input
                  placeholder="Nhập tiêu đề tiếng anh"
                  value={titleEN}
                  onChange={(e) => setTitleEN(e.target.value)}
                  style={{ marginTop: 5 }}
                />
              </div>
              <div>
                <a className="title-add-promo">2. Mô tả chi tiết</a>
                <div>
                  <a>Tiếng Việt</a>
                  <CustomTextEditor
                    value={descriptionVN}
                    onChangeValue={setDescriptionVN}
                  />
                </div>
                <div className="mt-2">
                  <a>Tiếng Anh</a>
                  <CustomTextEditor
                    value={descriptionEN}
                    onChangeValue={setDescriptionEN}
                  />
                </div>
              </div>
            </Col>
            <Col md={4}>
              <div>
                <a className="title-add-promo">3. Giá đơn đặt tối thiểu</a>
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
                <a className="title-add-promo">4. Hình thức giảm giá</a>
                <Row>
                  <Button
                    className={
                      discountUnit === "amount"
                        ? "btn-form-same-promotion"
                        : "btn-form-same-promotion-default"
                    }
                    outline
                    onClick={() => onFormDiscount("amount")}
                  >
                    Giảm trực tiếp
                  </Button>
                  <Button
                    className={
                      discountUnit === "percent"
                        ? "btn-form-same-promotion"
                        : "btn-form-same-promotion-default"
                    }
                    outline
                    onClick={() => onFormDiscount("percent")}
                  >
                    Giảm theo phần trăm
                  </Button>
                  {
                    discountUnit === "amount" ? (
                      <div className="ml-3">
                        <a>Giá giảm</a>
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
                          <a>Giá trị giảm</a>
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
                          <a>Giá giảm tối đa</a>
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
                    )
                    // ) : (
                    //   <CustomTextInput
                    //     label={"Đơn giá"}
                    //     placeholder="Nhập đơn giá"
                    //     classNameForm="input-promo-amount"
                    //     type="number"
                    //     min={0}
                    //     value={maximumDiscount}
                    //     onChange={(e) => setMaximumDiscount(e.target.value)}
                    //   />
                    // )
                  }
                </Row>
              </div>
              {tab === "tat_ca" && (
                <div className="mt-2">
                  <a className="title-add-promo">5. Dịch vụ áp dụng</a>

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
                <a className="title-add-promo">6. Đối tượng áp dụng</a>
                <div>
                  <Checkbox
                    checked={isGroupCustomer}
                    onChange={(e) => setIsGroupCustomer(e.target.checked)}
                  >
                    Nhóm khách hàng
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
                    Áp dụng cho khách hàng
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
            <Col md={4}>
              <div>
                <a className="title-add-promo">7. Số lượng mã khuyến mãi</a>
                <div>
                  <Checkbox
                    checked={limitedQuantity}
                    onChange={(e) => setLimitedQuantity(e.target.checked)}
                  >
                    Số lượng giới hạn
                  </Checkbox>
                  {limitedQuantity && (
                    <Input
                      placeholder="Số lượng"
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
                <a className="title-add-promo">8. Số lần sử dụng khuyến mãi</a>
                <div>
                  <Checkbox
                    checked={isUsePromo}
                    onChange={(e) => setIsUsePromo(e.target.checked)}
                  >
                    Lần sử dụng khuyến mãi
                  </Checkbox>
                  {isUsePromo && (
                    <Input
                      placeholder="Số lượng"
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
                <a className="title-add-promo">9. Thời gian khuyến mãi</a>
                <div>
                  <Checkbox
                    checked={limitedDate}
                    onChange={(e) => setLimitedDate(e.target.checked)}
                  >
                    Giới hạn ngày
                  </Checkbox>
                  {limitedDate && (
                    <>
                      <div>
                        <a>Ngày bắt đầu</a>
                        <DatePicker
                          onChange={(date, dateString) =>
                            setStartDate(dateString)
                          }
                          style={{ marginLeft: 5, width: "100%" }}
                        />
                      </div>
                      <div>
                        <a>Ngày kết thúc</a>
                        <DatePicker
                          onChange={(date, dateString) =>
                            setEndDate(dateString)
                          }
                          style={{ marginLeft: 5, width: "100%" }}
                        />
                        {/* <input
                              className="input-promo-code"
                              type={"date"}
                              defaultValue={startDate}
                              value={endDate}
                              onChange={(e) => setEndDate(e.target.value)}
                            /> */}
                      </div>
                    </>
                  )}
                </div>
              </div>
              <div className="mt-2">
                <a className="title-add-promo">10. Phương thức thanh toán</a>
                <div>
                  <Checkbox
                    checked={isPaymentMethod}
                    onChange={(e) => setIsPaymentMethod(e.target.checked)}
                  >
                    Thanh toán
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
              <div className="mt-2">
                <div>
                  <a className="title-add-promo">12. Gửi thông báo</a>
                  <Checkbox
                    checked={isSendNotification}
                    onChange={(e) => setIsSendNotification(e.target.checked)}
                    style={{ marginLeft: 5 }}
                  />
                </div>

                {isSendNotification && (
                  <div>
                    <Input
                      placeholder="Nhập tiêu đề thông báo"
                      className="input-promo-code mt-2"
                      type="text"
                      value={titleNoti}
                      onChange={(e) => setTitleNoti(e.target.value)}
                    />
                    <Input
                      placeholder="Nhập nội dung thông báo"
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
                        Thời gian thông báo
                      </Checkbox>
                      {isDateSchedule && (
                        <CustomTextInput
                          type="datetime-local"
                          name="time"
                          className="text-input mt-2"
                          value={dateSchedule}
                          onChange={(e) => setDateSchedule(e.target.value)}
                        />
                      )}
                    </div>
                  </div>
                )}
              </div>
              <div className="div-loop-time">
                <div>
                  <a className="title-add-promo">13. Thời gian áp dụng</a>
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
                                    <a className="text-day">{it?.title}</a>
                                  </div>
                                );
                              })}
                            </div>
                            <a>Thời gian bắt đầu</a>
                            <TimePicker
                              defaultOpenValue={dayjs("00:00:00", fomart)}
                              format={fomart}
                              onChange={(time, timeString) =>
                                changeTimeStartApply(timeString, index)
                              }
                            />
                            <a>Thời gian kết thúc</a>
                            <TimePicker
                              defaultOpenValue={dayjs("00:00:00", fomart)}
                              format={fomart}
                              onChange={(time, timeString) =>
                                changeTimeEndApply(timeString, index)
                              }
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
                className="btn_add mt-5 float-right"
                color="warning"
                onClick={onCreatePromotion}
              >
                Thêm khuyến mãi
              </Button>
            </Col>
          </Row>
        </div>
      </Modal>
    </>
  );
};

export default memo(AddPromotionEvent);
