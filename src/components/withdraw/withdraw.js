import { Drawer, Input, List } from "antd";
import _debounce from "lodash/debounce";
import moment from "moment";
import React, { memo, useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCollaborators } from "../../api/collaborator";
import {
  getTopupCollaboratorApi,
  withdrawMoneyCollaboratorApi,
} from "../../api/topup";
import { errorNotify, successNotify } from "../../helper/toast";
import i18n from "../../i18n";
import { loadingAction } from "../../redux/actions/loading";
import { getRevenueCollaborator } from "../../redux/actions/topup";
import { getElementState, getLanguageState } from "../../redux/selectors/auth";
import CustomButton from "../customButton/customButton";
import InputCustom from "../textInputCustom";
import "./withdraw.scss";
const { TextArea } = Input;

const Withdraw = (props) => {
  const { type, setDataT, setTotal } = props;
  const [name, setName] = useState("");
  const [state, setState] = useState({
    money: 0,
    note: "",
    data: [],
    errorName: "",
    errorMoney: "",
    wallet: "",
    id: "",
  });
  const checkElement = useSelector(getElementState);
  const dispatch = useDispatch();
  const width = window.innerWidth;
  const [open, setOpen] = useState(false);
  const lang = useSelector(getLanguageState);
  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = ({ data }) => {
    setOpen(false);
  };

  const searchCollaborator = useCallback(
    _debounce((value) => {
      setName(value);
      fetchCollaborators(lang, 0, 20, "", value, "")
        .then((res) => {
          if (value === "") {
            setState({ ...state, data: [] });
          } else {
            setState({ ...state, data: res?.data });
          }
        })
        .catch((err) => console.log(err));
      setState({ ...state, id: "" });
    }, 500),
    [state]
  );

  const onWithdraw = useCallback(() => {
    if (name === "" || state?.money === "") {
      !name
        ? setState({ ...state, errorName: "Vui lòng nhập thông tin" })
        : setState({ ...state, errorMoney: "Vui lòng nhập số tiền cần nạp" });
    } else {
      dispatch(loadingAction.loadingRequest(true));
      withdrawMoneyCollaboratorApi(state?.id, {
        money: state?.money,
        transfer_note: state?.note,
        type_wallet: state?.wallet,
      })
        .then((res) => {
          getTopupCollaboratorApi(0, 20, type)
            .then((res) => {
              setDataT(res?.data);
              setTotal(res?.totalItem);
            })
            .catch((err) => {});
          dispatch(
            getRevenueCollaborator.getRevenueCollaboratorRequest({
              startDate: moment().startOf("year").toISOString(),
              endDate: moment(new Date()).toISOString(),
            })
          );
          setOpen(false);
          successNotify({
            message: "Rút tiền cho cộng tác viên thành công",
          });
          dispatch(loadingAction.loadingRequest(false));
        })
        .catch((err) => {
          errorNotify({
            message: err?.message,
          });
          dispatch(loadingAction.loadingRequest(false));
        });
    }
  }, [state, type, setDataT, setTotal, name]);

  return (
    <>
      {/* Button trigger modal */}
      <CustomButton
        title={`${i18n.t("withdraw_money", { lng: lang })}`}
        className={
          checkElement?.includes("withdraw_cash_book_collaborator")
            ? "btn-add-withdraw-collaborator"
            : "btn-add-withdraw-collaborator-hide"
        }
        type="button"
        onClick={showDrawer}
      />

      <Drawer
        title={`${i18n.t("withdraw_money", { lng: lang })}`}
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
              title={`${i18n.t("collaborator", { lng: lang })}`}
              placeholder={`${i18n.t("search", { lng: lang })}`}
              value={name}
              onChange={(e) => {
                searchCollaborator(e.target.value);
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
              title={`${i18n.t("money", { lng: lang })}`}
              min={0}
              value={state?.money}
              onChange={(e) => setState({ ...state, money: e })}
              style={{ width: "100%" }}
              inputMoney={true}
            />
          </div>

          <div className="mt-2">
            <InputCustom
              title={`${i18n.t("content", { lng: lang })}`}
              value={state?.note}
              onChange={(e) => setState({ ...state, note: e.target.value })}
              textArea={true}
            />
          </div>

          <div className="mt-2">
            <InputCustom
              title={`${i18n.t("wallet", { lng: lang })}`}
              value={state?.wallet}
              style={{ width: "100%" }}
              onChange={(e) => {
                setState({ ...state, wallet: e });
              }}
              // options={[
              //   {
              //     value: "wallet",
              //     label: `${i18n.t("main_wallet", { lng: lang })}`,
              //   },
              //   {
              //     value: "gift_wallet",
              //     label: `${i18n.t("gift_wallet", { lng: lang })}`,
              //   },
              // ]}
              options={[
                {
                  value: "work_wallet",
                  label: `${i18n.t("work_wallet", { lng: lang })}`,
                },
                {
                  value: "collaborator_wallet",
                  label: `${i18n.t("collaborator_wallet", { lng: lang })}`,
                },
              ]}
              select={true}
            />
          </div>

          <CustomButton
            title={`${i18n.t("withdraw_money", { lng: lang })}`}
            className="float-left btn-add-w"
            type="button"
            onClick={onWithdraw}
          />
        </div>
      </Drawer>
    </>
  );
};

export default memo(Withdraw);
