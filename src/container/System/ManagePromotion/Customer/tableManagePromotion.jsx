import React, { useCallback } from "react";
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

export default function TableManagePromotion({ data, setId }) {
  const dispatch = useDispatch();
  const [modal, setModal] = React.useState(false);
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
<<<<<<< Updated upstream
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
          <button className="btn-edit" onClick={() => setId(data?._id)}>
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
        </td>
      </tr>
=======
      <Table className="align-items-center table-flush mt-5" responsive>
        <thead className="thead-light">
          <tr>
            <th scope="col">Tên Promotion</th>
            <th scope="col">Mã code</th>
            <th scope="col">Hạn</th>
            <th scope="col" />
          </tr>
        </thead>
        <tbody>
          {promotion &&
            promotion.length > 0 &&
            promotion.map((item, index) => {
              const dateEnd = moment(new Date(item?.limit_end_date)).format(
                "DD/MM/YYYY"
              );
              const dateStart = moment(new Date(item?.limit_start_date)).format(
                "DD/MM/YYYY"
              );
              return (
                <tr key={index}>
                  <th scope="row">
                    <Media className="align-items-center">
                      <img
                        alt="..."
                        src={item?.thumbnail}
                        className="img_customer"
                      />
                      <Media>
                        <span className="mb-0 text-sm">{item?.title.vi}</span>
                      </Media>
                    </Media>
                  </th>
                  <td>
                    <a>{item?.code}</a>
                  </td>
                  <td>
                    <a>
                      {item?.is_limit_date ? dateStart + "-" + dateEnd : null}
                    </a>
                  </td>
                  <td>
                    <button className="btn-edit">
                      <i className="uil uil-edit-alt"></i>
                    </button>
                    <button className="btn-delete">
                      <i className="uil uil-trash"></i>
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => setCreate(!create)}
                    >
                      <i className="uil uil-plus"></i>
                    </button>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </Table>
>>>>>>> Stashed changes
    </>
  );
}
