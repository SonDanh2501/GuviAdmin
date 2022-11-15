import React from "react";
import { useSelector, useDispatch } from "react-redux";
import TableManageCollaborator from "./TableManageCollaborator.jsx";
import "./CollaboratorManage.scss";
import * as actions from "../../../../redux/actions/collaborator";
import { Form, Row, Col, FormGroup, Label, Input, Button } from "reactstrap";

export default function CollaboratorManage() {
  const [collaborators, setCollaborators] = React.useState({
    code_phone_area: "",
    phone: "",
    email: "",
    name: "",
    password: "",
    identify: "",
  });
  const dispatch = useDispatch();
  const onSubmit = React.useCallback(() => {
    dispatch(
      actions.createCollaborator.createCollaboratorRequest(collaborators)
    );
    setCollaborators({
      code_phone_area: "",
      phone: "",
      email: "",
      name: "",
      password: "",
      identify: "",
    });
    window.location.reload();
  }, [collaborators, dispatch]);

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
                          value={collaborators.email}
                          onChange={(e) =>
                            setCollaborators({
                              ...collaborators,
                              email: e.target.value,
                            })
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
                          placeholder="Nhập password"
                          type="password"
                          value={collaborators.password}
                          onChange={(e) =>
                            setCollaborators({
                              ...collaborators,
                              password: e.target.value,
                            })
                          }
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row> 
                  <Col md={6}> 
                  <FormGroup>
                  <Label for="exampleName">Tên cộng tác viên</Label>
                    <Input
                        id="exampleName"
                        name="name"
                        placeholder="Nhập tên cộng tác viên"
                      value={collaborators.name}
                      onChange={(e) =>
                        setCollaborators({
                          ...collaborators,
                          name: e.target.value,
                        })
                      }
                    />
                  </FormGroup>
                  </Col>

                  <Col md={6}>
                      <FormGroup>
                        <Label for="exampleCMND/CCCD">CMND/CCCD</Label>
                        <Input
                          id="exampleCMND/CCCD"
                      placeholder="Nhập CMND/CCCD"
                      name="identify"
                          value={collaborators.identify}
                          onChange={(e) =>
                            setCollaborators({
                              ...collaborators,
                              identify: e.target.value,
                            })
                          }
                        />
                      </FormGroup>
                    </Col>
                  </Row>
              
                  <Row>
                    <Col md={6}>
                      <FormGroup>
                        <Label for="exampleCity">Code phone area</Label>
                        <Input
                          id="exampleCodePhoneArea"
                          placeholder="Nhập code phone area"
                          name="code_phone_area"
                          value={collaborators.code_phone_area}
                          onChange={(e) =>
                            setCollaborators({
                              ...collaborators,
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
                          value={collaborators.phone}
                          onChange={(e) =>
                            setCollaborators({
                              ...collaborators,
                              phone: e.target.value,
                            })
                          }
                        />
                      </FormGroup>
                    </Col>
                   
                  </Row>

                  <Button color="warning" onClick={onSubmit}>
                    Thêm cộng tác viên
                  </Button>
                </Form>
              </div>

              <div className="">
                <TableManageCollaborator />
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
