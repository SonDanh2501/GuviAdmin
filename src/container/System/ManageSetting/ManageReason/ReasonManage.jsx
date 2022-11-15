import React, { useState, useEffect } from "react";
import "./ReasonManage.scss";
import TableManageReason from "./TableManageReason.jsx";
import { Form, Row, Col, FormGroup, Label, Input, Button } from "reactstrap";
import { useSelector, useDispatch } from "react-redux";
import * as actions from "../../../../redux/actions/customerAction";

export default function ReasonManage() {
  const [reasons, setReasons] = React.useState({
    title: "",
    description: "",
    punish_type: "",
    punish:"",
    apply_user:"",
    note:"",
  });
  const dispatch = useDispatch();
  const onSubmit = React.useCallback(() => {
    dispatch(actions.createCustomer.createCustomerRequest(reasons));
    setReasons({
      title: "",
      description: "",
      punish_type: "",
      punish:"",
      apply_user:"",
      note:"",
    });
    window.location.reload();
  }, [reasons, dispatch]);

  return (
    <React.Fragment>
      <div className="reason-redux-container">
        <div className="reason-redux-body mt-5 col-md-12">
          <div className="container">
            <div className="column">
              <div className="">
                <Form>
                  <Row>
                    <Col md={6}>
                      <FormGroup>
                        <Label for="exampleTitle">Lý do huỷ việc</Label>
                        <Input
                          id="exampleTitle"
                          name="title"
                          placeholder="Nhập lý do huỷ việc"
                          type="text"
                          value={reasons.title}
                          onChange={(e) =>
                            setReasons({ ...reasons, title: e.target.value })
                          }
                        />
                      </FormGroup>
                    </Col>
                    <Col md={6}>
                      <FormGroup>
                        <Label for="exampleDescription">Mô tả</Label>
                        <Input
                          id="exampleDescription"
                          name="description"
                          placeholder="Nhập mô tả "
                          type="description"
                          value={reasons.description}
                          onChange={(e) =>
                            setReasons({ ...reasons, description: e.target.value })
                          }
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={6}>

                    <FormGroup>
                    <Label for="examplePunishType">Hình thức phạt</Label>
                    <Input
                      id="examplePunishType"
                      name="punish_type"
                      placeholder="Nhập hình thức phạt"
                      value={reasons.punish_type}
                      onChange={(e) =>
                        setReasons({ ...reasons, punish_type: e.target.value })
                      }
                    />
                  </FormGroup>
                    </Col>
                    <Col md={6}>
                    <FormGroup>
                    <Label for="exampleNote">Ghi chú</Label>
                    <Input
                      id="exampleNote"
                      name="note"
                      placeholder="Nhập ghi chú"
                      value={reasons.note}
                      onChange={(e) =>
                        setReasons({ ...reasons, note: e.target.value })
                      }
                    />
                  </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={6}>
                      <FormGroup>
                        <Label for="examplePunish">Phạt tiền / Thời gian khoá</Label>
                        <Input
                          id="examplePunish"
                          name="punish"
                          placeholder="Nhập phạt tiền / Thời gian khoá"
                          value={reasons.punish}
                          onChange={(e) =>
                            setReasons({
                              ...reasons,
                              punish: e.target.value,
                            })
                          }
                        />
                      </FormGroup>
                    </Col>
                    <Col md={6}>
                      <FormGroup>
                        <Label for="exampleApplyUser">Đối tượng áp dụng</Label>
                        <Input
                          id="exampleApplyUser"
                          name="apply_user"
                          placeholder="Nhập đối tượng áp dụng"
                          value={reasons.apply_user}
                          onChange={(e) =>
                            setReasons({ ...reasons, apply_user: e.target.value })
                          }
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Button color="warning" onClick={onSubmit}>
                    Thêm lý do huỷ việc
                  </Button>
                </Form>
              </div>

              <div className="">
                <TableManageReason/>
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
