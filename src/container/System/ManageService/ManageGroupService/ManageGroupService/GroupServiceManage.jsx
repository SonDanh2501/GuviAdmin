import { MoreOutlined } from "@ant-design/icons";
import { Dropdown, Empty, Skeleton, Space, Table } from "antd";
import React, { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import {
  activeGroupServiceApi,
  deleteGroupServiceApi,
} from "../../../../../api/service";
import AddGroupService from "../../../../../components/addGroupService/addGroupService";
import EditGroupService from "../../../../../components/editGroupService/editGroupService";
import { loadingAction } from "../../../../../redux/actions/loading";
import { getGroupServiceAction } from "../../../../../redux/actions/service";
import { getUser } from "../../../../../redux/selectors/auth";
import {
  getGroupService,
  getGroupServiceTotal,
} from "../../../../../redux/selectors/service";
import "./GroupServiceManage.scss";

export default function GroupServiceManage() {
  const dispatch = useDispatch();
  const [dataFilter, setDataFilter] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [itemEdit, setItemEdit] = useState([]);
  const [modal, setModal] = React.useState(false);
  const [modalEdit, setModalEdit] = React.useState(false);
  const [modalBlock, setModalBlock] = React.useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const listGroupService = useSelector(getGroupService);
  const totalGroupService = useSelector(getGroupServiceTotal);
  const navigate = useNavigate();

  React.useEffect(() => {
    dispatch(getGroupServiceAction.getGroupServiceRequest(0, 10));
  }, [dispatch]);

  const toggle = () => setModal(!modal);
  const toggleBlock = () => setModalBlock(!modalBlock);

  const onDelete = useCallback((id) => {
    dispatch(loadingAction.loadingRequest(true));
    deleteGroupServiceApi(id)
      .then((res) => {
        window.location.reload();
      })
      .catch((err) => console.log(err));
  }, []);

  const blockGroupService = useCallback((id, is_active) => {
    dispatch(loadingAction.loadingRequest(true));
    if (is_active === true) {
      activeGroupServiceApi(id, { is_active: false })
        .then((res) => {
          setModalBlock(!modalBlock);
          window.location.reload();
        })
        .catch((err) => console.log(err));
    } else {
      activeGroupServiceApi(id, { is_active: true })
        .then((res) => {
          setModalBlock(!modalBlock);

          window.location.reload();
        })
        .catch((err) => console.log(err));
    }
  }, []);

  const items = [
    {
      key: "1",
      label: (
        <a
          onClick={() => {
            setModalEdit(!modalEdit);
          }}
        >
          Chỉnh sửa
        </a>
      ),
    },
    // {
    //   key: "2",
    //   label: itemEdit?.is_active ? (
    //     <a onClick={toggleBlock}>Chặn</a>
    //   ) : (
    //     <a onClick={toggleBlock}>Kích hoạt</a>
    //   ),
    // },
    // {
    //   key: "3",
    //   label: <a onClick={toggle}>Xoá</a>,
    // },
  ];

  const columns = [
    {
      title: "Hình ảnh",
      width: "30%",
      render: (data) => {
        return (
          <div
            onClick={() => {
              navigate("/services/manage-group-service/manage-price-service", {
                state: { id: data?._id },
              });
            }}
          >
            <img className="img-customer-service" src={data?.thumbnail} />
          </div>
        );
      },
    },
    {
      title: "Tiêu đề",
      render: (data) => {
        return <a className="text-title">{data?.title.vi}</a>;
      },
      width: "35%",
    },
    {
      title: "Loại dịch vụ",
      render: (data) => <a className="text-service">{data?.type}</a>,
      width: "30%",
    },
    {
      key: "action",
      width: "10%",
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
      <div className="div-head-service">
        <a className="label-service"> Tất cả dịch vụ</a>
        <AddGroupService />
      </div>
      <div className="mt-3">
        <Table
          columns={columns}
          dataSource={listGroupService}
          pagination={false}
          rowKey={(record) => record._id}
          rowSelection={{
            selectedRowKeys,
            onChange: (selectedRowKeys, selectedRows) => {
              setSelectedRowKeys(selectedRowKeys);
            },
          }}
          onRow={(record, rowIndex) => {
            return {
              onClick: (event) => {
                setItemEdit(record);
                // navigate("/services/manage-group-service/manage-service", {
                //   state: { id: record?._id },
                // });
              },
            };
          }}
          locale={{
            emptyText:
              listGroupService.length > 0 ? (
                <Empty />
              ) : (
                <Skeleton active={true} />
              ),
          }}
        />
      </div>

      <div>
        <Modal isOpen={modal} toggle={toggle}>
          <ModalHeader toggle={toggle}>Xóa GroupService</ModalHeader>
          <ModalBody>
            Bạn có chắc muốn xóa GroupService {itemEdit?.title?.vi} này không?
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
      <div>
        <Modal isOpen={modalBlock} toggle={toggleBlock}>
          <ModalHeader toggle={toggleBlock}>
            {" "}
            {itemEdit?.is_active === true
              ? "Khóa GroupService"
              : "Mở GroupService"}
          </ModalHeader>
          <ModalBody>
            {itemEdit?.is_active === true
              ? "Bạn có muốn khóa GroupService"
              : "Bạn có muốn kích hoạt GroupService này"}
            <h3>{itemEdit?.full_name}</h3>
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
        <EditGroupService
          state={modalEdit}
          setState={() => setModalEdit(!modalEdit)}
          data={itemEdit}
        />
      </div>
      <Outlet />
    </React.Fragment>
  );
}
