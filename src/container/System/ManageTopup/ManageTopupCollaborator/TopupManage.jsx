import _debounce from "lodash/debounce";
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
import CustomTextInput from "../../../../components/CustomTextInput/customTextInput";
import { loadingAction } from "../../../../redux/actions/loading";
import "./TopupManage.scss";

import AddTopup from "../../../../components/addTopup/addTopup";
import Withdraw from "../../../../components/withdraw/withdraw";
import { getTopupCollaborator } from "../../../../redux/actions/topup";
import { getTopupCTV, totalTopupCTV } from "../../../../redux/selectors/topup";
import TableManageTopup from "./TableManageTopup";
import { searchTopupCollaboratorApi } from "../../../../api/topup";

export default function TopupManage() {
  const [dataFilter, setDataFilter] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const listCollaborators = useSelector(getTopupCTV);
  const totalCollaborators = useSelector(totalTopupCTV);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadingAction.loadingRequest(true));
    dispatch(
      getTopupCollaborator.getTopupCollaboratorRequest({ start: 0, length: 10 })
    );
  }, [dispatch]);

  const handleSearch = useCallback(
    _debounce((value) => {
      searchTopupCollaboratorApi(value, 0, 10)
        .then((res) => setDataFilter(res.data))
        .catch((err) => console.log(err));
    }, 1000),
    []
  );
  const handleClick = (e, index) => {
    e.preventDefault();
    setCurrentPage(index);
    const start = index * listCollaborators.length;
    dispatch(
      getTopupCollaborator.getTopupCollaboratorRequest({
        start: start > 0 ? start : 0,
        length: 10,
      })
    );
  };

  const pageCount = totalCollaborators / 10;
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
              <Col className="text-left add">
                <div>
                  <AddTopup />
                </div>
                <div className="withdraw">
                  <Withdraw />
                </div>
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
            <thead>
              <tr>
                <th>Tên cộng tác viên</th>
                <th>Số tiền</th>
                <th>Nạp/rút</th>
                <th>Nội dung</th>
                <th>Ngày nạp</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {dataFilter.length > 0
                ? dataFilter.map((e) => <TableManageTopup data={e} />)
                : listCollaborators &&
                  listCollaborators.map((e) => <TableManageTopup data={e} />)}
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
