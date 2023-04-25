import React, { memo, useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { Col, Form, Modal, Row } from "reactstrap";
import { loadingAction } from "../../redux/actions/loading";

import CustomButton from "../customButton/customButton";
import CustomTextInput from "../CustomTextInput/customTextInput";
import "./addReason.scss";
import { Button, Input } from "antd";
import { createReason } from "../../api/reasons";
import { getReasons } from "../../redux/actions/reason";

const AddReason = () => {
  const [state, setState] = useState(false);
  const [titleVN, setTitleVN] = useState("");
  const [titleEN, setTitleEN] = useState("");
  const [type, setType] = useState("cash");
  const [descriptionVN, setDescriptionVN] = useState("");
  const [descriptionEN, setDescriptionEN] = useState("");
  const [max_time, setMaxtime] = useState();
  const [min_time, setMintime] = useState();
  const [value, setValue] = useState();
  const [punishTime, setPunishTime] = useState([
    {
      max_time: 0,
      min_time: 0,
      value: 0,
    },
  ]);
  const [punishCash, setPunishCash] = useState([
    {
      max_time: 0,
      min_time: 0,
      value: 0,
    },
  ]);
  const [note, setNote] = useState("");
  const [applyUser, setApplyUser] = useState("customer");

  const dispatch = useDispatch();

  const addPunish = () => {
    setPunishTime((punish) => [
      ...punish,
      {
        max_time: 0,
        min_time: 0,
        value: 0,
      },
    ]);
  };
  const addPunishCash = () => {
    setPunishCash((punishCash) => [
      ...punishCash,
      {
        max_time: 0,
        min_time: 0,
        value: 0,
      },
    ]);
  };

  const deletePunish = (index) => {
    punishTime.splice(index, 1);
    setPunishTime([...punishTime]);
  };

  const deletePunishCash = (index) => {
    punishCash.splice(index, 1);
    setPunishCash([...punishCash]);
  };

  const onChangeMaxTime = (value, index) => {
    const newArr = [...punishTime];
    punishTime[index].max_time = value;
    setPunishTime(newArr);
  };

  const onChangeMaxTimeCash = (value, index) => {
    const newArr = [...punishCash];
    punishCash[index].max_time = value;
    setPunishCash(newArr);
  };

  const onChangeMinTime = (value, index) => {
    const newArr = [...punishTime];
    punishTime[index].min_time = value;
    setPunishTime(newArr);
  };

  const onChangeMinTimeCash = (value, index) => {
    const newArr = [...punishCash];
    punishCash[index].min_time = value;
    setPunishCash(newArr);
  };

  const onChangeValueTime = (value, index) => {
    const newArr = [...punishTime];
    punishTime[index].value = value;
    setPunishTime(newArr);
  };

  const onChangeValueCash = (value, index) => {
    const newArr = [...punishCash];
    punishCash[index].value = value;
    setPunishCash(newArr);
  };

  const addReason = useCallback(() => {
    createReason({
      title: {
        vi: titleVN,
        en: titleEN,
      },
      description: {
        vi: descriptionVN,
        en: descriptionEN,
      },
      punish_type: type,
      punish_time: punishTime,
      punish_cash: punishCash,
      apply_user: applyUser,
      note: note,
    })
      .then((res) => {
        dispatch(getReasons.getReasonsRequest({ start: 0, length: 10 }));
        setState(false);
      })
      .catch((err) => {});
  }, [
    titleVN,
    titleEN,
    descriptionVN,
    descriptionEN,
    type,
    applyUser,
    note,
    punishTime,
    punishCash,
  ]);

  return (
    <>
      {/* Button trigger modal */}
      <CustomButton
        title="Thêm lí do huỷ việc"
        className="btn-modal-add-reason"
        type="button"
        onClick={() => setState(!state)}
      />
      {/* Modal */}
      <Modal
        className="modal-dialog-centered"
        isOpen={state}
        toggle={() => setState(!state)}
        fullscreen={true}
        fade={true}
        size="lg"
        style={{ maxWidth: 1800 }}
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
            <Row>
              <Col md={4}>
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
              </Col>
              <Col md={4}>
                <div>
                  <h5>Phạt thời gian</h5>
                  {punishTime?.map((item, index) => {
                    return (
                      <div
                        className={
                          index !== 0 ? "div-ticket mt-3" : "div-ticket"
                        }
                        key={index}
                      >
                        <div>
                          <a>Thời gian tối đa</a>
                          <Input
                            type="number"
                            onChange={(e) =>
                              onChangeMaxTime(e.target.value, index)
                            }
                            min={0}
                          />
                        </div>
                        <div>
                          <a>Thời gian tối thiểu</a>
                          <Input
                            type="number"
                            onChange={(e) =>
                              onChangeMinTime(e.target.value, index)
                            }
                            min={0}
                          />
                        </div>
                        <div>
                          <a>Giá trị</a>
                          <Input
                            type="number"
                            onChange={(e) =>
                              onChangeValueTime(e.target.value, index)
                            }
                            min={0}
                          />
                        </div>

                        {index !== 0 ? (
                          <Button
                            className="btn-delete-punish"
                            onClick={() => deletePunish(index)}
                          >
                            Xoá
                          </Button>
                        ) : (
                          <></>
                        )}
                      </div>
                    );
                  })}
                  <Button className="btn-add-punish" onClick={addPunish}>
                    Thêm điều kiện
                  </Button>
                </div>
              </Col>
              <Col md={4}>
                <div>
                  <h5>Phạt tiền</h5>
                  {punishCash?.map((item, index) => {
                    return (
                      <div
                        className={
                          index !== 0 ? "div-ticket mt-3" : "div-ticket"
                        }
                        key={index}
                      >
                        <div>
                          <a>Thời gian tối đa</a>
                          <Input
                            type="number"
                            onChange={(e) =>
                              onChangeMaxTimeCash(e.target.value, index)
                            }
                            min={0}
                          />
                        </div>
                        <div>
                          <a>Thời gian tối thiểu</a>
                          <Input
                            type="number"
                            onChange={(e) =>
                              onChangeMinTimeCash(e.target.value, index)
                            }
                            min={0}
                          />
                        </div>
                        <div>
                          <a>Số tiền</a>
                          <Input
                            type="number"
                            onChange={(e) =>
                              onChangeValueCash(e.target.value, index)
                            }
                            min={0}
                          />
                        </div>

                        {index !== 0 ? (
                          <Button
                            className="btn-delete-punish"
                            onClick={() => deletePunishCash(index)}
                          >
                            Xoá
                          </Button>
                        ) : (
                          <></>
                        )}
                      </div>
                    );
                  })}
                  <Button className="btn-add-punish" onClick={addPunishCash}>
                    Thêm điều kiện
                  </Button>
                </div>
              </Col>
            </Row>

            <CustomButton
              title="Tạo"
              className="float-right btn-modal-add-reason"
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
