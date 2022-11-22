import React, { useState } from "react";
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

  console.log(listFeedback);

  // const handleSearch = useCallback((value) => {
  //   searchBanners(value)
  //     .then((res) => setDataFilter(res.data))
  //     .catch((err) => console.log(err));
  // }, []);

  return (
    <React.Fragment>
      <div className="user-redux-container">
        <div className="column">
          {/* {create || edit ? (
                <Form>
                  <Row>
                    <Col md={6}>
                      <CustomTextInput
                        label={"Tiêu đề"}
                        id="exampleTitle"
                        name="title"
                        placeholder="Enter your title"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                      />
                    </Col>
                    <Col md={6} className="exampleImage">
                      <Label for="exampleImage">Hình ảnh banner</Label>
                      <Input
                        id="exampleImage"
                        name="image"
                        type="file"
                        accept={".jpg,.png,.jpeg"}
                        className="input-group"
                        onChange={onChangeThumbnail}
                      />
                      {imgThumbnail && (
                        <img src={imgThumbnail} className="img-thumbnail" />
                      )}
                    </Col>
                  </Row>
                  <Row>
                    <Col md={6}>
                      <CustomTextInput
                        label={"Kiểu banner"}
                        id="exampleType_link"
                        name="type_link"
                        className="select-code-phone"
                        type="select"
                        defaultValue={typeLink}
                        onChange={(e) => setTypeLink(e.target.value)}
                        body={
                          <>
                            <option value={"url"}>URL</option>
                            <option value={"promotion"}>Promotion</option>
                          </>
                        }
                      />
                    </Col>
                    <Col md={6}>
                      <CustomTextInput
                        label={"Position"}
                        iid="examplePosition"
                        name="position"
                        placeholder="0 or 1, 2, 3, ..."
                        type="number"
                        value={position}
                        onChange={(e) => setPosition(e.target.value)}
                      />
                    </Col>
                  </Row>

                  <Row>
                    <Col>
                      {typeLink !== "promotion" ? (
                        <CustomTextInput
                          label={"Link URL"}
                          id="examplelink_url"
                          name="link_url"
                          type="text"
                          value={linkID}
                          onChange={(e) => setLinkId(e.target.value)}
                        />
                      ) : (
                        <CustomTextInput
                          label={"Link ID"}
                          className="select-code-phone"
                          id="examplelink_id"
                          name="link_id"
                          type="select"
                          value={linkID}
                          onChange={(e) => setLinkId(e.target.value)}
                          body={promotion.map((item, index) => {
                            return (
                              <option key={index} value={item?._id}>
                                {item?.title?.vi}
                              </option>
                            );
                          })}
                        />
                      )}
                    </Col>
                  </Row>
                  {create && (
                    <Button color="warning" onClick={onSubmit}>
                      Thêm Banners
                    </Button>
                  )}
                  {edit && (
                    <Button color="warning" onClick={onEditBanner}>
                      Sửa Banners
                    </Button>
                  )}
                </Form>
              ) : (
                <></>
              )} */}
          <div className="mt-5">
            {/* <TableManageBanner /> */}
            <Card className="shadow">
              <CardHeader className="border-0 card-header">
                <Row className="align-items-center">
                  <Col className="text-left">
                    {/* {!create && (
                          <Button
                            color="info"
                            onClick={() => {
                              setTitle("");
                              setImgThumbnail("");
                              setTypeLink("");
                              setLinkId("");
                              setPosition("");
                              setCreate(!create);
                              setEdit(false);
                            }}
                          >
                            Thêm Banners
                          </Button>
                        )} */}
                  </Col>
                  <Col>
                    {/* <CustomTextInput
                      placeholder="Tìm kiếm"
                      type="text"
                      // onChange={(e) => handleSearch(e.target.value)}
                    /> */}
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
                  {listFeedback.map((e) => (
                    <TableManageFeedback data={e} />
                  ))}
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
