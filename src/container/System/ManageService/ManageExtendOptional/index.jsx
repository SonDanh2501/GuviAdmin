import { useLocation } from "react-router-dom";
import { formatMoney } from "../../../../helper/formatMoney";
import { useCallback, useEffect, useState } from "react";
import {
  activeExtendOptionApi,
  deleteExtendOptionalApi,
  getExtendByOptionalApi,
} from "../../../../api/service";
import { Button, Dropdown, Popover, Space, Switch, Table } from "antd";
import { MoreOutlined } from "@ant-design/icons";

import { ModalBody, ModalFooter, ModalHeader, Modal } from "reactstrap";
import LoadingPagination from "../../../../components/paginationLoading";
import { errorNotify } from "../../../../helper/toast";
import CreateExtend from "./component/CreateExtend";
import EditExtend from "./component/EditExtend";
import "./styles.scss";

const ExtendOptional = () => {
  const { state } = useLocation();
  const { id } = state || {};
  const [data, setData] = useState([]);
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
          setModal(false);
          getExtendByOptionalApi(id)
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
    },
    [id]
  );

  const onActive = useCallback(
    (idActive, active) => {
      setIsLoading(true);
      activeExtendOptionApi(idActive, {
        is_active: active ? false : true,
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
            message: err?.message,
          });
        });
    },
    [id]
  );

  const contentExtend = (item) => {
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
          <p className="title">Giá</p>
          <p className="colon">:</p>
          <p className="details">{formatMoney(item?.price)}</p>
        </div>
      </div>
    );
  };

  const items = [
    {
      key: 1,
      label: <EditExtend data={itemEdit} setData={setData} idOption={id} />,
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
      title: "Title",
      render: (data) => (
        <Popover
          content={() => contentExtend(data)}
          title="Thông tin chi tiết Extend"
          trigger="hover"
        >
          <p className="text-name-extend">{data?.title?.vi}</p>
        </Popover>
      ),
    },
    {
      title: "Mô tả",
      render: (data) => (
        <p className="text-name-extend">{data?.description?.vi}</p>
      ),
    },
    {
      title: "Giá",
      render: (data) => (
        <p className="text-name-extend">{formatMoney(data?.price)}</p>
      ),
    },
    {
      title: "Phí dịch vụ",
      render: (data) => (
        <p className="text-name-extend">{data?.platform_fee}</p>
      ),
      align: "center",
    },
    {
      key: "action",
      render: (data) => {
        return (
          <>
            <Switch
              checked={data?.is_active}
              onClick={toggleBlock}
              size="small"
              style={{ backgroundColor: data?.is_active ? "#00cf3a" : "" }}
            />
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
            placement="bottomRight"
            trigger={["click"]}
          >
            <MoreOutlined className="icon-more" />
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
        <CreateExtend idOption={id} setData={setData} />
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
            <p className="text-name-extend">
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
