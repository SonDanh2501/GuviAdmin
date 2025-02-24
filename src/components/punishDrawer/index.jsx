import { useDispatch, useSelector } from "react-redux";
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
import _, { filter } from "lodash";
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
import ButtonCustom from "../button";
import "./index.scss";
import InputTextCustom from "../inputCustom";
import { formatArray } from "../../utils/contant";

import punishTicketImage from "../../assets/images/punish_ticket.svg";
import { loadingAction } from "../../redux/actions/loading";
const PunishDrawer = (props) => {
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
  const dispatch = useDispatch();
  const checkElement = useSelector(getElementState);
  const lang = useSelector(getLanguageState);
  const { width } = useWindowDimensions();
  const reasonOption = [];
  const titleInput =
    subject === "collaborator"
      ? "Cộng tác viên"
      : subject === "customer"
      ? "Khách hàng"
      : "Nhân viên";
  /* ~~~ Value ~~~ */
  const [name, setName] = useState("");
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState();
  const [data, setData] = useState([]);
  const [value, setValue] = useState();
  const [dataPunishPolicy, setDataPunishPolicy] = useState([]);
  const [defaultPolicy, setDefaultPolicy] = useState(null);
  const [disableDate, setDisableDate] = useState(true);
  const [idViewOrder, setIdViewOrder] = useState("");
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

  const [isLoading, setIsLoading] = useState(false);
  const [valueCollaborator, setValueCollaborator] = useState(""); // Giá trị id của đối tác khi chọn
  const [valueCollaboratorSearch, setValueCollaboratorSearch] = useState(""); // Giá trị tìm kiếm của đối tác
  const [valueListCollaborator, setValueListCollaborator] = useState([]); // Giá trị danh sách các đối tác theo tìm kiếm

  const [valueOrder, setValueOrder] = useState(""); // Giá trị id của đơn hàng liên quan
  const [valueOrderSearch, setValueOrderSearch] = useState(""); // Giá trị tìm kiếm của ca làm
  const [valueListOrder, setValueListOrder] = useState([]); // Giá trị danh sách các ca làm liên quan

  const [valueReasonPunish, setValueReasonPunish] = useState(""); // Giá trị lý do phạt
  const [valueReasonPunishList, setValueReasonPunishList] = useState([]); // Giá trị danh sách lý do phạt

  const [valuePunishDescribe, setValuePunishDescribe] = useState(""); // Giá trị nội dung phạt
  /* ~~~ Handle function ~~~ */
  // 1. Hàm mở drawer
  const showDrawer = () => {
    setOpen(true);
  };
  // 2. Hàm đóng drawer
  const onClose = () => {
    setOpen(false);
  };
  // 3. Hàm tìm kiếm đối tác
  const handleSearchCollaborator = useCallback(
    _.debounce(async (nameCollaborator) => {
      if (nameCollaborator.length > 0) {
        const dataCollaboratorFetch = await fetchCollaborators(
          lang,
          0,
          20,
          "",
          nameCollaborator,
          ""
        );
        setValueListCollaborator(dataCollaboratorFetch?.data || []);
      } else {
        setValueListCollaborator([]);
      }
    }, 500),
    []
  );
  const searchCollaborator = useCallback(
    _debounce((value) => {
      setValueCollaborator(value);
      if (value) {
        fetchCollaborators(lang, 0, 20, "", value, "")
          .then((res) => {
            setValueListCollaborator(res.data);
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
  // 4. Hàm tìm kiếm khách hàng
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
  // 5. Hàm tìm kiếm ca làm liên quan
  const handleSearchOrder = useCallback(
    _.debounce(async (value) => {
      if (value) {
        const res = await searchOrderApi(0, 20, value.toString());
        if (value === "") {
          setValueListOrder([]);
        } else {
          setValueListOrder(res?.data || res);
        }
      }
    }, 500),
    []
  );
  // 6. Hàm fetch các lý do phạt
  const fetchPunishPolicyList = async () => {
    try {
      const res = await getListPunishTicketPolicyApi();
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
      setDataPunishPolicy(arr); // Biến cũ
      setValueReasonPunishList(arr);
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
    } catch (err) {
      console.log("err", err);
    }
  };
  /* ~~~ Use effect ~~~ */
  useEffect(() => {
    fetchPunishPolicyList();
  }, []);
  /* ~~~ Main ~~~ */
  return (
    <div>
      <ButtonCustom onClick={showDrawer} label={titleButton} />
      <Drawer
        title={titleHeader}
        placement="right"
        width={400}
        closable={false}
        onClose={onClose}
        open={open}
        footer={
          <div className="punish-drawer__footer">
            <ButtonCustom
              label="Tạo lệnh phạt"
              onClick={() => {
                onClose();
                onClick({
                  id_order: valueOrder,
                  id_collaborator: valueCollaborator,
                  id_punish_policy: valueReasonPunish,
                  note_admin: valuePunishDescribe,
                  date_start_lock_time: "",
                });
              }}
              fullScreen={true}
            />
            <ButtonCustom
              label="Hủy"
              onClick={onClose}
              style="normal"
              fullScreen={true}
            />
          </div>
        }
      >
        <div className="punish-drawer__body">
          <div className="punish-drawer__body--image">
            <img
              className="punish-drawer__body--image-container"
              src={punishTicketImage}
            ></img>
          </div>
          <div className="punish-drawer__body--child">
            <InputTextCustom
              type="select"
              value={valueCollaborator}
              options={
                valueListCollaborator
                  ? formatArray(valueListCollaborator, "_id", [
                      "full_name",
                      "phone",
                    ])
                  : []
              }
              placeHolder="Đối tác"
              searchField={true}
              setSearchValue={setValueCollaboratorSearch}
              onChange={handleSearchCollaborator}
              setValueSelectedProps={setValueCollaborator}
            />
          </div>
          <div className="punish-drawer__body--child">
            <InputTextCustom
              type="select"
              value={valueReasonPunish}
              options={
                valueReasonPunishList
                  ? formatArray(valueReasonPunishList, "_id", ["label"])
                  : []
              }
              placeHolder="Lý do phạt"
              setValueSelectedProps={setValueReasonPunish}
            />
          </div>
          <div className="punish-drawer__body--child">
            <InputTextCustom
              type="select"
              value={valueOrder}
              options={
                valueListOrder
                  ? formatArray(
                      valueListOrder,
                      "_id",
                      [
                        "id_view",
                        "index_search_customer",
                        "index_search_customer",
                      ],
                      [undefined, 1, 0]
                    )
                  : []
              }
              placeHolder="Ca làm liên quan"
              searchField={true}
              onChange={handleSearchOrder}
              setValueSelectedProps={setValueOrder}
            />
          </div>
          <div className="punish-drawer__body--child">
            <InputTextCustom
              type="textArea"
              value={valuePunishDescribe}
              placeHolder="Nội dung phạt"
              onChange={(e) => setValuePunishDescribe(e.target.value)}
            />
          </div>
        </div>
      </Drawer>
    </div>
  );
};
export default React.memo(PunishDrawer);