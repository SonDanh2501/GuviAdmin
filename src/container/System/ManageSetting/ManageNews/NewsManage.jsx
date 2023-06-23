import { UilEllipsisV } from "@iconscout/react-unicons";
import { SearchOutlined } from "@material-ui/icons";
import { Dropdown, Image, Input, Pagination, Space, Table } from "antd";
import _debounce from "lodash/debounce";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { activeNew, deleteNew, searchNew } from "../../../../api/news";
import offToggle from "../../../../assets/images/off-button.png";
import onToggle from "../../../../assets/images/on-button.png";
import AddNews from "../../../../components/addNews/addNews";
import EditNews from "../../../../components/editNews/editNews";
import ModalCustom from "../../../../components/modalCustom";
import { errorNotify } from "../../../../helper/toast";
import { loadingAction } from "../../../../redux/actions/loading";
import { getNews } from "../../../../redux/actions/news";
import {
  getElementState,
  getLanguageState,
} from "../../../../redux/selectors/auth";
import { getNewSelector, getNewTotal } from "../../../../redux/selectors/news";
import "./NewsManage.scss";
import i18n from "../../../../i18n";

const NewsManage = () => {
  const [dataFilter, setDataFilter] = useState([]);
  const [totalFilter, setTotalFilter] = useState(0);
  const [valueSearch, setValueSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [itemEdit, setItemEdit] = useState([]);
  const [modal, setModal] = useState(false);
  const [modalBlock, setModalBlock] = useState(false);
  const listNew = useSelector(getNewSelector);
  const totalNew = useSelector(getNewTotal);
  const toggle = () => setModal(!modal);
  const toggleBlock = () => setModalBlock(!modalBlock);
  const checkElement = useSelector(getElementState);
  const lang = useSelector(getLanguageState);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getNews.getNewsRequest({ start: 0, length: 10 }));
  }, [dispatch]);

  const handleSearch = useCallback(
    _debounce((value) => {
      setValueSearch(value);
      searchNew(0, 10, value)
        .then((res) => {
          setDataFilter(res.data);
          setTotalFilter(res.totalItem);
        })
        .catch((err) => console.log(err));
    }, 1000),
    []
  );

  const onChange = (page) => {
    setCurrentPage(page);
    const start =
      dataFilter.length > 0
        ? page * dataFilter.length - dataFilter.length
        : page * listNew.length - listNew.length;
    dataFilter.length > 0
      ? searchNew(start, 10, valueSearch)
          .then((res) => {
            setDataFilter(res.data);
            setTotalFilter(res.totalItem);
          })
          .catch((err) => console.log(err))
      : dispatch(
          getNews.getNewsRequest({
            start: start > 0 ? start : 0,
            length: 10,
          })
        );
  };

  const onDelete = useCallback((id) => {
    dispatch(loadingAction.loadingRequest(true));
    deleteNew(id)
      .then((res) => {
        dispatch(getNews.getNewsRequest({ start: 0, length: 10 }));
        dispatch(loadingAction.loadingRequest(false));
        setModal(false);
      })
      .catch((err) => {
        errorNotify({
          message: err,
        });
        dispatch(loadingAction.loadingRequest(false));
        setModal(false);
      });
  }, []);

  const blockNew = useCallback((id, is_active) => {
    dispatch(loadingAction.loadingRequest(true));
    if (is_active === true) {
      activeNew(id, { is_active: false })
        .then((res) => {
          dispatch(getNews.getNewsRequest({ start: 0, length: 10 }));
          setModalBlock(false);
          dispatch(loadingAction.loadingRequest(false));
        })
        .catch((err) => {
          errorNotify({
            message: err,
          });
          dispatch(loadingAction.loadingRequest(false));
        });
    } else {
      activeNew(id, { is_active: true })
        .then((res) => {
          dispatch(getNews.getNewsRequest({ start: 0, length: 10 }));
          setModalBlock(false);
          dispatch(loadingAction.loadingRequest(false));
        })
        .catch((err) => {
          errorNotify({
            message: err,
          });
          dispatch(loadingAction.loadingRequest(false));
          setModalBlock(false);
        });
    }
  }, []);

  const items = [
    {
      key: "1",
      label: checkElement?.includes("edit_news") && (
        <EditNews data={itemEdit} />
      ),
    },
    {
      key: "2",
      label: checkElement?.includes("delete_news") && (
        <a onClick={toggle}>{`${i18n.t("delete", { lng: lang })}`}</a>
      ),
    },
  ];

  const columns = [
    {
      title: `${i18n.t("title", { lng: lang })}`,
      render: (data) => <a className="text-title-new">{data?.title}</a>,
    },
    {
      title: `${i18n.t("short_description", { lng: lang })}`,
      render: (data) => (
        <a className="text-description-new">{data?.short_description}</a>
      ),
    },
    {
      title: "Link",
      render: (data) => {
        return (
          <a className="text-link-new">
            {data?.url.length > 30 ? data?.url.slice(0, 30) + "..." : data?.url}
          </a>
        );
      },
    },
    {
      title: `${i18n.t("type", { lng: lang })}`,
      render: (data) => <a className="text-new">{data?.type}</a>,
    },
    {
      title: `${i18n.t("position", { lng: lang })}`,
      render: (data) => <a className="text-title-new">{data?.position}</a>,
      align: "center",
    },
    {
      title: `${i18n.t("image", { lng: lang })}`,
      render: (data) => {
        return (
          <Image
            src={data?.thumbnail}
            style={{ width: 100, height: 100, borderRadius: 8 }}
          />
        );
      },
      align: "center",
    },
    {
      key: "action",
      render: (data) => (
        <div>
          {checkElement?.includes("active_news") && (
            <img
              className="img-unlock-banner"
              src={data?.is_active ? onToggle : offToggle}
              onClick={toggleBlock}
            />
          )}
        </div>
      ),
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
            <a className="icon-menu">
              <UilEllipsisV />
            </a>
          </Dropdown>
        </Space>
      ),
    },
  ];

  return (
    <React.Fragment>
      <div className="mt-2 p-3">
        <div className="div-header-new">
          <Input
            placeholder={`${i18n.t("search", { lng: lang })}`}
            type="text"
            className="field-search"
            prefix={<SearchOutlined />}
            onChange={(e) => handleSearch(e.target.value)}
          />
          {checkElement?.includes("create_news") && <AddNews />}
        </div>
        <div className="mt-3">
          <Table
            columns={columns}
            dataSource={listNew}
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
          />

          <div className="mt-2 div-pagination p-2">
            <a>
              {`${i18n.t("total", { lng: lang })}`}:{" "}
              {totalFilter > 0 ? totalFilter : totalNew}
            </a>
            <div>
              <Pagination
                current={currentPage}
                onChange={onChange}
                total={totalFilter > 0 ? totalFilter : totalNew}
                showSizeChanger={false}
              />
            </div>
          </div>
        </div>

        <div>
          <ModalCustom
            isOpen={modalBlock}
            title={
              itemEdit?.is_active === true
                ? `${i18n.t("post_lock", { lng: lang })}`
                : `${i18n.t("post_unlock", { lng: lang })}`
            }
            handleOk={() => blockNew(itemEdit?._id, itemEdit?.is_active)}
            handleCancel={toggleBlock}
            textOk={
              itemEdit?.is_active === true
                ? `${i18n.t("lock", { lng: lang })}`
                : `${i18n.t("unlock", { lng: lang })}`
            }
            body={
              <>
                {itemEdit?.is_active === true
                  ? `${i18n.t("want_post_lock", { lng: lang })}`
                  : `${i18n.t("want_post_unlock", { lng: lang })}`}
                <h7> {itemEdit?.title}</h7>
              </>
            }
          />
        </div>

        <div>
          <ModalCustom
            isOpen={modal}
            title={`${i18n.t("post_delete", { lng: lang })}`}
            handleOk={() => onDelete(itemEdit?._id)}
            handleCancel={toggle}
            textOk={`${i18n.t("delete", { lng: lang })}`}
            body={
              <>
                <a>{`${i18n.t("want_post_delete", { lng: lang })}`}</a>
                <a> {itemEdit?.title}</a>
              </>
            }
          />
        </div>
      </div>
    </React.Fragment>
  );
};

export default NewsManage;
