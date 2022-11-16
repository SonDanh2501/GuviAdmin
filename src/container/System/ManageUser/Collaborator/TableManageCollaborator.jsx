import React, { useCallback } from "react";
import { useDispatch } from "react-redux";
import {
  Button,
  Media,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
} from "reactstrap";
import {
  activeCollaborator,
  deleteCollaborator,
} from "../../../../api/collaborator";
import "./TableManageCollaborator.scss";

export default function TableManageCollaborator({ data, setItemEdit }) {
  const [modal, setModal] = React.useState(false);
  const [modalBlock, setModalBlock] = React.useState(false);
  const dispatch = useDispatch();
  // Toggle for Modal
  const toggle = () => setModal(!modal);
  const toggleBlock = () => setModalBlock(!modalBlock);

  const onDelete = useCallback((id) => {
    deleteCollaborator(id, { is_delete: true })
      .then((res) => window.location.reload())
      .catch((err) => console.log(err));
  }, []);

  const blockCollaborator = useCallback((id, is_active) => {
    if (is_active === true) {
      activeCollaborator(id, { is_active: false })
        .then((res) => {
          setModalBlock(!modalBlock);
          window.location.reload();
        })
        .catch((err) => console.log(err));
    } else {
      activeCollaborator(id, { is_active: true })
        .then((res) => {
          setModalBlock(!modalBlock);
          window.location.reload();
        })
        .catch((err) => console.log(err));
    }
  }, []);

  return (
    <>
      <tr>
        <th scope="row">
          <Media className="align-items-center">
            <img alt="..." src={data?.avatar} className="img_customer" />
            <Media>
              <span className="mb-0 text-sm">{data?.name}</span>
            </Media>
          </Media>
        </th>
        <td>
          <a>{data?.email}</a>
        </td>
        <td>
          <a>{data?.phone}</a>
        </td>
        <td>
          <a>{data?.gennder}</a>
        </td>
        <td>
          <Row>
            <button className="btn-edit" onClick={() => setItemEdit(data)}>
              <i className="uil uil-edit-alt"></i>
            </button>
            <button className="btn-delete" onClick={toggle}>
              <i class="uil uil-trash-alt"></i>
            </button>
          </Row>
          <Row>
            {data?.is_active ? (
              <button className="btn-delete" onClick={toggleBlock}>
                <i class="uil uil-unlock"></i>
              </button>
            ) : (
              <button className="btn-delete" onClick={toggleBlock}>
                <i class="uil uil-padlock"></i>
              </button>
            )}
          </Row>
          <div>
            <Modal isOpen={modalBlock} toggle={toggleBlock}>
              <ModalHeader toggle={toggleBlock}>
                {" "}
                {data?.is_active === true
                  ? "Khóa tài khoản cộng tác viên"
                  : "Mở tài khoản cộng tác viên"}
              </ModalHeader>
              <ModalBody>
                {data?.is_active === true
                  ? "Bạn có muốn khóa tài khoản cộng tác viên"
                  : "Bạn có muốn kích hoạt tài khoản cộng tác viên"}
                <h3>{data?.name}</h3>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="primary"
                  onClick={() => blockCollaborator(data?._id, data?.is_active)}
                >
                  Có
                </Button>
                <Button color="#ddd" onClick={toggleBlock}>
                  Không
                </Button>
              </ModalFooter>
            </Modal>
          </div>

          <div>
            <Modal isOpen={modal} toggle={toggle}>
              <ModalHeader toggle={toggle}>Xóa cộng tác viên</ModalHeader>
              <ModalBody>
                Bạn có chắc muốn xóa cộng tác viên {data?.name} này không?
              </ModalBody>
              <ModalFooter>
                <Button color="primary" onClick={() => onDelete(data?._id)}>
                  Có
                </Button>
                <Button color="#ddd" onClick={toggle}>
                  Không
                </Button>
              </ModalFooter>
            </Modal>
          </div>
        </td>
      </tr>
    </>
  );
}
