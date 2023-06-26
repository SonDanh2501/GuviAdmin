import { Drawer, Input, InputNumber, List, Select } from "antd";
import TextArea from "antd/es/input/TextArea";
import _debounce from "lodash/debounce";
import moment from "moment";
import React, { memo, useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { searchCollaborators } from "../../api/collaborator";
import {
  TopupMoneyCollaboratorApi,
  getTopupCollaboratorApi,
} from "../../api/topup";
import { errorNotify, successNotify } from "../../helper/toast";
import { loadingAction } from "../../redux/actions/loading";
import { getRevenueCollaborator } from "../../redux/actions/topup";
import { getElementState, getLanguageState } from "../../redux/selectors/auth";
import CustomButton from "../customButton/customButton";
import "./addTopup.scss";
import i18n from "../../i18n";
import InputCustom from "../textInputCustom";

const AddPopup = (props) => {
  const { type, setDataT, setTotal } = props;
  const [money, setMoney] = useState("");
  const [note, setNote] = useState("");
  const [data, setData] = useState([]);
  const [name, setName] = useState("");
  const [errorName, setErrorName] = useState("");
  const [errorMoney, setErrorMoney] = useState("");
  const [wallet, setWallet] = useState("");
  const [id, setId] = useState("");
  const dispatch = useDispatch();
  const checkElement = useSelector(getElementState);
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
      if (value) {
        searchCollaborators(0, 100, "", value)
          .then((res) => {
            if (value === "") {
              setData([]);
            } else {
              setData(res.data);
            }
          })
          .catch((err) => {});
      } else if (id) {
        setData([]);
      } else {
        setData([]);
      }
      setId("");
    }, 500),
    []
  );

  const addMoney = useCallback(() => {
    if (name === "" || money === "") {
      !name
        ? setErrorName("Vui lòng nhập thông tin")
        : setErrorMoney("Vui lòng nhập số tiền cần nạp");
    } else {
      dispatch(loadingAction.loadingRequest(true));
      TopupMoneyCollaboratorApi(id, {
        money: money,
        transfer_note: note,
        type_wallet: wallet,
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
            message: `${i18n.t("recharge_success", { lng: lang })}`,
          });
          dispatch(loadingAction.loadingRequest(false));
        })
        .catch((err) => {
          errorNotify({
            message: err,
          });
          dispatch(loadingAction.loadingRequest(false));
        });
    }
  }, [id, money, note, name, wallet, type, setDataT, setTotal]);

  return (
    <>
      <CustomButton
        title={`${i18n.t("recharge", { lng: lang })}`}
        className={
          checkElement?.includes("create_cash_book_collaborator")
            ? "btn-add-topup-collaborator"
            : "btn-add-topup-collaborator-hide"
        }
        type="button"
        onClick={showDrawer}
      />
      <Drawer
        title={`${i18n.t("collaborator_recharge", { lng: lang })}`}
        width={width > 490 ? 500 : 300}
        onClose={onClose}
        open={open}
        bodyStyle={{
          paddingBottom: 80,
        }}
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
              error={errorName}
            />
            {data.length > 0 && (
              <List type={"unstyled"} className="list-item">
                {data?.map((item, index) => {
                  return (
                    <div
                      key={index}
                      onClick={(e) => {
                        setId(item?._id);
                        setName(item?.full_name);
                        setData([]);
                      }}
                    >
                      <a>
                        {" "}
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
              value={money}
              onChange={(e) => setMoney(e)}
              style={{ width: "100%" }}
              inputMoney={true}
            />
          </div>

          <div className="mt-2">
            <InputCustom
              title={`${i18n.t("content", { lng: lang })}`}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              textArea={true}
            />
          </div>

          <div className="mt-2">
            <InputCustom
              title={`${i18n.t("wallet", { lng: lang })}`}
              value={wallet}
              style={{ width: "100%" }}
              onChange={(e) => {
                setWallet(e);
              }}
              options={[
                {
                  value: "wallet",
                  label: `${i18n.t("main_wallet", { lng: lang })}`,
                },
                {
                  value: "gift_wallet",
                  label: `${i18n.t("gift_wallet", { lng: lang })}`,
                },
              ]}
              select={true}
            />
          </div>

          <CustomButton
            title={`${i18n.t("recharge", { lng: lang })}`}
            className="float-left btn-add-t"
            type="button"
            onClick={addMoney}
          />
        </div>
      </Drawer>
    </>
  );
};

export default memo(AddPopup);
