import { useState } from "react";
import "./styles.scss";
import { Button, Drawer } from "antd";
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
    en: "",
  });
  const [description, setDescription] = useState({
    vi: "",
    en: "",
  });

  const onCreate = () => {
    setState({ ...state, isLoading: true });
    createGroupPromotion({
      name: {
        vi: title.vi,
        en: title.en,
      },
      description: {
        vi: description.vi,
        en: description.en,
      },
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
          message: err,
        });
      });
  };

  return (
    <>
      <div
        className="btn-add-group-promo"
        onClick={() => setState({ ...state, open: true })}
      >
        <a className="text-btn">
          {" "}
          <i class="uil uil-plus-circle"></i> Tạo mới
        </a>
      </div>
      <Drawer
        title="Thêm nhóm khuyến mãi"
        placement="right"
        onClose={() => setState({ ...state, open: false })}
        open={state.open}
        headerStyle={{ height: 40, padding: 0 }}
      >
        <div className="form-input">
          <a className="label-input">Tiêu đề</a>
          <InputCustom
            title="Tiếng Việt"
            onChange={(e) => setTitle({ ...title, vi: e.target.value })}
          />
          <InputCustom
            title="Tiếng Anh"
            onChange={(e) => setTitle({ ...title, en: e.target.value })}
          />
        </div>
        <div className="form-input">
          <a className="label-input">Mô tả</a>
          <InputCustom
            title="Tiếng Việt"
            onChange={(e) =>
              setDescription({ ...description, vi: e.target.value })
            }
          />
          <InputCustom
            title="Tiếng Anh"
            onChange={(e) =>
              setDescription({ ...description, en: e.target.value })
            }
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
