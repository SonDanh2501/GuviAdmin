import { Image } from "antd";
import React, { memo, useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form, Input, Label, Modal } from "reactstrap";
import { updateBanner } from "../../api/banner";
import { postFile } from "../../api/file";
import resizeFile from "../../helper/resizer";
import { errorNotify } from "../../helper/toast";
import { getBanners } from "../../redux/actions/banner";
import { loadingAction } from "../../redux/actions/loading";
import { getPromotion } from "../../redux/actions/promotion";
import { getPromotionSelector } from "../../redux/selectors/promotion";
import { getService } from "../../redux/selectors/service";
import CustomButton from "../customButton/customButton";
import CustomTextInput from "../CustomTextInput/customTextInput";
import "./editBanner.scss";

const EditBanner = ({ state, setState, data }) => {
  const [title, setTitle] = useState("");
  const [imgThumbnail, setImgThumbnail] = useState("");
  const [typeLink, setTypeLink] = useState("url");
  const [linkID, setLinkId] = useState("");
  const [position, setPosition] = useState("");
  const [kindService, setKindService] = useState("giup_viec_co_dinh");
  const dispatch = useDispatch();
  const promotion = useSelector(getPromotionSelector);
  const service = useSelector(getService);
  useEffect(() => {
    dispatch(getPromotion.getPromotionRequest());
  }, [dispatch]);

  useEffect(() => {
    setTitle(data?.title);
    setImgThumbnail(data?.image);
    setTypeLink(data?.type_link);
    setLinkId(data?.link_id);
    setPosition(data?.position);
    setKindService(
      data?.link_id === "6321598ea6c81260452bf4f5"
        ? "giup_viec_theo_gio"
        : data?.link_id === "63215877a6c81260452bf4f0"
        ? "giup_viec_co_dinh"
        : ""
    );
  }, [data]);

  const onChangeThumbnail = async (e) => {
    dispatch(loadingAction.loadingRequest(true));
    try {
      if (e.target.files[0]) {
        const reader = new FileReader();
        reader.addEventListener("load", () => {
          setImgThumbnail(reader.result);
        });
        reader.readAsDataURL(e.target.files[0]);
      }
      const file = e.target.files[0];
      const image = await resizeFile(file);
      const formData = new FormData();
      formData.append("file", image);
      postFile(formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
        .then((res) => {
          setImgThumbnail(res);
          dispatch(loadingAction.loadingRequest(false));
        })
        .catch((err) => {
          errorNotify({
            message: err,
          });
          dispatch(loadingAction.loadingRequest(false));
        });
    } catch (err) {
      console.log(err);
    }
  };

  const onEditBanner = useCallback(() => {
    dispatch(loadingAction.loadingRequest(true));
    updateBanner(data?._id, {
      title: title,
      image: imgThumbnail,
      type_link: typeLink,
      link_id: linkID,
      position: position,
      kind: kindService,
    })
      .then((res) => {
        dispatch(getBanners.getBannersRequest(0, 10));
        setState(!state);
        dispatch(loadingAction.loadingRequest(false));
      })
      .catch((err) => {
        errorNotify({
          message: err,
        });
        dispatch(loadingAction.loadingRequest(false));
        setState(!state);
      });
  }, [data, title, imgThumbnail, typeLink, linkID, position, kindService]);

  return (
    <>
      {/* Modal */}
      <Modal
        className="modal-dialog-centered"
        isOpen={state}
        toggle={() => setState(!state)}
      >
        <div className="modal-header">
          <h3 className="modal-title" id="exampleModalLabel">
            Sửa banner
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
                  <option value={"service"}>Service</option>
                </>
              }
            />
            <div>
              {typeLink === "url" ? (
                <CustomTextInput
                  label={"Link URL"}
                  id="examplelink_url"
                  name="link_url"
                  type="text"
                  value={linkID}
                  onChange={(e) => setLinkId(e.target.value)}
                />
              ) : typeLink === "promotion" ? (
                <CustomTextInput
                  label={"Link ID"}
                  className="select-code-phone"
                  id="examplelink_id"
                  name="link_id"
                  type="select"
                  value={linkID}
                  onChange={(e) => {
                    if (e.target.value === "6321598ea6c81260452bf4f5") {
                      setLinkId(e.target.value);
                      setKindService("giup_viec_theo_gio");
                    } else if (e.target.value === "63215877a6c81260452bf4f0") {
                      setLinkId(e.target.value);
                      setKindService("giup_viec_co_dinh");
                    }
                  }}
                  body={promotion.map((item, index) => {
                    return (
                      <option key={index} value={item?._id}>
                        {item?.title?.vi}
                      </option>
                    );
                  })}
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
                  body={service.map((item, index) => {
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

            <div>
              <a className="label">Hình ảnh 360px * 137px, tỉ lệ 2,62</a>

              <Input
                id="exampleImage"
                name="image"
                type="file"
                accept={".jpg,.png,.jpeg"}
                className="input-group"
                onChange={onChangeThumbnail}
              />
              {imgThumbnail && (
                <Image src={imgThumbnail} className="img-thumbnail-banner" />
              )}
            </div>

            <CustomButton
              title="Sửa"
              className="float-right btn-edit-banner"
              type="button"
              onClick={onEditBanner}
            />
          </Form>
        </div>
      </Modal>
    </>
  );
};

export default memo(EditBanner);
