import { Checkbox, Input, Modal, Select } from "antd";
import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  createAccountAdmin,
  getListRoleAdmin,
} from "../../../../../api/createAccount";
import CustomTextInput from "../../../../../components/CustomTextInput/customTextInput";
import { errorNotify } from "../../../../../helper/toast";
import { loadingAction } from "../../../../../redux/actions/loading";
import "./index.scss";

const CreateAccount = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [idRole, setIdRole] = useState("");
  const [dataRole, setDataRole] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [role, setRole] = useState(DATA);
  const roleAdmin = [];

  const dispatch = useDispatch();

  useEffect(() => {
    getListRoleAdmin()
      .then((res) => {
        setDataRole(res?.data);
      })
      .catch((err) => {});
  }, []);

  dataRole.map((item) => {
    roleAdmin.push({
      label: item?.name_role,
      value: item?._id,
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

  const onCreateAccount = useCallback(() => {
    dispatch(loadingAction.loadingRequest(true));
    createAccountAdmin({
      full_name: fullName,
      email: email,
      role: "admin",
      password: password,
      id_role_admin: idRole,
    })
      .then((res) => window.location.reload())
      .catch((err) => {
        errorNotify({
          message: err,
        });
        dispatch(loadingAction.loadingRequest(false));
      });
  }, [fullName, email, password, idRole]);

  return (
    <div>
      <a className="title-create">Tạo tài khoản</a>
      <div className="div-body">
        <CustomTextInput
          label={"Tên hiện thị"}
          type="text"
          placeholder="Vui lòng nhập tên hiện thị"
          onChange={(e) => setFullName(e.target.value)}
        />
        <CustomTextInput
          label={"Email đăng nhập"}
          type="text"
          placeholder="Vui lòng nhập email đăng nhập"
          onChange={(e) => setEmail(e.target.value)}
        />
        <div>
          <a className="text-label">Mật khẩu</a>
          <Input.Password
            placeholder="Nhập mật khẩu"
            className="input-pass"
            type="text"
            // value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="mt-3 div-form-role">
          <a className="text-label">Quyền</a>
          <Select
            className="input-role "
            onChange={(e) => setIdRole(e)}
            options={roleAdmin}
          />
        </div>

        <button className="btn-create-account" onClick={onCreateAccount}>
          Tạo tài khoản
        </button>
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
          okText="Lưu lại"
          cancelText="Huỷ"
        >
          <>
            <div className="div-title-role">
              {role?.map((item, index) => {
                return (
                  <div key={index} className="div-item-role">
                    <a className="title-role">{item?.name}</a>
                    {item?.dropPermission?.map((per, i) => {
                      return (
                        <div className="div-item-per">
                          <a className="text-name-per">{per?.name}</a>
                          <Checkbox
                            disabled={
                              per?.value !== "get" && per?.active === false
                                ? true
                                : false
                            }
                            onChange={(e) => {}}
                          />
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </>
        </Modal>
      </div>
    </div>
  );
};

export default CreateAccount;

const DATA = [
  {
    id: 1,
    name: "Admin cấp cao",
    dropPermission: [
      {
        value: "get",
        name: "Xem",
        active: false,
        activeLocal: ["add", "edit", "delete"],
        dependency: false,
      },
      {
        value: "add",
        name: "Thêm",
        active: false,
        dependency: false,
      },
      {
        value: "edit",
        name: "Sửa",
        active: false,
        dependency: false,
      },
      {
        value: "delete",
        name: "Xóa",
        active: false,
        dependency: false,
      },
    ],
  },
  {
    id: 2,
    name: "Dưới tay anh Tam",
    dropPermission: [
      {
        value: "get",
        name: "Xem",
        active: false,
        activeLocal: ["add", "edit", "delete"],
        dependency: false,
      },
      {
        value: "delete",
        name: "Xóa",
        active: false,
        dependency: false,
      },
    ],
  },
];
