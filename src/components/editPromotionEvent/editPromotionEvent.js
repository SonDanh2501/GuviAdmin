import { Select } from "antd";
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
import { fetchCustomers } from "../../api/customer";
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
import "./editPromotionEvent.scss";

const EditPromotionEvent = ({ state, setState, data }) => {
  const [formPromorion, setFormPromotion] = React.useState("Mã khuyến mãi");
  const [typePromotion, setTypePromotion] = React.useState("code");
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
  const [serviceApply, setServiceApply] = useState("");
  const [isPaymentMethod, setIsPaymentMethod] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState([]);
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
      })
      .catch((err) => console.log(err));
  }, [data]);

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
            vi: "",
            en: "",
          },
          description: {
            vi: draftToHtml(convertToRaw(descriptionVN.getCurrentContent())),
            en: draftToHtml(convertToRaw(descriptionEN.getCurrentContent())),
          },
          thumbnail: "",
          image_background: "",
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
          id_customer: customer,
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
          position: 0,
          is_payment_method: isPaymentMethod,
          payment_method: paymentMethod,
        },
      })
    );
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

                    <CustomTextInput
                      className="select-type-promo"
                      name="select"
                      type="select"
                      value={serviceApply}
                      onChange={(e) => {
                        setServiceApply(e.target.value);
                      }}
                      body={service.map((item, index) => {
                        return (
                          <option key={index} value={item?._id}>
                            {item?.title?.vi}
                          </option>
                        );
                      })}
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
                      <Select
                        style={{
                          width: "100%",
                        }}
                        placeholder="Chọn khách hàng"
                        onChange={handleChangeCustomer}
                        options={optionsCustomer}
                        filterOption={(input, option) =>
                          (option?.label ?? "").includes(input)
                        }
                        filterSort={(optionA, optionB) =>
                          (optionA?.label ?? "")
                            .toLowerCase()
                            .localeCompare((optionB?.label ?? "").toLowerCase())
                        }
                        optionFilterProp="children"
                        showSearch
                      />
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
