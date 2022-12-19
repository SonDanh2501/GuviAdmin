import { Pagination, Table } from "antd";
import _debounce from "lodash/debounce";
import moment from "moment";
import React, { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, CardHeader, Col, Row } from "reactstrap";
import { searchFeedbackApi } from "../../../api/feedback";
import CustomTextInput from "../../../components/CustomTextInput/customTextInput";
import { getFeedback } from "../../../redux/actions/feedback";
import {
  getFeedbacks,
  getFeedbackTotal,
} from "../../../redux/selectors/feedback";
import "./FeedbackManage.scss";

const columns = [
  {
    title: "Loại phản hồi",
    dataIndex: ["type", "name", "vi"],
  },
  {
    title: "Nội dung",
    dataIndex: "body",
  },
  {
    title: "Người phản hồi",
    dataIndex: "name",
  },
  {
    title: "SĐT người phản hồi",
    dataIndex: "phone",
  },
  {
    title: "Ngày phản hồi",
    key: "action",
    render: (data) => (
      <a>{moment(new Date(data?.date_create)).format("DD/MM/yyy HH:mm")}</a>
    ),
  },
];

export default function FeedbackManage() {
  const [dataFilter, setDataFilter] = useState([]);
  const [totalFilter, setTotalFilter] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const dispatch = useDispatch();
  const listFeedback = useSelector(getFeedbacks);
  const feedbackTotal = useSelector(getFeedbackTotal);
  React.useEffect(() => {
    // dispatch(loadingAction.loadingRequest(true));
    dispatch(getFeedback.getFeedbackRequest({ start: 0, length: 10 }));
  }, [dispatch]);

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
        length: 10,
      })
    );
  };
  return (
    <React.Fragment>
      <div className="mt-2 p-3">
        <Card className="shadow">
          <CardHeader className="border-0 card-header">
            <Row className="align-items-center">
              <Col className="text-left"></Col>
              <Col>
                <CustomTextInput
                  placeholder="Tìm kiếm theo tên hoặc số điện thoại"
                  type="text"
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </Col>
            </Row>
          </CardHeader>
          {/* <Table className="align-items-center table-flush " responsive>
            <thead>
              <tr>
                <th>Loại phản hồi</th>
                <th>Nội dung</th>
                <th>Người phản hồi</th>
                <th>SĐT người phản hồi</th>
                <th>Ngày phản hồi</th>
              </tr>
            </thead>
            <tbody>
              {dataFilter.length > 0
                ? dataFilter.map((e) => <TableManageFeedback data={e} />)
                : listFeedback &&
                  listFeedback.map((e) => <TableManageFeedback data={e} />)}
            </tbody>
          </Table> */}
          <Table
            columns={columns}
            dataSource={dataFilter.length > 0 ? dataFilter : listFeedback}
            pagination={false}
            rowKey={(record) => record._id}
            rowSelection={{
              selectedRowKeys,
              onChange: (selectedRowKeys, selectedRows) => {
                setSelectedRowKeys(selectedRowKeys);
              },
            }}
          />
          <div className="div-pagination p-2">
            <a>Tổng: {dataFilter.length > 0 ? totalFilter : feedbackTotal}</a>
            <div>
              <Pagination
                current={currentPage}
                onChange={onChange}
                total={dataFilter.length > 0 ? totalFilter : feedbackTotal}
                showSizeChanger={false}
              />
            </div>
          </div>
        </Card>
      </div>
    </React.Fragment>
  );
}
