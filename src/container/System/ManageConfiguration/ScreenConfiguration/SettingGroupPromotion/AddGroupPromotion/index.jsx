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

        <UploadImage
          title="Hình ảnh"
          setImage={(e) => setState({ ...state, thumbnail: e })}
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
