import { UilEllipsisV } from "@iconscout/react-unicons";
import {
  Dropdown,
  Input,
  notification,
  Pagination,
  Select,
  Space,
  Table,
} from "antd";
import _debounce from "lodash/debounce";
import React, { useCallback, useEffect, useState } from "react";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { useDispatch, useSelector } from "react-redux";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import {
  activePromotion,
  filterPromotion,
  searchPromotion,
} from "../../../../api/promotion.jsx";
import AddPromotion from "../../../../components/addPromotion/addPromotion.js";
import { loadingAction } from "../../../../redux/actions/loading.js";
import {
  deletePromotionAction,
  getPromotion,
} from "../../../../redux/actions/promotion.js";

import { SearchOutlined } from "@ant-design/icons";
import moment from "moment";
import EditPromotion from "../../../../components/editPromotion/editPromotion.js";
import {
  getPromotionSelector,
  getTotalPromotion,
} from "../../../../redux/selectors/promotion.js";
import "./PromotionManage.scss";
import onToggle from "../../../../assets/images/on-button.png";
import offToggle from "../../../../assets/images/off-button.png";
import LoadingPagination from "../../../../components/paginationLoading/index.jsx";
import { getUser } from "../../../../redux/selectors/auth.js";

export default function PromotionManage({ type }) {
  const promotion = useSelector(getPromotionSelector);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalSearch, setTotalSearch] = useState("");
  const [valueSearch, setValueSearch] = useState("");
  const [totalFilter, setTotalFilter] = useState("");
  const [valueFilter, setValueFilter] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const total = useSelector(getTotalPromotion);
  const dispatch = useDispatch();
  const [dataSearch, setDataSearch] = useState([]);
  const [dataFilter, setDataFilter] = useState([]);
  const [itemEdit, setItemEdit] = React.useState([]);
  const [modalEdit, setModalEdit] = React.useState(false);
  const [modalActive, setModalActive] = React.useState(false);
  const [modal, setModal] = React.useState(false);
  const toggle = () => setModal(!modal);
  const toggleActive = () => setModalActive(!modalActive);
  const [api, contextHolder] = notification.useNotification();
  const user = useSelector(getUser);

  useEffect(() => {
    dispatch(
      getPromotion.getPromotionRequest({ start: 0, length: 10, type: type })
    );
    setDataFilter([]);
    setDataSearch([]);
    setValueFilter("");
    setValueSearch("");
  }, [type]);

  const onDelete = useCallback((id) => {
    dispatch(loadingAction.loadingRequest(true));
    dispatch(deletePromotionAction.deletePromotionRequest(id));
  }, []);

  const onActive = useCallback((id, is_active) => {
    if (is_active) {
      activePromotion(id, { is_active: false })
        .then((res) => {
          window.location.reload();
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      activePromotion(id, { is_active: true })
        .then((res) => {
          window.location.reload();
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, []);

  const onChange = (page) => {
    setCurrentPage(page);
    const start =
      dataSearch.length > 0
        ? page * dataSearch.length - dataSearch.length
        : dataFilter.length > 0
        ? page * dataFilter.length - dataFilter.length
        : page * promotion.length - promotion.length;
    dataSearch.length > 0
      ? searchPromotion(valueSearch, start, 10, type)
          .then((res) => {
            setDataSearch(res.data);
          })
          .catch((err) => console.log(err))
      : dataFilter.length > 0
      ? filterPromotion(valueFilter, start, 10, type)
          .then((res) => {
            setDataSearch(res?.data);
            setTotalSearch(res?.totalItem);
          })
          .catch((err) => console.log(err))
      : dispatch(
          getPromotion.getPromotionRequest({
            start: start > 0 ? start : 0,
            length: 10,
            type: type,
          })
        );
  };

  const handleSearch = useCallback(
    _debounce((value) => {
      setValueSearch(value);
      setIsLoading(true);
      if (value !== "") {
        searchPromotion(value, 0, 10, type)
          .then((res) => {
            setIsLoading(false);

            setDataSearch(res?.data);
            setTotalSearch(res?.totalItem);
          })
          .catch((err) => {
            setIsLoading(false);
          });
      } else {
        setIsLoading(false);
        setDataSearch([]);
      }
    }, 1000),
    [type]
  );

  const handleChange = (value) => {
    setValueFilter(value);
    setIsLoading(true);
    filterPromotion(value, 0, 10, type)
      .then((res) => {
        setIsLoading(false);
        setDataFilter(res?.data);
        setTotalFilter(res?.totalItem);
      })
      .catch((err) => {
        setIsLoading(false);
      });
  };

  const openNotificationWithIcon = () => {
    api.warning({
      message: "Mã đã quá hạn!!!",
      description:
        "Bật hoạt động cho mã này cần gia hạn thêm ngày cho mã khuyến mãi.",
      duration: 10,
    });
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
      label: user.role === "admin" && <a onClick={toggle}>Xoá</a>,
    },
  ];

  const columns = [
    {
      title: "Tên Promotion",
      render: (data) => {
        return (
          <>
            <img className="img-customer-promotion" src={data?.thumbnail} />
            <a>{data.title.vi}</a>
          </>
        );
      },
    },
    {
      title: "Position",
      dataIndex: "position",
    },
    {
      title: "Mã code",
      dataIndex: "code",
    },

    {
      title: "Hạn",
      key: "action",
      render: (data) => {
        const startDate = moment(new Date(data?.limit_start_date)).format(
          "DD/MM/YYYY"
        );
        const endDate = moment(new Date(data?.limit_end_date)).format(
          "DD/MM/YYYY"
        );
        return (
          <a>
            {data?.is_limit_date ? startDate + "-" + endDate : "Không có hạn"}
          </a>
        );
      },
    },
    {
      title: "Bật/tắt",
      render: (data) => {
        var date =
          data?.limit_end_date && moment(data?.limit_end_date.slice(0, 10));
        var now = moment();
        return (
          <div>
            {contextHolder}
            {data?.is_active ? (
              <img
                src={onToggle}
                className="img-toggle"
                onClick={toggleActive}
              />
            ) : (
              <div>
                {data?.is_limit_date ? (
                  date < now ? (
                    <img
                      src={offToggle}
                      className="img-toggle"
                      onClick={() => openNotificationWithIcon("warning")}
                    />
                  ) : (
                    <img
                      src={offToggle}
                      className="img-toggle"
                      onClick={toggleActive}
                    />
                  )
                ) : (
                  <img
                    src={offToggle}
                    className="img-toggle"
                    onClick={toggleActive}
                  />
                )}
              </div>
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
            {data?.status === "upcoming" ? (
              <a style={{ color: "green" }}>Sắp diễn ra</a>
            ) : data?.status === "doing" ? (
              <a style={{ color: "green" }}>Đang diễn ra</a>
            ) : data?.status === "out_of_stock" ? (
              <a style={{ color: "red" }}>Hết số lượng</a>
            ) : data?.status === "out_of_date" ? (
              <a style={{ color: "red" }}>Hết hạn</a>
            ) : (
              <a style={{ color: "red" }}>Kết thúc</a>
            )}
          </div>
        );
      },
    },
    {
      title: "",
      key: "action",
      render: (record) => (
        <Space size="middle">
          <Dropdown
            menu={{
              items,
            }}
            trigger={["click"]}
            placement="bottom"
          >
            <a style={{ color: "black" }}>
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
        <div className="div-header-promotion">
          <Select
            defaultValue="Lọc theo trạng thái"
            size={"large"}
            style={{ width: 190 }}
            onChange={handleChange}
            value={valueFilter}
            options={[
              { value: "", label: "Lọc theo trạng thái" },
              { value: "upcoming", label: "Sắp diễn ra" },
              { value: "doing", label: "Đang diễn ra" },
              { value: "out_of_stock", label: "Hết số lượng" },
              { value: "out_of_date", label: "Hết hạn" },
              { value: "done", label: "Kết thúc" },
            ]}
          />
          <Input
            placeholder="Tìm kiếm"
            type="text"
            className="input-search"
            prefix={<SearchOutlined />}
            onChange={(e) => handleSearch(e.target.value)}
          />
          <AddPromotion />
        </div>
        <div className="mt-3">
          <Table
            columns={columns}
            dataSource={
              dataSearch.length > 0
                ? dataSearch
                : dataFilter.length > 0
                ? dataFilter
                : promotion
            }
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
            // locale={{
            //   emptyText:
            //     promotion.length > 0 ? <Empty /> : <Skeleton active={true} />,
            // }}
          />
          <div className="div-pagination p-2">
            <a>
              Tổng:{" "}
              {dataSearch.length > 0
                ? totalSearch
                : dataFilter.length > 0
                ? totalFilter
                : total}
            </a>
            <div>
              <Pagination
                current={currentPage}
                onChange={onChange}
                total={
                  dataSearch.length > 0
                    ? totalSearch
                    : dataFilter.length > 0
                    ? totalFilter
                    : total
                }
                showSizeChanger={false}
              />
            </div>
          </div>
        </div>

        <div>
          <EditPromotion
            state={modalEdit}
            setState={() => setModalEdit(!modalEdit)}
            data={itemEdit}
          />
        </div>
        <div>
          <Modal isOpen={modal} toggle={toggle}>
            <ModalHeader toggle={toggle}>Xóa mã khuyến mãi</ModalHeader>
            <ModalBody>
              <a>
                Bạn có chắc muốn xóa mã khuyến mãi{" "}
                <a className="text-name-modal">{itemEdit?.title?.vi}</a> này
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
          <Modal isOpen={modalActive} toggle={toggleActive}>
            <ModalHeader>
              {itemEdit?.is_active ? "Ẩn khuyến mãi" : "Mã khuyến mãi"}
            </ModalHeader>
            <ModalBody>
              <a>
                {itemEdit?.is_active
                  ? "Bạn có chắc muốn ẩn mã khuyến mãi"
                  : "Bạn có chắc muốn hiện mã khuyến mãi"}

                <a className="text-name-modal">{itemEdit?.title?.vi}</a>
              </a>
            </ModalBody>
            <ModalFooter>
              <Button
                color="primary"
                onClick={() => onActive(itemEdit?._id, itemEdit?.is_active)}
              >
                Có
              </Button>
              <Button color="#ddd" onClick={toggleActive}>
                Không
              </Button>
            </ModalFooter>
          </Modal>
        </div>
        {isLoading && <LoadingPagination />}
      </div>
    </React.Fragment>
  );
}
