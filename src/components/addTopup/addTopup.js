import { Drawer } from "antd";
import React, { memo, useCallback, useState } from "react";
import IntlCurrencyInput from "react-intl-currency-input";
import { useDispatch } from "react-redux";
import { Form, Input, Label, List, Modal } from "reactstrap";
import { searchCollaborators } from "../../api/collaborator";
import { TopupMoneyCollaboratorApi } from "../../api/topup";
import { loadingAction } from "../../redux/actions/loading";
import CustomButton from "../customButton/customButton";
import CustomTextInput from "../CustomTextInput/customTextInput";
import "./addTopup.scss";

const AddPopup = () => {
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

  const searchCollaborator = useCallback((value) => {
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
        .catch((err) => console.log(err));
    } else if (id) {
      setData([]);
    } else {
      setData([]);
    }
    setId("");
  }, []);

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
      })
        .then((res) => {
          window.location.reload();
        })
        .catch((err) => {
          dispatch(loadingAction.loadingRequest(false));
          console.log(err);
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
      <CustomButton
        title="Nạp tiền"
        className="btn-add-topup"
        type="button"
        // onClick={() => setState(!state)}
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
              <Label>(*)Cộng tác viên</Label>
              <Input
                placeholder="Tìm kiếm theo số điện thoại"
                value={name}
                onChange={(e) => searchCollaborator(e.target.value)}
              />
              {errorName && <a className="error">{errorName}</a>}
              {data.length > 0 && (
                <List type={"unstyled"} className="list-item">
                  {data?.map((item, index) => {
                    return (
                      <option
                        key={index}
                        value={item?._id}
                        onClick={(e) => {
                          setId(e.target.value);
                          setName(item?.full_name);
                          setData([]);
                        }}
                      >
                        {item?.full_name}
                      </option>
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
              title="Nạp tiền"
              className="float-left btn-add-t"
              type="button"
              onClick={addMoney}
            />
          </Form>
        </div>
      </Drawer>
    </>
  );
};

export default memo(AddPopup);
