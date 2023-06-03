import { Drawer, Input, Select } from "antd";
import React, { memo, useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { postFile } from "../../api/file";
import { updateNew } from "../../api/news";
import resizeFile from "../../helper/resizer";
import { errorNotify } from "../../helper/toast";
import { loadingAction } from "../../redux/actions/loading";
import { getNews } from "../../redux/actions/news";
import CustomButton from "../customButton/customButton";
import "./editNews.scss";
import UploadImage from "../uploadImage";
const { TextArea } = Input;

const EditNews = ({ data }) => {
  const [title, setTitle] = useState("");
  const [type, setType] = useState("news");
  const [url, setUrl] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [imgThumbnail, setImgThumbnail] = useState("");
  const [position, setPosition] = useState("");

  const dispatch = useDispatch();
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
      <a onClick={showDrawer}>Chỉnh sửa</a>
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
          <a className="title-new">Mô tả</a>
          <TextArea
            placeholder="Vui lòng nhập mô tả ngắn"
            value={shortDescription}
            onChange={(e) => setShortDescription(e.target.value)}
          />
        </div>
        <div className="mt-2">
          <a className="title-new">URL</a>
          <Input
            placeholder="Vui lòng nhập url"
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </div>
        <div className="mt-2">
          <a className="title-new">Type</a>
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
          <a className="title-new">Vị trí</a>
          <Input
            placeholder="Vui lòng nhập position"
            type="text"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
          />
        </div>
        <UploadImage
          title={"Thumbnail 171px * 171px, tỉ lệ 1:1"}
          image={imgThumbnail}
          setImage={setImgThumbnail}
          classImg={"img-thumbnail"}
        />

        <CustomButton
          title="Sửa"
          className="float-right btn-modal-new"
          type="button"
          onClick={onEditNews}
        />
      </Drawer>
    </>
  );
};

export default memo(EditNews);
