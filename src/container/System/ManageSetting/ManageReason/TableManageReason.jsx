import React, { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getReason } from "../../../../redux/selectors/reason";
import "./TableManageReason.scss";
import * as actions from "../../../../redux/actions/reason";
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
// import { deleteReason } from "../../../../api/reason";

export default function TableManageReason() {
  const [reason, setReason] = useState({
    title: "",
    description: "",
    punish_type: "",
    punish:"",
    apply_user:"",
    note:"",
  });
  const [modal, setModal] = React.useState(false);

  const dispatch = useDispatch();
  const reasons = useSelector(getReason);
  console.log("CHECK >>>>>>>>>>>>>>>>>>>>>>>",reasons);
  React.useEffect(() => {
    dispatch(actions.getReasons.getReasonsRequest());
  }, [dispatch]);

  // const onDelete = useCallback((id) => {
  //   deleteReason(id, { is_delete: true });
  // }, []);
  // Toggle for Modal
  const toggle = () => setModal(!modal);
  return (
    <>
      <Table className="align-items-center table-flush mt-5" responsive>
        <thead className="thead-light">
          <tr>
            <th scope="col">Lý do huỷ việc</th>
            <th scope="col">Mô tả</th>
            <th scope="col">Hình thức phạt (phạt tiền hoặc khoá app)</th>
            <th scope="col">Phạt tiền / Thời gian khoá app</th>
            <th scope="col">Đối tượng áp dụng</th>
            <th scope="col">Ghi chú</th>
            <th scope="col" />
          </tr>
        </thead>
        <tbody>
          { reasons &&reasons.length > 0 &&
            reasons.map((item, index) => {
              return (
                <tr key={index}>
                  <th scope="row" className="col-2">
                      <Media>
                        <span className="mb-0 text-sm">{item?.title.vi}</span>
                      </Media>
                  </th>
                  <td  className="col-2">
                    <a>{item?.description.vi}</a>
                  </td>
                  <td  className="col-1.5">
                    <a>{item?.punish_type}</a>
                  </td>
                  <td >
                    <a>{item?.punish}</a>
                  </td>
                  <td>
                    <a>{item?.apply_user}</a>
                  </td>
                  <td>
                    <a>{item?.note}</a>
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
