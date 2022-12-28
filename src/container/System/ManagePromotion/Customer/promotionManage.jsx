import { Dropdown, Empty, Skeleton, Space, Table, Pagination } from "antd";
import _debounce from "lodash/debounce";
import React, { useCallback, useEffect, useState } from "react";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  Card,
  CardFooter,
  CardHeader,
  Col,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
} from "reactstrap";
import { searchPromotion } from "../../../../api/promotion.jsx";
import AddPromotion from "../../../../components/addPromotion/addPromotion.js";
import CustomTextInput from "../../../../components/CustomTextInput/customTextInput.jsx";
import { loadingAction } from "../../../../redux/actions/loading.js";
import {
  deletePromotionAction,
  getPromotion,
} from "../../../../redux/actions/promotion.js";

import moment from "moment";
import EditPromotion from "../../../../components/editPromotion /editPromotion.js";
import {
  getPromotionSelector,
  getTotalPromotion,
} from "../../../../redux/selectors/promotion.js";
import "./PromotionManage.scss";

export default function PromotionManage() {
  const promotion = useSelector(getPromotionSelector);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalFilter, setTotalFilter] = useState("");
  const [valueFilter, setValueFilter] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const total = useSelector(getTotalPromotion);
  const dispatch = useDispatch();
  const [dataFilter, setDataFilter] = useState([]);
  const [itemEdit, setItemEdit] = React.useState([]);
  const [modalEdit, setModalEdit] = React.useState(false);
  const [modal, setModal] = React.useState(false);
  const toggle = () => setModal(!modal);
  useEffect(() => {
    // dispatch(loadingAction.loadingRequest(true));

    dispatch(getPromotion.getPromotionRequest({ start: 0, length: 10 }));
  }, []);

  const onDelete = useCallback((id) => {
    dispatch(loadingAction.loadingRequest(true));
    dispatch(deletePromotionAction.deletePromotionRequest(id));
  }, []);

  const onChange = (page) => {
    setCurrentPage(page);
    const start =
      dataFilter.length > 0
        ? page * dataFilter.length - dataFilter.length
        : page * promotion.length - promotion.length;
    dataFilter.length > 0
      ? searchPromotion(valueFilter, start, 10)
          .then((res) => {
            setDataFilter(res.data);
          })
          .catch((err) => console.log(err))
      : dispatch(
          getPromotion.getPromotionRequest({
            start: start > 0 ? start : 0,
            length: 10,
          })
        );
  };

  const handleSearch = useCallback(
    _debounce((value) => {
      setValueFilter(value);
      searchPromotion(value, 0, 10)
        .then((res) => {
          setDataFilter(res?.data);
          setTotalFilter(res?.totalItem);
        })
        .catch((err) => console.log(err));
    }, 1000),
    []
  );

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
      label: <a onClick={toggle}>Xoá</a>,
    },
  ];

  const columns = [
    {
      title: "Tên Promotion",
      render: (data) => {
        return (
          <>
            <img className="img_customer" src={data?.thumbnail} />
            <a>{data.title.vi}</a>
          </>
        );
      },
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
        return <a>{data?.is_limit_date ? startDate + "-" + endDate : null}</a>;
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
      <div className="mt-2 p-3">
        <Card className="shadow">
          <CardHeader className="border-0 card-header">
            <Row className="align-items-center">
              <Col className="text-left">
                <AddPromotion />
              </Col>
              <Col>
                <CustomTextInput
                  placeholder="Tìm kiếm"
                  type="text"
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </Col>
            </Row>
          </CardHeader>
          <Table
            columns={columns}
            dataSource={dataFilter.length > 0 ? dataFilter : promotion}
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
                promotion.length > 0 ? <Empty /> : <Skeleton active={true} />,
            }}
          />
          <div className="div-pagination p-2">
            <a>Tổng: {dataFilter.length > 0 ? totalFilter : total}</a>
            <div>
              <Pagination
                current={currentPage}
                onChange={onChange}
                total={dataFilter.length > 0 ? totalFilter : total}
                showSizeChanger={false}
              />
            </div>
          </div>
        </Card>
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
      </div>
    </React.Fragment>
  );
}
