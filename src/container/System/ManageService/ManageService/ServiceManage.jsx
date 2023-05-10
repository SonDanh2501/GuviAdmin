import { useLocation, useNavigate } from "react-router-dom";
import "./ServiceManage.scss";
import { useCallback, useEffect, useState } from "react";
import {
  activeServiceApi,
  deleteServiceApi,
  getServiceApi,
} from "../../../../api/service";
import { Dropdown, Space, Table } from "antd";
import { useSelector } from "react-redux";
import { getUser } from "../../../../redux/selectors/auth";
import onToggle from "../../../../assets/images/on-button.png";
import offToggle from "../../../../assets/images/off-button.png";
import { MoreOutlined } from "@ant-design/icons";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import AddService from "../../../../components/addService/addService";
import { errorNotify } from "../../../../helper/toast";
import EditService from "../../../../components/editService/editService";
import LoadingPagination from "../../../../components/paginationLoading";

const ServiceManage = () => {
  const { state } = useLocation();
  const { id } = state || {};
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
  const toggle = () => setModal(!modal);
  const toggleBlock = () => setModalBlock(!modalBlock);

  useEffect(() => {
    if (id) {
      getServiceApi(id)
        .then((res) => {
          setData(res?.data);
          setTotal(res?.totalItem);
        })
        .catch((err) => {});
    }
  }, [id]);

  const onDelete = useCallback((id) => {
    setIsLoading(true);
    deleteServiceApi(id)
      .then((res) => {
        setModal(false);
        setIsLoading(false);

        getServiceApi(id)
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

  const blockService = useCallback((id, is_active) => {
    setIsLoading(true);
    if (is_active === true) {
      activeServiceApi(id, { is_active: false })
        .then((res) => {
          setModalBlock(false);
          setIsLoading(false);
          getServiceApi(id)
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
    } else {
      activeServiceApi(id, { is_active: true })
        .then((res) => {
          setModalBlock(false);
          setIsLoading(false);
          getServiceApi(id)
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
    }
  }, []);

  const items = [
    {
      key: "1",
      label: (
        <EditService
          data={itemEdit}
          setData={setData}
          setTotal={setTotal}
          id={id}
          setIsLoading={setIsLoading}
        />
      ),
    },
    // {
    //   key: "2",
    //   label: user.role === "admin" && <a onClick={toggle}>Xoá</a>,
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
              navigate(
                "/services/manage-group-service/manage-service/option-service",
                {
                  state: { id: data?._id },
                }
              );
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
    <div>
      <div>
        <AddService
          id={id}
          setData={setData}
          setTotal={setTotal}
          setIsLoading={setIsLoading}
        />
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
