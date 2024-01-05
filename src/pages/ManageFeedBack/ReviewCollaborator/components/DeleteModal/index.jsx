import React, { memo, useState, useEffect } from "react";
import { Input, Modal } from "antd";
const { TextArea } = Input;
const ModalDelete = (props) => {
  const { isShow, value } = props;
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // console.log(value, 'value');
    setIsModalOpen(isShow);
    // console.log(isShow, 'isShow');
    // console.log(isModalOpen, 'isModalOpen');
  }, [isShow]);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
    if (props.detectClose) {
      props.detectClose("");
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    if (props.detectClose) {
      props.detectClose("");
    }
  };

  return (
    <>
      <Modal
        title="Xác nhận xoá"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <p>Bạn có chắc muốn xoá phản hồi đơn </p>
        <TextArea rows={4} value={value} />
      </Modal>
    </>
  );
};

export default memo(ModalDelete);
