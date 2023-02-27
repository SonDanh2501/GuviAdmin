import { Select } from "antd";
import { validateYupSchema } from "formik";
import React, { memo, useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Form, FormGroup, Input, Label, List, Modal } from "reactstrap";
import { searchCollaborators } from "../../api/collaborator";
import IntlCurrencyInput from "react-intl-currency-input";
import {
  TopupMoneyCollaboratorApi,
  updateMoneyCollaboratorApi,
} from "../../api/topup";
import { loadingAction } from "../../redux/actions/loading";
import { createNew } from "../../redux/actions/news";
import CustomButton from "../customButton/customButton";
import CustomTextInput from "../CustomTextInput/customTextInput";
import _debounce from "lodash/debounce";
import "./editTopup.scss";

const EditTopup = ({ state, setState, item }) => {
  const [money, setMoney] = useState("");
  const [note, setNote] = useState("");
  const [data, setData] = useState([]);
  const [name, setName] = useState("");
  const [id, setId] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    setName(item?.id_collaborator?.name);
    setId(item?._id);
    setMoney(item?.money);
    setNote(item?.transfer_note);
  }, [item]);

  const valueSearch = (value) => {
    setName(value);
  };

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
        window.location.reload();
      })
      .catch((err) => console.log(err));
  }, [id, money, note]);

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
                  valueSearch(e.target.value);
                }}
              />
              {data.length > 0 && (
                <List type={"unstyled"} className="list-item">
                  {data?.map((item, index) => {
                    return (
                      <option
                        key={index}
                        value={item?._id}
                        onClick={(e) => {
                          setId(e.target.value);
                          setName(item?.name);
                          setData([]);
                        }}
                      >
                        {item?.name}
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
