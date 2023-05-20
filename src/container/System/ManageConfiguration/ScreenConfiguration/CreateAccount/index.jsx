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

  console.log(roleAdmin);

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
    </div>
  );
};

export default CreateAccount;
