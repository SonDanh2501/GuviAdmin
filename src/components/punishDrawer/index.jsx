import { useSelector } from "react-redux";
import { getElementState, getLanguageState } from "../../redux/selectors/auth";
import {
  Button,
  Drawer,
  List,
  Checkbox,
  Form,
  Input,
  Select,
  DatePicker,
} from "antd";
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
import { getListPunishTicketPolicyApi } from "../../api/policy";
import RangeDatePicker from "../datePicker/RangeDatePicker";
import dayjs from "dayjs";
import { range } from "lodash";
import { searchOrderApi } from "../../api/order";
const PunishDrawer = (props) => {
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
  const [dataPunishPolicy, setDataPunishPolicy] = useState([]);
  const [defaultPolicy, setDefaultPolicy] = useState(null);
  const [disableDate, setDisableDate] = useState(true);
  const [idViewOrder, setIdViewOrder] = useState("");
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
    id: "",
    id_order: "",
    id_collaborator: "",
    id_punish_policy: "",
    start_date: "",
  });
  const [startDate, setStartDate] = useState("");
  const [dataSearchOrder, setDataSearchOrder] = useState([]);
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

  const searchOrder = useCallback(
    _debounce((value) => {
      if (value) {
        const _query = `search=${value.toString()}`;
        searchOrderApi(0, 20, _query)
          .then((res) => {
            if (value === "") {
              setDataSearchOrder([]);
            } else {
              setDataSearchOrder(res);
            }
          })
          .catch((err) => {});
      }
      setState({ ...state, id_order: "" });
    }, 500),
    [state]
  );

  const getPunishPolicy = () => {
    getListPunishTicketPolicyApi()
      .then((res) => {
        const arr = [];
        for (let i of res?.data) {
          const temp = {
            _id: i?._id,
            value: i?.title.vi,
            punish_moneyh: i?.punish_money,
            id_view: i?.id_view,
            label: `${i?.id_view} - ${i?.title.vi}`,
            action_lock: i?.action_lock,
          };
          arr.push(temp);
        }
        setDataPunishPolicy(arr);
        if (arr.length) {
          setState({
            ...state,
            money: arr[0]?.punish_money,
            id_punish_policy: arr[0]?._id,
          });
          setDefaultPolicy(arr[0]);
          if (arr[0].action_lock !== "unset") {
            setDisableDate(false);
          }
        }
      })
      .catch((err) => {
        console.log("err ", err);
      });
  };

  // ----------------------------- UseEffect ----------------------------------- //
  useEffect(() => {
    getPunishPolicy();
  }, []);

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
            {state?.data.length > 0 && (
              <List type={"unstyled"} className="list-item">
                {state?.data?.map((item, index) => {
                  return (
                    <div
                      key={index}
                      onClick={(e) => {
                        setState({
                          ...state,
                          id_collaborator: item?._id,
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
            <p>Lý do phạt</p>
            <Select
              defaultValue={defaultPolicy}
              style={{ width: "100%" }}
              onChange={(e, option) => {
                setState({
                  ...state,
                  money: option?.punish_money,
                  id_punish_policy: option?._id,
                });
                if (option?.action_lock !== "unset") {
                  setDisableDate(false);
                } else {
                  setDisableDate(true);
                }
              }}
              options={dataPunishPolicy}
            />
          </div>
          {!disableDate && (
            <div className="div-money">
              <p>Chọn thời gian bắt đầu phạt</p>
              <DatePicker
                disabled={disableDate}
                format="YYYY-MM-DD HH:mm:ss"
                showTime={{
                  defaultValue: dayjs("00:00:00", "HH:mm:ss"),
                }}
                onChange={(date, dateString) => {
                  setState({
                    ...state,
                    start_date: new Date(date).toISOString(),
                  });
                }}
              />
            </div>
          )}
          <div className="div-money">
            <div>
              <InputCustom
                title={"Ca làm liên quan"}
                placeholder={`${i18n.t("search", { lng: lang })}`}
                value={idViewOrder}
                onChange={(e) => {
                  searchOrder(e.target.value);
                  setIdViewOrder(e.target.value);
                }}
                error={state?.errorName}
              />
              {dataSearchOrder.length > 0 && (
                <List type={"unstyled"} className="list-item">
                  {dataSearchOrder.map((item, index) => {
                    return (
                      <div
                        key={index}
                        onClick={(e) => {
                          setState({
                            ...state,
                            id_order: item?._id,
                          });
                          setDataSearchOrder([]);
                          setIdViewOrder(item?.id_view);
                        }}
                      >
                        <a>{item?.id_view}</a>
                      </div>
                    );
                  })}
                </List>
              )}
            </div>
          </div>
          <div className="mt-2">
            <InputCustom
              title={`Nội dung`}
              value={state?.note}
              onChange={(e) => setState({ ...state, note: e.target.value })}
              textArea={true}
            />
          </div>
          <Button
            className="btn-confirm-drawer"
            type="primary"
            onClick={() => {
              onClose();
              setState({
                money: defaultPolicy?.punish_money,
                note: defaultPolicy?.value,
                data: [],
                name: "",
                errorName: "",
                errorMoney: "",
                id_collaborator: "",
                id_punish_policy: defaultPolicy?._id,
                id_order: "",
                start_date: "",
              });
              setName("");
              setDataSearchOrder([]);
              onClick(state);
              setIdViewOrder("");
            }}
          >
            {titleButton}
          </Button>
          {/* <CustomButton
            title={titleButton}
            className="float-left btn-add-t"
            type="button"
            onClick={() => {
              onClose(); 

              setState({
                money: defaultPolicy?.punish_money,
                note: defaultPolicy?.value,
                data: [],
                name: "",
                errorName: "",
                errorMoney: "",
                id_collaborator: "",
                id_punish_policy: defaultPolicy?._id,
                id_order: "",
                start_date: "",
              });
              setName("");
              setDataSearchOrder([]);
              onClick(state);
              setIdViewOrder("");
            }}
          /> */}
        </div>
      </Drawer>
    </div>
  );
};
export default React.memo(PunishDrawer);
