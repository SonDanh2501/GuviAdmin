import { SearchOutlined } from "@ant-design/icons";
import {
  Checkbox,
  Dropdown,
  Empty,
  FloatButton,
  Image,
  Input,
  Pagination,
  Select,
  Space,
  Switch,
  Table,
} from "antd";
import _debounce from "lodash/debounce";
import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  changeContactedCollaborator,
  deleteCollaborator,
  fetchCollaborators,
  lockTimeCollaborator,
  verifyCollaborator,
} from "../../../../../api/collaborator.jsx";
import offline from "../../../../../assets/images/offline.svg";
import online from "../../../../../assets/images/online.svg";
import pending from "../../../../../assets/images/pending.svg";
import { errorNotify } from "../../../../../helper/toast";
import "./CollaboratorManage.scss";

import moment from "moment";
import { Link } from "react-router-dom";
import AddCollaborator from "../../../../../components/addCollaborator/addCollaborator.js";
import ModalCustom from "../../../../../components/modalCustom/index.jsx";
import LoadingPagination from "../../../../../components/paginationLoading/index.jsx";
import InputCustom from "../../../../../components/textInputCustom/index.jsx";
import { useCookies } from "../../../../../helper/useCookies.js";
import useWindowDimensions from "../../../../../helper/useWindowDimensions.js";
import { useWindowScrollPositions } from "../../../../../helper/useWindowPosition.js";
import i18n from "../../../../../i18n/index.js";
import {
  getElementState,
  getLanguageState,
  getUser,
} from "../../../../../redux/selectors/auth.js";
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
  const user = useSelector(getUser);
  const cityOptions =
    user?.area_manager_lv_1?.length === 0
      ? [
          {
            value: "",
            label: "Tất cả",
          },
        ]
      : [];
  const province = useSelector(getProvince);
  const [saveToCookie, readCookie] = useCookies();
  const { width } = useWindowDimensions();
  const { scrollX, scrollY } = useWindowScrollPositions();
  const pageStartCookie = readCookie("start_page_ctv");
  const pageCookie = readCookie("page_ctv");
  const cityCookie = readCookie("ctv-city");
  const tabCookie = readCookie("tab_collaborator");
  const yCookie = readCookie("table_y_ctv");

  useEffect(() => {
    window.scroll(0, Number(yCookie));
    setCurrentPage(pageCookie === "" ? 1 : Number(pageCookie));
    setStartPage(pageStartCookie === "" ? 0 : Number(pageStartCookie));
    setCity(
      user?.area_manager_lv_1?.length === 0
        ? cityCookie === ""
          ? ""
          : Number(cityCookie)
        : user?.area_manager_lv_1[0]
    );
  }, [pageStartCookie, pageCookie, cityCookie, yCookie, user]);

  useEffect(() => {
    fetchCollaborators(
      lang,
      Number(pageStartCookie),
      20,
      tabCookie === "online" || tabCookie === "" ? "online" : tabCookie,
      "",
      cityCookie === "" ? "" : Number(cityCookie)
    )
      .then((res) => {
        setData(res?.data);
        setTotal(res?.totalItems);
      })
      .catch((err) => {});
  }, [status, lang, tabCookie, cityCookie, pageStartCookie]);

  province?.forEach((item) => {
    if (user?.area_manager_lv_1?.length === 0) {
      cityOptions.push({
        value: item?.code,
        label: item?.name,
      });
      return;
    } else if (user?.area_manager_lv_1?.includes(item?.code)) {
      cityOptions.push({
        value: item?.code,
        label: item?.name,
      });
      return;
    }
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

  const handleSearch = _debounce((value) => {
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
  }, 1000);

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
    [startPage, status, valueSearch, city, lang]
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
    [timeValue, startPage, status, valueSearch, city, lang]
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
    [startPage, status, valueSearch, city, lang]
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
    [startPage, status, valueSearch, city, lang]
  );

  const items = [
    {
      key: "1",
      label: (
        <p
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
        </p>
      ),
    },
    {
      key: "2",
      label: checkElement?.includes("delete_collaborator") && (
        <p className="text-dropdown" onClick={toggle}>{`${i18n.t("delete", {
          lng: lang,
        })}`}</p>
      ),
    },
  ];

  const columns = [
    {
      title: () => {
        return (
          <p className="title-column">{`${i18n.t("code_collaborator", {
            lng: lang,
          })}`}</p>
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
          <p className="text-id-collaborator">{data?.id_view}</p>
        </Link>
      ),
    },
    {
      title: () => {
        return (
          <p className="title-column">{`${i18n.t("name", { lng: lang })}`}</p>
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
            <Image
              preview={false}
              className="img_collaborator"
              src={data?.avatar}
            />
            <div className="div-name-collaborator">
              <p className="text-name-collaborator">{data?.full_name}</p>
              <p className="text-phone-collaborator">{data?.phone}</p>
            </div>
          </Link>
        );
      },
      // sorter: (a, b) => a.full_name.localeCompare(b.full_name),
    },
    {
      title: () => {
        return (
          <p className="title-column">{`${i18n.t("date_create", {
            lng: lang,
          })}`}</p>
        );
      },
      render: (data) => {
        return (
          <div className="div-create-ctv">
            <p className="text-create-ctv">
              {moment(new Date(data?.date_create)).format("DD/MM/YYYY")}
            </p>
            <p className="text-create-ctv">
              {moment(new Date(data?.date_create)).format("HH:mm")}
            </p>
          </div>
        );
      },
    },
    {
      title: () => {
        return (
          <p className="title-column">{`${i18n.t("sdt", { lng: lang })}`}</p>
        );
      },
      render: (data) => <p className="text-phone-ctv">{data?.phone}</p>,
      align: "center",
    },
    {
      title: () => {
        return <p className="title-column">Khu vực</p>;
      },
      render: (data) => {
        return (
          <div>
            {province?.map((item, key) => {
              return (
                <div key={key}>
                  {item?.code === data?.city ? (
                    <p className="text-city-ctv">
                      {item?.name?.replace(
                        new RegExp(`${"Thành phố"}|${"Tỉnh"}`),
                        ""
                      )}
                    </p>
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
          <p className="title-column">{`${i18n.t("status", { lng: lang })}`}</p>
        );
      },
      align: "center",
      render: (data) => {
        const then = data?.date_lock
          ? moment(new Date(data?.date_lock)).format("DD/MM/YYYY hh:mm:ss")
          : "";
        return (
          <div>
            {!data?.is_verify ? (
              <div className="div-status-ctv">
                <Image preview={false} src={pending} className="icon-status" />
                <p className="text-pending-cola">Pending</p>
              </div>
            ) : data?.is_locked ? (
              <div>
                <div className="div-status-ctv">
                  <Image
                    preview={false}
                    src={pending}
                    className="icon-status"
                  />
                  <p className="text-lock-time">Block</p>
                </div>
                {then !== "" && <p className="text-lock-time">{then}</p>}
              </div>
            ) : data?.is_active ? (
              <div className="div-status-ctv">
                <Image preview={false} src={online} className="icon-status" />
                <p className="text-online">Online</p>
              </div>
            ) : (
              <div className="div-status-ctv">
                <Image preview={false} src={offline} className="icon-status" />
                <p className="text-offline">Offline</p>
              </div>
            )}
          </div>
        );
      },
    },
    {
      title: () => {
        return (
          <p className="title-column">{`${i18n.t("account", {
            lng: lang,
          })}`}</p>
        );
      },
      align: "center",
      render: (data) => {
        return (
          <div className="div-verify">
            {!data?.is_verify && data?.is_contacted ? (
              <p className="text-nonverify">{`${i18n.t("contacted", {
                lng: lang,
              })}`}</p>
            ) : data?.is_verify ? (
              <p className="text-verify">{`${i18n.t("verified", {
                lng: lang,
              })}`}</p>
            ) : (
              <p className="text-nonverify">{`${i18n.t("unconfirmed", {
                lng: lang,
              })}`}</p>
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
                  <p className="text-contacted">{`${i18n.t("contact", {
                    lng: lang,
                  })}`}</p>
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
          {checkElement?.includes("verify_collaborator") && (
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
          )}

          <Dropdown
            menu={{
              items,
            }}
            placement="bottom"
            trigger={["click"]}
          >
            <div>
              <i class="uil uil-ellipsis-v"></i>
            </div>
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
              emptyText: <Empty description="Không có dữ liệu" />,
            }}
            scroll={{
              x: width < 900 ? 900 : 0,
            }}
          />
          <div className="div-pagination p-2">
            <p>
              {`${i18n.t("total", { lng: lang })}`}: {total}
            </p>
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
                <p>{`${i18n.t("want_verify_account", { lng: lang })}`}</p>
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
              <p>
                Bạn có chắc muốn xóa cộng tác viên
                <strong className="text-name-modal">
                  {itemEdit?.full_name}
                </strong>{" "}
                này không?
              </p>
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
                <p>{`${i18n.t("want_contact_collaborator", { lng: lang })}`}</p>
                <p className="text-name-modal">{itemEdit?.full_name}</p>
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
