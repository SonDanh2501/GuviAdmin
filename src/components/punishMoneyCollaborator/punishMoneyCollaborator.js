import { Drawer, Select, Input, InputNumber } from "antd";
import React, { memo, useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Form, Label, List, Modal } from "reactstrap";
import { searchCollaborators } from "../../api/collaborator";
import { getListPunishApi, punishMoneyCollaboratorApi } from "../../api/topup";
import { loadingAction } from "../../redux/actions/loading";
import CustomButton from "../customButton/customButton";
import _debounce from "lodash/debounce";
import "./index.scss";
import { errorNotify, successNotify } from "../../helper/toast";
import { getReasonPunishApi } from "../../api/reasons";
import TextArea from "antd/es/input/TextArea";

const PunishMoneyCollaborator = ({ type, setDataT, setTotal }) => {
  const [state, setState] = useState(false);
  const [money, setMoney] = useState("");
  const [note, setNote] = useState("");
  const [data, setData] = useState([]);
  const [name, setName] = useState("");
  const [errorName, setErrorName] = useState("");
  const [errorMoney, setErrorMoney] = useState("");
  const [reason, setReason] = useState([]);
  const [idReason, setIdReason] = useState([]);
  const [id, setId] = useState("");
  const dispatch = useDispatch();
  const reasonOption = [];

  const [open, setOpen] = useState(false);
  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = ({ data }) => {
    setOpen(false);
  };

  useEffect(() => {
    getReasonPunishApi(0, 20)
      .then((res) => {
        setReason(res?.data);
        setIdReason(res?.data[0]?._id);
        setNote(res?.data[0]?.note);
      })
      .catch((err) => {});
  }, []);

  reason?.map((item) => {
    reasonOption.push({
      value: item?._id,
      label: item?.title?.vi,
      note: item?.note,
    });
  });

  const valueSearch = (value) => {
    setName(value);
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

  const handleChangeReason = (value, label) => {
    setIdReason(value);
    setNote(label?.note);
  };

  const punishMoney = useCallback(() => {
    if (name === "" || money === "") {
      !name
        ? setErrorName("Vui lòng nhập thông tin")
        : setErrorMoney("Vui lòng nhập số tiền phạt");
    } else {
      dispatch(loadingAction.loadingRequest(true));
      punishMoneyCollaboratorApi(id, {
        money: money,
        punish_note: note,
        id_punish: idReason,
      })
        .then((res) => {
          setOpen(false);
          getListPunishApi(0, 20).then((res) => {
            setDataT(res?.data);
            setTotal(res?.totalItem);
          });
          successNotify({
            message: "Hoàn tất phạt tiền",
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
  }, [id, money, note, name, idReason]);

  const onChangeMoney = (value) => {
    const deleteComma = value.replace(/,/g, "");
    console.log(deleteComma.toString());
    // setMoney(
    //   deleteComma.toString()?.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")
    // );
  };

  return (
    <>
      <CustomButton
        title="Phạt tiền"
        className="btn-add-topup"
        type="button"
        onClick={showDrawer}
      />
      <Drawer
        title="Phạt tiền cộng tác viên"
        width={500}
        onClose={onClose}
        open={open}
        bodyStyle={{
          paddingBottom: 80,
        }}
      >
        <div className="modal-body">
          <div>
            <a>Cộng tác viên(*)</a>
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
            <a> Nhập số tiền (*)</a>
            <InputNumber
              formatter={(value) =>
                `${value}  đ`.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")
              }
              min={0}
              onChange={(e) => setMoney(e)}
              style={{ width: "100%" }}
            />
          </div>

          <div className="div-money">
            <Label>Chọn lí do phạt (*)</Label>
            <Select
              style={{ width: "100%" }}
              value={idReason}
              onChange={handleChangeReason}
              options={reasonOption}
            />
          </div>

          <div className="mt-2">
            <a>Nội dung</a>
            <TextArea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Vui lòng nhập nội dung chuyển tiền"
            />
          </div>

          <CustomButton
            title="Phạt tiền"
            className="float-left btn-add-t"
            type="button"
            onClick={punishMoney}
          />
        </div>
      </Drawer>
    </>
  );
};

export default memo(PunishMoneyCollaborator);
