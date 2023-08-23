import { useLocation, useNavigate } from "react-router-dom";
import "./ServiceManage.scss";
import { useCallback, useEffect, useState } from "react";
import {
  activeServiceApi,
  deleteServiceApi,
  getServiceApi,
} from "../../../../api/service";
import { Dropdown, Image, Space, Switch, Table } from "antd";
import { useSelector } from "react-redux";
import { getUser } from "../../../../redux/selectors/auth";
import { MoreOutlined } from "@ant-design/icons";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import AddService from "../../../../components/addService/addService";
import { errorNotify } from "../../../../helper/toast";
import EditService from "../../../../components/editService/editService";
import LoadingPagination from "../../../../components/paginationLoading";

const ServiceManage = () => {
  const { state } = useLocation();
  const { id } = state || {};
  const [itemEdit, setItemEdit] = useState([]);
  const [modal, setModal] = useState(false);
  const [modalBlock, setModalBlock] = useState(false);
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const user = useSelector(getUser);
  const navigate = useNavigate();
  const toggle = () => setModal(!modal);
  const toggleBlock = () => setModalBlock(!modalBlock);

  useEffect(() => {
    if (id) {
      getServiceApi(id)
        .then((res) => {
          setData(res?.data);
        })
        .catch((err) => {});
    }
  }, [id]);

  const onDelete = useCallback(
    (_id) => {
      setIsLoading(true);
      deleteServiceApi(_id)
        .then((res) => {
          setModal(false);
          setIsLoading(false);
          getServiceApi(id)
            .then((res) => {
              setData(res?.data);
            })
            .catch((err) => {});
        })
        .catch((err) => {
          setIsLoading(false);
          errorNotify({
            message: err,
          });
        });
    },
    [id]
  );

  const blockService = useCallback(
    (_id, is_active) => {
      setIsLoading(true);
      activeServiceApi(_id, { is_active: is_active ? false : true })
        .then((res) => {
          setModalBlock(false);
          setIsLoading(false);
          getServiceApi(id)
            .then((res) => {
              setData(res?.data);
            })
            .catch((err) => {});
        })
        .catch((err) => {
          setIsLoading(false);
          errorNotify({
            message: err,
          });
        });
    },
    [id]
  );

  const items = [
    {
      key: "1",
      label: (
        <EditService
          data={itemEdit}
          setData={setData}
          id={id}
          setIsLoading={setIsLoading}
        />
      ),
    },
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
              navigate(
                "/services/manage-group-service/manage-service/option-service",
                {
                  state: { id: data?._id },
                }
              );
            }}
          >
            <Image
              preview={false}
              style={{ width: 50, height: 50 }}
              src={data?.thumbnail}
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
      key: "action",
      render: (data) => {
        return (
          <div>
            {user.role === "admin" && data?.is_active && (
              <Switch
                checked={data?.is_active}
                onClick={toggleBlock}
                size="small"
              />
            )}
          </div>
        );
      },
      align: "center",
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
    <div>
      <div>
        <AddService id={id} setData={setData} setIsLoading={setIsLoading} />
      </div>
      <div className="mt-3">
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
        <Modal isOpen={modal} toggle={toggle}>
          <ModalHeader toggle={toggle}>Xóa dịch vụ</ModalHeader>
          <ModalBody>
            Bạn có chắc muốn xóa service {itemEdit?.title?.vi} này không?
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
            {itemEdit?.is_active === true ? "Khóa dịch vụ" : "Mở dịch vụ"}
          </ModalHeader>
          <ModalBody>
            {itemEdit?.is_active === true
              ? "Bạn có muốn khóa dịch vụ " + itemEdit?.title?.vi
              : "Bạn có muốn kích hoạt dịch vụ" + itemEdit?.title?.vi}
            <h3>{itemEdit?.full_name}</h3>
          </ModalBody>
          <ModalFooter>
            <Button
              color="primary"
              onClick={() => blockService(itemEdit?._id, itemEdit?.is_active)}
            >
              Có
            </Button>
            <Button color="#ddd" onClick={toggleBlock}>
              Không
            </Button>
          </ModalFooter>
        </Modal>
      </div>

      {isLoading && <LoadingPagination />}
    </div>
  );
};

export default ServiceManage;
