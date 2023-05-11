import React, { memo, useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { Form, Input, Label, Modal } from "reactstrap";
import { postFile } from "../../api/file";
import { createGroupServiceApi, getGroupServiceApi } from "../../api/service";
import { errorNotify } from "../../helper/toast";
import { loadingAction } from "../../redux/actions/loading";
import CustomTextInput from "../CustomTextInput/customTextInput";
import CustomButton from "../customButton/customButton";
import "./addGroupService.scss";

const AddGroupService = ({
  state,
  setState,
  setIsLoading,
  setData,
  setTotal,
}) => {
  const [titleVN, setTitleVN] = useState("");
  const [titleEN, setTitleEN] = useState("");
  const [imgThumbnail, setImgThumbnail] = useState("");
  const [imgUrl, setImgUrl] = useState("");
  const [descriptionVN, setDescriptionVN] = useState("");
  const [descriptionEN, setDescriptionEN] = useState("");
  const [type, setType] = useState("single");
  const [kind, setKind] = useState("");

  const dispatch = useDispatch();
  const onChangeThumbnail = (e) => {
    dispatch(loadingAction.loadingRequest(true));

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
      .then((res) => {
        setImgUrl(res);
        dispatch(loadingAction.loadingRequest(false));
      })
      .catch((err) => {
        errorNotify({
          message: err,
        });
        dispatch(loadingAction.loadingRequest(false));
      });
  };

  const createGroupSerive = useCallback(() => {
    setIsLoading(true);
    createGroupServiceApi({
      title: {
        vi: titleVN,
        en: titleEN,
      },
      description: {
        vi: descriptionVN,
        en: descriptionEN,
      },
      thumbnail: imgUrl,
      type: type,
      kind: kind,
    })
      .then((res) => {
        setIsLoading(false);
        getGroupServiceApi(0, 20)
          .then((res) => {
            setData(res?.data);
            setTotal(res?.totalItem);
          })
          .catch((err) => {});
      })
      .catch((err) => {
        errorNotify({
          message: err,
        });
        setIsLoading(false);
      });
  }, [titleVN, titleEN, descriptionVN, descriptionEN, imgUrl, type, kind]);

  return (
    <>
      {/* Button trigger modal */}
      <CustomButton
        title="Thêm group-service"
        className="btn-add-service"
        type="button"
        onClick={() => setState(!state)}
      />
      {/* Modal */}
      <Modal
        className="modal-dialog-centered"
        isOpen={state}
        toggle={() => setState(!state)}
      >
        <div className="modal-header">
          <h4 className="modal-title" id="exampleModalLabel">
            Thêm Group-service
          </h4>
          <button className="btn-close" onClick={() => setState(!state)}>
            <i className="uil uil-times-square"></i>
          </button>
        </div>
        <div className="modal-body">
          <Form>
            <div>
              <h5>Tiêu đề</h5>
              <CustomTextInput
                label={"Tiếng Việt"}
                id="exampleTitle"
                name="title"
                placeholder="Vui lòng nhập tiêu đề Tiếng Việt"
                type="text"
                value={titleVN}
                onChange={(e) => setTitleVN(e.target.value)}
              />
              <CustomTextInput
                label={"Tiếng Anh"}
                id="exampleTitle"
                name="title"
                placeholder="Vui lòng nhập tiêu đề Tiếng Anh"
                type="text"
                value={titleEN}
                onChange={(e) => setTitleEN(e.target.value)}
              />
            </div>
            <div>
              <h5>Chi tiết</h5>
              <CustomTextInput
                label={"Tiếng Việt"}
                id="exampleTitle"
                name="title"
                placeholder="Vui lòng nhập chi tiết Tiếng Việt"
                type="text"
                value={descriptionVN}
                onChange={(e) => setDescriptionVN(e.target.value)}
              />
              <CustomTextInput
                label={"Tiếng Anh"}
                id="exampleTitle"
                name="title"
                placeholder="Vui lòng nhập chi tiết Tiếng Anh"
                type="text"
                value={descriptionEN}
                onChange={(e) => setDescriptionEN(e.target.value)}
              />
            </div>

            <CustomTextInput
              label={"Loại"}
              id="exampleTitle"
              name="title"
              placeholder="Vui lòng nhập nội dung"
              type="text"
              value={kind}
              onChange={(e) => setKind(e.target.value)}
            />
            <CustomTextInput
              label={"Loại dịch vụ"}
              id="exampleType"
              name="type"
              type="select"
              className="select-code-phone"
              value={type}
              onChange={(e) => setType(e.target.value)}
              body={
                <>
                  <option value="single">Single</option>
                  <option value="multi_tab">MultipleTab</option>
                </>
              }
            />
            <div>
              <Label for="exampleImage">Thumbnail</Label>
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
            </div>

            <CustomButton
              title="Thêm"
              className="float-right btn-add-service"
              type="button"
              onClick={createGroupSerive}
            />
          </Form>
        </div>
      </Modal>
    </>
  );
};

export default memo(AddGroupService);
