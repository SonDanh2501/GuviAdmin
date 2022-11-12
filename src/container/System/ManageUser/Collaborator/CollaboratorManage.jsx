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
                          placeholder="Enter your email address"
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
                          placeholder="Enter password "
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
                  <FormGroup>
                    <Label for="exampleAddress">Name</Label>
                    <Input
                      id="exampleAddress"
                      name="address"
                      placeholder="Enter your name"
                      value={collaborators.name}
                      onChange={(e) =>
                        setCollaborators({
                          ...collaborators,
                          name: e.target.value,
                        })
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
                        <Label for="exampleCity">Phone</Label>
                        <Input
                          id="exampleCity"
                          name="city"
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
                    <Col md={6}>
                      <FormGroup>
                        <Label for="exampleCity">identify</Label>
                        <Input
                          id="exampleCity"
                          name="city"
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
