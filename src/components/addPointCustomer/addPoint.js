import { Drawer, List } from "antd";
import _debounce from "lodash/debounce";
import React, { memo, useCallback, useState } from "react";
import { useDispatch } from "react-redux";

import { searchCustomersApi } from "../../api/customer";
import {
  getTopupPointCustomerApi,
  topupPointCustomerApi,
} from "../../api/topup";
import { errorNotify, successNotify } from "../../helper/toast";
import { loadingAction } from "../../redux/actions/loading";
import CustomButton from "../customButton/customButton";
import InputCustom from "../textInputCustom";
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
        searchCustomersApi(value)
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
          <div>
            <InputCustom
              title="Khách hàng"
              placeholder="Tìm kiếm theo số điện thoại"
              type="text"
              value={name}
              onChange={(e) => {
                searchCustomer(e.target.value);
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

          <InputCustom
            title="Nhập số điểm"
            placeholder="Vui lòng nhập số điểm cần nạp"
            type="number"
            min={0}
            value={point}
            onChange={(e) => setPoint(e.target.value)}
          />

          <InputCustom
            title="Nhập nội dung"
            placeholder="Vui lòng nhập nội dung chuyển tiền"
            type="textarea"
            min={0}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            textArea={true}
          />

          <InputCustom
            title="Chọn loại điểm"
            style={{ width: "100%" }}
            value={wallet}
            onChange={(e) => setWallet(e)}
            select={true}
            options={[
              { value: "point", label: "Điểm thưởng" },
              { value: "rank_point", label: "Điểm thành viên" },
            ]}
          />

          <CustomButton
            title="Nạp điểm"
            className="float-left btn-add-t"
            type="button"
            onClick={addMoney}
          />
        </div>
      </Drawer>
    </>
  );
};

export default memo(AddPoint);
