import React, { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { searchBanners } from "../../../../api/banner";
import { UilEllipsisV } from "@iconscout/react-unicons";
import { SearchOutlined } from "@ant-design/icons";
import AddBanner from "../../../../components/addBanner/addBanner";
import { getBanners } from "../../../../redux/actions/banner";
import { getPromotion } from "../../../../redux/actions/promotion";
import { getBanner, getBannerTotal } from "../../../../redux/selectors/banner";
import "./BannerManage.scss";
import _debounce from "lodash/debounce";
import { Dropdown, Image, Pagination, Space, Table, Input } from "antd";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";
import EditBanner from "../../../../components/editBanner/editBanner";
import { activeBanner, deleteBanner } from "../../../../api/banner";
import { loadingAction } from "../../../../redux/actions/loading";
import onToggle from "../../../../assets/images/on-button.png";
import offToggle from "../../../../assets/images/off-button.png";
import { errorNotify } from "../../../../helper/toast";

export default function BannerManage() {
  const [dataFilter, setDataFilter] = useState([]);
  const [totalFilter, setTotalFilter] = useState(0);
  const [valueSearch, setValueSearch] = useState("");
  const [modalEdit, setModalEdit] = React.useState(false);
  const [modalBlock, setModalBlock] = React.useState(false);
  const [modal, setModal] = React.useState(false);
  const [itemEdit, setItemEdit] = React.useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const toggle = () => setModal(!modal);
  const toggleBlock = () => setModalBlock(!modalBlock);
  const banners = useSelector(getBanner);
  const totalBanner = useSelector(getBannerTotal);
  const dispatch = useDispatch();
  React.useEffect(() => {
    dispatch(getBanners.getBannersRequest(0, 10));
  }, [dispatch]);

  const onDelete = useCallback((id) => {
    dispatch(loadingAction.loadingRequest(true));
    deleteBanner(id, { is_delete: true })
      .then((res) => {
        dispatch(getBanners.getBannersRequest(0, 10));
        setModal(false);
        dispatch(loadingAction.loadingRequest(false));
      })
      .catch((err) => {
        errorNotify({
          message: err,
        });
        dispatch(loadingAction.loadingRequest(false));
      });
  }, []);

  const blockBanner = useCallback((id, is_active) => {
    dispatch(loadingAction.loadingRequest(true));
    if (is_active === true) {
      activeBanner(id, { is_active: false })
        .then((res) => {
          dispatch(getBanners.getBannersRequest(0, 10));
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
          dispatch(getBanners.getBannersRequest(0, 10));
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
  }, []);

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

    dataFilter.length > 0
      ? searchBanners(valueSearch)
          .then((res) => {
            setDataFilter(res.data);
            setTotalFilter(res.totalItem);
          })
          .catch((err) => console.log(err))
      : dispatch(
          getPromotion.getPromotionRequest({
            start: start > 0 ? start : 0,
            length: 10,
          })
        );
  };

  const items = [
    {
      key: "1",
      label: (
        <a
          onClick={() => {
            setModalEdit(!modalEdit);
          }}
        >
          Chỉnh sửa
        </a>
      ),
    },
    {
      key: "2",
      label: <a onClick={toggle}> Xoá</a>,
    },
  ];

  const columns = [
    {
      title: "Tên banner",
      render: (data) => <a className="text-title-banner">{data?.title}</a>,
    },
    {
      title: "Type link",
      render: (data) => <a className="text-title-banner">{data?.type_link}</a>,
    },
    {
      title: "Position",
      render: (data) => <a className="text-title-banner">{data?.position}</a>,
    },
    {
      title: "Link ID",
      render: (data) => {
        return (
          <a className="text-link">
            {data?.link_id.length > 60
              ? data?.link_id.slice(0, 60) + "..."
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
          {data?.is_active ? (
            <img
              className="img-unlock-banner"
              src={onToggle}
              onClick={toggleBlock}
            />
          ) : (
            <img
              className="img-unlock-banner"
              src={offToggle}
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
          <AddBanner />
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
          <EditBanner
            state={modalEdit}
            setState={() => setModalEdit(!modalEdit)}
            data={itemEdit}
          />
        </div>

        <div>
          <Modal isOpen={modal} toggle={toggle}>
            <ModalHeader toggle={toggle}>Xóa banner</ModalHeader>
            <ModalBody>
              <a>
                Bạn có chắc muốn xóa banner{" "}
                <a className="text-name-modal">{itemEdit?.title}</a> này không?
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
          <Modal isOpen={modalBlock} toggle={toggleBlock}>
            <ModalHeader toggle={toggleBlock}>
              {" "}
              {itemEdit?.is_active === true ? "Khóa banners" : "Mở banners"}
            </ModalHeader>
            <ModalBody>
              {itemEdit?.is_active === true
                ? "Bạn có muốn khóa banner này"
                : "Bạn có muốn kích hoạt banner này"}
              <h3>{itemEdit?.title}</h3>
            </ModalBody>
            <ModalFooter>
              <Button
                color="primary"
                onClick={() => blockBanner(itemEdit?._id, itemEdit?.is_active)}
              >
                Có
              </Button>
              <Button color="#ddd" onClick={toggleBlock}>
                Không
              </Button>
            </ModalFooter>
          </Modal>
        </div>
      </div>
    </React.Fragment>
  );
}
