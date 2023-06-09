import { Button, Drawer, Input, Select } from "antd";
import { useCallback, useEffect, useState } from "react";
import "./styles.scss";
import { useDispatch } from "react-redux";
import {
  createAccountAdmin,
  getListAccount,
  getListRoleAdmin,
} from "../../../../../../api/createAccount";
import { loadingAction } from "../../../../../../redux/actions/loading";
import { errorNotify } from "../../../../../../helper/toast";

const AddAccount = ({ setData, setTotal }) => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [idRole, setIdRole] = useState("");
  const [dataRole, setDataRole] = useState([]);
  const roleAdmin = [];
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };

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
      .then((res) => {
        setOpen(false);
        dispatch(loadingAction.loadingRequest(false));
        getListAccount(0, 20)
          .then((res) => {
            setData(res?.data);
            setTotal(res?.totalItem);
          })
          .catch((err) => {});
      })
      .catch((err) => {
        errorNotify({
          message: err,
        });
        dispatch(loadingAction.loadingRequest(false));
      });
  }, [fullName, email, password, idRole]);

  return (
    <div>
      <Button type="primary" onClick={showDrawer}>
        Thêm tài khoản
      </Button>
      <Drawer
        title="Tạo tài khoản quản trị"
        placement="right"
        onClose={onClose}
        open={open}
      >
        <div>
          <a className="text-label">Tên hiện thị</a>
          <Input
            type="text"
            placeholder="Vui lòng nhập tên hiện thị"
            onChange={(e) => setFullName(e.target.value)}
          />
        </div>
        <div>
          <a className="text-label">Email đăng nhập</a>
          <Input
            type="text"
            placeholder="Vui lòng nhập email đăng nhập"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <a className="text-label">Mật khẩu</a>
          <Input.Password
            placeholder="Nhập mật khẩu"
            type="text"
            // value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="mt-3 div-form-role">
          <a className="text-label">Quyền</a>
          <Select
            onChange={(e) => setIdRole(e)}
            options={roleAdmin}
            style={{ width: "100%" }}
          />
        </div>

        <button className="btn-create-account" onClick={onCreateAccount}>
          Tạo tài khoản
        </button>
      </Drawer>
    </div>
  );
};

export default AddAccount;
