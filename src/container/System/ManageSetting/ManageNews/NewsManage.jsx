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
import { getNewSelector } from "../../../../redux/selectors/news";
import CustomTextInput from "../../../../components/CustomTextInput/customTextInput";
import AddNews from "../../../../components/addNews/addNews";

export default function NewsManage() {
  const dispatch = useDispatch();
  const listNew = useSelector(getNewSelector);
  React.useEffect(() => {
    dispatch(getNews.getNewsRequest());
  }, [dispatch]);

  return (
    <React.Fragment>
      <div className="user-redux-container">
        <div className="column">
          <div className="mt-5">
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
    </React.Fragment>
  );
}
