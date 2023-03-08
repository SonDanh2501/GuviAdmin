import { List, Select } from "antd";
import {
  ContentState,
  convertFromHTML,
  convertToRaw,
  EditorState,
} from "draft-js";
import draftToHtml from "draftjs-to-html";
import React, { memo, useCallback, useEffect, useState } from "react";
import { Editor } from "react-draft-wysiwyg";
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
import { DATA_PAYMENT } from "../../api/fakeData";
import { postFile } from "../../api/file";
import {
  getGroupCustomer,
  getGroupCustomerApi,
  getPromotionDetails,
} from "../../api/promotion";
import resizeFile from "../../helper/resizer";
import { errorNotify } from "../../helper/toast";
import { loadingAction } from "../../redux/actions/loading";
import { updatePromotionAction } from "../../redux/actions/promotion";
import { getService } from "../../redux/selectors/service";
import CustomTextInput from "../CustomTextInput/customTextInput";
import _debounce from "lodash/debounce";
import "./editPromotionOrther.scss";

const EditPromotionOrther = ({ state, setState, data }) => {
  const [formDiscount, setFormDiscount] = React.useState("amount");
  const [discountUnit, setDiscountUnit] = React.useState("amount");
  const [create, setCreate] = React.useState(false);
  const [dataGroupCustomer, setDataGroupCustomer] = React.useState([]);
  const [isGroupCustomer, setIsGroupCustomer] = React.useState(false);
  const [groupCustomer, setGroupCustomer] = React.useState([]);
  const [dataCustomer, setDataCustomer] = React.useState([]);
  const [isCustomer, setIsCustomer] = React.useState(false);
  const [customer, setCustomer] = React.useState([]);
  const [titleVN, setTitleVN] = React.useState(data?.title?.vi);
  const [titleEN, setTitleEN] = React.useState(data?.title?.en);
  const [shortDescriptionVN, setShortDescriptionVN] = React.useState("");
  const [shortDescriptionEN, setShortDescriptionEN] = React.useState("");
  const [descriptionVN, setDescriptionVN] = React.useState(
    EditorState.createEmpty()
  );
  const [descriptionEN, setDescriptionEN] = React.useState(
    EditorState.createEmpty()
  );
  const [promoCode, setPromoCode] = React.useState("");
  const [promoType, setPromoType] = React.useState("order");
  const [unitPrice, setUnitPrice] = React.useState("");
  const [minimumOrder, setMinimumOrder] = React.useState("");
  const [namebrand, setNamebrand] = React.useState("");
  const [codebrand, setCodebrand] = React.useState("");
  const [reducedValue, setReducedValue] = React.useState();
  const [maximumDiscount, setMaximumDiscount] = React.useState();
  const [orderFirst, setOrderFirst] = React.useState(false);
  const [limitedQuantity, setLimitedQuantity] = React.useState(false);
  const [amount, setAmount] = React.useState("");
  const [limitedDate, setLimitedDate] = React.useState(false);
  const [startDate, setStartDate] = React.useState("");
  const [endDate, setEndDate] = React.useState("");
  const [isExchangePoint, setIsExchangePoint] = React.useState(false);
  const [exchangePoint, setExchangePoint] = React.useState("");
  const [isUsePromo, setIsUsePromo] = React.useState(false);
  const [usePromo, setUsePromo] = React.useState("");
  const [imgThumbnail, setImgThumbnail] = React.useState("");
  const [imgBackground, setImgBackground] = React.useState("");
  const [serviceApply, setServiceApply] = useState("");
  const [dateExchange, setDateExchange] = useState();
  const [position, setPosition] = useState();
  const [isPaymentMethod, setIsPaymentMethod] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState([]);
  const [listCustomers, setListCustomers] = useState([]);
  const [listNameCustomers, setListNameCustomers] = useState([]);
  const [dataL, setDataL] = useState([]);
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const options = [];
  const optionsCustomer = [];

  const dispatch = useDispatch();
  const service = useSelector(getService);

  useEffect(() => {
    getGroupCustomerApi(0, 10)
      .then((res) => setDataGroupCustomer(res.data))
      .catch((err) => console.log(err));

    fetchCustomers(0, 200, "")
      .then((res) => setDataCustomer(res?.data))
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
  const onEditorVNStateChange = (editorState) => setDescriptionVN(editorState);

  const onEditorENStateChange = (editorState) => setDescriptionEN(editorState);

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
        setDescriptionVN(
          EditorState.createWithContent(
            ContentState.createFromBlockArray(
              convertFromHTML(res?.description?.vi)
            )
          )
        );
        setDescriptionEN(
          EditorState.createWithContent(
            ContentState.createFromBlockArray(
              convertFromHTML(res?.description?.en)
            )
          )
        );
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
        setCustomer(res?.id_customer);
        setListCustomers(res?.id_customer);
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
      })
      .catch((err) => console.log(err));
  }, [data]);

  const onChooseCustomer = (item) => {
    setId(item?._id);
    setName("");
    setDataL([]);
    const newData = listCustomers.concat(item?._id);
    const newNameData = listNameCustomers.concat({
      name: item?.full_name,
      phone: item?.phone,
      id: item?._id,
      idView: item?.id_view,
    });
    setListCustomers(newData);
    setListNameCustomers(newNameData);
  };

  const removeItemCustomer = (item) => {
    const newNameArray = listNameCustomers.filter((i) => i?.id !== item?.id);
    const newArray = listCustomers.filter((i) => i !== item?.id);
    setListNameCustomers(newNameArray);
    setListCustomers(newArray);
  };

  const onEditPromotion = useCallback(() => {
    dispatch(loadingAction.loadingRequest(true));
    dispatch(
      updatePromotionAction.updatePromotionRequest({
        id: data?._id,
        data: {
          title: {
            vi: titleVN,
            en: titleEN,
          },
          short_description: {
            vi: shortDescriptionVN,
            en: shortDescriptionEN,
          },
          description: {
            vi: draftToHtml(convertToRaw(descriptionVN.getCurrentContent())),
            en: draftToHtml(convertToRaw(descriptionEN.getCurrentContent())),
          },
          thumbnail: imgThumbnail,
          image_background: imgBackground,
          code: promoCode,
          is_limit_date: limitedDate,
          limit_start_date: limitedDate
            ? new Date(startDate).toISOString()
            : null,
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
        },
      })
    );
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
            Sửa khuyến mãi từ đối tác
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
                  <div className="form-description">
                    <Editor
                      editorState={descriptionVN}
                      onEditorStateChange={onEditorVNStateChange}
                      toolbarClassName="toolbarClassName"
                      wrapperClassName="wrapperClassName wrapperStyle"
                      editorClassName="editorClassName"
                      wrapperStyle={{ color: "#000" }}
                    />
                  </div>
                  <Label>Tiếng Việt</Label>
                  <div className="form-description">
                    <Editor
                      editorState={descriptionEN}
                      onEditorStateChange={onEditorENStateChange}
                      toolbarClassName="toolbarClassName"
                      wrapperClassName="wrapperClassName wrapperStyle"
                      editorClassName="editorClassName"
                      wrapperStyle={{ color: "#000" }}
                    />
                  </div>
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
                    <h5>6. Tên đối tác</h5>
                    <CustomTextInput
                      label={"Tên đối tác"}
                      placeholder="Nhập tên đối tác"
                      className="input-promo-brand"
                      type="text"
                      value={namebrand}
                      onChange={(e) => setNamebrand(e.target.value)}
                    />
                  </div>
                  <div>
                    <h5>7. Đối tượng áp dụng</h5>
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
                                  key={index}
                                  onClick={() => onChooseCustomer(item)}
                                >
                                  <a>
                                    {item?.name} - {item?.phone} -{" "}
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
                                      - {item?.name} . {item?.phone} .{" "}
                                      {item?.idView}
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
                    <h5 className="mt-2">8. Số lượng mã khuyến mãi</h5>
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
                    <h5 className="mt-2">9. Số lần sử dụng khuyến mãi</h5>
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
                    <h5 className="mt-2">11. Điểm quy đổi</h5>
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
                    <h5 className="mt-2">12. Phương thức thanh toán</h5>
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
                    <h5 className="mt-2">13. Thời gian sử dụng sau khi đổi</h5>
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
                    <h5 className="mt-2">14. Thứ tự hiện thị</h5>
                    <CustomTextInput
                      placeholder="Nhập số thứ tự (1,2,3...,n"
                      className="input-promo-code"
                      type="number"
                      min={0}
                      value={position}
                      onChange={(e) => setPosition(e.target.value)}
                    />
                  </div>
                  <Button
                    className="btn_add"
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

export default memo(EditPromotionOrther);
