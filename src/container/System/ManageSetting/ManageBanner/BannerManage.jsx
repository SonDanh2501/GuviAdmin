import React, { useState, useEffect } from "react";
import "./BannerManage.scss";
import TableManageBanner from "./TableManageBanner.jsx";
import { Form, Row, Col, FormGroup, Label, Input, Button,Media } from "reactstrap";
import { useSelector, useDispatch } from "react-redux";
import * as actions from "../../../../redux/actions/banner";
import { postFile } from "../../../../api/file.jsx";

export default function UserManage() {

  const [imgThumbnail, setImgThumbnail] = React.useState("");
 


  const [Banners, setBanners] = React.useState({
    title: "",
    image: "",
    type_link: "",
    link_id: "",
    position: "",
  });
  const dispatch = useDispatch();
  const onSubmit = React.useCallback(() => {
    dispatch(actions.createBanner.createBannerRequest(Banners));
    setBanners({
      title: "",
      image: "",
      type_link: "",
      link_id: "",
      position: "",
    });
    window.location.reload();
  }, [Banners, dispatch]);

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
                        <Label for="exampleTitle">Tiêu đề</Label>
                        <Input
                          id="exampleTitle"
                          name="title"
                          placeholder="Enter your title address"
                          type="text"
                          value={Banners.title}
                          onChange={(e) =>
                            setBanners({ ...Banners, title: e.target.value })
                          }
                        />
                      </FormGroup>
                    </Col>
                    
                    <Col md={6} className="exampleImage">
                        <Label for="exampleImage">Hình ảnh banner</Label>
                        <Input
                          id="exampleImage"
                          name="image"
                          type="file"
                          value={Banners.image}
                          className = "input-group"
                          onChange={onChangeThumbnail}

                        />
                    </Col>
                  

                  </Row>
                  <Row>
                    <Col md={6}>
                    <FormGroup>
                    <Label for="exampleType_link">Kiểu banner</Label>
                    <Input
                      id="exampleType_link"
                      name="type_link"
                      placeholder="Enter your type link (URL or Promotion)"
                      value={Banners.type_link}
                      onChange={(e) =>
                        setBanners({ ...Banners, type_link: e.target.value })
                      }
                    />
                  </FormGroup>
                  </Col>
                  
                  <Col md={6}>
                  <FormGroup>
                        <Label for="examplePosition">Position</Label>
                        <Input
                          id="examplePosition"
                          name="position"
                          placeholder="0 or 1, 2, 3, ..."
                          value={Banners.position}
                          onChange={(e) =>
                            setBanners({ ...Banners, position: e.target.value })
                          }
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                
                  <Row>
                    <Col>
                      <FormGroup>
                        <Label for="examplelink_id">Link ID</Label>
                        <Input
                          id="examplelink_id"
                          name="link_id"
                          value={Banners.link_id}
                          onChange={(e) =>
                            setBanners({
                              ...Banners,
                              link_id: e.target.value,
                            })
                          }
                        />
                      </FormGroup>
                    </Col>
                   
                  </Row>
                  <Button color="warning" onClick={onSubmit}>
                    Thêm Banners
                  </Button>
                </Form>
              </div>

              <div className="">
                <TableManageBanner />
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
