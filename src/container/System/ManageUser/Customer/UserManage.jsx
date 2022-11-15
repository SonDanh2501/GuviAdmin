import React, { useState, useEffect } from "react";
import "./UserManage.scss";
import TableManageUser from "./TableManageUser.jsx";
import { Form, Row, Col, FormGroup, Label, Input, Button } from "reactstrap";
import { useSelector, useDispatch } from "react-redux";
import * as actions from "../../../../redux/actions/customerAction";

export default function UserManage() {
  const [users, setUsers] = React.useState({
    code_phone_area: "",
    phone: "",
    email: "",
    name: "",
    password: "",
  });
  const dispatch = useDispatch();
  const onSubmit = React.useCallback(() => {
    dispatch(actions.createCustomer.createCustomerRequest(users));
    setUsers({
      code_phone_area: "",
      phone: "",
      email: "",
      name: "",
      password: "",
    });
    window.location.reload();
  }, [users, dispatch]);

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
                          placeholder="Nhập email"
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
                          placeholder="Nhập password "
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
                    <Label for="exampleName">Tên khách hàng</Label>
                    <Input
                      id="exampleName"
                      name="name"
                      placeholder="Nhập tên khách hàng"
                      value={users.name}
                      onChange={(e) =>
                        setUsers({ ...users, name: e.target.value })
                      }
                    />
                  </FormGroup>
                  <Row>
                    <Col md={6}>
                      <FormGroup>
                        <Label for="exampleCodePhoneArea">Code phone area</Label>
                        <Input
                          id="exampleCodePhoneArea"
                      placeholder="Nhập code phone area"
                      name="code_phone_area"
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
                        <Label for="examplePhone">Số điện thoại</Label>
                        <Input
                          id="examplePhone"
                      placeholder="Nhập số điện thoại"
                          name="phone"
                          value={users.phone}
                          onChange={(e) =>
                            setUsers({ ...users, phone: e.target.value })
                          }
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Button color="warning" onClick={onSubmit}>
                    Thêm người dùng
                  </Button>
                </Form>
              </div>

              <div className="">
                <TableManageUser />
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
