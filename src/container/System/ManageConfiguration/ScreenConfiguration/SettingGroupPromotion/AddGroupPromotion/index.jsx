import { useState } from "react";
import "./styles.scss";
import { Button, Drawer, Select } from "antd";
import InputCustom from "../../../../../../components/textInputCustom";
import UploadImage from "../../../../../../components/uploadImage";
import {
  createGroupPromotion,
  getGroupPromotion,
} from "../../../../../../api/configuration";
import { errorNotify } from "../../../../../../helper/toast";
import LoadingPagination from "../../../../../../components/paginationLoading";

const AddGroupPromotion = (props) => {
  const { setData, data } = props;
  const [state, setState] = useState({
    open: false,
    thumbnail: "",
    isLoading: false,
    position: 0,
    type: "",
  });
  const [title, setTitle] = useState({
    vi: "",
  });
  const [description, setDescription] = useState({
    vi: "",
  });

  const onCreate = () => {
    setState({ ...state, isLoading: true });
    createGroupPromotion({
      name: title,
      description: description,
      thumbnail: state.thumbnail,
      position: state.position,
      type_render_view: state.type,
    })
      .then((res) => {
        setState({ ...state, isLoading: false });
        getGroupPromotion(0, 20, "")
          .then((res) => {
            setData({ ...data, data: res?.data, totalData: res?.totalItem });
            setState({ ...state, isLoading: false, open: false });
          })
          .catch((err) => {});
      })
      .catch((err) => {
        setState({ ...state, isLoading: false });

        errorNotify({
          message: err?.message,
        });
      });
  };

  return (
    <>
      <div
        className="btn-add-group-promo"
        onClick={() => setState({ ...state, open: true })}
      >
        <p className="text-btn">
          {" "}
          <i class="uil uil-plus-circle"></i> Tạo mới
        </p>
      </div>
      <Drawer
        title="Thêm nhóm khuyến mãi"
        placement="right"
        onClose={() => setState({ ...state, open: false })}
        open={state.open}
        headerStyle={{ height: 60, padding: 0 }}
      >
        <div className="form-input">
          <p className="label-input">Tiêu đề</p>
          {Object.entries(title).map(([key, value]) => {
            return (
              <div key={key} className="div-item-input">
                <InputCustom
                  title={`Tiếng ${
                    key === "vi" ? "Việt" : key === "en" ? "Anh" : "Nhật"
                  }`}
                  className="input-lang"
                  placeholder={`Nhập nội dung tiêu đề Tiếng ${
                    key === "vi" ? "Việt" : key === "en" ? "Anh" : "Nhật"
                  }`}
                  onChange={(e) =>
                    setTitle({ ...title, [key]: e.target.value })
                  }
                />

                {key !== "vi" && (
                  <i
                    className="uil uil-times-circle"
                    onClick={() => {
                      delete title[key];
                      setTitle({ ...title });
                    }}
                  ></i>
                )}
              </div>
            );
          })}
          <Select
            size="small"
            style={{ width: "45%", marginTop: 10 }}
            placeholder="Thêm ngôn ngữ"
            options={language_muti}
            onChange={(e) => {
              const language = (title[e] = "");
              setTitle({ ...title, language });
              delete title[language];
              setTitle({ ...title });
            }}
          />
        </div>
        <div className="form-input">
          <p className="label-input">Mô tả</p>
          {Object.entries(description).map(([key, value]) => {
            return (
              <div key={key} className="div-item-input">
                <InputCustom
                  title={`Tiếng ${
                    key === "vi" ? "Việt" : key === "en" ? "Anh" : "Nhật"
                  }`}
                  className="input-lang"
                  placeholder={`Nhập nội dung mô tả Tiếng ${
                    key === "vi" ? "Việt" : key === "en" ? "Anh" : "Nhật"
                  }`}
                  onChange={(e) =>
                    setDescription({ ...title, [key]: e.target.value })
                  }
                />
                {key !== "vi" && (
                  <i
                    className="uil uil-times-circle"
                    onClick={() => {
                      delete description[key];
                      setDescription({ ...description });
                    }}
                  ></i>
                )}
              </div>
            );
          })}
          <Select
            size="small"
            style={{ width: "45%", marginTop: 10 }}
            placeholder="Thêm ngôn ngữ"
            options={language_muti}
            onChange={(e) => {
              const language = (description[e] = "");
              setDescription({ ...description, language });
              delete description[language];
              setDescription({ ...description });
            }}
          />
        </div>

        <InputCustom
          title="Vị trí"
          onChange={(e) => setState({ ...state, position: e.target.value })}
          type="number"
          placholder="Nhập vị trí"
        />

        <InputCustom
          title="Loại"
          onChange={(e) => setState({ ...state, type: e.target.value })}
          type="number"
          placholder="Nhập kiểu hiện thị mã KM"
        />

        <UploadImage
          title="Hình ảnh"
          image={state.thumbnail}
          setImage={(e) => setState({ ...state, thumbnail: e })}
          classImg="img-group-promotion"
          classUpload="upload-img-group-promotion"
        />

        <Button
          type="primary"
          style={{ width: "auto", marginTop: 20, float: "right" }}
          onClick={onCreate}
        >
          Tạo
        </Button>
      </Drawer>

      {state.isLoading && <LoadingPagination />}
    </>
  );
};

export default AddGroupPromotion;
const language_muti = [
  { value: "en", label: "Tiếng Anh" },
  { value: "jp", label: "Tiếng Nhật" },
];
