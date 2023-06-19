import { DatePicker, FloatButton, List, Progress, Select, Table } from "antd";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import moment from "moment";
import "moment/locale/vi";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Col, Row } from "reactstrap";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Legend,
  Line,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { getDistrictApi } from "../../../api/file";
import {
  getReportCancelReport,
  getReportServiceDetails,
  getTotalCustomerYear,
} from "../../../api/report";
import { getDayReportApi } from "../../../api/statistic";
import CustomDatePicker from "../../../components/customDatePicker";
import MoreTopCollaborator from "../../../components/moreTopCollaborator";
import { formatMoney } from "../../../helper/formatMoney";
import { number_processing } from "../../../helper/numberProcessing";
import {
  getActiveUser,
  getHistoryActivity,
  getLastestService,
  getServiceConnect,
  getTopCollaborator,
} from "../../../redux/actions/statistic";
import {
  getElementState,
  getLanguageState,
} from "../../../redux/selectors/auth";
import {
  getActiveUsers,
  getHistoryActivitys,
  getLastestServices,
  getServiceConnects,
  getTopCollaborators,
} from "../../../redux/selectors/statistic";
import "./DashBoard.scss";
import Header from "./HeaderBoard/Header";
import MoreActivity from "./MoreActivity";
import i18n from "../../../i18n";
moment.locale("vi");
dayjs.extend(customParseFormat);

const width = window.innerWidth;

export default function Home() {
  const [arrResult, setArrResult] = useState([]);
  const [totalMoneyChart, setTotalMoneyChart] = useState(0);
  const [day, setDay] = useState([]);
  const [dataUser, setDataUser] = useState([]);
  const [totalYearUser, setTotalYearUser] = useState(0);
  const [dataChartCancel, setDataChartCancel] = useState([]);
  const [dataTotalChartCancel, setDataTotalChartCancel] = useState([]);
  const [codeCity, setCodeCity] = useState();
  const [nameCity, setNameCity] = useState("");
  const [dataCity, setDataCity] = useState([]);
  const [startDate, setStartDate] = useState(
    moment(moment().startOf("month").toISOString())
      .add(7, "hours")
      .toISOString()
  );
  const [endDate, setEndDate] = useState(
    moment(moment(new Date()).toISOString()).add(7, "hours").toISOString()
  );
  const [dataChartServiceDetails, setDataChartServiceDetails] = useState([]);
  const historyActivity = useSelector(getHistoryActivitys);
  const activeUser = useSelector(getActiveUsers);
  const lastestService = useSelector(getLastestServices);
  const connectionService = useSelector(getServiceConnects);
  const topCollaborator = useSelector(getTopCollaborators);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const yearFormat = "YYYY";
  const dataChartUser = [];
  const cityData = [];
  const dataChartDetail = [];
  const checkElement = useSelector(getElementState);
  const lang = useSelector(getLanguageState);

  useEffect(() => {
    if (checkElement?.includes("total_finance_job_dashboard")) {
      getDayReportApi(startDate, endDate)
        .then((res) => {
          setArrResult(res.arrResult);
          setTotalMoneyChart(res?.total_money);
          getDates(res?.arrResult[0]?.date_start, res?.arrResult?.date_end);
        })
        .catch((err) => {});
    }
    if (checkElement?.includes("connection_service_dashboard")) {
      dispatch(getServiceConnect.getServiceConnectRequest());
    }
    if (checkElement?.includes("history_activity_dashboard")) {
      dispatch(
        getHistoryActivity.getHistoryActivityRequest({ start: 0, length: 20 })
      );
    }
    if (checkElement?.includes("lastest_services_dashboard")) {
      dispatch(
        getLastestService.getLastestServiceRequest({ start: 0, length: 5 })
      );
    }
    if (checkElement?.includes("top_collaborator_dashboard")) {
      dispatch(
        getTopCollaborator.getTopCollaboratorRequest({
          startDate: startDate,
          endDate: endDate,
          start: 0,
          length: 10,
        })
      );
    }
    if (checkElement?.includes("total_customer_monthly_dashboard")) {
      getTotalCustomerYear(moment().year())
        .then((res) => {
          setDataUser(res);
        })
        .catch((err) => {});
    }

    dispatch(getActiveUser.getActiveUserRequest());

    getDistrictApi()
      .then((res) => {
        setDataCity(res?.aministrative_division);
        setCodeCity(res?.aministrative_division[1]?.code);
        setNameCity(res?.aministrative_division[1]?.name);
        if (checkElement?.includes("report_detail_service_dashboard")) {
          getReportServiceDetails(
            startDate,
            endDate,
            res?.aministrative_division[1]?.code
          )
            .then((res) => {
              setDataChartServiceDetails(res?.detailData);
            })
            .catch((err) => {});
        }
        if (checkElement?.includes("report_cancel_order_dashboard")) {
          getReportCancelReport(
            startDate,
            endDate,
            res?.aministrative_division[1].code,
            -1
          )
            .then((res) => {
              setDataChartCancel(res?.percent);
              setDataTotalChartCancel(res);
            })
            .catch((err) => {});
        }
      })
      .catch((err) => {});
  }, []);

  useEffect(() => {
    let sum = 0;
    for (let i = 0; i < dataUser.length; i++) {
      setTotalYearUser((sum += dataUser[i].totalNew));
    }
  }, [dataUser]);

  dataUser.map((item, index) => {
    dataChartUser.push({
      totalNew: item?.totalNew,
      totalOld: item?.totalOld,
      total: item?.totalAll,
      month: index + 1,
    });
  });

  dataCity?.map((item) => {
    cityData?.push({
      value: item?.code,
      label: item?.name,
      districts: item?.districts,
    });
  });

  dataChartServiceDetails?.map((item) => {
    dataChartDetail?.push({
      title: item?.title[0]?.vi,
      percent_2_hour: item?.total_2_hour,
      percent_3_hour: item?.total_3_hour,
      percent_4_hour: item?.total_4_hour,
    });
  });

  const onChangeCity = useCallback(
    (value, label) => {
      setNameCity(label?.label);
      setCodeCity(value);
      getReportServiceDetails(startDate, endDate, value)
        .then((res) => {
          setDataChartServiceDetails(res?.detailData);
        })
        .catch((err) => {});

      getReportCancelReport(startDate, endDate, value, -1)
        .then((res) => {
          setDataChartCancel(res?.percent);
          setDataTotalChartCancel(res);
        })
        .catch((err) => {});
    },
    [startDate, endDate]
  );

  function getDates(startDate, stopDate) {
    var dateArray = [];
    var currentDate = moment(startDate);
    var stopDate = moment(stopDate);
    while (currentDate <= stopDate) {
      dateArray.push(moment(currentDate).format("YYYY-MM-DD"));
      currentDate = moment(currentDate).add(1, "days");
    }
    return setDay(dateArray);
  }

  const onChange = useCallback(() => {
    getDayReportApi(startDate, endDate)
      .then((res) => {
        setArrResult(res.arrResult);
        setTotalMoneyChart(res?.total_money);
      })
      .catch((err) => console.log(err));

    getReportServiceDetails(startDate, endDate, codeCity)
      .then((res) => {
        setDataChartServiceDetails(res?.detailData);
      })
      .catch((err) => {});
    // getDates(startDate, endDate);
  }, [startDate, endDate, codeCity]);

  const timeWork = (data) => {
    const start = moment(new Date(data.date_work_schedule[0].date)).format(
      "HH:mm"
    );

    const timeEnd = moment(new Date(data?.date_work_schedule[0]?.date))
      .add(data?.total_estimate, "hours")
      .format("HH:mm");

    return start + " - " + timeEnd;
  };

  const onChangeNumberData = useCallback((number) => {
    dispatch(
      getLastestService.getLastestServiceRequest({ start: 0, length: number })
    );
  }, []);

  const columns = [
    {
      title: "Khách hàng",
      render: (data) => {
        return (
          <Link to={`/profile-customer/${data?.id_customer?._id}`}>
            <a className="text-collaborator">{data?.id_customer?.full_name}</a>
          </Link>
        );
      },
    },
    {
      title: "Dịch vụ",
      render: (data) => {
        return (
          <div className="div-column-service">
            <a className="text-service">
              {data?.type === "loop" && data?.is_auto_order
                ? "Lặp lại"
                : data?.service?._id?.kind === "giup_viec_theo_gio"
                ? "Theo giờ"
                : data?.service?._id?.kind === "giup_viec_co_dinh"
                ? "Cố định"
                : data?.service?._id?.kind === "phuc_vu_nha_hang"
                ? "Phục vụ"
                : ""}
            </a>
            <a className="text-service">{timeWork(data)}</a>
          </div>
        );
      },
    },
    {
      title: "Thời gian",
      render: (data) => {
        return (
          <div className="div-column-date">
            <a className="text-date">
              {moment(new Date(data.date_work_schedule[0].date)).format(
                "DD/MM/YYYY"
              )}
            </a>
            <a className="text-time">
              {moment(new Date(data.date_work_schedule[0].date))
                .lang("VI")
                .format("dddd")}
            </a>
          </div>
        );
      },
      align: "center",
    },
    {
      title: "Địa điểm",
      render: (data) => {
        return <a className="text-address-dashboard">{data?.address}</a>;
      },
    },
    {
      title: "Cộng tác viên",
      render: (data) => {
        return (
          <div>
            {!data?.id_collaborator ? (
              <a className="text-find-collaborator">Đang tìm kiếm</a>
            ) : (
              <Link to={`/details-collaborator/${data?.id_collaborator?._id}`}>
                <a className="text-collaborator">
                  {data?.id_collaborator.full_name}
                </a>
              </Link>
            )}
          </div>
        );
      },
    },
    {
      title: "Tiến độ",
      render: (data) => (
        <a
          className={
            data?.status === "pending"
              ? "text-pending"
              : data?.status === "confirm"
              ? "text-confirm"
              : data?.status === "doing"
              ? "text-doing"
              : data?.status === "done"
              ? "text-done"
              : "text-cancel"
          }
        >
          {data?.status === "pending"
            ? "Đang chờ làm"
            : data?.status === "confirm"
            ? "Đã nhận"
            : data?.status === "doing"
            ? "Đang làm"
            : data?.status === "done"
            ? "Hoàn thành"
            : "Đã huỷ"}
        </a>
      ),
    },
    {
      title: "Hành động",
      key: "action",
      render: (data) => {
        return (
          <div className="div-action">
            <Link to={`/details-order/${data?._id}`} className="btn-details">
              <a>Chi tiết</a>
            </Link>
          </div>
        );
      },
    },
  ];

  const renderTooltipContent = (o) => {
    const { payload, label } = o;

    return (
      <div className="div-content-tool-chart">
        <a className="date-text">
          Ngày: {moment(new Date(label)).format("DD/MM/YYYY")}
        </a>

        <a className="money-text-dashboard">
          Tổng tiền:{" "}
          {payload?.length > 0
            ? formatMoney(payload[0]?.payload?.total_income)
            : 0}
        </a>

        <a className="date-text">
          Tổng đơn: {payload?.length > 0 ? payload[0]?.payload?.total_job : 0}
        </a>
      </div>
    );
  };

  const renderTooltipContentUser = (o) => {
    const { payload, label } = o;

    return (
      <div className="div-content-tool-chart-user">
        <a className="date-text">Tháng {label}</a>
        <a className="money-text">
          Số tổng:{" "}
          {payload?.length > 0
            ? payload[0]?.payload?.totalNew + payload[0]?.payload?.totalOld
            : 0}
        </a>
        <a className="money-text-new">
          Số người đăng kí mới:{" "}
          {payload?.length > 0 ? payload[0]?.payload?.totalNew : 0}
        </a>
        <a className="money-text-old">
          Số người đăng kí cũ:{" "}
          {payload?.length > 0 ? payload[0]?.payload?.totalOld : 0}
        </a>
      </div>
    );
  };

  const renderLabelCancel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    value,
    name,
  }) => {
    const RADIAN = Math.PI / 180;
    // eslint-disable-next-line
    const radius = 25 + innerRadius + (outerRadius - innerRadius);
    // eslint-disable-next-line
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    // eslint-disable-next-line
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="#000000"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        fontSize={10}
      >
        {name === "system_cancel"
          ? "Hệ thống"
          : name === "customer_cancel"
          ? "Khách hàng"
          : "Quản trị viên"}{" "}
        ({value} {"%"})
      </text>
    );
  };

  return (
    <div className="container-dash">
      {checkElement?.includes("get_general_total_report_dashboard") && (
        <Header />
      )}

      <div>
        <div className="div-chart_total_service_collaborator">
          <div className="chart">
            <div className="div-head-chart">
              <div className="div-date">
                <CustomDatePicker
                  setStartDate={setStartDate}
                  setEndDate={setEndDate}
                  onClick={onChange}
                  onCancel={() => {}}
                />
                {startDate && (
                  <a className="text-date">
                    {moment(new Date(startDate)).format("DD/MM/YYYY")} -{" "}
                    {moment(endDate).utc().format("DD/MM/YYYY")}
                  </a>
                )}
              </div>
              {checkElement?.includes("total_finance_job_dashboard") && (
                <a className="text-total-money">
                  {`${i18n.t("total_money", { lng: lang })}`}:{" "}
                  {formatMoney(totalMoneyChart)}
                </a>
              )}
            </div>
            <div className="div-select-city mb-3">
              <Select
                style={{ width: 200 }}
                value={nameCity}
                onChange={onChangeCity}
                options={cityData}
                showSearch
                filterOption={(input, option) =>
                  (option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
              />
            </div>
            {checkElement?.includes("total_finance_job_dashboard") && (
              <div>
                <ResponsiveContainer
                  width={"100%"}
                  height={350}
                  min-width={300}
                >
                  <AreaChart
                    width={window.screen.height / 1.2}
                    height={400}
                    data={arrResult}
                    margin={{
                      top: 10,
                      right: 30,
                      left: 0,
                      bottom: 0,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="date_start"
                      tickFormatter={(tickItem) =>
                        moment(tickItem).format("DD/MM")
                      }
                    />
                    <YAxis
                      dataKey="total_income"
                      fontSize={12}
                      tickFormatter={(tickItem) => number_processing(tickItem)}
                    />
                    <Tooltip content={renderTooltipContent} />
                    <Area
                      type="monotone"
                      dataKey="total_income"
                      stroke="#00CF3A"
                      fill="#00CF3A"
                      name="Tổng tiền"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}

            <Row>
              <Col lg="7" className="pl-4">
                <p className="label-persen-active">Phần trăm hoạt động</p>
                <div className="div-persen">
                  <p className="label-persen">{activeUser?.donePercent}%</p>
                  <p className="label-total">{`${i18n.t("total", {
                    lng: lang,
                  })}`}</p>
                </div>
                <Progress
                  percent={activeUser?.donePercent}
                  showInfo={false}
                  strokeColor={"#48CAE4"}
                  className="progress-persent"
                  strokeWidth={15}
                />
                <div className="div-container-on">
                  <div className="div-on">
                    <div className="line-on" />
                    <div className="total-div-on">
                      <a className="text-on">Online</a>
                      <a className="text-total-on">{activeUser?.ActiveUsers}</a>
                    </div>
                  </div>

                  <div className="div-on">
                    <div className="line-off" />
                    <div className="total-div-on">
                      <a className="text-on">Ofline</a>
                      <a className="text-total-on">
                        {activeUser?.OfflineUsers}
                      </a>
                    </div>
                  </div>
                </div>
              </Col>
              <Col lg="5">
                {/* <p className="label-persen-active">Active Users</p>
                    <p className="label-active">2154</p>
                    <div>
                      <Progress
                        percent={66}
                        strokeWidth={10}
                        strokeColor={"#48CAE4"}
                        className="progress-persent"
                      />
                      <a>Hồ Chí Minh</a>
                    </div> */}
                {/* <div>
                      <Progress
                        percent={73}
                        strokeWidth={10}
                        strokeColor={"#48CAE4"}
                        className="progress-persent"
                      />
                      <a>Đà Nẵng</a>
                    </div>
                    <div>
                      <Progress
                        percent={20}
                        strokeWidth={10}
                        strokeColor={"#48CAE4"}
                        className="progress-persent"
                      />
                      <a>Hà Nội</a>
                    </div> */}
              </Col>
            </Row>
          </div>
          <div>
            {checkElement?.includes("connection_service_dashboard") && (
              <div className="div-connect-service">
                <div className="div-progress">
                  <Progress
                    type="dashboard"
                    percent={
                      !connectionService?.donePercent
                        ? 0
                        : connectionService?.donePercent
                    }
                    gapDegree={5}
                    strokeColor={"#48CAE4"}
                    strokeWidth={15}
                    width={150}
                  />
                </div>
                <div className="div-progress-text">
                  <p className="title-progress">Tỉ lệ dịch vụ kết nối</p>
                </div>
                <div className="div-success">
                  <a className="square" />
                  <p className="text-success-square">Hoàn thành</p>
                </div>
                <div className="div-success">
                  <a className="unsquare" />
                  <p className="text-success-square">Chưa hoàn thành</p>
                </div>
              </div>
            )}
            {checkElement?.includes("top_collaborator_dashboard") && (
              <>
                {topCollaborator.length > 0 && (
                  <div className="div-top-collaborator">
                    <p className="text-top">Top CTV</p>
                    <div className="level">
                      <div
                        className="level-ctv1"
                        onClick={() =>
                          navigate("/details-collaborator", {
                            state: {
                              id: topCollaborator[0]?._id?.id_collaborator,
                            },
                          })
                        }
                      >
                        <p className="text-level">
                          {topCollaborator[0]?._id?.full_name}
                        </p>
                        <p className="text-level-number">
                          {formatMoney(topCollaborator[0]?.sumIncome)}
                        </p>
                      </div>
                      {topCollaborator.length > 1 && (
                        <div
                          className="level-ctv2"
                          onClick={() =>
                            navigate("/details-collaborator", {
                              state: {
                                id: topCollaborator[1]?._id?.id_collaborator,
                              },
                            })
                          }
                        >
                          <p className="text-level">
                            {topCollaborator[1]?._id?.name}
                          </p>
                          <p className="text-level-number">
                            {formatMoney(topCollaborator[1]?.sumIncome)}
                          </p>
                        </div>
                      )}
                      {topCollaborator.length > 2 && (
                        <div
                          className="level-ctv3"
                          onClick={() =>
                            navigate("/details-collaborator", {
                              state: {
                                id: topCollaborator[2]?._id?.id_collaborator,
                              },
                            })
                          }
                        >
                          <p className="text-level">
                            {topCollaborator[2]?._id?.name}
                          </p>
                          <p className="text-level-number">
                            {formatMoney(topCollaborator[2]?.sumIncome)}
                          </p>
                        </div>
                      )}
                      {topCollaborator.length > 3 && (
                        <div
                          className="level-ctv4"
                          onClick={() =>
                            navigate("/details-collaborator", {
                              state: {
                                id: topCollaborator[3]?._id?.id_collaborator,
                              },
                            })
                          }
                        >
                          <p className="text-level">
                            {topCollaborator[3]?._id?.name}
                          </p>
                          <p className="text-level-number">
                            {formatMoney(topCollaborator[3]?.sumIncome)}
                          </p>
                        </div>
                      )}
                      {topCollaborator.length > 4 && (
                        <div
                          className="level-ctv5"
                          onClick={() =>
                            navigate("/details-collaborator", {
                              state: {
                                id: topCollaborator[4]?._id?.id_collaborator,
                              },
                            })
                          }
                        >
                          <p className="text-level">
                            {topCollaborator[4]?._id?.name}
                          </p>
                          <p className="text-level-number">
                            {formatMoney(topCollaborator[4]?.sumIncome)}
                          </p>
                        </div>
                      )}
                    </div>
                    <div className="div-seemore">
                      <MoreTopCollaborator />
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
        {checkElement?.includes("total_finance_job_dashboard") && (
          <div>
            <p className="label-service">DỊCH VỤ GẦN NHẤT</p>
            <div className="div-card-service">
              <Table
                columns={columns}
                dataSource={lastestService}
                pagination={false}
                scroll={
                  width <= 490
                    ? {
                        x: 1600,
                      }
                    : null
                }
              />
              <div className="div-entries">
                <Select
                  style={{ width: 60 }}
                  defaultValue={"5"}
                  onChange={onChangeNumberData}
                  options={[
                    { value: 5, label: "5" },
                    { value: 10, label: "10" },
                    { value: 20, label: "20" },
                  ]}
                />
              </div>
            </div>
          </div>
        )}
        <div>
          <Row>
            <Col lg="9">
              {checkElement?.includes("report_detail_service_dashboard") && (
                <div className="div-chart-pie-total-dash">
                  <a className="title-chart-area">Thống kê đơn hàng</a>
                  <div className="div-pie-chart mt-3">
                    <div className="div-pie">
                      <ResponsiveContainer
                        width={"100%"}
                        height={350}
                        min-width={350}
                      >
                        <BarChart
                          width={500}
                          height={300}
                          data={dataChartDetail}
                          margin={{
                            top: 30,
                            right: 30,
                            left: 20,
                            bottom: 5,
                          }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="title" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar
                            dataKey="percent_2_hour"
                            fill="#8884d8"
                            barSize={40}
                            minPointSize={10}
                            name="2 Giờ"
                            label={{
                              position: "top",
                              fill: "black",
                              fontSize: 14,
                            }}
                          />
                          <Bar
                            dataKey="percent_3_hour"
                            fill="#82ca9d"
                            barSize={40}
                            minPointSize={10}
                            name="3 Giờ"
                            label={{
                              position: "top",
                              fill: "black",
                              fontSize: 14,
                            }}
                          />
                          <Bar
                            dataKey="percent_4_hour"
                            fill="#0088FE"
                            barSize={40}
                            minPointSize={10}
                            name="4 Giờ"
                            label={{
                              position: "top",
                              fill: "black",
                              fontSize: 14,
                            }}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              )}
            </Col>
            <Col lg="3">
              {checkElement?.includes("history_activity_dashboard") && (
                <div className="col-activity">
                  <p className="label-activity">Hoạt động</p>
                  <List
                    itemLayout="horizontal"
                    dataSource={historyActivity.slice(0, 4)}
                    renderItem={(item, index) => {
                      const subject = item?.id_admin_action
                        ? item?.title_admin.replace(
                            item?.id_admin_action?._id,
                            item?.id_admin_action?.full_name
                          )
                        : item?.id_customer
                        ? item?.title_admin.replace(
                            item?.id_customer?._id,
                            item?.id_customer?.full_name
                          )
                        : item?.id_collaborator
                        ? item?.title_admin.replace(
                            item?.id_collaborator?._id,
                            item?.id_collaborator?.full_name
                          )
                        : item?.id_promotion
                        ? item?.title_admin.replace(
                            item?.id_promotion?._id,
                            item?.id_promotion?.code
                          )
                        : "";

                      const predicate = item?.id_reason_punish
                        ? subject.replace(
                            item?.id_reason_punish?._id,
                            item?.id_reason_punish?.title?.vi
                          )
                        : item?.id_reward
                        ? subject.replace(
                            item?.id_reward?._id,
                            item?.id_reward?.title?.vi
                          )
                        : item?.id_info_reward_collaborator
                        ? subject.replace(
                            item?.id_info_reward_collaborator?._id,
                            item?.id_info_reward_collaborator
                              ?.id_reward_collaborator?.title?.vi
                          )
                        : item?.id_transistion_collaborator
                        ? subject.replace(
                            item?.id_transistion_collaborator?._id,
                            item?.id_transistion_collaborator?.transfer_note
                          )
                        : item?.id_collaborator
                        ? subject.replace(
                            item?.id_collaborator?._id,
                            item?.id_collaborator?.full_name
                          )
                        : item?.id_customer
                        ? subject.replace(
                            item?.id_customer?._id,
                            item?.id_customer?.full_name
                          )
                        : item?.id_promotion
                        ? subject.replace(
                            item?.id_promotion?._id,
                            item?.id_promotion?.title?.vi
                          )
                        : item?.id_admin_action
                        ? subject.replace(
                            item?.id_admin_action?._id,
                            item?.id_admin_action?.full_name
                          )
                        : item?.id_address
                        ? subject.replace(item?.id_address, item?.value_string)
                        : item?.id_order
                        ? subject.replace(
                            item?.id_order?._id,
                            item?.id_order?.id_view
                          )
                        : item?.id_transistion_customer
                        ? subject.replace(
                            item?.id_transistion_customer?._id,
                            item?.id_transistion_customer?.transfer_note
                          )
                        : "";

                      const object = item?.id_collaborator
                        ? predicate.replace(
                            item?.id_collaborator?._id,
                            item?.id_collaborator?.full_name
                          )
                        : item?.id_address
                        ? predicate.replace(
                            item?.id_address,
                            item?.value_string
                          )
                        : item?.id_order
                        ? predicate.replace(
                            item?.id_order?._id,
                            item?.id_order?.id_view
                          )
                        : item?.id_transistion_collaborator
                        ? predicate.replace(
                            item?.id_transistion_collaborator?._id,
                            item?.id_transistion_collaborator?.transfer_note
                          )
                        : item?.id_transistion_customer
                        ? predicate.replace(
                            item?.id_transistion_customer?._id,
                            item?.id_transistion_customer?.transfer_note
                          )
                        : predicate.replace(
                            item?.id_reason_cancel?._id,
                            item?.id_reason_cancel?.title?.vi
                          );
                      return (
                        <div className="div-list" key={index}>
                          <div className="div-line">
                            <div className="circle" />
                            <div className="line-vertical" />
                          </div>
                          <div className="div-details-activity">
                            <a className="text-date-activity">
                              {moment(new Date(item?.date_create)).format(
                                "DD/MM/YYYY HH:mm"
                              )}
                            </a>
                            <a className="text-content-activity">{object}</a>
                          </div>
                        </div>
                      );
                    }}
                  />
                  <MoreActivity />
                </div>
              )}
            </Col>
          </Row>
        </div>
        <div>
          <Row>
            <Col lg="6">
              {checkElement?.includes("total_customer_monthly_dashboard") && (
                <div className="div-chart-user">
                  <h4>Tổng lượt đăng kí</h4>
                  <div className="div-time-area">
                    <div>
                      <a className="text-time">Thời gian</a>
                      <DatePicker
                        picker="year"
                        onChange={onChange}
                        defaultValue={dayjs("2023", yearFormat)}
                        format={yearFormat}
                      />
                    </div>
                  </div>
                  <div className="mt-3 divl-total">
                    <a className="text-total-user">Tổng user</a>
                    <div className="div-total">
                      <a className="text-number-total">{totalYearUser}</a>
                    </div>
                  </div>
                  <div className="mt-3">
                    <ResponsiveContainer
                      width={"100%"}
                      height={350}
                      min-width={350}
                    >
                      <ComposedChart
                        width={500}
                        height={300}
                        data={dataChartUser.slice(
                          0,
                          moment().utc().month() + 1
                        )}
                        margin={{
                          top: 20,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                        barSize={50}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                          dataKey="month"
                          tickFormatter={(tickItem) => "Tháng " + tickItem}
                        />
                        <YAxis />
                        <Tooltip content={renderTooltipContentUser} />
                        <Legend />

                        <Bar
                          dataKey="totalOld"
                          fill="#82ca9d"
                          minPointSize={20}
                          barSize={20}
                          name="Khách hàng cũ"
                          stackId="a"
                        />

                        <Bar
                          dataKey="totalNew"
                          fill="#4376CC"
                          minPointSize={20}
                          barSize={20}
                          name="Khách hàng mới"
                          stackId="a"
                          label={{
                            position: "top",
                            fill: "black",
                            fontSize: 14,
                          }}
                        />
                        <Line
                          type="monotone"
                          dataKey="totalNew"
                          stroke="#ff7300"
                          name="Khách hàng mới"
                        />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}
            </Col>
            <Col lg="6">
              {checkElement?.includes("report_cancel_order_dashboard") && (
                <div className="div-chart-pie-total-cancel-dash">
                  <a className="title-chart"> Thống kê đơn huỷ </a>
                  <div className="div-pie-chart-cancel">
                    <div className="div-total-piechart">
                      <div className="item-total">
                        <a className="title-total">Tổng đơn huỷ</a>
                        <a className="text-colon">:</a>
                        <a className="number-total">
                          {dataTotalChartCancel?.total_cancel_order}
                        </a>
                      </div>
                      <div className="item-total">
                        <a className="title-total">Đơn huỷ khách hàng</a>
                        <a className="text-colon">:</a>
                        <a className="number-total">
                          {dataTotalChartCancel?.total_cancel_order_by_customer}
                        </a>
                      </div>
                      <div className="item-total">
                        <a className="title-total">Đơn huỷ hệ thống</a>
                        <a className="text-colon">:</a>
                        <a className="number-total">
                          {dataTotalChartCancel?.total_cancel_order_by_system}
                        </a>
                      </div>
                      <div className="item-total">
                        <a className="title-total">Đơn huỷ quản trị viên</a>
                        <a className="text-colon">:</a>
                        <a className="number-total">
                          {
                            dataTotalChartCancel?.total_cancel_order_by_user_system
                          }
                        </a>
                      </div>
                    </div>
                    <div className="div-pie-cancel">
                      <ResponsiveContainer height={300} min-width={500}>
                        <PieChart>
                          <Pie
                            data={dataChartCancel}
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            label={renderLabelCancel}
                            margin={{
                              top: 20,
                              right: 50,
                              left: 50,
                              bottom: 5,
                            }}
                          >
                            {dataChartCancel.map((entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={
                                  COLORS_CANCEL[index % COLORS_CANCEL.length]
                                }
                              />
                            ))}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              )}
            </Col>
          </Row>
        </div>
      </div>
      <FloatButton.BackTop />
    </div>
  );
}

const COLORS_CANCEL = ["#FCD34D", "#FBBF24", "#F59E0B", "#ff8000", "#ff1919"];
