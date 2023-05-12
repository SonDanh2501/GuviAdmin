import { useLocation } from "react-router-dom";
import { formatMoney } from "../../../../helper/formatMoney";
import { useEffect, useState } from "react";
import { getExtendByOptionalApi } from "../../../../api/service";
import { Button, Dropdown, Modal, Space, Table } from "antd";
import { MoreOutlined } from "@ant-design/icons";
import onToggle from "../../../../assets/images/on-button.png";
import offToggle from "../../../../assets/images/off-button.png";
import { ModalBody, ModalFooter, ModalHeader } from "reactstrap";

const ExtendOptional = () => {
  const { state } = useLocation();
  const { id } = state || {};
  const [data, setData] = useState([]);
  const [itemEdit, setItemEdit] = useState([]);
  const [modal, setModal] = useState(false);
  const [modalBlock, setModalBlock] = useState(false);
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
      label: <a>Chỉnh sửa</a>,
    },
    {
      key: 2,
      label: <a>Xoá</a>,
    },
  ];

  const columns = [
    {
      title: "Title",
      render: (data) => <a>{data?.title?.vi}</a>,
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
      <h3>Extend Optional</h3>
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
            <Button type="primary">Có</Button>
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
            <Button color="primary">Có</Button>
            <Button color="#ddd" onClick={toggleBlock}>
              Không
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    </div>
  );
};

export default ExtendOptional;
