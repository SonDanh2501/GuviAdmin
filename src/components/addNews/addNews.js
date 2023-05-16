import React, { memo, useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { Form, FormGroup, Label, Modal } from "reactstrap";
import { postFile } from "../../api/file";
import { loadingAction } from "../../redux/actions/loading";
import CustomButton from "../customButton/customButton";
import CustomTextInput from "../CustomTextInput/customTextInput";
import { errorNotify } from "../../helper/toast";
import "./addNews.scss";
import resizeFile from "../../helper/resizer";
import { createNew } from "../../api/news";
import { getNews } from "../../redux/actions/news";
import { Drawer, Input, Select } from "antd";
const { TextArea } = Input;

const AddNews = () => {
  const [title, setTitle] = useState("");
  const [type, setType] = useState("news");
  const [url, setUrl] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [imgThumbnail, setImgThumbnail] = useState("");
  const [position, setPosition] = useState("");
  const [open, setOpen] = useState(false);

  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };
  const dispatch = useDispatch();

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
      <CustomButton
        title="Thêm bài viết"
        className="btn-add-new"
        type="button"
        onClick={showDrawer}
      />
      {/* Modal */}
      <Drawer
        title="Thêm nói bài viết"
        placement="right"
        onClose={onClose}
        open={open}
      >
        <div>
          <a className="title-new">Tiêu đề</a>
          <TextArea
            placeholder="Vui lòng nhập tiêu đề"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="mt-2">
          <a>Mô tả</a>
          <TextArea
            placeholder="Vui lòng nhập mô tả ngắn"
            value={shortDescription}
            onChange={(e) => setShortDescription(e.target.value)}
          />
        </div>
        <div className="mt-2">
          <a>URL</a>
          <Input
            placeholder="Vui lòng nhập url"
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </div>
        <div className="mt-2">
          <a>Type</a>
          <Select
            value={type}
            style={{ width: "100%" }}
            onChange={(e) => setType(e)}
            options={[
              { value: "news", label: "News" },
              { value: "guvilover", label: "GUVILove" },
            ]}
          />
        </div>
        <div className="mt-2">
          <a>Vị trí</a>
          <Input
            placeholder="Vui lòng nhập position"
            type="text"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
          />
        </div>

        <div className="mt-2">
          <a>Thumbnail 171px * 171px, tỉ lệ 1:1</a>
          <Input
            id="exampleThumbnail"
            type="file"
            accept={".jpg,.png,.jpeg"}
            className="chosse-image"
            onChange={onChangeThumbnail}
          />
          {imgThumbnail && <img src={imgThumbnail} className="img-thumbnail" />}
        </div>

        <CustomButton
          title="Thêm"
          className="float-right btn-add-new"
          type="button"
          onClick={addNews}
        />
      </Drawer>
    </>
  );
};

export default memo(AddNews);
