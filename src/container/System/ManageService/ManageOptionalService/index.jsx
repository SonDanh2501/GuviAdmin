import { useLocation, useNavigate } from "react-router-dom";
import "./styles.scss";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  activeOptionServiceApi,
  deleteOptionServiceApi,
  getOptionalServiceByServiceApi,
} from "../../../../api/service";
import { Button, Dropdown, Image, Popover, Space, Table } from "antd";
import { DownOutlined, MoreOutlined } from "@ant-design/icons";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { errorNotify } from "../../../../helper/toast";
import LoadingPagination from "../../../../components/paginationLoading";
import EditOptional from "./component/EditOptional";
import CreateOptional from "./component/CreateOptional";
import { formatMoney } from "../../../../helper/formatMoney";
import onToggle from "../../../../assets/images/on-button.png";
import offToggle from "../../../../assets/images/off-button.png";

const ManageOptionService = () => {
  const { state } = useLocation();
  const { id } = state || {};
  const [data, setData] = useState([]);
  const [itemEdit, setItemEdit] = useState([]);
  const [itemEditExtend, setItemEditExtend] = useState([]);
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
            message: err,
          });
        });
    },
    [id]
  );

  const onActive = useCallback(
    (idActive, active) => {
      setIsLoading(true);
      if (active === true) {
        activeOptionServiceApi(idActive, {
          is_active: false,
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
              message: err,
            });
          });
      } else {
        activeOptionServiceApi(idActive, {
          is_active: true,
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
              message: err,
            });
          });
      }
    },
    [id]
  );

  const contentOptional = (item) => {
    return (
      <div className="div-content-option">
        <div className="div-title-option">
          <a className="title">Tiêu đề</a>
          <a className="colon">:</a>
          <a className="details">{item?.title?.vi}</a>
        </div>
        <div className="div-title-option">
          <a className="title">Mô tả</a>
          <a className="colon">:</a>
          <a className="details">{item?.description?.vi}</a>
        </div>
        <div className="div-title-option">
          <a className="title">Vị trí</a>
          <a className="colon">:</a>
          <a className="details">{item?.position}</a>
        </div>
        <div className="div-title-option">
          <a className="title">Phí hệ thống</a>
          <a className="colon">:</a>
          <a className="details">{item?.platform_fee}</a>
        </div>
        <div className="div-title-option">
          <a className="title">Hình ảnh</a>
          <a className="colon">:</a>
          <Image src={item?.thumbnail} style={{ width: 50, height: 50 }} />
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
        />
      ),
    },
    {
      key: 2,
      label: <a onClick={toggleBlock}>{itemEdit?.is_active ? "Ẩn" : "Hiện"}</a>,
    },
    {
      key: 3,
      label: <a onClick={toggle}>Xoá</a>,
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
          <a
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
          </a>
        </Popover>
      ),
      width: "40%",
    },
    {
      title: "Mô tả",
      render: (data) => <a>{data?.description?.vi}</a>,
    },
    {
      title: "Vị trí",
      render: (data) => <a>{data?.position}</a>,
      align: "center",
    },
    {
      title: "Phí dịch vụ",
      render: (data) => <a>{data?.platform_fee}</a>,
      align: "center",
    },
    {
      key: "action",
      render: (data) => {
        return (
          <>
            {data?.is_active ? (
              <img
                className="img-unlock-options"
                src={onToggle}
                onClick={toggleBlock}
              />
            ) : (
              <img
                className="img-unlock-options"
                src={offToggle}
                onClick={toggleBlock}
              />
            )}
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
      <h3>Optional Service</h3>
      {/* <div>
        <CreateOptional />
      </div> */}
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
            <a>
              Bạn có chắc muốn xóa option service{" "}
              <a className="text-name-modal">{itemEdit?.title?.vi}</a> này
              không?
            </a>
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
