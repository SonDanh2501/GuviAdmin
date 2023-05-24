import { Checkbox, InputNumber, List, Select, TimePicker } from "antd";
import _debounce from "lodash/debounce";
import moment from "moment";
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
import { postFile } from "../../api/file";
import { createPushNotification } from "../../api/notification";
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
import CustomTextEditor from "../customTextEdittor";
import "./addPromotion.scss";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);

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
        searchCustomers(0, 20, "", value)
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
        en: descriptionVN,
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
    })
      .then((res) => {
        if (isSendNotification) {
          createPushNotification({
            title: titleNoti,
            body: descriptionNoti,
            is_date_schedule: isDateSchedule,
            date_schedule: moment(new Date(dateSchedule)).toISOString(),
            is_id_customer: isCustomer,
            id_customer: listCustomers,
            is_id_group_customer: isGroupCustomer,
            id_group_customer: groupCustomer,
            image_url: imgBackground,
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
          <h3 className="modal-title" id="exampleModalLabel">
            Thêm mã khuyến mãi
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
                  <h5>2. Mô tả ngắn</h5>
                  <CustomTextInput
                    label={"Tiếng Việt"}
                    placeholder="Nhập mô tả tiếng việt"
                    value={shortDescriptionVN}
                    type="textarea"
                    onChange={(e) => setShortDescriptionVN(e.target.value)}
                  />
                  <CustomTextInput
                    label={"Tiếng Anh"}
                    placeholder="Nhập mô tả tiếng anh"
                    type="textarea"
                    value={shortDescriptionEN}
                    onChange={(e) => setShortDescriptionEN(e.target.value)}
                  />
                  <h5>3. Mô tả chi tiết</h5>
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
                    <h5>4. Thumbnail/Background</h5>
                    <CustomTextInput
                      label={"Thumbnail 160px * 170px"}
                      type="file"
                      accept={".jpg,.png,.jpeg"}
                      className="input-upload"
                      onChange={onChangeThumbnail}
                    />
                    {imgThumbnail && (
                      <img src={imgThumbnail} className="img-thumbnail" />
                    )}
                    <CustomTextInput
                      label={"Background 414px * 200px"}
                      type="file"
                      accept={".jpg,.png,.jpeg"}
                      className="input-upload"
                      onChange={onChangeBackground}
                    />
                    {imgBackground && (
                      <img src={imgBackground} className="img-background" />
                    )}
                  </div>
                  <div>
                    <h5>5. Mã khuyến mãi</h5>
                    <CustomTextInput
                      placeholder="Nhập mã khuyến mãi"
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                    />
                  </div>
                  <div>
                    <h5>6. Giá đơn đặt tối thiểu</h5>
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
                    <h5>7. Hình thức giảm giá</h5>
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
                              style={{ width: "90%" }}
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
                      <h5>9. Dịch vụ áp dụng</h5>
                      <Label>Các dịch vụ</Label>
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
                    <h5>10. Đối tượng áp dụng</h5>
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
                </Col>
                <Col md={4}>
                  <div>
                    <h5 className="mt-2">11. Số lượng mã khuyến mãi</h5>
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
                    <h5 className="mt-2">12. Số lần sử dụng khuyến mãi</h5>
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
                    <h5 className="mt-2">13. Thời gian khuyến mãi</h5>
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
                    <h5 className="mt-2">14. Điểm quy đổi</h5>
                    <FormGroup check inline>
                      <Label check className="text-first">
                        Điểm quy đổi
                      </Label>
                      <Input
                        type="checkbox"
                        className="ml-2"
                        defaultChecked={isExchangePoint}
                        onClick={() => setIsExchangePoint(!isExchangePoint)}
                      />
                    </FormGroup>
                    {isExchangePoint && (
                      <CustomTextInput
                        label={"Điểm"}
                        placeholder="Nhập số điểm"
                        className="input-promo-code"
                        type="number"
                        min={0}
                        value={exchangePoint}
                        onChange={(e) => setExchangePoint(e.target.value)}
                      />
                    )}
                  </div>
                  <div>
                    <h5 className="mt-2">15. Phương thức thanh toán</h5>
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
                      />
                    )}
                  </div>
                  <div>
                    <h5 className="mt-2">16. Thời gian sử dụng sau khi đổi</h5>
                    <CustomTextInput
                      placeholder="Nhập số ngày (1,2,3...,n"
                      className="input-promo-code"
                      type="number"
                      min={0}
                      value={dateExchange}
                      onChange={(e) => setDateExchange(e.target.value)}
                    />
                  </div>
                  <div>
                    <h5 className="mt-2">17. Thứ tự hiện thị</h5>
                    <CustomTextInput
                      placeholder="Nhập số thứ tự (1,2,3...,n"
                      className="input-promo-code"
                      type="number"
                      min={0}
                      value={position}
                      onChange={(e) => setPosition(e.target.value)}
                    />
                  </div>
                  <div>
                    <FormGroup check inline>
                      <h5 className="mt-2">18. Gửi thông báo</h5>
                      <Input
                        type="checkbox"
                        className="ml-2"
                        defaultChecked={isSendNotification}
                        onClick={() =>
                          setIsSendNotification(!isSendNotification)
                        }
                      />
                    </FormGroup>

                    {isSendNotification && (
                      <div>
                        <CustomTextInput
                          placeholder="Nhập tiêu đề thông báo"
                          className="input-promo-code mt-2"
                          type="text"
                          value={titleNoti}
                          onChange={(e) => setTitleNoti(e.target.value)}
                        />
                        <CustomTextInput
                          placeholder="Nhập nội dung thông báo"
                          className="input-promo-code"
                          type="textarea"
                          value={descriptionNoti}
                          onChange={(e) => setDescriptionNoti(e.target.value)}
                        />
                        <div>
                          <Checkbox
                            checked={isDateSchedule}
                            onChange={(e) =>
                              setIsDateSchedule(e.target.checked)
                            }
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
                  <div>
                    <FormGroup check inline>
                      <h5 className="mt-2">19. Đa dạng khuyến mãi</h5>
                      <Input
                        type="checkbox"
                        className="ml-2"
                        defaultChecked={isParrentPromotion}
                        onClick={() =>
                          setIsParrentPromotion(!isParrentPromotion)
                        }
                      />
                    </FormGroup>

                    {isParrentPromotion && (
                      <CustomTextInput
                        placeholder="Số lượng"
                        className="input-promo-code mt-2"
                        type="number"
                        value={totalChildPromotion}
                        onChange={(e) =>
                          setTotalChildPromotion(
                            Number.parseInt(e.target.value)
                          )
                        }
                      />
                    )}
                  </div>
                  <div className="div-loop-time">
                    <FormGroup check inline>
                      <h5 className="mt-2">20. Thời gian áp dụng</h5>
                      <Input
                        type="checkbox"
                        className="ml-2"
                        defaultChecked={isApplyTime}
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
                    className="btn-create-promotion mt-3"
                    onClick={onCreatePromotion}
                  >
                    Thêm khuyến mãi
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

export default memo(AddPromotion);
