import { MoreOutlined } from "@ant-design/icons";
import { Dropdown, Image, Space, Table } from "antd";
import React, { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useLocation } from "react-router-dom";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import {
  activeGroupServiceApi,
  deleteServiceApi,
  getServiceByIdApi,
} from "../../../../api/service";
import AddService from "../../../../components/addService/addService";
import CustomTextInput from "../../../../components/CustomTextInput/customTextInput";
import { loadingAction } from "../../../../redux/actions/loading";

import "./OptionalServiceManage.scss";

export default function OptionalServiceManage() {
  const { state } = useLocation();
  const { id } = state || {};
  const [data, setData] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [itemEdit, setItemEdit] = useState([]);
  const [modalBlock, setModalBlock] = React.useState(false);
  const [modal, setModal] = React.useState(false);
  const toggle = () => setModal(!modal);
  const toggleBlock = () => setModalBlock(!modalBlock);

  const dispatch = useDispatch();

  React.useEffect(() => {
    // getServiceByIdApi(id)
    //   .then((res) => setData(res.data))
    //   .catch((err) => console.log(err));
  }, [id]);

  const onDelete = useCallback((id) => {
    dispatch(loadingAction.loadingRequest(true));
    deleteServiceApi(id)
      .then((res) => {
        window.location.reload();

        dispatch(loadingAction.loadingRequest(false));
      })
      .catch((err) => {
        dispatch(loadingAction.loadingRequest(false));
      });
  }, []);

  const blockGroupService = useCallback((id, is_active) => {
    dispatch(loadingAction.loadingRequest(true));

    if (is_active === true) {
      activeGroupServiceApi(id, { is_active: false })
        .then((res) => {
          setModalBlock(!modalBlock);
          window.location.reload();
          dispatch(loadingAction.loadingRequest(false));
        })
        .catch((err) => {
          dispatch(loadingAction.loadingRequest(false));
        });
    } else {
      activeGroupServiceApi(id, { is_active: true })
        .then((res) => {
          setModalBlock(!modalBlock);

          window.location.reload();
        })
        .catch((err) => {
          dispatch(loadingAction.loadingRequest(false));
        });
    }
  }, []);

  const items = [
    {
      key: "1",
      label: itemEdit?.is_active ? (
        <a onClick={toggleBlock}>Chặn</a>
      ) : (
        <a onClick={toggleBlock}>Kích hoạt</a>
      ),
    },

    {
      key: "2",
      label: <a onClick={toggle}>Xoá</a>,
    },
  ];

  const columns = [
    {
      title: "Image",
      render: (data) => {
        return <Image src={data?.thumbnail} className="img-thumbnail" />;
      },
    },
    {
      title: "Title",
      dataIndex: ["title", "vi"],
    },
    {
      title: "Type",
      dataIndex: ["type"],
    },
    {
      key: "action",
      align: "center",
      render: (data) => (
        <Space size="middle">
          <Dropdown
            menu={{
              items,
            }}
            placement="bottom"
            trigger={["click"]}
          >
            <a>
              <MoreOutlined className="icon-more" />
            </a>
          </Dropdown>
        </Space>
      ),
    },
  ];

  return (
    <React.Fragment>
      <div className="mt-2 p-3">
        <a className="label-service">Service</a>
        <Table
          columns={columns}
          dataSource={data}
          pagination={false}
          onRow={(record, rowIndex) => {
            return {
              onClick: (event) => {
                setItemEdit(record);
              },
            };
          }}
        />
      </div>

      <div>
        <Modal isOpen={modalBlock} toggle={toggleBlock}>
          <ModalHeader toggle={toggleBlock}>
            {" "}
            {itemEdit?.is_active === true ? "Khóa Service" : "Mở Service"}
          </ModalHeader>
          <ModalBody>
            {itemEdit?.is_active === true
              ? "Bạn có muốn khóa Service"
              : "Bạn có muốn kích hoạt Service này"}
            <h3>{itemEdit?.title?.vi}</h3>
          </ModalBody>
          <ModalFooter>
            <Button
              color="primary"
              onClick={() =>
                blockGroupService(itemEdit?._id, itemEdit?.is_active)
              }
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
          <ModalHeader toggle={toggle}>Xóa Service</ModalHeader>
          <ModalBody>
            Bạn có chắc muốn xóa Service {itemEdit?.title?.vi} này không?
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={() => onDelete(itemEdit?._id)}>
              Có
            </Button>
            <Button color="#ddd" onClick={toggle}>
              Không
            </Button>
          </ModalFooter>
        </Modal>
      </div>
      <Outlet />
    </React.Fragment>
  );
}
