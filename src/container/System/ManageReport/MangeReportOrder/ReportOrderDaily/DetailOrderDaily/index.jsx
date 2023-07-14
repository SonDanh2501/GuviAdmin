import { Link, useLocation, useNavigate } from "react-router-dom";
import "./index.scss";
import moment from "moment";
import { useEffect, useState } from "react";
import { getReportOrder } from "../../../../../../api/report";
import { Button, Pagination, Popover, Table } from "antd";
import { formatMoney } from "../../../../../../helper/formatMoney";

const ReportDetailOrderDaily = () => {
  const { state } = useLocation();
  const { date } = state;
  const [data, setData] = useState([]);
  const [total, setTotal] = useState();
  const [dataTotal, setDataTotal] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    getReportOrder(
      0,
      20,
      moment(date, "DD-MM-YYYY").startOf("date").toISOString(),
      moment(date, "DD-MM-YYYY").endOf("date").toISOString(),
      "date_work"
    )
      .then((res) => {
        setData(res?.data);
        setTotal(res?.totalItem);
        setDataTotal(res?.total[0]);
      })
      .catch((err) => {});
  }, [date]);

  const onChange = (page) => {
    setCurrentPage(page);
    const lengthData = data?.length < 20 ? 20 : data.length;
    const start = page * lengthData - lengthData;

    getReportOrder(
      start,
      20,
      moment(date, "DD-MM-YYYY").startOf("date").toISOString(),
      moment(date, "DD-MM-YYYY").endOf("date").toISOString(),
      "date_work"
    )
      .then((res) => {
        setData(res?.data);
        setTotal(res?.totalItem);
        setDataTotal(res?.total[0]);
      })
      .catch((err) => {});
  };

  const columns = [
    {
      title: () => {
        return (
          <div className="div-title-collaborator-id">
            <div className="div-title-report">
              <a className="text-title-column">Thời gian</a>
            </div>
            <div className="div-top"></div>
          </div>
        );
      },
      width: "15%",
      render: (data) => (
        <div className="div-date-report-order">
          <a className="text-date-report-order">
            {moment(data?.id_group_order?.date_work_schedule[0]?.date).format(
              "DD/MM/YYYY"
            )}
          </a>
          <a className="text-date-report-order">
            {moment(data?.id_group_order?.date_work_schedule[0]?.date).format(
              "HH:mm"
            )}
          </a>
        </div>
      ),
      width: "5%",
    },
    {
      title: () => {
        return (
          <div className="div-title-collaborator-id">
            <div className="div-title-report">
              <a className="text-title-column">Mã đơn</a>
            </div>
            <div className="div-top"></div>
          </div>
        );
      },
      render: (data) => (
        <Link to={`/details-order/${data?.id_group_order?._id}`}>
          <a className="text-id-report-order">
            {data?.id_group_order?.id_view}
          </a>
        </Link>
      ),
      width: "5%",
    },
    {
      title: () => {
        return (
          <div className="div-title-order-report">
            <div className="div-title-report">
              <a className="text-title-column">Số ca</a>
            </div>
            <a className="text-money-title">
              {dataTotal?.total_item > 0 ? dataTotal?.total_item : 0}
            </a>
          </div>
        );
      },
      render: (data) => {
        return <a className="text-money">{data?.total_item}</a>;
      },
      align: "center",
      width: "5%",
    },
    {
      title: () => {
        return (
          <div className="div-title-order-report">
            <div className="div-title-report">
              <a className="text-title-column">Doanh số</a>
            </div>
            <a className="text-money-title">
              {dataTotal?.total_gross_income > 0
                ? formatMoney(dataTotal?.total_gross_income)
                : formatMoney(0)}
            </a>
          </div>
        );
      },
      align: "center",
      render: (data) => {
        return (
          <a className="text-money">{formatMoney(data?.total_gross_income)}</a>
        );
      },
      width: "8%",
      sorter: (a, b) => a.total_gross_income - b.total_gross_income,
    },
    {
      title: () => {
        const content = (
          <div className="div-content">
            <p className="text-content">Phí dịch vụ trả Cộng tác viên.</p>
          </div>
        );
        return (
          <div className="div-title-order-report">
            <div className="div-title-report">
              <a className="text-title-column">Phí dịch vụ</a>
              <Popover content={content} placement="bottom">
                <Button className="btn-question">
                  <i class="uil uil-question-circle icon-question"></i>
                </Button>
              </Popover>
            </div>
            <a className="text-money-title">
              {dataTotal?.total_collabotator_fee > 0
                ? formatMoney(dataTotal?.total_collabotator_fee)
                : formatMoney(0)}
            </a>
          </div>
        );
      },
      align: "center",
      render: (data) => {
        return (
          <a className="text-money">
            {formatMoney(data?.total_collabotator_fee)}
          </a>
        );
      },
      width: "10%",
      sorter: (a, b) => a.total_collabotator_fee - b.total_collabotator_fee,
    },
    {
      title: () => {
        const content = (
          <div className="div-content">
            <p className="text-content">
              Doanh thu = Doanh số (-) Phí dịch vụ trả CTV
            </p>
          </div>
        );
        return (
          <div className="div-title-order-report">
            <div className="div-title-report">
              <a className="text-title-column-blue">Doanh thu</a>
              <Popover content={content} placement="bottom">
                <Button className="btn-question">
                  <i class="uil uil-question-circle icon-question"></i>
                </Button>
              </Popover>
            </div>
            <a className="text-money-title-blue">
              {dataTotal?.total_income > 0
                ? formatMoney(dataTotal?.total_income)
                : formatMoney(0)}
            </a>
          </div>
        );
      },
      align: "center",
      render: (data) => {
        return (
          <a className="text-money-blue">{formatMoney(data?.total_income)}</a>
        );
      },
      width: "8%",
      sorter: (a, b) => a.total_income - b.total_income,
    },
    {
      title: () => {
        const content = (
          <div className="div-content">
            <p className="text-content">Tổng số tiền giảm giá</p>
          </div>
        );
        return (
          <div className="div-title-order-report">
            <div className="div-title-report">
              <a className="text-title-column">Giảm giá</a>
              <Popover content={content} placement="bottom">
                <Button className="btn-question">
                  <i class="uil uil-question-circle icon-question"></i>
                </Button>
              </Popover>
            </div>
            <a className="text-money-title">
              {dataTotal?.total_discount > 0
                ? formatMoney(dataTotal?.total_discount)
                : formatMoney(0)}
            </a>
          </div>
        );
      },
      align: "center",
      render: (data) => {
        return (
          <a className="text-money">{formatMoney(data?.total_discount)}</a>
        );
      },
      width: "8%",
      sorter: (a, b) => a.total_discount - b.total_discount,
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
          <div className="div-title-order-report">
            <div className="div-title-report">
              <a className="text-title-column">Doanh thu thuần</a>
              <Popover content={content} placement="bottom">
                <Button className="btn-question">
                  <i class="uil uil-question-circle icon-question"></i>
                </Button>
              </Popover>
            </div>
            <a className="text-money-title">
              {dataTotal?.total_net_income > 0
                ? formatMoney(dataTotal?.total_net_income)
                : formatMoney(0)}
            </a>
          </div>
        );
      },
      align: "center",
      render: (data) => {
        return (
          <a className="text-money">{formatMoney(data?.total_net_income)}</a>
        );
      },
      width: "11%",
      sorter: (a, b) => a.total_net_income - b.total_net_income,
    },
    {
      title: () => {
        return (
          <div className="div-title-order-report">
            <div className="div-title-report">
              <a className="text-title-column">Phí áp dụng</a>
            </div>
            <a className="text-money-title">
              {dataTotal?.total_service_fee > 0
                ? formatMoney(dataTotal?.total_service_fee)
                : formatMoney(0)}
            </a>
          </div>
        );
      },
      render: (data) => {
        return (
          <a className="text-money">{formatMoney(data?.total_service_fee)}</a>
        );
      },
      align: "center",
      width: "7%",
    },
    {
      title: () => {
        const content = (
          <div className="div-content">
            <p className="text-content">
              Tổng tiền trên dịch vụ. Tổng hoá đơn = Doanh số - Giảm giá + Phi
              áp dụng
            </p>
          </div>
        );
        return (
          <div className="div-title-order-report">
            <div className="div-title-report">
              <a className="text-title-column">Tổng hoá đơn</a>
              <Popover content={content} placement="bottom">
                <Button className="btn-question">
                  <i class="uil uil-question-circle icon-question"></i>
                </Button>
              </Popover>
            </div>
            <a className="text-money-title">
              {dataTotal?.total_order_fee > 0
                ? formatMoney(dataTotal?.total_order_fee)
                : formatMoney(0)}
            </a>
          </div>
        );
      },
      align: "center",
      render: (data) => {
        return (
          <a className="text-money">{formatMoney(data?.total_order_fee)}</a>
        );
      },
      width: "10%",
      sorter: (a, b) => a.total_order_fee - b.total_order_fee,
    },
    {
      title: () => {
        const content = (
          <div className="div-content">
            <p className="text-content">
              Lợi nhuận = Doanh thu (+) Phí áp dụng (-) Giảm giá.
            </p>
          </div>
        );
        return (
          <div className="div-title-order-report">
            <div className="div-title-report">
              <a className="text-title-column">Lợi nhuận</a>
              <Popover content={content} placement="bottom">
                <Button className="btn-question">
                  <i class="uil uil-question-circle icon-question"></i>
                </Button>
              </Popover>
            </div>
            <a className="text-money-title">
              {dataTotal?.total_net_income_business > 0
                ? formatMoney(dataTotal?.total_net_income_business)
                : formatMoney(0)}
            </a>
          </div>
        );
      },
      align: "center",
      render: (data) => {
        return (
          <a className="text-money">
            {formatMoney(data?.total_net_income_business)}
          </a>
        );
      },
      width: "8%",
      sorter: (a, b) =>
        a.total_net_income_business - b.total_net_income_business,
    },
    {
      title: () => {
        const content = (
          <div className="div-content">
            <p className="text-content">
              % lợi nhuận = Tổng lợi nhuận (/) Doanh thu thuần.
            </p>
          </div>
        );
        return (
          <div className="div-title-order-report">
            <div className="div-title-report">
              <a className="text-title-column">% lợi nhuận</a>
              <Popover content={content} placement="bottom">
                <Button className="btn-question">
                  <i class="uil uil-question-circle icon-question"></i>
                </Button>
              </Popover>
            </div>
            <div className="div-top"></div>
          </div>
        );
      },
      align: "center",
      render: (data) => {
        return (
          <a className="text-money">
            {data?.percent_income ? data?.percent_income + "%" : ""}
          </a>
        );
      },
    },
  ];

  return (
    <div className="div-detail-report-order-daily">
      <div>
        <Table dataSource={data} columns={columns} pagination={false} />
      </div>
      <div className="mt-2 div-pagination p-2">
        <a>Tổng: {total}</a>
        <div>
          <Pagination
            current={currentPage}
            onChange={onChange}
            total={total}
            showSizeChanger={false}
            pageSize={20}
          />
        </div>
      </div>
    </div>
  );
};

export default ReportDetailOrderDaily;
