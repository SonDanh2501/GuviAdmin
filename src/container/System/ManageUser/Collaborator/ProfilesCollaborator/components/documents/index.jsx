import { Image } from "antd";
import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Button, Col, Form, FormGroup, Input, Label, Row } from "reactstrap";
import {
  getCollaboratorsById,
  updateDocumentCollaboratorApi,
} from "../../../../../../../api/collaborator";
import { postFile, postMutipleFile } from "../../../../../../../api/file";
import CustomTextInput from "../../../../../../../components/CustomTextInput/customTextInput";
import { errorNotify } from "../../../../../../../helper/toast";
import { loadingAction } from "../../../../../../../redux/actions/loading";
import "./index.scss";

const Document = ({ data }) => {
  const [deal, setDeal] = useState(false);
  const [identify, setIdentify] = useState(false);
  const [information, setInformation] = useState(false);
  const [certification, setCertification] = useState(false);
  const [registration, setRegistration] = useState(false);
  const [valueDeal, setSetValueDeal] = useState("");
  const [imgIdentifyFronsite, setImgIdentifyFronsite] = useState("");
  const [imgIdentifyBacksite, setImgIdentifyBacksite] = useState("");
  const [imgInformation, setImgInformation] = useState([]);
  const [imgCertification, setImgCertification] = useState("");
  const [imgRegistration, setImgRegistration] = useState([]);

  const dispatch = useDispatch();

  useEffect(() => {
    setDeal(data?.is_document_code);
    setSetValueDeal(data?.document_code);
    setIdentify(data?.is_identity);
    setImgIdentifyFronsite(data?.identity_frontside);
    setImgIdentifyBacksite(data?.identity_backside);
    setInformation(data?.is_personal_infor);
    setImgInformation(data?.personal_infor_image);
    setRegistration(data?.is_household_book);
    setImgRegistration(data?.household_book_image);
    setCertification(data?.is_behaviour);
    setImgCertification(data?.behaviour_image);
  }, []);

  const onChangeIdentifyBefore = (e) => {
    dispatch(loadingAction.loadingRequest(true));
    if (e.target.files[0]) {
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setImgIdentifyFronsite(reader.result);
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
        setImgIdentifyFronsite(res);
        dispatch(loadingAction.loadingRequest(false));
      })
      .catch((err) => console.log("err", err));
  };
  const onChangeIdentifyAfter = (e) => {
    dispatch(loadingAction.loadingRequest(true));
    if (e.target.files[0]) {
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setImgIdentifyBacksite(reader.result);
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
        setImgIdentifyBacksite(res);
        dispatch(loadingAction.loadingRequest(false));
      })
      .catch((err) => console.log("err", err));
  };

  const onChangeInformation = (e) => {
    dispatch(loadingAction.loadingRequest(true));
    const fileLength = e.target.files.length;
    const formData = new FormData();
    for (var i = 0; i < fileLength; i++) {
      formData.append("images", e.target.files[i]);
    }
    postMutipleFile(formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
      .then((res) => {
        setImgInformation(res);
        dispatch(loadingAction.loadingRequest(false));
      })
      .catch((err) => {
        errorNotify({
          message: err,
        });
        dispatch(loadingAction.loadingRequest(false));
      });
  };

  const onChangeRegistration = (e) => {
    dispatch(loadingAction.loadingRequest(true));
    const fileLength = e.target.files.length;
    const formData = new FormData();
    for (var i = 0; i < fileLength; i++) {
      formData.append("images", e.target.files[i]);
    }
    postMutipleFile(formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
      .then((res) => {
        setImgRegistration(res);
        dispatch(loadingAction.loadingRequest(false));
      })
      .catch((err) => {
        errorNotify({
          message: err,
        });
        dispatch(loadingAction.loadingRequest(false));
      });
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

  const onUpdateDocument = useCallback(() => {
    dispatch(loadingAction.loadingRequest(true));
    updateDocumentCollaboratorApi(data?._id, {
      is_document_code: deal,
      document_code: valueDeal,
      is_identity: identify,
      identity_frontside: imgIdentifyFronsite,
      identity_backside: imgIdentifyBacksite,
      is_personal_infor: information,
      personal_infor_image: imgInformation,
      is_household_book: registration,
      household_book_image: imgRegistration,
      is_behaviour: certification,
      behaviour_image: imgCertification,
    })
      .then((res) => {
        dispatch(loadingAction.loadingRequest(false));
      })
      .catch((err) => {
        errorNotify({
          message: err,
        });
        dispatch(loadingAction.loadingRequest(false));
      });
    console.log({
      is_document_code: deal,
      document_code: valueDeal,
      is_identity: identify,
      identity_frontside: imgIdentifyFronsite,
      identity_backside: imgIdentifyBacksite,
      is_personal_infor: information,
      personal_infor_image: imgInformation,
      is_household_book: registration,
      household_book_image: imgRegistration,
      is_behaviour: certification,
      behaviour_image: imgCertification,
    });
  }, [
    data,
    deal,
    valueDeal,
    identify,
    imgIdentifyFronsite,
    imgIdentifyBacksite,
    information,
    imgInformation,
    registration,
    imgRegistration,
    certification,
    imgCertification,
  ]);

  return (
    <>
      <Form>
        <div className="pl-lg-5">
          <Row>
            <Col lg="4" className="col-check">
              <Input
                type="checkbox"
                defaultChecked={deal}
                onClick={() => setDeal(!deal)}
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
              <Input
                type="checkbox"
                defaultChecked={identify}
                onClick={() => setIdentify(!identify)}
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
                  {imgIdentifyFronsite && (
                    <Image
                      width={150}
                      src={imgIdentifyFronsite}
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
                  {imgIdentifyBacksite && (
                    <Image
                      width={150}
                      src={imgIdentifyBacksite}
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
              <Input
                type="checkbox"
                defaultChecked={information}
                onClick={(e) => setInformation(!information)}
              />
              <a>Sơ yếu lí lịch</a>
            </Col>
            <Col lg="8">
              <div className="div-infomation">
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
                  <div>
                    {imgInformation.length > 0 &&
                      imgInformation.map((item) => {
                        return (
                          <Image
                            src={item}
                            className="img-thumbnail-infomation"
                          />
                        );
                      })}
                  </div>
                </div>
              </div>
            </Col>
          </Row>
          <hr />
          <Row>
            <Col lg="4" className="col-check">
              <Input
                type="checkbox"
                defaultChecked={registration}
                onClick={() => setRegistration(!registration)}
              />
              <a>Sổ hổ khẩu</a>
            </Col>
            <Col lg="8">
              <div className="div-infomation">
                <Label for="exampleThumbnail">Hình ảnh</Label>
                <div className="col-img">
                  <input
                    type="file"
                    id="files"
                    name="files"
                    accept=".jpg, .jpeg, .png"
                    multiple
                    onChange={onChangeRegistration}
                  />
                  <div>
                    {imgRegistration.length > 0 &&
                      imgRegistration.map((item) => {
                        return (
                          <Image
                            src={item}
                            className="img-thumbnail-infomation"
                          />
                        );
                      })}
                  </div>
                </div>
              </div>
            </Col>
          </Row>
          <hr />
          <Row>
            <Col lg="4" className="col-check">
              <Input
                type="checkbox"
                defaultChecked={certification}
                onClick={() => setCertification(!certification)}
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
        <Button className="btn-update" onClick={onUpdateDocument}>
          Cập nhật
        </Button>
      </Form>
    </>
  );
};

export default Document;
