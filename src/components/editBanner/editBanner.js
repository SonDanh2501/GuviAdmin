import { Drawer, Image, Input, Select } from "antd";
import React, { memo, useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
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
import UploadImage from "../uploadImage";
import { getPromotionList } from "../../api/promotion";

const EditBanner = ({ data }) => {
  const [title, setTitle] = useState("");
  const [imgThumbnail, setImgThumbnail] = useState("");
  const [typeLink, setTypeLink] = useState("url");
  const [linkID, setLinkId] = useState("");
  const [position, setPosition] = useState("");
  const [kindService, setKindService] = useState("");
  const dispatch = useDispatch();
  const [promotionData, setPromotionData] = useState([]);
  const service = useSelector(getService);
  const promotionOption = [];
  const serviceOption = [];
  const [open, setOpen] = useState(false);

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    getPromotionList()
      .then((res) => {
        setPromotionData(res?.data);
      })
      .catch((err) => {});
  }, [dispatch]);

  promotionData?.map((item) => {
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

  useEffect(() => {
    setTitle(data?.title);
    setImgThumbnail(data?.image);
    setTypeLink(data?.type_link);
    setLinkId(data?.link_id);
    setPosition(data?.position);
    setKindService(data?.kind);
  }, [data]);

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
        dispatch(getBanners.getBannersRequest({ start: 0, length: 20 }));
        setOpen(false);
        dispatch(loadingAction.loadingRequest(false));
      })
      .catch((err) => {
        errorNotify({
          message: err,
        });
        dispatch(loadingAction.loadingRequest(false));
      });
  }, [data, title, imgThumbnail, typeLink, linkID, position, kindService]);

  return (
    <>
      <a onClick={showDrawer}>Chỉnh sửa</a>
      <Drawer
        title="Basic Drawer"
        placement="right"
        onClose={onClose}
        open={open}
      >
        <div>
          <a>Tiêu đề</a>
          <Input
            style={{ width: "100%" }}
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
              <a>Chọn mã khuyến mãi</a>
              <Select
                style={{ width: "100%" }}
                value={linkID}
                onChange={(value, label) => {
                  setLinkId(value);
                  setKindService(label?.kind);
                }}
                options={promotionOption}
              />
            </div>
          ) : (
            <div>
              <a>Link ID</a>
              <Select
                style={{ width: "100%" }}
                value={linkID}
                onChange={(e) => setLinkId(e)}
                options={serviceOption}
              />
            </div>
          )}
        </div>
        <div className="mt-2">
          <a>Vị trí</a>
          <Input
            type="number"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
          />
        </div>

        <UploadImage
          title={"Hình ảnh 360px * 137px, tỉ lệ 2,62"}
          image={imgThumbnail}
          setImage={setImgThumbnail}
          classImg={"img-thumbnail-banner"}
        />

        <CustomButton
          title="Sửa"
          className="float-right btn-edit-banner"
          type="button"
          onClick={onEditBanner}
        />
      </Drawer>
    </>
  );
};

export default memo(EditBanner);
