import React from "react";
import { Button, Col, Form, FormGroup, Input, Label, Row } from "reactstrap";
import TableManagePromotion from "./tableManagePromotion.jsx";
import "./PromotionManage.scss";
import CustomTextInput from "../../../../components/CustomTextInput/customTextInput.js";
import { normalizeUnits } from "moment";

export default function PromotionManage() {
  const [formPromorion, setPromotion] = React.useState("Mã khuyến mãi");
  const [titleVN, setTitleVN] = React.useState("");
  const [titleEN, setTitleEN] = React.useState("");
  const [shortDescriptionVN, setShortDescriptionVN] = React.useState("");
  const [shortDescriptionEN, setShortDescriptionEN] = React.useState("");
  const [descriptionVN, setDescriptionVN] = React.useState("");
  const [descriptionEN, setDescriptionEN] = React.useState("");
  const [promoCode, setPromoCode] = React.useState("");
  const [promoType, setPromoType] = React.useState("Đồng giá");
  const [unitPrice, setUnitPrice] = React.useState("");
  const [minimumOrder, setMinimumOrder] = React.useState("");
  const [namebrand, setNamebrand] = React.useState("");
  const [codebrand, setCodebrand] = React.useState("");

  const onFormPromotion = (title) => {
    setPromotion(title);
  };

  return (
    <React.Fragment>
      <div className="user-redux-container">
        <div className="user-redux-body mt-5 col-md-12">
          <div className="container">
            <div className="column">
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
                        onChange={(e) => setDescriptionVN(e.target.value)}
                      />
                      <CustomTextInput
                        label={"Tiếng Anh"}
                        placeholder="Nhập mô tả tiếng anh"
                        type="textarea"
                        value={shortDescriptionEN}
                        onChange={(e) => setDescriptionEN(e.target.value)}
                      />
                      <h5>3. Mô tả chi tiết</h5>
                      <CustomTextInput
                        label={"Tiếng Việt"}
                        placeholder="Nhập mô tả tiếng việt"
                        value={descriptionVN}
                        type="textarea"
                        onChange={(e) => setDescriptionVN(e.target.value)}
                      />
                      <CustomTextInput
                        label={"Tiếng Anh"}
                        placeholder="Nhập mô tả tiếng anh"
                        type="textarea"
                        value={descriptionEN}
                        onChange={(e) => setDescriptionEN(e.target.value)}
                      />
                      <h5>4. Thumbnail/Background</h5>
                      <CustomTextInput
                        label={"Thumbnail"}
                        type="file"
                        accept={".jpg,.png,.jpeg"}
                        className="thumbnail"
                      />
                      <CustomTextInput
                        label={"Background"}
                        type="file"
                        accept={".jpg,.png,.jpeg"}
                        className="thumbnail"
                      />
                    </Col>
                    <Col md={4}>
                      <div>
                        <h5>5.Hình thức khuyến mãi</h5>
                        <Row>
                          <Button
                            className={
                              formPromorion === "Mã khuyến mãi"
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
                              formPromorion === "Chương trình khuyến mãi"
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
                          {formPromorion === "Mã khuyến mãi" ? (
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
                              <option value={"Đồng giá"}>Đồng giá</option>
                              <option value={"Giảm giá theo đơn đặt"}>
                                Giảm giá theo đơn đặt
                              </option>
                              <option value={"Khuyến mãi từ đối tác"}>
                                Khuyến mãi từ đối tác
                              </option>
                            </>
                          }
                        />
                        {promoType === "Đồng giá" ? (
                          <CustomTextInput
                            label={"Đơn giá"}
                            placeholder="Nhập đơn giá"
                            className="input-promo-code"
                            type="number"
                            value={unitPrice}
                            onChange={(e) => setUnitPrice(e.target.value)}
                          />
                        ) : promoType === "Giảm giá theo đơn đặt" ? (
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
                    </Col>
                    <Col md={4}>
                      <FormGroup>
                        <Label for="examplePassword">Password</Label>
                        <Input
                          id="examplePassword"
                          name="password"
                          placeholder="Enter password "
                          type="password"
                        />
                      </FormGroup>
                    </Col>
                  </Row>

                  <Button color="warning">Thêm khuyến mãi</Button>
                </Form>
              </div>

              <div className="">
                <TableManagePromotion />
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
