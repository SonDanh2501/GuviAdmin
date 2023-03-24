import { Drawer } from "antd";
import React, { memo, useCallback, useState } from "react";
import IntlCurrencyInput from "react-intl-currency-input";
import { useDispatch } from "react-redux";
import { Form, Input, Label, List } from "reactstrap";
import { searchCollaborators } from "../../api/collaborator";
import {
  getTopupCollaboratorApi,
  withdrawMoneyCollaboratorApi,
} from "../../api/topup";
import { loadingAction } from "../../redux/actions/loading";
import CustomButton from "../customButton/customButton";
import CustomTextInput from "../CustomTextInput/customTextInput";
import _debounce from "lodash/debounce";
import "./withdraw.scss";
import {
  getRevenueCollaborator,
  getTopupCollaborator,
} from "../../redux/actions/topup";
import { errorNotify, successNotify } from "../../helper/toast";
import moment from "moment";

const Withdraw = ({ type, setDataT, setTotal }) => {
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
      searchCollaborators(0, 100, "", value)
        .then((res) => {
          if (value === "") {
            setData([]);
          } else {
            setData(res.data);
          }
        })
        .catch((err) => console.log(err));
      setId("");
    }, 500),
    []
  );

  const onWithdraw = useCallback(() => {
    if (name === "" || money === "") {
      !name
        ? setErrorName("Vui lòng nhập thông tin")
        : setErrorMoney("Vui lòng nhập số tiền cần nạp");
    } else {
      dispatch(loadingAction.loadingRequest(true));
      withdrawMoneyCollaboratorApi(id, {
        money: money,
        transfer_note: note,
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
            message: err,
          });
          dispatch(loadingAction.loadingRequest(false));
        });
    }
  }, [id, money, note, name, type, setDataT, setTotal]);

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
        title="Rút tiền"
        className="btn-add-withdraw "
        type="button"
        // onClick={() => setState(!state)}
        onClick={showDrawer}
      />

      <Drawer
        title="Rút tiền cộng tác viên"
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
              title="Rút tiền"
              className="float-left btn-add-w"
              type="button"
              onClick={onWithdraw}
            />
          </Form>
        </div>
      </Drawer>
    </>
  );
};

export default memo(Withdraw);
