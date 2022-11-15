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

export default function TableManageUser() {
  const [customer, setCustomer] = useState({
    phone: "",
    email: "",
    name: "",
    default_address: "",
  });
  const [modal, setModal] = React.useState(false);

  const dispatch = useDispatch();
  const customers = useSelector(getCustomer);
  React.useEffect(() => {
    dispatch(actions.getCustomers.getCustomersRequest());
  }, [dispatch]);

  const onDelete = useCallback((id) => {
    deleteCustomer(id, { is_delete: true });
  }, []);
  // Toggle for Modal
  const toggle = () => setModal(!modal);
  return (
    <>
      <Table className="align-items-center table-flush mt-5" responsive>
        <thead className="thead-light">
          <tr>
            <th scope="col">Tên người dùng</th>
            <th scope="col">SĐT</th>
            <th scope="col">Email</th>
            <th scope="col">Ngày sinh</th>
            <th scope="col" />
          </tr>
        </thead>
        <tbody>
          {customers && customers.length > 0 &&
            customers.map((item, index) => {
              return (
                <tr key={index}>
                  <th scope="row">
                    <Media className="align-items-center">
                      <img
                        alt="..."
                        src={item?.avatar}
                        className="img_customer"
                      />
                      <Media>
                        <span className="mb-0 text-sm">{item?.name}</span>
                      </Media>
                    </Media>
                  </th>
                  <td>
                    <a>{item?.phone}</a>
                  </td>
                  <td>
                    <a>{item?.email}</a>
                  </td>
                  <td>
                    <a>{item?.birth_date}</a>
                  </td>
                  <td>
                    <button className="btn-edit">
                      <i className="uil uil-edit-alt"></i>
                    </button>
                    <button className="btn-delete" onClick={toggle}>
                      <i className="uil uil-trash"></i>
                    </button>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </Table>
    </>
  );
}
