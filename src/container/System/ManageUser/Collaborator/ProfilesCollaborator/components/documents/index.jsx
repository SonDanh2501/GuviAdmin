import { Checkbox, Image } from "antd";
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

const Document = ({ id }) => {
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
    dispatch(loadingAction.loadingRequest(true));

    getCollaboratorsById(id)
      .then((res) => {
        setDeal(res?.is_document_code);
        setSetValueDeal(res?.document_code);
        setIdentify(res?.is_identity);
        setImgIdentifyFronsite(res?.identity_frontside);
        setImgIdentifyBacksite(res?.identity_backside);
        setInformation(res?.is_personal_infor);
        setImgInformation(res?.personal_infor_image);
        setRegistration(res?.is_household_book);
        setImgRegistration(res?.household_book_image);
        setCertification(res?.is_behaviour);
        setImgCertification(res?.behaviour_image);
        dispatch(loadingAction.loadingRequest(false));
      })
      .catch((err) => {
        errorNotify({
          message: err,
        });
        dispatch(loadingAction.loadingRequest(false));
      });
  }, [id]);

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
      .catch((err) => {
        errorNotify({
          message: err,
        });
        dispatch(loadingAction.loadingRequest(false));
      });
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
      .catch((err) => {
        errorNotify({
          message: err,
        });
        dispatch(loadingAction.loadingRequest(false));
      });
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
      .catch((err) => {
        errorNotify({
          message: err,
        });
        dispatch(loadingAction.loadingRequest(false));
      });
  };

  const onUpdateDocument = useCallback(() => {
    dispatch(loadingAction.loadingRequest(true));
    updateDocumentCollaboratorApi(id, {
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
        getCollaboratorsById(id)
          .then((res) => {
            setDeal(res?.is_document_code);
            setSetValueDeal(res?.document_code);
            setIdentify(res?.is_identity);
            setImgIdentifyFronsite(res?.identity_frontside);
            setImgIdentifyBacksite(res?.identity_backside);
            setInformation(res?.is_personal_infor);
            setImgInformation(res?.personal_infor_image);
            setRegistration(res?.is_household_book);
            setImgRegistration(res?.household_book_image);
            setCertification(res?.is_behaviour);
            setImgCertification(res?.behaviour_image);
          })
          .catch((e) => console.log(e));
      })
      .catch((err) => {
        errorNotify({
          message: err,
        });
        dispatch(loadingAction.loadingRequest(false));
      });
  }, [
    id,
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

  const removeItemInfomation = (item) => {
    const newArray = imgInformation.filter((i) => i !== item);

    return setImgInformation(newArray);
  };

  const removeItemRegistration = (item) => {
    const newArray = imgRegistration.filter((i) => i !== item);
    return setImgRegistration(newArray);
  };

  return (
    <>
      <Form>
        <div className="pl-lg-5">
          <Row>
            <Col lg="4" className="col-check">
              <Checkbox
                checked={deal}
                onChange={(e) => setDeal(e.target.checked)}
              >
                Thoả thuận hợp tác
              </Checkbox>
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
              <Checkbox
                checked={identify}
                onChange={(e) => setIdentify(e.target.checked)}
              >
                CMND/CCCD
              </Checkbox>
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
                    <div className="div-img-thumbnail">
                      <i
                        class="uil uil-times-circle"
                        onClick={() => setImgIdentifyFronsite("")}
                      />
                      <Image
                        width={150}
                        src={imgIdentifyFronsite}
                        className={"img-thumbnail"}
                      />
                    </div>
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
                    <div className="div-img-thumbnail">
                      <i
                        class="uil uil-times-circle"
                        onClick={() => setImgIdentifyBacksite("")}
                      />
                      <Image
                        width={150}
                        src={imgIdentifyBacksite}
                        className={"img-thumbnail"}
                      />
                    </div>
                  )}
                </div>
              </FormGroup>
            </Col>
          </Row>
          <hr />
          <Row>
            <Col lg="4" className="col-check">
              <Checkbox
                checked={information}
                onChange={(e) => setInformation(e.target.checked)}
              >
                Sơ yếu lí lịch
              </Checkbox>
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
                  <div className="div-thumbnail-infomation">
                    {imgInformation.length > 0 &&
                      imgInformation.map((item) => {
                        return (
                          <div className="div-item-thumbnail-infomation">
                            <i
                              class="uil uil-times-circle"
                              onClick={() => removeItemInfomation(item)}
                            ></i>
                            <Image
                              src={item}
                              className="img-thumbnail-infomation"
                            />
                          </div>
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
              <Checkbox
                checked={registration}
                onChange={(e) => setRegistration(e.target.checked)}
              >
                Sổ hổ khẩu
              </Checkbox>
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
                  <div className="div-thumbnail-infomation">
                    {imgRegistration.length > 0 &&
                      imgRegistration.map((item) => {
                        return (
                          <div className="div-item-thumbnail-infomation">
                            <i
                              class="uil uil-times-circle"
                              onClick={() => removeItemRegistration(item)}
                            ></i>
                            <Image
                              src={item}
                              className="img-thumbnail-infomation"
                            />
                          </div>
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
              <Checkbox
                checked={certification}
                onChange={(e) => setCertification(e.target.checked)}
              >
                Giấy xác nhận hạnh kiểm
              </Checkbox>
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
                    <div className="div-img-thumbnail">
                      <i
                        class="uil uil-times-circle"
                        onClick={() => setImgCertification("")}
                      />
                      <Image src={imgCertification} className="img-thumbnail" />
                    </div>
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
