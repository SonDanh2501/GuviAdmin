import {
  InputNumber,
  List,
  Select,
  TimePicker,
  Input,
  Checkbox,
  DatePicker,
} from "antd";
import _debounce from "lodash/debounce";
import React, { memo, useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Col, Form, FormGroup, Label, Modal, Row } from "reactstrap";
import { fetchCustomers, searchCustomers } from "../../api/customer";
import { DATA_PAYMENT, date } from "../../api/fakeData";
import { postFile } from "../../api/file";
import {
  fetchPromotion,
  getGroupCustomerApi,
  getPromotionDetails,
  updatePromotion,
} from "../../api/promotion";
import resizeFile from "../../helper/resizer";
import { errorNotify } from "../../helper/toast";
import { loadingAction } from "../../redux/actions/loading";
import { updatePromotionAction } from "../../redux/actions/promotion";
import { getService } from "../../redux/selectors/service";
import CustomTextInput from "../CustomTextInput/customTextInput";
import CustomTextEditor from "../customTextEdittor";
import "./editPromotion.scss";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);
const { TextArea } = Input;

const EditPromotion = (props) => {
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
  const [amount, setAmount] = useState();
  const [limitedDate, setLimitedDate] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isExchangePoint, setIsExchangePoint] = useState(false);
  const [exchangePoint, setExchangePoint] = useState("");
  const [isUsePromo, setIsUsePromo] = useState(false);
  const [usePromo, setUsePromo] = useState();
  const [imgThumbnail, setImgThumbnail] = useState("");
  const [imgBackground, setImgBackground] = useState("");
  const [serviceApply, setServiceApply] = useState("");
  const [dateExchange, setDateExchange] = useState();
  const [position, setPosition] = useState();
  const [isPaymentMethod, setIsPaymentMethod] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState([]);
  const [dataL, setDataL] = useState([]);
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [listCustomers, setListCustomers] = useState([]);
  const [listNameCustomers, setListNameCustomers] = useState([]);
  const [isParrentPromotion, setIsParrentPromotion] = useState(false);
  const [isApplyTime, setIsApplyTime] = useState(false);
  const [isShowInApp, setIsShowInApp] = useState(false);
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

  const onChangeThumbnail = async (e) => {
    dispatch(loadingAction.loadingRequest(true));
    try {
      if (e.target.files[0]) {
        const reader = new FileReader();
        reader.addEventListener("load", () => {
          setImgThumbnail(reader.result);
        });
        reader.readAsDataURL(e.target.files[0]);
      }
      const file = e.target.files[0];
      const image = await resizeFile(file);
      const formData = new FormData();
      formData.append("file", image);
      postFile(formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
        .then((res) => {
          setImgThumbnail(res);
          dispatch(loadingAction.loadingRequest(false));
        })
        .catch((err) => {
          errorNotify({
            message: err,
          });
          dispatch(loadingAction.loadingRequest(false));
        });
    } catch (err) {
      console.log(err);
    }
  };

  const onChangeBackground = async (e) => {
    dispatch(loadingAction.loadingRequest(true));
    try {
      if (e.target.files[0]) {
        const reader = new FileReader();
        reader.addEventListener("load", () => {
          setImgBackground(reader.result);
        });
        reader.readAsDataURL(e.target.files[0]);
      }
      const file = e.target.files[0];
      const image = await resizeFile(file);
      const formData = new FormData();
      formData.append("file", image);
      postFile(formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
        .then((res) => {
          setImgBackground(res);
          dispatch(loadingAction.loadingRequest(false));
        })
        .catch((err) => {
          errorNotify({
            message: err,
          });
          dispatch(loadingAction.loadingRequest(false));
        });
    } catch (err) {
      console.log(err);
    }
  };

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
        setImgThumbnail(res?.thumbnail);
        setImgBackground(res?.image_background);
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
        setListNameCustomers(res?.id_customer);
        setIsUsePromo(res?.is_limited_use);
        setUsePromo(res?.limited_use);
        setPromoType(res?.type_discount);
        setDiscountUnit(res?.discount_unit);
        setMaximumDiscount(res?.discount_max_price);
        setReducedValue(res?.discount_value);
        setIsExchangePoint(res?.is_exchange_point);
        setExchangePoint(res?.exchange_point);
        setNamebrand(res?.brand);
        setPromoCode(res?.code);
        setServiceApply(res?.service_apply[0]);
        setMinimumOrder(res?.price_min_order);
        setDateExchange(res?.exp_date_exchange);
        setPosition(res?.position);
        setIsPaymentMethod(res?.is_payment_method);
        setPaymentMethod(res?.payment_method);
        // setListCustomers(res?.id_customer);
        res?.id_customer?.map((item) => {
          listCustomers.push(item?._id);
        });
        setIsApplyTime(res?.is_loop);
        setTimeApply(res?.day_loop);
        setIsParrentPromotion(res?.is_parrent_promotion);
        setIsShowInApp(res?.is_show_in_app);
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
      service_apply: [serviceApply],
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
      is_loop: isApplyTime,
      day_loop: isApplyTime ? timeApply : [],
      is_show_in_app: isShowInApp,
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
        if (isParrentPromotion) {
          setState(false);
          fetchPromotion(startPage, 20, type, brand, idService, exchange)
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
    data,
    promoCode,
    serviceApply,
    minimumOrder,
    dateExchange,
    position,
    isPaymentMethod,
    paymentMethod,
    listCustomers,
    isApplyTime,
    timeApply,
    type,
    brand,
    idService,
    exchange,
    startPage,
    isParrentPromotion,
    isShowInApp,
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
          <a className="modal-title">Sửa khuyến mãi</a>
          <button className="btn-close" onClick={() => setState(!state)}>
            <i className="uil uil-times-square"></i>
          </button>
        </div>
        <div className="modal-body">
          <div className="form-input">
            <Form>
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
                  <div className="mt-2">
                    <a className="title-add-promo">2. Mô tả</a>
                    <TextArea
                      placeholder="Nhập mô tả tiếng việt"
                      value={shortDescriptionVN}
                      onChange={(e) => setShortDescriptionVN(e.target.value)}
                    />
                    <TextArea
                      label={"Tiếng Anh"}
                      placeholder="Nhập mô tả tiếng anh"
                      value={shortDescriptionEN}
                      onChange={(e) => setShortDescriptionEN(e.target.value)}
                      style={{ marginTop: 5 }}
                    />
                  </div>
                  <div className="mt-2">
                    <a className="title-add-promo">3. Mô tả chi tiết</a>
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
                    <a className="title-add-promo">4. Thumbnail/Background</a>
                    <div>
                      <a>Thumbnail 160px * 170px</a>
                      <Input
                        type="file"
                        accept={".jpg,.png,.jpeg"}
                        className="input-upload"
                        onChange={onChangeThumbnail}
                      />
                      {imgThumbnail && (
                        <img src={imgThumbnail} className="img-thumbnail" />
                      )}
                    </div>
                    <div>
                      <a>Background 414px * 200px</a>
                      <Input
                        type="file"
                        accept={".jpg,.png,.jpeg"}
                        className="input-upload"
                        onChange={onChangeBackground}
                      />
                      {imgBackground && (
                        <img src={imgBackground} className="img-background" />
                      )}
                    </div>
                  </div>
                  <div className="mt-2">
                    <a className="title-add-promo">5. Mã khuyến mãi</a>
                    <Input
                      placeholder="Nhập mã khuyến mãi"
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                    />
                  </div>
                  <div className="mt-2">
                    <a className="title-add-promo">6. Giá đơn đặt tối thiểu</a>
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
                    <a className="title-add-promo">7. Hình thức giảm giá</a>
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
                </Col>
                <Col md={4}>
                  <div className="mt-2">
                    <a className="title-add-promo">8. Đối tượng áp dụng</a>
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
                  <div className="mt-2">
                    <a className="title-add-promo">9. Số lượng mã khuyến mãi</a>
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
                    <a className="title-add-promo">
                      10. Số lần sử dụng khuyến mãi
                    </a>
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
                    <a className="title-add-promo">11. Thời gian khuyến mãi</a>
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
                              format={dateFormat}
                              value={dayjs(startDate.slice(0, 11), dateFormat)}
                            />
                          </div>
                          <div>
                            <a>Ngày kết thúc</a>
                            <DatePicker
                              onChange={(date, dateString) =>
                                setEndDate(dateString)
                              }
                              style={{ marginLeft: 5, width: "100%" }}
                              format={dateFormat}
                              value={dayjs(endDate.slice(0, 11), dateFormat)}
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
                    <a className="title-add-promo">12. Điểm quy đổi</a>
                    <div>
                      <Checkbox
                        checked={isExchangePoint}
                        onChange={(e) => setIsExchangePoint(e.target.checked)}
                      >
                        Điểm quy đổi
                      </Checkbox>
                      {isExchangePoint && (
                        <Input
                          placeholder="Nhập số điểm"
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
                      13. Phương thức thanh toán
                    </a>
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
                    <a className="title-add-promo">
                      14. Thời gian sử dụng sau khi đổi
                    </a>
                    <Input
                      placeholder="Nhập số ngày (1,2,3...,n"
                      className="input-promo-code"
                      type="number"
                      min={0}
                      value={dateExchange}
                      onChange={(e) => setDateExchange(e.target.value)}
                    />
                  </div>
                  <div className="mt-2">
                    <a className="title-add-promo">15. Thứ tự hiện thị</a>
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
                      <a className="title-add-promo">16. Thời gian áp dụng</a>
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
                  <div className="div-check-show-app">
                    <a className="title-check">17. Hiện thị mã trên app</a>
                    <Checkbox
                      onChange={(e) => {
                        setIsShowInApp(e.target.checked);
                      }}
                      checked={isShowInApp}
                      style={{ marginLeft: 5 }}
                    />
                  </div>
                  <Button
                    className="btn-edit-promrion mt-5"
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

export default memo(EditPromotion);
