import { MoreOutlined } from "@ant-design/icons";
import { Dropdown, Empty, Skeleton, Space, Table } from "antd";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import {
  activeGroupServiceApi,
  deleteGroupServiceApi,
  getGroupServiceApi,
} from "../../../../api/service";
import offToggle from "../../../../assets/images/off-button.png";
import onToggle from "../../../../assets/images/on-button.png";
import AddGroupService from "../../../../components/addGroupService/addGroupService";
import EditGroupService from "../../../../components/editGroupService/editGroupService";
import LoadingPagination from "../../../../components/paginationLoading";
import { errorNotify } from "../../../../helper/toast";
import { getUser } from "../../../../redux/selectors/auth";
import "./GroupServiceManage.scss";

export default function GroupServiceManage() {
  const dispatch = useDispatch();
  const [dataFilter, setDataFilter] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [itemEdit, setItemEdit] = useState([]);
  const [modal, setModal] = useState(false);
  const [modalCreate, setModalCreate] = useState(false);
  const [modalEdit, setModalEdit] = useState(false);
  const [modalBlock, setModalBlock] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const user = useSelector(getUser);
  const navigate = useNavigate();

  useEffect(() => {
    getGroupServiceApi(0, 20)
      .then((res) => {
        setData(res?.data);
        setTotal(res?.totalItem);
      })
      .catch((err) => {});
  }, []);

  const toggle = () => setModal(!modal);
  const toggleBlock = () => setModalBlock(!modalBlock);

  const onDelete = useCallback((id) => {
    setIsLoading(true);
    deleteGroupServiceApi(id)
      .then((res) => {
        setModal(false);
        setIsLoading(false);
        getGroupServiceApi(0, 20)
          .then((res) => {
            setData(res?.data);
            setTotal(res?.totalItem);
          })
          .catch((err) => {});
      })
      .catch((err) => {
        setIsLoading(false);

        errorNotify({
          message: err,
        });
      });
  }, []);

  const blockGroupService = useCallback((id, is_active) => {
    if (is_active === true) {
      activeGroupServiceApi(id, { is_active: false })
        .then((res) => {
          setModalBlock(false);
          getGroupServiceApi(0, 20)
            .then((res) => {
              setData(res?.data);
              setTotal(res?.totalItem);
            })
            .catch((err) => {});
        })
        .catch((err) => {
          errorNotify({
            message: err,
          });
        });
    } else {
      activeGroupServiceApi(id, { is_active: true })
        .then((res) => {
          setModalBlock(false);
          getGroupServiceApi(0, 20)
            .then((res) => {
              setData(res?.data);
              setTotal(res?.totalItem);
            })
            .catch((err) => {});
        })
        .catch((err) => {
          errorNotify({
            message: err,
          });
        });
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
    {
      key: "2",
      label: (
        <a
          onClick={() => {
            navigate("/services/manage-group-service/manage-price-service", {
              state: { id: itemEdit?._id },
            });
          }}
        >
          Xem giá
        </a>
      ),
    },
    {
      key: "3",
      label: user.role === "admin" && <a onClick={toggle}>Xoá</a>,
    },
  ];

  const columns = [
    {
      title: "Hình ảnh",
      width: "30%",
      render: (data) => {
        return (
          <div
            onClick={() => {
              navigate("/services/manage-group-service/manage-service", {
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
      render: (data) => {
        return (
          <div>
            {user.role === "admin" && data?.is_active ? (
              <img
                className="img-lock-group-service"
                src={onToggle}
                onClick={toggleBlock}
              />
            ) : (
              <img
                className="img-lock-group-service"
                src={offToggle}
                onClick={toggleBlock}
              />
            )}
          </div>
        );
      },
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
        <AddGroupService
          state={modalCreate}
          setState={setModalCreate}
          setIsLoading={setIsLoading}
          setData={setData}
          setTotal={setTotal}
        />
      </div>
      <div className="mt-3">
        <Table
          columns={columns}
          dataSource={data}
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
              },
            };
          }}
          locale={{
            emptyText: data.length > 0 ? <Empty /> : <Skeleton active={true} />,
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
            {itemEdit?.is_active === true
              ? "Khóa nhóm dịch vụ"
              : "Mở nhóm dịch vụ"}
          </ModalHeader>
          <ModalBody>
            {itemEdit?.is_active === true
              ? "Bạn có muốn khóa nhóm dịch vụ " + itemEdit?.title?.vi
              : "Bạn có muốn kích hoạt nhóm dịch vụ" + itemEdit?.title?.vi}
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
          setState={setModalEdit}
          data={itemEdit}
          setData={setData}
          setTotal={setTotal}
        />
      </div>
      <Outlet />

      {isLoading && <LoadingPagination />}
    </React.Fragment>
  );
}
