import { Drawer, Input, InputNumber, Select } from "antd";
import _debounce from "lodash/debounce";
import moment from "moment";
import React, { memo, useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { List } from "reactstrap";
import { searchCollaborators } from "../../api/collaborator";
import {
  getTopupCollaboratorApi,
  withdrawMoneyCollaboratorApi,
} from "../../api/topup";
import { errorNotify, successNotify } from "../../helper/toast";
import { loadingAction } from "../../redux/actions/loading";
import { getRevenueCollaborator } from "../../redux/actions/topup";
import CustomButton from "../customButton/customButton";
import "./withdraw.scss";
const { TextArea } = Input;

const Withdraw = (props) => {
  const { type, setDataT, setTotal } = props;
  const [state, setState] = useState(false);
  const [money, setMoney] = useState("");
  const [note, setNote] = useState("");
  const [data, setData] = useState([]);
  const [name, setName] = useState("");
  const [errorName, setErrorName] = useState("");
  const [errorMoney, setErrorMoney] = useState("");
  const [id, setId] = useState("");
  const [wallet, setWallet] = useState("");
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
  }, [id, money, note, name, type, setDataT, setTotal, wallet]);

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
          <div>
            <a>(*)Cộng tác viên</a>
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
            <a>(*) Nhập số tiền</a>
            <InputNumber
              formatter={(value) =>
                `${value}  đ`.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")
              }
              min={0}
              value={money}
              onChange={(e) => setMoney(e)}
              style={{ width: "100%" }}
            />
          </div>

          <div className="mt-2">
            <a>Nội dung</a>
            <TextArea
              placeholder="Vui lòng nhập nội dung chuyển tiền"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>

          <div className="mt-2">
            <a>Ví</a>
            <Select
              defaultValue="Vui lòng chọn ví"
              style={{ width: "100%" }}
              onChange={(e) => {
                setWallet(e);
              }}
              options={[
                { value: "wallet", label: "Ví chính" },
                { value: "gift_wallet", label: "Ví thưởng" },
              ]}
            />
          </div>

          <CustomButton
            title="Rút tiền"
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
