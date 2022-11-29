import moment from "moment";
import React, { useCallback } from "react";
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
  const [modal, setModal] = React.useState(false);
  const [modalBlock, setModalBlock] = React.useState(false);
  const [modalEdit, setModalEdit] = React.useState(false);
  const [type, setType] = React.useState("");
  const [itemEdit, setItemEdit] = React.useState([]);
  const dispatch = useDispatch();
  // Toggle for Modal
  const toggle = () => setModal(!modal);
  const toggleBlock = () => setModalBlock(!modalBlock);

  // const onDelete = useCallback((id) => {
  //   deleteBanner(id, { is_delete: true })
  //     .then((res) => {
  //       window.location.reload();
  //     })
  //     .catch((err) => console.log(err));
  // }, []);

  // const blockBanner = useCallback((id, is_active) => {
  //   if (is_active === true) {
  //     activeBanner(id, { is_active: false })
  //       .then((res) => {
  //         setModalBlock(!modalBlock);
  //         window.location.reload();
  //       })
  //       .catch((err) => console.log(err));
  //   } else {
  //     activeBanner(id, { is_active: true })
  //       .then((res) => {
  //         setModalBlock(!modalBlock);

  //         window.location.reload();
  //       })
  //       .catch((err) => console.log(err));
  //   }
  // }, []);

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
        <td className="col-2">
          <span>{data?.phone}</span>
        </td>
        <td className="col-2">
          <span>
            {moment(new Date(data?.date_work)).format("DD/MM/yyy HH:mm")}
          </span>
        </td>
        {/* <td>
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
                {data?.is_active === true ? "Khóa banners" : "Mở banners"}
              </ModalHeader>
              <ModalBody>
                {data?.is_active === true
                  ? "Bạn có muốn khóa banner này"
                  : "Bạn có muốn kích hoạt banner này"}
                <h3>{data?.title}</h3>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="primary"
                  // onClick={() => blockBanner(data?._id, data?.is_active)}
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
              <ModalHeader toggle={toggle}>Xóa banner</ModalHeader>
              <ModalBody>
                Bạn có chắc muốn xóa banner {data?.title} này không?
              </ModalBody>
              <ModalFooter>
                <Button color="primary">Có</Button>
                <Button color="#ddd" onClick={toggle}>
                  Không
                </Button>
              </ModalFooter>
            </Modal>
          </div>
        </td> */}
      </tr>
    </>
  );
}
