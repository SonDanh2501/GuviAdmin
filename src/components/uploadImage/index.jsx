import { CloseCircleOutlined, UploadOutlined } from "@ant-design/icons";
import { Input } from "antd";
import "./styles.scss";
import { useState } from "react";
import resizeFile from "../../helper/resizer";
import { errorNotify } from "../../helper/toast";
import { useDispatch } from "react-redux";
import { loadingAction } from "../../redux/actions/loading";
import { postFile } from "../../api/file";

const UploadImage = (props) => {
  const { setUrl, classImg, title, image, setImage } = props;
  const dispatch = useDispatch();

  const onChangeThumbnail = async (e) => {
    dispatch(loadingAction.loadingRequest(true));
    try {
      if (e.target.files[0]) {
        const reader = new FileReader();
        reader.addEventListener("load", () => {
          setImage(reader.result);
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
          setImage(res);
          dispatch(loadingAction.loadingRequest(false));
        })
        .catch((err) => {
          errorNotify({
            message: err,
          });
          dispatch(loadingAction.loadingRequest(false));
        });
    } catch (err) {}
  };

  return (
    <div className="mt-2 div-upload">
      <a className="title-upload">{title}</a>
      <Input
        id="actual-btn"
        type="file"
        accept={".jpg,.png,.jpeg"}
        className="input-image"
        onChange={onChangeThumbnail}
      />
      {image && (
        <div className="div-image">
          <img src={image} className={classImg} />
          <CloseCircleOutlined
            className="icon_delete_image"
            onClick={() => setImage("")}
          />
        </div>
      )}
    </div>
  );
};

export default UploadImage;
