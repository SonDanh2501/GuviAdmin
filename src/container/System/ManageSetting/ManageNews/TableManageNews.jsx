import React, { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";

import "./TableManageNews.scss";

import {
  Table,
  Card,
  CardImg,
  Row,
  Media,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import { activeNew, deleteNew } from "../../../../api/news";
import EditNews from "../../../../components/editNews/editNews";
import { loadingAction } from "../../../../redux/actions/loading";

export default function TableManageNews({ data }) {
  const [modal, setModal] = React.useState(false);
  const [modalBlock, setModalBlock] = React.useState(false);
  const [modalEdit, setModalEdit] = React.useState(false);
  const [itemEdit, setItemEdit] = React.useState([]);
  const toggle = () => setModal(!modal);
  const toggleBlock = () => setModalBlock(!modalBlock);
  const dispatch = useDispatch();

  const onDelete = useCallback((id) => {
    dispatch(loadingAction.loadingRequest(true));
    deleteNew(id)
      .then((res) => {
        window.location.reload();
      })
      .catch((err) => console.log(err));
  }, []);

  const blockNew = useCallback((id, is_active) => {
    dispatch(loadingAction.loadingRequest(true));
    if (is_active === true) {
      activeNew(id, { is_active: false })
        .then((res) => {
          setModalBlock(!modalBlock);
          window.location.reload();
        })
        .catch((err) => console.log(err));
    } else {
      activeNew(id, { is_active: true })
        .then((res) => {
          setModalBlock(!modalBlock);
          window.location.reload();
        })
        .catch((err) => console.log(err));
    }
  }, []);

  return (
    <>
      <tr className="table">
        <th scope="row" className="col-2">
          <Media>
            <span className="mb-0 text-sm">{data?.title}</span>
          </Media>
        </th>
        <td className="col-2">
          {/* <a>{data?.short_description}</a> */}
          <Media>
            <span className="mb-0 text-sm">{data?.short_description}</span>
          </Media>
        </td>
        <td className="col-2">
          <Media>
            <span className="mb-0 text-sm">{data?.url}</span>
          </Media>
        </td>

        <td className="col-1">
          <span>{data?.type}</span>
        </td>
        <td>
          <img src={data?.thumbnail} className="thumbnail" />
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
                {data?.is_active === true ? "Khóa bài viết" : "Mở bài viết"}
              </ModalHeader>
              <ModalBody>
                {data?.is_active === true
                  ? "Bạn có muốn khóa bài viết này"
                  : "Bạn có muốn kích hoạt bài viết này"}
                <h3>{data?.title}</h3>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="primary"
                  onClick={() => blockNew(data?._id, data?.is_active)}
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
              <ModalHeader toggle={toggle}>Xóa bài viết</ModalHeader>
              <ModalBody>
                Bạn có chắc muốn xóa bài viết {data?.title} này không?
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
            <EditNews
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
