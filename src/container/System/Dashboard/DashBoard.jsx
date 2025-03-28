import {
  Col,
  DatePicker,
  FloatButton,
  Image,
  List,
  Progress,
  Row,
  Select,
  Table,
} from "antd";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import moment from "moment";
import "moment/locale/vi";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
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
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  getReportCancelReport,
  getReportServiceDetails,
  getTotalCustomerYear,
} from "../../../api/report";
import { getDayReportApi, getTotalReportApi } from "../../../api/statistic";
import CustomDatePicker from "../../../components/customDatePicker";
import MoreTopCollaborator from "../../../components/moreTopCollaborator";
import { formatMoney, formatNumber } from "../../../helper/formatMoney";
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
import { getProvince } from "../../../redux/selectors/service";
import useWindowDimensions from "../../../helper/useWindowDimensions";
import RangeDatePicker from "../../../components/datePicker/RangeDatePicker";
import avatarDefaultImage from "../../../assets/images/user.png";
import icons from "../../../utils/icons";
import { errorNotify } from "../../../helper/toast";
import { getCurrentLeaderBoardApi } from "../../../api/accumulation";
import {
  calculateNumberPercent,
  formatName,
  getInitials,
} from "../../../utils/contant";
import CardInfo from "../../../components/card";
import CardActivityLog from "../../../components/card/cardActivityLog";
import DataTable from "../../../components/tables/dataTable";
import CustomHeaderDatatable from "../../../components/tables/tableHeader";

moment.locale("vi");
dayjs.extend(customParseFormat);

const { FaCrown, IoPeople, IoPerson, IoCart, IoStatsChart, IoCash } = icons;

const Home = () => {
  const yearFormat = "YYYY";
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const historyActivity = useSelector(getHistoryActivitys);
  const activeUser = useSelector(getActiveUsers);
  const lastestService = useSelector(getLastestServices);
  const connectionService = useSelector(getServiceConnects);
  const topCollaborator = useSelector(getTopCollaborators);
  const checkElement = useSelector(getElementState);
  const lang = useSelector(getLanguageState);
  const province = useSelector(getProvince);

  /* ~~~ Value ~~~ */
  const [startPage, setStartPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const [totalMoneyChart, setTotalMoneyChart] = useState(0);
  const [totalYearUser, setTotalYearUser] = useState(0);
  const [codeCity, setCodeCity] = useState();
  const [nameCity, setNameCity] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [startDatePrevious, setStartDatePrevious] = useState("");
  const [endDatePrevious, setEndDatePrevious] = useState("");
  const [lengthPage, setLengthPage] = useState(
    JSON.parse(localStorage.getItem("linePerPage"))
      ? JSON.parse(localStorage.getItem("linePerPage")).value
      : 20
  );
  /* ~~~ List ~~~ */
  const [arrResult, setArrResult] = useState([]);
  const [dataChartCancel, setDataChartCancel] = useState([]);
  const [dataTotalChartCancel, setDataTotalChartCancel] = useState([]);
  const [dataChartServiceDetails, setDataChartServiceDetails] = useState([]);
  const [day, setDay] = useState([]);
  const [dataUser, setDataUser] = useState([]);
  const [listRanking, setListRanking] = useState([]);
  const [listTotalStatisticHeader, setListTotalStatisticHeader] = useState([]);
  const dataChartUser = [];
  const cityData = [];
  const dataChartDetail = [];
  const COLORS_CANCEL = ["#FCD34D", "#FBBF24", "#F59E0B", "#ff8000", "#ff1919"];
  const columns = [
    {
      customTitle: <CustomHeaderDatatable title="STT" />,
      key: "case_numbering",
      width: 50,
    },
    {
      customTitle: <CustomHeaderDatatable title="Mã đơn" />,
      dataIndex: "id_view",
      key: "case_code_order",
      width: 140,
    },
    {
      customTitle: <CustomHeaderDatatable title="Ngày Tạo" />,
      dataIndex: "date_create",
      key: "case_date-create-time",
      width: 100,
    },
    {
      customTitle: <CustomHeaderDatatable title="Khách hàng" />,
      dataIndex: "customer",
      key: "case_customer_name_phone_rank",
      width: 140,
    },
    {
      customTitle: <CustomHeaderDatatable title="Dịch vụ" />,
      key: "case_service",
      width: 110,
    },
    {
      customTitle: <CustomHeaderDatatable title="Ngày làm" />,
      dataIndex: "date_work",
      key: "case_date-work-day",
      width: 100,
    },
    {
      customTitle: <CustomHeaderDatatable title="Địa chỉ" />,
      dataIndex: "address",
      key: "case_text",
      width: 220,
    },
    {
      customTitle: <CustomHeaderDatatable title="Đối tác" />,
      key: "case_collaborator-name-phone-star",
      width: 150,
    },
    {
      customTitle: <CustomHeaderDatatable title="Trạng thái" />,
      dataIndex: "status",
      key: "case_status",
      width: 120,
    },
    {
      customTitle: <CustomHeaderDatatable title="Thanh toán" />,
      key: "case_payment-method",
      width: 90,
    },
  ];
  const [ratingStatistic, setRatingStatistic] = useState([
    { name: "Thg 1", value: 30 },
    { name: "Thg 2", value: 20 },
    { name: "Thg 3", value: 40 },
    { name: "Thg 4", value: 50 },
    { name: "Thg 5", value: 10 },
    { name: "Thg 6", value: 23 },
    { name: "Thg 7", value: 54 },
    { name: "Thg 8", value: 40 },
    { name: "Thg 9", value: 23 },
    { name: "Thg 10", value: 40 },
    { name: "Thg 11", value: 70 },
    { name: "Thg 12", value: 100 },
  ]); // Tổng số giá trị (đánh giá, khen thưởng, vi phạm) thống kê theo từng tháng
  const COLORS_RATING = {
    colorBlue: "#3b82f6",
    colorLightBlue: "#93c5fd",
    colorMoreLightBlue: "#bfdbfe",
    colorExtraLightBlue: "#dbeafe",
    //
    colorRed: "#ef4444",
    colorLightRed: "#fca5a5",
    colorMoreLightRed: "#fecaca",
    colorExtraLightRed: "#fee2e2",
    //
    colorGreen: "#22c55e",
    colorLightGreen: "#86efac",
    colorMoreLightGreen: "#bbf7d0",
    colorExtraLightGreen: "#dcfce7",
  };
  const [colorRatingStatistic, setColorRatingStatistic] = useState({
    color: `${COLORS_RATING.colorBlue}`,
    lightColor: `${COLORS_RATING.colorLightBlue}`,
    moreLightColor: `${COLORS_RATING.colorMoreLightBlue}`,
    ExtraLightcolor: `${COLORS_RATING.colorExtraLightBlue}`,
  }); // Giá trị màu cho thống kê: đánh giá, khen thưởng, vi phạm

  /* ~~~ Flag ~~~ */
  const [isExpandListRanking, setIsExpandListRanking] = useState(false);

  /* ~~~ Handle function ~~~ */
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

  const renderTooltipContent = (o) => {
    const { payload, label } = o;
    return (
      <div className="dash-board__content-tool-chart">
        <div className="dash-board__content-tool-chart--title ">
          <span className="high-light">Ngày:</span>
          <span>{label}</span>
        </div>

        <div className="dash-board__content-tool-chart--title ">
          <span className="high-light">GMV:</span>
          <span className="money">
            {payload?.length > 0
              ? formatMoney(payload[0]?.payload?.total_gross_income)
              : 0}
          </span>
        </div>

        <div className="dash-board__content-tool-chart--title ">
          <span className="high-light">Tổng đơn:</span>
          <span>
            {payload?.length > 0 ? payload[0]?.payload?.total_item : 0}&nbsp;đơn
          </span>
        </div>
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
          ? `${i18n.t("system", { lng: lang })}`
          : name === "customer_cancel"
          ? `${i18n.t("customer", { lng: lang })}`
          : `${i18n.t("admin", { lng: lang })}`}{" "}
        ({value} {"%"})
      </text>
    );
  };

  // const fetchCurrentRank = async () => {
  //   try {
  //     const res = await getCurrentLeaderBoardApi();
  //     setListRanking(res.data);
  //   } catch (err) {
  //     errorNotify({ message: err?.message || err });
  //   }
  // };

  const fetchTotalStatisticHeader = async () => {
    try {
      const res = await getTotalReportApi("", "");
      setListTotalStatisticHeader(res);
    } catch (err) {
      errorNotify({ message: err?.message || err });
    }
  };

  /* ~~~ useEffect ~~~ */
  useEffect(() => {
    if (startDate !== "") {
      // Nếu có total finance job dashboard thì chạy api với giá trị startDate và endDate
      if (checkElement?.includes("total_finance_job_dashboard")) {
        getDayReportApi(startDate, endDate)
          .then((res) => {
            console.log("check res", res);
            setArrResult(res.arrResult);
            setTotalMoneyChart(res?.total_money);
            getDates(startDate, endDate);
          })
          .catch((err) => {});
      }
      if (checkElement?.includes("connection_service_dashboard")) {
        dispatch(getServiceConnect.getServiceConnectRequest());
      }
      if (checkElement?.includes("history_activity_dashboard")) {
        dispatch(
          getHistoryActivity.getHistoryActivityRequest({
            lang: lang,
            start: 0,
            length: 20,
          })
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
      setCodeCity(province[1]?.code);
      setNameCity(province[1]?.name);

      if (checkElement?.includes("report_detail_service_dashboard")) {
        getReportServiceDetails(startDate, endDate, "")
          .then((res) => {
            setDataChartServiceDetails(res?.detailData);
          })
          .catch((err) => {});
      }

      if (checkElement?.includes("report_cancel_order_dashboard")) {
        getReportCancelReport(startDate, endDate, "", "")
          .then((res) => {
            setDataChartCancel(res?.percent);
            setDataTotalChartCancel(res);
          })
          .catch((err) => {});
      }
    }
  }, [startDate]);

  useEffect(() => {
    let sum = 0;
    for (let i = 0; i < dataUser.length; i++) {
      setTotalYearUser((sum += dataUser[i].totalNew));
    }
  }, [dataUser]);

  useEffect(() => {
    fetchTotalStatisticHeader();
    // fetchCurrentRank();
  }, []);

  /* ~~~ Other ~~~ */
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
  }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.2;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="black"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
      >
        {percent > 0 && `${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  dataUser.map((item, index) => {
    return dataChartUser.push({
      totalNew: item?.totalNew,
      totalOld: item?.totalOld,
      total: item?.totalAll,
      month: index + 1,
    });
  });

  province?.map((item) => {
    return cityData?.push({
      value: item?.code,
      label: item?.name,
      districts: item?.districts,
    });
  });

  dataChartServiceDetails?.map((item) => {
    return dataChartDetail?.push({
      title: item?.title[0]?.[lang],
      percent_2_hour: item?.total_2_hour,
      percent_3_hour: item?.total_3_hour,
      percent_4_hour: item?.total_4_hour,
    });
  });

  const onChangePageHistoryActivity = (value) => {
    // setStartPageHistoryActivities(value);
  };

  const onChangePage = (value) => {
    setStartPage(value);
  };

  const data = [
    { name: "Done Order", value: connectionService.donePercent },
    { name: "Not Done Order", value: 100 - connectionService.donePercent },
  ];
  const COLORS = ["#8b5cf6", "#e5e7eb"];

  return (
    <div className="dash_board">
      <div className="dash_board__container-first-line">
        {/* Left */}
        <div className="dash_board__container--statistic">
          {/* Thẻ thống kê */}
          <div className="dash_board__container--statistic-cards card-shadow">
            <div className="dash_board__container--statistic-cards-card">
              <div className="dash_board__container--statistic-cards-card-icon blue">
                <span>
                  <IoPeople />
                </span>
              </div>
              <div className="dash_board__container--statistic-cards-card-info">
                <span className="dash_board__container--statistic-cards-card-info-title">
                  Tổng khách hàng
                </span>
                <span className="dash_board__container--statistic-cards-card-info-number">
                  {formatNumber(listTotalStatisticHeader?.total_customer || 0)}
                  &nbsp;người
                </span>
              </div>
            </div>
            <div className="dash_board__container--statistic-cards-card">
              <div className="dash_board__container--statistic-cards-card-icon green">
                <span>
                  <IoPerson />
                </span>
              </div>
              <div className="dash_board__container--statistic-cards-card-info">
                <span className="dash_board__container--statistic-cards-card-info-title">
                  Tổng đối tác
                </span>
                <span className="dash_board__container--statistic-cards-card-info-number">
                  {formatNumber(
                    listTotalStatisticHeader?.total_collaborator || 0
                  )}
                  &nbsp;người
                </span>
              </div>
            </div>
            <div className="dash_board__container--statistic-cards-card">
              <div className="dash_board__container--statistic-cards-card-icon yellow">
                <span>
                  <IoCart />
                </span>
              </div>
              <div className="dash_board__container--statistic-cards-card-info">
                <span className="dash_board__container--statistic-cards-card-info-title">
                  Tổng đơn hàng
                </span>
                <span className="dash_board__container--statistic-cards-card-info-number">
                  {formatNumber(listTotalStatisticHeader?.total_order || 0)}
                  &nbsp;đơn
                </span>
              </div>
            </div>
            <div className="dash_board__container--statistic-cards-card">
              <div className="dash_board__container--statistic-cards-card-icon red">
                <span>
                  <IoCash />
                </span>
              </div>
              <div className="dash_board__container--statistic-cards-card-info">
                <span className="dash_board__container--statistic-cards-card-info-title">
                  Tổng doanh thu
                </span>
                <span className="dash_board__container--statistic-cards-card-info-number">
                  {formatMoney(listTotalStatisticHeader?.total_revenue || 0)}
                </span>
              </div>
            </div>
          </div>
          {/* Biểu đồ */}
          <div className="dash_board__container--statistic-chart card-shadow">
            <div className="dash_board__container--statistic-chart-header">
              <span className="dash_board__container--statistic-chart-header-title">
                Thống kê đơn hàng theo ngày
              </span>
            </div>
            <div className="dash_board__container--statistic-chart-body">
              <div className="dash_board__container--statistic-chart-body-filter">
                <div></div>
                <div className="dash_board__container--statistic-chart-body-filter-time">
                  <RangeDatePicker
                    setStartDate={setStartDate}
                    setEndDate={setEndDate}
                    rangeDateDefaults={"thirty_last"}
                    rangeDatePrevious
                  />
                  <div className="dash_board__container--statistic-chart-body-filter-time-same-date">
                    <span className="dash_board__container--statistic-chart-body-filter-time-same-date-title">
                      Kỳ này:
                    </span>
                    <span className="dash_board__container--statistic-chart-body-filter-time-same-date-content">
                      {moment(startDate).format("DD/MM/YYYY")}&nbsp;-&nbsp;
                      {moment(endDate).format("DD/MM/YYYY")}
                    </span>
                  </div>
                </div>
              </div>
              <div className="dash_board__container--statistic-chart-body-data">
                <ResponsiveContainer width="97%" height={350}>
                  <AreaChart data={arrResult}>
                    <defs>
                      <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                        <stop
                          offset="15%"
                          stopColor={"#d8b4fe"}
                          stopOpacity={0.9}
                        />
                        <stop
                          offset="100%"
                          stopColor={"#d8b4fe"}
                          stopOpacity={0.2}
                        />
                      </linearGradient>
                    </defs>
                    <XAxis
                      interval="preserveStartEnd"
                      dataKey="_id"
                      axisLine={false}
                      tickLine={false}
                      tick={{
                        fontSize: 12,
                        fontFamily: "Roboto",
                        fill: "#475569",
                      }}
                      tickFormatter={(tickItem) => tickItem.slice(0, 5)}
                    />
                    <CartesianGrid strokeDasharray="5 10" vertical={false} />
                    <RechartsTooltip content={renderTooltipContent} />
                    <Area
                      // label={true}
                      type="monotone"
                      dataKey="total_item"
                      stroke={"#7c3aed"}
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorUv)"
                      dot={{ r: 3 }}
                      activeDot={{ r: 6 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
        {/* Right */}
        <div className="dash_board__container--activity">
          <CardInfo
            cardHeader="Lịch sử hoạt động"
            cardContent={
              <CardActivityLog
                data={historyActivity}
                totalItem={historyActivity?.length}
                dateIndex="date_create"
                statusIndex="type"
                pageSize={lengthPage}
                setLengthPage={setLengthPage}
                onCurrentPageChange={onChangePageHistoryActivity}
                pagination={true}
              />
            }
          />
        </div>
      </div>
      <div className="dash-board__container-second-line">
        <div className="dash-board__container-second-line-left">
          <div className="dash_board__container--ranking-board card-shadow">
            <div className="dash_board__container--ranking-board-more-detail">
              <MoreTopCollaborator />
            </div>
            <div className="dash_board__container--ranking-board__background-circle"></div>
            <div
              className={`dash_board__container--ranking-board__list ${
                isExpandListRanking && "expanded"
              }`}
            >
              <div
                onClick={() => setIsExpandListRanking(!isExpandListRanking)}
                className="dash_board__container--ranking-board__list--expand"
              >
                <div className="dash_board__container--ranking-board__list--expand-dot"></div>
              </div>
              <div className="dash_board__container--ranking-board__list--container">
                {topCollaborator?.slice(3).map((el, index) => (
                  <div
                    key={index}
                    className="dash_board__container--ranking-board__list--container-child"
                  >
                    <div className="dash_board__container--ranking-board__list--container-child-number">
                      <span>{index + 4}</span>
                    </div>
                    <div className="dash_board__container--ranking-board__list--container-child-avatar">
                      <Image
                        src={el?.avatar || avatarDefaultImage}
                        alt=""
                      ></Image>
                    </div>
                    <div className="dash_board__container--ranking-board__list--container-child-info">
                      <span className="dash_board__container--ranking-board__list--container-child-info-name">
                        {el?.full_name || ""}
                      </span>
                      <span className="dash_board__container--ranking-board__list--container-child-info-point">
                        {formatMoney(el?.sumIncome) || ""}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="dash_board__container--ranking-board__columns">
              <div className="dash_board__container--ranking-board__columns--child medium">
                <div className="dash_board__container--ranking-board__columns--child-avatar">
                  <Image
                    src={topCollaborator[1]?.avatar || avatarDefaultImage}
                    alt=""
                  ></Image>
                </div>
                <span
                  onClick={() =>
                    navigate(`details-collaborator/${topCollaborator[1]._id}`)
                  }
                  className="dash_board__container--ranking-board__columns--child-info"
                >
                  {formatName(topCollaborator[1]?.full_name || "")}
                </span>
                <div className="dash_board__container--ranking-board__columns--child-point second-place">
                  <span>
                    {formatMoney(topCollaborator[1]?.sumIncome) || ""}
                  </span>
                </div>
                <div className="dash_board__container--ranking-board__columns--child-trapezoid"></div>
                <div className="dash_board__container--ranking-board__columns--child-vertical">
                  <span className="dash_board__container--ranking-board__columns--child-vertical-number">
                    2
                  </span>
                </div>
              </div>
              <div className="dash_board__container--ranking-board__columns--child large">
                <div className="dash_board__container--ranking-board__columns--child-avatar">
                  <Image
                    src={topCollaborator[0]?.avatar || avatarDefaultImage}
                    alt=""
                  ></Image>
                  <div className="dash_board__container--ranking-board__columns--child-avatar-medal">
                    <FaCrown color="white" size="10px" />
                  </div>
                </div>
                <span
                  onClick={() =>
                    navigate(`details-collaborator/${topCollaborator[0]._id}`)
                  }
                  className="dash_board__container--ranking-board__columns--child-info"
                >
                  {formatName(topCollaborator[0]?.full_name || "")}
                </span>
                <div className="dash_board__container--ranking-board__columns--child-point first-place">
                  <span>
                    {formatMoney(topCollaborator[0]?.sumIncome) || ""}
                  </span>
                </div>
                <div className="dash_board__container--ranking-board__columns--child-trapezoid"></div>
                <div className="dash_board__container--ranking-board__columns--child-vertical">
                  <span className="dash_board__container--ranking-board__columns--child-vertical-number">
                    1
                  </span>
                </div>
              </div>
              <div className="dash_board__container--ranking-board__columns--child small">
                <div className="dash_board__container--ranking-board__columns--child-avatar">
                  <Image
                    src={topCollaborator[2]?.avatar || avatarDefaultImage}
                    alt=""
                  ></Image>{" "}
                </div>
                <span
                  onClick={() =>
                    navigate(`details-collaborator/${topCollaborator[2]._id}`)
                  }
                  className="dash_board__container--ranking-board__columns--child-info"
                >
                  {formatName(topCollaborator[2]?.full_name || "")}
                </span>
                <div className="dash_board__container--ranking-board__columns--child-point third-place">
                  <span>
                    {formatMoney(topCollaborator[2]?.sumIncome) || ""}
                  </span>
                </div>
                <div className="dash_board__container--ranking-board__columns--child-trapezoid"></div>
                <div className="dash_board__container--ranking-board__columns--child-vertical">
                  <span className="dash_board__container--ranking-board__columns--child-vertical-number">
                    3
                  </span>
                </div>
              </div>
            </div>
          </div>
      <div className="dash_board__container--pie-chart">
          <div className="dash_board__container--pie-chart-activity card-shadow">
            <div className="dash_board__container--pie-chart-activity-header">
              <span>Tỉ lệ kết nối</span>
            </div>
            <div className="dash_board__container--pie-chart-activity-body">
              <ResponsiveContainer width="100%" height={210}>
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomizedLabel}
                    outerRadius={100}
                    innerRadius={70}
                    fill="#8884d8"
                    dataKey="value"
                    paddingAngle={5}
                  >
                    {data.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="dash_board__container--pie-chart-activity-body-note">
                <div className="dash_board__container--pie-chart-activity-body-note">
                  <div className="dash_board__container--pie-chart-activity-body-note-mark green"></div>
                  <span>Hoàn thành</span>
                </div>
                <div className="dash_board__container--pie-chart-activity-body-note">
                  <div className="dash_board__container--pie-chart-activity-body-note-mark red"></div>
                  <span>Chưa hoàn thành</span>
                </div>
              </div>
            </div>
          </div>
          <div className="dash_board__container--pie-chart-connection-service card-shadow">
            <div className="dash_board__container--pie-chart-connection-service-header">
              <span>Phần trăm hoạt động</span>
            </div>
            <div className="dash_board__container--pie-chart-connection-service-content">
              <div className="dash_board__container--pie-chart-connection-service-content-item">
                <div className="dash_board__container--pie-chart-connection-service-content-item-title">
                  <span className="high-light">Online</span>
                  <span className="value">
                    {formatNumber(activeUser?.ActiveUsers || 0)}&nbsp;người
                  </span>
                </div>
                <div className="dash_board__container--pie-chart-connection-service-content-item-progressbar ">
                  <div
                    style={{
                      width: `${calculateNumberPercent(
                        activeUser.AllUser,
                        activeUser?.ActiveUsers
                      )}%`,
                    }}
                    className={`dash_board__container--pie-chart-connection-service-content-item-progressbar-percent online`}
                  ></div>
                </div>
              </div>
              <div className="dash_board__container--pie-chart-connection-service-content-item">
                <div className="dash_board__container--pie-chart-connection-service-content-item-title">
                  <span className="high-light">Offline</span>
                  <span className="value">
                    {formatNumber(activeUser?.OfflineUsers || 0)}&nbsp;người
                  </span>
                </div>
                <div className="dash_board__container--pie-chart-connection-service-content-item-progressbar ">
                  <div
                    style={{
                      width: `${calculateNumberPercent(
                        activeUser.AllUser,
                        activeUser?.OfflineUsers
                      )}%`,
                    }}
                    className="dash_board__container--pie-chart-connection-service-content-item-progressbar-percent offline"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
        <div className="dash_board__container--order-statistic">
            <div className="dash_board__container--order-statistic-hour card-shadow">
              <div className="dash_board__container--order-statistic-hour-header">
                <span>Thống kê đơn hàng theo dịch vụ</span>
              </div>
              <div className="dash_board__container--order-statistic-hour-body">
                <ResponsiveContainer width="97%" height={215}>
                  <BarChart
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
                    {/* <YAxis /> */}
                    <RechartsTooltip />
                    <Legend />
                    <Bar
                      dataKey="percent_2_hour"
                      fill="#8884d8"
                      barSize={40}
                      minPointSize={10}
                      name={`2 ${i18n.t("hour", {
                        lng: lang,
                      })}`}
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
                      name={`3 ${i18n.t("hour", {
                        lng: lang,
                      })}`}
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
                      name={`4 ${i18n.t("hour", {
                        lng: lang,
                      })}`}
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
            <div className="dash_board__container--order-statistic-customer card-shadow">
              <div className="dash_board__container--order-statistic-customer-header">
                <span>Thống kê khách hàng</span>
              </div>
              <div className="dash_board__container--order-statistic-customer-body">
                <div className="dash_board__container--order-statistic-customer-body-total">
                  <span className="high-light">Tổng khách hàng:</span>
                  <span>10.000</span>
                </div>
                <ResponsiveContainer width="97%" height={200}>
                  <ComposedChart
                    data={dataChartUser.slice(0, moment().utc().month() + 1)}
                    margin={{
                      top: 10,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                    barSize={50}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="month"
                      tickFormatter={(tickItem) =>
                        `${i18n.t("month", {
                          lng: lang,
                        })}` +
                        " " +
                        tickItem
                      }
                    />
                    {/* <YAxis /> */}
                    <RechartsTooltip content={renderTooltipContentUser} />
                    <Legend />

                    <Bar
                      dataKey="totalOld"
                      fill="#82ca9d"
                      minPointSize={10}
                      barSize={20}
                      name={`${i18n.t("customer_old", {
                        lng: lang,
                      })}`}
                      stackId="a"
                    />

                    <Bar
                      dataKey="totalNew"
                      fill="#4376CC"
                      minPointSize={10}
                      barSize={20}
                      name={`${i18n.t("customer_new", {
                        lng: lang,
                      })}`}
                      stackId="a"
                      label={{
                        position: "top",
                        fill: "black",
                        fontSize: 12,
                        fontFamily: "Roboto",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="totalNew"
                      stroke="#ff7300"
                      name={`${i18n.t("customer_new", {
                        lng: lang,
                      })}`}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
      </div>
      <div className="dash_board__container--table">
        <DataTable
          columns={columns}
          data={lastestService}
          start={startPage}
          pageSize={lengthPage}
          setLengthPage={setLengthPage}
          totalItem={lastestService.length}
          onCurrentPageChange={onChangePage}
          loading={isLoading}
        />
      </div>
      <div className="dash_board__container">
        <div className="dash_board__container--pie-order-cancel card-shadow">
          <div className="dash_board__container--pie-order-cancel-header">
            <span>Thống kê đơn hủy</span>
          </div>
          <div className="dash_board__container--pie-order-cancel-body">
            <ResponsiveContainer width="97%" height={300}>
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
                      fill={COLORS_CANCEL[index % COLORS_CANCEL.length]}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="dash_board__container--pie-order-cancel-body-value">
              <div className="dash_board__container--pie-order-cancel-body-value-content">
                <span className="high-light">Tổng đơn hủy:</span>
                <span>{dataTotalChartCancel?.total_cancel_order}</span>
              </div>
              <div className="dash_board__container--pie-order-cancel-body-value-content">
                <span className="high-light">Đơn hủy từ khách:</span>
                <span>
                  {dataTotalChartCancel?.total_cancel_order_by_customer}
                </span>
              </div>

              <div className="dash_board__container--pie-order-cancel-body-value-content">
                <span className="high-light">Đơn hủy từ quản trị viên:</span>
                <span>
                  {dataTotalChartCancel?.total_cancel_order_by_user_system}
                </span>
              </div>
              <div className="dash_board__container--pie-order-cancel-body-value-content">
                <span className="high-light">Đơn hủy từ hệ thống:</span>
                <span>
                  {dataTotalChartCancel?.total_cancel_order_by_system}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
