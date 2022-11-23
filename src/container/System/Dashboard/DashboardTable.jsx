import {
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  Media,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "reactstrap";
import React from "react";

const HomeObj = (data) => {
  const [modal, setModal] = React.useState(false);

  // Toggle for Modal
  const toggle = () => setModal(!modal);
  return (
    <tr>
      <th scope="row">
        <Media className="align-items-center">
          <span className="mb-0 text-sm">{data?.name}</span>
        </Media>
      </th>
      <td>
        <a style={{ width: 100 }}>{data?.service}</a>
      </td>
      <td>
        <a style={{ width: 100 }}>{data?.time}</a>
      </td>
      <td>
        <a style={{ width: 100 }}>{data?.address}</a>
      </td>
      <td>
        <a style={{ width: 100 }}>{data?.progress}</a>
      </td>
      <td className="text-right">
        <button className="btn-delete" onClick={toggle}>
          <i className="uil uil-trash"></i>
        </button>
      </td>
    </tr>
  );
};
export default HomeObj;
