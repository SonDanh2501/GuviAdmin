import React, { useState, useEffect, useCallback } from "react";
import "./TableManageReason.scss";

import {
  Table,
  Row,
  Media,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import { formatMoney } from "../../../../helper/formatMoney";
import { useDispatch } from "react-redux";
import { loadingAction } from "../../../../redux/actions/loading";
import { activeReason, deleteReason } from "../../../../api/reasons";
import EditReason from "../../../../components/editReason/editReason";

export default function TableManageReason({ data }) {
  const [modal, setModal] = React.useState(false);
  const [modalEdit, setModalEdit] = React.useState(false);
  const [modalBlock, setModalBlock] = React.useState(false);
  const [itemEdit, setItemEdit] = React.useState();
  const toggle = () => setModal(!modal);
  const toggleBlock = () => setModalBlock(!modalBlock);
  const dispatch = useDispatch();

  const onDelete = useCallback((id) => {
    dispatch(loadingAction.loadingRequest(true));
    deleteReason(id, { is_delete: true })
      .then((res) => {
        window.location.reload();
      })
      .catch((err) => console.log(err));
  }, []);

  const blockReason = useCallback((id, is_active) => {
    dispatch(loadingAction.loadingRequest(true));
    if (is_active === true) {
      activeReason(id, { is_active: false })
        .then((res) => {
          setModalBlock(!modalBlock);
          window.location.reload();
        })
        .catch((err) => console.log(err));
    } else {
      activeReason(id, { is_active: true })
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
        <th scope="row" className="col-2">
          <Media>
            <span className="mb-0 text-sm">{data?.title.vi}</span>
          </Media>
        </th>
        <td className="col-2">
          <a>{data?.description.vi}</a>
        </td>
        <td className="col-1.5">
          <a>{data?.punish_type}</a>
        </td>
        <td>
          <a>
            {data?.punish_type === "cash"
              ? formatMoney(data?.punish)
              : data?.punish / (60 * 1000)}
          </a>
        </td>
        <td>
          <a>{data?.apply_user}</a>
        </td>
        <td>
          <a>{data?.note}</a>
        </td>
        <td>
          <UncontrolledDropdown>
            <DropdownToggle href="#pablo" role="button" size="sm">
              <i class="uil uil-ellipsis-v"></i>
            </DropdownToggle>
            <DropdownMenu className="dropdown-menu-arrow">
              <DropdownItem
                href="#pablo"
                onClick={() => {
                  setItemEdit(data);
                  setModalEdit(!modalEdit);
                }}
              >
                Chỉnh sửa
              </DropdownItem>
              <DropdownItem href="#pablo" onClick={toggle}>
                Xóa
              </DropdownItem>
              <DropdownItem href="#pablo" onClick={toggleBlock}>
                {data?.is_active ? " Chặn" : " Kích hoạt"}
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
          <div>
            <Modal isOpen={modalBlock} toggle={toggleBlock}>
              <ModalHeader toggle={toggleBlock}>
                {" "}
                {data?.is_active === true
                  ? "Khóa lí do huỷ việc"
                  : "Mở lí do huỷ việc"}
              </ModalHeader>
              <ModalBody>
                {data?.is_active === true
                  ? "Bạn có muốn khóa lí do huỷ việc này"
                  : "Bạn có muốn kích hoạt lí do huỷ việc này"}
                <h3>{data?.title?.vi}</h3>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="primary"
                  onClick={() => blockReason(data?._id, data?.is_active)}
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
              <ModalHeader toggle={toggle}>Xóa lí do huỷ việc</ModalHeader>
              <ModalBody>
                <a>
                  Bạn có chắc muốn xóa lí do{" "}
                  <a className="text-name-modal"> {data?.title?.vi} </a>này
                  không?
                </a>
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
            <EditReason
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
