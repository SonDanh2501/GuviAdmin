import React, { memo, useState, useEffect } from 'react';
import { Input, Modal, Button } from 'antd';
import { OPTIONS_SELECT_STATUS_HANDLE_REVIEW } from "../../../../../@core/constant/constant"
import './index.scss'

const { TextArea } = Input;
const ModalNoteAdmin = (props) => {
  const {
    isShow,
    item
  } = props;
  const [noteAdmin, setNoteAdmin] = useState("");
  const [currentStatus, setCurrentStatus] = useState({});
  const [updateStatus, setUpdateStatus] = useState({});



  useEffect(() => {
    if (item !== null) {
      setNoteAdmin(item.note_admin)
      const getItemStatus = OPTIONS_SELECT_STATUS_HANDLE_REVIEW.filter(a => a.value === item.status_handle_review);
      setCurrentStatus(getItemStatus[0])
      setUpdateStatus(getItemStatus[0])
    }
  }, [item])

  const handleOk = () => {
    item.note_admin = noteAdmin
    item.status_handle_review = updateStatus.value
    if (props.handleOk) {
      props.handleOk(item)
    }
  };

  const handleCancel = () => {
    if (props.handleCancel) {
      props.handleCancel("")
    }
  };

  const onChangeText = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNoteAdmin(e.target.value)
  };

  const changeStatus = (item) => {
    setUpdateStatus(item)
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
          {OPTIONS_SELECT_STATUS_HANDLE_REVIEW.map((item) => (
            <div className={`item-card-status-handle-review ${(item?.value === updateStatus?.value) ? item.className : ""}`}
              onClick={() => changeStatus(item)}>
              <p>{item.label}</p>
            </div>
          ))}
        </div>

        <p>Ghi chú (nội dung này sẽ không hiển thị cho cả CTV lẫn khách hàng)</p>
        <TextArea allowClear rows={8} value={noteAdmin} onChange={onChangeText} />
      </Modal>
    </>
  )


}

export default memo(ModalNoteAdmin);