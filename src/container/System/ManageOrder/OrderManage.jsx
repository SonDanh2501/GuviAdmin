import React, { useCallback, useState } from "react";
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
import { loadingAction } from "../../../redux/actions/loading";
import { getOrder } from "../../../redux/actions/order";
import {
  getOrderSelector,
  getOrderTotal,
} from "../../../redux/selectors/order";
import { getService } from "../../../redux/selectors/service";
import "./OrderManage.scss";
import CustomTextInput from "../../../components/CustomTextInput/customTextInput";
import TableManageOrder from "./TableManageOrder";
import { filterOrderApi, searchOrderApi } from "../../../api/order";

export default function OrderManage() {
  const [dataFilter, setDataFilter] = useState([]);
  const [totalFilter, setTotalFilter] = useState();
  const [valueFilter, setValueFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [search, setSearch] = useState(false);
  const dispatch = useDispatch();
  const listOrder = useSelector(getOrderSelector);
  const orderTotal = useSelector(getOrderTotal);
  const service = useSelector(getService);
  React.useEffect(() => {
    dispatch(loadingAction.loadingRequest(true));
    dispatch(getOrder.getOrderRequest({ start: 0, length: 10 }));
  }, [dispatch]);

  const handleClick = useCallback(
    (e, index) => {
      e.preventDefault();
      setCurrentPage(index);
      const start =
        dataFilter.length > 0
          ? index * dataFilter.length
          : index * listOrder.length;

      dataFilter.length > 0 && search
        ? searchOrderApi(start, 10, valueFilter)
            .then((res) => {
              setDataFilter(res.data);
              setTotalFilter(res.totalItem);
            })
            .catch((err) => console.log(err))
        : dataFilter.length > 0
        ? filterOrderApi(start, 10, valueFilter)
            .then((res) => {
              setDataFilter(res.data);
            })
            .catch((err) => console.log(err))
        : dispatch(
            getOrder.getOrderRequest({
              start: start > 0 ? start : 0,
              length: 10,
            })
          );
    },
    [valueFilter, dataFilter, listOrder]
  );

  const pageCount = dataFilter.length > 0 ? totalFilter / 10 : orderTotal / 10;
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

  const handlefilter = useCallback((value) => {
    setSearch(false);
    setValueFilter(value);
    if (value === "filter") {
      dispatch(getOrder.getOrderRequest({ start: 0, length: 10 }));
      setDataFilter([]);
    } else {
      filterOrderApi(0, 10, value)
        .then((res) => {
          setDataFilter(res.data);
          setTotalFilter(res.totalItem);
        })
        .catch((err) => console.log(err));
    }
  }, []);

  const handleSearch = useCallback((value) => {
    setValueFilter(value);
    setSearch(true);
    searchOrderApi(0, 10, value)
      .then((res) => {
        setDataFilter(res.data);
        setTotalFilter(res.totalItem);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <React.Fragment>
      <div className="mt-2 p-3">
        <Card className="shadow">
          <CardHeader className="border-0 card-header">
            <Row className="align-items-center">
              <Col className="text-left">
                <CustomTextInput
                  name="select"
                  type="select"
                  className="filter-input"
                  onChange={(e) => handlefilter(e.target.value)}
                  body={
                    <>
                      <option value={"filter"}>Filter</option>
                      {service.map((item, index) => {
                        return (
                          <option key={index} value={item?._id}>
                            {item?.title?.vi}
                          </option>
                        );
                      })}
                    </>
                  }
                />
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
                <th scope="col">Loại dịch vụ</th>
                <th scope="col">Tên khách hàng</th>
                <th scope="col">Đơn giá</th>
                <th scope="col">Tên cộng tác viên</th>
                <th scope="col">Ngày làm</th>
                <th scope="col">Thời gian</th>
                <th scope="col">Trạng thái</th>
                <th scope="col"></th>
              </tr>
            </thead>
            <tbody>
              {dataFilter.length > 0
                ? dataFilter.map((e) => <TableManageOrder data={e} />)
                : listOrder &&
                  listOrder.map((e) => <TableManageOrder data={e} />)}
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
                    previous
                    href="#"
                  >
                    <i class="uil uil-previous"></i>
                  </PaginationLink>
                </PaginationItem>
                {pageNumbers}
                <PaginationItem disabled={currentPage >= pageCount - 1}>
                  <PaginationLink
                    onClick={(e) => handleClick(e, currentPage + 1)}
                    next
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
