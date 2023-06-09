import { useCallback, useEffect, useState } from "react";
import "./styles.scss";
import {
  activeReasonPunish,
  deleteReasonPunish,
  getReasonPunishApi,
} from "../../../../../api/reasons";
import { Button, Dropdown, Space, Table } from "antd";
import moment from "moment";
import CreateReasonPubnish from "./component/CreateResonPunish";
import LoadingPagination from "../../../../../components/paginationLoading";
import EditReasonPubnish from "./component/EditResonPunish";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { errorNotify } from "../../../../../helper/toast";
import offToggle from "../../../../../assets/images/off-button.png";
import onToggle from "../../../../../assets/images/on-button.png";
import { useSelector } from "react-redux";
import { getElementState } from "../../../../../redux/selectors/auth";
const width = window.innerWidth;

const ReasonPunish = () => {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [itemEdit, setItemEdit] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [modal, setModal] = useState(false);
  const [modalBlock, setModalBlock] = useState(false);
  const checkElement = useSelector(getElementState);

  const toggle = () => setModal(!modal);
  const toggleBlock = () => setModalBlock(!modalBlock);
  useEffect(() => {
    getReasonPunishApi(0, 20)
      .then((res) => {
        setData(res?.data);
        setTotal(res?.totalItem);
      })
      .catch((err) => {});
  }, []);

  const onDelete = useCallback((id) => {
    setIsLoading(true);
    deleteReasonPunish(id)
      .then((res) => {
        setIsLoading(false);
        setModal(false);
        getReasonPunishApi(0, 20)
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

  const activePunish = useCallback((id, is_active) => {
    setIsLoading(true);
    if (is_active === true) {
      activeReasonPunish(id, { is_active: false })
        .then((res) => {
          setIsLoading(false);
          setModalBlock(false);
          getReasonPunishApi(0, 20)
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
      activeReasonPunish(id, { is_active: true })
        .then((res) => {
          setModalBlock(false);
          setIsLoading(false);
          getReasonPunishApi(0, 20)
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

  const columns = [
    {
      title: "Ngày tạo",
      render: (data) => {
        return (
          <div className="div-date-create-punish">
            <a className="text-time">
              {moment(new Date(data?.date_create)).format("DD/MM/yyy")}
            </a>
            <a className="text-time">
              {moment(new Date(data?.date_create)).format("HH:mm")}
            </a>
          </div>
        );
      },
    },
    {
      title: "Tên lí do",
      render: (data) => <a>{data?.title?.vi}</a>,
    },
    {
      title: "Mô tả",
      render: (data) => <a>{data?.description?.vi}</a>,
    },
    {
      title: "Áp dụng",
      render: (data) => (
        <a>{data?.apply_user === "collaborator" ? "Cộng tác viên" : ""}</a>
      ),
    },
    // {
    //   key: "action",
    //   render: (data) => {
    //     return (
    //       <div>
    //         {data?.is_active ? (
    //           <img src={onToggle} className="img-toggle" />
    //         ) : (
    //           <img
    //             src={offToggle}
    //             className="img-toggle"
    //             onClick={toggleBlock}
    //           />
    //         )}
    //       </div>
    //     );
    //   },
    // },
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
              <i class="uil uil-ellipsis-v"></i>
            </a>
          </Dropdown>
        </Space>
      ),
    },
  ];

  const items = [
    {
      key: 1,
      label: checkElement?.includes("edit_reason_punish_setting") && (
        <EditReasonPubnish
          setIsLoading={setIsLoading}
          setData={setData}
          setTotal={setTotal}
          id={itemEdit?._id}
        />
      ),
    },
    {
      key: 2,
      label: checkElement?.includes("delete_reason_punish_setting") && (
        <a onClick={toggle}>Xoá</a>
      ),
    },
  ];
  return (
    <>
      <h3>Lí do phạt</h3>
      <div>
        {checkElement?.includes("create_reason_punish_setting") && (
          <CreateReasonPubnish
            setIsLoading={setIsLoading}
            setData={setData}
            setTotal={setTotal}
          />
        )}
      </div>
      <div className="mt-3">
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
          scroll={
            width <= 490
              ? {
                  x: 1000,
                }
              : null
          }
        />
      </div>

      <div>
        <Modal isOpen={modal} toggle={toggle}>
          <ModalHeader toggle={toggle}>Xóa lí do phạt</ModalHeader>
          <ModalBody>
            <a>
              Bạn có chắc muốn xóa lí do phạt
              <a className="text-name-modal">{itemEdit?.title?.vi}</a> này
              không?
            </a>
          </ModalBody>
          <ModalFooter>
            <Button type="primary" onClick={() => onDelete(itemEdit?._id)}>
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
            {itemEdit?.is_active === true ? "Khóa lí do phạt" : "Mở lí do phạt"}
          </ModalHeader>
          <ModalBody>
            {itemEdit?.is_active === true
              ? "Bạn có muốn khóa lí do"
              : "Bạn có muốn kích hoạt lí do"}
            <h3>{itemEdit?.title?.vi}</h3>
          </ModalBody>
          <ModalFooter>
            <Button
              color="primary"
              onClick={() => activePunish(itemEdit?._id, itemEdit?.is_active)}
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
    </>
  );
};

export default ReasonPunish;
