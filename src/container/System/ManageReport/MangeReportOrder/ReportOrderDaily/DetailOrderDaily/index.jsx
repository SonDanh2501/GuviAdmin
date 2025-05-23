import { Button, Pagination, Popover, Table } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { getReportOrder } from "../../../../../../api/report";
import { formatMoney } from "../../../../../../helper/formatMoney";
import "./index.scss";
import useWindowDimensions from "../../../../../../helper/useWindowDimensions";

const ReportDetailOrderDaily = () => {
  const { state } = useLocation();
  const { date } = state;
  const [data, setData] = useState([]);
  const [total, setTotal] = useState();
  const [dataTotal, setDataTotal] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const { width } = useWindowDimensions();

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
              <p className="text-title-column">Thời gian</p>
            </div>
            <div className="div-top"></div>
          </div>
        );
      },
      width: "15%",
      render: (data) => (
        <div className="div-date-report-order">
          <p className="text-date-report-order">
            {moment(data?.id_group_order?.date_work_schedule[0]?.date).format(
              "DD/MM/YYYY"
            )}
          </p>
          <p className="text-date-report-order">
            {moment(data?.id_group_order?.date_work_schedule[0]?.date).format(
              "HH:mm"
            )}
          </p>
        </div>
      ),
    },
    {
      title: () => {
        return (
          <div className="div-title-collaborator-id">
            <div className="div-title-report">
              <p className="text-title-column">Mã đơn</p>
            </div>
            <div className="div-top"></div>
          </div>
        );
      },
      render: (data) => (
        <Link to={`/details-order/${data?.id_group_order?._id}`}>
          <p className="text-id-report-order">
            {data?.id_group_order?.id_view}
          </p>
        </Link>
      ),
      width: "5%",
    },
    {
      title: () => {
        return (
          <div className="div-title-order-report">
            <div className="div-title-report">
              <p className="text-title-column">Số ca</p>
            </div>
            <p className="text-money-title">
              {dataTotal?.total_item > 0 ? dataTotal?.total_item : 0}
            </p>
          </div>
        );
      },
      render: (data) => {
        return <p className="text-money">{data?.total_item}</p>;
      },
      align: "center",
      width: "5%",
    },
    {
      title: () => {
        return (
          <div className="div-title-order-report">
            <div className="div-title-report">
              <p className="text-title-column">Doanh số</p>
            </div>
            <p className="text-money-title">
              {dataTotal?.total_gross_income > 0
                ? formatMoney(dataTotal?.total_gross_income)
                : formatMoney(0)}
            </p>
          </div>
        );
      },
      align: "center",
      render: (data) => {
        return (
          <p className="text-money">{formatMoney(data?.total_gross_income)}</p>
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
              <p className="text-title-column">Phí dịch vụ</p>
              <Popover content={content} placement="bottom">
                <Button className="btn-question">
                  <i class="uil uil-question-circle icon-question"></i>
                </Button>
              </Popover>
            </div>
            <p className="text-money-title">
              {dataTotal?.total_collabotator_fee > 0
                ? formatMoney(dataTotal?.total_collabotator_fee)
                : formatMoney(0)}
            </p>
          </div>
        );
      },
      align: "center",
      render: (data) => {
        return (
          <p className="text-money">
            {formatMoney(data?.total_collabotator_fee)}
          </p>
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
              <p className="text-title-column-blue">Doanh thu</p>
              <Popover content={content} placement="bottom">
                <Button className="btn-question">
                  <i class="uil uil-question-circle icon-question"></i>
                </Button>
              </Popover>
            </div>
            <p className="text-money-title-blue">
              {dataTotal?.total_income > 0
                ? formatMoney(dataTotal?.total_income)
                : formatMoney(0)}
            </p>
          </div>
        );
      },
      align: "center",
      render: (data) => {
        return (
          <p className="text-money-blue">{formatMoney(data?.total_income)}</p>
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
              <p className="text-title-column">Giảm giá</p>
              <Popover content={content} placement="bottom">
                <Button className="btn-question">
                  <i class="uil uil-question-circle icon-question"></i>
                </Button>
              </Popover>
            </div>
            <p className="text-money-title">
              {dataTotal?.total_discount > 0
                ? formatMoney(dataTotal?.total_discount)
                : formatMoney(0)}
            </p>
          </div>
        );
      },
      align: "center",
      render: (data) => {
        return (
          <p className="text-money">{formatMoney(data?.total_discount)}</p>
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
              <p className="text-title-column">Doanh thu thuần</p>
              <Popover content={content} placement="bottom">
                <Button className="btn-question">
                  <i class="uil uil-question-circle icon-question"></i>
                </Button>
              </Popover>
            </div>
            <p className="text-money-title">
              {dataTotal?.total_net_income > 0
                ? formatMoney(dataTotal?.total_net_income)
                : formatMoney(0)}
            </p>
          </div>
        );
      },
      align: "center",
      render: (data) => {
        return (
          <p className="text-money">{formatMoney(data?.total_net_income)}</p>
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
              <p className="text-title-column">Phí áp dụng</p>
            </div>
            <p className="text-money-title">
              {dataTotal?.total_service_fee > 0
                ? formatMoney(dataTotal?.total_service_fee)
                : formatMoney(0)}
            </p>
          </div>
        );
      },
      render: (data) => {
        return (
          <p className="text-money">{formatMoney(data?.total_service_fee)}</p>
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
              <p className="text-title-column">Tổng hoá đơn</p>
              <Popover content={content} placement="bottom">
                <Button className="btn-question">
                  <i class="uil uil-question-circle icon-question"></i>
                </Button>
              </Popover>
            </div>
            <p className="text-money-title">
              {dataTotal?.total_order_fee > 0
                ? formatMoney(dataTotal?.total_order_fee)
                : formatMoney(0)}
            </p>
          </div>
        );
      },
      align: "center",
      render: (data) => {
        return (
          <p className="text-money">{formatMoney(data?.total_order_fee)}</p>
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
              <p className="text-title-column">Lợi nhuận</p>
              <Popover content={content} placement="bottom">
                <Button className="btn-question">
                  <i class="uil uil-question-circle icon-question"></i>
                </Button>
              </Popover>
            </div>
            <p className="text-money-title">
              {dataTotal?.total_net_income_business > 0
                ? formatMoney(dataTotal?.total_net_income_business)
                : formatMoney(0)}
            </p>
          </div>
        );
      },
      align: "center",
      render: (data) => {
        return (
          <p className="text-money">
            {formatMoney(data?.total_net_income_business)}
          </p>
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
              <p className="text-title-column">% lợi nhuận</p>
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
          <p className="text-money">
            {data?.percent_income ? data?.percent_income + "%" : ""}
          </p>
        );
      },
    },
  ];

  return (
    <div className="div-detail-report-order-daily">
      <div>
        <Table
          dataSource={data}
          columns={columns}
          pagination={false}
          scroll={{ x: width < 900 ? 1400 : 0 }}
        />
      </div>
      <div className="mt-2 div-pagination p-2">
        <p>Tổng: {total}</p>
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
