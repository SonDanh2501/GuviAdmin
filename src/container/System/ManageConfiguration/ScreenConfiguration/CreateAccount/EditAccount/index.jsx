import { Button, Drawer, Input, Select } from "antd";
import { useCallback, useEffect, useState } from "react";
import "./styles.scss";
import { useDispatch, useSelector } from "react-redux";
import {
  createAccountAdmin,
  editAccountAdmin,
  getDetailsAccount,
  getListAccount,
  getListRoleAdmin,
} from "../../../../../../api/createAccount";
import { loadingAction } from "../../../../../../redux/actions/loading";
import { errorNotify } from "../../../../../../helper/toast";
import { getLanguageState } from "../../../../../../redux/selectors/auth";
import i18n from "../../../../../../i18n";
import InputCustom from "../../../../../../components/textInputCustom";

const EditAccount = ({ id, setData, setTotal }) => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [idRole, setIdRole] = useState("");
  const [dataRole, setDataRole] = useState([]);
  const roleAdmin = [];
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const lang = useSelector(getLanguageState);
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
      <a onClick={showDrawer}>{`${i18n.t("edit", { lng: lang })}`}</a>
      <Drawer
        title={`${i18n.t("edit", { lng: lang })}`}
        placement="right"
        onClose={onClose}
        open={open}
      >
        <InputCustom
          title={`${i18n.t("display_name", { lng: lang })}`}
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />

        <InputCustom
          title={`${i18n.t("email_login", { lng: lang })}`}
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />

        <div className=" div-form-role">
          <InputCustom
            title={`${i18n.t("permissions", { lng: lang })}`}
            onChange={(e) => setIdRole(e)}
            options={roleAdmin}
            style={{ width: "100%" }}
            select={true}
            value={idRole}
          />
        </div>

        <button className="btn-create-account" onClick={onEditAccount}>
          {`${i18n.t("edit", { lng: lang })}`}
        </button>
      </Drawer>
    </div>
  );
};

export default EditAccount;
