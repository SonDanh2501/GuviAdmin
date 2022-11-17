import React, { useCallback } from "react";
import { useDispatch } from "react-redux";
import {
  Button,
  Col,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
} from "reactstrap";
import { activeBanner, deleteBanner } from "../../../../api/banner";
import { deleteGroupServiceApi } from "../../../../api/service";
import "./TableManageGroupService.scss";

export default function TableManageGroupService({ data, setItemEdit }) {
  const [modal, setModal] = React.useState(false);
  const [modalBlock, setModalBlock] = React.useState(false);
  const dispatch = useDispatch();
  // Toggle for Modal
  const toggle = () => setModal(!modal);
  const toggleBlock = () => setModalBlock(!modalBlock);

  const onDelete = useCallback((id) => {
    deleteGroupServiceApi(id)
      .then((res) => {
        window.location.reload();
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <>
      <tr>
        <td>
          <img alt="..." src={data?.thumbnail} className="img_customer" />
        </td>
        <td>
          <Col>
            <a>{data?.title.vi}</a>
          </Col>
        </td>
        <td>
          <a>{data?.type}</a>
        </td>
        <td>
          <Row>
            <button className="btn-edit" onClick={() => setItemEdit(data)}>
              <i className="uil uil-edit-alt"></i>
            </button>
            <button className="btn-delete" onClick={toggle}>
              <i className="uil uil-trash"></i>
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
            <Modal isOpen={modal} toggle={toggle}>
              <ModalHeader toggle={toggle}>Xóa GroupService</ModalHeader>
              <ModalBody>
                Bạn có chắc muốn xóa GroupService {data?.title?.vi} này không?
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
