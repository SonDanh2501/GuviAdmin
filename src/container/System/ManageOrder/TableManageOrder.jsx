import moment from "moment";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  Button,
  Media,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
} from "reactstrap";
import "./TableManageOrder.scss";
import { formatMoney } from "../../../helper/formatMoney";

export default function TableManageOrder({ data }) {
  const [status, setStatus] = useState("");
  useEffect(() => {
    switch (data?.status) {
      case "pending":
        setStatus("Đang chờ làm");
        break;
      case "confirm":
        setStatus("Đã nhận");
        break;
      case "doing":
        setStatus("Đang làm");
        break;
      case "done":
        setStatus("Kết thúc");
        break;
      case "cancel":
        setStatus("Đã huỷ");
        break;
      default:
        break;
    }
  }, [data]);

  const date = data?.date_work.slice(0, data?.date_work.indexOf("T"));
  const start = data?.date_work?.indexOf("T");
  const timeStart = data?.date_work?.slice(start + 1, start + 6);

  const timeEnd =
    Number(timeStart?.slice(0, 2)) +
    data?.total_estimate +
    timeStart?.slice(2, 5);

  const timeWork = (data) => {
    const start = data?.date_work?.indexOf("T");
    const timeStart = data?.date_work?.slice(start + 1, start + 6);

    const timeEnd =
      Number(timeStart?.slice(0, 2)) +
      data?.total_estimate +
      timeStart?.slice(2, 5);

    return timeStart + "-" + timeEnd;
  };

  return (
    <>
      <tr>
        <th scope="row" className="col-2">
          <Media>
            <span className="mb-0 text-sm">{data?.service?._id?.title.vi}</span>
          </Media>
        </th>
        <td className="col-0.5">
          <a>{data?.id_customer?.name}</a>
        </td>
        <td className="col-0.5">
          <a>{formatMoney(data?.final_fee)}</a>
        </td>
        <td className="col-0.5">
          <a>
            {!data?.id_collaborator ? "Chưa có" : data?.id_collaborator?.name}
          </a>
        </td>
        <td className="col-2">
          <span>{date}</span>
        </td>
        <td className="col-2">
          <span>{timeStart + " - " + timeEnd}</span>
        </td>
        <td className="col-2">
          <span
            style={{
              color:
                data?.status === "pending"
                  ? "orange"
                  : data?.status === "confirm"
                  ? "green"
                  : data?.status === "doing"
                  ? "greenyellow"
                  : "red",
            }}
          >
            {status}
          </span>
        </td>
      </tr>
    </>
  );
}
