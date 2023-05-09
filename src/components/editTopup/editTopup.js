import _debounce from "lodash/debounce";
import moment from "moment";
import React, { memo, useCallback, useEffect, useState } from "react";
import IntlCurrencyInput from "react-intl-currency-input";
import { useDispatch } from "react-redux";
import { Form, Input, Label, List, Modal } from "reactstrap";
import { searchCollaborators } from "../../api/collaborator";
import {
  getTopupCollaboratorApi,
  updateMoneyCollaboratorApi,
} from "../../api/topup";
import { errorNotify } from "../../helper/toast";
import { loadingAction } from "../../redux/actions/loading";
import {
  getRevenueCollaborator,
  getTopupCollaborator,
} from "../../redux/actions/topup";
import CustomButton from "../customButton/customButton";
import CustomTextInput from "../CustomTextInput/customTextInput";
import "./editTopup.scss";

const EditTopup = ({ state, setState, item, type, setDataT, setTotal }) => {
  const [money, setMoney] = useState("");
  const [note, setNote] = useState("");
  const [data, setData] = useState([]);
  const [name, setName] = useState("");
  const [id, setId] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    setName(item?.id_collaborator?.full_name);
    setId(item?._id);
    setMoney(item?.money);
    setNote(item?.transfer_note);
  }, [item]);

  const searchCollaborator = useCallback(
    _debounce((value) => {
      setName(value);
      if (value) {
        searchCollaborators(value)
          .then((res) => setData(res.data))
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

  const editMoney = useCallback(() => {
    dispatch(loadingAction.loadingRequest(true));
    updateMoneyCollaboratorApi(id, {
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
        setState(false);
        dispatch(loadingAction.loadingRequest(false));
      })
      .catch((err) => {
        errorNotify({
          message: err,
        });
        dispatch(loadingAction.loadingRequest(false));
      });
  }, [id, money, note, type, setDataT, setTotal]);

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
      <Modal
        className="modal-dialog-centered"
        isOpen={state}
        toggle={() => setState(!state)}
      >
        <div className="modal-header">
          <h3 className="modal-title" id="exampleModalLabel">
            Sửa
          </h3>
          <button className="btn-close" onClick={() => setState(!state)}>
            <i className="uil uil-times-square"></i>
          </button>
        </div>
        <div className="modal-body">
          <Form>
            <div>
              <Label>Cộng tác viên</Label>
              <Input
                placeholder="Tìm kiếm theo số điện thoại"
                value={name}
                onChange={(e) => {
                  searchCollaborator(e.target.value);
                  setName(e.target.value);
                }}
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
              title="Sửa"
              className="float-right btn-modal-edit-topup"
              type="button"
              onClick={editMoney}
            />
          </Form>
        </div>
      </Modal>
    </>
  );
};

export default memo(EditTopup);
