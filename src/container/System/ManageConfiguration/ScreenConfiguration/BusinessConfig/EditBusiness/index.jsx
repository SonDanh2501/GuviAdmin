import { Button, Drawer } from "antd";
import { useEffect, useState } from "react";
import InputCustom from "../../../../../../components/textInputCustom";
import UploadImage from "../../../../../../components/uploadImage";
import "./styles.scss";
import {
  createBusiness,
  editBusiness,
  getDetailBusiness,
  getListBusiness,
} from "../../../../../../api/configuration";
import { errorNotify } from "../../../../../../helper/toast";

const EditBusiness = (props) => {
  const { setData, data, id } = props;
  const [state, setState] = useState({
    open: false,
    name: "",
    tax: "",
    avatar: "",
    id,
  });

  useEffect(() => {
    getDetailBusiness(id)
      .then((res) => {
        setState({
          ...state,
          name: res?.full_name,
          avatar: res?.avatar,
          tax: res?.tax_code,
        });
      })
      .catch((err) => {});
  }, []);

  const onEdit = () => {
    setData({ ...state, isLoading: true });
    editBusiness(id, {
      type_permisstion: "",
      full_name: state.name,
      avatar: state.avatar,
      tax_code: state.tax,
    })
      .then((res) => {
        getListBusiness(0, 20, "")
          .then((res) => {
            setData({ ...data, data: res?.data, isLoading: false });
            setState({ ...state, open: false });
          })
          .catch((err) => {});
      })
      .catch((err) => {
        errorNotify({
          message: err,
        });
      });
  };

  return (
    <>
      <a onClick={() => setState({ ...state, open: true })}>Chỉnh sửa</a>

      <Drawer
        title="Tạo mới đối tác"
        placement="right"
        onClose={() => setState({ ...state, open: false })}
        open={state.open}
      >
        <InputCustom
          title="Tên đối tác"
          value={state.name}
          onChange={(e) => setState({ ...state, name: e.target.value })}
        />
        <InputCustom
          title="Mã số thuế"
          value={state.tax}
          onChange={(e) => setState({ ...state, tax: e.target.value })}
        />
        <UploadImage
          title="Ảnh"
          classImg="image-avatar-business"
          image={state.avatar}
          setImage={(e) => setState({ ...state, avatar: e })}
        />

        <Button
          onClick={onEdit}
          type="primary"
          style={{ marginTop: 20, float: "right" }}
        >
          Sửa
        </Button>
      </Drawer>
    </>
  );
};

export default EditBusiness;
