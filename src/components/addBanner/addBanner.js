import React, { memo, useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form, Input, Label, Modal } from "reactstrap";
import { postFile } from "../../api/file";
import { getBanners } from "../../redux/actions/banner";
import { loadingAction } from "../../redux/actions/loading";
import { getPromotion } from "../../redux/actions/promotion";
import { getPromotionSelector } from "../../redux/selectors/promotion";
import CustomButton from "../customButton/customButton";
import CustomTextInput from "../CustomTextInput/customTextInput";
import { errorNotify } from "../../helper/toast";

import "./addBanner.scss";
import { Drawer, Image } from "antd";
import resizeFile from "../../helper/resizer";
import { getService } from "../../redux/selectors/service";
import { createBanner } from "../../api/banner";

const AddBanner = () => {
  const [state, setState] = useState(false);
  const [title, setTitle] = useState("");
  const [imgThumbnail, setImgThumbnail] = useState("");
  const [typeLink, setTypeLink] = useState("url");
  const [linkID, setLinkId] = useState("");
  const [position, setPosition] = useState("");
  const [kindService, setKindService] = useState("giup_viec_co_dinh");
  const dispatch = useDispatch();
  const promotion = useSelector(getPromotionSelector);
  const service = useSelector(getService);
  const [open, setOpen] = useState(false);

  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = ({ data }) => {
    setOpen(false);
  };

  useEffect(() => {
    dispatch(getPromotion.getPromotionRequest());
  }, [dispatch]);

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

  const addBanner = useCallback(() => {
    dispatch(loadingAction.loadingRequest(true));
    createBanner({
      title: title,
      image: imgThumbnail,
      type_link: typeLink,
      link_id: linkID,
      position: position,
      kind: kindService,
    })
      .then((res) => {
        dispatch(getBanners.getBannersRequest(0, 10));
        setOpen(false);
        dispatch(loadingAction.loadingRequest(false));
      })
      .catch((err) => {
        errorNotify({
          message: err,
        });
        dispatch(loadingAction.loadingRequest(false));
        setOpen(false);
      });
  }, [dispatch, title, imgThumbnail, typeLink, linkID, position, kindService]);

  return (
    <>
      {/* Button trigger modal */}
      <CustomButton
        title="Thêm banner"
        className="btn-add-banner"
        type="button"
        // onClick={() => setState(!state)}
        onClick={showDrawer}
      />

      <Drawer
        title="Thêm banner"
        width={500}
        onClose={onClose}
        open={open}
        bodyStyle={{
          paddingBottom: 80,
        }}
      >
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
                  onChange={(e) => setLinkId(e.target.value)}
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
                  onChange={(e) => {
                    if (e.target.value === "6321598ea6c81260452bf4f5") {
                      setLinkId(e.target.value);
                      setKindService("giup_viec_theo_gio");
                    } else if (e.target.value === "63215877a6c81260452bf4f0") {
                      setLinkId(e.target.value);
                      setKindService("giup_viec_co_dinh");
                    }
                  }}
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
              title="Thêm"
              className="float-left btn-add-banner"
              type="button"
              onClick={addBanner}
            />
          </Form>
        </div>
      </Drawer>
    </>
  );
};

export default memo(AddBanner);
