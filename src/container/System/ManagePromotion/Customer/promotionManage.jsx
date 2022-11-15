import {
  ContentState,
  convertFromHTML,
  convertToRaw,
  EditorState,
} from "draft-js";
import draftToHtml from "draftjs-to-html";
import React, { useCallback, useEffect } from "react";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  Card,
  CardFooter,
  CardHeader,
  Col,
  Form,
  FormGroup,
  Input,
  Label,
  Pagination,
  PaginationItem,
  PaginationLink,
  Row,
  Table,
} from "reactstrap";
import { postFile } from "../../../../api/file.jsx";
import {
  createPromotion,
  getGroupCustomerPromotion,
  getPromotionDetails,
} from "../../../../api/promotion.jsx";
import CustomTextInput from "../../../../components/CustomTextInput/customTextInput.jsx";
import {
  createPromotionAction,
  getPromotion,
  updatePromotionAction,
} from "../../../../redux/actions/promotion.js";
import {
  getPromotionSelector,
  getTotalPromotion,
} from "../../../../redux/selectors/promotion.js";
import "./PromotionManage.scss";
import TableManagePromotion from "./tableManagePromotion.jsx";

export default function PromotionManage() {
  const [formPromorion, setFormPromotion] = React.useState("Mã khuyến mãi");
  const [typePromotion, setTypePromotion] = React.useState("code");
  const [formDiscount, setFormDiscount] = React.useState("Giảm trực tiếp");
  const [discountUnit, setDiscountUnit] = React.useState("amount");
  const [create, setCreate] = React.useState(false);
  const [edit, setEdit] = React.useState(false);
  const [id, setId] = React.useState("");
  const [groupCustomer, setGroupCustomer] = React.useState([]);
  const [customer, setCustomer] = React.useState([]);
  const [titleVN, setTitleVN] = React.useState("");
  const [titleEN, setTitleEN] = React.useState("");
  const [shortDescriptionVN, setShortDescriptionVN] = React.useState("");
  const [shortDescriptionEN, setShortDescriptionEN] = React.useState("");
  const [descriptionVN, setDescriptionVN] = React.useState(
    EditorState.createEmpty()
  );
  const [descriptionEN, setDescriptionEN] = React.useState(
    EditorState.createEmpty()
  );
  const [promoCode, setPromoCode] = React.useState("");
  const [promoType, setPromoType] = React.useState("same_price");
  const [unitPrice, setUnitPrice] = React.useState("");
  const [minimumOrder, setMinimumOrder] = React.useState("");
  const [namebrand, setNamebrand] = React.useState("");
  const [codebrand, setCodebrand] = React.useState("");
  const [reducedValue, setReducedValue] = React.useState(0);
  const [maximumDiscount, setMaximumDiscount] = React.useState(0);
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
  const promotion = useSelector(getPromotionSelector);
  const total = useSelector(getTotalPromotion);
  const dispatch = useDispatch();
  const [data, setData] = React.useState([]);

  useEffect(() => {
    dispatch(getPromotion.getPromotionRequest());
    getGroupCustomerPromotion()
      .then((res) => setGroupCustomer(res.data))
      .catch((err) => console.log(err));
  }, []);

  const onChangeThumbnail = (e) => {
    if (e.target.files[0]) {
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setImgThumbnail(reader.result);
      });
      reader.readAsDataURL(e.target.files[0]);
    }

    const formData = new FormData();
    formData.append("file", e.target.files[0]);
    postFile(formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
      .then((res) => setImgThumbnail(res))
      .catch((err) => console.log("err", err));
  };

  const onChangeBackground = (e) => {
    if (e.target.files[0]) {
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setImgBackground(reader.result);
      });
      reader.readAsDataURL(e.target.files[0]);
    }
    const formData = new FormData();
    formData.append("file", e.target.files[0]);
    postFile(formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
      .then((res) => setImgBackground(res))
      .catch((err) => console.log("err", err));
  };

  const onFormPromotion = (title) => {
    setFormPromotion(title);
    if (title === "Mã khuyến mãi") {
      setTypePromotion("code");
    } else {
      setTypePromotion("event");
    }
  };

  const onFormDiscount = (title) => {
    setFormDiscount(title);
    if (title === "Giảm trực tiếp") {
      setDiscountUnit("amount");
    } else {
      setDiscountUnit("percent");
    }
  };
  const onChooseMultiple = useCallback(
    (id) => {
      if (customer.includes(id)) {
        setCustomer((prev) => prev.filter((p) => p !== id));
      } else {
        setCustomer((prev) => [...prev, id]);
      }
    },
    [customer]
  );

  const onEditorVNStateChange = (editorState) => setDescriptionVN(editorState);

  const onEditorENStateChange = (editorState) => setDescriptionEN(editorState);

  const onCreatePromotion = useCallback(() => {
    dispatch(
      createPromotionAction.createPromotionRequest({
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
        code: codebrand,
        is_limit_date: limitedDate,
        limit_start_date: limitedDate
          ? new Date(startDate).toISOString()
          : null,
        limit_end_date: limitedDate ? new Date(endDate).toISOString() : null,
        is_limit_count: limitedQuantity,
        limit_count: limitedQuantity ? amount : 0,
        id_group_customer: customer,
        service_apply: [],
        id_customer: [],
        is_limited_use: isUsePromo,
        limited_use: isUsePromo ? usePromo : 0,
        type_discount: promoType,
        type_promotion: typePromotion,
        price_min_order: 0,
        discount_unit: discountUnit,
        discount_max_price: maximumDiscount,
        discount_value: reducedValue,
        is_delete: false,
        is_exchange_point: isExchangePoint,
        exchange_point: exchangePoint,
        brand: namebrand,
      })
    );
    setCreate(!create);
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
    create,
    setCreate,
  ]);

  useEffect(() => {
    getPromotionDetails(id)
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
        setCustomer(res?.id_group_customer);
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
        setEdit(true);
      })
      .catch((err) => console.log(err));
  }, [id]);

  const onEditPromotion = useCallback(() => {
    dispatch(
      updatePromotionAction.updatePromotionRequest({
        id: id,
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
          code: codebrand,
          is_limit_date: limitedDate,
          limit_start_date: limitedDate
            ? new Date(startDate).toISOString()
            : null,
          limit_end_date: limitedDate ? new Date(endDate).toISOString() : null,
          is_limit_count: limitedQuantity,
          limit_count: limitedQuantity ? amount : 0,
          id_group_customer: customer,
          service_apply: [],
          id_customer: [],
          is_limited_use: isUsePromo,
          limited_use: isUsePromo ? usePromo : 0,
          type_discount: promoType,
          type_promotion: typePromotion,
          price_min_order: 0,
          discount_unit: discountUnit,
          discount_max_price: maximumDiscount,
          discount_value: reducedValue,
          is_delete: false,
          is_exchange_point: isExchangePoint,
          exchange_point: exchangePoint,
          brand: namebrand,
        },
      })
    );
    setEdit(!edit);
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
    edit,
    setEdit,
  ]);

  return (
    <React.Fragment>
      <div className="user-redux-container">
        <div className="user-redux-body mt-5 col-md-12">
          <div className="container">
            <div className="column">
              {create || edit ? (
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
                          onChange={(e) =>
                            setShortDescriptionVN(e.target.value)
                          }
                        />
                        <CustomTextInput
                          label={"Tiếng Anh"}
                          placeholder="Nhập mô tả tiếng anh"
                          type="textarea"
                          value={shortDescriptionEN}
                          onChange={(e) =>
                            setShortDescriptionEN(e.target.value)
                          }
                        />
                        <h5>3. Mô tả chi tiết</h5>
                        <Label>Tiếng Việt</Label>
                        <Editor
                          editorState={descriptionVN}
                          onEditorStateChange={onEditorVNStateChange}
                          toolbarClassName="toolbarClassName"
                          wrapperClassName="wrapperClassName wrapperStyle"
                          editorClassName="editorClassName"
                        />
                        <Label>Tiếng Việt</Label>

                        <Editor
                          editorState={descriptionEN}
                          onEditorStateChange={onEditorENStateChange}
                          toolbarClassName="toolbarClassName"
                          wrapperClassName="wrapperClassName wrapperStyle"
                          editorClassName="editorClassName"
                        />
                      </Col>
                      <Col md={4}>
                        <div>
                          <h5>4. Thumbnail/Background</h5>
                          <CustomTextInput
                            label={"Thumbnail"}
                            type="file"
                            accept={".jpg,.png,.jpeg"}
                            className="thumbnail"
                            onChange={onChangeThumbnail}
                          />
                          {imgThumbnail && (
                            <img src={imgThumbnail} className="img-thumbnail" />
                          )}
                          <CustomTextInput
                            label={"Background"}
                            type="file"
                            accept={".jpg,.png,.jpeg"}
                            className="thumbnail"
                            onChange={onChangeBackground}
                          />
                          {imgBackground && (
                            <img
                              src={imgBackground}
                              className="img-background"
                            />
                          )}
                        </div>
                        <div>
                          <h5>5.Hình thức khuyến mãi</h5>
                          <Row>
                            <Button
                              className={
                                typePromotion === "code"
                                  ? "btn-form-promotion"
                                  : "btn-form-promotion-default"
                              }
                              outline
                              onClick={() => onFormPromotion("Mã khuyến mãi")}
                            >
                              Mã khuyến mãi
                            </Button>
                            <Button
                              className={
                                typePromotion === "event"
                                  ? "btn-form-promotion"
                                  : "btn-form-promotion-default"
                              }
                              outline
                              onClick={() =>
                                onFormPromotion("Chương trình khuyến mãi")
                              }
                            >
                              Chương trình khuyến mãi
                            </Button>
                            {typePromotion === "code" ? (
                              <CustomTextInput
                                placeholder="Nhập mã khuyến mãi"
                                className="input-promo-code"
                                type="text"
                                value={promoCode}
                                onChange={(e) => setPromoCode(e.target.value)}
                              />
                            ) : null}
                          </Row>
                        </div>
                        <div>
                          <h5>6. Loại khuyến mãi</h5>
                          <CustomTextInput
                            className="select-type-promo"
                            name="select"
                            type="select"
                            value={promoType}
                            onChange={(e) => setPromoType(e.target.value)}
                            body={
                              <>
                                <option value={"same_price"}>Đồng giá</option>
                                <option value={"order"}>
                                  Giảm giá theo đơn đặt
                                </option>
                                <option value={"partner_promotion"}>
                                  Khuyến mãi từ đối tác
                                </option>
                              </>
                            }
                          />
                          {promoType === "same_price" ? (
                            <CustomTextInput
                              label={"Đơn giá"}
                              placeholder="Nhập đơn giá"
                              className="input-promo-code"
                              type="number"
                              value={unitPrice}
                              onChange={(e) => setUnitPrice(e.target.value)}
                            />
                          ) : promoType === "order" ? (
                            <CustomTextInput
                              label={"Giá đơn đặt tối thiểu"}
                              placeholder="Nhập giá"
                              className="input-promo-code"
                              type="number"
                              value={minimumOrder}
                              onChange={(e) => setMinimumOrder(e.target.value)}
                            />
                          ) : (
                            <>
                              <CustomTextInput
                                label={"Tên đối tác"}
                                placeholder="Nhập tên đối tác"
                                className="input-promo-code"
                                type="text"
                                value={namebrand}
                                onChange={(e) => setNamebrand(e.target.value)}
                              />
                              <CustomTextInput
                                label={"Mã khuyến mãi"}
                                placeholder="Nhập mã khuyến mãi"
                                className="input-promo-code"
                                type="text"
                                value={codebrand}
                                onChange={(e) => setCodebrand(e.target.value)}
                              />
                            </>
                          )}
                        </div>
                        <div>
                          <h5>7. Hình thức giảm giá</h5>
                          <Row>
                            <Button
                              className={
                                formDiscount === "Giảm trực tiếp"
                                  ? "btn-form-promotion"
                                  : "btn-form-promotion-default"
                              }
                              outline
                              onClick={() => onFormDiscount("Giảm trực tiếp")}
                            >
                              Giảm trực tiếp
                            </Button>
                            <Button
                              className={
                                formDiscount === "Giảm theo phần trăm"
                                  ? "btn-form-promotion"
                                  : "btn-form-promotion-default"
                              }
                              outline
                              onClick={() =>
                                onFormDiscount("Giảm theo phần trăm")
                              }
                            >
                              Giảm theo phần trăm
                            </Button>
                            {formDiscount === "Giảm trực tiếp" ? (
                              <CustomTextInput
                                label={"Giá giảm "}
                                classNameForm="form-promo-discount"
                                placeholder="VNĐ"
                                className="input-promo-code"
                                type="number"
                                value={maximumDiscount}
                                onChange={(e) =>
                                  setMaximumDiscount(e.target.value)
                                }
                              />
                            ) : (
                              <Row className="row-discount">
                                <CustomTextInput
                                  label={"Giá trị giảm"}
                                  className="input-promo-discount"
                                  placeholder="%"
                                  type="number"
                                  value={reducedValue}
                                  onChange={(e) =>
                                    setReducedValue(e.target.value)
                                  }
                                />
                                <CustomTextInput
                                  label={"Giá giảm tối đa"}
                                  classNameForm="form-promo-discount"
                                  className="input-promo-discount"
                                  placeholder="VNĐ"
                                  type="number"
                                  value={maximumDiscount}
                                  onChange={(e) =>
                                    setMaximumDiscount(e.target.value)
                                  }
                                />
                              </Row>
                            )}
                          </Row>
                        </div>
                        <div>
                          {/* <h5>8. Dịch vụ áp dụng</h5>
                      <CustomTextInput
                        className="select-type-promo"
                        name="selectMulti"
                        type="select"
                        multiple={true}
                        body={
                          <>
                            <option value={"Đồng giá"}>Giúp việc thơ</option>
                            <option value={"Giảm giá theo đơn đặt"}>
                              Giảm giá theo đơn đặt
                            </option>
                            <option value={"Khuyến mãi từ đối tác"}>
                              Khuyến mãi từ đối tác
                            </option>
                          </>
                        }
                      /> */}
                        </div>
                      </Col>
                      <Col md={4}>
                        <div>
                          <h5>9. Đối tượng áp dụng</h5>
                          <Label>Nhóm khách hàng</Label>

                          <CustomTextInput
                            className="select-type-promo"
                            name="select"
                            type="select"
                            value={customer}
                            multiple={true}
                            onChange={(e) => {
                              onChooseMultiple(e.target.value);
                            }}
                            body={groupCustomer.map((item, index) => {
                              return (
                                <option key={index} value={item?._id}>
                                  {item?.name}
                                </option>
                              );
                            })}
                          />
                        </div>
                        <div>
                          <h5>10. Điều kiện áp dụng</h5>
                          <FormGroup check inline>
                            <Label check className="text-first">
                              Đặt lần đầu
                            </Label>
                            <Input
                              type="checkbox"
                              value={orderFirst}
                              onClick={() => setOrderFirst(!orderFirst)}
                            />
                          </FormGroup>
                        </div>
                        <div>
                          <h5>11. Số lượng mã khuyến mãi</h5>
                          <FormGroup check inline>
                            <Label check className="text-first">
                              Số lượng giới hạn
                            </Label>
                            <Input
                              type="checkbox"
                              value={limitedQuantity}
                              onClick={() =>
                                setLimitedQuantity(!limitedQuantity)
                              }
                            />
                          </FormGroup>
                          {limitedQuantity && (
                            <CustomTextInput
                              label={"Lượt sử dụng mỗi khách"}
                              placeholder="Số lượng"
                              className="input-promo-code"
                              type="number"
                              value={amount}
                              onChange={(e) => setAmount(e.target.value)}
                            />
                          )}
                        </div>
                        <div>
                          <h5>12. Số lần sử dụng khuyến mãi</h5>
                          <FormGroup check inline>
                            <Label check className="text-first">
                              Lần sử dụng khuyến mãi
                            </Label>
                            <Input
                              type="checkbox"
                              value={isUsePromo}
                              onClick={() => setIsUsePromo(!isUsePromo)}
                            />
                          </FormGroup>
                          {isUsePromo && (
                            <CustomTextInput
                              label={"Lần sử dụng mỗi khách hàng"}
                              placeholder="Số lượng"
                              className="input-promo-code"
                              type="number"
                              value={usePromo}
                              onChange={(e) => setUsePromo(e.target.value)}
                            />
                          )}
                        </div>
                        <div>
                          <h5>13. Thời gian khuyến mãi</h5>
                          <FormGroup check inline>
                            <Label check className="text-first">
                              Giới hạn ngày
                            </Label>
                            <Input
                              type="checkbox"
                              value={startDate}
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
                          <h5>14. Điểm quy đổi</h5>
                          <FormGroup check inline>
                            <Label check className="text-first">
                              Điểm quy đổi
                            </Label>
                            <Input
                              type="checkbox"
                              value={isExchangePoint}
                              onClick={() =>
                                setIsExchangePoint(!isExchangePoint)
                              }
                            />
                          </FormGroup>
                          {isExchangePoint && (
                            <CustomTextInput
                              label={"Điểm"}
                              placeholder="Nhập số điểm"
                              className="input-promo-code"
                              type="number"
                              value={exchangePoint}
                              onChange={(e) => setExchangePoint(e.target.value)}
                            />
                          )}
                        </div>

                        {create && (
                          <Button
                            className="btn_create_promotion"
                            color="warning"
                            onClick={onCreatePromotion}
                          >
                            Thêm khuyến mãi
                          </Button>
                        )}
                        {edit && (
                          <Button
                            className="btn_create_promotion"
                            color="warning"
                            onClick={onEditPromotion}
                          >
                            Sửa khuyến mãi
                          </Button>
                        )}
                      </Col>
                    </Row>
                  </Form>
                </div>
              ) : null}
              <div className="">
                <Card className="shadow">
                  <CardHeader className="border-0 card-header">
                    <Row className="align-items-center">
                      <Col className="text-left">
                        {!create && (
                          <Button
                            color="info"
                            onClick={() => setCreate(!create)}
                          >
                            Thêm khuyến mãi
                          </Button>
                        )}
                      </Col>
                      <Col>
                        <CustomTextInput placeholder="Tìm kiếm" type="text" />
                      </Col>
                    </Row>
                  </CardHeader>
                  <Table className="align-items-center table-flush" responsive>
                    <thead className="thead-light">
                      <tr>
                        <th scope="col">Tên Promotion</th>
                        <th scope="col">Mã code</th>
                        <th scope="col">Hạn</th>
                        <th scope="col" />
                      </tr>
                    </thead>
                    <tbody>
                      {promotion.length > 0 ? (
                        promotion.map((e) => (
                          <TableManagePromotion data={e} setId={setId} />
                        ))
                      ) : (
                        <></>
                      )}
                    </tbody>
                  </Table>
                  <CardFooter>
                    <nav aria-label="...">
                      <Pagination
                        className="pagination justify-content-end mb-0"
                        listClassName="justify-content-end mb-0"
                      >
                        <PaginationItem className="active">
                          <PaginationLink
                            href="#pablo"
                            onClick={(e) => e.preventDefault()}
                          >
                            1
                          </PaginationLink>
                        </PaginationItem>
                      </Pagination>
                    </nav>
                  </CardFooter>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
