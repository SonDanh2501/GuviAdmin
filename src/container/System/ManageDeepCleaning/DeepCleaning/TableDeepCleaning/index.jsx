import { MoreOutlined } from "@ant-design/icons";
import { Dropdown, Pagination, Space, Table } from "antd";
import moment from "moment";
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  changeStatusCusomerRequest,
  contactedCusomerRequest,
  deleteCusomerRequest,
  getCusomerRequest,
} from "../../../../../api/requestCustomer";
import ModalCustom from "../../../../../components/modalCustom";
import LoadingPagination from "../../../../../components/paginationLoading";
import { errorNotify } from "../../../../../helper/toast";
import i18n from "../../../../../i18n";
import {
  getElementState,
  getLanguageState,
} from "../../../../../redux/selectors/auth";
import "./deepCleaning.scss";
const width = window.innerWidth;

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
  const lang = useSelector(getLanguageState);

  useEffect(() => {
    getCusomerRequest(status, 0, 20, "", lang)
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
          getCusomerRequest(status, startPage, 20, "", lang)
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
    [status, startPage, lang]
  );

  const onContacted = useCallback(
    (id) => {
      setIsLoading(true);
      contactedCusomerRequest(id)
        .then((res) => {
          setIsLoading(false);
          getCusomerRequest(status, startPage, 20, "", lang)
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
    [status, startPage, lang]
  );

  const onChangeStatus = useCallback(
    (id) => {
      setIsLoading(true);
      if (statusModal === "done") {
        changeStatusCusomerRequest(id, { status: "done" })
          .then((res) => {
            setIsLoading(false);
            getCusomerRequest(status, startPage, 20, "", lang)
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
            getCusomerRequest(status, startPage, 20, "", lang)
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
    [status, statusModal, startPage, lang]
  );

  const items = [
    {
      key: "1",
      label: checkElement?.includes("delete_request_service") && (
        <a className={"text-delete-deep"} onClick={toggle}>
          {`${i18n.t("delete", { lng: lang })}`}
        </a>
      ),
    },
  ];

  const columns = [
    {
      title: `${i18n.t("date", { lng: lang })}`,
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
      title: `${i18n.t("customer", { lng: lang })}`,
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
      title: `${i18n.t("content", { lng: lang })}`,
      render: (data) => <a className="text-description">{data?.description}</a>,
    },
    {
      title: `${i18n.t("address", { lng: lang })}`,
      render: (data) => (
        <a className="text-address-cleaning">{data?.address}</a>
      ),
    },
    {
      title: `${i18n.t("contact", { lng: lang })}`,
      render: (data) => {
        return (
          <div>
            {data?.is_contacted ? (
              <a className="text-contacted">
                {`${i18n.t("contacted", { lng: lang })}`}
              </a>
            ) : (
              <div className="div-uncontacted">
                <a className="text-uncontacted">{`${i18n.t("not_contacted", {
                  lng: lang,
                })}`}</a>
                {checkElement?.includes("contact_request_service") && (
                  <div
                    className={"btn-contacted-deep"}
                    onClick={toggleContacted}
                  >
                    <a className="text-btn-contacted">{`${i18n.t("contact", {
                      lng: lang,
                    })}`}</a>
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
      title: `${i18n.t("contact_date", {
        lng: lang,
      })}`,
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
      title: `${i18n.t("status", { lng: lang })}`,
      render: (data) => {
        return (
          <div>
            {data?.status === "pending" ? (
              <a className="text-pending-request">{`${i18n.t("pending", {
                lng: lang,
              })}`}</a>
            ) : data?.status === "done" ? (
              <a className="text-done-request">{`${i18n.t("complete", {
                lng: lang,
              })}`}</a>
            ) : (
              <a className="text-cancel-request">{`${i18n.t("cancel_modal", {
                lng: lang,
              })}`}</a>
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
          <>
            {checkElement?.includes("change_status_request_service") && (
              <div>
                {data?.status === "pending" && (
                  <div className="div-btn-change-status">
                    <div
                      className="btn-change-done"
                      onClick={() => {
                        toggleStatus();
                        setStatusModal("done");
                      }}
                    >
                      <a className="text-change-done">{`${i18n.t("complete", {
                        lng: lang,
                      })}`}</a>
                    </div>
                    <div
                      className="btn-change-cancel"
                      onClick={() => {
                        toggleStatus();
                        setStatusModal("cancel");
                      }}
                    >
                      <a className="text-change-cancel">{`${i18n.t(
                        "cancel_modal",
                        {
                          lng: lang,
                        }
                      )}`}</a>
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        );
      },
      align: "center",
      width: "5%",
    },
    {
      key: "action",
      align: "center",
      width: "5%",
      render: (data) => {
        return (
          <>
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
    getCusomerRequest(status, start, 20, "", lang)
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
          scroll={
            width <= 490
              ? {
                  x: 1600,
                }
              : null
          }
        />
      </div>
      <div className="mt-1 div-pagination p-2">
        <a>
          {`${i18n.t("total", { lng: lang })}`}: {total}
        </a>
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
        <ModalCustom
          isOpen={modal}
          handleOk={() => onDelete(itemEdit?._id)}
          textOk={`${i18n.t("delete", { lng: lang })}`}
          handleCancel={toggle}
          title={`${i18n.t("delete_request", { lng: lang })}`}
          body={
            <div>
              <a className="text-body-modal">
                {`${i18n.t("what_remove_request", { lng: lang })}`}
              </a>
              <a className="text-name-modal">{itemEdit?.name_customer}</a>
            </div>
          }
        />
      </div>

      <div>
        <ModalCustom
          isOpen={modalContacted}
          handleOk={() => onContacted(itemEdit?._id)}
          textOk={`${i18n.t("yes", { lng: lang })}`}
          handleCancel={toggleContacted}
          title={`${i18n.t("contact_customers", { lng: lang })}`}
          body={
            <div>
              <a className="text-body-modal">
                {`${i18n.t("sure_contact_customers", { lng: lang })}`}
              </a>
              <a className="text-name-modal">{itemEdit?.name_customer}</a>
            </div>
          }
        />
      </div>

      <div>
        <ModalCustom
          isOpen={modalStatus}
          title={`${i18n.t("request_status_change", { lng: lang })}`}
          handleOk={() => onChangeStatus(itemEdit?._id)}
          textOk={`${i18n.t("yes", { lng: lang })}`}
          handleCancel={toggleStatus}
          body={
            <div>
              <a className="text-body-modal">
                {`${i18n.t("sure_change_status", { lng: lang })}`}
              </a>
              <a className="text-name-modal">{itemEdit?.name_customer}</a>
            </div>
          }
        />
      </div>

      {isLoading && <LoadingPagination />}
    </div>
  );
};

export default TableDeepCleaning;
