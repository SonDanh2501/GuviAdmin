import React, { memo, useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { Form, Input, Label, List, Modal } from "reactstrap";
import { searchCustomers } from "../../api/customer";
import { TopupMoneyCustomerApi } from "../../api/topup";
import { loadingAction } from "../../redux/actions/loading";
import CustomButton from "../customButton/customButton";
import IntlCurrencyInput from "react-intl-currency-input";
import _debounce from "lodash/debounce";
import CustomTextInput from "../CustomTextInput/customTextInput";
import "./addTopupCustomer.scss";
import { Drawer } from "antd";
import { errorNotify } from "../../helper/toast";
import { getTopupCustomer } from "../../redux/actions/topup";

const AddTopupCustomer = () => {
  const [state, setState] = useState(false);
  const [money, setMoney] = useState("");
  const [note, setNote] = useState("");
  const [data, setData] = useState([]);
  const [name, setName] = useState("");
  const [errorName, setErrorName] = useState("");
  const [errorMoney, setErrorMoney] = useState("");
  const [id, setId] = useState("");
  const dispatch = useDispatch();

  const [open, setOpen] = useState(false);
  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = ({ data }) => {
    setOpen(false);
  };

  const valueSearch = (value) => {
    setName(value);
  };

  const searchCollaborator = useCallback(
    _debounce((value) => {
      setName(value);
      if (value) {
        searchCustomers(0, 100, "", value)
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

  const addMoney = useCallback(() => {
    if (name === "" || money === "") {
      !name
        ? setErrorName("Vui lòng nhập thông tin")
        : setErrorMoney("Vui lòng nhập số tiền cần nạp");
    } else {
      dispatch(loadingAction.loadingRequest(true));
      TopupMoneyCustomerApi(id, {
        money: money,
        transfer_note: note,
      })
        .then((res) => {
          setOpen(false);
          dispatch(
            getTopupCustomer.getTopupCustomerRequest({ start: 0, length: 10 })
          );
          dispatch(loadingAction.loadingRequest(false));
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

  const currencyConfig = {
    locale: "vi",
    formats: {
      number: {
        BRL: {
          style: "currency",
          currency: "VND",
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        },
      },
    },
  };

  const handleChange = (event, value) => {
    event.preventDefault();
    setMoney(value);
  };

  return (
    <>
      {/* Button trigger modal */}
      <CustomButton
        title="Nạp tiền"
        className="btn-add-topup-customer"
        type="button"
        onClick={showDrawer}
      />

      <Drawer
        title="Nạp tiền cộng tác viên"
        width={500}
        onClose={onClose}
        open={open}
        bodyStyle={{
          paddingBottom: 80,
        }}
      >
        <div className="modal-body">
          <Form>
            <div>
              <Label>(*)Khách hàng</Label>
              <Input
                placeholder="Tìm kiếm theo số điện thoại"
                value={name}
                onChange={(e) => {
                  searchCollaborator(e.target.value);
                  valueSearch(e.target.value);
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
                          setName(item?.name);
                          setData([]);
                        }}
                      >
                        <a>
                          {" "}
                          {item?.name} - {item?.phone} - {item?.id_view}
                        </a>
                      </div>
                    );
                  })}
                </List>
              )}
            </div>

            <div className="div-money">
              <Label>(*) Nhập số tiền</Label>
              <IntlCurrencyInput
                className="input-money"
                currency="BRL"
                config={currencyConfig}
                onChange={handleChange}
                value={money}
              />
            </div>
            <CustomTextInput
              label={"Nhập nội dung"}
              id="exampleNote"
              name="note"
              placeholder="Vui lòng nhập nội dung chuyển tiền"
              type="textarea"
              min={0}
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
            <CustomButton
              title="Nạp "
              className="float-left btn-add-topup-customer"
              type="button"
              onClick={addMoney}
            />
          </Form>
        </div>
      </Drawer>
    </>
  );
};

export default memo(AddTopupCustomer);
