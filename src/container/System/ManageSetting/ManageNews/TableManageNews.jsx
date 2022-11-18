import React, { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getNewSelector } from "../../../../redux/selectors/news";
import "./TableManageNews.scss";
import * as actions from "../../../../redux/actions/news";
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
} from "reactstrap";
import { activeNew, deleteNew } from "../../../../api/news";

export default function TableManageNews({ data, setItemEdit }) {
  const [modal, setModal] = React.useState(false);
  const [modalBlock, setModalBlock] = React.useState(false);
  const toggle = () => setModal(!modal);
  const toggleBlock = () => setModalBlock(!modalBlock);

  const onDelete = useCallback((id) => {
    deleteNew(id)
      .then((res) => {
        window.location.reload();
      })
      .catch((err) => console.log(err));
  }, []);

  const blockNew = useCallback((id, is_active) => {
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
      <tr>
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
          {/* <Card className="my-2">
            <CardImg
              alt="Card image cap"
              src={data?.thumbnail}
              style={{
                height: 100,
              }}
              width="100%"
            />
          </Card> */}
          <img src={data?.thumbnail} className="thumbnail" />
        </td>

        <td>
          <Row>
            <button className="btn-edit" onClick={() => setItemEdit(data)}>
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
        </td>
      </tr>
    </>
  );
}
