import { MoreOutlined } from "@ant-design/icons";
import { Button, Dropdown, Image, Popover, Space, Switch, Table } from "antd";
import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import {
  activeOptionServiceApi,
  deleteOptionServiceApi,
  getOptionalServiceByServiceApi,
} from "../../../../api/service";
import LoadingPagination from "../../../../components/paginationLoading";
import { errorNotify } from "../../../../helper/toast";
import CreateOptional from "./component/CreateOptional";
import EditOptional from "./component/EditOptional";
import "./styles.scss";

const ManageOptionService = () => {
  const { state } = useLocation();
  const { id } = state || {};
  const [data, setData] = useState([]);
  const [itemEdit, setItemEdit] = useState([]);
  const [modal, setModal] = useState(false);
  const [modalBlock, setModalBlock] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const toggle = () => setModal(!modal);
  const toggleBlock = () => setModalBlock(!modalBlock);

  useEffect(() => {
    getOptionalServiceByServiceApi(id)
      .then((res) => {
        setData(res?.data);
      })
      .catch((err) => {});
  }, [id]);

  const onDelete = useCallback(
    (idOption) => {
      setIsLoading(true);
      deleteOptionServiceApi(idOption)
        .then((res) => {
          setModal(false);
          getOptionalServiceByServiceApi(id)
            .then((res) => {
              setData(res?.data);
              setIsLoading(false);
            })
            .catch((err) => {});
        })
        .catch((err) => {
          setIsLoading(false);
          errorNotify({
            message: err?.message,
          });
        });
    },
    [id]
  );

  const onActive = useCallback(
    (idActive, active) => {
      setIsLoading(true);

      activeOptionServiceApi(idActive, {
        is_active: active ? false : true,
      })
        .then((res) => {
          setIsLoading(false);
          setModalBlock(false);
          getOptionalServiceByServiceApi(id)
            .then((res) => {
              setData(res?.data);
            })
            .catch((err) => {});
        })
        .then((err) => {
          setIsLoading(false);
          errorNotify({
            message: err?.message,
          });
        });
    },
    [id]
  );

  const contentOptional = (item) => {
    return (
      <div className="div-content-option">
        <div className="div-title-option">
          <p className="title">Tiêu đề</p>
          <p className="colon">:</p>
          <p className="details">{item?.title?.vi}</p>
        </div>
        <div className="div-title-option">
          <p className="title">Mô tả</p>
          <p className="colon">:</p>
          <p className="details">{item?.description?.vi}</p>
        </div>
        <div className="div-title-option">
          <p className="title">Vị trí</p>
          <p className="colon">:</p>
          <p className="details">{item?.position}</p>
        </div>
        <div className="div-title-option">
          <p className="title">Phí hệ thống</p>
          <p className="colon">:</p>
          <p className="details">{item?.platform_fee}</p>
        </div>
        <div className="div-title-option">
          <p className="title">Hình ảnh</p>
          <p className="colon">:</p>
          <Image
            src={item?.thumbnail}
            style={{ width: 50, height: 50 }}
            preview={false}
          />
        </div>
      </div>
    );
  };

  const items = [
    {
      key: 1,
      label: (
        <EditOptional
          data={itemEdit}
          setIsLoading={setIsLoading}
          setData={setData}
          id={id}
        />
      ),
    },
    {
      key: 2,
      label: (
        <p style={{ margin: 0 }} onClick={toggle}>
          Xoá
        </p>
      ),
    },
  ];

  const columns = [
    {
      title: "Tiêu đề",
      render: (data) => (
        <Popover
          content={() => contentOptional(data)}
          title="Title"
          trigger="hover"
        >
          <p
            style={{ margin: 0 }}
            onClick={() => {
              navigate(
                "/services/manage-group-service/manage-service/option-service/extend-option",
                {
                  state: { id: data?._id },
                }
              );
            }}
          >
            {data?.title?.vi}
          </p>
        </Popover>
      ),
      width: "40%",
    },
    {
      title: "Mô tả",
      render: (data) => <p style={{ margin: 0 }}>{data?.description?.vi}</p>,
    },
    {
      title: "Vị trí",
      render: (data) => <p style={{ margin: 0 }}>{data?.position}</p>,
      align: "center",
    },
    {
      title: "Phí dịch vụ",
      render: (data) => <p style={{ margin: 0 }}>{data?.platform_fee}</p>,
      align: "center",
    },
    {
      key: "action",
      render: (data) => {
        return (
          <>
            <Switch
              checke={data?.is_active}
              onClick={toggleBlock}
              size="small"
            />
          </>
        );
      },
    },
    {
      key: "action",
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
      <h3>Optional Service</h3>
      <div>
        <CreateOptional
          setIsLoading={setIsLoading}
          setData={setData}
          idService={id}
        />
      </div>
      <div>
        <Table
          dataSource={data}
          columns={columns}
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
          <ModalHeader toggle={toggle}>Xóa option service</ModalHeader>
          <ModalBody>
            <p>
              Bạn có chắc muốn xóa option service{" "}
              <strong className="text-name-modal">{itemEdit?.title?.vi}</strong>{" "}
              này không?
            </p>
          </ModalBody>
          <ModalFooter>
            <Button type="primary" onClick={() => onDelete(itemEdit?._id)}>
              Có
            </Button>
            <Button type="#ddd" onClick={toggle}>
              Không
            </Button>
          </ModalFooter>
        </Modal>
      </div>

      <div>
        <Modal isOpen={modalBlock} toggle={toggleBlock}>
          <ModalHeader toggle={toggleBlock}>
            {itemEdit?.is_active === true
              ? "Ẩn option service"
              : "Hiện option service"}
          </ModalHeader>
          <ModalBody>
            {itemEdit?.is_active === true
              ? "Bạn có muốn ẩn option service"
              : "Bạn có muốn hiện option service"}
            <h4>{itemEdit?.title?.vi}</h4>
          </ModalBody>
          <ModalFooter>
            <Button
              color="primary"
              onClick={() => onActive(itemEdit?._id, itemEdit?.is_active)}
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

export default ManageOptionService;
