import { Button, Checkbox, Image, Input } from "antd";
import { saveAs } from "file-saver";
import JSZip from "jszip";
import JSZipUtils from "jszip-utils";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getCollaboratorsById,
  updateDocumentCollaboratorApi,
} from "../../../../../../../api/collaborator";
import { postFile } from "../../../../../../../api/file";
import InputCustom from "../../../../../../../components/textInputCustom";
import resizeFile from "../../../../../../../helper/resizer";
import { errorNotify, successNotify } from "../../../../../../../helper/toast";
import i18n from "../../../../../../../i18n";
import { loadingAction } from "../../../../../../../redux/actions/loading";
import { getLanguageState } from "../../../../../../../redux/selectors/auth";
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
  const [imgCertification, setImgCertification] = useState([]);
  const [imgRegistration, setImgRegistration] = useState([]);
  const dispatch = useDispatch();
  const lang = useSelector(getLanguageState);

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
          message: err?.message,
        });
        dispatch(loadingAction.loadingRequest(false));
      });
  }, [id, dispatch, lang]);

  const onChangeIdentifyBefore = async (e) => {
    dispatch(loadingAction.loadingRequest(true));
    const extend = e.target.files[0].type.slice(
      e.target.files[0].type.indexOf("/") + 1
    );
    if (e.target.files[0]) {
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setImgIdentifyFronsite(reader.result);
      });
      reader.readAsDataURL(e.target.files[0]);
    }
    const formData = new FormData();
    const image = await resizeFile(e.target.files[0], extend);

    formData.append("multi-files", image);
    postFile(formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
      .then((res) => {
        setImgIdentifyFronsite(res[0]);
        dispatch(loadingAction.loadingRequest(false));
      })
      .catch((err) => {
        errorNotify({
          message: err?.message,
        });
        dispatch(loadingAction.loadingRequest(false));
      });
  };
  const onChangeIdentifyAfter = async (e) => {
    dispatch(loadingAction.loadingRequest(true));
    const extend = e.target.files[0].type.slice(
      e.target.files[0].type.indexOf("/") + 1
    );
    if (e.target.files[0]) {
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setImgIdentifyBacksite(reader.result);
      });
      reader.readAsDataURL(e.target.files[0]);
    }
    const formData = new FormData();
    const image = await resizeFile(e.target.files[0], extend);

    formData.append("multi-files", image);
    postFile(formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
      .then((res) => {
        setImgIdentifyBacksite(res[0]);
        dispatch(loadingAction.loadingRequest(false));
      })
      .catch((err) => {
        errorNotify({
          message: err?.message,
        });
        dispatch(loadingAction.loadingRequest(false));
      });
  };

  const onChangeInformation = async (e) => {
    dispatch(loadingAction.loadingRequest(true));
    const fileLength = e.target.files.length;
    const formData = new FormData();
    for (var i = 0; i < fileLength; i++) {
      const image = await resizeFile(e.target.files[i], "png");
      formData.append("multi-files", image);
    }
    postFile(formData, {
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
          message: err?.message,
        });
        dispatch(loadingAction.loadingRequest(false));
      });
  };

  const onChangeRegistration = async (e) => {
    dispatch(loadingAction.loadingRequest(true));
    const fileLength = e.target.files.length;
    const formData = new FormData();
    for (var i = 0; i < fileLength; i++) {
      const image = await resizeFile(e.target.files[i], "png");
      formData.append("multi-files", image);
    }
    postFile(formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
      .then((res) => {
        // if (imgRegistration.length > 0) {
        //   const newImg = imgRegistration.concat(res);
        //   setImgRegistration(newImg);
        // } else {
        //   setImgRegistration(res);
        // }
        setImgRegistration(res);
        dispatch(loadingAction.loadingRequest(false));
      })
      .catch((err) => {
        errorNotify({
          message: err?.message,
        });
        dispatch(loadingAction.loadingRequest(false));
      });
  };

  const onChangeCertification = async (e) => {
    dispatch(loadingAction.loadingRequest(true));
    const fileLength = e.target.files.length;
    const formData = new FormData();
    for (var i = 0; i < fileLength; i++) {
      const image = await resizeFile(e.target.files[i], "png");
      formData.append("multi-files", image);
    }
    postFile(formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
      .then((res) => {
        // if (imgCertification.length > 0) {
        //   const newImg = imgCertification.concat(res);
        //   setImgCertification(newImg);
        // } else {
        //   setImgCertification(res);
        // }
        setImgCertification(res);
        dispatch(loadingAction.loadingRequest(false));
      })
      .catch((err) => {
        errorNotify({
          message: err?.message,
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
        successNotify({
          message: `${i18n.t("update_success_info", { lng: lang })}`,
        });
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
          message: err?.message,
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
    dispatch,
    lang,
  ]);

  const removeItemInfomation = (item) => {
    const newArray = imgInformation.filter((i) => i !== item);

    return setImgInformation(newArray);
  };

  const removeItemRegistration = (item) => {
    const newArray = imgRegistration.filter((i) => i !== item);
    return setImgRegistration(newArray);
  };

  const removeItemCertification = (item) => {
    const newArray = imgCertification.filter((i) => i !== item);
    return setImgCertification(newArray);
  };

  const downloadImageIdentify = () => {
    saveAs(imgIdentifyFronsite, "identifyFronsite.png"); // Put your image url here.
    saveAs(imgIdentifyBacksite, "identifyBacksite.png"); // Put your image url here.
  };

  const downloadImageInformation = () => {
    var zip = new JSZip();
    var count = 0;
    var zipFilename = "Infomation.zip";
    imgInformation.forEach(function (url, i) {
      var filename = imgInformation[i];
      filename = filename
        .replace(/[\/\*\|\:\<\>\?\"\\]/gi, "")
        .replace("infomation", "");
      JSZipUtils.getBinaryContent(url, function (err, data) {
        if (err) {
          throw err;
        }
        zip.file(filename, data, { binary: true });
        count++;
        if (count === imgInformation.length) {
          zip.generateAsync({ type: "blob" }).then(function (content) {
            saveAs(content, zipFilename);
          });
        }
      });
    });
  };

  const downloadImageRegistration = () => {
    var zip = new JSZip();
    var count = 0;
    var zipFilename = "Registration.zip";
    imgRegistration.forEach(function (url, i) {
      var filename = imgRegistration[i];
      filename = filename
        .replace(/[\/\*\|\:\<\>\?\"\\]/gi, "")
        .replace("registration", "");
      JSZipUtils.getBinaryContent(url, function (err, data) {
        if (err) {
          throw err;
        }
        zip.file(filename, data, { binary: true });
        count++;
        if (count === imgRegistration.length) {
          zip.generateAsync({ type: "blob" }).then(function (content) {
            saveAs(content, zipFilename);
          });
        }
      });
    });
  };

  const downloadImageCertification = () => {
    var zip = new JSZip();
    var count = 0;
    var zipFilename = "Certification.zip";
    imgCertification.forEach(function (url, i) {
      var filename = imgCertification[i];
      filename = filename
        .replace(/[\/\*\|\:\<\>\?\"\\]/gi, "")
        .replace("registration", "");
      JSZipUtils.getBinaryContent(url, function (err, data) {
        if (err) {
          throw err;
        }
        zip.file(filename, data, { binary: true });
        count++;
        if (count === imgCertification.length) {
          zip.generateAsync({ type: "blob" }).then(function (content) {
            saveAs(content, zipFilename);
          });
        }
      });
    });
  };

  return (
    <>
      <div className="pl-lg-5">
        <div className="div-check-document">
          <Checkbox
            checked={deal}
            onChange={(e) => setDeal(e.target.checked)}
            className="check-document"
          >
            {`${i18n.t("cooperation_agreement", { lng: lang })}`}
          </Checkbox>

          <div className="form-input">
            <InputCustom
              title={`${i18n.t("profile_ID", { lng: lang })}`}
              value={valueDeal}
              onChange={(e) => setSetValueDeal(e.target.value)}
            />
          </div>
        </div>
        <hr />
        <div className="div-check-document">
          <Checkbox
            checked={identify}
            onChange={(e) => setIdentify(e.target.checked)}
            className="check-document"
          >
            {`${i18n.t("citizen_ID", { lng: lang })}`}
          </Checkbox>

          <div className="form-input">
            <div>
              <p className="label-input">{`${i18n.t("citizen_ID_front", {
                lng: lang,
              })}`}</p>
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
            </div>
            <div>
              <p className="label-input">{`${i18n.t("citizen_ID_back", {
                lng: lang,
              })}`}</p>
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
            </div>
          </div>
          {imgIdentifyFronsite && (
            <div className="div-col-download">
              <Button className="btn-download" onClick={downloadImageIdentify}>
                <i class="uil uil-image-download"></i>
              </Button>
            </div>
          )}
        </div>
        <hr />
        <div className="div-check-document">
          <Checkbox
            checked={information}
            onChange={(e) => setInformation(e.target.checked)}
            className="check-document"
          >
            {`${i18n.t("curriculum_vitae", { lng: lang })}`}
          </Checkbox>

          <div className="form-input">
            <div className="div-infomation">
              <p className="label-input">{`${i18n.t("image", {
                lng: lang,
              })}`}</p>
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
                    imgInformation.map((item, index) => {
                      return (
                        <div
                          className="div-item-thumbnail-infomation"
                          key={index}
                        >
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
          </div>
          {imgInformation.length > 0 && (
            <div className="div-col-download">
              <Button
                className="btn-download"
                onClick={downloadImageInformation}
              >
                <i class="uil uil-image-download"></i>
              </Button>
            </div>
          )}
        </div>
        <hr />
        <div className="div-check-document">
          <Checkbox
            checked={registration}
            onChange={(e) => setRegistration(e.target.checked)}
            className="check-document"
          >
            {`${i18n.t("household_book", { lng: lang })}`}
          </Checkbox>

          <div className="form-input">
            <div className="div-infomation">
              <p className="label-input">{`${i18n.t("image", {
                lng: lang,
              })}`}</p>
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
                    imgRegistration.map((item, index) => {
                      return (
                        <div
                          className="div-item-thumbnail-infomation"
                          key={index}
                        >
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
          </div>
          {imgRegistration.length > 0 && (
            <div span="2" className="div-col-download">
              <Button
                className="btn-download"
                onClick={downloadImageRegistration}
              >
                <i class="uil uil-image-download"></i>
              </Button>
            </div>
          )}
        </div>
        <hr />
        <div className="div-check-document">
          <Checkbox
            checked={certification}
            onChange={(e) => setCertification(e.target.checked)}
            className="check-document"
          >
            {`${i18n.t("certificate_conduct", { lng: lang })}`}
          </Checkbox>

          <div className="form-input">
            <div className="div-infomation">
              <p className="label-input">{`${i18n.t("image", {
                lng: lang,
              })}`}</p>
              <div className="col-img">
                <input
                  type="file"
                  id="files"
                  name="files"
                  accept=".jpg, .jpeg, .png"
                  multiple
                  onChange={onChangeCertification}
                />
                <div className="div-thumbnail-infomation">
                  <div className="div-thumbnail-infomation">
                    {imgCertification.length > 0 &&
                      imgCertification.map((item, index) => {
                        return (
                          <div
                            className="div-item-thumbnail-infomation"
                            key={index}
                          >
                            <i
                              class="uil uil-times-circle"
                              onClick={() => removeItemCertification(item)}
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
            </div>
          </div>
          {imgCertification.length > 0 && (
            <div className="div-col-download">
              <Button
                className="btn-download"
                onClick={downloadImageCertification}
              >
                <i class="uil uil-image-download"></i>
              </Button>
            </div>
          )}
        </div>
      </div>
      <Button className="btn-update" onClick={onUpdateDocument}>
        {`${i18n.t("update", { lng: lang })}`}
      </Button>
    </>
  );
};

export default Document;
