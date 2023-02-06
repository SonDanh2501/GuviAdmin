import { Button, DatePicker, Pagination, Popover, Table } from "antd";
import moment from "moment";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import {
  filterReportCollaboratorDetails,
  getReportCollaborator,
  getReportCollaboratorDetails,
} from "../../../../api/report";
import { formatMoney } from "../../../../helper/formatMoney";
import { loadingAction } from "../../../../redux/actions/loading";
import "./index.scss";
const { RangePicker } = DatePicker;

const DetailReportManager = () => {
  const { state } = useLocation();
  const { id } = state || {};
  const [dataFilter, setDataFilter] = useState([]);
  const [totalFilter, setTotalFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState([]);
  const [total, setTotal] = useState([]);
  const [type, setType] = useState("day");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadingAction.loadingRequest(true));
    getReportCollaboratorDetails(id, 0, 20)
      .then((res) => {
        dispatch(loadingAction.loadingRequest(false));
        setData(res?.data);
        setTotal(res?.totalItem);
      })
      .then((err) => {
        dispatch(loadingAction.loadingRequest(false));
      });
  }, [id]);

  const columns = [
    {
      title: "Giờ",
      render: (data) => {
        return (
          <a>{moment(new Date(data?.date_work)).format("DD/MM/YYYY HH:mm")} </a>
        );
      },
      width: "8%",
    },
    {
      title: "Mã CTV",
      dataIndex: "code_collaborator",
      width: "10%",
    },
    {
      title: "Tên CTV",
      // dataIndex: "full_name",
      render: (data) => {
        return <a>{data?.full_name}</a>;
      },
      width: "10%",
    },
    {
      title: "Số ca làm",
      dataIndex: "total_order",
      align: "center",
      width: "7%",
    },
    {
      title: "Doanh thu",
      align: "right",
      render: (data) => {
        return (
          <a className="text-money">{formatMoney(data?.total_gross_income)}</a>
        );
      },
      width: "7%",
    },
    {
      title: () => {
        const content = (
          <div className="div-content">
            <p className="text-content">Tổng số tiền giảm giá</p>
          </div>
        );
        return (
          <div className="div-title-column">
            <a>Giảm giá</a>
            <Popover content={content} placement="bottom">
              <Button className="btn-question">
                <i class="uil uil-question-circle icon-question"></i>
              </Button>
            </Popover>
          </div>
        );
      },
      align: "right",
      render: (data) => {
        return (
          <a className="text-money">{formatMoney(data?.total_discount)}</a>
        );
      },
      width: "8%",
    },
    {
      title: () => {
        const content = (
          <div className="div-content">
            <p className="text-content">
              Số tiền thu được sau khi trừ toàn bộ các giảm giá. Doanh thu thuần
              = Doanh thu (-) Giảm giá.
            </p>
          </div>
        );
        return (
          <div className="div-title-column">
            <a>Doanh thu thuần</a>
            <Popover content={content} placement="bottom">
              <Button className="btn-question">
                <i class="uil uil-question-circle icon-question"></i>
              </Button>
            </Popover>
          </div>
        );
      },
      align: "right",
      render: (data) => {
        return (
          <a className="text-money">{formatMoney(data?.total_net_income)}</a>
        );
      },
      width: "12%",
    },
    {
      title: () => {
        const content = (
          <div className="div-content">
            <p className="text-content">
              Tông tiền trên dịch vụ. Tổng hoá đơn = Doanh thu thuần (+) Phí Hệ
              thống.
            </p>
          </div>
        );
        return (
          <div className="div-title-column">
            <a>Tổng</a>
            <Popover content={content} placement="bottom">
              <Button className="btn-question">
                <i class="uil uil-question-circle icon-question"></i>
              </Button>
            </Popover>
          </div>
        );
      },
      align: "right",
      render: (data) => {
        return (
          <a className="text-money">{formatMoney(data?.total_order_fee)}</a>
        );
      },
      width: "7%",
    },
    {
      title: "Phí dịch vụ trả CTV",
      align: "right",
      render: (data) => {
        return (
          <a className="text-money">
            {formatMoney(data?.total_collabotator_fee)}
          </a>
        );
      },
      width: "12%",
    },
    {
      title: () => {
        const content = (
          <div className="div-content">
            <p className="text-content">
              Tông lợi nhuận từ các dịch vụ. Tổng lợi nhuận = Doanh thu thuần
              (-) Phí CTV.
            </p>
          </div>
        );
        return (
          <div className="div-title-column">
            <a>Tổng lợi nhuận</a>
            <Popover content={content} placement="bottom">
              <Button className="btn-question">
                <i class="uil uil-question-circle icon-question"></i>
              </Button>
            </Popover>
          </div>
        );
      },
      align: "right",
      render: (data) => {
        return (
          <a className="text-money">
            {formatMoney(data?.total_net_income_business)}
          </a>
        );
      },
      width: "12%",
    },
    {
      title: () => {
        const content = (
          <div className="div-content">
            <p className="text-content">
              %lợi nhuận = Tổng lợi nhuận (/) Doanh thu thuần.
            </p>
          </div>
        );
        return (
          <div className="div-title-column">
            <a>% lợi nhuận</a>
            <Popover content={content} placement="bottom">
              <Button className="btn-question">
                <i class="uil uil-question-circle icon-question"></i>
              </Button>
            </Popover>
          </div>
        );
      },
      align: "center",
      dataIndex: "percent_income",
      width: "10%",
    },
  ];

  const onChange = (page) => {
    setCurrentPage(page);
    const start =
      dataFilter.length > 0
        ? page * dataFilter.length - dataFilter.length
        : page * data.length - data.length;

    dataFilter.length > 0
      ? filterReportCollaboratorDetails(id, start, 20, startDate, endDate)
          .then((res) => {
            setDataFilter(res?.data);
            setTotalFilter(res?.totalItem);
          })
          .catch((err) => console.log(err))
      : getReportCollaborator(start > 0 ? start : 0, 20)
          .then((res) => {
            setData(res?.data);
            setTotal(res?.totalItem);
          })
          .catch((err) => console.log(err));
  };

  const onChangeFilter = useCallback(
    (start, end) => {
      const dayStart = moment(start).toISOString();
      const dayEnd = moment(end).toISOString();
      filterReportCollaboratorDetails(id, 0, 20, dayStart, dayEnd)
        .then((res) => {
          setDataFilter(res?.data);
          setTotalFilter(res?.totalItem);
        })
        .catch((err) => console.log(err));
      setStartDate(dayStart);
      setEndDate(dayEnd);
    },
    [id]
  );

  return (
    <div>
      <div>
        <RangePicker
          picker={"day"}
          className="picker"
          onChange={(e) => onChangeFilter(e[0]?.$d, e[1]?.$d)}
        />
      </div>
      <div className="mt-3">
        <Table
          columns={columns}
          pagination={false}
          dataSource={dataFilter.length > 0 ? dataFilter : data}
        />
      </div>
      <div className="mt-2 div-pagination p-2">
        <a>Tổng: {totalFilter > 0 ? totalFilter : total}</a>
        <Pagination
          current={currentPage}
          onChange={onChange}
          total={totalFilter > 0 ? totalFilter : total}
          showSizeChanger={false}
          pageSize={20}
        />
      </div>
    </div>
  );
};

export default DetailReportManager;
