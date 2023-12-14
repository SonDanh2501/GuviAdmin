import React, { memo, useState, useEffect } from 'react';
import { Input, Modal, Button, Checkbox, DatePicker } from 'antd';
import './index.scss'
import { OPTIONS_SELECT_STATUS_COLLABORATOR } from '../../../../@core/constant/constant';
import InputCustom from "../../../../components/textInputCustom/index.jsx";

const { TextArea } = Input;
const ModalNoteAdmin = (props) => {
  const {
    isShow,
    item
  } = props;
  const [noteAdmin, setNoteAdmin] = useState("");
  const [currentStatus, setCurrentStatus] = useState({});
  const [updateStatus, setUpdateStatus] = useState({});
  const [timeValue, setTimeValue] = useState("");
  const [checkLock, setCheckLock] = useState(false);



  useEffect(() => {
    if (item !== null) {
      // setNoteAdmin(item.note_admin)
      const getItemStatus = OPTIONS_SELECT_STATUS_COLLABORATOR.filter(a => a.value === item.status_collaborator);
      setCurrentStatus(getItemStatus[0])
      setUpdateStatus(getItemStatus[0])
      if(item.date_lock !== null) { 

       const date = new Date (item.date_lock)
       date.setHours(date.getHours() + 7);
       const newTime = date.toISOString();

        setTimeValue(newTime.slice(0, 16));
        setCheckLock(true)
      }
    }
  }, [item])

  const handleOk = () => {

    // console.log(timeValue, 'timeValue');

    // item.note_handle_admin = noteAdmin
    item.status_collaborator = updateStatus.value;
    item.date_lock = (checkLock === true) ? new Date(timeValue).toISOString() : null;
    // item.date_lock = (checkLock === true) ? timeValue : null;
    setTimeValue("")
    setCheckLock(false);

    if (props.handleOk) {
      props.handleOk(item)
    }
  };

  const handleCancel = () => {
    setTimeValue("")
    setCheckLock(false);
    if (props.handleCancel) {
      props.handleCancel("")
    }
  };

  const onChangeText = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNoteAdmin(e.target.value)
  };

  const changeStatus = (item) => {
    if(item.disableSelect === true) return;
    setUpdateStatus(item)
  }

  const changeDate = (value) => {
    console.log(value, "value");
  }


  return (
    <>
      <Modal title="Cập nhật ghi chú"
        width={1000}
        onCancel={handleCancel}
        open={isShow}
        footer={[
          <Button
            style={{ alignItems: "center", width: "auto" }}
            onClick={handleCancel}>
            Huỷ
          </Button>,
          <Button
            type="primary"
            style={{ alignItems: "center", width: "auto" }}
            onClick={handleOk}>
            Cập nhật
          </Button>,
        ]}>




        <div className='div-current-status-handle'>
          <span>Trạng thái hiện tại</span>
          <div className={`current-status-handle ${currentStatus?.className}`}>
            <p>{currentStatus.label}</p>
          </div>
        </div>

        <div className='card-status-handle-review'>
          {OPTIONS_SELECT_STATUS_COLLABORATOR.map((item) => (
            <div className={`item-card-status-handle-review ${(item?.value === updateStatus?.value) ? item.className : ""} ${(item?.disableSelect === true) ? "status-disable" : ""}`}
              onClick={() => changeStatus(item)}>
              <p>{item.label}</p>
            </div>
          ))}
        </div>

        {/* <p>Ghi chú (nội dung này sẽ không hiển thị cho cả CTV lẫn khách hàng)</p>
        <TextArea allowClear rows={8} value={noteAdmin} onChange={onChangeText} /> */}


        {updateStatus.value === "lock" && (
          <>
            <Checkbox
              checked={checkLock}
              onChange={(e) => {
                const date = new Date();
                date.setHours(date.getHours() + 7);
                const newTime = date.toISOString();
                setTimeValue(newTime.slice(0, 16));
                setCheckLock(e.target.checked)
              }}
            >
              {`Khoá theo thời gian (nếu không chọn sẽ khoá vĩnh viễn)`}
            </Checkbox>
            {checkLock && (
              <InputCustom
                title={`Khoá CTV`}
                type="datetime-local"
                className="text-input"
                value={timeValue}
                onChange={(e) => setTimeValue(e.target.value)}
              />


            //   <DatePicker
            //   format="HH:mm DD-MM-YYYY"
            //   showTime={{ defaultValue: new Date() }}
            //   onChange={(e) => changeDate(e.target.value)}
            // />


            )}
          </>
        )}
      </Modal>
    </>
  )


}

export default memo(ModalNoteAdmin);