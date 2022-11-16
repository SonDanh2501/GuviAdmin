import React, { useState, useEffect } from "react";
import "./UserManage.scss";
import TableManageUser from "./TableManageUser.jsx";
import {
  Form,
  Row,
  Col,
  FormGroup,
  Label,
  Input,
  Button,
  Card,
  CardHeader,
  Table,
  CardFooter,
  Pagination,
  PaginationItem,
  PaginationLink,
} from "reactstrap";
import { useSelector, useDispatch } from "react-redux";
import {
  createCustomer,
  getCustomers,
} from "../../../../redux/actions/customerAction";
import { getCustomer } from "../../../../redux/selectors/customer";
import CustomTextInput from "../../../../components/CustomTextInput/customTextInput";

export default function UserManage() {
  const [users, setUsers] = React.useState({
    code_phone_area: "",
    phone: "",
    email: "",
    name: "",
    password: "",
  });
  const [create, setCreate] = React.useState(false);
  const [edit, setEdit] = React.useState(false);
  const [codePhone, setCodePhone] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const customers = useSelector(getCustomer);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getCustomers.getCustomersRequest());
  }, [dispatch]);

  const onSubmit = React.useCallback(() => {
    dispatch(createCustomer.createCustomerRequest(users));
    setUsers({
      code_phone_area: "",
      phone: "",
      email: "",
      name: "",
      password: "",
    });
  }, [users, dispatch]);

  const setItemEdit = (itemEdit) => {
    setUsers({
      code_phone_area: itemEdit?.code_phone_area,
      phone: itemEdit?.phone,
      email: itemEdit?.email,
      name: itemEdit?.name,
    });
    setEdit(true);
  };

  return (
    <React.Fragment>
      <div className="user-redux-container">
        <div className="user-redux-body mt-5 col-md-12">
          <div className="container">
            <div className="column">
              {create || edit ? (
                <Form>
                  <Row>
                    <Col md={6}>
                      <CustomTextInput
                        label={"Email"}
                        id="exampleEmail"
                        name="email"
                        placeholder="Nhập email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </Col>
                    <Col md={6}>
                      {create && (
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
                      )}
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
                        <Label for="exampleCodePhoneArea">
                          Code phone area
                        </Label>
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
                  {create && (
                    <Button color="warning" onClick={onSubmit}>
                      Thêm người dùng
                    </Button>
                  )}
                  {edit && (
                    <Button color="warning" onClick={onSubmit}>
                      Sửa người dùng
                    </Button>
                  )}
                </Form>
              ) : (
                <></>
              )}

              <div className=" mt-5">
                <Card className="shadow">
                  <CardHeader className="border-0 card-header">
                    <Row className="align-items-center">
                      <Col className="text-left">
                        {!create && (
                          <Button
                            color="info"
                            onClick={() => setCreate(!create)}
                          >
                            Thêm người dùng
                          </Button>
                        )}
                      </Col>
                      <Col>
                        <CustomTextInput placeholder="Tìm kiếm" type="text" />
                      </Col>
                    </Row>
                  </CardHeader>
                  <Table className="align-items-center table-flush " responsive>
                    <thead className="thead-light">
                      <tr>
                        <th scope="col">Tên Promotion</th>
                        <th scope="col">Mã code</th>
                        <th scope="col">Hạn</th>
                        <th scope="col" />
                      </tr>
                    </thead>
                    <tbody>
                      {customers.length > 0 &&
                        customers.map((e) => (
                          <TableManageUser data={e} setItemEdit={setItemEdit} />
                        ))}
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
