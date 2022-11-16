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

export default function NewsManage() {
  const [imgThumbnail, setImgThumbnail] = useState("");
  const [create, setCreate] = useState(false);
  const [edit, setEdit] = useState(false);
  const [id, setId] = useState("");
  const [title, setTitle] = useState("");
  const [type, setType] = useState("news");
  const [url, setUrl] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const dispatch = useDispatch();
  const listNew = useSelector(getNewSelector);
  React.useEffect(() => {
    dispatch(getNews.getNewsRequest());
  }, [dispatch]);

  const onSubmit = useCallback(() => {
    dispatch(
      createNew.createNewRequest({
        title: title,
        short_description: shortDescription,
        thumbnail: imgThumbnail,
        url: url,
        type: type,
      })
    );
  }, [dispatch, title, shortDescription, imgThumbnail, url, type]);

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
    setShortDescription(itemEdit?.short_description);
    setImgThumbnail(itemEdit?.thumbnail);
    setUrl(itemEdit?.url);
    setType(itemEdit?.type);
    setId(itemEdit?._id);
    setEdit(true);
    setCreate(false);
    window.scrollTo(0, 0);
  };

  const onEditNews = useCallback(() => {
    dispatch(
      updateNew.updateNewRequest({
        id: id,
        data: {
          title: title,
          short_description: shortDescription,
          thumbnail: imgThumbnail,
          url: url,
          type: type,
        },
      })
    );
  }, [id, title, shortDescription, imgThumbnail, url, type]);

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
                        placeholder="Vui lòng nhập tiêu đề"
                        type="textarea"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                      />
                    </Col>
                    <Col md={6}>
                      <CustomTextInput
                        label={"Mô tả ngắn"}
                        id="exampleShort_description"
                        name="short_description"
                        placeholder="Vui lòng nhập mô tả ngắn"
                        type="textarea"
                        value={shortDescription}
                        onChange={(e) => setShortDescription(e.target.value)}
                      />
                    </Col>
                  </Row>
                  <CustomTextInput
                    label={"URL"}
                    id="exampleURL"
                    name="URL"
                    placeholder="Vui lòng nhập url"
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                  />

                  <Row>
                    <Col md={6}>
                      <CustomTextInput
                        label={"Type"}
                        id="exampleType"
                        name="Type"
                        className="select-type"
                        type="select"
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        body={
                          <>
                            <option value={"news"}>News</option>
                            <option value={"guvilover"}>GUVILove</option>
                          </>
                        }
                      />
                    </Col>
                    <Col md={6}>
                      <FormGroup>
                        <Label for="exampleThumbnail">Thumbnail</Label>
                        <Input
                          id="exampleThumbnail"
                          type="file"
                          accept={".jpg,.png,.jpeg"}
                          name="thumbnail"
                          onChange={onChangeThumbnail}
                        />
                        {imgThumbnail && (
                          <img src={imgThumbnail} className="img-thumbnail" />
                        )}
                      </FormGroup>
                    </Col>
                  </Row>
                  {create && (
                    <Button color="warning" onClick={onSubmit}>
                      Thêm bài báo
                    </Button>
                  )}
                  {edit && (
                    <Button color="warning" onClick={onEditNews}>
                      Sửa bài báo
                    </Button>
                  )}
                </Form>
              ) : (
                <></>
              )}

              <div className="mt-5">
                <Card className="shadow">
                  <CardHeader className="border-0 card-header">
                    <Row className="align-items-center">
                      <Col className="text-left">
                        {!create && (
                          <Button
                            color="info"
                            onClick={() => {
                              setTitle("");
                              setShortDescription("");
                              setImgThumbnail("");
                              setUrl("");
                              setType("");
                              setCreate(!create);
                              setEdit(false);
                            }}
                          >
                            Thêm bài viết
                          </Button>
                        )}
                      </Col>
                      <Col>
                        <CustomTextInput placeholder="Tìm kiếm" type="text" />
                      </Col>
                    </Row>
                  </CardHeader>
                  <Table className="align-items-center table-flush " responsive>
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
                        listNew.map((e) => (
                          <TableManageNews data={e} setItemEdit={setItemEdit} />
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
