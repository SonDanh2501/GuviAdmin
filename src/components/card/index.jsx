import React, { useEffect, useState } from "react";
import {
  renderStarFromNumber,
  calculateNumberPercent,
} from "../../utils/contant";
import {
  getCollaboratorsById,
  getHistoryOrderCollaborator,
  getListTrainingLessonByCollaboratorApi,
  getOverviewCollaborator,
  getReviewCollaborator,
  getHistoryActivityCollaborator,
  getListTransitionByCollaborator,
} from "../../api/collaborator";
import testLogo from "../../assets/images/testLogo.svg";
import moneyLogo from "../../assets/images/moneyLogo.svg";
import jobLogo from "../../assets/images/jobLogo.svg";
import avatarDefault from "../../assets/images/user.png";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  Rectangle,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  AreaChart,
  Area,
} from "recharts";
import { Image, Pagination, Popover, Select, Tooltip } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { loadingAction } from "../../redux/actions/loading";
import { errorNotify } from "../../helper/toast";
import moment from "moment";
import { getLanguageState } from "../../redux/selectors/auth";
import i18n from "../../i18n";
import { getProvince } from "../../redux/selectors/service";
import icons from "../../utils/icons";
import "./index.scss";
import { getListPunishTicketApi } from "../../api/punish";
import { formatMoney } from "../../helper/formatMoney";
const {
  IoAlertOutline,
  IoCalendarNumberOutline,
  IoCalendarOutline,
  IoCallOutline,
  IoCashOutline,
  IoCheckmark,
  IoCheckmarkCircleOutline,
  IoCheckmarkDoneOutline,
  IoCloseCircleOutline,
  IoFlagOutline,
  IoHeartOutline,
  IoHelpCircleOutline,
  IoHourglassOutline,
  IoLogoUsd,
  IoMedalOutline,
  IoNewspaperOutline,
  IoPersonOutline,
  IoReceiptOutline,
  IoShieldCheckmarkOutline,
  IoThumbsDownOutline,
  IoTimeOutline,
  IoCaretDown,
  IoTrendingUp,
  IoTrendingDown,
  IoAdd,
  IoRemove,
  IoConstruct,
  IoPeopleOutline,
  IoSettingsOutline,
  IoWalletOutline,
} = icons;

const IconTextCustom = (props) => {
  const { icon, label, content, subcontent } = props;
  return (
    <div className="card-statistics__icon--layout">
      {icon}
      <div className="card-statistics__icon--layout-content">
        <span className="card-statistics__icon--layout-content-sub">
          {label}
        </span>
        <span className="card-statistics__icon--layout-content-main">
          {content} {subcontent}
        </span>
      </div>
    </div>
  );
};
const timeFilterOptions = [
  {
    label: "Tháng nay",
    value: 1,
  },
  {
    label: "Tháng trước",
    value: 2,
  },
  {
    label: "3 tháng trước",
    value: 3,
  },
  {
    label: "Năm nay",
    value: 4,
  },
];
const COLORS = ["#2fc22f", "#3b82f6", "#FFD700", "#FFA500", "#dc2626"];
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
const MAX_LINE_WIDTH = 110;

const CardInfo = (props) => {
  const {
    cardHeader, // Tiêu đề của thẻ
    cardContent, // Nội dung của thẻ
    supportIcon, // Hiển thị icon bên cạnh tiêu đề
    supportText, // Chữ muốn hiển thị khi hover icon
    collaboratorId, // Id của CTV (dùng để lấy thông tin)
    collaboratorStar, // Số sao của CTV
    timeFilter, // Hiển thị bộ lọc thời gian
    collaboratorOverviewRating, // Thẻ tổng quan đánh giá
    collaboratorOverviewCriteria, // Thẻ tổng quan tiêu chí đánh giá
    collaboratorOverviewBonusAndPunish, // Thẻ tổng quan khen thưởng, vi phạm
    collaboratorOverviewTest, // Thẻ tổng quan bài kiểm tra
    collaboratorOverviewFinance, // Thẻ tổng quan tài chính
    collaboratorOverviewJobs, // Thẻ tổng quan hiệu quả công việc
    collaboratorOverviewActivitys, // Thẻ tổng quan hoạt động gần đây
    collaboratorOverviewInformation, // Thẻ tổng quan thông tin CTV
    collaboratorOverviewDocument, // Thẻ tổng quan tiến hành hồ sơ
    collaboratorRatingStar, // Thẻ tổng số đánh giá của CTV
    collaboratorRatingStatistic, // Thẻ thống kê lượt đánh giá theo từng tháng trong năm
    timePeriod, // Khoàng thời gian thống kê
    collaboratorActivityHistory,
    cardTotal, // Thẻ hiển thị tổng của một giá trị truyền vào
    cardTotalValue, // Giá trị để hiện thị trong thẻ tổng
    cardTotalIcon: CardTotalIcon, // Icon muốn thể hiện trong card total
    cardTotalLabel, // Giá trị header của total
    cardBarChart, // Thẻ thống kê theo kiểu cột
    cardData, // Giá trị
    cardHeight, // Giá trị chiều cao của thẻ
  } = props;
  const dispatch = useDispatch();
  const lang = useSelector(getLanguageState);
  const province = useSelector(getProvince);
  const [dataReview, setDataReview] = useState([]);
  const [totalCountRating, setTotalCountRating] = useState(0);
  const [collaboratorInformation, setCollaboratorInformation] = useState([]); // Thông tin của CTV
  const [data, setData] = useState([]);
  const [totalLesson, setTotalLesson] = useState([]); // Tổng các bài kiểm trả
  const [totalRecentActivities, setTotalRecentActivities] = useState([]); // Tổng các hoạt động gần đây (5 hoạt động)
  const [totalJobs, setTotalJobs] = useState(0); // Tổng số công việc (hoàn thành, hủy, đã nhận, đang làm)
  const [totalJobsSuccess, setTotalJobsSuccess] = useState(0); // Tổng số công việc hoàn thành
  const [totalJobsCancel, setTotalJobsCancel] = useState(0); // Tổng số công việc đã hủy
  const [totalJobsOther, setTotalJobsOther] = useState(0); // Tổng các công việc khác (đã nhận, đang làm)
  const [totalRatingOverview, setTotalRatingOverview] = useState([
    {
      name: "5 sao",
      value: 1,
    },
    {
      name: "4 sao",
      value: 1,
    },
    {
      name: "3 sao",
      value: 1,
    },
    {
      name: "2 sao",
      value: 1,
    },
    {
      name: "1 sao",
      value: 1,
    },
  ]); // Tổng số sao thống kê theo từng loại
  const [totalPunishTicket, setTotalPunishTicket] = useState(0);
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
  const [total, setTotal] = useState({
    total_favourite: 0,
    total_order: 0,
    total_hour: 0,
    remainder: 0,
    gift_remainder: 0,
  }); // Tổng các giá trị: số lượt yêu thích, số đơn hoàn thành, số giờ làm...
  const [colorRatingStatistic, setColorRatingStatistic] = useState({
    color: `${COLORS_RATING.colorBlue}`,
    lightColor: `${COLORS_RATING.colorLightBlue}`,
    moreLightColor: `${COLORS_RATING.colorMoreLightBlue}`,
    ExtraLightcolor: `${COLORS_RATING.colorExtraLightBlue}`,
  }); // Giá trị màu cho thống kê: đánh giá, khen thưởng, vi phạm
  const city = province.filter(
    (x) => x.code === collaboratorInformation.city
  )[0];
  const [dataHistory, setDataHistory] = useState([]); // Lịch sử các hoạt động liên quan đến đối tác
  const [currentPage, setCurrentPage] = useState(1);
  const onChange = (page) => {
    setCurrentPage(page);
    const dataLength = data.length < 10 ? 10 : data.length;
    const start = page * dataLength - dataLength;
    getHistoryActivityCollaborator(collaboratorId, start, 10)
      .then((res) => {
        setDataHistory(res);
      })
      .catch((err) => {
        errorNotify({
          message: err?.message,
        });
      });
  };
  // ~~~ Function ~~~
  // 1. Tổng quan đánh giá
  const getStar = (totalRating, setTotalRating, dataReview) => {
    if (totalRating.length > 0 && dataReview.totalItem > 0) {
      let fiveStar = 0;
      let fourStar = 0;
      let threeStar = 0;
      let twoStar = 0;
      let oneStar = 0;
      dataReview?.data?.forEach((el) => {
        if (el.star === 5) fiveStar += 1;
        if (el.star === 4) fourStar += 1;
        if (el.star === 3) threeStar += 1;
        if (el.star === 2) twoStar += 1;
        if (el.star === 1) oneStar += 1;
      });
      setTotalRating((prevTotalRating) =>
        prevTotalRating.map((item, index) => {
          if (index === 0) {
            return { ...item, value: fiveStar };
          }
          if (index === 1) {
            return {
              ...item,
              value: fourStar,
            };
          }
          if (index === 2) {
            return {
              ...item,
              value: threeStar,
            };
          }
          if (index === 3) {
            return {
              ...item,
              value: twoStar,
            };
          }
          if (index === 4) {
            return {
              ...item,
              value: oneStar,
            };
          }
          return item;
        })
      );
      // totalRatingOverview?.forEach((element) => {
      //   if (element.name === "5 sao") {
      //     element.value = fiveStar;
      //   }
      //   if (element.name === "4 sao") {
      //     element.value = fourStar;
      //   }
      //   if (element.name === "3 sao") {
      //     element.value = threeStar;
      //   }
      //   if (element.name === "2 sao") {
      //     element.value = twoStar;
      //   }
      //   if (element.name === "1 sao") {
      //     element.value = oneStar;
      //   }
      // });
      setTotalCountRating(fiveStar + fourStar + threeStar + twoStar + oneStar);
    }
  };
  // Hàm thống kê theo từng tháng
  const fetchDataPunishTicketStatisticsByMonth = (timePeriod) => {
    if (timePeriod) {
      for (const time of timePeriod) {
        getListPunishTicket(time.startOfMonth, time.endOfMonth, time.month);
      }
    }
    const totalValue = ratingStatistic.reduce(
      (acc, item) => acc + item.value,
      0
    );
    setTotalPunishTicket(totalValue);
  };
  const getListPunishTicket = async (startDate, endDate, month) => {
    let tempTotalPunishTicketStatusDone = 0;
    // Trick nhỏ để lấy total mà không cần viết một API mới
    const fetchPunishTicketTotal = await getListPunishTicketApi(
      0,
      1,
      "",
      `&start_date=${startDate ? startDate : ""}&end_date=${
        endDate ? endDate : ""
      }&search=${
        collaboratorInformation?.full_name
          ? collaboratorInformation?.full_name
          : ""
      }`
    );
    const fetchPunishticketData = await getListPunishTicketApi(
      0,
      fetchPunishTicketTotal?.totalItem,
      "",
      `&start_date=${startDate ? startDate : ""}&end_date=${
        endDate ? endDate : ""
      }&search=${
        collaboratorInformation?.full_name
          ? collaboratorInformation?.full_name
          : ""
      }`
    );
    fetchPunishticketData?.data?.map((el) => {
      if (el.status === "done") {
        tempTotalPunishTicketStatusDone += 1;
      }
    });
    if (tempTotalPunishTicketStatusDone !== 0) {
      setRatingStatistic((prevTotalRating) =>
        prevTotalRating.map((item, index) => {
          // Thg 1
          if (index === 0 && month === "1") {
            return { ...item, value: tempTotalPunishTicketStatusDone };
          }
          // Thg 2
          if (index === 1 && month === "2") {
            return { ...item, value: tempTotalPunishTicketStatusDone };
          }
          // Thg 3
          if (index === 2 && month === "3") {
            return { ...item, value: tempTotalPunishTicketStatusDone };
          }
          // Thg 4
          if (index === 3 && month === "4") {
            return { ...item, value: tempTotalPunishTicketStatusDone };
          }
          // Thg 5
          if (index === 4 && month === "5") {
            return { ...item, value: tempTotalPunishTicketStatusDone };
          }
          // Thg 6
          if (index === 5 && month === "6") {
            return { ...item, value: tempTotalPunishTicketStatusDone };
          }
          // Thg 7
          if (index === 6 && month === "7") {
            return { ...item, value: tempTotalPunishTicketStatusDone };
          }
          // Thg 8
          if (index === 7 && month === "8") {
            return { ...item, value: tempTotalPunishTicketStatusDone };
          }
          // Thg 9
          if (index === 8 && month === "9") {
            return { ...item, value: tempTotalPunishTicketStatusDone };
          }
          // Thg 10
          if (index === 9 && month === "10") {
            return { ...item, value: tempTotalPunishTicketStatusDone };
          }
          // Thg 11
          if (index === 10 && month === "11") {
            return { ...item, value: tempTotalPunishTicketStatusDone };
          }
          // Thg 12
          if (index === 11 && month === "12") {
            return { ...item, value: tempTotalPunishTicketStatusDone };
          }
          return item;
        })
      );
    }
  };
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
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
      >
        {percent > 0 && `${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };
  // 3. Hoạt động gần đây
  const timeWork = (data) => {
    const start = moment(new Date(data.date_work)).format("HH:mm");
    const timeEnd = moment(new Date(data?.date_work))
      .add(data?.total_estimate, "hours")
      .format("HH:mm");
    return start + " - " + timeEnd;
  };

  const handleChangeColorRatingStatistic = (type) => {
    if (type === "rating") {
      setColorRatingStatistic({
        ...colorRatingStatistic,
        color: COLORS_RATING.colorBlue,
        lightColor: COLORS_RATING.colorLightBlue,
        moreLightColor: COLORS_RATING.colorMoreLightBlue,
        ExtraLightcolor: COLORS_RATING.colorExtraLightBlue,
      });
    }
    if (type === "bonus") {
      setColorRatingStatistic({
        ...colorRatingStatistic,
        color: COLORS_RATING.colorGreen,
        lightColor: COLORS_RATING.colorLightGreen,
        moreLightColor: COLORS_RATING.colorMoreLightGreen,
        ExtraLightcolor: COLORS_RATING.colorExtraLightGreen,
      });
    }
    if (type === "punish") {
      setColorRatingStatistic({
        ...colorRatingStatistic,
        color: COLORS_RATING.colorRed,
        lightColor: COLORS_RATING.colorLightRed,
        moreLightColor: COLORS_RATING.colorMoreLightRed,
        ExtraLightcolor: COLORS_RATING.colorExtraLightRed,
      });
      fetchDataPunishTicketStatisticsByMonth(timePeriod);
    }
  };
  // ~~~ useEffect ~~~
  useEffect(() => {
    if (collaboratorId) {
      getCollaboratorsById(collaboratorId)
        .then((res) => {
          setCollaboratorInformation(res);
        })
        .catch((err) => {
          errorNotify({
            message: err?.message,
          });
        });
      // Thẻ đánh giá tổng quan, Thẻ đánh giá chi tiết số lượt đánh giá, Thẻ đánh giá chi tiết thống kê đánh giá
      if (
        collaboratorOverviewRating ||
        collaboratorRatingStar ||
        collaboratorRatingStatistic
      ) {
        let tempTotalDataReview = 0;
        getReviewCollaborator(collaboratorId, 0, 1)
          .then((res) => {
            tempTotalDataReview = res.totalItem;
          })
          .catch((err) => {});
        getReviewCollaborator(collaboratorId, 0, tempTotalDataReview)
          .then((res) => {
            getStar(totalRatingOverview, setTotalRatingOverview, res);
            setDataReview(res);
          })
          .catch((err) => {});
      }
      // Thẻ bài kiểm tra
      if (collaboratorOverviewTest) {
        getListTrainingLessonByCollaboratorApi(collaboratorId, 0, 20, "all")
          .then((res) => {
            setTotalLesson(res?.data);
          })
          .catch((err) => {});
      }
      // Thẻ tổng quan hiệu quả công việc, thẻ tổng quan hoạt động gần đây, thẻ tổng quan thông tin đối tác
      if (
        collaboratorOverviewJobs ||
        collaboratorOverviewActivitys ||
        collaboratorOverviewInformation
      ) {
        let tempTotalActivity = 0;
        dispatch(loadingAction.loadingRequest(true));
        getHistoryOrderCollaborator(collaboratorId, 0, 5)
          .then((res) => {
            tempTotalActivity = res.totalItem;
            setTotalJobs(res?.totalItem);
            setTotalRecentActivities(res?.data);
            dispatch(loadingAction.loadingRequest(false));
          })
          .catch((err) => {
            errorNotify({
              message: err?.message,
            });
            dispatch(loadingAction.loadingRequest(false));
          });

        let tempTotalDoneActivity = 0;
        let tempTotalCancelActivity = 0;
        let tempTotalOtherActivity = 0;
        getHistoryOrderCollaborator(collaboratorId, 0, tempTotalActivity)
          .then((res) => {
            // console.log("res", res);
            res?.data?.forEach((el) => {
              if (el.status === "done") tempTotalDoneActivity += 1;
              else if (el.status === "cancel") tempTotalCancelActivity += 1;
              else tempTotalOtherActivity += 1;
            });
            setTotalJobsSuccess(tempTotalDoneActivity);
            setTotalJobsCancel(tempTotalCancelActivity);
            setTotalJobsOther(tempTotalOtherActivity);
          })
          .catch((err) => {});
      }
      // Thẻ thông tin CTV, thẻ tiến hành hồ sơ
      if (collaboratorOverviewInformation || collaboratorOverviewDocument) {
        getOverviewCollaborator(collaboratorId)
          .then((res) => {
            setData(res?.arr_order?.reverse());
            setTotal({
              ...total,
              total_favourite: res?.total_favourite.length,
              total_hour: res?.total_hour,
              total_order: res?.total_order,
              remainder: res?.remainder,
              gift_remainder: res?.gift_remainder,
              work_wallet: res?.work_wallet,
              collaborator_wallet: res?.collaborator_wallet,
            });
          })
          .catch((err) => {});
        // getCollaboratorsById(collaboratorId)
        //   .then((res) => {
        //     setCollaboratorInformation(res);
        //   })
        //   .catch((err) => {
        //     errorNotify({
        //       message: err?.message,
        //     });
        //   });
      }
   
    }
  }, [collaboratorId, dispatch]);
  return (
    <div className="card-statistics card-shadow">
      {/* Header */}
      {cardHeader && (
        <div className="card-statistics__header">
          <div className="card-statistics__header--right">
            <span>{cardHeader}</span>
            {supportIcon && (
              <Tooltip
                placement="top"
                title={supportText ? supportText : "Tính năng chưa hoàn thiện"}
              >
                <IoHelpCircleOutline size={16} color="#9ca3af" />
              </Tooltip>
            )}
          </div>
          <div className="card-statistics__header--left">
            {timeFilter && (
              <Popover
                content={
                  <div className="flex flex-col">
                    {timeFilterOptions.map((el) => (
                      <span
                        style={{ borderRadius: "6px" }}
                        className="hover:bg-violet-500 hover:text-white cursor-pointer p-2 my-0.5 font-normal duration-300 flex items-center justify-between"
                      >
                        {el.label}
                      </span>
                    ))}
                  </div>
                }
                title=""
                trigger={"click"}
              >
                <div className="card-statistics__header--left-time">
                  <span
                    style={{ fontSizeL: 400, color: "#6b7280", opacity: "0.7" }}
                  >
                    Tháng nay
                  </span>
                  <IoCaretDown color="#9ca3af" />
                </div>
              </Popover>
            )}
          </div>
        </div>
      )}
      {/* New body code */}
      {cardContent && (
        <div className="card-statistics__content">{cardContent}</div>
      )}
      {/* Content */}
      <div>
        {/* Thẻ thể hiện tổng quan một giá trị duy nhất */}
        {cardTotal && (
          <div className="card-statistics__total">
            {/* Icon */}
            <div className="card-statistics__total--icon">
              <CardTotalIcon
                className="card-statistics__icon circle dark-purple small"
                color="white"
              />
            </div>
            {/* Body */}
            <div className="card-statistics__total--body">
              {/* left */}
              <div className="card-statistics__total--body-left">
                <span className="card-statistics__total--body-left-header">
                  {cardTotalLabel}
                </span>
                <span className="card-statistics__total--body-left-value">
                  {cardTotalValue}
                </span>
              </div>
              {/* right */}
              <div className="card-statistics__total--body-right">
                {/* <span>10%</span> */}
              </div>
            </div>
          </div>
        )}
        {/* Thẻ tổng lượt đánh giá */}
        {collaboratorRatingStar && (
          <div className="card-statistics__rating-overview">
            {/* Điểm đánh giá */}
            <div className="card-statistics__rating-overview--average-point">
              {/* Tựa đề hướng dẫn */}
              <span className="card-statistics__rating-overview--average-point-label">
                Các loại đánh giá
              </span>
              {/* Số điểm đánh giá */}
              <div className="card-statistics__rating-overview--average-point-number">
                <span className="card-statistics__rating-overview--average-point-number-sub">
                  Tổng đánh giá:
                </span>
                <span className="card-statistics__rating-overview--average-point-number-total">
                  {collaboratorStar?.toFixed(1)}
                </span>
              </div>
            </div>
            {/* Chart */}
            <div>
              <ResponsiveContainer height={259} width={"99%"}>
                <BarChart data={totalRatingOverview} barSize={30}>
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fontSize: 12,
                      fontFamily: "Roboto",
                      fill: "#475569",
                    }}
                  />
                  <RechartsTooltip />
                  <CartesianGrid strokeDasharray="5 10" vertical={false} />
                  <Bar
                    label={true}
                    dataKey="value"
                    fill="#fef08a"
                    // background={{ fill: "#eee" }}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
        {/* Thẻ thống kê lượt đánh giá theo từng tháng trong năm */}
        {collaboratorRatingStatistic && (
          <div className="card-statistics__rating-statistic">
            {/* Các thẻ thống kê tổng quát */}
            <div className="card-statistics__rating-statistic--card">
              {/* Đánh giá */}
              <div
                onClick={() => handleChangeColorRatingStatistic("rating")}
                className="card-statistics__rating-statistic--card-child card-child-blue"
              >
                <div className="card-statistics__rating-statistic--card-child-label">
                  <div className="card-statistics__rating-statistic--card-child-label-heading">
                    {/* <div></div> */}
                    <span>Đánh giá</span>
                  </div>
                  <span className="card-statistics__rating-statistic--card-child-label-number label-number-blue">
                    {totalCountRating}
                  </span>
                </div>
                <div className="card-statistics__rating-statistic--card-child-circle-outside circle-outside-blue"></div>
                <div className="card-statistics__rating-statistic--card-child-circle circle-blue"></div>
                <div className="card-statistics__rating-statistic--card-child-line-bottom line-bottom-blue"></div>
              </div>
              {/* Khen thưởng */}
              <div
                onClick={() => handleChangeColorRatingStatistic("bonus")}
                className="card-statistics__rating-statistic--card-child card-child-green"
              >
                <div className="card-statistics__rating-statistic--card-child-label">
                  <span className="card-statistics__rating-statistic--card-child-label-heading">
                    Khen thưởng
                  </span>
                  <span className="card-statistics__rating-statistic--card-child-label-number label-number-green">
                    23
                  </span>
                </div>
                <div className="card-statistics__rating-statistic--card-child-circle-outside circle-outside-green"></div>
                <div className="card-statistics__rating-statistic--card-child-circle circle-green"></div>
                <div className="card-statistics__rating-statistic--card-child-line-bottom line-bottom-green"></div>
              </div>
              {/* Vi phạm */}
              <div
                onClick={() => handleChangeColorRatingStatistic("punish")}
                className="card-statistics__rating-statistic--card-child card-child-red"
              >
                <div className="card-statistics__rating-statistic--card-child-label">
                  <span className="card-statistics__rating-statistic--card-child-label-heading">
                    Vi phạm
                  </span>
                  <span className="card-statistics__rating-statistic--card-child-label-number label-number-red">
                    {totalPunishTicket}
                  </span>
                </div>
                <div className="card-statistics__rating-statistic--card-child-circle-outside circle-outside-red"></div>
                <div className="card-statistics__rating-statistic--card-child-circle circle-red"></div>
                <div className="card-statistics__rating-statistic--card-child-line-bottom line-bottom-red"></div>
              </div>
            </div>
            {/* Chart */}
            <div className="card-statistics__rating-statistic--chart">
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={ratingStatistic}>
                  <defs>
                    <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="15%"
                        stopColor={colorRatingStatistic.lightColor}
                        stopOpacity={0.8}
                      />
                      <stop
                        offset="100%"
                        stopColor={colorRatingStatistic.lightColor}
                        stopOpacity={0}
                      />
                    </linearGradient>
                    {/* <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                    </linearGradient> */}
                  </defs>
                  <XAxis
                    interval="preserveStartEnd"
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fontSize: 12,
                      fontFamily: "Roboto",
                      fill: "#475569",
                    }}
                  />
                  {/* <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fontSize: 12,
                      fontFamily: "Roboto",
                      fill: "#475569",
                    }}
                  /> */}
                  <CartesianGrid strokeDasharray="5 10" vertical={false} />
                  <RechartsTooltip />
                  <Area
                    // label={true}
                    type="monotone"
                    dataKey="value"
                    stroke={colorRatingStatistic.color}
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
        )}
      </div>
    </div>
  );
};

export default CardInfo;