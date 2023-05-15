import { Drawer, Select } from "antd";
import React, { memo, useCallback, useEffect, useState } from "react";
import IntlCurrencyInput from "react-intl-currency-input";
import { useDispatch } from "react-redux";
import { Form, Input, Label, List, Modal } from "reactstrap";
import { searchCollaborators } from "../../api/collaborator";
import { getListPunishApi, punishMoneyCollaboratorApi } from "../../api/topup";
import { loadingAction } from "../../redux/actions/loading";
import CustomButton from "../customButton/customButton";
import CustomTextInput from "../CustomTextInput/customTextInput";
import _debounce from "lodash/debounce";
import "./index.scss";
import { errorNotify, successNotify } from "../../helper/toast";
import { getReasonPunishApi } from "../../api/reasons";

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
      })
      .catch((err) => {});
  }, []);

  reason?.map((item) => {
    reasonOption.push({
      value: item?._id,
      label: item?.title?.vi,
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

  const handleChangeReason = (value) => {
    setIdReason(value);
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
          <Form>
            <div>
              <Label>Cộng tác viên(*)</Label>
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
              <Label> Nhập số tiền (*)</Label>
              <IntlCurrencyInput
                className="input-money-punish"
                currency="BRL"
                config={currencyConfig}
                onChange={handleChange}
                value={money}
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
              title="Phạt tiền"
              className="float-left btn-add-t"
              type="button"
              onClick={punishMoney}
            />
          </Form>
        </div>
      </Drawer>
    </>
  );
};

export default memo(PunishMoneyCollaborator);
