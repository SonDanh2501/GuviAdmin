import React, { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getCustomer } from "../../../../redux/selectors/customer";
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
import { deleteCustomer } from "../../../../api/customer";

export default function TableManageUser({ data, setItemEdit }) {
  const [customer, setCustomer] = useState({
    phone: "",
    email: "",
    name: "",
    default_address: "",
  });
  const [modal, setModal] = React.useState(false);
  const dispatch = useDispatch();

  const onDelete = useCallback((id) => {
    deleteCustomer(id, { is_delete: true });
  }, []);
  // Toggle for Modal
  const toggle = () => setModal(!modal);
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
          <button className="btn-edit" onClick={() => setItemEdit(data)}>
            <i className="uil uil-edit-alt"></i>
          </button>
          <button className="btn-delete" onClick={toggle}>
            <i className="uil uil-trash"></i>
          </button>
        </td>
      </tr>
    </>
  );
}
