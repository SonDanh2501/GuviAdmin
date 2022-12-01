import React, { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getBanner } from "../../../../redux/selectors/banner";
import "./TableManageBanner.scss";
import * as actions from "../../../../redux/actions/banner";
import {
  Table,
  Row,
  Media,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Card,
  CardImg,
  UncontrolledDropdown,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
} from "reactstrap";
import { activeBanner, deleteBanner } from "../../../../api/banner";
import EditBanner from "../../../../components/editBanner/editBanner";
import { loadingAction } from "../../../../redux/actions/loading";

export default function TableManageBanner({ data }) {
  const [modal, setModal] = React.useState(false);
  const [modalBlock, setModalBlock] = React.useState(false);
  const [modalEdit, setModalEdit] = React.useState(false);
  const [itemEdit, setItemEdit] = React.useState([]);
  const dispatch = useDispatch();
  // Toggle for Modal
  const toggle = () => setModal(!modal);
  const toggleBlock = () => setModalBlock(!modalBlock);

  const onDelete = useCallback((id) => {
    dispatch(loadingAction.loadingRequest(true));
    deleteBanner(id, { is_delete: true })
      .then((res) => {
        window.location.reload();
      })
      .catch((err) => console.log(err));
  }, []);

  const blockBanner = useCallback((id, is_active) => {
    dispatch(loadingAction.loadingRequest(true));
    if (is_active === true) {
      activeBanner(id, { is_active: false })
        .then((res) => {
          setModalBlock(!modalBlock);
          window.location.reload();
        })
        .catch((err) => console.log(err));
    } else {
      activeBanner(id, { is_active: true })
        .then((res) => {
          setModalBlock(!modalBlock);

          window.location.reload();
        })
        .catch((err) => console.log(err));
    }
  }, []);

  return (
    <>
      <tr>
        <th scope="row" className="col-2">
          <Media>
            <span className="mb-0 text-sm">{data?.title}</span>
          </Media>
        </th>
        <td className="col-0.5">
          <a>{data?.type_link}</a>
        </td>
        <td className="col-0.5">
          <a>{data?.position}</a>
        </td>
        <td className="col-2">
          <span>{data?.link_id}</span>
        </td>
        <td>
          <img src={data?.image} className="img_banner" />
        </td>

        <td>
          <UncontrolledDropdown>
            <DropdownToggle href="#pablo" role="button" size="sm">
              <i class="uil uil-ellipsis-v"></i>
            </DropdownToggle>
            <DropdownMenu className="dropdown-menu-arrow">
              <DropdownItem
                href="#pablo"
                onClick={() => {
                  setItemEdit(data);
                  setModalEdit(!modalEdit);
                }}
              >
                Chỉnh sửa
              </DropdownItem>
              <DropdownItem href="#pablo" onClick={toggle}>
                Xóa
              </DropdownItem>
              <DropdownItem href="#pablo" onClick={toggleBlock}>
                {data?.is_active ? " Chặn" : " Kích hoạt"}
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
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
                  onClick={() => blockBanner(data?._id, data?.is_active)}
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
                <a>
                  Bạn có chắc muốn xóa banner{" "}
                  <a className="text-name-modal">{data?.title}</a> này không?
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
            <EditBanner
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
