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

import {
  activeGroupServiceApi,
  deleteServiceApi,
} from "../../../../api/service";
import "./TableManageService.scss";

export default function TableManageService({ data }) {
  const [modal, setModal] = React.useState(false);
  const [modalBlock, setModalBlock] = React.useState(false);
  const [modalEdit, setModalEdit] = React.useState(false);
  const [itemEdit, setItemEdit] = React.useState(false);
  const dispatch = useDispatch();
  // Toggle for Modal
  const toggle = () => setModal(!modal);
  const toggleBlock = () => setModalBlock(!modalBlock);

  const onDelete = useCallback((id) => {
    deleteServiceApi(id)
      .then((res) => {
        window.location.reload();
      })
      .catch((err) => console.log(err));
  }, []);

  const blockGroupService = useCallback((id, is_active) => {
    if (is_active === true) {
      activeGroupServiceApi(id, { is_active: false })
        .then((res) => {
          setModalBlock(!modalBlock);
          window.location.reload();
        })
        .catch((err) => console.log(err));
    } else {
      activeGroupServiceApi(id, { is_active: true })
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
            {/* <button
              className="btn-edit"
              onClick={() => {
                setItemEdit(data);
                setModalEdit(!modalEdit);
              }}
            >
              <i className="uil uil-edit-alt"></i>
            </button> */}
            <button className="btn-delete" onClick={toggle}>
              <i className="uil uil-trash-alt icon-delete"></i>
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
                  ? "Khóa GroupService"
                  : "Mở GroupService"}
              </ModalHeader>
              <ModalBody>
                {data?.is_active === true
                  ? "Bạn có muốn khóa GroupService"
                  : "Bạn có muốn kích hoạt GroupService này"}
                <h3>{data?.full_name}</h3>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="primary"
                  onClick={() => blockGroupService(data?._id, data?.is_active)}
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
              <ModalHeader toggle={toggle}>Xóa Service</ModalHeader>
              <ModalBody>
                Bạn có chắc muốn xóa Service {data?.title?.vi} này không?
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
          {/* <div>
            <EditGroupService
              state={modalEdit}
              setState={() => setModalEdit(!modalEdit)}
              data={itemEdit}
            />
          </div> */}
        </td>
      </tr>
    </>
  );
}
