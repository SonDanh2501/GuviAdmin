import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  Card,
  CardFooter,
  CardHeader,
  Col,
  Form,
  Pagination,
  PaginationItem,
  PaginationLink,
  Row,
  Table,
} from "reactstrap";
import { searchCustomers } from "../../../../api/customer";
import AddCustomer from "../../../../components/addCustomer/addCustomer";
import CustomTextInput from "../../../../components/CustomTextInput/customTextInput";
import {
  createCustomer,
  getCustomers,
  updateCustomer,
} from "../../../../redux/actions/customerAction";
import { getCustomer } from "../../../../redux/selectors/customer";
import TableManageUser from "./TableManageUser.jsx";
import "./UserManage.scss";

export default function UserManage() {
  const [create, setCreate] = React.useState(false);
  const [edit, setEdit] = React.useState(false);
  const [id, setId] = React.useState("");
  const [codePhone, setCodePhone] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [dataFilter, setDataFilter] = useState([]);
  const customers = useSelector(getCustomer);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getCustomers.getCustomersRequest());
  }, [dispatch]);

  const onSubmit = React.useCallback(() => {
    dispatch(
      createCustomer.createCustomerRequest({
        code_phone_area: codePhone,
        phone: phone,
        email: email,
        name: name,
        password: password,
      })
    );
  }, [codePhone, phone, email, name, password, dispatch]);

  const setItemEdit = (itemEdit) => {
    setCodePhone(itemEdit?.code_phone_area);
    setPhone(itemEdit?.phone);
    setEmail(itemEdit?.email);
    setName(itemEdit?.name);
    setId(itemEdit?._id);
    setEdit(true);
    setCreate(false);
    window.scrollTo(0, 0);
  };

  const onEditCustomer = useCallback(() => {
    dispatch(
      updateCustomer.updateCustomerRequest({
        id: id,
        data: {
          code_phone_area: codePhone,
          phone: phone,
          is_active: true,
          email: email,
          name: name,
        },
      })
    );
  }, [id, codePhone, phone, email, name]);

  const handleSearch = useCallback((value) => {
    searchCustomers(value)
      .then((res) => setDataFilter(res))
      .catch((err) => console.log(err));
  }, []);

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
                        <CustomTextInput
                          label={"Password"}
                          id="examplePassword"
                          name="password"
                          placeholder="Nhập password"
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                      )}
                    </Col>
                  </Row>
                  <CustomTextInput
                    label={"Tên khách hàng"}
                    id="exampleName"
                    name="name"
                    placeholder="Nhập tên khách hàng"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <Row>
                    <Col md={6}>
                      <CustomTextInput
                        label={"Code phone area"}
                        id="exampleCodePhoneArea"
                        placeholder="Nhập code phone area"
                        name="code_phone_area"
                        type="select"
                        className="select-code-phone"
                        value={codePhone}
                        onChange={(e) => setCodePhone(e.target.value)}
                        body={
                          <>
                            <option value={"+84"}>+84</option>
                            <option value={"+1"}>+1</option>
                          </>
                        }
                      />
                    </Col>
                    <Col md={6}>
                      <CustomTextInput
                        label={"Số điện thoại"}
                        id="examplePhone"
                        placeholder="Nhập số điện thoại"
                        name="phone"
                        type="number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </Col>
                  </Row>
                  {create && (
                    <Button color="warning" onClick={onSubmit}>
                      Thêm người dùng
                    </Button>
                  )}
                  {edit && (
                    <Button color="warning" onClick={onEditCustomer}>
                      Sửa người dùng
                    </Button>
                  )}
                </Form>
              ) : (
                <></>
              )}

              <div className="mt-5">
                <Card className="shadow">
                  <CardHeader className="border-0 card-header">
                    <Row className="align-items-center">
                      <Col className="text-left">
                        {/* {!create && (
                          <Button
                            color="info"
                            onClick={() => setCreate(!create)}
                          >
                            Thêm người dùng
                          </Button>
                        )} */}
                        <AddCustomer />
                      </Col>
                      <Col>
                        <CustomTextInput
                          placeholder="Tìm kiếm"
                          type="text"
                          onChange={(e) => handleSearch(e.target.value)}
                        />
                      </Col>
                    </Row>
                  </CardHeader>
                  <Table className="align-items-center table-flush " responsive>
                    <thead className="thead-light">
                      <tr>
                        <th scope="col">Tên người dùng</th>
                        <th scope="col">SĐT</th>
                        <th scope="col">Email</th>
                        <th scope="col">Ngày sinh</th>
                        <th scope="col" />
                      </tr>
                    </thead>
                    <tbody>
                      {dataFilter.length > 0
                        ? dataFilter.map((e) => (
                            <TableManageUser
                              data={e}
                              setItemEdit={setItemEdit}
                            />
                          ))
                        : customers &&
                          customers.map((e) => (
                            <TableManageUser
                              data={e}
                              setItemEdit={setItemEdit}
                            />
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
