import React, { useState, useEffect, useCallback } from "react";
import "./BannerManage.scss";
import TableManageBanner from "./TableManageBanner.jsx";
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
import CustomTextInput from "../../../../components/CustomTextInput/customTextInput";
import {
  createBanner,
  getBanners,
  updateBanner,
} from "../../../../redux/actions/banner";
import { getBanner } from "../../../../redux/selectors/banner";
import { postFile } from "../../../../api/file";
import { searchBanners } from "../../../../api/banner";
import { getPromotion } from "../../../../redux/actions/promotion";
import { getPromotionSelector } from "../../../../redux/selectors/promotion";

export default function UserManage() {
  const [create, setCreate] = useState(false);
  const [edit, setEdit] = useState(false);
  const [id, setId] = useState("");
  const [title, setTitle] = useState("");
  const [imgThumbnail, setImgThumbnail] = useState("");
  const [typeLink, setTypeLink] = useState("url");
  const [linkID, setLinkId] = useState("");
  const [position, setPosition] = useState("");
  const [dataFilter, setDataFilter] = useState([]);
  const dispatch = useDispatch();
  const promotion = useSelector(getPromotionSelector);
  const banners = useSelector(getBanner);
  React.useEffect(() => {
    dispatch(getBanners.getBannersRequest());
    dispatch(getPromotion.getPromotionRequest());
  }, [dispatch]);

  const onSubmit = useCallback(() => {
    dispatch(
      createBanner.createBannerRequest({
        title: title,
        image: imgThumbnail,
        type_link: typeLink,
        link_id: linkID,
        position: position,
      })
    );
  }, [dispatch, title, imgThumbnail, typeLink, linkID, position]);

  const onChangeThumbnail = (e) => {
    if (e.target.files[0]) {
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setImgThumbnail(reader.result);
      });
      reader.readAsDataURL(e.target.files[0]);
    }
    const formData = new FormData();
    formData.append("file", e.target.files[0]);
    postFile(formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
      .then((res) => setImgThumbnail(res))
      .catch((err) => console.log("err", err));
  };

  const setItemEdit = (itemEdit) => {
    setTitle(itemEdit?.title);
    setImgThumbnail(itemEdit?.image);
    setTypeLink(itemEdit?.type_link);
    setLinkId(itemEdit?.link_id);
    setPosition(itemEdit?.position);
    setId(itemEdit?._id);
    setEdit(true);
    setCreate(false);
    window.scrollTo(0, 0);
  };

  const onEditBanner = useCallback(() => {
    dispatch(
      updateBanner.updateBannerRequest({
        id: id,
        data: {
          title: title,
          image: imgThumbnail,
          type_link: typeLink,
          link_id: linkID,
          position: position,
        },
      })
    );
  }, [id, title, imgThumbnail, typeLink, linkID, position]);

  const handleSearch = useCallback((value) => {
    searchBanners(value)
      .then((res) => setDataFilter(res.data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <React.Fragment>
      <div className="user-redux-container">
        <div className="user-redux-body mt-5 col-md-12">
          <div className="container">
            <div className="column">
              {create || edit ? (
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
              )}
              <div className="mt-5">
                {/* <TableManageBanner /> */}
                <Card className="shadow">
                  <CardHeader className="border-0 card-header">
                    <Row className="align-items-center">
                      <Col className="text-left">
                        {!create && (
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
                        )}
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
                        <th scope="col">Title</th>
                        <th scope="col">Type link</th>
                        <th scope="col">Position</th>
                        <th scope="col">Link ID</th>
                        <th scope="col">Banner</th>
                        <th scope="col" />
                      </tr>
                    </thead>
                    <tbody>
                      {dataFilter.length > 0
                        ? dataFilter.map((e) => (
                            <TableManageBanner
                              data={e}
                              setItemEdit={setItemEdit}
                            />
                          ))
                        : banners &&
                          banners.map((e) => (
                            <TableManageBanner
                              data={e}
                              setItemEdit={setItemEdit}
                            />
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
        </div>
      </div>
    </React.Fragment>
  );
}
