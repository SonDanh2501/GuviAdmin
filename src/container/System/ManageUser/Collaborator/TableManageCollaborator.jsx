import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getCollaborator } from "../../../../redux/selectors/collaborator";
import "./TableManageCollaborator.scss";
import * as actions from "../../../../redux/actions/collaborator";
import { Table, Row } from "reactstrap";

export default function TableManageCollaborator() {
  const [collaborator, setCollaborator] = useState({
    phone: "",
    email: "",
    name: "",
    birthday: "",
  });
  const dispatch = useDispatch();
  const collaborators = useSelector(getCollaborator);

  React.useEffect(() => {
    dispatch(actions.getCollaborators.getCollaboratorsRequest());
  }, [dispatch]);

  return (
    <>
      <Table className="table-manage-collaborator mt-5">
        <thead>
          <tr>
            <th>Email</th>
            <th>Tên cộng tác viên</th>
            <th>SĐT</th>
            <th>Ngày sinh</th>
            <th>Giới tính</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {collaborators &&
            collaborators.length > 0 &&
            collaborators.map((item, index) => {
              return (
                <tr key={index}>
                  <td> {item?.email}</td>
                  <td> {item?.name}</td>
                  <td> {item?.phone}</td>
                  <td> {item?.birthday}</td>
                  <td>
                    {item?.gender === "male"
                      ? "Nam"
                      : item?.gender === "female"
                      ? "Nữ"
                      : "Khác"}
                  </td>
                  <td>
                    <button className="btn-edit">
                      <i className="uil uil-edit-alt "></i>
                    </button>
                    <button className="btn-delete">
                      <i class="uil uil-trash"></i>
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
