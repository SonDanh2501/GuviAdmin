import { Modal } from "antd";

const ModalCustom = (props) => {
  const { title, isOpen, textOk, handleOk, handleCancel, body } = props;

  return (
    <div>
      <Modal
        title={title}
        open={isOpen}
        okText={textOk}
        onOk={handleOk}
        onCancel={handleCancel}
        cancelText="Huỷ"
      >
        {body}
      </Modal>
    </div>
  );
};

export default ModalCustom;
