import React, { memo, useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Form, Input, Label, Modal } from "reactstrap";
import { postFile } from "../../api/file";
import { createGroupServiceAction } from "../../redux/actions/service";
import CustomButton from "../customButton/customButton";
import CustomTextInput from "../CustomTextInput/customTextInput";
import "./editGroupService.scss";

const EditGroupService = ({ state, setState, data }) => {
  const [titleVN, setTitleVN] = useState("");
  const [titleEN, setTitleEN] = useState("");
  const [imgThumbnail, setImgThumbnail] = useState("");
  const [imgUrl, setImgUrl] = useState("");
  const [descriptionVN, setDescriptionVN] = useState("");
  const [descriptionEN, setDescriptionEN] = useState("");
  const [type, setType] = useState("single");

  const dispatch = useDispatch();

  useEffect(() => {
    setTitleVN(data?.title?.vi);
    setTitleEN(data?.title?.en);
    setDescriptionVN(data?.description?.vi);
    setDescriptionEN(data?.description?.en);
    setImgThumbnail(data?.thumbnail);
    setType(data?.type);
  }, [data]);
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
      .then((res) => setImgUrl(res))
      .catch((err) => console.log("err", err));
  };

  const createGroupSerive = useCallback(() => {
    dispatch(
      createGroupServiceAction.createGroupServiceRequest({
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
    );
  }, [dispatch, titleVN, titleEN, descriptionVN, descriptionEN, imgUrl, type]);

  return (
    <>
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
              className="float-right btn-modal"
              type="button"
              onClick={createGroupSerive}
            />
          </Form>
        </div>
      </Modal>
    </>
  );
};

export default memo(EditGroupService);
