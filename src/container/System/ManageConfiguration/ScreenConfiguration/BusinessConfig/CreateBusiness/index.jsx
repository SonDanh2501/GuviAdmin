import { Button, Drawer } from "antd";
import { useState } from "react";
import InputCustom from "../../../../../../components/textInputCustom";
import UploadImage from "../../../../../../components/uploadImage";
import "./styles.scss";
import {
  createBusiness,
  getListBusiness,
} from "../../../../../../api/configuration";
import { errorNotify } from "../../../../../../helper/toast";

const CreateBusiness = (props) => {
  const { setData, data } = props;
  const [state, setState] = useState({
    open: false,
    name: "",
    tax: "",
    avatar: "",
  });

  const onCreate = () => {
    setData({ ...state, isLoading: true });
    createBusiness({
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
      <Button type="primary" onClick={() => setState({ ...state, open: true })}>
        Tạo mới
      </Button>

      <Drawer
        title="Tạo mới đối tác"
        placement="right"
        onClose={() => setState({ ...state, open: false })}
        open={state.open}
      >
        <InputCustom
          title="Tên đối tác"
          onChange={(e) => setState({ ...state, name: e.target.value })}
        />
        <InputCustom
          title="Mã số thuế"
          onChange={(e) => setState({ ...state, tax: e.target.value })}
        />
        <UploadImage
          title="Ảnh"
          classImg="image-avatar-business"
          image={state.avatar}
          setImage={(e) => setState({ ...state, avatar: e })}
        />

        <Button
          onClick={onCreate}
          type="primary"
          style={{ marginTop: 20, float: "right" }}
        >
          Tạo
        </Button>
      </Drawer>
    </>
  );
};

export default CreateBusiness;
