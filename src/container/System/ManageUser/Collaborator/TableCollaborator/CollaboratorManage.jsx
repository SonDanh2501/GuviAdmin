import { SearchOutlined } from "@ant-design/icons";
import {
  Checkbox,
  Dropdown,
  Empty,
  FloatButton,
  Input,
  Pagination,
  Skeleton,
  Space,
  Table,
} from "antd";
import _debounce from "lodash/debounce";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  activeCollaborator,
  changeContactedCollaborator,
  deleteCollaborator,
  fetchCollaborators,
  lockTimeCollaborator,
  searchCollaborators,
  verifyCollaborator,
} from "../../../../../api/collaborator.jsx";
import offToggle from "../../../../../assets/images/off-button.png";
import offline from "../../../../../assets/images/offline.svg";
import onToggle from "../../../../../assets/images/on-button.png";
import online from "../../../../../assets/images/online.svg";
import pending from "../../../../../assets/images/pending.svg";
import { errorNotify } from "../../../../../helper/toast";
import { loadingAction } from "../../../../../redux/actions/loading.js";
import "./CollaboratorManage.scss";

import moment from "moment";
import { Link, useNavigate } from "react-router-dom";
import AddCollaborator from "../../../../../components/addCollaborator/addCollaborator.js";
import ModalCustom from "../../../../../components/modalCustom/index.jsx";
import LoadingPagination from "../../../../../components/paginationLoading/index.jsx";
import InputCustom from "../../../../../components/textInputCustom/index.jsx";
import { getElementState } from "../../../../../redux/selectors/auth.js";

const CollaboratorManage = (props) => {
  const { status } = props;
  const [dataFilter, setDataFilter] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [startPage, setStartPage] = useState(0);
  const [totalFilter, setTotalFilter] = useState("");
  const [valueFilter, setValueFilter] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [itemEdit, setItemEdit] = useState([]);
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [modal, setModal] = useState(false);
  const [modalBlock, setModalBlock] = useState(false);
  const [modalVerify, setModalVerify] = useState(false);
  const [modalLockTime, setModalLockTime] = useState(false);
  const [modalContected, setModalContected] = useState(false);
  const [checkLock, setCheckLock] = useState(false);
  const [timeValue, setTimeValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const toggle = () => setModal(!modal);
  const toggleContected = () => setModalContected(!modalContected);
  const toggleBlock = () => setModalBlock(!modalBlock);
  const toggleVerify = () => setModalVerify(!modalVerify);
  const toggleLockTime = () => setModalLockTime(!modalLockTime);
  const checkElement = useSelector(getElementState);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const width = window.innerWidth;

  useEffect(() => {
    fetchCollaborators(0, 20, status)
      .then((res) => {
        setData(res?.data);
        setTotal(res?.totalItems);
      })
      .catch((err) => {});
  }, [status]);

  const onChange = (page) => {
    setCurrentPage(page);
    const lenghtData = data.length < 20 ? 20 : data.length;
    const lenghtFilter = dataFilter.length < 20 ? 20 : dataFilter.length;
    const start =
      dataFilter.length > 0
        ? page * lenghtFilter - lenghtFilter
        : page * lenghtData - lenghtData;
    setStartPage(start);
    dataFilter.length > 0
      ? searchCollaborators(start, 20, status, valueFilter)
          .then((res) => {
            setDataFilter(res.data);
            setTotalFilter(res.totalItems);
          })
          .catch((err) => console.log(err))
      : fetchCollaborators(start, 20, status)
          .then((res) => {
            setData(res?.data);
            setTotal(res?.totalItems);
          })
          .catch((err) => {});
  };

  const changeValueSearch = (value) => {
    setValueFilter(value);
  };

  const handleSearch = useCallback(
    _debounce((value) => {
      searchCollaborators(0, 20, status, value)
        .then((res) => {
          setDataFilter(res.data);
          setTotalFilter(res.totalItems);
        })
        .catch((err) => {
          errorNotify({
            message: err,
          });
        });
    }, 1000),
    [status]
  );

  const onDelete = useCallback(
    (id) => {
      setIsLoading(true);
      deleteCollaborator(id, { is_delete: true })
        .then((res) => {
          fetchCollaborators(startPage, 20, status)
            .then((res) => {
              setData(res?.data);
              setTotal(res?.totalItems);
            })
            .catch((err) => {});
          setIsLoading(false);
          setModal(false);
        })
        .catch((err) => {
          setIsLoading(false);
          errorNotify({
            message: err,
          });
        });
    },
    [startPage, status]
  );

  const blockCollaborator = useCallback(
    (id, is_active) => {
      setIsLoading(true);
      if (is_active === true) {
        activeCollaborator(id, { is_active: false })
          .then((res) => {
            fetchCollaborators(startPage, 20, status)
              .then((res) => {
                setData(res?.data);
                setTotal(res?.totalItems);
              })
              .catch((err) => {});
            setModalBlock(false);
            setIsLoading(false);
          })
          .catch((err) => {
            dispatch(loadingAction.loadingRequest(false));
            errorNotify({
              message: err,
            });
          });
      } else {
        activeCollaborator(id, { is_active: true })
          .then((res) => {
            fetchCollaborators(startPage, 20, status)
              .then((res) => {
                setData(res?.data);
                setTotal(res?.totalItems);
              })
              .catch((err) => {});
            setModalBlock(false);
            setIsLoading(false);
          })
          .catch((err) => {
            setIsLoading(false);
            errorNotify({
              message: err,
            });
          });
      }
    },
    [startPage, status]
  );

  const onLockTimeCollaborator = useCallback(
    (id, is_lock_time) => {
      setIsLoading(true);
      if (is_lock_time === true) {
        lockTimeCollaborator(id, { is_locked: false })
          .then((res) => {
            fetchCollaborators(startPage, 20, status)
              .then((res) => {
                setData(res?.data);
                setTotal(res?.totalItems);
              })
              .catch((err) => {});
            setModalLockTime(false);
            setIsLoading(false);
          })
          .catch((err) => {
            setIsLoading(false);
            errorNotify({
              message: err,
            });
          });
      } else {
        lockTimeCollaborator(id, {
          is_locked: true,
          date_lock: moment(new Date(timeValue)).toISOString(),
        })
          .then((res) => {
            fetchCollaborators(startPage, 20, status)
              .then((res) => {
                setData(res?.data);
                setTotal(res?.totalItems);
              })
              .catch((err) => {});
            setModalLockTime(false);
            setIsLoading(false);
          })
          .catch((err) => {
            setIsLoading(false);
            errorNotify({
              message: err,
            });
          });
      }
    },
    [timeValue, dispatch, startPage, status]
  );
  const onVerifyCollaborator = useCallback(
    (id, is_verify) => {
      setIsLoading(true);
      if (is_verify === true) {
        verifyCollaborator(id)
          .then((res) => {
            fetchCollaborators(startPage, 20, status)
              .then((res) => {
                setData(res?.data);
                setTotal(res?.totalItems);
              })
              .catch((err) => {});
            setModalVerify(false);
            setIsLoading(false);
          })
          .catch((err) => {
            setIsLoading(false);
            errorNotify({
              message: err,
            });
          });
      } else {
        verifyCollaborator(id)
          .then((res) => {
            fetchCollaborators(startPage, 20, status)
              .then((res) => {
                setData(res?.data);
                setTotal(res?.totalItems);
              })
              .catch((err) => {});
            setModalVerify(false);
            setIsLoading(false);
          })
          .catch((err) => {
            setIsLoading(false);
            errorNotify({
              message: err,
            });
          });
      }
    },
    [startPage, status]
  );

  const onContected = useCallback(
    (id) => {
      setIsLoading(true);

      changeContactedCollaborator(id)
        .then((res) => {
          fetchCollaborators(startPage, 20, status)
            .then((res) => {
              setData(res?.data);
              setTotal(res?.totalItems);
            })
            .catch((err) => {});
          setModalContected(false);
          setIsLoading(false);
        })
        .catch((err) => {
          setIsLoading(false);
          errorNotify({
            message: err,
          });
        });
    },
    [startPage, status]
  );

  const items = [
    {
      key: "1",
      label: (
        <a
          className={
            checkElement?.includes("lock_unlock_collaborator")
              ? "text-click-block"
              : "text-click-block-hide"
          }
          onClick={toggleLockTime}
        >
          {itemEdit?.is_locked ? "Mở khoá" : "Khoá"}
        </a>
      ),
    },
    {
      key: "2",
      label: checkElement?.includes("delete_collaborator") && (
        <a onClick={toggle}>Xoá</a>
      ),
    },
  ];

  const columns = [
    {
      title: "Mã CTV",
      render: (data) => (
        <Link
          to={
            checkElement?.includes("detail_collaborator")
              ? `/details-collaborator/${data?._id}`
              : ""
          }
        >
          <a className="text-id-collaborator">{data?.id_view}</a>
        </Link>
      ),
    },
    {
      title: "Tên cộng tác viên",
      render: (data) => {
        return (
          <div className="div-collaborator">
            <Link
              to={
                checkElement?.includes("detail_collaborator")
                  ? `/details-collaborator/${data?._id}`
                  : ""
              }
            >
              <img className="img_collaborator" src={data?.avatar} />
              <a className="text-name-collaborator">{data?.full_name}</a>
            </Link>
          </div>
        );
      },
      sorter: (a, b) => a.full_name.localeCompare(b.full_name),
    },
    {
      title: "Ngày tạo",
      render: (data) => {
        return (
          <div className="div-create-ctv">
            <a className="text-create-ctv">
              {moment(new Date(data?.date_create)).format("DD/MM/YYYY")}
            </a>
            <a className="text-create-ctv">
              {moment(new Date(data?.date_create)).format("HH:mm")}
            </a>
          </div>
        );
      },
    },
    {
      title: "SĐT",
      render: (data) => <a className="text-phone-ctv">{data?.phone}</a>,
      align: "center",
    },
    {
      title: "Trạng thái",
      align: "center",
      render: (data) => {
        const now = moment(new Date()).format("DD/MM/YYYY hh:mm:ss");
        const then = data?.date_lock
          ? moment(new Date(data?.date_lock)).format("DD/MM/YYYY hh:mm:ss")
          : "";
        return (
          <div>
            {!data?.is_verify ? (
              <div>
                <img src={pending} />
                <a className="text-pending-cola">Pending</a>
              </div>
            ) : data?.is_locked ? (
              <div>
                <div>
                  <img src={pending} />
                  <a className="text-lock-time">Block</a>
                </div>
                {then !== "" && <a className="text-lock-time">{then}</a>}
              </div>
            ) : data?.is_active ? (
              <div>
                <img src={online} />
                <a className="text-online">Online</a>
              </div>
            ) : (
              <div>
                <img src={offline} />
                <a className="text-offline">Offline</a>
              </div>
            )}
          </div>
        );
      },
    },
    {
      title: "Tài khoản",
      align: "center",
      render: (data) => {
        return (
          <div className="div-verify">
            {!data?.is_verify && data?.is_contacted ? (
              <a className="text-nonverify">Đã liên hệ</a>
            ) : data?.is_verify ? (
              <a className="text-verify">Đã xác thực</a>
            ) : (
              <a className="text-nonverify">Chưa xác thực</a>
            )}
            {!data?.is_contacted && !data?.is_verify && (
              <div
                className={
                  checkElement?.includes("contacted_collaborator")
                    ? "btn-contacted"
                    : "btn-contacted-hide"
                }
                onClick={toggleContected}
              >
                {checkElement?.includes("contacted_collaborator") && (
                  <a className="text-contacted">Liên hệ</a>
                )}
              </div>
            )}
          </div>
        );
      },
    },
    {
      key: "action",
      align: "center",
      render: (data) => (
        <Space size="middle">
          <img
            onClick={!data?.is_verify ? toggleVerify : null}
            src={data?.is_verify ? onToggle : offToggle}
            className={
              checkElement?.includes("verify_collaborator")
                ? "img-toggle"
                : "img-toggle-hide"
            }
          />

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

  return (
    <React.Fragment>
      <div className="mt-2">
        <div className="div-header-colla">
          {checkElement?.includes("create_collaborator") && (
            <AddCollaborator
              setData={setData}
              setTotal={setTotal}
              startPage={startPage}
              status={status}
              setIsLoading={setIsLoading}
            />
          )}

          <Input
            placeholder="Tìm kiếm"
            type="text"
            className="input-search"
            prefix={<SearchOutlined />}
            onChange={(e) => {
              changeValueSearch(e.target.value);
              handleSearch(e.target.value);
            }}
          />
        </div>
        <div className="div-table mt-3">
          <Table
            columns={columns}
            dataSource={dataFilter.length > 0 ? dataFilter : data}
            pagination={false}
            rowKey={(record) => record._id}
            rowSelection={{
              selectedRowKeys,
              onChange: (selectedRowKeys, selectedRows) => {
                setSelectedRowKeys(selectedRowKeys);
              },
            }}
            onRow={(record, rowIndex) => {
              return {
                onClick: (event) => {
                  setItemEdit(record);
                },
              };
            }}
            locale={{
              emptyText:
                data.length > 0 ? <Empty /> : <Skeleton active={true} />,
            }}
            scroll={
              width <= 490
                ? {
                    x: 1600,
                  }
                : null
            }
          />
          <div className="div-pagination p-2">
            <a>Tổng: {totalFilter > 0 ? totalFilter : total}</a>
            <div>
              <Pagination
                current={currentPage}
                onChange={onChange}
                total={totalFilter > 0 ? totalFilter : total}
                showSizeChanger={false}
                pageSize={20}
              />
            </div>
          </div>
        </div>

        <div>
          <ModalCustom
            isOpen={modalLockTime}
            title={
              itemEdit?.is_locked === false
                ? "Khóa tài khoản cộng tác viên"
                : "Mở tài khoản cộng tác viên"
            }
            handleOk={() =>
              onLockTimeCollaborator(itemEdit?._id, itemEdit?.is_locked)
            }
            textOk={itemEdit?.is_locked === false ? "Khóa" : "Mở"}
            handleCancel={toggleLockTime}
            body={
              <>
                {itemEdit?.is_locked === false
                  ? "Bạn có muốn khóa tài khoản cộng tác viên"
                  : "Bạn có muốn kích hoạt tài khoản cộng tác viên"}
                <h3>{itemEdit?.full_name}</h3>
                {itemEdit?.is_locked === false && (
                  <>
                    <Checkbox
                      checked={checkLock}
                      onChange={(e) => setCheckLock(e.target.checked)}
                    >
                      Khoá theo thời gian (nếu không chọn sẽ khoá vĩnh viễn)
                    </Checkbox>
                    {checkLock && (
                      <InputCustom
                        title={"*Thời gian khoá (hh:mm)"}
                        type="datetime-local"
                        className="text-input"
                        onChange={(e) => setTimeValue(e.target.value)}
                      />
                    )}
                  </>
                )}
              </>
            }
          />
        </div>
        <div>
          <ModalCustom
            isOpen={modalVerify}
            title="Xác thực tài khoản cộng tác viên"
            handleOk={() =>
              onVerifyCollaborator(itemEdit?._id, itemEdit?.is_verify)
            }
            textOk="Xác thực"
            handleCancel={toggleVerify}
            body={
              <>
                <a>Bạn có muốn xác thực tài khoản cộng tác viên</a>
                <h3>{itemEdit?.full_name}</h3>
              </>
            }
          />
        </div>
        {/* <div>
          <Modal isOpen={modalBlock} toggle={toggleBlock}>
            <ModalHeader toggle={toggleBlock}>
              {" "}
              {itemEdit?.is_active === true
                ? "Khóa tài khoản cộng tác viên"
                : "Mở tài khoản cộng tác viên"}
            </ModalHeader>
            <ModalBody>
              {itemEdit?.is_active === true
                ? "Bạn có muốn khóa tài khoản cộng tác viên"
                : "Bạn có muốn mở khoá tài khoản cộng tác viên"}
              <h3>{itemEdit?.full_name}</h3>
            </ModalBody>
            <ModalFooter>
              <Button
                color="primary"
                onClick={() =>
                  blockCollaborator(itemEdit?._id, itemEdit?.is_active)
                }
              >
                Có
              </Button>
              <Button color="#ddd" onClick={toggleBlock}>
                Không
              </Button>
            </ModalFooter>
          </Modal>
        </div> */}

        <div>
          <ModalCustom
            isOpen={modal}
            title="Xóa cộng tác viên"
            handleOk={() => onDelete(itemEdit?._id)}
            textOk="Xoá"
            handleCancel={toggle}
            body={
              <a>
                Bạn có chắc muốn xóa cộng tác viên
                <a className="text-name-modal">{itemEdit?.full_name}</a> này
                không?
              </a>
            }
          />
        </div>
        <div>
          <ModalCustom
            isOpen={modalContected}
            title="Liên hệ công tác viên"
            handleOk={() => onContected(itemEdit?._id)}
            textOk="Liên hệ"
            handleCancel={toggleContected}
            body={
              <a>
                Bạn có chắc đã liên hệ cộng tác viên
                <a className="text-name-modal">{itemEdit?.full_name}</a> này
                không?
              </a>
            }
          />
        </div>

        <FloatButton.BackTop />
        {isLoading && <LoadingPagination />}
      </div>
    </React.Fragment>
  );
};

export default CollaboratorManage;
