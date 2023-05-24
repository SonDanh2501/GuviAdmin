import { useEffect, useState } from "react";
import { getReportOrderDaily } from "../../../../../api/report";
import moment from "moment";
import { Button, Pagination, Popover, Table } from "antd";
import { formatMoney } from "../../../../../helper/formatMoney";
import CustomDatePicker from "../../../../../components/customDatePicker";
import "./styles.scss";

const ReportOrderDaily = () => {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [dataTotal, setDataTotal] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [startPage, setStartPage] = useState(0);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    getReportOrderDaily(
      0,
      20,
      moment(moment().startOf("month").toISOString())
        .add(7, "hours")
        .toISOString(),
      moment(moment().endOf("date").toISOString()).add(7, "hours").toISOString()
    )
      .then((res) => {
        setData(res?.data);
        setTotal(res?.totalItem);
        setDataTotal(res?.total[0]);
      })
      .catch((err) => {});

    setStartDate(
      moment(moment().startOf("month").toISOString())
        .add(7, "hours")
        .toISOString()
    );
    setEndDate(
      moment(moment().endOf("date").toISOString()).add(7, "hours").toISOString()
    );
  }, []);

  const onChange = (page) => {
    setCurrentPage(page);
    const start = page * data.length - data.length;
    setStartPage(start);
    getReportOrderDaily(start, 20, startDate, endDate)
      .then((res) => {
        setData(res?.data);
        setTotal(res?.totalItem);
        setDataTotal(res?.total[0]);
      })
      .catch((err) => {});
  };

  const onChangeDay = () => {
    getReportOrderDaily(startPage, 20, startDate, endDate)
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
      render: (data) => (
        <div className="div-date-report-order">
          <a className="text-date-report-order">{data?._id}</a>
        </div>
      ),
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
    },
    {
      title: () => {
        const content = (
          <div className="div-content">
            <p className="text-content">Tổng tiền trên dịch vụ.</p>
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
    <div>
      <h3>Báo cáo đơn hàng theo ngày</h3>
      <div className="div-date">
        <CustomDatePicker
          setStartDate={setStartDate}
          setEndDate={setEndDate}
          onClick={onChangeDay}
          onCancel={() => {}}
        />
        {startDate && (
          <a className="text-date">
            {moment(new Date(startDate)).format("DD/MM/YYYY")} -{" "}
            {moment(endDate).utc().format("DD/MM/YYYY")}
          </a>
        )}
      </div>
      <div className="mt-3">
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

export default ReportOrderDaily;
