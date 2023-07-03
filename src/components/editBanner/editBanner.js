import { Drawer, Input, Select } from "antd";
import React, { memo, useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateBanner } from "../../api/banner";
import { getPromotionList } from "../../api/promotion";
import { errorNotify } from "../../helper/toast";
import { getBanners } from "../../redux/actions/banner";
import { loadingAction } from "../../redux/actions/loading";
import { getService } from "../../redux/selectors/service";
import CustomButton from "../customButton/customButton";
import UploadImage from "../uploadImage";
import "./editBanner.scss";
import { getLanguageState } from "../../redux/selectors/auth";
import i18n from "../../i18n";
import InputCustom from "../textInputCustom";

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
  const lang = useSelector(getLanguageState);

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
      label: item?.title?.[lang],
    });
  });

  service?.map((item) => {
    serviceOption?.push({
      value: item?._id,
      label: item?.title?.[lang],
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
      <a onClick={showDrawer}>{`${i18n.t("edit", { lng: lang })}`}</a>
      <Drawer
        title={`${i18n.t("edit", { lng: lang })}`}
        placement="right"
        onClose={onClose}
        open={open}
        headerStyle={{ height: 50 }}
      >
        <div>
          <InputCustom
            title={`${i18n.t("title", { lng: lang })}`}
            style={{ width: "100%" }}
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="mt-2">
          <InputCustom
            title={`${i18n.t("banner_type", { lng: lang })}`}
            style={{ width: "100%" }}
            value={typeLink}
            onChange={(e) => setTypeLink(e)}
            options={[
              { value: "url", label: "URL" },
              { value: "promotion", label: "Promotion" },
              { value: "service", label: "Service" },
            ]}
            select={true}
          />
        </div>

        <div className="mt-2">
          {typeLink === "url" ? (
            <div>
              <InputCustom
                title="Link URL"
                style={{ width: "100%" }}
                type="text"
                value={linkID}
                onChange={(e) => setLinkId(e.target.value)}
              />
            </div>
          ) : typeLink === "promotion" ? (
            <div>
              <InputCustom
                title={`${i18n.t("select_promotion", { lng: lang })}`}
                style={{ width: "100%" }}
                value={linkID}
                onChange={(e) => setLinkId(e)}
                options={promotionOption}
                select={true}
              />
            </div>
          ) : (
            <div>
              <InputCustom
                title="Link ID"
                style={{ width: "100%" }}
                value={linkID}
                onChange={(value, label) => {
                  setLinkId(value);
                  setKindService(label?.kind);
                }}
                options={serviceOption}
                select={true}
              />
            </div>
          )}
        </div>
        <div className="mt-2">
          <InputCustom
            title={`${i18n.t("position", { lng: lang })}`}
            style={{ width: "100%" }}
            value={position}
            onChange={(e) => setPosition(e.target.value)}
          />
        </div>

        <UploadImage
          title={`${i18n.t("image", { lng: lang })} 360px * 137px, ${i18n.t(
            "ratio",
            { lng: lang }
          )}  2,62`}
          image={imgThumbnail}
          setImage={setImgThumbnail}
          classImg={"img-thumbnail-banner"}
        />

        <CustomButton
          title={`${i18n.t("edit", { lng: lang })}`}
          className="float-right btn-edit-banner"
          type="button"
          onClick={onEditBanner}
        />
      </Drawer>
    </>
  );
};

export default memo(EditBanner);
