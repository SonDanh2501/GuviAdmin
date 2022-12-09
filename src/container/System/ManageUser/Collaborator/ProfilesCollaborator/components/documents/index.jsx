import { Image } from "antd";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Button, Col, Form, FormGroup, Input, Label, Row } from "reactstrap";
import { postFile } from "../../../../../../../api/file";
import CustomTextInput from "../../../../../../../components/CustomTextInput/customTextInput";
import { loadingAction } from "../../../../../../../redux/actions/loading";
import "./index.scss";

const Document = () => {
  const [deal, setDeal] = useState(false);
  const [identify, setIdentify] = useState(false);
  const [information, setInformation] = useState(false);
  const [certification, setCertification] = useState(false);
  const [valueDeal, setSetValueDeal] = useState("");
  const [imgIdentifyBefore, setImgIdentifyBefore] = useState("");
  const [imgIdentifyAfter, setImgIdentifyAfter] = useState("");
  const [imgInformation, setImgInformation] = useState([]);
  const [imgCertification, setImgCertification] = useState("");

  const dispatch = useDispatch();

  const onChangeIdentifyBefore = (e) => {
    dispatch(loadingAction.loadingRequest(true));
    if (e.target.files[0]) {
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setImgIdentifyBefore(reader.result);
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
      .then((res) => {
        setImgIdentifyBefore(res);
        dispatch(loadingAction.loadingRequest(false));
      })
      .catch((err) => console.log("err", err));
  };
  const onChangeIdentifyAfter = (e) => {
    dispatch(loadingAction.loadingRequest(true));
    if (e.target.files[0]) {
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setImgIdentifyAfter(reader.result);
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
      .then((res) => {
        setImgIdentifyAfter(res);
        dispatch(loadingAction.loadingRequest(false));
      })
      .catch((err) => console.log("err", err));
  };

  const onChangeCertification = (e) => {
    dispatch(loadingAction.loadingRequest(true));
    if (e.target.files[0]) {
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setImgCertification(reader.result);
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
      .then((res) => {
        setImgCertification(res);
        dispatch(loadingAction.loadingRequest(false));
      })
      .catch((err) => console.log("err", err));
  };

  const onChangeInformation = (e) => {
    const fileLength = e.target.files.length;
    const formData = new FormData();
    for (var i = 0; i < fileLength; i++) {
      formData.append("images", e.target.files[i]);
    }
    postFile(formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => console.log("err", err));
  };

  return (
    <>
      <Form>
        <div className="pl-lg-5">
          <Row>
            <Col lg="4" className="col-check">
              <CustomTextInput
                type="checkbox"
                defaultChecked={deal}
                onChange={(e) => setDeal(e.target.value)}
              />
              <a>Thoả thuận hợp tác</a>
            </Col>
            <Col lg="8">
              <CustomTextInput
                label="Mã hồ sơ"
                placeholder={"Nhập mã hồ sơ"}
                value={valueDeal}
                onChange={(e) => setSetValueDeal(e.target.value)}
              />
            </Col>
          </Row>
          <hr />
          <Row>
            <Col lg="4" className="col-check">
              <CustomTextInput
                type="checkbox"
                defaultChecked={identify}
                onChange={(e) => setIdentify(e.target.value)}
              />
              <a>CMND/CCCD</a>
            </Col>
            <Col lg="8">
              <FormGroup>
                <Label for="exampleThumbnail">CCCD/CMND mặt trước</Label>
                <div className="col-img">
                  <Input
                    id="exampleThumbnail"
                    type="file"
                    className="input-file"
                    accept={".jpg,.png,.jpeg"}
                    name="thumbnail"
                    onChange={onChangeIdentifyBefore}
                  />
                  {imgIdentifyBefore && (
                    <Image
                      width={150}
                      src={imgIdentifyBefore}
                      className={"img-thumbnail"}
                    />
                  )}
                </div>
              </FormGroup>
              <FormGroup>
                <Label for="exampleThumbnail">CCCD/CMND mặt sau</Label>
                <div className="col-img">
                  <Input
                    id="exampleThumbnail"
                    type="file"
                    className="input-file"
                    accept={".jpg,.png,.jpeg"}
                    name="thumbnail"
                    onChange={onChangeIdentifyAfter}
                  />
                  {imgIdentifyAfter && (
                    <Image
                      width={150}
                      src={imgIdentifyAfter}
                      className={"img-thumbnail"}
                    />
                  )}
                </div>
              </FormGroup>
            </Col>
          </Row>
          <hr />
          <Row>
            <Col lg="4" className="col-check">
              <CustomTextInput
                type="checkbox"
                defaultChecked={information}
                onChange={(e) => setInformation(e.target.value)}
              />
              <a>Sơ yếu lí lịch</a>
            </Col>
            <Col lg="8">
              <FormGroup>
                <Label for="exampleThumbnail">Hình ảnh</Label>
                <div className="col-img">
                  <input
                    type="file"
                    id="files"
                    name="files"
                    accept=".jpg, .jpeg, .png"
                    multiple
                    onChange={onChangeInformation}
                  />
                  {/* {imgIdentifyBefore && (
                    <img src={imgIdentifyBefore} className="img-thumbnail" />
                  )} */}
                </div>
              </FormGroup>
            </Col>
          </Row>
          <hr />
          <Row>
            <Col lg="4" className="col-check">
              <CustomTextInput
                type="checkbox"
                defaultChecked={information}
                onChange={(e) => setInformation(e.target.value)}
              />
              <a>Sổ hổ khẩu</a>
            </Col>
            <Col lg="8">
              <FormGroup>
                <Label for="exampleThumbnail">Hình ảnh</Label>
                <div className="col-img">
                  <input
                    type="file"
                    id="files"
                    name="files"
                    accept=".jpg, .jpeg, .png"
                    multiple
                    onChange={(e) => console.log(e.target.files)}
                  />
                  {imgIdentifyBefore && (
                    <img src={imgIdentifyBefore} className="img-thumbnail" />
                  )}
                </div>
              </FormGroup>
            </Col>
          </Row>
          <hr />
          <Row>
            <Col lg="4" className="col-check">
              <CustomTextInput
                type="checkbox"
                defaultChecked={certification}
                onChange={(e) => setCertification(e.target.value)}
              />
              <a>Giấy xác nhận hạnh kiểm</a>
            </Col>
            <Col lg="8">
              <FormGroup>
                <Label for="exampleThumbnail">Hình ảnh</Label>
                <div className="col-img">
                  <input
                    type="file"
                    id="files"
                    name="files"
                    accept=".jpg, .jpeg, .png"
                    onChange={onChangeCertification}
                  />
                  {imgCertification && (
                    <img src={imgCertification} className="img-thumbnail" />
                  )}
                </div>
              </FormGroup>
            </Col>
          </Row>
        </div>
        <Button className="btn-update">Cập nhật</Button>
      </Form>
    </>
  );
};

export default Document;
