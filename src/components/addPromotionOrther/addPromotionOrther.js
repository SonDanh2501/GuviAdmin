import { List, Select, Input, Checkbox, DatePicker } from "antd";
import _debounce from "lodash/debounce";
import React, { memo, useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Col, Form, FormGroup, Label, Modal, Row } from "reactstrap";
import {
  fetchCustomers,
  searchCustomers,
  searchCustomersApi,
} from "../../api/customer";
import { DATA_PAYMENT } from "../../api/fakeData";
import { postFile } from "../../api/file";
import {
  createPromotion,
  fetchPromotion,
  getGroupCustomerApi,
} from "../../api/promotion";
import resizeFile from "../../helper/resizer";
import { errorNotify } from "../../helper/toast";
import { loadingAction } from "../../redux/actions/loading";
import { createPromotionAction } from "../../redux/actions/promotion";
import { getService } from "../../redux/selectors/service";
import CustomTextInput from "../CustomTextInput/customTextInput";
import CustomButton from "../customButton/customButton";
import CustomTextEditor from "../customTextEdittor";
import "./addPromotionOrther.scss";
import UploadImage from "../uploadImage";
const { TextArea } = Input;

const AddPromotionOther = (props) => {
  const {
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
  const options = [];
  const optionsCustomer = [];
  const dispatch = useDispatch();

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
      service_apply: [],
      is_limited_use: isUsePromo,
      limited_use: isUsePromo ? usePromo : 0,
      type_discount: "partner_promotion",
      type_promotion: "code",
      price_min_order: minimumOrder,
      discount_unit: discountUnit,
      discount_max_price: maximumDiscount,
      discount_value: reducedValue,
      is_delete: false,
      is_exchange_point: isExchangePoint,
      exchange_point: exchangePoint,
      brand: namebrand,
      exp_date_exchange: dateExchange,
      position: position,
      is_payment_method: isPaymentMethod,
      payment_method: paymentMethod,
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
        dispatch(loadingAction.loadingRequest(false));
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
    listCustomers,
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
          <a className="modal-title">Thêm khuyến mãi từ đối tác</a>
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
                    <a className="title-add-promo">5. Mã khuyến mãi</a>
                    <Input
                      placeholder="Nhập mã khuyến mãi"
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                    />
                  </div>
                  <div className="mt-2">
                    <a className="title-add-promo">6. Tên đối tác</a>
                    <Input
                      placeholder="Nhập tên đối tác"
                      className="input-promo-brand"
                      type="text"
                      value={namebrand}
                      onChange={(e) => setNamebrand(e.target.value)}
                    />
                  </div>
                  <div className="mt-2">
                    <a className="title-add-promo">7. Đối tượng áp dụng</a>
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
                    <a className="title-add-promo">8. Số lượng mã khuyến mãi</a>
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
                      9. Số lần sử dụng khuyến mãi
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
                    <a className="title-add-promo">10. Thời gian khuyến mãi</a>
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
                    <a className="title-add-promo">11. Điểm quy đổi</a>
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
                      12. Phương thức thanh toán
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
                  {isExchangePoint && (
                    <div className="mt-2">
                      <a className="title-add-promo">
                        13. Thời gian sử dụng sau khi đổi
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
                  )}
                  <div className="mt-2">
                    <a className="title-add-promo">14. Thứ tự hiện thị</a>
                    <Input
                      placeholder="Nhập số thứ tự (1,2,3...,n"
                      className="input-promo-code"
                      type="number"
                      min={0}
                      value={position}
                      onChange={(e) => setPosition(e.target.value)}
                    />
                  </div>
                  <Button
                    className="btn_add_promotion_order"
                    color="warning"
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

export default memo(AddPromotionOther);
