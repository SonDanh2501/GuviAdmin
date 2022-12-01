import React, { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import "./TableManagePromotion.scss";

import {
  Button,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Media,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  UncontrolledDropdown,
} from "reactstrap";
import { deletePromotion } from "../../../../api/promotion";
import moment from "moment";
import { deletePromotionAction } from "../../../../redux/actions/promotion";
import { loadingAction } from "../../../../redux/actions/loading";
import EditPromotion from "../../../../components/editPromotion /editPromotion";

export default function TableManagePromotion({ data }) {
  const dispatch = useDispatch();
  const [modal, setModal] = useState(false);
  const [modalEdit, setModalEdit] = useState(false);
  const [itemEdit, setItemEdit] = useState([]);
  const toggle = () => setModal(!modal);
  const onDelete = useCallback((id) => {
    dispatch(loadingAction.loadingRequest(true));
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
          <UncontrolledDropdown>
            <DropdownToggle href="#pablo" role="button" size="sm">
              <i class="uil uil-ellipsis-v"></i>
            </DropdownToggle>
            <DropdownMenu className="dropdown-menu-arrow">
              <DropdownItem
                href="#pablo"
                onClick={() => {
                  setModalEdit(!modalEdit);
                  setItemEdit(data);
                }}
              >
                Chỉnh sửa
              </DropdownItem>
              <DropdownItem href="#pablo" onClick={toggle}>
                Xóa
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
          <div>
            <Modal isOpen={modal} toggle={toggle}>
              <ModalHeader toggle={toggle}>Xóa mã khuyến mãi</ModalHeader>
              <ModalBody>
                <a>
                  Bạn có chắc muốn xóa mã khuyến mãi{" "}
                  <a className="text-name-modal">{data?.title?.vi}</a> này
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
