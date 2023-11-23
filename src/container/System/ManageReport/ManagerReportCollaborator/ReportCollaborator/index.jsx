import { Pagination, Popover, Table } from "antd";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  filterReportCollaborator,
  getReportCollaborator,
} from "../../../../../api/report";
import CustomDatePicker from "../../../../../components/customDatePicker";
import LoadingPagination from "../../../../../components/paginationLoading";
import { formatMoney } from "../../../../../helper/formatMoney";
import useWindowDimensions from "../../../../../helper/useWindowDimensions";
import i18n from "../../../../../i18n";
import { getLanguageState } from "../../../../../redux/selectors/auth";
import RangeDatePicker from "../../../../../components/datePicker/RangeDatePicker";
import "./index.scss";

const ReportCollaborator = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState([]);
  const [total, setTotal] = useState([]);
  const [totalColumn, setTotalColumn] = useState([]);
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  // const [startDate, setStartDate] = useState(
  //   moment().subtract(30, "d").startOf("date").toISOString()
  // );
  // const [endDate, setEndDate] = useState(moment().endOf("date").toISOString());
  const { width } = useWindowDimensions();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const lang = useSelector(getLanguageState);


  useEffect(() => {
    if (startDate !== "") {
      onChangeDay();
    }
  }, [startDate])


  const getDataReportCollaborator = () => {
    getReportCollaborator(
      0,
      40,
      moment().subtract(30, "d").startOf("date").toISOString(),
      moment().endOf("date").toISOString()
    )
      .then((res) => {
        setData(res?.data);
        setTotal(res?.totalItem);
        setTotalColumn(res?.total[0]);
      })
      .catch((err) => console.log(err));
  }

  // useEffect(() => {
  //   getReportCollaborator(
  //     0,
  //     40,
  //     moment().subtract(30, "d").startOf("date").toISOString(),
  //     moment().endOf("date").toISOString()
  //   )
  //     .then((res) => {
  //       setData(res?.data);
  //       setTotal(res?.totalItem);
  //       setTotalColumn(res?.total[0]);
  //     })
  //     .catch((err) => console.log(err));
  // }, []);

  const onChange = (page) => {
    setIsLoading(true);
    setCurrentPage(page);
    const lengthData = data.length < 40 ? 40 : data.length;
    const start = page * lengthData - lengthData;
    getReportCollaborator(start, 40, startDate, endDate)
      .then((res) => {
        setIsLoading(false);
        setData(res?.data);
        setTotal(res?.totalItem);
        setTotalColumn(res?.total[0]);
      })
      .catch((err) => {
        setIsLoading(false);
      });
  };

  const onChangeDay = () => {
    setIsLoading(true);
    filterReportCollaborator(0, 40, startDate, endDate)
      .then((res) => {
        setData(res?.data);
        setTotal(res?.totalItem);
        setTotalColumn(res?.total[0]);
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
      });
  };

  const columns = [
    {
      title: () => {
        return (
          <div className="div-title-collaborator-id">
            <div className="div-title-report">
              <p className="text-title-column">{`${i18n.t("collaborator", {
                lng: lang,
              })}`}</p>
            </div>
            <div className="div-top"></div>
          </div>
        );
      },
      align: "left",
      render: (data) => {
        return (
          <div
            className="div-name-ctv-report"
            onClick={() =>
              navigate("/report/manage-report/report-details", {
                state: {
                  id: data?.id_collaborator?._id,
                  dateStart: startDate,
                  dateEnd: endDate,
                },
              })
            }
          >
            <p className="text-name-report">
              {data?.id_collaborator?.full_name}
            </p>
            {/* <a className="text-id">{data?.id_view}</a> */}
          </div>
        );
      },
    },
    {
      title: () => {
        return (
          <div className="div-title-collaborator">
            <div className="div-title-report">
              <p className="text-title-column">{`${i18n.t("shift", {
                lng: lang,
              })}`}</p>
            </div>
            <p className="text-money-title">
              {totalColumn?.total_item > 0 ? totalColumn?.total_item : 0}
            </p>
          </div>
        );
      },
      render: (data) => {
        return <p className="text-money">{data?.total_item}</p>;
      },
      align: "center",
      sorter: (a, b) => a.total_item - b.total_item,
    },
    {
      title: () => {
        return (
          <div className="div-title-collaborator">
            <div className="div-title-report">
              <p className="text-title-column">{`${i18n.t("sales", {
                lng: lang,
              })}`}</p>
            </div>
            <p className="text-money-title">
              {totalColumn?.total_gross_income > 0
                ? formatMoney(totalColumn?.total_gross_income)
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
          <div className="div-title-collaborator">
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
              {totalColumn?.total_collabotator_fee > 0
                ? formatMoney(totalColumn?.total_collabotator_fee)
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
          <div className="div-title-collaborator">
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
              {totalColumn?.total_income > 0
                ? formatMoney(totalColumn?.total_income)
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
          <div className="div-title-collaborator">
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
              {totalColumn?.total_discount > 0
                ? formatMoney(totalColumn?.total_discount)
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
          <div className="div-title-collaborator">
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
              {totalColumn?.total_net_income > 0
                ? formatMoney(totalColumn?.total_net_income)
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
      sorter: (a, b) => a.total_net_income - b.total_net_income,
    },
    {
      title: () => {
        return (
          <div className="div-title-collaborator">
            <p className="m-0">{`${i18n.t("fees_apply", {
              lng: lang,
            })}`}</p>
            <p className="text-money-title">
              {totalColumn?.total_service_fee > 0
                ? formatMoney(totalColumn?.total_service_fee)
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
          <div className="div-title-collaborator">
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
              {totalColumn?.total_order_fee > 0
                ? formatMoney(totalColumn?.total_order_fee)
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
          <div className="div-title-collaborator">
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
              {totalColumn?.total_net_income_business > 0
                ? formatMoney(totalColumn?.total_net_income_business)
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
          <div className="div-title-collaborator">
            <div className="div-title-report">
              <p className="text-title-column">
                %{" "}
                {`${i18n.t("profit", {
                  lng: lang,
                })}`}
              </p>
              <Popover
                content={content}
                placement="bottomLeft"
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

  return (
    <div>
      <h5>{`${i18n.t("collaborator_report", { lng: lang })}`}</h5>
      <div className="div-header-report">
        <div className="div-date">
        <RangeDatePicker
              setStartDate={setStartDate}
              setEndDate={setEndDate}
              onCancel={() => { }}
              defaults={"thirty_last"}
            />


          {/* <CustomDatePicker
            setStartDate={setStartDate}
            setEndDate={setEndDate}
            onClick={onChangeDay}
            onCancel={() => {}}
            setSameStart={() => {}}
            setSameEnd={() => {}}
          /> */}
          {startDate && (
            <div className="ml-2">
              <p className="text-date m-0">
                {moment(new Date(startDate)).format("DD/MM/YYYY")} -{" "}
                {moment(endDate).utc().format("DD/MM/YYYY")}
              </p>
            </div>
          )}
        </div>
      </div>
      <div className="mt-3">
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
        <p>
          {`${i18n.t("total", { lng: lang })}`}: {total}
        </p>
        <div>
          <Pagination
            current={currentPage}
            onChange={onChange}
            total={total}
            showSizeChanger={false}
            pageSize={40}
          />
        </div>
      </div>
      {isLoading && <LoadingPagination />}
    </div>
  );
};

export default ReportCollaborator;
