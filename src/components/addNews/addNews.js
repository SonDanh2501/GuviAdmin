import { Button, Drawer, Input, Select } from "antd";
import React, { memo, useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createNew } from "../../api/news";
import { errorNotify } from "../../helper/toast";
import { loadingAction } from "../../redux/actions/loading";
import { getNews } from "../../redux/actions/news";
import CustomButton from "../customButton/customButton";
import UploadImage from "../uploadImage";
import "./addNews.scss";
import InputCustom from "../textInputCustom";
import { getLanguageState } from "../../redux/selectors/auth";
import i18n from "../../i18n";

const AddNews = () => {
  const [title, setTitle] = useState("");
  const [type, setType] = useState("news");
  const [url, setUrl] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [imgThumbnail, setImgThumbnail] = useState("");
  const [position, setPosition] = useState("");
  const [open, setOpen] = useState(false);
  const lang = useSelector(getLanguageState);
  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };
  const dispatch = useDispatch();

  const addNews = useCallback(() => {
    dispatch(loadingAction.loadingRequest(true));
    createNew({
      title: title,
      short_description: shortDescription,
      thumbnail: imgThumbnail,
      url: url,
      type: type,
      position: position,
    })
      .then((res) => {
        dispatch(getNews.getNewsRequest({ start: 0, length: 10 }));
        setOpen(false);
        dispatch(loadingAction.loadingRequest(false));
      })
      .catch((err) => {
        errorNotify({
          message: err,
        });
        dispatch(loadingAction.loadingRequest(false));
      });
  }, [dispatch, title, shortDescription, imgThumbnail, url, type, position]);

  return (
    <>
      {/* Button trigger modal */}
      <Button onClick={showDrawer} className="btn-add-new">
        {`${i18n.t("create_post", { lng: lang })}`}
      </Button>
      {/* Modal */}
      <Drawer
        title={`${i18n.t("create_post", { lng: lang })}`}
        placement="right"
        onClose={onClose}
        open={open}
        headerStyle={{ height: 50 }}
      >
        <InputCustom
          title={`${i18n.t("title", { lng: lang })}`}
          placeholder={`${i18n.t("placeholder", { lng: lang })}`}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          textArea={true}
        />
        <InputCustom
          title={`${i18n.t("describe", { lng: lang })}`}
          placeholder={`${i18n.t("placeholder", { lng: lang })}`}
          value={shortDescription}
          onChange={(e) => setShortDescription(e.target.value)}
          textArea={true}
        />
        <InputCustom
          title="URL"
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />

        <div className="mt-2">
          <InputCustom
            title="Type"
            value={type}
            style={{ width: "100%" }}
            onChange={(e) => setType(e)}
            options={[
              { value: "news", label: "News" },
              { value: "guvilover", label: "GUVILove" },
            ]}
            select={true}
          />
        </div>
        <InputCustom
          title={`${i18n.t("position", { lng: lang })}`}
          placeholder={`${i18n.t("placeholder", { lng: lang })}`}
          type="text"
          value={position}
          onChange={(e) => setPosition(e.target.value)}
        />
        <UploadImage
          title={`Thumbnail 171px * 171px, ${i18n.t("ratio", {
            lng: lang,
          })} 1:1`}
          image={imgThumbnail}
          setImage={setImgThumbnail}
          classImg={"img-thumbnail"}
        />

        <Button className="float-right btn-add-new mt-3" onClick={addNews}>
          {`${i18n.t("add", { lng: lang })}`}
        </Button>
      </Drawer>
    </>
  );
};

export default memo(AddNews);
