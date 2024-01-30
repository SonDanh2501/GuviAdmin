import {
  CloseCircleOutlined,
  LoadingOutlined,
  PlusOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { Input, Upload } from "antd";
import "./styles.scss";
import { useState } from "react";
import resizeFile from "../../helper/resizer";
import { errorNotify } from "../../helper/toast";
import { useDispatch } from "react-redux";
import { loadingAction } from "../../redux/actions/loading";
import { postFile } from "../../api/file";
import axios from "axios";

const UploadImage = (props) => {
  const {
    setUrl,
    classImg,
    title,
    image,
    setImage,
    icon,
    disabled,
    classUpload,
  } = props;
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const uploadButton = (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </div>
  );

  const handleChange = async (info) => {
    if (info.file.status === "uploading") {
      setLoading(true);
      return;
    }
    const extend = info.fileList[0].type.slice(
      info.fileList[0].type.indexOf("/") + 1
    );
    try {
      const file = info.fileList[0].originFileObj;
      const image = await resizeFile(file, extend);
      const formData = new FormData();
      formData.append("multi-files", image);
      postFile(formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
        .then((res) => {
          setImage(res[0]);
          setLoading(false);
        })
        .catch((err) => {
          setImage("");
          errorNotify({
            message: err?.message,
          });
          setLoading(false);
        });
    } catch (error) {}
  };

  return (
    <div className="mt-2 div-upload">
      {title && (
        <div className="div-head-title-upload">
          <a className="title-upload">{title}</a>
          <div>{icon}</div>
        </div>
      )}
      <Upload
        className={classUpload}
        onChange={handleChange}
        showUploadList={false}
        disabled={disabled}
      >
        {image ? <img src={image} className={classImg} /> : uploadButton}
      </Upload>
    </div>
  );
};

export default UploadImage;
