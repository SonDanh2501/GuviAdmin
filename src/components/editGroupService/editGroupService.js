import React, { memo, useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Form, Input, Label, Modal } from "reactstrap";
import { postFile } from "../../api/file";
import { loadingAction } from "../../redux/actions/loading";
import {
  createGroupServiceAction,
  updateGroupServiceAction,
} from "../../redux/actions/service";
import CustomButton from "../customButton/customButton";
import CustomTextInput from "../CustomTextInput/customTextInput";
import "./editGroupService.scss";
import { getGroupServiceApi, updateGroupServiceApi } from "../../api/service";
import { errorNotify } from "../../helper/toast";

const EditGroupService = ({ state, setState, data, setData, setTotal }) => {
  const [titleVN, setTitleVN] = useState("");
  const [titleEN, setTitleEN] = useState("");
  const [imgThumbnail, setImgThumbnail] = useState("");
  const [imgUrl, setImgUrl] = useState("");
  const [descriptionVN, setDescriptionVN] = useState("");
  const [descriptionEN, setDescriptionEN] = useState("");
  const [type, setType] = useState("single");
  const [kind, setKind] = useState("");

  const dispatch = useDispatch();

  useEffect(() => {
    setTitleVN(data?.title?.vi);
    setTitleEN(data?.title?.en);
    setDescriptionVN(data?.description?.vi);
    setDescriptionEN(data?.description?.en);
    setImgThumbnail(data?.thumbnail);
    setType(data?.type);
    setKind(data?.kind);
  }, [data]);
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
        dispatch(loadingAction.loadingRequest(false));
        setImgUrl(res);
      })
      .catch((err) => {
        dispatch(loadingAction.loadingRequest(false));
        errorNotify({
          message: err,
        });
      });
  };

  const editGroupSerive = useCallback(() => {
    dispatch(loadingAction.loadingRequest(true));
    updateGroupServiceApi(data?._id, {
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
    })
      .then((res) => {
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
      });
  }, [
    dispatch,
    titleVN,
    titleEN,
    descriptionVN,
    descriptionEN,
    imgUrl,
    type,
    data,
    kind,
  ]);

  return (
    <>
      <Modal
        className="modal-dialog-centered"
        isOpen={state}
        toggle={() => setState(!state)}
      >
        <div className="modal-header">
          <h4 className="modal-title" id="exampleModalLabel">
            Sửa Group-service
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
              title="Sửa"
              className="float-right btn-edit-service"
              type="button"
              onClick={editGroupSerive}
            />
          </Form>
        </div>
      </Modal>
    </>
  );
};

export default memo(EditGroupService);
