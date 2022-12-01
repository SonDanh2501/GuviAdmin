import moment from "moment";
import React, { useCallback } from "react";
import { useDispatch } from "react-redux";
import {
  Button,
  Col,
  Media,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
} from "reactstrap";
import "./TableManageTopup.scss";
import { formatMoney } from "../../../helper/formatMoney";
import EditPopup from "../../../components/editTopup/editTopup";

export default function TableManageTopup({ data }) {
  const [modal, setModal] = React.useState(false);
  const [modalConfirm, setModalConfirm] = React.useState(false);
  const [modalEdit, setModalEdit] = React.useState(false);
  const [itemEdit, setItemEdit] = React.useState([]);

  const toggleConfirm = () => setModalConfirm(!modalConfirm);
  const toggleEdit = () => setModalEdit(!modalEdit);
  const toggle = () => setModal(!modal);

  const onConfirm = useCallback((id) => {}, []);

  return (
    <>
      <tr>
        <th scope="row" className="col-2">
          <Media>
            <span className="mb-0 text-sm">{data?.id_collaborator?.name}</span>
          </Media>
        </th>
        <td className="col-0.5">
          <a>{formatMoney(data?.money)}</a>
        </td>
        <td className="col-0.5">
          <a>{data?.withdraw}</a>
        </td>
        <td className="col-2">
          <span>{data?.transfer_note}</span>
        </td>
        <td className="col-2">
          <span>
            {moment(new Date(data?.date_created)).format("DD/MM/yyy HH:mm")}
          </span>
        </td>
        <td>
          <Row>
            {!data?.is_verify_money && (
              <button className="btn-confirm" onClick={toggleConfirm}>
                Duyệt lệnh
              </button>
            )}
            <button
              className="btn-edit"
              onClick={() => {
                toggleEdit();
                setItemEdit(data);
              }}
            >
              <i className="uil uil-edit-alt"></i>
            </button>

            <button className="btn-delete" onClick={toggle}>
              <i className="uil uil-trash"></i>
            </button>
          </Row>

          <div>
            <Modal isOpen={modalConfirm} toggle={toggleConfirm}>
              <ModalHeader toggle={toggleConfirm}>
                Duyệt lệnh nạp tiền
              </ModalHeader>
              <ModalBody>
                <>
                  <h4>Bạn có muốn duyệt lệnh nạp tiền cho :</h4>
                  <div className="body-modal">
                    <a>CTV: {data?.id_collaborator?.name}</a>
                    <a>SĐT: {data?.id_collaborator?.phone}</a>
                    <a>Số tiền: {formatMoney(data?.money)}</a>
                    <a>Nội dung: {data?.transfer_note}</a>
                  </div>
                </>
              </ModalBody>
              <ModalFooter>
                <Button color="primary" onClick={() => onConfirm(data?._id)}>
                  Có
                </Button>
                <Button color="#ddd" onClick={toggleConfirm}>
                  Không
                </Button>
              </ModalFooter>
            </Modal>
          </div>
          <div>
            <Modal isOpen={modal} toggle={toggle}>
              <ModalHeader toggle={toggle}>Xóa giao dịch</ModalHeader>
              <ModalBody>
                <a>
                  Bạn có chắc muốn xóa giao dịch của cộng tác viên
                  <a className="text-name-modal">
                    {data?.id_collaborator?.name}
                  </a>
                  này không?
                </a>
              </ModalBody>
              <ModalFooter>
                <Button color="primary">Có</Button>
                <Button color="#ddd" onClick={toggle}>
                  Không
                </Button>
              </ModalFooter>
            </Modal>
          </div>
          <div>
            <EditPopup
              item={itemEdit}
              state={modalEdit}
              setState={toggleEdit}
            />
          </div>
        </td>
      </tr>
    </>
  );
}
