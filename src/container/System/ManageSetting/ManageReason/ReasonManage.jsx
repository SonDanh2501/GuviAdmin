import React, { useState, useEffect } from "react";
import "./ReasonManage.scss";
import TableManageReason from "./TableManageReason.jsx";
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
import * as actions from "../../../../redux/actions/customerAction";
import CustomTextInput from "../../../../components/CustomTextInput/customTextInput";
import { getReason, getReasonTotal } from "../../../../redux/selectors/reason";
import { getReasons } from "../../../../redux/actions/reason";
import AddReason from "../../../../components/addReason/addReason";
import { loadingAction } from "../../../../redux/actions/loading";

export default function ReasonManage() {
  const dispatch = useDispatch();
  const reason = useSelector(getReason);
  const totalReason = useSelector(getReasonTotal);
  const [currentPage, setCurrentPage] = useState(0);

  React.useEffect(() => {
    dispatch(loadingAction.loadingRequest(true));
    dispatch(getReasons.getReasonsRequest({ start: 0, length: 10 }));
  }, [dispatch]);

  const handleClick = (e, index) => {
    e.preventDefault();
    setCurrentPage(index);
    const start = index * reason.length;
    dispatch(
      getReasons.getReasonsRequest({
        start: start > 0 ? start : 0,
        length: 10,
      })
    );
  };

  const pageCount = totalReason / 10;
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

  return (
    <React.Fragment>
      <div className="mt-2 p-3">
        <Card className="shadow">
          <CardHeader className="border-0 card-header">
            <Row className="align-items-center">
              <Col className="text-left">
                <AddReason />
              </Col>
              <Col>
                <CustomTextInput
                  placeholder="Tìm kiếm"
                  type="text"
                  // onChange={(e) => handleSearch(e.target.value)}
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
                <th>Lý do huỷ việc</th>
                <th>Mô tả</th>
                <th>Hình thức phạt (phạt tiền hoặc khoá app)</th>
                <th>Phạt tiền / Thời gian khoá app</th>
                <th>Đối tượng áp dụng</th>
                <th>Ghi chú</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {/* {dataFilter.length > 0
                    ? dataFilter.map((e) => <TableManageBanner data={e} />)
                    : banners &&
                      banners.map((e) => <TableManageBanner data={e} />)} */}
              {reason && reason.map((e) => <TableManageReason data={e} />)}
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
