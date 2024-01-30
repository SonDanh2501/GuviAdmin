import { Button, Drawer, Select } from "antd";
import { useEffect, useState } from "react";
import {
  editGroupPromotion,
  getGroupPromotion,
} from "../../../../../../api/configuration";
import LoadingPagination from "../../../../../../components/paginationLoading";
import InputCustom from "../../../../../../components/textInputCustom";
import UploadImage from "../../../../../../components/uploadImage";
import { errorNotify } from "../../../../../../helper/toast";
import "./styles.scss";

const EditGroupPromotion = (props) => {
  const { setData, data, item } = props;
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

  useEffect(() => {
    setState({
      ...state,
      thumbnail: item?.thumbnail,
      position: item?.position,
      type: item?.type_render_view,
    });
    delete item?.name["_id"];
    setTitle(item?.name);
    delete item?.description["_id"];
    setDescription(item?.description);
  }, [item]);

  const onCreate = () => {
    setState({ ...state, isLoading: true });
    editGroupPromotion(item?._id, {
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
      <p
        className="text-btn"
        onClick={() => setState({ ...state, open: true })}
      >
        Chỉnh sửa
      </p>

      <Drawer
        title="Chỉnh sửa nhóm khuyến mãi"
        placement="right"
        onClose={() => setState({ ...state, open: false })}
        open={state.open}
        headerStyle={{ height: 40, padding: 0 }}
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
                  value={value}
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
                  value={value}
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
          classImg="img-thumbnail-group-promo"
          setImage={(e) => setState({ ...state, thumbnail: e })}
        />

        <Button
          type="primary"
          style={{ width: "auto", marginTop: 20, float: "right" }}
          onClick={onCreate}
        >
          Chỉnh sửa
        </Button>
      </Drawer>

      {state.isLoading && <LoadingPagination />}
    </>
  );
};

export default EditGroupPromotion;

const language_muti = [
  { value: "en", label: "Tiếng Anh" },
  { value: "jp", label: "Tiếng Nhật" },
];
