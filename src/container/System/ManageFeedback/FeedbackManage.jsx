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
import { getFeedbacks } from "../../../redux/selectors/feedback";
import "./FeedbackManage.scss";
import TableManageFeedback from "./TableManageFeedback";

export default function FeedbackManage() {
  const [dataFilter, setDataFilter] = useState([]);
  const dispatch = useDispatch();
  const listFeedback = useSelector(getFeedbacks);
  React.useEffect(() => {
    dispatch(getFeedback.getFeedbackRequest());
  }, [dispatch]);

  const handleSearch = useCallback((value) => {
    searchFeedbackApi(value)
      .then((res) => setDataFilter(res.data))
      .catch((err) => console.log(err));
  }, []);

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
    </React.Fragment>
  );
}
