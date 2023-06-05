import { MoreOutlined } from "@ant-design/icons";
import { Button, Dropdown, Space, Table, Pagination } from "antd";
import moment from "moment";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { loadingAction } from "../../../../../redux/actions/loading";
import { getElementState, getUser } from "../../../../../redux/selectors/auth";
import {
  getCusomerRequest,
  deleteCusomerRequest,
  contactedCusomerRequest,
  changeStatusCusomerRequest,
} from "../../../../../api/requestCustomer";
import "./deepCleaning.scss";
import { errorNotify } from "../../../../../helper/toast";
import LoadingPagination from "../../../../../components/paginationLoading";

const TableDeepCleaning = (props) => {
  const { status, currentPage, setCurrentPage, setStartPage, startPage } =
    props;
  const [data, setData] = useState([]);
  const [total, setTotal] = useState([]);
  const [itemEdit, setItemEdit] = useState([]);
  const [statusModal, setStatusModal] = useState("done");
  const [modal, setModal] = useState(false);
  const [modalContacted, setModalContacted] = useState(false);
  const [modalStatus, setModalStatus] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const toggleContacted = () => setModalContacted(!modalContacted);
  const toggle = () => setModal(!modal);
  const toggleStatus = () => setModalStatus(!modalStatus);
  const checkElement = useSelector(getElementState);
  const dispatch = useDispatch();
  const user = useSelector(getUser);

  useEffect(() => {
    getCusomerRequest(status, 0, 20, "")
      .then((res) => {
        setIsLoading(false);
        setData(res?.data);
        setTotal(res?.totalItem);
      })
      .catch((err) => {});
  }, [status]);

  const onDelete = useCallback(
    (id) => {
      setIsLoading(true);
      deleteCusomerRequest(id)
        .then((res) => {
          setIsLoading(false);
          getCusomerRequest(status, startPage, 20, "")
            .then((res) => {
              setData(res?.data);
              setTotal(res?.totalItem);
              setModal(false);
            })
            .catch((err) => {});
        })
        .catch((err) => {
          errorNotify({
            message: err,
          });
          setIsLoading(false);
        });
    },
    [status, startPage]
  );

  const onContacted = useCallback(
    (id) => {
      setIsLoading(true);
      contactedCusomerRequest(id)
        .then((res) => {
          setIsLoading(false);
          getCusomerRequest(status, startPage, 20, "")
            .then((res) => {
              setData(res?.data);
              setTotal(res?.totalItem);
              setModal(false);
            })
            .catch((err) => {});
          setModalContacted(false);
        })
        .catch((err) => {
          errorNotify({
            message: err,
          });
          setIsLoading(false);
        });
    },
    [status, startPage]
  );

  const onChangeStatus = useCallback(
    (id) => {
      setIsLoading(true);
      if (statusModal === "done") {
        changeStatusCusomerRequest(id, { status: "done" })
          .then((res) => {
            setIsLoading(false);
            getCusomerRequest(status, startPage, 20, "")
              .then((res) => {
                setData(res?.data);
                setTotal(res?.totalItem);
              })
              .catch((err) => {});
            setModalStatus(false);
          })
          .catch((err) => {
            errorNotify({
              message: err,
            });
            setIsLoading(false);
          });
      } else if (statusModal === "cancel") {
        changeStatusCusomerRequest(id, { status: "cancel" })
          .then((res) => {
            getCusomerRequest(status, startPage, 20, "")
              .then((res) => {
                setData(res?.data);
                setTotal(res?.totalItem);
              })
              .catch((err) => {});
            setModalStatus(false);
            setIsLoading(false);
          })
          .catch((err) => {
            errorNotify({
              message: err,
            });
            setIsLoading(false);
          });
      }
    },
    [status, statusModal, startPage]
  );

  const items = [
    {
      key: "1",
      label: (
        <a
          className={
            checkElement?.includes("delete_request_service")
              ? "text-delete-deep"
              : "text-delete-deep-hide"
          }
          onClick={toggle}
        >
          Xoá
        </a>
      ),
    },
  ];

  const columns = [
    {
      title: "Ngày",
      render: (data) => {
        return (
          <div className="div-time-create">
            <a className="text-date-create">
              {moment(new Date(data?.date_create)).format("DD/MM/YYYY")}{" "}
            </a>
            <a className="text-date-create">
              {moment(new Date(data?.date_create)).format("HH:mm")}{" "}
            </a>
          </div>
        );
      },
    },
    {
      title: "Khách hàng",
      render: (data) => {
        return (
          <div className="div-customer">
            <a className="text-name">{data?.name_customer}</a>
            <a className="text-phone">{data?.phone_customer}</a>
          </div>
        );
      },
      sorter: (a, b) => a?.name_customer.localeCompare(b?.name_customer),
    },
    {
      title: "Nội dung",
      render: (data) => <a className="text-description">{data?.description}</a>,
    },
    {
      title: "Địa chỉ",
      render: (data) => (
        <a className="text-address-cleaning">{data?.address}</a>
      ),
    },
    {
      title: "Liên hệ",
      render: (data) => {
        return (
          <div>
            {data?.is_contacted ? (
              <a className="text-contacted">Đã liên hệ</a>
            ) : (
              <div className="div-uncontacted">
                <a className="text-uncontacted">Chưa liên hệ</a>
                {checkElement?.includes("contact_request_service") && (
                  <div
                    className={"btn-contacted-deep"}
                    onClick={toggleContacted}
                  >
                    <a className="text-btn-contacted">Liên hệ</a>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      },
      width: "5%",
      align: "center",
    },
    {
      title: "Ngày liên hệ",
      align: "center",
      render: (data) => {
        return (
          <div className="div-time-create">
            {data?.date_admin_contact_create ? (
              <>
                <a className="text-date-create">
                  {moment(new Date(data?.date_admin_contact_create)).format(
                    "DD/MM/YYYY"
                  )}
                </a>
                <a className="text-date-create">
                  {moment(new Date(data?.date_admin_contact_create)).format(
                    "HH:mm"
                  )}
                </a>
              </>
            ) : (
              <></>
            )}
          </div>
        );
      },
    },
    {
      title: "Trạng thái",
      render: (data) => {
        return (
          <div>
            {data?.status === "pending" ? (
              <a className="text-pending-request">Đang chờ</a>
            ) : data?.status === "done" ? (
              <a className="text-done-request">Hoàn tất</a>
            ) : (
              <a className="text-cancel-request">Huỷ</a>
            )}
          </div>
        );
      },
      align: "center",
    },
    {
      key: "action",
      render: (data) => {
        return (
          <div>
            {data?.status === "pending" ||
              (checkElement?.includes("change_status_request_service") && (
                <div className="div-btn-change-status">
                  <div
                    className="btn-change-done"
                    onClick={() => {
                      toggleStatus();
                      setStatusModal("done");
                    }}
                  >
                    <a className="text-change-done">Hoàn tất</a>
                  </div>
                  <div
                    className="btn-change-cancel"
                    onClick={() => {
                      toggleStatus();
                      setStatusModal("cancel");
                    }}
                  >
                    <a className="text-change-cancel">Huỷ</a>
                  </div>
                </div>
              ))}
          </div>
        );
      },
      align: "center",
      width: "5%",
    },
    {
      key: "action",
      align: "center",
      render: (data) => {
        return (
          <>
            {user?.role === "admin" && (
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
            )}
          </>
        );
      },
    },
  ];

  const onChange = (page) => {
    setCurrentPage(page);
    const lenghtData = data.length < 20 ? 20 : data.length;
    const start = page * lenghtData - lenghtData;
    setStartPage(start);
    getCusomerRequest(status, start, 20, "")
      .then((res) => {
        setData(res?.data);
        setTotal(res?.totalItem);
      })
      .catch((err) => {});
  };

  return (
    <div>
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
      <div className="mt-1 div-pagination p-2">
        <a>Tổng: {total}</a>
        <div>
          <Pagination
            current={currentPage}
            onChange={onChange}
            total={total}
            showSizeChanger={false}
            pageSize={20}
          />
        </div>
      </div>

      <div>
        <Modal isOpen={modal} toggle={toggle}>
          <ModalHeader toggle={toggle}>
            <a className="title-header-modal">Xóa yêu cầu</a>
          </ModalHeader>
          <ModalBody>
            <a className="text-body-modal">
              Bạn có chắc muốn xóa yêu cầu người dùng{" "}
              <a className="text-name-modal">{itemEdit?.name_customer}</a> này
              không?
            </a>
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
        <Modal isOpen={modalContacted} toggle={toggleContacted}>
          <ModalHeader toggle={toggleContacted}>
            <a className="title-header-modal">Liên hệ khách hàng</a>
          </ModalHeader>
          <ModalBody>
            <a className="text-body-modal">
              Bạn có chắc đã liên hệ khách hàng
              <a className="text-name-modal">{itemEdit?.name_customer}</a> này
              không?
            </a>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={() => onContacted(itemEdit?._id)}>
              Có
            </Button>
            <Button color="#ddd" onClick={toggleContacted}>
              Không
            </Button>
          </ModalFooter>
        </Modal>
      </div>

      <div>
        <Modal isOpen={modalContacted} toggle={toggleContacted}>
          <ModalHeader toggle={toggleContacted}>
            <a className="title-header-modal">Liên hệ khách hàng</a>
          </ModalHeader>
          <ModalBody>
            <a className="text-body-modal">
              Bạn có chắc đã liên hệ khách hàng
              <a className="text-name-modal">{itemEdit?.name_customer}</a> này
              không?
            </a>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={() => onContacted(itemEdit?._id)}>
              Có
            </Button>
            <Button color="#ddd" onClick={toggleContacted}>
              Không
            </Button>
          </ModalFooter>
        </Modal>
      </div>

      <div>
        <Modal isOpen={modalStatus} toggle={toggleStatus}>
          <ModalHeader toggle={toggleStatus}>
            <a className="title-header-modal">Chuyển trạng thái yêu cầu</a>
          </ModalHeader>
          <ModalBody>
            {statusModal === "done" && (
              <a className="text-body-modal">
                Bạn có chắc muốn chuyển trạng thái yêu cầu của khách hàng
                <a className="text-name-modal">{itemEdit?.name_customer}</a> này
                sang hoàn tất không?
              </a>
            )}
            {statusModal === "cancel" && (
              <a className="text-body-modal">
                Bạn có chắc muốn chuyển trạng thái yêu cầu của khách hàng
                <a className="text-name-modal">{itemEdit?.name_customer}</a> này
                sang huỷ không?
              </a>
            )}
          </ModalBody>
          <ModalFooter>
            <Button
              color="primary"
              onClick={() => onChangeStatus(itemEdit?._id)}
            >
              Có
            </Button>
            <Button color="#ddd" onClick={toggleStatus}>
              Không
            </Button>
          </ModalFooter>
        </Modal>
      </div>

      {isLoading && <LoadingPagination />}
    </div>
  );
};

export default TableDeepCleaning;
