import React, { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
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
import AddGroupService from "../../../../../components/addGroupService/addGroupService";
import { getGroupServiceAction } from "../../../../../redux/actions/service";
import {
  getGroupService,
  getGroupServiceTotal,
} from "../../../../../redux/selectors/service";
import "./GroupServiceManage.scss";
import TableManageGroupService from "./TableManageGroupService";

export default function GroupServiceManage() {
  const dispatch = useDispatch();
  const [dataFilter, setDataFilter] = useState([]);

  const [currentPage, setCurrentPage] = useState(0);
  const listGroupService = useSelector(getGroupService);
  const totalGroupService = useSelector(getGroupServiceTotal);
  React.useEffect(() => {
    // dispatch(loadingAction.loadingRequest(true));
    dispatch(getGroupServiceAction.getGroupServiceRequest(0, 10));
  }, [dispatch]);

  const handleClick = useCallback(
    (e, index) => {
      e.preventDefault();
      setCurrentPage(index);
      const start =
        dataFilter.length > 0
          ? index * dataFilter.length
          : index * listGroupService.length;

      dispatch(
        getGroupServiceAction.getGroupServiceRequest({
          start: start > 0 ? start : 0,
          length: 10,
        })
      );
    },
    [dataFilter]
  );

  const pageCount = totalGroupService / 10;
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
                <AddGroupService />
              </Col>
              <Col>
                {/* <CustomTextInput
                  placeholder="Tìm kiếm"
                  type="text"
                  onChange={(e) => handleSearch(e.target.value)}
                /> */}
              </Col>
            </Row>
          </CardHeader>
          <Table className="align-items-center table-flush " responsive>
            <thead className="thead-light">
              <tr>
                <th scope="col">Image</th>
                <th scope="col">Title</th>
                <th scope="col">Type</th>
                <th scope="col" />
              </tr>
            </thead>
            <tbody>
              {listGroupService &&
                listGroupService.map((e) => (
                  <TableManageGroupService data={e} />
                ))}
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
      <Outlet />
    </React.Fragment>
  );
}
