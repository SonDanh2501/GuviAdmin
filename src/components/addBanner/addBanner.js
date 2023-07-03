import React, { memo, useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { errorNotify } from "../../helper/toast";
import { getBanners } from "../../redux/actions/banner";
import { loadingAction } from "../../redux/actions/loading";
import CustomButton from "../customButton/customButton";

import { Drawer, Input, Select } from "antd";
import { createBanner } from "../../api/banner";
import { getPromotionList } from "../../api/promotion";
import { getService } from "../../redux/selectors/service";
import UploadImage from "../uploadImage";
import "./addBanner.scss";
import { getLanguageState } from "../../redux/selectors/auth";
import i18n from "../../i18n";
import InputCustom from "../textInputCustom";

const AddBanner = () => {
  const [title, setTitle] = useState("");
  const [imgThumbnail, setImgThumbnail] = useState("");
  const [typeLink, setTypeLink] = useState("url");
  const [linkID, setLinkId] = useState("");
  const [position, setPosition] = useState("");
  const [promotionData, setPromotionData] = useState([]);
  const [kindService, setKindService] = useState("giup_viec_co_dinh");
  const dispatch = useDispatch();
  const service = useSelector(getService);
  const lang = useSelector(getLanguageState);
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
        title={`${i18n.t("create_banner", { lng: lang })}`}
        className="btn-add-banner"
        type="button"
        // onClick={() => setState(!state)}
        onClick={showDrawer}
      />

      <Drawer
        title={`${i18n.t("create_banner", { lng: lang })}`}
        width={420}
        onClose={onClose}
        open={open}
        bodyStyle={{
          paddingBottom: 80,
        }}
        headerStyle={{ height: 50 }}
      >
        <div>
          <InputCustom
            title={`${i18n.t("title", { lng: lang })}`}
            placeholder={`${i18n.t("placeholder", { lng: lang })}`}
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
          title={`${i18n.t("add", { lng: lang })}`}
          className="btn-add-banner-drawer"
          type="button"
          onClick={addBanner}
        />
      </Drawer>
    </>
  );
};

export default memo(AddBanner);
