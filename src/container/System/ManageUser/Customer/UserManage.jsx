import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Card,
  CardFooter,
  CardHeader,
  Col,
  Pagination,
  PaginationItem,
  PaginationLink,
  Row,
  Table,
} from "reactstrap";
import { searchCustomers } from "../../../../api/customer";
import AddCustomer from "../../../../components/addCustomer/addCustomer";
import CustomTextInput from "../../../../components/CustomTextInput/customTextInput";
import { getCustomers } from "../../../../redux/actions/customerAction";
import { loadingAction } from "../../../../redux/actions/loading";
import _debounce from "lodash/debounce";
import {
  getCustomer,
  getCustomerTotalItem,
} from "../../../../redux/selectors/customer";
import TableManageUser from "./TableManageUser.jsx";
import "./UserManage.scss";

export default function UserManage() {
  const [dataFilter, setDataFilter] = useState([]);
  const [totalFilter, setTotalFilter] = useState("");
  const [valueFilter, setValueFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const customers = useSelector(getCustomer);
  const customerTotal = useSelector(getCustomerTotalItem);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadingAction.loadingRequest(true));
    dispatch(getCustomers.getCustomersRequest({ start: 0, length: 10 }));
  }, [dispatch]);

  const handleClick = useCallback(
    (e, index) => {
      e.preventDefault();
      setCurrentPage(index);
      const start =
        dataFilter.length > 0
          ? index * dataFilter.length
          : index * customers.length;
      dataFilter.length > 0
        ? searchCustomers(valueFilter, start, 10)
            .then((res) => {
              setDataFilter(res.data);
            })
            .catch((err) => console.log(err))
        : dispatch(
            getCustomers.getCustomersRequest({
              start: start > 0 ? start : 0,
              length: 10,
            })
          );
    },
    [customers, dataFilter, valueFilter]
  );

  const pageCount =
    dataFilter.length > 0 ? totalFilter / 10 : customerTotal / 10;
  let pageNumbers = [];
  for (let i = 0; i < pageCount; i++) {
    pageNumbers.push(
      <PaginationItem key={i} active={currentPage === i ? true : false}>
        <PaginationLink onClick={(e) => handleClick(e, i)} href="#">
          {i + 1}
        </PaginationLink>
      </PaginationItem>
    );
  }

  const handleSearch = useCallback(
    _debounce((value) => {
      setValueFilter(value);
      searchCustomers(value, 0, 10)
        .then((res) => {
          setDataFilter(res.data);
          setTotalFilter(res.totalItem);
        })
        .catch((err) => console.log(err));
    }, 1000),
    []
  );

  return (
    <React.Fragment>
      <div className="mt-2 p-3">
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
          <Table
            className="align-items-center table-flush"
            responsive={true}
            hover={true}
          >
            <thead>
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
                <PaginationItem
                  className={currentPage === 0 ? "disabled" : "enable"}
                >
                  <PaginationLink
                    onClick={(e) => handleClick(e, currentPage - 1)}
                    href="#"
                  >
                    <i class="uil uil-previous"></i>
                  </PaginationLink>
                </PaginationItem>
                {pageNumbers}
                <PaginationItem disabled={currentPage >= pageCount - 1}>
                  <PaginationLink
                    onClick={(e) => handleClick(e, currentPage + 1)}
                    href="#"
                  >
                    <i class="uil uil-step-forward"></i>
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
