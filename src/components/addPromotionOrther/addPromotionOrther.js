import {
  Button,
  Checkbox,
  Col,
  DatePicker,
  Input,
  List,
  Modal,
  Row,
  Select,
} from "antd";
import _debounce from "lodash/debounce";
import React, { memo, useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { searchCustomersApi } from "../../api/customer";
import { DATA_PAYMENT } from "../../api/fakeData";
import {
  createPromotion,
  fetchPromotion,
  getGroupCustomerApi,
} from "../../api/promotion";
import { errorNotify } from "../../helper/toast";
import { loadingAction } from "../../redux/actions/loading";
import { getService } from "../../redux/selectors/service";
import CustomButton from "../customButton/customButton";
import CustomTextEditor from "../customTextEdittor";
import UploadImage from "../uploadImage";
import "./addPromotionOrther.scss";
import { getLanguageState } from "../../redux/selectors/auth";
import i18n from "../../i18n";
import InputCustom from "../textInputCustom";
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
  const lang = useSelector(getLanguageState);

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
                  6. {`${i18n.t("partner_name", { lng: lang })}`}
                </a>
                <Input
                  className="input-promo-brand"
                  type="text"
                  value={namebrand}
                  onChange={(e) => setNamebrand(e.target.value)}
                />
              </div>
              <div className="mt-2">
                <a className="title-add-promo">
                  7. {`${i18n.t("applicable_object", { lng: lang })}`}
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
            <Col span={7} className="ml-3">
              <div>
                <a className="title-add-promo">
                  8. {`${i18n.t("number_promo", { lng: lang })}`}
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
                  9. {`${i18n.t("number_use_promotion", { lng: lang })}`}
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
                  10. {`${i18n.t("promotion_time", { lng: lang })}`}
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
                  11. {`${i18n.t("redemption_points", { lng: lang })}`}
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
                  12. {`${i18n.t("payment_method", { lng: lang })}`}
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
                    13.{" "}
                    {`${i18n.t("usage_time_after_exchange", { lng: lang })}`}
                  </a>
                  <Input
                    className="input-promo-code"
                    type="number"
                    min={0}
                    value={dateExchange}
                    onChange={(e) => setDateExchange(e.target.value)}
                  />
                </div>
              )}
              <div className="mt-2">
                <a className="title-add-promo">
                  14. {`${i18n.t("position", { lng: lang })}`}
                </a>
                <Input
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
                {`${i18n.t("add_promotion", { lng: lang })}`}
              </Button>
            </Col>
          </Row>
        </div>
      </Modal>
    </>
  );
};

export default memo(AddPromotionOther);
