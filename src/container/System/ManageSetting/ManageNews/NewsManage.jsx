import { UilEllipsisV } from "@iconscout/react-unicons";
import { SearchOutlined } from "@material-ui/icons";
import { Dropdown, Image, Input, Pagination, Space, Table } from "antd";
import _debounce from "lodash/debounce";
import React, { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { activeNew, deleteNew, searchNew } from "../../../../api/news";
import AddNews from "../../../../components/addNews/addNews";
import EditNews from "../../../../components/editNews/editNews";
import { loadingAction } from "../../../../redux/actions/loading";
import { getNews } from "../../../../redux/actions/news";
import { getNewSelector, getNewTotal } from "../../../../redux/selectors/news";
import "./NewsManage.scss";

export default function NewsManage() {
  const [dataFilter, setDataFilter] = useState([]);
  const [totalFilter, setTotalFilter] = useState(0);
  const [valueSearch, setValueSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [itemEdit, setItemEdit] = React.useState([]);
  const [modalEdit, setModalEdit] = React.useState(false);
  const [modal, setModal] = React.useState(false);
  const [modalBlock, setModalBlock] = React.useState(false);
  const listNew = useSelector(getNewSelector);
  const totalNew = useSelector(getNewTotal);
  const toggle = () => setModal(!modal);
  const toggleBlock = () => setModalBlock(!modalBlock);

  const dispatch = useDispatch();

  React.useEffect(() => {
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
        window.location.reload();
      })
      .catch((err) => {
        dispatch(loadingAction.loadingRequest(false));
      });
  }, []);

  const blockNew = useCallback((id, is_active) => {
    dispatch(loadingAction.loadingRequest(true));
    if (is_active === true) {
      activeNew(id, { is_active: false })
        .then((res) => {
          setModalBlock(!modalBlock);
          window.location.reload();
        })
        .catch((err) => {
          dispatch(loadingAction.loadingRequest(false));
        });
    } else {
      activeNew(id, { is_active: true })
        .then((res) => {
          setModalBlock(!modalBlock);
          window.location.reload();
        })
        .catch((err) => {
          dispatch(loadingAction.loadingRequest(false));
        });
    }
  }, []);

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
      label: itemEdit?.is_active ? (
        <a onClick={toggleBlock}>Chặn </a>
      ) : (
        <a onClick={toggleBlock}>Kích hoạt</a>
      ),
    },
    {
      key: "3",
      label: <a onClick={toggle}> Xoá</a>,
    },
  ];

  const columns = [
    {
      title: "Tiêu đề",
      dataIndex: ["title"],
      width: "20%",
    },
    {
      title: "Mô tả ngắn",
      dataIndex: ["short_description"],
      width: "30%",
    },
    {
      title: "Link bài viết",
      render: (data) => {
        return (
          <a>
            {" "}
            {data?.url.length > 60 ? data?.url.slice(0, 60) + "..." : data?.url}
          </a>
        );
      },
    },
    {
      title: "Loại tin",
      dataIndex: "type",
    },
    {
      title: "Hình ",
      render: (data) => {
        return (
          <Image src={data?.thumbnail} style={{ width: 100, height: 100 }} />
        );
      },
      align: "center",
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
            placeholder="Tìm kiếm"
            type="text"
            className="field-search"
            prefix={<SearchOutlined />}
            onChange={(e) => handleSearch(e.target.value)}
          />
          <AddNews />
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
            <a>Tổng: {totalFilter > 0 ? totalFilter : totalNew}</a>
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
          <Modal isOpen={modalBlock} toggle={toggleBlock}>
            <ModalHeader toggle={toggleBlock}>
              {" "}
              {itemEdit?.is_active === true ? "Khóa bài viết" : "Mở bài viết"}
            </ModalHeader>
            <ModalBody>
              {itemEdit?.is_active === true
                ? "Bạn có muốn khóa bài viết này"
                : "Bạn có muốn kích hoạt bài viết này"}
              <h3>{itemEdit?.title}</h3>
            </ModalBody>
            <ModalFooter>
              <Button
                color="primary"
                onClick={() => blockNew(itemEdit?._id, itemEdit?.is_active)}
              >
                Có
              </Button>
              <Button color="#ddd" onClick={toggleBlock}>
                Không
              </Button>
            </ModalFooter>
          </Modal>
        </div>

        <div>
          <Modal isOpen={modal} toggle={toggle}>
            <ModalHeader toggle={toggle}>Xóa bài viết</ModalHeader>
            <ModalBody>
              Bạn có chắc muốn xóa bài viết {itemEdit?.title} này không?
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
          <EditNews
            state={modalEdit}
            setState={() => setModalEdit(!modalEdit)}
            data={itemEdit}
          />
        </div>
      </div>
    </React.Fragment>
  );
}
