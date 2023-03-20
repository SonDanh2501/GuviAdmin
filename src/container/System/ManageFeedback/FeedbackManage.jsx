import { SearchOutlined } from "@ant-design/icons";
import { Input, Pagination, Table } from "antd";
import _debounce from "lodash/debounce";
import moment from "moment";
import React, { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  CardHeader,
  Col,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
} from "reactstrap";
import { deleteFeedbackApi, searchFeedbackApi } from "../../../api/feedback";
import CustomTextInput from "../../../components/CustomTextInput/customTextInput";
import { errorNotify } from "../../../helper/toast";
import { getFeedback } from "../../../redux/actions/feedback";
import { loadingAction } from "../../../redux/actions/loading";
import { getUser } from "../../../redux/selectors/auth";
import {
  getFeedbacks,
  getFeedbackTotal,
} from "../../../redux/selectors/feedback";
import "./FeedbackManage.scss";

export default function FeedbackManage() {
  const [dataFilter, setDataFilter] = useState([]);
  const [totalFilter, setTotalFilter] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [itemEdit, setItemEdit] = React.useState([]);
  const dispatch = useDispatch();
  const listFeedback = useSelector(getFeedbacks);
  const feedbackTotal = useSelector(getFeedbackTotal);
  const [modal, setModal] = React.useState(false);
  const user = useSelector(getUser);
  const navigate = useNavigate();
  const toggle = () => setModal(!modal);

  React.useEffect(() => {
    dispatch(getFeedback.getFeedbackRequest({ start: 0, length: 20 }));
  }, [dispatch]);

  const onDelete = (id) => {
    dispatch(loadingAction.loadingRequest(true));
    deleteFeedbackApi(id)
      .then((res) => {
        dispatch(getFeedback.getFeedbackRequest({ start: 0, length: 20 }));
        dispatch(loadingAction.loadingRequest(false));
        setModal(false);
      })
      .catch((err) => {
        dispatch(loadingAction.loadingRequest(false));
        errorNotify({
          message: err,
        });
      });
  };

  const handleSearch = useCallback(
    _debounce((value) => {
      searchFeedbackApi(value)
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
    const start = page * listFeedback.length - listFeedback.length;
    dispatch(
      getFeedback.getFeedbackRequest({
        start: start > 0 ? start : 0,
        length: 20,
      })
    );
  };

  const columns = [
    {
      title: "Loại phản hồi",
      render: (data) => <a className="text-type">{data?.type?.name?.vi}</a>,
    },
    {
      title: "Nội dung",
      render: (data) => <a className="text-content">{data?.body}</a>,
    },
    {
      title: "Người phản hồi",
      render: (data) => {
        return (
          <a
            className="text-type"
            onClick={() =>
              navigate("/details-customer", {
                state: { id: data?.id_customer },
              })
            }
          >
            {data?.full_name}
          </a>
        );
      },
    },
    {
      title: "SĐT người phản hồi",
      render: (data) => <a className="text-content">{data?.phone}</a>,
    },
    {
      title: "Ngày phản hồi",
      render: (data) => (
        <a className="text-content">
          {moment(new Date(data?.date_create)).format("DD/MM/yyy - HH:mm")}
        </a>
      ),
    },
    {
      title: "",
      key: "action",
      align: "center",
      render: (data) =>
        user?.role === "admin" && (
          <button className="btn-delete" onClick={toggle}>
            <i className="uil uil-trash"></i>
          </button>
        ),
    },
  ];

  return (
    <React.Fragment>
      <div>
        <h5>Phản hồi</h5>
        <Input
          placeholder="Tìm kiếm theo tên hoặc số điện thoại"
          type="text"
          className="input-search"
          prefix={<SearchOutlined />}
          onChange={(e) => handleSearch(e.target.value)}
        />

        <div className="mt-3">
          <Table
            columns={columns}
            dataSource={dataFilter.length > 0 ? dataFilter : listFeedback}
            pagination={false}
            // rowKey={(record) => record._id}
            // rowSelection={{
            //   selectedRowKeys,
            //   onChange: (selectedRowKeys, selectedRows) => {
            //     setSelectedRowKeys(selectedRowKeys);
            //   },
            // }}
            onRow={(record, rowIndex) => {
              return {
                onClick: (event) => {
                  setItemEdit(record);
                },
              };
            }}
          />
        </div>
        <div className="div-pagination p-2">
          <a>Tổng: {dataFilter.length > 0 ? totalFilter : feedbackTotal}</a>
          <div>
            <Pagination
              current={currentPage}
              onChange={onChange}
              total={dataFilter.length > 0 ? totalFilter : feedbackTotal}
              showSizeChanger={false}
              pageSize={20}
            />
          </div>
        </div>

        <div>
          <Modal isOpen={modal} toggle={toggle}>
            <ModalHeader toggle={toggle}>Xóa phản hồi</ModalHeader>
            <ModalBody>
              <a>
                Bạn có chắc muốn xóa phản hồi của khách hàng
                <a className="text-name-modal">{itemEdit?.full_name}</a>
                này không?
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
