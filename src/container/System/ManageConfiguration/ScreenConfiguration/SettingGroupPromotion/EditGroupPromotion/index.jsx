import { useEffect, useState } from "react";
import "./styles.scss";
import { Button, Drawer } from "antd";
import InputCustom from "../../../../../../components/textInputCustom";
import UploadImage from "../../../../../../components/uploadImage";
import {
  createGroupPromotion,
  editGroupPromotion,
  getGroupPromotion,
} from "../../../../../../api/configuration";
import { errorNotify } from "../../../../../../helper/toast";
import LoadingPagination from "../../../../../../components/paginationLoading";

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
    en: "",
  });
  const [description, setDescription] = useState({
    vi: "",
    en: "",
  });

  useEffect(() => {
    setState({
      ...state,
      thumbnail: item?.thumbnail,
      position: item?.position,
      type: item?.type_render_view,
    });
    setTitle({ ...title, vi: item?.name?.vi, en: item?.name?.en });
    setDescription({
      ...description,
      vi: item?.description?.vi,
      en: item?.description?.en,
    });
  }, [item]);

  const onCreate = () => {
    setState({ ...state, isLoading: true });
    editGroupPromotion(item?._id, {
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
      <a
        className="text-btn"
        onClick={() => setState({ ...state, open: true })}
      >
        Chỉnh sửa
      </a>

      <Drawer
        title="Chỉnh sửa nhóm khuyến mãi"
        placement="right"
        onClose={() => setState({ ...state, open: false })}
        open={state.open}
        headerStyle={{ height: 40, padding: 0 }}
      >
        <div className="form-input">
          <a className="label-input">Tiêu đề</a>
          <InputCustom
            title="Tiếng Việt"
            value={title.vi}
            onChange={(e) => setTitle({ ...title, vi: e.target.value })}
          />
          <InputCustom
            title="Tiếng Anh"
            value={title.en}
            onChange={(e) => setTitle({ ...title, en: e.target.value })}
          />
        </div>
        <div className="form-input">
          <a className="label-input">Mô tả</a>
          <InputCustom
            title="Tiếng Việt"
            value={description.vi}
            onChange={(e) =>
              setDescription({ ...description, vi: e.target.value })
            }
          />
          <InputCustom
            title="Tiếng Anh"
            value={description.en}
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
