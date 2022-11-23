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

  const handleSearch = useCallback((value) => {
    searchCustomers(value)
      .then((res) => setDataFilter(res))
      .catch((err) => console.log(err));
  }, []);

  console.log(dataFilter);

  return (
    <React.Fragment>
      <div className="mt-5">
        <Card className="shadow">
          <CardHeader className="border-0 card-header">
            <Row className="align-items-center">
              <Col className="text-left">
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
          <Table responsive>
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
                ? dataFilter.map((e) => <TableManageUser data={e} />)
                : customers &&
                  customers.map((e) => <TableManageUser data={e} />)}
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
    </React.Fragment>
  );
}
