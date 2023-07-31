import { Button, Drawer, Input, Select } from "antd";
import React, { memo, useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { postFile } from "../../api/file";
import { updateNew } from "../../api/news";
import resizeFile from "../../helper/resizer";
import { errorNotify } from "../../helper/toast";
import { loadingAction } from "../../redux/actions/loading";
import { getNews } from "../../redux/actions/news";
import CustomButton from "../customButton/customButton";
import "./editNews.scss";
import UploadImage from "../uploadImage";
import { getLanguageState } from "../../redux/selectors/auth";
import InputCustom from "../textInputCustom";
import i18n from "../../i18n";
const { TextArea } = Input;

const EditNews = ({ data }) => {
  const [title, setTitle] = useState("");
  const [type, setType] = useState("news");
  const [url, setUrl] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [imgThumbnail, setImgThumbnail] = useState("");
  const [position, setPosition] = useState("");
  const dispatch = useDispatch();
  const lang = useSelector(getLanguageState);
  const [open, setOpen] = useState(false);

  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    setTitle(data?.title);
    setShortDescription(data?.short_description);
    setImgThumbnail(data?.thumbnail);
    setUrl(data?.url);
    setType(data?.type);
    setPosition(data?.position);
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
      formData.append("multi-files", image);
      postFile(formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
        .then((res) => {
          setImgThumbnail(res[0]);
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
  const onEditNews = useCallback(() => {
    dispatch(loadingAction.loadingRequest(true));
    updateNew(data?._id, {
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
  }, [data, title, shortDescription, imgThumbnail, url, type, position]);

  return (
    <>
      <a onClick={showDrawer}>{`${i18n.t("edit", { lng: lang })}`}</a>
      {/* Modal */}
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
            placeholder={`${i18n.t("placeholder", { lng: lang })}`}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            textArea={true}
          />
        </div>
        <div className="mt-2">
          <InputCustom
            title={`${i18n.t("describe", { lng: lang })}`}
            placeholder={`${i18n.t("placeholder", { lng: lang })}`}
            value={shortDescription}
            onChange={(e) => setShortDescription(e.target.value)}
            textArea={true}
          />
        </div>
        <div className="mt-2">
          <InputCustom
            title="URL"
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </div>
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
        <div className="mt-2">
          <InputCustom
            title={`${i18n.t("position", { lng: lang })}`}
            placeholder={`${i18n.t("placeholder", { lng: lang })}`}
            type="text"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
          />
        </div>
        <UploadImage
          title={`Thumbnail 171px * 171px, ${i18n.t("ratio", {
            lng: lang,
          })} 1:1`}
          image={imgThumbnail}
          setImage={setImgThumbnail}
          classImg={"img-thumbnail"}
        />

        <Button
          className="float-right btn-modal-new"
          style={{ width: "auto" }}
          onClick={onEditNews}
        >
          {`${i18n.t("edit", { lng: lang })}`}
        </Button>
      </Drawer>
    </>
  );
};

export default memo(EditNews);
