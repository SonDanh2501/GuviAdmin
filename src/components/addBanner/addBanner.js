import React, { memo, useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { postFile } from "../../api/file";
import { errorNotify } from "../../helper/toast";
import { getBanners } from "../../redux/actions/banner";
import { loadingAction } from "../../redux/actions/loading";
import { getPromotion } from "../../redux/actions/promotion";
import { getPromotionSelector } from "../../redux/selectors/promotion";
import CustomButton from "../customButton/customButton";

import { Drawer, Image, Input, Select } from "antd";
import { createBanner } from "../../api/banner";
import resizeFile from "../../helper/resizer";
import { getService } from "../../redux/selectors/service";
import "./addBanner.scss";

const AddBanner = () => {
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
  const promotionOption = [];
  const serviceOption = [];
  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = ({ data }) => {
    setOpen(false);
  };

  useEffect(() => {
    dispatch(getPromotion.getPromotionRequest());
  }, [dispatch]);

  promotion?.map((item) => {
    promotionOption.push({
      value: item?._id,
      label: item?.title?.vi,
    });
  });

  service?.map((item) => {
    serviceOption?.push({
      value: item?._id,
      label: item?.title?.vi,
      kind: item?.kind,
    });
  });

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
        width={420}
        onClose={onClose}
        open={open}
        bodyStyle={{
          paddingBottom: 80,
        }}
      >
        <div>
          <a>Tiêu đề</a>
          <Input
            placeholder="Vui lòng nhập tiêu đề"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="mt-2">
          <a>Loại banner</a>
          <Select
            style={{ width: "100%" }}
            value={typeLink}
            onChange={(e) => setTypeLink(e)}
            options={[
              { value: "url", label: "URL" },
              { value: "promotion", label: "Promotion" },
              { value: "service", label: "Service" },
            ]}
          />
        </div>
        <div className="mt-2">
          {typeLink === "url" ? (
            <div>
              <a>Link URL</a>
              <Input
                style={{ width: "100%" }}
                type="text"
                value={linkID}
                onChange={(e) => setLinkId(e.target.value)}
              />
            </div>
          ) : typeLink === "promotion" ? (
            <div>
              <a>Link ID</a>
              <Select
                style={{ width: "100%" }}
                value={linkID}
                onChange={(e) => setLinkId(e)}
                options={promotionOption}
              />
            </div>
          ) : (
            <div>
              <a>Link ID</a>
              <Select
                style={{ width: "100%" }}
                value={linkID}
                onChange={(value, label) => {
                  setLinkId(value);
                  setKindService(label?.kind);
                }}
                options={serviceOption}
              />
            </div>
          )}
        </div>

        <div className="mt-2">
          <a>Vị trí</a>
          <Input
            style={{ width: "100%" }}
            placeholder="0 or 1, 2, 3, ..."
            value={position}
            onChange={(e) => setPosition(e.target.value)}
          />
        </div>

        <div className="mt-2">
          <a className="label-img">Hình ảnh 360px * 137px, tỉ lệ 2,62</a>
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
      </Drawer>
    </>
  );
};

export default memo(AddBanner);
