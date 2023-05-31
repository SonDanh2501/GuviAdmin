import React, { memo, useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { searchCustomers } from "../../api/customer";
import {
  TopupMoneyCustomerApi,
  withdrawMoneyCustomerApi,
} from "../../api/topup";
import { loadingAction } from "../../redux/actions/loading";
import CustomButton from "../customButton/customButton";
import _debounce from "lodash/debounce";
import CustomTextInput from "../CustomTextInput/customTextInput";
import "./withdrawCustomer.scss";
import { Drawer, Input, InputNumber, List } from "antd";
import { errorNotify, successNotify } from "../../helper/toast";
import { getTopupCustomer } from "../../redux/actions/topup";
const { TextArea } = Input;

const WithdrawCustomer = () => {
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
        title="Rút tiền"
        className="btn-withdraw-customer"
        type="button"
        onClick={showDrawer}
      />

      <Drawer
        title="Rút tiền khách hàng"
        width={500}
        onClose={onClose}
        open={open}
        bodyStyle={{
          paddingBottom: 80,
        }}
      >
        <div className="modal-body">
          <div>
            <a className="label-input">(*)Khách hàng</a>
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

          <div className="mt-2">
            <a className="label-input">(*) Nhập số tiền</a>
            <InputNumber
              formatter={(value) =>
                `${value}  đ`.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")
              }
              onChange={(e) => setMoney(e)}
              style={{ width: "100%" }}
            />
          </div>

          <div className="mt-2">
            <a className="label-input">Nhập nội dung</a>
            <TextArea
              placeholder="Vui lòng nhập nội dung chuyển tiền"
              type="textarea"
              min={0}
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>
          <CustomButton
            title="Rút"
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
