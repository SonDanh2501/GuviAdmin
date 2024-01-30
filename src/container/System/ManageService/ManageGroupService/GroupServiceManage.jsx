import { MoreOutlined } from "@ant-design/icons";
import { Dropdown, Empty, Image, Skeleton, Space, Switch, Table } from "antd";
import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import {
  activeGroupServiceApi,
  deleteGroupServiceApi,
  getGroupServiceApi,
} from "../../../../api/service";
import AddGroupService from "../../../../components/addGroupService/addGroupService";
import EditGroupService from "../../../../components/editGroupService/editGroupService";
import LoadingPagination from "../../../../components/paginationLoading";
import { errorNotify } from "../../../../helper/toast";
import { getUser } from "../../../../redux/selectors/auth";
import "./styles.scss";

const GroupServiceManage = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [itemEdit, setItemEdit] = useState([]);
  const [modal, setModal] = useState(false);
  const [modalBlock, setModalBlock] = useState(false);
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const user = useSelector(getUser);
  const navigate = useNavigate();

  useEffect(() => {
    getGroupServiceApi(0, 20)
      .then((res) => {
        setData(res?.data);
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
          })
          .catch((err) => {});
      })
      .catch((err) => {
        setIsLoading(false);

        errorNotify({
          message: err?.message,
        });
      });
  }, []);

  const blockGroupService = useCallback((id, is_active) => {
    activeGroupServiceApi(id, { is_active: is_active ? false : true })
      .then((res) => {
        setModalBlock(false);
        getGroupServiceApi(0, 20)
          .then((res) => {
            setData(res?.data);
          })
          .catch((err) => {});
      })
      .catch((err) => {
        errorNotify({
          message: err?.message,
        });
      });
  }, []);

  const items = [
    {
      key: "1",
      label: (
        <EditGroupService
          data={itemEdit}
          setData={setData}
          setIsLoading={setIsLoading}
        />
      ),
    },
    // {
    //   key: "2",
    //   label: (
    //     <a
    //       onClick={() => {
    //         navigate("/services/manage-group-service/manage-price-service", {
    //           state: { id: itemEdit?._id },
    //         });
    //       }}
    //     >
    //       Xem giá
    //     </a>
    //   ),
    // },
    {
      key: "2",
      label: user.role === "admin" && (
        <p style={{ margin: 0 }} onClick={toggle}>
          Xoá
        </p>
      ),
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
              if (user.role === "admin") {
                navigate("/services/manage-group-service/manage-service", {
                  state: { id: data?._id },
                });
              }
            }}
          >
            <Image
              style={{ width: 50, height: 50, borderRadius: 4 }}
              src={data?.thumbnail}
              preview={false}
            />
          </div>
        );
      },
    },
    {
      title: "Tiêu đề",
      render: (data) => {
        return <p className="text-title">{data?.title.vi}</p>;
      },
      width: "35%",
    },
    {
      title: "Loại dịch vụ",
      render: (data) => <p className="text-service">{data?.type}</p>,
      width: "30%",
    },
    {
      key: "action",
      render: (data) => {
        return (
          <div>
            {user.role === "admin" && (
              <Switch
                checked={data?.is_active}
                onClick={toggleBlock}
                size="small"
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
            placement="bottomRight"
            trigger={["click"]}
          >
            <MoreOutlined className="icon-more" />
          </Dropdown>
        </Space>
      ),
    },
  ];

  return (
    <React.Fragment>
      <div className="div-head-service">
        <p className="label-service"> Tất cả dịch vụ</p>
        <AddGroupService setIsLoading={setIsLoading} setData={setData} />
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

      <Outlet />

      {isLoading && <LoadingPagination />}
    </React.Fragment>
  );
};

export default GroupServiceManage;
