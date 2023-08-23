import { Pagination, Popover, Table } from "antd";
import moment from "moment";
import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getReportOrder } from "../../../../../api/report";
import CustomDatePicker from "../../../../../components/customDatePicker";
import LoadingPagination from "../../../../../components/paginationLoading";
import { formatMoney } from "../../../../../helper/formatMoney";
import useWindowDimensions from "../../../../../helper/useWindowDimensions";
import i18n from "../../../../../i18n";
import { getLanguageState } from "../../../../../redux/selectors/auth";
import "./index.scss";

const ReportOrderCreate = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [startPage, setStartPage] = useState(0);
  const [data, setData] = useState([]);
  const [total, setTotal] = useState([]);
  const [dataTotal, setDataTotal] = useState([]);
  const [startDate, setStartDate] = useState(
    moment().subtract(30, "d").startOf("date").toISOString()
  );
  const [endDate, setEndDate] = useState(moment().endOf("date").toISOString());
  const [isLoading, setIsLoading] = useState(false);
  const { width } = useWindowDimensions();
  const lang = useSelector(getLanguageState);

  useEffect(() => {
    getReportOrder(
      0,
      20,
      moment().subtract(30, "d").startOf("date").toISOString(),
      moment().endOf("date").toISOString(),
      "date_create"
    )
      .then((res) => {
        setData(res?.data);
        setTotal(res?.totalItem);
        setDataTotal(res?.total[0]);
      })
      .catch((err) => {});
  }, []);

  const columns = [
    {
      title: () => {
        return (
          <div className="div-title-collaborator-id">
            <div className="div-title-report">
              <p className="text-title-column">{`${i18n.t("time", {
                lng: lang,
              })}`}</p>
            </div>
            <div className="div-top"></div>
          </div>
        );
      },
      width: "15%",
      render: (data) => (
        <div className="div-date-report-order">
          <p className="text-date-report-order">
            {moment(new Date(data?.id_group_order?.date_create)).format(
              "DD/MM/YYYY"
            )}
          </p>
          <p className="text-date-report-order">
            {moment(new Date(data?.id_group_order?.date_create)).format(
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
              <p className="text-title-column">{`${i18n.t("code_order", {
                lng: lang,
              })}`}</p>
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
              <p className="text-title-column">{`${i18n.t("shift", {
                lng: lang,
              })}`}</p>
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
      sorter: (a, b) => a.total_item - b.total_item,
    },
    {
      title: () => {
        return (
          <div className="div-title-order-report">
            <div className="div-title-report">
              <p className="text-title-column">{`${i18n.t("sales", {
                lng: lang,
              })}`}</p>
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
            <p className="text-content">{`${i18n.t(
              "service_fee_pay_collaborator",
              {
                lng: lang,
              }
            )}`}</p>
          </div>
        );
        return (
          <div className="div-title-order-report">
            <div className="div-title-report">
              <p className="text-title-column">{`${i18n.t("service_fee", {
                lng: lang,
              })}`}</p>
              <Popover
                content={content}
                placement="bottom"
                overlayInnerStyle={{
                  backgroundColor: "white",
                  width: 200,
                }}
              >
                <div>
                  <i class="uil uil-question-circle icon-question"></i>
                </div>
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
              {`${i18n.t("revenue_sales", { lng: lang })}`}
            </p>
          </div>
        );
        return (
          <div className="div-title-order-report">
            <div className="div-title-report">
              <p className="text-title-column-blue">{`${i18n.t("revenue", {
                lng: lang,
              })}`}</p>
              <Popover
                content={content}
                placement="bottom"
                overlayInnerStyle={{
                  backgroundColor: "white",
                  width: 300,
                }}
              >
                <div>
                  <i class="uil uil-question-circle icon-question"></i>
                </div>
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
            <p className="text-content">{`${i18n.t("total_discount", {
              lng: lang,
            })}`}</p>
          </div>
        );
        return (
          <div className="div-title-order-report">
            <div className="div-title-report">
              <p className="text-title-column">{`${i18n.t("discount", {
                lng: lang,
              })}`}</p>
              <Popover
                content={content}
                placement="bottom"
                overlayInnerStyle={{
                  backgroundColor: "white",
                  width: 200,
                }}
              >
                <div>
                  <i class="uil uil-question-circle icon-question"></i>
                </div>
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
              {`${i18n.t("note_net_revenue", { lng: lang })}`}
            </p>
          </div>
        );
        return (
          <div className="div-title-order-report">
            <div className="div-title-report">
              <p className="text-title-column">{`${i18n.t("net_revenue", {
                lng: lang,
              })}`}</p>
              <Popover
                content={content}
                placement="bottom"
                overlayInnerStyle={{
                  backgroundColor: "white",
                  width: 300,
                }}
              >
                <div>
                  <i class="uil uil-question-circle icon-question"></i>
                </div>
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
              <p className="text-title-column">{`${i18n.t("fees_apply", {
                lng: lang,
              })}`}</p>
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
              {`${i18n.t("note_total_bill", {
                lng: lang,
              })}`}
            </p>
          </div>
        );
        return (
          <div className="div-title-order-report">
            <div className="div-title-report">
              <p className="text-title-column">{`${i18n.t("total_bill", {
                lng: lang,
              })}`}</p>
              <Popover
                content={content}
                placement="bottom"
                overlayInnerStyle={{
                  backgroundColor: "white",
                  width: 300,
                }}
              >
                <div>
                  <i class="uil uil-question-circle icon-question"></i>
                </div>
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
              {`${i18n.t("note_profit", { lng: lang })}`}
            </p>
          </div>
        );
        return (
          <div className="div-title-order-report">
            <div className="div-title-report">
              <p className="text-title-column">{`${i18n.t("profit", {
                lng: lang,
              })}`}</p>
              <Popover
                content={content}
                placement="bottom"
                overlayInnerStyle={{
                  backgroundColor: "white",
                  width: 300,
                }}
              >
                <div>
                  <i class="uil uil-question-circle icon-question"></i>
                </div>
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
              %{" "}
              {`${i18n.t("percent_profit", {
                lng: lang,
              })}`}
            </p>
          </div>
        );
        return (
          <div className="div-title-order-report">
            <div className="div-title-report">
              <p className="text-title-column">
                %{" "}
                {`${i18n.t("profit", {
                  lng: lang,
                })}`}
              </p>
              <Popover
                content={content}
                placement="bottom"
                overlayInnerStyle={{
                  backgroundColor: "white",
                  width: 300,
                }}
              >
                <div>
                  <i class="uil uil-question-circle icon-question"></i>
                </div>
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

  const onChange = useCallback(
    (page) => {
      // setIsLoading(true);
      setCurrentPage(page);
      const lengthData = data.length < 20 ? 20 : data.length;
      const start = page * lengthData - lengthData;
      setStartPage(start);
      getReportOrder(start, 20, startDate, endDate, "date_create")
        .then((res) => {
          setIsLoading(false);
          setData(res?.data);
          setTotal(res?.totalItem);
          setDataTotal(res?.total[0]);
        })
        .catch((err) => {
          setIsLoading(false);
        });
    },
    [data, startDate, endDate]
  );

  const onChangeDay = () => {
    setIsLoading(true);

    getReportOrder(startPage, 20, startDate, endDate, "date_create")
      .then((res) => {
        setIsLoading(false);
        setData(res?.data);
        setTotal(res?.totalItem);
        setDataTotal(res?.total[0]);
      })
      .catch((err) => {
        setIsLoading(false);
      });
  };

  return (
    <div className="div-report-order-create">
      <h3>{`${i18n.t("order_report", {
        lng: lang,
      })}`}</h3>
      <div className="div-header-report">
        <div className="div-date">
          <CustomDatePicker
            setStartDate={setStartDate}
            setEndDate={setEndDate}
            onClick={onChangeDay}
            onCancel={() => {}}
            setSameStart={() => {}}
            setSameEnd={() => {}}
          />
          {startDate && (
            <p className="text-date m-0">
              {moment(startDate).format("DD/MM/YYYY")} -{" "}
              {moment(endDate).utc().format("DD/MM/YYYY")}
            </p>
          )}
        </div>
      </div>
      <div className="mt-2">
        <Table
          columns={columns}
          pagination={false}
          dataSource={data}
          // locale={{
          //   emptyText: data.length > 0 ? <Empty /> : <Skeleton active={true} />,
          // }}
          scroll={{
            x: width <= 490 ? 1600 : 0,
          }}
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

      {isLoading && <LoadingPagination />}
    </div>
  );
};

export default ReportOrderCreate;
