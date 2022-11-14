import React from "react";
import { Button, Col, Form, FormGroup, Input, Label, Row } from "reactstrap";
import TableManagePromotion from "./tableManagePromotion.jsx";
import "./PromotionManage.scss";
import CustomTextInput from "../../../../components/CustomTextInput/customTextInput.js";

export default function PromotionManage() {
  const [promotions, setPromotions] = React.useState({
    titleVN: "",
    titleEN: "",
  });

  return (
    <React.Fragment>
      <div className="user-redux-container">
        <div className="user-redux-body mt-5 col-md-12">
          <div className="container">
            <div className="column">
              <div className="">
                <Form>
                  <Row>
                    <Col md={4}>
                      <h5>1. Tiêu đề</h5>
                      <CustomTextInput
                        label={"Tiếng Việt"}
                        placeholder="Nhập tiêu đề tiếng việt"
                        value={promotions.titleVN}
                        onChange={(e) =>
                          setPromotions({
                            ...promotions,
                            titleVN: e.target.value,
                          })
                        }
                      />
                      <CustomTextInput
                        label={"Tiếng Anh"}
                        placeholder="Nhập tiêu đề tiếng anh"
                        value={promotions.titleEN}
                        onChange={(e) =>
                          setPromotions({
                            ...promotions,
                            titleEN: e.target.value,
                          })
                        }
                      />
                      <h5>2. Tiêu đề</h5>
                      <CustomTextInput
                        label={"Tiếng Việt"}
                        placeholder="Nhập tiêu đề tiếng việt"
                        value={promotions.titleVN}
                        onChange={(e) =>
                          setPromotions({
                            ...promotions,
                            titleVN: e.target.value,
                          })
                        }
                      />
                      <CustomTextInput
                        label={"Tiếng Anh"}
                        placeholder="Nhập tiêu đề tiếng anh"
                        value={promotions.titleEN}
                        onChange={(e) =>
                          setPromotions({
                            ...promotions,
                            titleEN: e.target.value,
                          })
                        }
                      />
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
