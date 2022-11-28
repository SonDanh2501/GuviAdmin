import React, { memo, useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { Form, Modal } from "reactstrap";
import { loadingAction } from "../../redux/actions/loading";
import { createReason } from "../../redux/actions/reason";
import CustomButton from "../customButton/customButton";
import CustomTextInput from "../CustomTextInput/customTextInput";
import "./addReason.scss";

const AddReason = () => {
  const [state, setState] = useState(false);
  const [titleVN, setTitleVN] = useState("");
  const [titleEN, setTitleEN] = useState("");
  const [type, setType] = useState("cash");
  const [descriptionVN, setDescriptionVN] = useState("");
  const [descriptionEN, setDescriptionEN] = useState("");
  const [moneyReason, setMoneyReason] = useState();
  const [timeReason, setTimeReason] = useState();
  const [note, setNote] = useState("");
  const [applyUser, setApplyUser] = useState("customer");

  const dispatch = useDispatch();

  const addReason = useCallback(() => {
    dispatch(loadingAction.loadingRequest(true));
    dispatch(
      createReason.createReasonRequest({
        title: {
          vi: titleVN,
          en: titleEN,
        },
        description: {
          vi: descriptionVN,
          en: descriptionEN,
        },
        punish_type: type,
        punish: type === "cash" ? moneyReason : timeReason * 60 * 1000,
        apply_user: applyUser,
        note: note,
      })
    );
  }, [
    titleVN,
    titleEN,
    descriptionVN,
    descriptionEN,
    type,
    applyUser,
    note,
    moneyReason,
    timeReason,
  ]);

  return (
    <>
      {/* Button trigger modal */}
      <CustomButton
        title="Thêm lí do huỷ việc"
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
            Thêm lí do huỷ việc
          </h3>
          <button className="btn-close" onClick={() => setState(!state)}>
            <i className="uil uil-times-square"></i>
          </button>
        </div>
        <div className="modal-body">
          <Form>
            <div>
              <h5>Lý do huỷ việc</h5>
              <CustomTextInput
                label={"Tiếng Việt"}
                id="exampleTitle"
                name="title"
                placeholder="Vui lòng nhập tiêu đề"
                type="text"
                value={titleVN}
                onChange={(e) => setTitleVN(e.target.value)}
              />
              <CustomTextInput
                label={"Tiếng Anh"}
                id="exampleTitle"
                name="title"
                placeholder="Vui lòng nhập tiêu đề"
                type="text"
                value={titleEN}
                onChange={(e) => setTitleEN(e.target.value)}
              />
            </div>
            <div>
              <h5>Mô tả</h5>
              <CustomTextInput
                label={"Tiếng Việt"}
                id="exampleTitle"
                name="title"
                placeholder="Vui lòng nhập mô tả"
                type="text"
                value={descriptionVN}
                onChange={(e) => setDescriptionVN(e.target.value)}
              />
              <CustomTextInput
                label={"Tiếng Anh"}
                id="exampleTitle"
                name="title"
                placeholder="Vui lòng nhập mô tả"
                type="text"
                value={descriptionEN}
                onChange={(e) => setDescriptionEN(e.target.value)}
              />
            </div>
            <CustomTextInput
              label={"Hình thức phạt"}
              id="exampleType"
              name="Type"
              className="select-code-phone"
              type="select"
              value={type}
              onChange={(e) => setType(e.target.value)}
              body={
                <>
                  <option value={"cash"}>Cash</option>
                  <option value={"lock_time"}>Lock-Time</option>
                </>
              }
            />
            <CustomTextInput
              label={type === "cash" ? "Phạt tiền" : "Thời gian phạt (phut)"}
              id="exampleTitle"
              name="title"
              min={0}
              placeholder={
                type === "cash" ? "Vui lòng nhập số tiền" : "Thời gian phạt"
              }
              type={type === "cash" ? "number" : "number"}
              value={type === "cash" ? moneyReason : timeReason}
              onChange={(e) => {
                type === "cash"
                  ? setMoneyReason(e.target.value)
                  : setTimeReason(e.target.value);
              }}
            />
            <CustomTextInput
              label={"Đối tượng áp dụng"}
              id="exampleType"
              name="Type"
              className="select-code-phone"
              type="select"
              value={applyUser}
              onChange={(e) => setApplyUser(e.target.value)}
              body={
                <>
                  <option value={"customer"}>Khách hàng</option>
                  <option value={"collaborator"}>Cộng tác viên</option>
                </>
              }
            />
            <CustomTextInput
              label={"Ghi chú"}
              id="exampleTitle"
              name="title"
              placeholder="Vui lòng nhập ghi chú"
              type="textarea"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
            <CustomButton
              title="Thêm"
              className="float-right btn-modal"
              type="button"
              onClick={addReason}
            />
          </Form>
        </div>
      </Modal>
    </>
  );
};

export default memo(AddReason);
