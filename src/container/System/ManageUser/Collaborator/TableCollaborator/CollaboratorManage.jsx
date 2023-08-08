import { SearchOutlined } from "@ant-design/icons";
import {
  Checkbox,
  Dropdown,
  Empty,
  FloatButton,
  Input,
  Pagination,
  Select,
  Skeleton,
  Space,
  Switch,
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
import { Link } from "react-router-dom";
import AddCollaborator from "../../../../../components/addCollaborator/addCollaborator.js";
import ModalCustom from "../../../../../components/modalCustom/index.jsx";
import LoadingPagination from "../../../../../components/paginationLoading/index.jsx";
import InputCustom from "../../../../../components/textInputCustom/index.jsx";
import i18n from "../../../../../i18n/index.js";
import {
  getElementState,
  getLanguageState,
} from "../../../../../redux/selectors/auth.js";
import { useCookies } from "../../../../../helper/useCookies.js";
import useWindowDimensions from "../../../../../helper/useWindowDimensions.js";
import { useWindowScrollPositions } from "../../../../../helper/useWindowPosition.js";
import { getProvince } from "../../../../../redux/selectors/service.js";

const CollaboratorManage = (props) => {
  const { status } = props;
  const [currentPage, setCurrentPage] = useState(1);
  const [startPage, setStartPage] = useState(0);
  const [valueSearch, setValueSearch] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [itemEdit, setItemEdit] = useState([]);
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [modal, setModal] = useState(false);
  const [modalVerify, setModalVerify] = useState(false);
  const [modalLockTime, setModalLockTime] = useState(false);
  const [modalContected, setModalContected] = useState(false);
  const [checkLock, setCheckLock] = useState(false);
  const [timeValue, setTimeValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [city, setCity] = useState("");
  const toggle = () => setModal(!modal);
  const toggleContected = () => setModalContected(!modalContected);
  const toggleVerify = () => setModalVerify(!modalVerify);
  const toggleLockTime = () => setModalLockTime(!modalLockTime);
  const checkElement = useSelector(getElementState);
  const lang = useSelector(getLanguageState);
  const cityOptions = [
    {
      value: "",
      label: "Tất cả",
    },
  ];
  const province = useSelector(getProvince);
  const dispatch = useDispatch();
  const [saveToCookie, readCookie] = useCookies();
  const { width } = useWindowDimensions();
  const { scrollX, scrollY } = useWindowScrollPositions();

  useEffect(() => {
    window.scroll(0, Number(readCookie("table_y_ctv")));
    setCurrentPage(
      readCookie("page_ctv") === "" ? 1 : Number(readCookie("page_ctv"))
    );
    setStartPage(
      readCookie("start_page_ctv") === ""
        ? 0
        : Number(readCookie("start_page_ctv"))
    );
    setCity(
      readCookie("ctv-city") === "" ? "" : Number(readCookie("ctv-city"))
    );
  }, []);

  useEffect(() => {
    fetchCollaborators(
      lang,
      Number(readCookie("start_page_ctv")),
      20,
      readCookie("tab_collaborator") === "online"
        ? "online"
        : readCookie("tab_collaborator"),
      valueSearch,
      readCookie("ctv-city") === "" ? "" : Number(readCookie("ctv-city"))
    )
      .then((res) => {
        setData(res?.data);
        setTotal(res?.totalItems);
      })
      .catch((err) => {});
  }, [status]);

  province?.map((item) => {
    cityOptions?.push({
      value: item?.code,
      label: item?.name,
    });
  });

  const onFilterCity = (value) => {
    setCity(value);
    saveToCookie("ctv-city", value);
    fetchCollaborators(lang, startPage, 20, status, valueSearch, value)
      .then((res) => {
        setData(res?.data);
        setTotal(res?.totalItems);
      })
      .catch((err) => {});
  };

  const onChange = (page) => {
    setCurrentPage(page);
    saveToCookie("page_ctv", page);
    const lenghtData = data.length < 20 ? 20 : data.length;
    const start = page * lenghtData - lenghtData;
    setStartPage(start);
    saveToCookie("start_page_ctv", start);
    fetchCollaborators(lang, start, 20, status, valueSearch, city)
      .then((res) => {
        setData(res?.data);
        setTotal(res?.totalItems);
        window.scroll(0, 0);
      })
      .catch((err) => {});
  };

  const handleSearch = useCallback(
    _debounce((value) => {
      fetchCollaborators(lang, 0, 20, status, value, city)
        .then((res) => {
          setData(res.data);
          setTotal(res.totalItems);
        })
        .catch((err) => {
          errorNotify({
            message: err,
          });
        });
    }, 1000),
    [status, city]
  );

  const onDelete = useCallback(
    (id) => {
      setIsLoading(true);
      deleteCollaborator(id, { is_delete: true })
        .then((res) => {
          fetchCollaborators(lang, startPage, 20, status, valueSearch, city)
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
    [startPage, status, valueSearch, city]
  );

  const onLockTimeCollaborator = useCallback(
    (id, is_lock_time) => {
      setIsLoading(true);
      if (is_lock_time === true) {
        lockTimeCollaborator(id, { is_locked: false })
          .then((res) => {
            fetchCollaborators(lang, startPage, 20, status, valueSearch, city)
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
            fetchCollaborators(lang, startPage, 20, status, valueSearch, city)
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
    [timeValue, dispatch, startPage, status, valueSearch, city]
  );
  const onVerifyCollaborator = useCallback(
    (id, is_verify) => {
      setIsLoading(true);
      verifyCollaborator(id)
        .then((res) => {
          fetchCollaborators(lang, startPage, 20, status, valueSearch, city)
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
    },
    [startPage, status, valueSearch, city]
  );

  const onContected = useCallback(
    (id) => {
      setIsLoading(true);
      changeContactedCollaborator(id)
        .then((res) => {
          fetchCollaborators(lang, startPage, 20, status, valueSearch, city)
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
    [startPage, status, valueSearch, city]
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
          {itemEdit?.is_locked
            ? `${i18n.t("unlock", { lng: lang })}`
            : `${i18n.t("lock", { lng: lang })}`}
        </a>
      ),
    },
    {
      key: "2",
      label: checkElement?.includes("delete_collaborator") && (
        <a onClick={toggle}>{`${i18n.t("delete", { lng: lang })}`}</a>
      ),
    },
  ];

  const columns = [
    {
      title: () => {
        return (
          <a className="title-column">{`${i18n.t("code_collaborator", {
            lng: lang,
          })}`}</a>
        );
      },
      render: (data) => (
        <Link
          onClick={() => {
            saveToCookie("table_x_ctv", scrollX);
            saveToCookie("table_y_ctv", scrollY);
            saveToCookie("tab-detail-ctv", "1");
          }}
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
      title: () => {
        return (
          <a className="title-column">{`${i18n.t("name", { lng: lang })}`}</a>
        );
      },
      render: (data) => {
        return (
          <Link
            onClick={() => {
              saveToCookie("table_x_ctv", scrollX);
              saveToCookie("table_y_ctv", scrollY);
              saveToCookie("tab-detail-ctv", "1");
            }}
            to={
              checkElement?.includes("detail_collaborator")
                ? `/details-collaborator/${data?._id}`
                : ""
            }
            className="div-collaborator"
          >
            <img className="img_collaborator" src={data?.avatar} />
            <div className="div-name-collaborator">
              <a className="text-name-collaborator">{data?.full_name}</a>
              <a className="text-phone-collaborator">{data?.phone}</a>
            </div>
          </Link>
        );
      },
      // sorter: (a, b) => a.full_name.localeCompare(b.full_name),
    },
    {
      title: () => {
        return (
          <a className="title-column">{`${i18n.t("date_create", {
            lng: lang,
          })}`}</a>
        );
      },
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
      title: () => {
        return (
          <a className="title-column">{`${i18n.t("sdt", { lng: lang })}`}</a>
        );
      },
      render: (data) => <a className="text-phone-ctv">{data?.phone}</a>,
      align: "center",
    },
    {
      title: () => {
        return <a className="title-column">Khu vực</a>;
      },
      render: (data) => {
        return (
          <div>
            {province?.map((item, key) => {
              return (
                <div key={key}>
                  {item?.code === data?.city ? (
                    <a>
                      {item?.name?.replace(
                        new RegExp(`${"Thành phố"}|${"Tỉnh"}`),
                        ""
                      )}
                    </a>
                  ) : (
                    ""
                  )}
                </div>
              );
            })}
          </div>
        );
      },
    },
    {
      title: () => {
        return (
          <a className="title-column">{`${i18n.t("status", { lng: lang })}`}</a>
        );
      },
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
      title: () => {
        return (
          <a className="title-column">{`${i18n.t("account", {
            lng: lang,
          })}`}</a>
        );
      },
      align: "center",
      render: (data) => {
        return (
          <div className="div-verify">
            {!data?.is_verify && data?.is_contacted ? (
              <a className="text-nonverify">{`${i18n.t("contacted", {
                lng: lang,
              })}`}</a>
            ) : data?.is_verify ? (
              <a className="text-verify">{`${i18n.t("verified", {
                lng: lang,
              })}`}</a>
            ) : (
              <a className="text-nonverify">{`${i18n.t("unconfirmed", {
                lng: lang,
              })}`}</a>
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
                  <a className="text-contacted">{`${i18n.t("contact", {
                    lng: lang,
                  })}`}</a>
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
          {/* <img
            onClick={!data?.is_verify ? toggleVerify : null}
            src={data?.is_verify ? onToggle : offToggle}
            className={
              checkElement?.includes("verify_collaborator")
                ? "img-toggle"
                : "img-toggle-hide"
            }
          /> */}
          <Switch
            style={{
              width: 30,
              backgroundColor: data?.is_verify ? "#00cf3a" : "",
            }}
            onClick={toggleVerify}
            checked={data?.is_verify}
            disabled={data?.is_verify ? true : false}
            size="small"
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
          <Select
            options={cityOptions}
            style={{ width: "20%" }}
            value={city}
            onChange={onFilterCity}
            showSearch
            filterOption={(input, option) =>
              (option?.label ?? "").includes(input)
            }
            filterSort={(optionA, optionB) =>
              (optionA?.label ?? "")
                .toLowerCase()
                .localeCompare((optionB?.label ?? "").toLowerCase())
            }
          />
          <Input
            placeholder={`${i18n.t("search", { lng: lang })}`}
            type="text"
            prefix={<SearchOutlined />}
            onChange={(e) => {
              setValueSearch(e.target.value);
              handleSearch(e.target.value);
            }}
            style={{
              width: "60%",
              marginLeft: 20,
              marginTop: width < 490 ? 10 : 0,
              height: 32,
            }}
          />
          {checkElement?.includes("create_collaborator") && (
            <AddCollaborator
              setData={setData}
              setTotal={setTotal}
              startPage={startPage}
              status={status}
              setIsLoading={setIsLoading}
              valueSearch={valueSearch}
              city={city}
            />
          )}
        </div>
        <div className="div-table mt-3">
          <Table
            columns={columns}
            dataSource={data}
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
            scroll={{
              x: width < 900 ? 900 : 0,
            }}
          />
          <div className="div-pagination p-2">
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
        </div>

        <div>
          <ModalCustom
            isOpen={modalLockTime}
            title={
              itemEdit?.is_locked === false
                ? `${i18n.t("lock_collaborator", { lng: lang })}`
                : `${i18n.t("unlock_collaborator", { lng: lang })}`
            }
            handleOk={() =>
              onLockTimeCollaborator(itemEdit?._id, itemEdit?.is_locked)
            }
            textOk={
              itemEdit?.is_locked === false
                ? `${i18n.t("lock", { lng: lang })}`
                : `${i18n.t("unlock", { lng: lang })}`
            }
            handleCancel={toggleLockTime}
            body={
              <>
                {itemEdit?.is_locked === false
                  ? `${i18n.t("want_lock_collaborator", { lng: lang })}`
                  : `${i18n.t("want_unlock_collaborator", { lng: lang })}`}
                <h5>{itemEdit?.full_name}</h5>
                {itemEdit?.is_locked === false && (
                  <>
                    <Checkbox
                      checked={checkLock}
                      onChange={(e) => setCheckLock(e.target.checked)}
                    >
                      {`${i18n.t("lock_by_time", { lng: lang })}`}
                    </Checkbox>
                    {checkLock && (
                      <InputCustom
                        title={`${i18n.t("lock_time", { lng: lang })}`}
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
            title={`${i18n.t("verify_account", { lng: lang })}`}
            handleOk={() =>
              onVerifyCollaborator(itemEdit?._id, itemEdit?.is_verify)
            }
            textOk={`${i18n.t("verify", { lng: lang })}`}
            handleCancel={toggleVerify}
            body={
              <>
                <a>{`${i18n.t("want_verify_account", { lng: lang })}`}</a>
                <h5>{itemEdit?.full_name}</h5>
              </>
            }
          />
        </div>

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
            title={`${i18n.t("contact_collaborator", { lng: lang })}`}
            handleOk={() => onContected(itemEdit?._id)}
            textOk={`${i18n.t("contact", { lng: lang })}`}
            handleCancel={toggleContected}
            body={
              <>
                <a>{`${i18n.t("want_contact_collaborator", { lng: lang })}`}</a>
                <a className="text-name-modal">{itemEdit?.full_name}</a>
              </>
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
