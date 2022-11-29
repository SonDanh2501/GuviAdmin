import React, { useState, useEffect, useCallback } from "react";
import "./NewsManage.scss";
import TableManageNews from "./TableManageNews.jsx";
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
import { postFile } from "../../../../api/file.jsx";
import { createNew, getNews, updateNew } from "../../../../redux/actions/news";
import { getNewSelector, getNewTotal } from "../../../../redux/selectors/news";
import CustomTextInput from "../../../../components/CustomTextInput/customTextInput";
import AddNews from "../../../../components/addNews/addNews";
import { loadingAction } from "../../../../redux/actions/loading";

export default function NewsManage() {
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(0);
  const listNew = useSelector(getNewSelector);
  const totalNew = useSelector(getNewTotal);
  React.useEffect(() => {
    dispatch(loadingAction.loadingRequest(true));
    dispatch(getNews.getNewsRequest({ start: 0, length: 10 }));
  }, [dispatch]);

  const handleClick = (e, index) => {
    e.preventDefault();
    setCurrentPage(index);
    const start = index * listNew.length;
    dispatch(
      getNews.getNewsRequest({
        start: start > 0 ? start : 0,
        length: 10,
      })
    );
  };

  const pageCount = totalNew / 10;
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
                <AddNews />
              </Col>
              <Col>
                <CustomTextInput placeholder="Tìm kiếm" type="text" />
              </Col>
            </Row>
          </CardHeader>
          <Table
            className="align-items-center table-flush"
            responsive={true}
            hover={true}
          >
            <thead className="thead-light">
              <tr>
                <th scope="col">Title</th>
                <th scope="col">Short description</th>
                <th scope="col">URL</th>
                <th scope="col">Type</th>
                <th scope="col">Thumbnail</th>
                <th scope="col" />
              </tr>
            </thead>
            <tbody>
              {listNew &&
                listNew.length > 0 &&
                listNew.map((e) => <TableManageNews data={e} />)}
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
