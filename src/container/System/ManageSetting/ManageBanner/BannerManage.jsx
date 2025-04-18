import { SearchOutlined } from "@ant-design/icons";
import { UilEllipsisV } from "@iconscout/react-unicons";
import { Dropdown, Image, Input, Pagination, Space, Switch, Table } from "antd";
import _debounce from "lodash/debounce";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  activeBanner,
  deleteBanner,
  searchBanners,
} from "../../../../api/banner";

import AddBanner from "../../../../components/addBanner/addBanner";
import EditBanner from "../../../../components/editBanner/editBanner";
import ModalCustom from "../../../../components/modalCustom";
import { errorNotify } from "../../../../helper/toast";
import { getBanners } from "../../../../redux/actions/banner";
import { loadingAction } from "../../../../redux/actions/loading";
import {
  getElementState,
  getLanguageState,
} from "../../../../redux/selectors/auth";
import { getBanner, getBannerTotal } from "../../../../redux/selectors/banner";
import "./BannerManage.scss";
import i18n from "../../../../i18n";

const BannerManage = () => {
  const [dataFilter, setDataFilter] = useState([]);
  const [totalFilter, setTotalFilter] = useState(0);
  const [valueSearch, setValueSearch] = useState("");
  const [modalBlock, setModalBlock] = useState(false);
  const [modal, setModal] = useState(false);
  const [itemEdit, setItemEdit] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [startPage, setStartPage] = useState(0);
  const toggle = () => setModal(!modal);
  const toggleBlock = () => setModalBlock(!modalBlock);
  const banners = useSelector(getBanner);
  const totalBanner = useSelector(getBannerTotal);
  const checkElement = useSelector(getElementState);
  const lang = useSelector(getLanguageState);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getBanners.getBannersRequest({ start: 0, length: 20 }));
  }, [dispatch]);

  const onDelete = useCallback(
    (id) => {
      dispatch(loadingAction.loadingRequest(true));
      deleteBanner(id, { is_delete: true })
        .then((res) => {
          dispatch(
            getBanners.getBannersRequest({ start: startPage, length: 20 })
          );
          setModal(false);
          dispatch(loadingAction.loadingRequest(false));
        })
        .catch((err) => {
          errorNotify({
            message: err?.message,
          });
          dispatch(loadingAction.loadingRequest(false));
        });
    },
    [startPage, dispatch]
  );

  const blockBanner = useCallback(
    (id, is_active) => {
      dispatch(loadingAction.loadingRequest(true));

      activeBanner(id, { is_active: is_active ? false : true })
        .then((res) => {
          dispatch(
            getBanners.getBannersRequest({ start: startPage, length: 20 })
          );
          setModalBlock(false);
          dispatch(loadingAction.loadingRequest(false));
        })
        .catch((err) => {
          errorNotify({
            message: err?.message,
          });
          dispatch(loadingAction.loadingRequest(false));
        });
    },
    [startPage, dispatch]
  );

  const handleSearch = _debounce((value) => {
    setValueSearch(value);
    searchBanners(value)
      .then((res) => setDataFilter(res.data))
      .catch((err) => console.log(err));
  }, 1000);

  const onChange = (page) => {
    setCurrentPage(page);
    const lengthData = banners.length < 20 ? 20 : banners.length;
    const lengthSearch = dataFilter.length < 20 ? 20 : dataFilter.length;
    const start =
      dataFilter.length > 0
        ? page * lengthSearch - lengthSearch
        : page * lengthData - lengthData;

    setStartPage(start);

    dataFilter.length > 0
      ? searchBanners(valueSearch)
          .then((res) => {
            setDataFilter(res.data);
            setTotalFilter(res.totalItem);
          })
          .catch((err) => console.log(err))
      : dispatch(
          getBanners.getBannersRequest({
            start: start,
            length: 20,
          })
        );
  };

  const items = [
    {
      key: "1",
      label: checkElement?.includes("edit_banner") && (
        <EditBanner data={itemEdit} />
      ),
    },
    {
      key: "2",
      label: checkElement?.includes("delete_banner") && (
        <p style={{ margin: 0 }} onClick={toggle}>{`${i18n.t("delete", {
          lng: lang,
        })}`}</p>
      ),
    },
  ];

  const columns = [
    {
      title: `${i18n.t("name", { lng: lang })}`,
      render: (data) => <p className="text-title-banner">{data?.title}</p>,
      width: "30%",
    },
    {
      title: "Type link",
      render: (data) => <p className="text-title-banner">{data?.type_link}</p>,
      align: "center",
    },
    {
      title: `${i18n.t("position", { lng: lang })}`,
      render: (data) => <p className="text-title-banner">{data?.position}</p>,
      align: "center",
    },
    {
      title: "Link ID",
      render: (data) => {
        return (
          <p className="text-link">
            {data?.link_id.length > 30
              ? data?.link_id.slice(0, 30) + "..."
              : data?.link_id}
          </p>
        );
      },
    },
    {
      title: `${i18n.t("image", { lng: lang })}`,
      render: (data) => {
        return (
          <Image
            src={data?.image}
            style={{ width: 200, height: 80, borderRadius: 8 }}
          />
        );
      },
    },
    {
      title: "",
      key: "action",
      render: (data) => (
        <Space size="middle">
          {checkElement?.includes("active_banner") && (
            <Switch
              checked={data?.is_active}
              onClick={toggleBlock}
              style={{ backgroundColor: data?.is_active ? "#00cf3a" : "" }}
            />
          )}
          <Dropdown
            menu={{
              items,
            }}
            placement="bottomRight"
            trigger={["click"]}
          >
            <UilEllipsisV />
          </Dropdown>
        </Space>
      ),
    },
  ];

  return (
    <React.Fragment>
      <div className="mt-2 p-3">
        <div className="div-header-banner">
          <Input
            placeholder={`${i18n.t("search", { lng: lang })}`}
            type="text"
            prefix={<SearchOutlined />}
            onChange={(e) => handleSearch(e.target.value)}
          />
          {checkElement?.includes("create_banner") && <AddBanner />}
        </div>
        <div className="mt-3">
          <Table
            columns={columns}
            dataSource={banners}
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
            <p>
              {`${i18n.t("total", { lng: lang })}`}:{" "}
              {totalFilter > 0 ? totalFilter : totalBanner}
            </p>
            <div>
              <Pagination
                current={currentPage}
                onChange={onChange}
                total={totalFilter > 0 ? totalFilter : totalBanner}
                showSizeChanger={false}
                pageSize={20}
              />
            </div>
          </div>
        </div>

        <div>
          <ModalCustom
            isOpen={modal}
            title={`${i18n.t("delete_banner", { lng: lang })}`}
            handleOk={() => onDelete(itemEdit?._id)}
            handleCancel={toggle}
            textOk={`${i18n.t("delete", { lng: lang })}`}
            body={
              <>
                <p>{`${i18n.t("want_delete_banner", { lng: lang })}`}</p>
                <p className="text-name-modal">{itemEdit?.title}</p>
              </>
            }
          />
        </div>

        <div>
          <ModalCustom
            isOpen={modalBlock}
            title={
              itemEdit?.is_active === true
                ? `${i18n.t("lock", { lng: lang })} banners`
                : `${i18n.t("unlock", { lng: lang })} banners`
            }
            handleOk={() => blockBanner(itemEdit?._id, itemEdit?.is_active)}
            handleCancel={toggleBlock}
            textOk={
              itemEdit?.is_active === true
                ? `${i18n.t("lock", { lng: lang })}`
                : `${i18n.t("unlock", { lng: lang })}`
            }
            body={
              <>
                {itemEdit?.is_active === true
                  ? `${i18n.t("want_lock_banner", { lng: lang })}`
                  : `${i18n.t("want_unlock_banner", { lng: lang })}`}
                <h6>{itemEdit?.title}</h6>
              </>
            }
          />
        </div>
      </div>
    </React.Fragment>
  );
};

export default BannerManage;
