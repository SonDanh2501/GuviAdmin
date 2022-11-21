import React, { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import "./TableManagePromotion.scss";

import {
  Button,
  Media,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "reactstrap";
import { deletePromotion } from "../../../../api/promotion";
import moment from "moment";
import { deletePromotionAction } from "../../../../redux/actions/promotion";
import EditPromotion from "../../../../components/editPromotion /editPromotion";

export default function TableManagePromotion({ data }) {
  const dispatch = useDispatch();
  const [modal, setModal] = useState(false);
  const [modalEdit, setModalEdit] = useState(false);
  const [itemEdit, setItemEdit] = useState([]);
  const toggle = () => setModal(!modal);
  const onDelete = useCallback((id) => {
    dispatch(deletePromotionAction.deletePromotionRequest(id));
  }, []);

  const startDate = moment(new Date(data?.limit_start_date)).format(
    "DD/MM/YYYY"
  );
  const endDate = moment(new Date(data?.limit_end_date)).format("DD/MM/YYYY");

  return (
    <>
      <tr>
        <th scope="row">
          <Media className="align-items-center">
            <img alt="..." src={data?.thumbnail} className="img_customer" />
            <Media>
              <span className="mb-0 text-sm">{data?.title.vi}</span>
            </Media>
          </Media>
        </th>
        <td>
          <a>{data?.code}</a>
        </td>
        <td>
          <a>{data?.is_limit_date ? startDate + "-" + endDate : null}</a>
        </td>
        <td className="text-right">
          <button
            className="btn-edit"
            onClick={() => {
              setModalEdit(!modalEdit);
              setItemEdit(data);
            }}
          >
            <i className="uil uil-edit-alt"></i>
          </button>
          <button className="btn-delete" onClick={toggle}>
            <i class="uil uil-trash"></i>
          </button>
          <div>
            <Modal isOpen={modal} toggle={toggle}>
              <ModalHeader toggle={toggle}>Xóa mã khuyến mãi</ModalHeader>
              <ModalBody>
                Bạn có chắc muốn xóa mã {data?.title?.vi} này không?
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
            <EditPromotion
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
