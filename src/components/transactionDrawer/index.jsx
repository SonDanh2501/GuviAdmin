import { useSelector } from "react-redux";
import { getElementState, getLanguageState } from "../../redux/selectors/auth";
import { Button, Drawer, List, Checkbox, Form, Input, Select } from "antd";
import React, { useCallback, useEffect, useState } from "react";
import _debounce from "lodash/debounce";
import useWindowDimensions from "../../helper/useWindowDimensions";
import { fetchCollaborators } from "../../api/collaborator";
import { fetchCustomers } from "../../api/customer";
import { getListAccount } from "../../api/createAccount";
import { getReasonPunishApi } from "../../api/reasons";
import InputCustom from "../textInputCustom";
import i18n from "../../i18n";
import CustomButton from "../customButton/customButton";

const TransactionDrawer = (props) => {
  const checkElement = useSelector(getElementState);
  const lang = useSelector(getLanguageState);
  const { width } = useWindowDimensions();
  const reasonOption = [];
  // ---------------------------- usestate ------------------------------------ //
  const [name, setName] = useState("");
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState();
  const [data, setData] = useState([]);
  const [value, setValue] = useState();
  const {
    type,
    setDataT,
    setTotal,
    titleHeader,
    titleButton,
    subject,
    onClick,
    defaultWallet,
  } = props;
  const [state, setState] = useState({
    money: 0,
    note: "",
    data: [],
    name: "",
    errorName: "",
    errorMoney: "",
    wallet: "work_wallet",
    id: "",
    id_order: "",
  });
  // ---------------------------- xử lý data ------------------------------------//
  const titleInput =
    subject === "collaborator"
      ? "Cộng tác viên"
      : subject === "customer"
      ? "Khách hàng"
      : "Nhân viên";
  // --------------------------- action ------------------------------------- //

  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };
  const searchCollaborator = useCallback(
    _debounce((value) => {
      setName(value);
      if (value) {
        fetchCollaborators(lang, 0, 20, "", value, "")
          .then((res) => {
            setData(res.data);
            if (value === "") {
              setState({ ...state, data: [] });
            } else {
              setState({ ...state, data: res?.data });
            }
          })
          .catch((err) => {});
      } else if (state?.id) {
        setState({ ...state, data: [] });
      } else {
        setState({ ...state, data: [] });
      }
      setState({ ...state, id: "" });
    }, 500),
    [state]
  );
  const searchCustomer = useCallback(
    _debounce((value) => {
      setName(value);
      if (value) {
        fetchCustomers(lang, 0, 20, "", "", value, "")
          .then((res) => {
            console.log("retsss ", res);
            if (value === "") {
              setState({ ...state, data: [] });
            } else {
              setState({ ...state, data: res?.data });
            }
          })
          .catch((err) => {});
      } else if (state?.id) {
        setState({ ...state, data: [] });
      } else {
        setState({ ...state, data: [] });
      }
      setState({ ...state, id: "" });
    }, 500),
    [state]
  );
  const searchStaff = useCallback(
    _debounce((value) => {
      setName(value);
      console.log(value);
      if (value) {
        getListAccount(0, 20, value)
          .then((res) => {
            console.log("ressss ", res);
            if (value === "") {
              setState({ ...state, data: [] });
            } else {
              setState({ ...state, data: res?.data });
            }
          })
          .catch((err) => {});
      } else if (state?.id) {
        setState({ ...state, data: [] });
      } else {
        setState({ ...state, data: [] });
      }
      setState({ ...state, id: "" });
    }, 500),
    [state]
  );
  const handleChangeReason = (id, value) => {
    setState({ ...state, note: value?.note, id: id });
  };

  // ----------------------------- UseEffect ----------------------------------- //
  // ----------------------------- UI ----------------------------------- //
  return (
    <div>
      <Button onClick={showDrawer} type="primary">
        {titleButton}
      </Button>
      <Drawer
        title={titleHeader}
        width={width > 490 ? 500 : 300}
        onClose={onClose}
        open={open}
        bodyStyle={{
          paddingBottom: 80,
        }}
        headerStyle={{ height: 50 }}
      >
        <div className="modal-body">
          <div>
            {subject !== "staff" && (
              <InputCustom
                title={titleInput}
                placeholder={`${i18n.t("search", { lng: lang })}`}
                value={name}
                onChange={(e) => {
                  subject === "customer" && searchCustomer(e.target.value);
                  subject === "collaborator" &&
                    searchCollaborator(e.target.value);
                  //  searchStaff(e.target.value);
                  setName(e.target.value);
                }}
                error={state?.errorName}
              />
            )}
            {state?.data.length > 0 && (
              <List type={"unstyled"} className="list-item">
                {state?.data?.map((item, index) => {
                  return (
                    <div
                      key={index}
                      onClick={(e) => {
                        setState({
                          ...state,
                          id: item?._id,
                          data: [],
                        });
                        setName(item?.full_name);
                      }}
                    >
                      <a>
                        {item?.full_name} - {item?.phone} - {item?.id_view}
                      </a>
                    </div>
                  );
                })}
              </List>
            )}
          </div>

          <div className="div-money">
            <InputCustom
              title={"Số tiền"}
              min={0}
              value={state?.money}
              onChange={(e) => setState({ ...state, money: e })}
              style={{ width: "100%" }}
              inputMoney={true}
              error={state?.errorMoney}
            />
          </div>
          {type === "punish" && (
            <div className="div-money">
              <InputCustom
                title={`${i18n.t("reason", { lng: lang })}`}
                style={{ width: "100%" }}
                value={state.note}
                onChange={handleChangeReason}
                options={reasonOption}
                select={true}
              />
            </div>
          )}
          <div className="mt-2">
            <InputCustom
              title={`Nội dung`}
              value={state?.note}
              onChange={(e) => setState({ ...state, note: e.target.value })}
              textArea={true}
            />
          </div>
          {subject === "collaborator" && (
            <div className="mt-2">
              <Select
                defaultValue={defaultWallet ? defaultWallet : "work_wallet"}
                style={{ width: "100%" }}
                onChange={(e) => {
                  setState({ ...state, wallet: e });
                }}
                options={arrWallet}
              />
            </div>
          )}
          <CustomButton
            title={titleButton}
            className="float-left btn-add-t"
            type="button"
            onClick={() => {
              onClose();
              setState({
                money: 0,
                note: "",
                data: [],
                name: "",
                errorName: "",
                errorMoney: "",
                wallet: "work_wallet",
                id: "",
                id_order: "",
              });
              setName("");
              onClick(state);
            }}
          />
        </div>
      </Drawer>
    </div>
  );
};
export default React.memo(TransactionDrawer);

const arrWallet = [
  {
    value: "work_wallet",
    label: `Ví nạp`,
  },
  {
    value: "collaborator_wallet",
    label: `Ví CTV`,
  },
];
