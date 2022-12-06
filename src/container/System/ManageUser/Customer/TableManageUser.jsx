import React, { useState, useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";
import "./TableManageUser.scss";
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
import { activeCustomer } from "../../../../api/customer";
import EditCustomer from "../../../../components/editCustomer/editCustomer";
import { deleteCustomerAction } from "../../../../redux/actions/customerAction";
import { loadingAction } from "../../../../redux/actions/loading";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { formatMoney } from "../../../../helper/formatMoney";

export default function TableManageUser({ data }) {
  const [itemEdit, setItemEdit] = useState([]);
  const [modal, setModal] = useState(false);
  const [modalBlock, setModalBlock] = useState(false);
  const [modalEdit, setModalEdit] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // Toggle for Modal
  const toggle = () => setModal(!modal);
  const toggleBlock = () => setModalBlock(!modalBlock);
  const onDelete = useCallback((id) => {
    dispatch(loadingAction.loadingRequest(true));
    dispatch(
      deleteCustomerAction.deleteCustomerRequest({
        id: id,
        data: { is_delete: true },
      })
    );
  }, []);

  const blockCustomer = useCallback((id, is_active) => {
    dispatch(loadingAction.loadingRequest(true));
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
  const phone = data?.phone.slice(0, 7);

  return (
    <>
      <tr>
        <th
          scope="row"
          onClick={() =>
            navigate("/system/user-manage/details-customer", {
              state: { data: data },
            })
          }
        >
          <Media className="align-items-center">
            <img alt="..." src={data?.avatar} className="img_customer" />
            <Media>
              <span className="mb-0 text-sm">{data?.name}</span>
            </Media>
          </Media>
        </th>
        <td>
          <a>{phone + "***"}</a>
        </td>
        <td className="default_address">
          <a>{!data?.default_address ? "Chưa có" : data?.default_address}</a>
        </td>
        <td>
          <a>{data?.totalService}</a>
        </td>
        <td>
          <button
            className="btn-service"
            onClick={() => {
              console.log("eee");
            }}
          >
            {data?.totalService}
          </button>
        </td>
        <td>
          <a>{formatMoney(data?.total_price)}</a>
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
                <a>
                  Bạn có chắc muốn xóa người dùng{" "}
                  <a className="text-name-modal">{data?.name}</a> này không?
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
