import { Modal } from "antd";
import { useSelector } from "react-redux";
import { getLanguageState } from "../../redux/selectors/auth";
import i18n from "../../i18n";

const ModalCustom = (props) => {
  const lang = useSelector(getLanguageState);
  const { title, isOpen, textOk, handleOk, handleCancel, body } = props;

  return (
    <div>
      <Modal
        title={title}
        open={isOpen}
        okText={textOk}
        onOk={handleOk}
        onCancel={handleCancel}
        cancelText={`${i18n.t("cancel_modal", { lng: lang })}`}
      >
        {body}
      </Modal>
    </div>
  );
};

export default ModalCustom;
