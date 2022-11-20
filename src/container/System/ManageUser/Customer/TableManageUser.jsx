import React, { useState, useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";
import "./TableManageUser.scss";
import * as actions from "../../../../redux/actions/customerAction";
import {
  Table,
  Row,
  Media,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "reactstrap";
import { activeCustomer } from "../../../../api/customer";
import EditCustomer from "../../../../components/editCustomer/editCustomer";

export default function TableManageUser({ data }) {
  const [itemEdit, setItemEdit] = useState([]);
  const [modal, setModal] = useState(false);
  const [modalBlock, setModalBlock] = useState(false);
  const [modalEdit, setModalEdit] = useState(false);
  const dispatch = useDispatch();
  // Toggle for Modal
  const toggle = () => setModal(!modal);
  const toggleBlock = () => setModalBlock(!modalBlock);
  const onDelete = useCallback((id) => {
    dispatch(
      actions.deleteCustomerAction.deleteCustomerRequest({
        id: id,
        data: { is_delete: true },
      })
    );
  }, []);

  const blockCustomer = useCallback((id, is_active) => {
    if (is_active === true) {
      activeCustomer(id, { is_active: false })
        .then((res) => {
          setModalBlock(!modalBlock);
          window.location.reload();
        })
        .catch((err) => console.log(err));
    } else {
      activeCustomer(id, { is_active: true })
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
          <a>{data?.phone}</a>
        </td>
        <td>
          <a>{data?.email}</a>
        </td>
        <td>
          <a>{data?.birth_date}</a>
        </td>
        <td>
          <Row>
            <button
              className="btn-edit"
              onClick={() => {
                setItemEdit(data);
                setModalEdit(!modalEdit);
              }}
            >
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
            <Modal isOpen={modalBlock} toggle={toggleBlock}>
              <ModalHeader toggle={toggleBlock}>
                {" "}
                {data?.is_active === true
                  ? "Khóa tài khoản khách hàng"
                  : "Mở tài khoản khách hàng"}
              </ModalHeader>
              <ModalBody>
                {data?.is_active === true
                  ? "Bạn có muốn khóa tài khoản khách hàng"
                  : "Bạn có muốn kích hoạt tài khoản khách hàng"}
                <h3>{data?.name}</h3>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="primary"
                  onClick={() => blockCustomer(data?._id, data?.is_active)}
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
              <ModalHeader toggle={toggle}>Xóa người dùng</ModalHeader>
              <ModalBody>
                Bạn có chắc muốn xóa người dùng {data?.name} này không?
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
          <div>
            <EditCustomer
              state={modalEdit}
              setState={() => setModalEdit(!modalEdit)}
              data={itemEdit}
            />
          </div>
        </td>
      </tr>
    </>
  );
}
