import { Drawer, Input, InputNumber, List } from "antd";
import _debounce from "lodash/debounce";
import React, { memo, useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { searchCustomersApi } from "../../api/customer";
import { withdrawMoneyCustomerApi } from "../../api/topup";
import { errorNotify, successNotify } from "../../helper/toast";
import { loadingAction } from "../../redux/actions/loading";
import { getTopupCustomer } from "../../redux/actions/topup";
import { getElementState, getLanguageState } from "../../redux/selectors/auth";
import CustomButton from "../customButton/customButton";
import "./withdrawCustomer.scss";
import i18n from "../../i18n";
import InputCustom from "../textInputCustom";
const { TextArea } = Input;

const WithdrawCustomer = () => {
  const [money, setMoney] = useState(0);
  const [note, setNote] = useState("");
  const [data, setData] = useState([]);
  const [name, setName] = useState("");
  const [errorName, setErrorName] = useState("");
  const [errorMoney, setErrorMoney] = useState("");
  const [id, setId] = useState("");
  const dispatch = useDispatch();
  const checkElement = useSelector(getElementState);
  const lang = useSelector(getLanguageState);

  const [open, setOpen] = useState(false);
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
        searchCustomersApi(value)
          .then((res) => {
            if (value === "") {
              setData([]);
            } else {
              setData(res.data);
            }
          })
          .catch((err) => console.log(err));
      } else {
        setData([]);
      }
      setId("");
    }, 500),
    []
  );

  const withdrawMoney = useCallback(() => {
    if (name === "" || money === "") {
      !name
        ? setErrorName("Vui lòng nhập thông tin")
        : setErrorMoney("Vui lòng nhập số tiền cần nạp");
    } else {
      dispatch(loadingAction.loadingRequest(true));
      withdrawMoneyCustomerApi(id, {
        money: money,
        transfer_note: note,
      })
        .then((res) => {
          setOpen(false);
          dispatch(
            getTopupCustomer.getTopupCustomerRequest({ start: 0, length: 20 })
          );
          successNotify({
            message: "Rút tiền cho khách hàng thành công",
          });
          dispatch(loadingAction.loadingRequest(false));
          setMoney(0);
          setNote("");
          setId("");
          setName("");
        })
        .catch((err) => {
          dispatch(loadingAction.loadingRequest(false));
          errorNotify({
            message: err,
          });
          setOpen(false);
        });
    }
  }, [id, money, note, name]);

  return (
    <>
      {/* Button trigger modal */}
      <CustomButton
        title={`${i18n.t("withdraw_money", { lng: lang })}`}
        className={"btn-withdraw-customer"}
        type="button"
        onClick={showDrawer}
      />

      <Drawer
        title={`${i18n.t("withdraw_money", { lng: lang })}`}
        width={500}
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
              title={`${i18n.t("customer", { lng: lang })}`}
              placeholder={`${i18n.t("search", { lng: lang })}`}
              value={name}
              onChange={(e) => {
                searchCollaborator(e.target.value);
                setName(e.target.value);
              }}
            />
            {errorName && <a className="error">{errorName}</a>}
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
                        {item?.full_name} - {item?.phone} - {item?.id_view}
                      </a>
                    </div>
                  );
                })}
              </List>
            )}
          </div>

          <div className="mt-2">
            <InputCustom
              title={`${i18n.t("money", { lng: lang })}`}
              value={money}
              onChange={(e) => setMoney(e)}
              style={{ width: "100%" }}
              inputMoney={true}
            />
          </div>

          <div className="mt-2">
            <InputCustom
              title={`${i18n.t("content", { lng: lang })}`}
              min={0}
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>
          <CustomButton
            title={`${i18n.t("withdraw_money", { lng: lang })}`}
            className="btn-add-withdraw-customer"
            type="button"
            onClick={withdrawMoney}
          />
        </div>
      </Drawer>
    </>
  );
};

export default memo(WithdrawCustomer);
