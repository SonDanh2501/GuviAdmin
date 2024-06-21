import { useSelector } from "react-redux";
import { getElementState, getLanguageState } from "../../redux/selectors/auth";
import React, { useCallback, useEffect, useState } from "react";
import _debounce from "lodash/debounce";
import useWindowDimensions from "../../helper/useWindowDimensions";
import { fetchCollaborators } from "../../api/collaborator";
import { fetchCustomers } from "../../api/customer";
import { getListAccount } from "../../api/createAccount";
import InputCustom from "../textInputCustom";
import i18n from "../../i18n";
import { Button, Drawer, List, Select } from "antd";
const initValue = {
  money: 0,
  note: "",
  data: [],
  name: "",
  errorName: "",
  errorMoney: "",
  payment_in: "bank",
  payment_out: "bank",
  id: "",
  subject: "collaborator",
  type_wallet: "work_wallet",
};
const TransactionDrawer2 = (props) => {
  const checkElement = useSelector(getElementState);
  const lang = useSelector(getLanguageState);
  const { width } = useWindowDimensions();
  const reasonOption = [];
  // ---------------------------- usestate ------------------------------------ //
  const [name, setName] = useState("");
  const [open, setOpen] = useState(false);
  const [subject, setSubject] = useState(initValue.subject);
  const { type, titleHeader, titleButton, onClick, defaultWallet } = props;
  const [state, setState] = useState(initValue);
  // ---------------------------- xử lý data ------------------------------------//
  const titleInput =
    subject === "collaborator"
      ? "Cộng tác viên"
      : subject === "customer"
      ? "Khách hàng"
      : "Khác";
  // --------------------------- action ------------------------------------- //

  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
    setState(initValue);
    setSubject("collaborator");
    setName("");
  };
  const searchCollaborator = useCallback(
    _debounce((value) => {
      setName(value);
      if (value) {
        fetchCollaborators(lang, 0, 20, "", value, "")
          .then((res) => {
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
  const handleChangeReason = (id, value) => {
    setState({ ...state, note: value?.note, id: id });
  };
  // ----------------------------- UI ----------------------------------- //
  return (
    <div className="transaction-drawer_container">
      <Button type="primary" onClick={showDrawer}>
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
            <p>Đối tượng</p>
            <Select
              defaultValue={"collaborator"}
              style={{ width: "100%" }}
              onChange={(e) => {
                setSubject(e);
                if (e === "customer") {
                  setState({
                    ...state,
                    subject: e,
                    payment_in: "bank",
                    payment_out: "bank",
                    type_wallet: "pay_point",
                  });
                } else if (e === "other") {
                  setState({
                    ...state,
                    subject: e,
                    payment_in: "bank",
                    payment_out: "bank",
                    type_wallet: "other",
                  });
                } else if (e === "collaborator") {
                  setState({
                    ...state,
                    subject: e,
                    payment_in: "bank",
                    payment_out: "bank",
                    type_wallet: "work_wallet",
                  });
                }
              }}
              options={subjects}
              value={subject}
            />
            {subject !== "other" && (
              <InputCustom
                title={titleInput}
                placeholder={`${i18n.t("search", { lng: lang })}`}
                value={name}
                onChange={(e) => {
                  subject === "customer" && searchCustomer(e.target.value);
                  subject === "collaborator" &&
                    searchCollaborator(e.target.value);
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
          <div className="mt-2">
            <p>Phương thức thanh toán: </p>
            <Select
              defaultValue={"bank"}
              style={{ width: "100%" }}
              onChange={(e) => {
                setState({ ...state, payment_out: e });
              }}
              options={payments}
              value={state?.payment_out}
            />
          </div>
          {/* <div className="mt-2">
            <p>Nguồn tiền vào: </p>
            <Select
              defaultValue={"bank"}
              style={{ width: "100%" }}
              onChange={(e) => {
                setState({ ...state, payment_in: e });
              }}
              options={payments}
              value={state?.payment_in}
            />
          </div>
          <div className="mt-2">
            <p>Nguồn tiền ra: </p>
            <Select
              defaultValue={"bank"}
              style={{ width: "100%" }}
              onChange={(e) => {
                setState({ ...state, payment_out: e });
              }}
              options={payments}
              value={state?.payment_out}
            />
          </div> */}
          {subject === "collaborator" && (
            <div className="mt-2">
              {/* <p>Ví: </p> */}
              {titleButton === "Nạp tiền"
                ? "Nạp vào tài khoản"
                : "Rút từ tài khoản"}
              <Select
                defaultValue={defaultWallet ? defaultWallet : "work_wallet"}
                style={{ width: "100%" }}
                onChange={(e) => {
                  setState({ ...state, type_wallet: e });
                }}
                options={arrWallet}
                value={state?.type_wallet}
              />
            </div>
          )}
          <Button
            type="primary"
            className="btn-confirm-drawer"
            onClick={() => {
              onClick(state);
              onClose();
            }}
          >
            {titleButton}
          </Button>
        </div>
      </Drawer>
    </div>
  );
};
export default React.memo(TransactionDrawer2);

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

const subjects = [
  {
    value: "collaborator",
    label: `Cộng tác viên`,
  },
  {
    value: "customer",
    label: `Khách hàng`,
  },
  {
    value: "other",
    label: `Khác`,
  },
];

const payments = [
  {
    value: "bank",
    label: `Chuyển khoản`,
  },
  {
    value: "cash",
    label: `Tiền mặt`,
  },
  {
    value: "momo",
    label: `MoMo`,
  },
  {
    value: "vnpay",
    label: `VN PAY`,
  },
  {
    value: "viettel_money",
    label: `Viettel Money`,
  },
  {
    value: "other",
    label: "Khác",
  },
];
