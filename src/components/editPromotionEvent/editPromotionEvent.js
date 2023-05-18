import { List, Select, TimePicker } from "antd";
import _debounce from "lodash/debounce";
import React, { memo, useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  Col,
  Form,
  FormGroup,
  Input,
  Label,
  Modal,
  Row,
} from "reactstrap";
import { fetchCustomers, searchCustomers } from "../../api/customer";
import { DATA_PAYMENT, date } from "../../api/fakeData";
import {
  fetchPromotion,
  getGroupCustomerApi,
  getPromotionDetails,
  updatePromotion,
} from "../../api/promotion";
import { loadingAction } from "../../redux/actions/loading";
import { updatePromotionAction } from "../../redux/actions/promotion";
import { getService } from "../../redux/selectors/service";
import CustomTextInput from "../CustomTextInput/customTextInput";
import CustomTextEditor from "../customTextEdittor";
import "./editPromotionEvent.scss";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { errorNotify } from "../../helper/toast";
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

  const dispatch = useDispatch();
  const service = useSelector(getService);

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
        searchCustomers(0, 20, "", value)
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
        setStartDate(
          res?.is_limit_date
            ? res?.limit_start_date.slice(0, res?.limit_start_date.indexOf("T"))
            : ""
        );
        setEndDate(
          res?.is_limit_date
            ? res?.limit_end_date.slice(0, res?.limit_start_date.indexOf("T"))
            : ""
        );
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
      limit_start_date: limitedDate ? new Date(startDate).toISOString() : null,
      limit_end_date: limitedDate ? new Date(endDate).toISOString() : null,
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
        fetchPromotion(startPage, 10, type, brand, idService, exchange)
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
        fullscreen={true}
        fade={true}
        isOpen={state}
        size="lg"
        style={{ maxWidth: "1200px", width: "100%" }}
        toggle={() => setState(!state)}
      >
        <div className="modal-header">
          <h3 className="modal-title" id="exampleModalLabel">
            Sửa chương trình khuyến mãi
          </h3>
          <button className="btn-close" onClick={() => setState(!state)}>
            <i className="uil uil-times-square"></i>
          </button>
        </div>
        <div className="modal-body">
          <div className="form-input">
            <Form>
              <Row>
                <Col md={4}>
                  <h5>1. Tiêu đề</h5>
                  <CustomTextInput
                    label={"Tiếng Việt"}
                    name="titleVN"
                    placeholder="Nhập tiêu đề tiếng việt"
                    value={titleVN}
                    onChange={(e) => setTitleVN(e.target.value)}
                  />
                  <CustomTextInput
                    label={"Tiếng Anh"}
                    name="titleEN"
                    placeholder="Nhập tiêu đề tiếng anh"
                    value={titleEN}
                    onChange={(e) => setTitleEN(e.target.value)}
                  />
                  <h5>2. Mô tả chi tiết</h5>
                  <Label>Tiếng Việt</Label>
                  <CustomTextEditor
                    value={descriptionVN}
                    onChangeValue={setDescriptionVN}
                  />
                  <Label>Tiếng Anh</Label>
                  <CustomTextEditor
                    value={descriptionEN}
                    onChangeValue={setDescriptionEN}
                  />
                </Col>
                <Col md={4}>
                  <div>
                    <h5>3. Giá đơn đặt tối thiểu</h5>
                    <CustomTextInput
                      placeholder="Nhập giá"
                      className="input-promo-code"
                      type="number"
                      min={0}
                      value={minimumOrder}
                      onChange={(e) => setMinimumOrder(e.target.value)}
                    />
                  </div>

                  <div>
                    <h5>4. Hình thức giảm giá</h5>
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
                      {discountUnit === "amount" ? (
                        <CustomTextInput
                          label={"Giá giảm "}
                          classNameForm="input-promo-amount"
                          placeholder="VNĐ"
                          type="number"
                          min={0}
                          value={maximumDiscount}
                          onChange={(e) => setMaximumDiscount(e.target.value)}
                        />
                      ) : (
                        <Row className="row-discount">
                          <CustomTextInput
                            label={"Giá trị giảm"}
                            className="input-promo-discount"
                            classNameForm="form-discount"
                            placeholder="%"
                            type="number"
                            min={0}
                            value={reducedValue}
                            onChange={(e) => setReducedValue(e.target.value)}
                          />
                          <CustomTextInput
                            label={"Giá giảm tối đa"}
                            className="input-promo-discount"
                            classNameForm="form-discount"
                            min={0}
                            placeholder="VNĐ"
                            type="number"
                            value={maximumDiscount}
                            onChange={(e) => setMaximumDiscount(e.target.value)}
                          />
                        </Row>
                      )}
                    </Row>
                  </div>
                  <div>
                    <h5>5. Dịch vụ áp dụng</h5>
                    <Label>Các dịch vụ</Label>
                    <Select
                      style={{ width: "100%" }}
                      value={serviceApply}
                      onChange={(e) => {
                        setServiceApply(e);
                      }}
                      options={serviceOption}
                    />
                  </div>
                  <div>
                    <h5>6. Đối tượng áp dụng</h5>
                    <FormGroup check inline>
                      <Label check className="text-first">
                        Nhóm khách hàng
                      </Label>
                      <Input
                        type="checkbox"
                        className="ml-2"
                        defaultChecked={isGroupCustomer}
                        onClick={() => setIsGroupCustomer(!isGroupCustomer)}
                      />
                    </FormGroup>

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
                    <FormGroup check inline>
                      <Label check className="text-first">
                        Áp dụng cho khách hàng
                      </Label>
                      <Input
                        type="checkbox"
                        className="ml-2"
                        defaultChecked={isCustomer}
                        onClick={() => setIsCustomer(!isCustomer)}
                      />
                    </FormGroup>
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
                </Col>
                <Col md={4}>
                  <div>
                    <h5 className="mt-2">7. Số lượng mã khuyến mãi</h5>
                    <FormGroup check inline>
                      <Label check className="text-first">
                        Số lượng giới hạn
                      </Label>
                      <Input
                        type="checkbox"
                        className="ml-2"
                        defaultChecked={limitedQuantity}
                        onClick={() => setLimitedQuantity(!limitedQuantity)}
                      />
                    </FormGroup>
                    {limitedQuantity && (
                      <CustomTextInput
                        placeholder="Số lượng"
                        className="input-promo-code"
                        type="number"
                        min={0}
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                      />
                    )}
                  </div>
                  <div>
                    <h5 className="mt-2">8. Số lần sử dụng khuyến mãi</h5>
                    <FormGroup check inline>
                      <Label check className="text-first">
                        Lần sử dụng khuyến mãi
                      </Label>
                      <Input
                        type="checkbox"
                        className="ml-2"
                        defaultChecked={isUsePromo}
                        onClick={() => setIsUsePromo(!isUsePromo)}
                      />
                    </FormGroup>
                    {isUsePromo && (
                      <CustomTextInput
                        placeholder="Số lượng"
                        className="input-promo-code"
                        min={0}
                        type="number"
                        value={usePromo}
                        onChange={(e) => setUsePromo(e.target.value)}
                      />
                    )}
                  </div>
                  <div>
                    <h5 className="mt-2">10. Thời gian khuyến mãi</h5>
                    <FormGroup check inline>
                      <Label check className="text-first">
                        Giới hạn ngày
                      </Label>
                      <Input
                        type="checkbox"
                        className="ml-2"
                        defaultChecked={limitedDate}
                        onClick={() => setLimitedDate(!limitedDate)}
                      />
                    </FormGroup>
                    {limitedDate && (
                      <>
                        <FormGroup>
                          <Label>Ngày bắt đầu</Label>
                          <input
                            className="input-promo-code"
                            type={"date"}
                            defaultValue={startDate}
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                          />
                        </FormGroup>
                        <FormGroup>
                          <Label>Ngày kết thúc</Label>
                          <input
                            className="input-promo-code"
                            type={"date"}
                            defaultValue={startDate}
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                          />
                        </FormGroup>
                      </>
                    )}
                  </div>
                  <div>
                    <h5 className="mt-2">11. Phương thức thanh toán</h5>
                    <FormGroup check inline>
                      <Label check className="text-first">
                        Thanh toán
                      </Label>
                      <Input
                        type="checkbox"
                        className="ml-2"
                        defaultChecked={isPaymentMethod}
                        onClick={() => setIsPaymentMethod(!isPaymentMethod)}
                      />
                    </FormGroup>

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
                        value={paymentMethod}
                      />
                    )}
                  </div>

                  <div>
                    <h5 className="mt-2">11. Thứ tự hiện thị</h5>
                    <CustomTextInput
                      placeholder="Nhập số thứ tự (1,2,3...,n"
                      className="input-promo-code"
                      type="number"
                      min={0}
                      value={position}
                      onChange={(e) => setPosition(e.target.value)}
                    />
                  </div>

                  <div className="div-loop-time">
                    <FormGroup check inline>
                      <h5 className="mt-2">12. Thời gian áp dụng</h5>
                      <Input
                        type="checkbox"
                        className="ml-2"
                        checked={isApplyTime}
                        onClick={() => setIsApplyTime(!isApplyTime)}
                      />
                    </FormGroup>

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
                                  defaultOpenValue={dayjs(
                                    item?.start_time_local,
                                    "HH:mm:ss"
                                  )}
                                  value={dayjs(
                                    item?.start_time_local,
                                    "HH:mm:ss"
                                  )}
                                  onChange={(time, timeString) =>
                                    changeTimeStartApply(timeString, index)
                                  }
                                />
                                <a>Thời gian kết thúc</a>
                                <TimePicker
                                  defaultOpenValue={dayjs(
                                    item?.end_time_local,
                                    "HH:mm:ss"
                                  )}
                                  value={dayjs(
                                    item?.end_time_local,
                                    "HH:mm:ss"
                                  )}
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
                    className="btn_add mt-5"
                    color="warning"
                    onClick={onEditPromotion}
                  >
                    Sửa khuyến mãi
                  </Button>
                </Col>
              </Row>
            </Form>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default memo(EditPromotionEvent);
