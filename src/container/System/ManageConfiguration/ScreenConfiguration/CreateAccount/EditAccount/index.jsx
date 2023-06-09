import { Button, Drawer, Input, Select } from "antd";
import { useCallback, useEffect, useState } from "react";
import "./styles.scss";
import { useDispatch } from "react-redux";
import {
  createAccountAdmin,
  editAccountAdmin,
  getDetailsAccount,
  getListAccount,
  getListRoleAdmin,
} from "../../../../../../api/createAccount";
import { loadingAction } from "../../../../../../redux/actions/loading";
import { errorNotify } from "../../../../../../helper/toast";

const EditAccount = ({ id, setData, setTotal }) => {
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

  useEffect(() => {
    getDetailsAccount(id)
      .then((res) => {
        setFullName(res?.full_name);
        setEmail(res?.email);
        setIdRole(res?.id_role_admin?._id);
      })
      .catch((err) => {});
  }, [id]);

  dataRole.map((item) => {
    roleAdmin.push({
      label: item?.name_role,
      value: item?._id,
    });
  });

  const onEditAccount = useCallback(() => {
    dispatch(loadingAction.loadingRequest(true));
    editAccountAdmin(id, {
      full_name: fullName,
      id_role_admin: idRole,
      is_permission: true,
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
      <a onClick={showDrawer}>Chỉnh sửa</a>
      <Drawer
        title="Chỉnh sửa tài khoản quản trị"
        placement="right"
        onClose={onClose}
        open={open}
      >
        <div>
          <a className="text-label">Tên hiện thị</a>
          <Input
            type="text"
            placeholder="Vui lòng nhập tên hiện thị"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </div>
        <div className="mt-2">
          <a className="text-label">Email đăng nhập</a>
          <Input
            type="text"
            placeholder="Vui lòng nhập email đăng nhập"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        {/* <div>
          <a className="text-label">Mật khẩu</a>
          <Input.Password
            placeholder="Nhập mật khẩu"
            type="text"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div> */}
        <div className="mt-2 div-form-role">
          <a className="text-label">Quyền</a>
          <Select
            onChange={(e) => setIdRole(e)}
            options={roleAdmin}
            style={{ width: "100%" }}
            value={idRole}
          />
        </div>

        <button className="btn-create-account" onClick={onEditAccount}>
          Chỉnh sửa
        </button>
      </Drawer>
    </div>
  );
};

export default EditAccount;
