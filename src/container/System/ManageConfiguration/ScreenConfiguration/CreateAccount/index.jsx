import { Input, Modal, Select } from "antd";
import { useEffect, useState } from "react";
import { getListRoleAdmin } from "../../../../../api/createAccount";
import CustomTextInput from "../../../../../components/CustomTextInput/customTextInput";
import "./index.scss";

const CreateAccount = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [idRole, setIdRole] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    getListRoleAdmin()
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  });

  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  return (
    <div>
      <a className="title-create">Tạo tài khoản</a>
      <div className="div-body">
        <CustomTextInput
          label={"Tên hiện thị"}
          type="text"
          placeholder="Vui lòng nhập tên hiện thị"
        />
        <CustomTextInput
          label={"Email đăng nhập"}
          type="text"
          placeholder="Vui lòng nhập email đăng nhập"
        />
        <div>
          <a className="text-label">Mật khẩu</a>
          <Input.Password
            placeholder="Nhập mật khẩu"
            className="input-pass"
            type="text"
            // value={password}
            // onChange={(text) => setPassword(text.target.value)}
          />
        </div>
        <div className="mt-3 div-form-role">
          <a className="text-label">Quyền</a>
          <Select
            defaultValue="lucy"
            className="input-role "
            // onChange={handleChange}
            options={[
              { value: "jack", label: "Jack" },
              { value: "lucy", label: "Lucy" },
              { value: "Yiminghe", label: "yiminghe" },
            ]}
          />
        </div>
      </div>

      <div className="div-add-role">
        <a>
          Phân quyền (Lưu ý: mọi chỉnh sửa trên đây chỉ là lưu tạm thời, giá trị
          thay đổi chỉ lưu lại khi bạn bấm nút "Lưu lại")
        </a>
        <button className="btn-add-role" onClick={showModal}>
          Phân quyền
        </button>
      </div>
      <div>
        <Modal
          width={1000}
          title="Phân quyền"
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
          okText="Áp dụng"
          cancelText="Huỷ"
        >
          <div></div>
        </Modal>
      </div>
    </div>
  );
};

export default CreateAccount;
