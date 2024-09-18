import React, { useEffect, useState } from "react";
import {
  renderStarFromNumber,
  calculateNumberPercent,
} from "../../utils/contant";
import {
  getCollaboratorsById,
  getHistoryActivityCollaborator,
  getListTrainingLessonByCollaboratorApi,
  getOverviewCollaborator,
  getReviewCollaborator,
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
import { Image, Popover, Select, Tooltip } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { loadingAction } from "../../redux/actions/loading";
import { errorNotify } from "../../helper/toast";
import moment from "moment";
import { getLanguageState } from "../../redux/selectors/auth";
import i18n from "../../i18n";
import { getProvince } from "../../redux/selectors/service";
import icons from "../../utils/icons";
import "./index.scss";
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
  IoWalletOutline,
  IoCaretDown,
  IoTrendingUp,
  IoTrendingDown,
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
const MAX_LINE_WIDTH = 110;

const CardInfo = (props) => {
  const {
    headerLabel, // Tiêu đề của thẻ
    supportIcon, // Hiển thị icon bên cạnh tiêu đề
    supportText, // Chữ muốn hiển thị khi hover icon
    collaboratorId, // Id của CTV (dùng để lấy thông tin)
    collaboratorStar, // Số sao của CTV
    timeFilter, // Hiển thị bộ lọc thời gian
    collaboratorRatingOverview, // Thẻ tổng quan đánh giá
    collaboratorCriteria, // Thẻ tiêu chí đánh giá
    collaboratorBonusAndPunish, // Thẻ khen thưởng, vi phạm
    collaboratorTest, // Thẻ bài kiểm tra
    collaboratorFinance, // Thẻ tài chính
    collaboratorJobs, // Thẻ hiệu quả công việc
    collaboratorActivitys, // Thẻ hoạt động gần đây
    collaboratorInformation, // Thẻ thông tin CTV
    collaboratorDocument, // Thẻ tiến hành hồ sơ
    collaboratorRating, // Thẻ tổng số đánh giá của CTV
    collaboratorRatingStatistic, // Thẻ thống kê lượt đánh giá theo từng tháng trong năm
    collaboratorRatingBonusAndPunish, // Thẻ thống kê lần được khen thưởng và phạt
  } = props;
  const dispatch = useDispatch();
  const lang = useSelector(getLanguageState);
  const [dataReview, setDataReview] = useState([]);
  const [totalCountRating, setTotalCountRating] = useState(0);
  const [dataDetail, setDataDetail] = useState([]);
  const province = useSelector(getProvince);
  const [data, setData] = useState([]);
  const [dataLesson, setDataLesson] = useState([]);
  const [dataRecentActivities, setDataRecentActivities] = useState([]);
  const [totalJobs, setTotalJobs] = useState(0);
  const [totalJobsSuccess, setTotalJobsSuccess] = useState(0);
  const [totalJobsCancel, setTotalJobsCancel] = useState(0);
  const [totalJobsOther, setTotalJobsOther] = useState(0);
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
  ]);
  const [dataRatingTemp, setdDtaRatingTemp] = useState([
    {
      name: "5 sao",
      value: 5,
    },
    {
      name: "4 sao",
      value: 2,
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
      value: 0,
    },
  ]);
  const [totalRating, setTotalRating] = useState([
    { name: "Số lượt khen thưởng", value: 20, color: "#00ff00" },
    { name: "Số lượt phạt", value: 10, color: "#ff0000" },
    { name: "Tổng", value: 30, color: "#3b82f6" },
  ]);
  const [ratingStatistic, setRatingStatistic] = useState([
    { name: "Thg 1", value: 90 },
    { name: "Thg 2", value: 70 },
    { name: "Thg 3", value: 85 },
    { name: "Thg 4", value: 60 },
    { name: "Thg 5", value: 75 },
    { name: "Thg 6", value: 70 },
    { name: "Thg 7", value: 90 },
    { name: "Thg 8", value: 65 },
    { name: "Thg 9", value: 80 },
    { name: "Thg 10", value: 70 },
    { name: "Thg 11", value: 70 },
    { name: "Thg 12", value: 70 },
  ]);
  const [total, setTotal] = useState({
    total_favourite: 0,
    total_order: 0,
    total_hour: 0,
    remainder: 0,
    gift_remainder: 0,
  });
  const city = province.filter((x) => x.code === dataDetail.city)[0];
  // ~~~ Function ~~~
  // 1. Tổng quan đánh giá
  const getStar = (totalRatingOverview, dataReview) => {
    if (totalRatingOverview.length > 0 && dataReview.totalItem > 0) {
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
      totalRatingOverview?.forEach((element) => {
        if (element.name === "5 sao") {
          element.value = fiveStar;
        }
        if (element.name === "4 sao") {
          element.value = fourStar;
        }
        if (element.name === "3 sao") {
          element.value = threeStar;
        }
        if (element.name === "2 sao") {
          element.value = twoStar;
        }
        if (element.name === "1 sao") {
          element.value = oneStar;
        }
      });
      setTotalCountRating(fiveStar + fourStar + threeStar + twoStar + oneStar);
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
  // 2. Tiêu chí đánh giá
  const getMultiLineText = (text, maxLineWidth) => {
    const words = text.split(" ");
    const lines = [];
    let currentLine = words[0];

    words.slice(1).forEach((word) => {
      const width = (currentLine + " " + word).length * 7; // Tạm tính chiều rộng bằng cách nhân số ký tự
      if (width <= maxLineWidth) {
        currentLine += " " + word;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    });

    lines.push(currentLine);
    return lines;
  };
  const CustomDot = (props) => {
    const { cx, cy, value } = props;

    if (value > 2500) {
      return <circle cx={cx} cy={cy} r={10} fill="red" stroke="none" />;
    }

    return <circle cx={cx} cy={cy} r={5} fill="#9e68df" stroke="none" />;
  };
  const renderCustomTick = (props) => {
    const { payload, x, y, textAnchor } = props;
    const lines = getMultiLineText(payload.value, MAX_LINE_WIDTH);

    return (
      <text x={x} y={y} textAnchor={textAnchor} fill="#666">
        {lines.map((line, index) => (
          <tspan
            fontFamily="Roboto"
            fontSize="12"
            fill="#9ca3af"
            x={x}
            dy={index === 0 ? 0 : 14}
            key={index}
          >
            {line}
          </tspan>
        ))}
      </text>
    );
  };
  const dataAreaChart = [
    {
      subject: "Làm việc chăm chỉ",
      A: 1,
      B: 2,
      fullMark: 5,
    },
    {
      subject: "Đồng phục gọn gàn, sạch sẽ",
      A: 1,
      B: 2,
      fullMark: 5,
    },
    {
      subject: "Dụng cụ chuẩn bị đầy đủ",
      A: 3,
      B: 4,
      fullMark: 5,
    },
    {
      subject: "Làm việc rất tốt, dọn dẹp sạch sẽ",
      A: 5,
      B: 5,
      fullMark: 5,
    },
    {
      subject: "Giờ giấc chuẩn, luôn đến trước giờ hẹn",
      A: 3,
      B: 4,
      fullMark: 5,
    },
  ];
  // 3. Hoạt động gần đây
  const timeWork = (data) => {
    const start = moment(new Date(data.date_work)).format("HH:mm");
    const timeEnd = moment(new Date(data?.date_work))
      .add(data?.total_estimate, "hours")
      .format("HH:mm");
    return start + " - " + timeEnd;
  };

  // ~~~ useEffect ~~~
  useEffect(() => {
    if (collaboratorId) {
      // Thẻ đánh giá tổng quan, thẻ số lượt đánh giá
      if (collaboratorRatingOverview || collaboratorRating) {
        let tempTotalDataReview = 0;
        getReviewCollaborator(collaboratorId, 0, 1)
          .then((res) => {
            tempTotalDataReview = res.totalItem;
          })
          .catch((err) => {});
        getReviewCollaborator(collaboratorId, 0, tempTotalDataReview)
          .then((res) => {
            getStar(totalRatingOverview, res);
            setTotalRating((prevTotalRating) =>
              prevTotalRating.map((item, index) => {
                if (index === 0) {
                  return { ...item, value: res?.totalItem };
                }
                if (index === 1) {
                  return {
                    ...item,
                    value:
                      res?.totalItem < 10 ? 10 : res?.totalItem < 20 ? 20 : 50,
                  };
                }
                return item;
              })
            );
            setDataReview(res);
          })
          .catch((err) => {});
      }
      // Thẻ bài kiểm tra
      if (collaboratorTest) {
        getListTrainingLessonByCollaboratorApi(collaboratorId, 0, 20, "all")
          .then((res) => {
            setDataLesson(res?.data);
          })
          .catch((err) => {});
      }
      // Thẻ hiệu quả công việc, thẻ hoạt động gần đây
      if (collaboratorJobs || collaboratorActivitys) {
        let tempTotalActivity = 0;
        dispatch(loadingAction.loadingRequest(true));
        getHistoryActivityCollaborator(collaboratorId, 0, 5)
          .then((res) => {
            tempTotalActivity = res.totalItem;
            setTotalJobs(res?.totalItem);
            setDataRecentActivities(res?.data);
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
        getHistoryActivityCollaborator(collaboratorId, 0, tempTotalActivity)
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
      if (collaboratorInformation || collaboratorDocument) {
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
        getCollaboratorsById(collaboratorId)
          .then((res) => {
            setDataDetail(res);
          })
          .catch((err) => {
            errorNotify({
              message: err?.message,
            });
          });
      }
    }
  }, [collaboratorId, dispatch]);

  return (
    <div className="card-statistics card-shadow">
      {/* Header */}
      {headerLabel && (
        <div className="card-statistics__header">
          <div className="card-statistics__header--right">
            <span>{headerLabel}</span>
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
      {/* Content */}
      <div>
        {/* Thẻ tổng quan đánh giá */}
        {collaboratorRatingOverview && (
          <div className="card-statistics__overview-rating">
            <div className="card-statistics__overview-rating--star">
              {renderStarFromNumber(collaboratorStar).map((el, index) => (
                <span>{el}</span>
              ))}
              <span className="card-statistics__overview-rating--star-avg">
                {collaboratorStar ? collaboratorStar?.toFixed(1) : 5}
              </span>
            </div>
            <div className="card-statistics__overview-rating--total">
              <span className="card-statistics__overview-rating--total-number">
                {dataReview.totalItem}
              </span>
              <span>khách hàng đã đánh giá</span>
            </div>
            <ResponsiveContainer width="100%" height={230}>
              <PieChart>
                <Pie
                  data={totalRatingOverview}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {totalRatingOverview.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="card-statistics__overview-rating--kind">
              <div className="card-statistics__overview-rating--kind-label">
                <div
                  style={{ backgroundColor: "#2fc22f" }}
                  className="card-statistics__overview-rating--kind-label-circle"
                ></div>
                <span>5 sao</span>
              </div>
              <div className="card-statistics__overview-rating--kind-label">
                <div
                  style={{ backgroundColor: "#3b82f6" }}
                  className="card-statistics__overview-rating--kind-label-circle"
                ></div>
                <span>4 sao</span>
              </div>
              <div className="card-statistics__overview-rating--kind-label">
                <div
                  style={{ backgroundColor: "#FFD700" }}
                  className="card-statistics__overview-rating--kind-label-circle"
                ></div>
                <span>3 sao</span>
              </div>
              <div className="card-statistics__overview-rating--kind-label">
                <div
                  style={{ backgroundColor: "#FFA500" }}
                  className="card-statistics__overview-rating--kind-label-circle"
                ></div>
                <span>2 sao</span>
              </div>
              <div className="card-statistics__overview-rating--kind-label">
                <div
                  style={{ backgroundColor: "#dc2626" }}
                  className="card-statistics__overview-rating--kind-label-circle"
                ></div>
                <span>1 sao</span>
              </div>
            </div>
          </div>
        )}
        {/* Thẻ tiêu chí đánh giá */}
        {collaboratorCriteria && (
          <div className="card-statistics__overview-criteria">
            <ResponsiveContainer height={250} width={"100%"}>
              <RadarChart outerRadius={80} data={dataAreaChart}>
                <PolarGrid opacity={1} stroke="#e5e7eb" />
                <PolarAngleAxis tick={renderCustomTick} dataKey="subject" />
                <PolarRadiusAxis angle={90} domain={[0, 5]} />
                <Radar
                  dot={<CustomDot />}
                  label={false}
                  legendType="square"
                  name="Mục đánh giá"
                  dataKey="B"
                  stroke="#9e68df"
                  strokeWidth={3}
                  fill="transparent"
                  fillOpacity={0.6}
                />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        )}
        {/* Thẻ khen thưởng, vi phạm */}
        {collaboratorBonusAndPunish && (
          <div className="card-statistics__overview-bonus-punish">
            {/* Số lần khen thưởng và phạt */}
            <div className="card-statistics__overview-bonus-punish--total">
              <div className="card-statistics__overview-bonus-punish--total-container">
                <IoMedalOutline
                  style={{ backgroundColor: "#dcfce7" }}
                  className="card-statistics__icon"
                  color="green"
                />
                <div className="card-statistics__overview-bonus-punish--total-container-number">
                  <span className="card-statistics__overview-bonus-punish--total-container-number-label">
                    Khen thưởng
                  </span>
                  <span className="card-statistics__overview-bonus-punish--total-container-number-number">
                    15{" "}
                    <span className="card-statistics__overview-bonus-punish--total-container-number-number-sub">
                      lần
                    </span>
                  </span>
                </div>
              </div>
              <div className="card-statistics__overview-bonus-punish--total-container">
                <IoThumbsDownOutline
                  style={{ backgroundColor: "#fee2e2" }}
                  className="card-statistics__icon"
                  color="red"
                />
                <div className="card-statistics__overview-bonus-punish--total-container-number">
                  <span className="card-statistics__overview-bonus-punish--total-container-number-label">
                    Kỷ luật
                  </span>
                  <span className="card-statistics__overview-bonus-punish--total-container-number-number">
                    4{" "}
                    <span className="card-statistics__overview-bonus-punish--total-container-number-number-sub">
                      lần
                    </span>
                  </span>
                </div>
              </div>
            </div>
            {/* Khen thưởng gần nhất */}
            <div className="card-statistics__overview-bonus-punish--recent card-statistics__overview-bonus-punish--recent-success">
              <div className="card-statistics__overview-bonus-punish--recent-icon">
                <IoReceiptOutline
                  style={{ backgroundColor: "#dcfce7" }}
                  className="card-statistics__icon"
                  color="green"
                />
                <div className="card-statistics__overview-bonus-punish--recent-icon-label">
                  <span>Quyết định khen thưởng</span>
                  <span className="card-statistics__overview-bonus-punish--recent-icon-label-time">
                    10 thg 02, 2023
                  </span>
                </div>
              </div>
              <div className="card-statistics__overview-bonus-punish--recent-status">
                <span>Chờ duyệt</span>
              </div>
            </div>
            {/* Vi phạm gần nhất */}
            <div className="card-statistics__overview-bonus-punish--recent card-statistics__overview-bonus-punish--recent-punish">
              <div className="card-statistics__overview-bonus-punish--recent-icon">
                <IoReceiptOutline
                  style={{ backgroundColor: "#fee2e2" }}
                  className="card-statistics__icon"
                  color="red"
                />
                <div className="card-statistics__overview-bonus-punish--recent-icon-label">
                  <span>Quyết định phạt</span>
                  <span className="card-statistics__overview-bonus-punish--recent-icon-label-time">
                    10 thg 02, 2023
                  </span>
                </div>
              </div>
              <div className="card-statistics__overview-bonus-punish--recent-status">
                <span>Đã duyệt</span>
              </div>
            </div>
          </div>
        )}
        {/* Thẻ thực hiện bài kiểm tra */}
        {collaboratorTest && (
          <div className="card-statistics__overview-examination">
            <div className="card-statistics__overview-examination--image">
              <span className="card-statistics__overview-examination--image-label">
                Các bài kiểm tra
              </span>
              <img
                className="card-statistics__overview-examination--image-image"
                src={testLogo}
              />
            </div>
            {dataLesson.map((lesson, index) => (
              <div
                className={`card-statistics__overview-examination--exam ${
                  index !== dataLesson.length - 1 && "not-last-exam"
                }`}
              >
                <div className="card-statistics__overview-examination--exam-content">
                  <span className="card-statistics__overview-examination--exam-content-header">
                    {lesson?.title?.vi}
                  </span>
                  <span className="card-statistics__overview-examination--exam-content-subheader">
                    {lesson?.description?.vi}
                  </span>
                </div>
                <div
                  className={`card-statistics__overview-examination--exam-status ${
                    !lesson?.is_pass && "not-pass"
                  }`}
                >
                  <span>
                    {lesson?.is_pass ? "Hoàn thành" : "Chưa hoàn thành"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
        {/* Thẻ tài chính */}
        {collaboratorFinance && (
          <div className="card-statistics__overview-finance">
            {/* Ảnh tài chính */}
            <div className="card-statistics__overview-finance--image">
              <div className="card-statistics__overview-finance--image-content">
                <span className="card-statistics__overview-finance--image-content-subtext">
                  Tổng tiền thu được
                </span>
                <span className="card-statistics__overview-finance--image-content-total">
                  100.000.000đ
                </span>
              </div>
              <img
                className="card-statistics__overview-finance--image-image"
                src={moneyLogo}
              ></img>
            </div>
            {/* Thu nhập */}
            <div className="card-statistics__overview-finance--content">
              <div className="card-statistics__overview-finance--content-child not-last">
                <div className="card-statistics__overview-finance--content-child-container">
                  <div>
                    <IoLogoUsd
                      style={{ backgroundColor: "#dcfce7" }}
                      className="card-statistics__icon"
                      color="green"
                    />
                  </div>
                  <div>
                    <span>Thu nhập/tháng</span>
                  </div>
                </div>
                <div className="card-statistics__overview-finance--content-child-money card-statistics__overview-finance--content-child-money-month">
                  <span>10.000.000đ</span>
                  <IoTrendingDown size="16px" color="red" />
                </div>
              </div>
              <div className="card-statistics__overview-finance--content-child not-last">
                <div className="card-statistics__overview-finance--content-child-container">
                  <div>
                    <IoCashOutline
                      style={{ backgroundColor: "#fef9c3" }}
                      className="card-statistics__icon"
                      color="orange"
                    />
                  </div>
                  <div>
                    <span>Thu nhập/năm</span>
                  </div>
                </div>
                <div className="card-statistics__overview-finance--content-child-money card-statistics__overview-finance--content-child-money-year">
                  <span>100.000.000đ</span>
                  <IoTrendingUp size="16px" color="green" />
                </div>
              </div>
              <div className="card-statistics__overview-finance--content-child">
                <div className="card-statistics__overview-finance--content-child-container">
                  <div>
                    <IoWalletOutline
                      style={{ backgroundColor: "#dbeafe" }}
                      className="card-statistics__icon"
                      color="blue"
                    />
                  </div>
                  <div>
                    <span>Tổng doanh thu</span>
                  </div>
                </div>
                <div className="card-statistics__overview-finance--content-child-money card-statistics__overview-finance--content-child-money-total">
                  <span>300.000.000đ</span>
                  <IoTrendingUp size="16px" color="green" />
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Thẻ hiệu quả công việc*/}
        {collaboratorJobs && (
          <div className="card-statistics__overview-jobs">
            <div className="card-statistics__overview-jobs--image">
              <div className="card-statistics__overview-jobs--image-content">
                <span className="card-statistics__overview-jobs-image-content-subtext">
                  Tổng số công việc
                </span>
                <div className="card-statistics__overview-jobs--image-content-total">
                  <span className="card-statistics__overview-jobs--image-content-total-number">
                    {totalJobsCancel + totalJobsSuccess + totalJobsOther}
                  </span>
                  <span className="card-statistics__overview-jobs--image-content-total-unit">
                    việc
                  </span>
                </div>
              </div>
              <img
                className="card-statistics__overview-jobs--image-image"
                src={jobLogo}
              ></img>
            </div>
            {/*Container hiệu quả công việc */}
            <div className="card-statistics__overview-jobs--content">
              <div className="card-statistics__overview-jobs--content-child">
                <div>
                  <IoCheckmarkCircleOutline
                    style={{ backgroundColor: "#dcfce7" }}
                    className="card-statistics__icon"
                    color="green"
                  />
                </div>
                <div className="card-statistics__overview-jobs--content-child-progress-bar">
                  <div className="card-statistics__overview-jobs--content-child-progress-bar-number">
                    <span className="card-statistics__overview-jobs--content-child-progress-bar-number-label">
                      Đơn đã hoàn thành
                    </span>
                    <span className="card-statistics__overview-jobs--content-child-progress-bar-number-total">
                      {totalJobsSuccess + totalJobsOther} đơn
                    </span>
                  </div>
                  <div className="card-statistics__overview-jobs--content-child-progress-bar-container">
                    <span
                      className={`${
                        calculateNumberPercent(
                          totalJobs,
                          totalJobsSuccess + totalJobsOther
                        ) > 60 && "more-than-overal"
                      }`}
                      // className="text-white"
                    >
                      {calculateNumberPercent(
                        totalJobs,
                        totalJobsSuccess + totalJobsOther
                      )}
                      %
                    </span>
                    <div
                      className="card-statistics__overview-jobs--content-child-progress-bar-contanier-bar 
                      card-statistics__overview-jobs--content-child-progress-bar-contanier-bar-success"
                      style={{
                        width: `${calculateNumberPercent(
                          totalJobs,
                          totalJobsSuccess + totalJobsOther
                        )}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
              <div className="card-statistics__overview-jobs--content-child">
                <div>
                  <IoCloseCircleOutline
                    style={{ backgroundColor: "#fee2e2" }}
                    className="card-statistics__icon"
                    color="red"
                  />
                </div>
                <div className="card-statistics__overview-jobs--content-child-progress-bar">
                  <div className="card-statistics__overview-jobs--content-child-progress-bar-number">
                    <span className="card-statistics__overview-jobs--content-child-progress-bar-number-label">
                      Đơn đã hủy
                    </span>
                    <span className="card-statistics__overview-jobs--content-child-progress-bar-number-total">
                      {totalJobsCancel} đơn
                    </span>
                  </div>
                  <div className="card-statistics__overview-jobs--content-child-progress-bar-container">
                    <span
                      className={`${
                        calculateNumberPercent(totalJobs, totalJobsCancel) >
                          60 && "more-than-overal"
                      }`}
                    >
                      {calculateNumberPercent(totalJobs, totalJobsCancel)}%
                    </span>
                    <div
                      className="card-statistics__overview-jobs--content-child-progress-bar-contanier-bar 
                      card-statistics__overview-jobs--content-child-progress-bar-contanier-bar-cancel"
                      style={{
                        width: `${calculateNumberPercent(
                          totalJobs,
                          totalJobsCancel
                        )}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Thẻ hoạt động gần đây */}
        {collaboratorActivitys ? (
          dataRecentActivities.length > 0 ? (
            <div className="card-statistics__overview-activities">
              {dataRecentActivities?.map((activity, index) => (
                <div className="card-statistics__overview-activities--activity">
                  {/* Ngày tháng năm */}
                  <div className="card-statistics__overview-activities--activity-left">
                    <div>
                      <span className="card-statistics__overview-activities--activity-left-date">
                        {moment(new Date(activity?.date_work)).format(
                          "DD/MM/YYYY"
                        )}
                      </span>
                    </div>
                    <div>
                      <span className="card-statistics__overview-activities--activity-left-day">
                        {moment(new Date(activity?.date_work))
                          .locale(lang)
                          .format("dddd")}
                      </span>
                    </div>
                  </div>
                  {/* Icon và line ở giữa */}
                  <div className="card-statistics__overview-activities--activity-line">
                    <div
                      className={`card-statistics__overview-activities--activity-line-icon ${
                        activity?.status === "pending"
                          ? "pending"
                          : activity?.status === "confirm"
                          ? "confirm"
                          : activity?.status === "doing"
                          ? "doing"
                          : activity?.status === "done"
                          ? "done"
                          : "cancel"
                      }`}
                    >
                      {activity?.status === "pending" ? (
                        <IoAlertOutline size={15} color="orange" />
                      ) : activity?.status === "confirm" ? (
                        <IoFlagOutline size={15} color="blue" />
                      ) : activity?.status === "doing" ? (
                        <IoHourglassOutline size={15} color="blue" />
                      ) : activity?.status === "done" ? (
                        <IoCheckmarkDoneOutline size={15} color="green" />
                      ) : (
                        <IoCloseCircleOutline size={15} color="red" />
                      )}
                    </div>
                    <div className="card-statistics__overview-activities--activity-line-icon-line"></div>
                  </div>
                  {/* Nội dung dịch vụ và địa chỉ */}
                  <div className="card-statistics__overview-activities--activity-right">
                    <div>
                      <span className="card-statistics__overview-activities--activity-right-time">
                        {activity?.type === "loop" && activity?.is_auto_order
                          ? `${i18n.t("repeat", { lng: lang })}`
                          : activity?.service?._id?.kind ===
                            "giup_viec_theo_gio"
                          ? `${i18n.t("cleaning", { lng: lang })}`
                          : activity?.service?._id?.kind === "giup_viec_co_dinh"
                          ? `${i18n.t("cleaning_subscription", {
                              lng: lang,
                            })}`
                          : activity?.service?._id?.kind === "phuc_vu_nha_hang"
                          ? `${i18n.t("serve", { lng: lang })}`
                          : ""}{" "}
                        / {timeWork(activity)}
                      </span>
                    </div>
                    <div>
                      <Tooltip placement="top" title={activity?.address}>
                        <span className="card-statistics__overview-activities--activity-right-address">
                          {activity?.address}
                        </span>
                      </Tooltip>
                    </div>
                    <div
                      className={`card-statistics__overview-activities--activity-right-status  ${
                        activity?.status === "pending"
                          ? "pending"
                          : activity?.status === "confirm"
                          ? "confirm"
                          : activity?.status === "doing"
                          ? "doing"
                          : activity?.status === "done"
                          ? "done"
                          : "cancel"
                      }`}
                    >
                      <span>
                        {activity?.status === "pending"
                          ? `${i18n.t("pending", { lng: lang })}`
                          : activity?.status === "confirm"
                          ? `${i18n.t("confirm", { lng: lang })}`
                          : activity?.status === "doing"
                          ? `${i18n.t("doing", { lng: lang })}`
                          : activity?.status === "done"
                          ? `${i18n.t("complete", { lng: lang })}`
                          : `${i18n.t("cancel", { lng: lang })}`}{" "}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex justify-center items-center p-4">
              <span className="text-xs text-gray-500/60 italic">
                Cộng tác viên chưa có hoạt động nào
              </span>
            </div>
          )
        ) : (
          ""
        )}
        {/* Thẻ thông tin cá nhân */}
        {collaboratorInformation && (
          <div className="card-statistics__overview-information">
            <div className="card-statistics__overview-information--avatar">
              <div className="card-statistics__overview-information--avatar-image">
                <Image
                  style={{
                    padding: "4px",
                    backgroundColor: "#FFFFFF",
                    borderRadius: "100%",
                  }}
                  width={"150px"}
                  height={"150px"}
                  src={dataDetail?.avatar ? dataDetail?.avatar : avatarDefault}
                  alt=""
                />
                <div className="card-statistics__overview-information--avatar-information">
                  <span className="card-statistics__overview-information--avatar-information-name">
                    {dataDetail?.full_name}
                  </span>
                  <div className="card-statistics__overview-information--avatar-information-other">
                    <span className="card-statistics__overview-information--avatar-information-other-subtext-label">
                      Tuổi:
                    </span>
                    <span className="card-statistics__overview-information--avatar-information-other-subtext">
                      {moment().diff(dataDetail?.birthday, "years")}
                    </span>
                  </div>
                  <div className="card-statistics__overview-information--avatar-information-other">
                    <span className="card-statistics__overview-information--avatar-information-other-subtext-label">
                      Mã giới thiệu:
                    </span>
                    <span className="card-statistics__overview-information--avatar-information-other-subtext">
                      {dataDetail?.invite_code}
                    </span>
                  </div>
                  <div className="card-statistics__overview-information--avatar-information-other">
                    <span className="card-statistics__overview-information--avatar-information-other-subtext-label">
                      Khu vực:
                    </span>
                    <span className="card-statistics__overview-information--avatar-information-other-subtext">
                      {city?.name}
                    </span>
                  </div>

                  <Tooltip
                    placement="bottom"
                    title={
                      dataDetail?.status === "locked"
                        ? dataDetail?.note_handle_admin
                          ? dataDetail?.note_handle_admin
                          : "Tài khoản đã bị khóa"
                        : ""
                    }
                  >
                    <span
                      className={`card-statistics__overview-information--avatar-information-status ${
                        dataDetail?.status === "actived"
                          ? "status-done"
                          : "status-not-contact"
                      }`}
                    >
                      {dataDetail?.status === "actived"
                        ? "Đang hoạt động"
                        : dataDetail?.status === "locked"
                        ? "Đang khóa"
                        : "Khác"}
                    </span>
                  </Tooltip>
                </div>
              </div>
            </div>
            <div className="card-statistics__overview-information--detail-info">
              <span className="card-statistics__overview-information--detail-info-label">
                Thông tin nhân sự
              </span>
              <IconTextCustom
                icon={
                  <IoCallOutline
                    className="card-statistics__icon green"
                    color="green"
                  />
                }
                label="Điện thoại"
                content={dataDetail?.phone}
              />
              <IconTextCustom
                icon={
                  <IoPersonOutline
                    className="card-statistics__icon blue"
                    color="blue"
                  />
                }
                label="Giới tính"
                content={dataDetail.gender === "male" ? "Nam" : "Nữ"}
              />
              <IconTextCustom
                icon={
                  <IoCalendarOutline
                    className="card-statistics__icon yellow"
                    color="orange"
                  />
                }
                label="Ngày sinh"
                content={moment(dataDetail?.birthday).format("DD/MM/YYYY")}
              />

              <IconTextCustom
                icon={
                  <IoNewspaperOutline
                    className="card-statistics__icon red"
                    color="red"
                  />
                }
                label="Tổng số đơn"
                content={total?.total_order}
                subcontent="đơn"
              />
              <IconTextCustom
                icon={
                  <IoTimeOutline
                    className="card-statistics__icon green"
                    color="green"
                  />
                }
                label="Tổng số giờ làm"
                content={total?.total_hour}
                subcontent="giờ"
              />

              <IconTextCustom
                icon={
                  <IoHeartOutline
                    className="card-statistics__icon blue"
                    color="blue"
                  />
                }
                label="Tổng lượt yêu thích"
                content={total?.total_favourite}
              />
              <IconTextCustom
                icon={
                  <IoShieldCheckmarkOutline
                    className="card-statistics__icon yellow"
                    color="orange"
                  />
                }
                label="Ngày kích hoạt"
                content={moment(dataDetail?.date_create).format("DD/MM/YYYY")}
              />
              <IconTextCustom
                icon={
                  <IoCalendarNumberOutline
                    className="card-statistics__icon red"
                    color="red"
                  />
                }
                label="Ngày đăng ký"
                content={moment(dataDetail?.date_create).format("DD/MM/YYYY")}
              />
            </div>
          </div>
        )}
        {/* Thẻ tiến hành hồ sơ*/}
        {collaboratorDocument && (
          <div className="card-statistics__overview-document">
            <div className="card-statistics__overview-document--child">
              <div className="card-statistics__overview-document--child-left">
                <div
                  className={`p-1 ${
                    dataDetail?.is_identity
                      ? "status-done"
                      : "status-not-process"
                  } rounded-full`}
                >
                  {dataDetail?.is_document_code ? (
                    <IoCheckmark color="green" />
                  ) : (
                    <IoCheckmark
                      style={{ visibility: "hidden" }}
                      color="gray"
                    />
                  )}
                </div>
                <span
                  className={`card-statistics__overview-document--child-left-label ${
                    !dataDetail?.is_document_code && "not-upload"
                  } `}
                >
                  Thỏa thuận hợp tác
                </span>
              </div>
            </div>
            <div className="card-statistics__overview-document--child">
              <div className="card-statistics__overview-document--child-left">
                <div
                  className={`p-1 ${
                    dataDetail?.is_identity
                      ? "status-done"
                      : "status-not-process"
                  } rounded-full`}
                >
                  {dataDetail?.is_identity ? (
                    <IoCheckmark color="green" />
                  ) : (
                    <IoCheckmark
                      style={{ visibility: "hidden" }}
                      color="gray"
                    />
                  )}
                </div>
                <span
                  className={`card-statistics__overview-document--child-left-label ${
                    !dataDetail?.is_identity && "not-upload"
                  } `}
                >
                  CCCD/CMND
                </span>
              </div>
            </div>
            <div className="card-statistics__overview-document--child">
              <div className="card-statistics__overview-document--child-left">
                <div
                  className={`p-1 ${
                    dataDetail?.is_personal_infor
                      ? "status-done"
                      : "status-not-process"
                  } rounded-full`}
                >
                  {dataDetail?.is_personal_infor ? (
                    <IoCheckmark color="green" />
                  ) : (
                    <IoCheckmark
                      style={{ visibility: "hidden" }}
                      color="gray"
                    />
                  )}
                </div>
                <span
                  className={`card-statistics__overview-document--child-left-label ${
                    !dataDetail?.is_personal_infor && "not-upload"
                  } `}
                >
                  Sơ yếu lí lịch
                </span>
              </div>
            </div>
            <div className="card-statistics__overview-document--child">
              <div className="card-statistics__overview-document--child-left">
                <div
                  className={`p-1 ${
                    dataDetail?.is_household_book
                      ? "status-done"
                      : "status-not-process"
                  } rounded-full`}
                >
                  {dataDetail?.is_household_book ? (
                    <IoCheckmark color="green" />
                  ) : (
                    <IoCheckmark
                      style={{ visibility: "hidden" }}
                      color="gray"
                    />
                  )}
                </div>
                <span
                  className={`card-statistics__overview-document--child-left-label ${
                    !dataDetail?.is_household_book && "not-upload"
                  } `}
                >
                  Sổ hộ khẩu{" "}
                </span>
              </div>
            </div>
            <div className="card-statistics__overview-document--child">
              <div className="card-statistics__overview-document--child-left">
                <div
                  className={`p-1 ${
                    dataDetail?.is_behaviour
                      ? "status-done"
                      : "status-not-process"
                  } rounded-full`}
                >
                  {dataDetail?.is_behaviour ? (
                    <IoCheckmark color="green" />
                  ) : (
                    <IoCheckmark
                      style={{ visibility: "hidden" }}
                      color="gray"
                    />
                  )}
                </div>
                <span
                  className={`card-statistics__overview-document--child-left-label ${
                    !dataDetail?.is_behaviour && "not-upload"
                  } `}
                >
                  Giấy xác nhận hạnh kiểm
                </span>
              </div>
            </div>
          </div>
        )}
        {/* Thẻ tổng lượt đánh giá */}
        {collaboratorRating && (
          <div className="card-statistics__rating-overview">
            {/* Điểm đánh giá */}
            <div className="card-statistics__rating-statistic">
              {/* Tựa đề hướng dẫn */}
              <span>

              </span>
              {/* Số điểm đánh giá */}
              <span>
                
                </span>
            </div>
            {/* Chart */}
            <div>
              <ResponsiveContainer height={296} width={"100%"}>
                <BarChart data={dataRatingTemp} barSize={40}>
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
                    dataKey="value"
                    fill="#fef08a"
                    // background={{ fill: "#eee" }}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            {/* Điểm đánh giá */}
            {/* <div className="card-statistics__rating-statistic--number">
              <span className="card-statistics__rating-statistic--number-subtext">
                Số sao trung bình
              </span>
              <span className="card-statistics__rating-statistic--number-average">
                4.9
              </span>
              <div className="card-statistics__rating-statistic--number-star">
                {renderStarFromNumber(collaboratorStar).map((el, index) => (
                  <span>{el}</span>
                ))}
              </div>
            </div> */}
            {/* Thống kê từng loại đánh giá */}
            {/* <div className="card-statistics__rating-statistic--progress-bar">
              <div className="card-statistics__rating-statistic--progress-bar-child">
                <span className="card-statistics__rating-statistic--progress-bar-child-label">
                  5 sao
                </span>
                <div className="card-statistics__rating-statistic--progress-bar-child-container">
                  <span
                    className={`${
                      calculateNumberPercent(
                        totalJobs,
                        totalJobsSuccess + totalJobsOther
                      ) > 60 && "more-than-overal"
                    }`}
                    // className="text-white"
                  >
                    {calculateNumberPercent(
                      totalJobs,
                      totalJobsSuccess + totalJobsOther
                    )}
                    %
                  </span>
                  <div className="card-statistics__rating-statistic--progress-bar-child-container-bar card-statistics__rating-statistic--progress-bar-child-container-bar-bonus"></div>
                </div>
              </div>
              <div className="card-statistics__rating-statistic--progress-bar-child">
                <span className="card-statistics__rating-statistic--progress-bar-child-label">
                  5 sao
                </span>
                <div className="card-statistics__rating-statistic--progress-bar-child-container">
                  <span
                    className={`${
                      calculateNumberPercent(
                        totalJobs,
                        totalJobsSuccess + totalJobsOther
                      ) > 60 && "more-than-overal"
                    }`}
                    // className="text-white"
                  >
                    {calculateNumberPercent(
                      totalJobs,
                      totalJobsSuccess + totalJobsOther
                    )}
                    %
                  </span>
                  <div className="card-statistics__rating-statistic--progress-bar-child-container-bar card-statistics__rating-statistic--progress-bar-child-container-bar-bonus"></div>
                </div>
              </div>
              <div className="card-statistics__rating-statistic--progress-bar-child">
                <span className="card-statistics__rating-statistic--progress-bar-child-label">
                  5 sao
                </span>
                <div className="card-statistics__rating-statistic--progress-bar-child-container">
                  <span
                    className={`${
                      calculateNumberPercent(
                        totalJobs,
                        totalJobsSuccess + totalJobsOther
                      ) > 60 && "more-than-overal"
                    }`}
                    // className="text-white"
                  >
                    {calculateNumberPercent(
                      totalJobs,
                      totalJobsSuccess + totalJobsOther
                    )}
                    %
                  </span>
                  <div className="card-statistics__rating-statistic--progress-bar-child-container-bar card-statistics__rating-statistic--progress-bar-child-container-bar-bonus"></div>
                </div>
              </div>
              <div className="card-statistics__rating-statistic--progress-bar-child">
                <span className="card-statistics__rating-statistic--progress-bar-child-label">
                  5 sao
                </span>
                <div className="card-statistics__rating-statistic--progress-bar-child-container">
                  <span
                    className={`${
                      calculateNumberPercent(
                        totalJobs,
                        totalJobsSuccess + totalJobsOther
                      ) > 60 && "more-than-overal"
                    }`}
                    // className="text-white"
                  >
                    {calculateNumberPercent(
                      totalJobs,
                      totalJobsSuccess + totalJobsOther
                    )}
                    %
                  </span>
                  <div className="card-statistics__rating-statistic--progress-bar-child-container-bar card-statistics__rating-statistic--progress-bar-child-container-bar-bonus"></div>
                </div>
              </div>
              <div className="card-statistics__rating-statistic--progress-bar-child">
                <span className="card-statistics__rating-statistic--progress-bar-child-label">
                  5 sao
                </span>
                <div className="card-statistics__rating-statistic--progress-bar-child-container">
                  <span
                    className={`${
                      calculateNumberPercent(
                        totalJobs,
                        totalJobsSuccess + totalJobsOther
                      ) > 60 && "more-than-overal"
                    }`}
                    // className="text-white"
                  >
                    {calculateNumberPercent(
                      totalJobs,
                      totalJobsSuccess + totalJobsOther
                    )}
                    %
                  </span>
                  <div className="card-statistics__rating-statistic--progress-bar-child-container-bar card-statistics__rating-statistic--progress-bar-child-container-bar-bonus"></div>
                </div>
              </div>
            </div> */}
          </div>
        )}
        {/* Thẻ thống kê lượt đánh giá theo từng tháng trong năm */}
        {collaboratorRatingStatistic && (
          <div className="card-statistics__rating-statistic">
            {/* Các thẻ thống kê tổng quát */}
            <div className="card-statistics__rating-statistic--card">
              {/* Đánh giá */}
              <div className="card-statistics__rating-statistic--card-child card-child-blue">
                <div className="card-statistics__rating-statistic--card-child-label ">
                  <span className="card-statistics__rating-statistic--card-child-label-heading">
                    Đánh giá
                  </span>
                  <span className="card-statistics__rating-statistic--card-child-label-number label-number-blue">
                    20
                  </span>
                </div>
                <div className="card-statistics__rating-statistic--card-child-circle-outside circle-outside-blue"></div>
                <div className="card-statistics__rating-statistic--card-child-circle circle-blue"></div>
                <div className="card-statistics__rating-statistic--card-child-line-bottom line-bottom-blue"></div>
              </div>
              {/* Khen thưởng */}
              <div className="card-statistics__rating-statistic--card-child card-child-green">
                <div className="card-statistics__rating-statistic--card-child-label">
                  <span className="card-statistics__rating-statistic--card-child-label-heading">
                    Khen thưởng
                  </span>
                  <span className="card-statistics__rating-statistic--card-child-label-number label-number-green">
                    0
                  </span>
                </div>
                <div className="card-statistics__rating-statistic--card-child-circle-outside circle-outside-green"></div>
                <div className="card-statistics__rating-statistic--card-child-circle circle-green"></div>
                <div className="card-statistics__rating-statistic--card-child-line-bottom line-bottom-green"></div>
              </div>
              {/* Vi phạm */}
              <div className="card-statistics__rating-statistic--card-child card-child-red">
                <div className="card-statistics__rating-statistic--card-child-label">
                  <span className="card-statistics__rating-statistic--card-child-label-heading">
                    Vi phạm
                  </span>
                  <span className="card-statistics__rating-statistic--card-child-label-number label-number-red">
                    10
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
                        stopColor="#93c5fd"
                        stopOpacity={0.8}
                      />
                      <stop offset="100%" stopColor="#93c5fd" stopOpacity={0} />
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
                    type="monotone"
                    dataKey="value"
                    stroke="#3b82f6"
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
