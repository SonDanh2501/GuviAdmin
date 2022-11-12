import React from "react";
import { Button, Col, Form, FormGroup, Input, Label, Row } from "reactstrap";
import TableManagePromotion from "./tableManagePromotion.jsx";
import "./PromotionManage.scss";

export default function PromotionManage() {
  const [users, setUsers] = React.useState({
    code_phone_area: "",
    phone: "",
    email: "",
    name: "",
    password: "",
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
                    <Col md={6}>
                      <FormGroup>
                        <Label for="exampleEmail">Email</Label>
                        <Input
                          id="exampleEmail"
                          name="email"
                          placeholder="Enter your email address"
                          type="email"
                          value={users.email}
                          onChange={(e) =>
                            setUsers({ ...users, email: e.target.value })
                          }
                        />
                      </FormGroup>
                    </Col>
                    <Col md={6}>
                      <FormGroup>
                        <Label for="examplePassword">Password</Label>
                        <Input
                          id="examplePassword"
                          name="password"
                          placeholder="Enter password "
                          type="password"
                          value={users.password}
                          onChange={(e) =>
                            setUsers({ ...users, password: e.target.value })
                          }
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <FormGroup>
                    <Label for="exampleAddress">Name</Label>
                    <Input
                      id="exampleAddress"
                      name="address"
                      placeholder="Enter your name"
                      value={users.name}
                      onChange={(e) =>
                        setUsers({ ...users, name: e.target.value })
                      }
                    />
                  </FormGroup>
                  <Row>
                    <Col md={6}>
                      <FormGroup>
                        <Label for="exampleCity">Code phone area</Label>
                        <Input
                          id="exampleCity"
                          name="city"
                          value={users.code_phone_area}
                          onChange={(e) =>
                            setUsers({
                              ...users,
                              code_phone_area: e.target.value,
                            })
                          }
                        />
                      </FormGroup>
                    </Col>
                    <Col md={6}>
                      <FormGroup>
                        <Label for="exampleCity">Phone</Label>
                        <Input
                          id="exampleCity"
                          name="city"
                          value={users.phone}
                          onChange={(e) =>
                            setUsers({ ...users, phone: e.target.value })
                          }
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Button color="warning">Thêm người dùng</Button>
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
