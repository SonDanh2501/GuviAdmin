import { Drawer, Select } from "antd";
import React, { memo, useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { Form, Input, Label, List, Modal } from "reactstrap";
import {
  getTopupCollaboratorApi,
  getTopupPointCustomerApi,
  topupPointCustomerApi,
} from "../../api/topup";
import { loadingAction } from "../../redux/actions/loading";
import CustomButton from "../customButton/customButton";
import CustomTextInput from "../CustomTextInput/customTextInput";
import _debounce from "lodash/debounce";
import moment from "moment";
import { errorNotify, successNotify } from "../../helper/toast";
import { searchCustomers } from "../../api/customer";
import "./addPoint.scss";

const AddPoint = ({ start, setDataL, setTotal }) => {
  const [state, setState] = useState(false);
  const [point, setPoint] = useState("");
  const [note, setNote] = useState("");
  const [data, setData] = useState([]);
  const [name, setName] = useState("");
  const [errorName, setErrorName] = useState("");
  const [errorPoint, setErrorPoint] = useState("");
  const [wallet, setWallet] = useState("");
  const [id, setId] = useState("");
  const dispatch = useDispatch();

  const [open, setOpen] = useState(false);
  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = ({ data }) => {
    setOpen(false);
  };

  const searchCustomer = useCallback(
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
    if (name === "" || point === "") {
      !name
        ? setErrorName("Vui lòng nhập thông tin")
        : setErrorPoint("Vui lòng nhập số điểm cần nạp");
    } else {
      dispatch(loadingAction.loadingRequest(true));
      topupPointCustomerApi(id, {
        value: point,
        note: note,
        type_point: wallet,
      })
        .then((res) => {
          getTopupPointCustomerApi(start, 20)
            .then((res) => {
              setDataL(res?.data);
              setTotal(res?.totalItem);
            })
            .catch((err) => {});
          setNote("");
          setPoint(0);
          setWallet("");
          setId("");
          setName("");
          setOpen(false);
          successNotify({
            message: "Nạp điểm cho khách hàng thành công",
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
  }, [id, point, note, name, wallet, start, setDataL, setTotal]);

  return (
    <>
      <CustomButton
        title="Nạp điểm"
        className="btn-add-topup"
        type="button"
        // onClick={() => setState(!state)}
        onClick={showDrawer}
      />
      <Drawer
        title="Nạp điểm khách hàng"
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
                  searchCustomer(e.target.value);
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
              <CustomTextInput
                label={"Nhập số điểm"}
                id="exampleNote"
                name="note"
                placeholder="Vui lòng nhập số điểm cần nạp"
                type="number"
                min={0}
                value={point}
                onChange={(e) => setPoint(e.target.value)}
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

            <div>
              <a>Chọn loại điểm</a>
              <Select
                style={{ width: "100%" }}
                value={wallet}
                onChange={(e) => setWallet(e)}
                options={[
                  { value: "", label: "Vui lòng chọn loại điểm" },
                  { value: "point", label: "Điểm thưởng" },
                  { value: "rank_point", label: "Điểm thành viên" },
                ]}
              />
            </div>

            <CustomButton
              title="Nạp điểm"
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

export default memo(AddPoint);
