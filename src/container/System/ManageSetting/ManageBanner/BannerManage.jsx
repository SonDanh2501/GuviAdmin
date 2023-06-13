import { SearchOutlined } from "@ant-design/icons";
import { UilEllipsisV } from "@iconscout/react-unicons";
import { Dropdown, Image, Input, Pagination, Space, Table } from "antd";
import _debounce from "lodash/debounce";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  activeBanner,
  deleteBanner,
  searchBanners,
} from "../../../../api/banner";
import offToggle from "../../../../assets/images/off-button.png";
import onToggle from "../../../../assets/images/on-button.png";
import AddBanner from "../../../../components/addBanner/addBanner";
import EditBanner from "../../../../components/editBanner/editBanner";
import ModalCustom from "../../../../components/modalCustom";
import { errorNotify } from "../../../../helper/toast";
import { getBanners } from "../../../../redux/actions/banner";
import { loadingAction } from "../../../../redux/actions/loading";
import { getElementState } from "../../../../redux/selectors/auth";
import { getBanner, getBannerTotal } from "../../../../redux/selectors/banner";
import "./BannerManage.scss";

const BannerManage = () => {
  const [dataFilter, setDataFilter] = useState([]);
  const [totalFilter, setTotalFilter] = useState(0);
  const [valueSearch, setValueSearch] = useState("");
  const [modalEdit, setModalEdit] = React.useState(false);
  const [modalBlock, setModalBlock] = React.useState(false);
  const [modal, setModal] = React.useState(false);
  const [itemEdit, setItemEdit] = React.useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [startPage, setStartPage] = useState(0);
  const toggle = () => setModal(!modal);
  const toggleBlock = () => setModalBlock(!modalBlock);
  const banners = useSelector(getBanner);
  const totalBanner = useSelector(getBannerTotal);
  const checkElement = useSelector(getElementState);
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
            message: err,
          });
          dispatch(loadingAction.loadingRequest(false));
        });
    },
    [startPage]
  );

  const blockBanner = useCallback(
    (id, is_active) => {
      dispatch(loadingAction.loadingRequest(true));
      if (is_active === true) {
        activeBanner(id, { is_active: false })
          .then((res) => {
            dispatch(
              getBanners.getBannersRequest({ start: startPage, length: 20 })
            );
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
        activeBanner(id, { is_active: true })
          .then((res) => {
            dispatch(
              getBanners.getBannersRequest({ start: startPage, length: 20 })
            );
            setModalBlock(false);
            dispatch(loadingAction.loadingRequest(false));
          })
          .catch((err) => {
            errorNotify({
              message: err,
            });
            dispatch(loadingAction.loadingRequest(false));
          });
      }
    },
    [startPage, getBanners, loadingAction]
  );

  const handleSearch = useCallback(
    _debounce((value) => {
      setValueSearch(value);
      searchBanners(value)
        .then((res) => setDataFilter(res.data))
        .catch((err) => console.log(err));
    }, 1000),
    []
  );

  const onChange = (page) => {
    setCurrentPage(page);
    const start =
      dataFilter.length > 0
        ? page * dataFilter.length - dataFilter.length
        : page * banners.length - banners.length;

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
            start: start > 0 ? start : 0,
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
        <a onClick={toggle}> Xoá</a>
      ),
    },
  ];

  const columns = [
    {
      title: "Tên banner",
      render: (data) => <a className="text-title-banner">{data?.title}</a>,
      width: "30%",
    },
    {
      title: "Type link",
      render: (data) => <a className="text-title-banner">{data?.type_link}</a>,
      align: "center",
    },
    {
      title: "Vị trí",
      render: (data) => <a className="text-title-banner">{data?.position}</a>,
      align: "center",
    },
    {
      title: "Link ID",
      render: (data) => {
        return (
          <a className="text-link">
            {data?.link_id.length > 30
              ? data?.link_id.slice(0, 30) + "..."
              : data?.link_id}
          </a>
        );
      },
    },
    {
      title: "Hình",
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
            <img
              className="img-unlock-banner"
              src={data?.is_active ? onToggle : offToggle}
              onClick={toggleBlock}
            />
          )}
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
        <div className="div-header-banner">
          <Input
            placeholder="Tìm kiếm"
            type="text"
            className="field-search"
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
            <a>Tổng: {totalFilter > 0 ? totalFilter : totalBanner}</a>
            <div>
              <Pagination
                current={currentPage}
                onChange={onChange}
                total={totalFilter > 0 ? totalFilter : totalBanner}
                showSizeChanger={false}
              />
            </div>
          </div>
        </div>

        <div>
          <ModalCustom
            isOpen={modal}
            title="Xóa banner"
            handleOk={() => onDelete(itemEdit?._id)}
            handleCancel={toggle}
            textOk="Xoá"
            body={
              <a>
                Bạn có chắc muốn xóa banner{" "}
                <a className="text-name-modal">{itemEdit?.title}</a> này không?
              </a>
            }
          />
        </div>

        <div>
          <ModalCustom
            isOpen={modalBlock}
            title={itemEdit?.is_active === true ? "Khóa banners" : "Mở banners"}
            handleOk={() => blockBanner(itemEdit?._id, itemEdit?.is_active)}
            handleCancel={toggleBlock}
            textOk={itemEdit?.is_active === true ? "Khóa" : "Mở"}
            body={
              <>
                {itemEdit?.is_active === true
                  ? "Bạn có muốn khóa banner này"
                  : "Bạn có muốn kích hoạt banner này"}
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
