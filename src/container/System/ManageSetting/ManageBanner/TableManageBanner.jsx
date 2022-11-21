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
} from "reactstrap";
import { activeBanner, deleteBanner } from "../../../../api/banner";
import EditBanner from "../../../../components/editBanner/editBanner";

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
    deleteBanner(id, { is_delete: true })
      .then((res) => {
        window.location.reload();
      })
      .catch((err) => console.log(err));
  }, []);

  const blockBanner = useCallback((id, is_active) => {
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
          {/* <Card className="my-2">
            <CardImg
              alt="Card image cap"
              src={data?.image}
              style={{
                height: 100,
              }}
              width="100%"
            />
          </Card> */}
          <img src={data?.image} className="img_banner" />
        </td>

        <td>
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
                Bạn có chắc muốn xóa banner {data?.title} này không?
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
