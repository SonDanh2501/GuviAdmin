import { Select } from "antd";
import { validateYupSchema } from "formik";
import React, { memo, useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { Form, FormGroup, Input, Label, List, Modal } from "reactstrap";
import { searchCollaborators } from "../../api/collaborator";
import { postFile } from "../../api/file";
import { TopupMoneyCollaboratorApi } from "../../api/topup";
import { loadingAction } from "../../redux/actions/loading";
import { createNew } from "../../redux/actions/news";
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

  const searchCollaborator = useCallback((value) => {
    setName(value);
    searchCollaborators(value)
      .then((res) => setData(res.data))
      .catch((err) => console.log(err));
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

  return (
    <>
      {/* Button trigger modal */}
      <CustomButton
        title="Nạp tiền"
        className="btn-modal"
        type="button"
        onClick={() => setState(!state)}
      />
      {/* Modal */}
      <Modal
        className="modal-dialog-centered"
        isOpen={state}
        toggle={() => setState(!state)}
      >
        <div className="modal-header">
          <h3 className="modal-title" id="exampleModalLabel">
            Nạp tiền
          </h3>
          <button className="btn-close" onClick={() => setState(!state)}>
            <i className="uil uil-times-square"></i>
          </button>
        </div>
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

            <CustomTextInput
              label={"(*) Nhập số tiền"}
              id="exampleMoney"
              name="money"
              placeholder="Vui lòng nhập số tiền"
              classNameForm="input-money"
              type="number"
              min={0}
              value={money}
              onChange={(e) => setMoney(e.target.value)}
              errors={errorMoney}
            />
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
              title="Nạp "
              className="float-right btn-modal"
              type="button"
              onClick={addMoney}
            />
          </Form>
        </div>
      </Modal>
    </>
  );
};

export default memo(AddPopup);
