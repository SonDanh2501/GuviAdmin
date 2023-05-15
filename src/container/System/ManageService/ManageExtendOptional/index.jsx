import { useLocation } from "react-router-dom";
import { formatMoney } from "../../../../helper/formatMoney";
import { useCallback, useEffect, useState } from "react";
import {
  activeExtendOptionApi,
  deleteExtendOptionalApi,
  getExtendByOptionalApi,
} from "../../../../api/service";
import { Button, Dropdown, Popover, Space, Table } from "antd";
import { MoreOutlined } from "@ant-design/icons";
import onToggle from "../../../../assets/images/on-button.png";
import offToggle from "../../../../assets/images/off-button.png";
import { ModalBody, ModalFooter, ModalHeader, Modal } from "reactstrap";
import LoadingPagination from "../../../../components/paginationLoading";
import { errorNotify } from "../../../../helper/toast";
import CreateExtend from "./component/CreateExtend";
import EditExtend from "./component/EditExtend";

const ExtendOptional = () => {
  const { state } = useLocation();
  const { id } = state || {};
  const [data, setData] = useState([]);
  const [total, setTotal] = useState([]);
  const [itemEdit, setItemEdit] = useState([]);
  const [modal, setModal] = useState(false);
  const [modalBlock, setModalBlock] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const toggle = () => setModal(!modal);
  const toggleBlock = () => setModalBlock(!modalBlock);

  useEffect(() => {
    if (id) {
      getExtendByOptionalApi(id)
        .then((res) => {
          setData(res?.data);
          setTotal(res?.totalItem);
        })
        .catch((err) => {});
    }
  }, [id]);

  const onDelete = useCallback(
    (_id) => {
      setIsLoading(true);
      deleteExtendOptionalApi(_id)
        .then((res) => {
          setIsLoading(false);
          getExtendByOptionalApi(id)
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

  const onActive = useCallback(
    (idActive, active) => {
      setIsLoading(true);
      if (active === true) {
        activeExtendOptionApi(idActive, {
          is_active: false,
        })
          .then((res) => {
            setIsLoading(false);
            setModalBlock(false);
            getExtendByOptionalApi(id)
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
        activeExtendOptionApi(idActive, {
          is_active: true,
        })
          .then((res) => {
            setIsLoading(false);
            setModalBlock(false);
            getExtendByOptionalApi(id)
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

  const contentExtend = (item) => {
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
          <a className="title">Giá</a>
          <a className="colon">:</a>
          <a className="details">{formatMoney(item?.price)}</a>
        </div>
      </div>
    );
  };

  const items = [
    {
      key: 1,
      label: (
        <EditExtend data={itemEdit} setData={setData} setTotal={setTotal} />
      ),
    },
    {
      key: 2,
      label: <a onClick={toggle}>Xoá</a>,
    },
  ];

  const columns = [
    {
      title: "Title",
      render: (data) => (
        <Popover
          content={() => contentExtend(data)}
          title="Thông tin chi tiết Extend"
          trigger="hover"
        >
          <a>{data?.title?.vi}</a>
        </Popover>
      ),
    },
    {
      title: "Mô tả",
      render: (data) => <a>{data?.description?.vi}</a>,
    },
    {
      title: "Giá",
      render: (data) => <a>{formatMoney(data?.price)}</a>,
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
                onClick={() => {
                  toggleBlock();
                }}
              />
            ) : (
              <img
                className="img-unlock-options"
                src={offToggle}
                onClick={() => toggleBlock()}
              />
            )}
          </>
        );
      },
      align: "center",
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
      align: "center",
    },
  ];
  return (
    <div>
      <h3>Extend Optional</h3>
      <div>
        <CreateExtend idOption={id} setData={setData} setTotal={setTotal} />
      </div>
      <div className="mt-3">
        <Table
          dataSource={data}
          pagination={false}
          columns={columns}
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
              type="primary"
              onClick={() => onActive(itemEdit?._id, itemEdit?.is_active)}
            >
              Có
            </Button>
            <Button type="#ddd" onClick={toggleBlock}>
              Không
            </Button>
          </ModalFooter>
        </Modal>
      </div>

      {isLoading && <LoadingPagination />}
    </div>
  );
};

export default ExtendOptional;
