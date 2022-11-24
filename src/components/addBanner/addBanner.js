import React, { memo, useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form, Input, Label, Modal } from "reactstrap";
import { postFile } from "../../api/file";
import { createBanner } from "../../redux/actions/banner";
import { getPromotion } from "../../redux/actions/promotion";
import { getPromotionSelector } from "../../redux/selectors/promotion";
import CustomButton from "../customButton/customButton";
import CustomTextInput from "../CustomTextInput/customTextInput";
import "./addBanner.scss";

const AddBanner = () => {
  const [state, setState] = useState(false);
  const [title, setTitle] = useState("");
  const [imgThumbnail, setImgThumbnail] = useState("");
  const [typeLink, setTypeLink] = useState("url");
  const [linkID, setLinkId] = useState("");
  const [position, setPosition] = useState("");

  const [dataFilter, setDataFilter] = useState([]);
  const dispatch = useDispatch();
  const promotion = useSelector(getPromotionSelector);

  useEffect(() => {
    dispatch(getPromotion.getPromotionRequest());
  }, [dispatch]);

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

  const addBanner = useCallback(() => {
    dispatch(
      createBanner.createBannerRequest({
        title: title,
        image: imgThumbnail,
        type_link: typeLink,
        link_id: linkID,
        position: position,
      })
    );
  }, [dispatch, title, imgThumbnail, typeLink, linkID, position]);

  return (
    <>
      {/* Button trigger modal */}
      <CustomButton
        title="Thêm banner"
        className="btn-modal"
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
          <h3 className="modal-title" id="exampleModalLabel">
            Thêm banner
          </h3>
          <button className="btn-close" onClick={() => setState(!state)}>
            <i className="uil uil-times-square"></i>
          </button>
        </div>
        <div className="modal-body">
          <Form>
            <CustomTextInput
              label={"Tiêu đề"}
              id="exampleTitle"
              name="title"
              placeholder="Enter your title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <div>
              <Label for="exampleImage">Hình ảnh banner</Label>
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
            <CustomTextInput
              label={"Kiểu banner"}
              id="exampleType_link"
              name="type_link"
              className="select-code-phone"
              type="select"
              defaultValue={typeLink}
              onChange={(e) => setTypeLink(e.target.value)}
              body={
                <>
                  <option value={"url"}>URL</option>
                  <option value={"promotion"}>Promotion</option>
                </>
              }
            />
            <div>
              {typeLink !== "promotion" ? (
                <CustomTextInput
                  label={"Link URL"}
                  id="examplelink_url"
                  name="link_url"
                  type="text"
                  value={linkID}
                  onChange={(e) => setLinkId(e.target.value)}
                />
              ) : (
                <CustomTextInput
                  label={"Link ID"}
                  className="select-code-phone"
                  id="examplelink_id"
                  name="link_id"
                  type="select"
                  value={linkID}
                  onChange={(e) => setLinkId(e.target.value)}
                  body={promotion.map((item, index) => {
                    return (
                      <option key={index} value={item?._id}>
                        {item?.title?.vi}
                      </option>
                    );
                  })}
                />
              )}
            </div>
            <CustomTextInput
              label={"Position"}
              iid="examplePosition"
              name="position"
              placeholder="0 or 1, 2, 3, ..."
              type="number"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
            />

            <CustomButton
              title="Thêm"
              className="float-right btn-modal"
              type="button"
              onClick={addBanner}
            />
          </Form>
        </div>
      </Modal>
    </>
  );
};

export default memo(AddBanner);
