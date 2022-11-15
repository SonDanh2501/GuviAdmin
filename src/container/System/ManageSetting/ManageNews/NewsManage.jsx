import React, { useState, useEffect } from "react";
import "./NewsManage.scss";
import TableManageNews from "./TableManageNews.jsx";
import { Form, Row, Col, FormGroup, Label, Input, Button } from "reactstrap";
import { useSelector, useDispatch } from "react-redux";
import * as actions from "../../../../redux/actions/news";
import { postFile } from "../../../../api/file.jsx";

export default function NewsManage() {

  const [imgThumbnail, setImgThumbnail] = React.useState("");

  const [news, setNews] = React.useState({
    title: "",
    thumbnail: "",
    url: "",
    short_description: "",
    type: "",
  });
  const dispatch = useDispatch();
  const onSubmit = React.useCallback(() => {
    dispatch(actions.createNew.createNewRequest(news));
    setNews({
      title: "",
    thumbnail: "",
    url: "",
    short_description: "",
    type: "",
    });
    window.location.reload();
  }, [news, dispatch]);

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

  return (
    <React.Fragment>
      <div className="user-redux-container">
        <div className="user-redux-body mt-5 col-md-12">
          <div className="container">
            <div className="column">
              <div className="">
                <Form>
                  <Row>
                    <Col md={6}>
                      <FormGroup>
                        <Label for="exampleTitle">Title</Label>
                        <Input
                          id="exampleTitle"
                          name="title"
                          placeholder="Enter your Title"
                          type="text"
                          value={news.title}
                          onChange={(e) =>
                            setNews({ ...news, title: e.target.value })
                          }
                        />
                      </FormGroup>
                    </Col>
                    <Col md={6}>
                      <FormGroup>
                        <Label for="exampleShort_description">Short description</Label>
                        <Input
                          id="exampleShort_description"
                          name="short_description"
                          placeholder="Enter Short description "
                          type="text"
                          value={news.short_description}
                          onChange={(e) =>
                            setNews({ ...news, short_description: e.target.value })
                          }
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <FormGroup>
                    <Label for="exampleURL">URL</Label>
                    <Input
                      id="exampleURL"
                      name="URL"
                      placeholder="Enter URL"
                      value={news.url}
                      onChange={(e) =>
                        setNews({ ...news, url: e.target.value })
                      }
                    />
                  </FormGroup>
                  <Row>
                    <Col md={6}>
                      <FormGroup>
                        <Label for="exampleType">Type</Label>
                        <Input
                          id="exampleType"
                          name="Type"
                          value={news.type}
                          onChange={(e) =>
                            setNews({
                              ...news,
                              type: e.target.value,
                            })
                          }
                        />
                      </FormGroup>
                    </Col>
                    <Col md={6}>
                      <FormGroup>
                        <Label for="exampleThumbnail">Thumbnail</Label>
                        <Input
                          id="exampleThumbnail"
                          type="file"
                          accept={".jpg,.png,.jpeg"}
                          name="thumbnail"
                          value={news.thumbnail}
                          onChange={onChangeThumbnail}
                          className = "input-group"

                        />
                         {imgThumbnail && (
                          <img src={imgThumbnail} className="img-thumbnail" />
                        )}
                      </FormGroup>
                    </Col>
                  </Row>
                  <Button color="warning" onClick={onSubmit}>
                    Thêm bài báo
                  </Button>
                </Form>
              </div>

              <div className="">
                <TableManageNews />
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
