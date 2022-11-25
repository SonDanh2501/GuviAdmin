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
import { searchFeedbackApi } from "../../../api/feedback";
import CustomTextInput from "../../../components/CustomTextInput/customTextInput";
import { getFeedback } from "../../../redux/actions/feedback";
import { loadingAction } from "../../../redux/actions/loading";
import {
  getFeedbacks,
  getFeedbackTotal,
} from "../../../redux/selectors/feedback";
import "./FeedbackManage.scss";
import TableManageFeedback from "./TableManageFeedback";

export default function FeedbackManage() {
  const [dataFilter, setDataFilter] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const dispatch = useDispatch();
  const listFeedback = useSelector(getFeedbacks);
  const feedbackTotal = useSelector(getFeedbackTotal);
  React.useEffect(() => {
    dispatch(loadingAction.loadingRequest(true));
    dispatch(getFeedback.getFeedbackRequest({ start: 0, length: 10 }));
  }, [dispatch]);

  const handleSearch = useCallback((value) => {
    searchFeedbackApi(value)
      .then((res) => setDataFilter(res.data))
      .catch((err) => console.log(err));
  }, []);

  const handleClick = (e, index) => {
    e.preventDefault();
    setCurrentPage(index);
    const start = index * listFeedback.length;
    dispatch(
      getFeedback.getFeedbackRequest({
        start: start > 0 ? start : 0,
        length: 10,
      })
    );
  };

  const pageCount = feedbackTotal / 10;
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
      <div className="user-redux-container">
        <div className="mt-5">
          <Card className="shadow">
            <CardHeader className="border-0 card-header">
              <Row className="align-items-center">
                <Col className="text-left"></Col>
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
                  <th scope="col">Loại phản hồi</th>
                  <th scope="col">Nội dung</th>
                  <th scope="col">Người phản hồi</th>
                  <th scope="col">SĐT người phản hồi</th>
                  <th scope="col">Ngày phản hồi</th>
                </tr>
              </thead>
              <tbody>
                {dataFilter.length > 0
                  ? dataFilter.map((e) => <TableManageFeedback data={e} />)
                  : listFeedback &&
                    listFeedback.map((e) => <TableManageFeedback data={e} />)}
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
      </div>
    </React.Fragment>
  );
}
