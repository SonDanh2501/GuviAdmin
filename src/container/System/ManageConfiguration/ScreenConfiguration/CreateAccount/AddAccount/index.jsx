import { Button, Drawer, Input, Select } from "antd";
import { useCallback, useEffect, useState } from "react";
import "./styles.scss";
import { useDispatch, useSelector } from "react-redux";
import {
  createAccountAdmin,
  getListAccount,
  getListRoleAdmin,
} from "../../../../../../api/createAccount";
import { loadingAction } from "../../../../../../redux/actions/loading";
import { errorNotify } from "../../../../../../helper/toast";
import { getLanguageState } from "../../../../../../redux/selectors/auth";
import i18n from "../../../../../../i18n";
import InputCustom from "../../../../../../components/textInputCustom";

const AddAccount = ({ setData, setTotal }) => {
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
        {`${i18n.t("add_account", { lng: lang })}`}
      </Button>
      <Drawer
        title={`${i18n.t("add_account", { lng: lang })}`}
        placement="right"
        onClose={onClose}
        open={open}
        headerStyle={{ height: 50 }}
      >
        <InputCustom
          title={`${i18n.t("display_name", { lng: lang })}`}
          onChange={(e) => setFullName(e.target.value)}
        />

        <InputCustom
          title={`${i18n.t("email_login", { lng: lang })}`}
          onChange={(e) => setEmail(e.target.value)}
        />

        <InputCustom
          title={`${i18n.t("password", { lng: lang })}`}
          onChange={(e) => setPassword(e.target.value)}
          password={true}
        />

        <div className=" div-form-role">
          <InputCustom
            title={`${i18n.t("permissions", { lng: lang })}`}
            onChange={(e) => setIdRole(e)}
            options={roleAdmin}
            style={{ width: "100%" }}
            select={true}
          />
        </div>

        <button className="btn-create-account" onClick={onCreateAccount}>
          {`${i18n.t("add_account", { lng: lang })}`}
        </button>
      </Drawer>
    </div>
  );
};

export default AddAccount;
