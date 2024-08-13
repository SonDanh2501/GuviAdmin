import React, { useEffect, useState } from "react";
// Support function
import {
  renderStarFromNumber,
  calculateNumberPercent,
  moveElement,
} from "../../utils/contant";
// API
import {
  getCollaboratorsById,
  getHistoryActivityCollaborator,
  getListTrainingLessonByCollaboratorApi,
  getOverviewCollaborator,
  getReviewCollaborator,
} from "../../api/collaborator";
// Image
import testLogo from "../../assets/images/testLogo.svg";
import moneyLogo from "../../assets/images/moneyLogo.svg";
import jobLogo from "../../assets/images/jobLogo.svg";
import avatarDefault from "../../assets/images/user.png";
// Other
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Sector,
} from "recharts";
import { Image, Tooltip } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { loadingAction } from "../../redux/actions/loading";
import { errorNotify } from "../../helper/toast";
import moment from "moment";
import { getLanguageState } from "../../redux/selectors/auth";
import i18n from "../../i18n";
import { getProvince } from "../../redux/selectors/service";
// Icon
import icons from "../../utils/icons";
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
} = icons;

const CardInfo = (props) => {
  const {
    headerLabel,
    supportIcon,
    supportText,
    collaboratorId,
    collaboratorStar,
    // Condition props
    collaboratorRatingOverview,
    collaboratorCriteria,
    collaboratorBonusAndPunish,
    collaboratorTest,
    collaboratorFinance,
    collaboratorJobs,
    collaboratorActivitys,
    collaboratorInformation,
    collaboratorDocument,
  } = props;
  const dispatch = useDispatch();
  const lang = useSelector(getLanguageState);
  // For tổng quan đánh giá
  const COLORS = ["#008000", "#2fc22f", "#FFD700", "#FFA500", "#FF0000"];
  const [dataReview, setDataReview] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [totalCountRating, setTotalCountRating] = useState(0);
  const [totalRating, setTotalRating] = useState([
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
  // For thông tin cá nhân
  const [dataDetail, setDataDetail] = useState([]);
  const province = useSelector(getProvince);
  const city = province.filter((x) => x.code === dataDetail.city)[0];
  const [total, setTotal] = useState({
    total_favourite: 0,
    total_order: 0,
    total_hour: 0,
    remainder: 0,
    gift_remainder: 0,
  });
  const [data, setData] = useState([]);
  // For bài kiểm tra
  const [dataLesson, setDataLesson] = useState([]);
  // For hoạt động gần đây
  const [dataRecentActivities, setDataRecentActivities] = useState([]);
  // For hiểu quả công việc
  const [totalJobs, setTotalJobs] = useState(0);
  const [totalJobsSuccess, setTotalJobsSuccess] = useState(0);
  const [totalJobsCancel, setTotalJobsCancel] = useState(0);
  const [totalJobsOther, setTotalJobsOther] = useState(0);

  // Support function cho thẻ tổng quan đánh giá
  const getStar = (totalRating, dataReview) => {
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

      totalRating?.forEach((element) => {
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
  const renderActiveShape = (props) => {
    const RADIAN = Math.PI / 180;
    const {
      cx,
      cy,
      midAngle,
      innerRadius,
      outerRadius,
      startAngle,
      endAngle,
      fill,
      payload,
      percent,
      value,
    } = props;

    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 30) * cos;
    const my = cy + (outerRadius + 30) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;
    const textAnchor = cos >= 0 ? "start" : "end";
    return (
      <g>
        <text x={cx} y={cy} dy={1} textAnchor="middle" fill={fill}>
          {totalCountRating === 0 ? 0 : payload.value} đánh giá
        </text>
        <text x={cx} y={cy + 20} dy={3} textAnchor="middle" fill={fill}>
          {`(${(totalCountRating === 0 ? 0 : percent * 100).toFixed(2)}%)`}
        </text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 6}
          outerRadius={outerRadius + 10}
          fill={fill}
        />
      </g>
    );
  };
  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };
  // Support function cho thẻ tiêu chí đánh giá
  const MAX_LINE_WIDTH = 120;
  // Hàm tính toán độ dài của văn bản và xuống dòng khi cần thiết
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
          <tspan x={x} dy={index === 0 ? 0 : 12} key={index}>
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
  // Support function cho thẻ hoạt động gần đây
  const capitalizeWords = (str) => {
    return str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };
  const timeWork = (data) => {
    const start = moment(new Date(data.date_work)).format("HH:mm");
    const timeEnd = moment(new Date(data?.date_work))
      .add(data?.total_estimate, "hours")
      .format("HH:mm");
    return start + " - " + timeEnd;
  };

  useEffect(() => {
    if (collaboratorRatingOverview) {
      let tempTotalDataReview = 0;
      getReviewCollaborator(collaboratorId, 0, 1)
        .then((res) => {
          tempTotalDataReview = res.totalItem;
        })
        .catch((err) => {});
      getReviewCollaborator(collaboratorId, 0, tempTotalDataReview)
        .then((res) => {
          getStar(totalRating, res);
          setDataReview(res);
        })
        .catch((err) => {});
    }
    if (collaboratorTest) {
      getListTrainingLessonByCollaboratorApi(collaboratorId, 0, 20, "all")
        .then((res) => {
          setDataLesson(res?.data);
        })
        .catch((err) => {});
    }
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
  }, [collaboratorId, dispatch]);

  const IconTextCustom = (props) => {
    const { icon, label, content, subcontent } = props;
    return (
      <div className="flex gap-3 items-center">
        {icon}
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-normal text-gray-500/60">{label}</span>
          <span style={{ fontWeight: "500" }} className="text-sm">
            {content} {subcontent}
          </span>
        </div>
      </div>
    );
  };
  return (
    <div style={{ borderRadius: "6px" }} className="bg-white card-shadow">
      {/* Header */}
      {headerLabel && (
        <div className="flex items-center justify-between gap-2 border-b-2 border-gray-200 p-3">
          <div className="flex items-center gap-1">
            <span className="font-medium text-sm">{headerLabel}</span>
            {supportIcon && (
              <Tooltip
                placement="top"
                title={supportText ? supportText : "Tính năng chưa hoàn thiện"}
              >
                <IoHelpCircleOutline size={16} color="#9ca3af" />
              </Tooltip>
            )}
          </div>
        </div>
      )}
      {/* Content */}
      {/* Thẻ tổng quan đánh giá */}
      {collaboratorRatingOverview && (
        <div className="flex flex-col justify-center p-3.5">
          <div className="flex flex-col items-center justify-center pb-2">
            <div className="flex py-2.5 px-4 rounded-full w-fit items-center justify-center bg-indigo-50 gap-1">
              {renderStarFromNumber(collaboratorStar).map((el, index) => (
                <span>{el}</span>
              ))}
              <span className="text-base font-medium pt-1 ml-2">
                {collaboratorStar ? collaboratorStar?.toFixed(1) : 5}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <span className="italic font-medium">{dataReview.totalItem}</span>
              <span className="italic font-normal text-gray-700/80">
                khách hàng đã đánh giá
              </span>
            </div>
          </div>
          {/* const COLORS = ["#008000", "#2fc22f", "#FFD700", "#FFA500", "#FF0000"]; */}
          <div className="flex flex-col items-center justify-center gap-2">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  activeIndex={activeIndex}
                  activeShape={renderActiveShape}
                  data={totalRating}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={90}
                  outerRadius={120}
                  paddingAngle={7}
                  fill="#8884d8"
                  // label={renderCustomizedLabel}
                  // labelLine={false}
                  onMouseEnter={onPieEnter}
                >
                  {totalRating.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center justify-center gap-3">
                <div className="flex gap-1 items-center">
                  <div className="w-4 h-4 rounded-full bg-[#008000]"></div>
                  <span className="text-sm">5 sao</span>
                </div>
                <div className="flex gap-1 items-center">
                  <div className="w-4 h-4 rounded-full bg-[#2fc22f]"></div>
                  <span className="text-sm">4 sao</span>
                </div>
                <div className="flex gap-1 items-center">
                  <div className="w-4 h-4 rounded-full bg-[#FFD700]"></div>
                  <span className="text-sm">3 sao</span>
                </div>
                <div className="flex gap-1 items-center">
                  <div className="w-4 h-4 rounded-full bg-[#FFA500]"></div>
                  <span className="text-sm">2 sao</span>
                </div>
                <div className="flex gap-1 items-center">
                  <div className="w-4 h-4 rounded-full bg-[#FF0000]"></div>
                  <span className="text-sm">1 sao</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Thẻ tiêu chí đánh giá */}
      {collaboratorCriteria && (
        <div className="flex flex-col items-center justify-center p-3.5">
          <ResponsiveContainer
            height={300}
            width={"100%"}
            // min-width={350}
            // className={"bg-black"}
          >
            <RadarChart outerRadius={110} data={dataAreaChart}>
              <PolarGrid opacity={0.8} stroke="#e5e7eb" />
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
        <div className="flex flex-col p-3.5 gap-4">
          <div className="flex gap-4">
            <div className="w-1/2 flex items-center p-2.5 border-[2px] border-gray-300 rounded-xl gap-2">
              <IoMedalOutline
                className="bg-green-100 p-2.5 w-11 h-11 rounded-xl"
                color="green"
              />
              <div className="flex flex-col">
                <span className="text-sm font-normal text-gray-500/60">
                  Khen thưởng
                </span>
                <span className="font-medium text-lg">
                  15 <span className="uppercase text-xs font-normal">lần</span>
                </span>
              </div>
            </div>
            <div className="w-1/2 flex items-center p-2.5 border-[2px] border-gray-300  rounded-xl gap-2">
              <IoThumbsDownOutline
                className="bg-red-100 p-2.5 w-11 h-11 rounded-xl"
                color="red"
              />
              <div className="flex flex-col">
                <span className="text-sm font-normal text-gray-500/60">
                  Kỷ luật
                </span>
                <span className="font-medium text-lg">
                  4 <span className="uppercase text-xs font-normal">lần</span>
                </span>
              </div>
            </div>
          </div>
          <div className="flex justify-between items-center p-3 rounded-xl gap-3 border-[2px] border-green-500">
            <div className="flex gap-3">
              <IoReceiptOutline
                className="bg-green-100 p-2.5 w-11 h-11 rounded-xl"
                color="green"
              />
              <div className="flex flex-col gap-0.5">
                <span className="font-medium text-sm">
                  Quyết định khen thưởng
                </span>
                <span className="text-sm font-normal text-gray-500/60">
                  10 thg 02, 2023
                </span>
              </div>
            </div>
            <div>
              <span className="py-1 px-2 bg-yellow-500 rounded-full text-white">
                Chờ duyệt
              </span>
            </div>
          </div>
          <div className="flex justify-between items-center p-3 rounded-xl gap-3 border-[2px] border-red-500">
            <div className="flex gap-3">
              <IoReceiptOutline
                className="bg-red-100 p-2.5 w-11 h-11 rounded-xl"
                color="red"
              />
              <div className="flex flex-col gap-0.5">
                <span className="font-medium text-sm">Quyết định phạt</span>
                <span className="text-sm font-normal text-gray-500/60">
                  10 thg 02, 2023
                </span>
              </div>
            </div>
            <div>
              <span className="py-1 px-2 bg-green-500 rounded-full text-white">
                Đã duyệt
              </span>
            </div>
          </div>
        </div>
      )}
      {/* Thẻ thực hiện bài kiểm tra */}
      {collaboratorTest && (
        <div className="p-3.5">
          <div className="w-full h-24 bg-violet-100 rounded-xl flex justify-between items-center">
            <span className="px-4 text-lg font-medium">Các bài kiểm tra</span>
            <img className=" h-full" src={testLogo}></img>
          </div>
          {dataLesson.map((lesson, index) => (
            <div
              className={`flex justify-between items-center py-4 ${
                index !== dataLesson.length - 1 &&
                "border-b-[1px] border-gray-300/70"
              }`}
            >
              <div className="flex flex-col gap-1">
                <span className="text-sm font-medium">{lesson?.title?.vi}</span>
                <span className="text-sm font-normal text-gray-500/60">
                  {lesson?.description?.vi}
                </span>
              </div>
              {lesson?.is_pass ? (
                <div className="bg-green-50 py-1 px-3 text-center border-[1px] border-green-500 rounded-full">
                  <span className="text-green-500">Hoàn thành</span>
                </div>
              ) : (
                <div className="bg-gray-50 py-1 px-3 text-center border-[1px] border-gray-500 rounded-full">
                  <span className="text-gray-500/60">Chưa hoàn thành</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      {/* Thẻ tài chính */}
      {collaboratorFinance && (
        <div className="p-3.5">
          <div className="w-full h-24 bg-amber-100 rounded-xl flex justify-between items-center">
            <div className="flex flex-col">
              <span className="px-4 text-base font-medium text-gray-500/60">
                Tổng tiền thu được
              </span>
              <span className="px-4 text-2xl font-medium">100.000.000đ</span>
            </div>
            <img className=" h-full" src={moneyLogo}></img>
          </div>
          <div className="flex flex-col justify-center gap-4 mt-4">
            <div className="flex justify-between items-center border-b-[1px] border-gray-300/70 pb-3">
              <div className="flex items-center gap-2">
                <div>
                  <IoLogoUsd
                    className="bg-green-100 p-2.5 w-11 h-11 rounded-xl"
                    color="green"
                  />
                </div>
                <div>
                  <span className="text-sm font-normal text-gray-500/60">
                    Thu nhập/tháng
                  </span>
                </div>
              </div>
              <div>
                <span className="text-sm font-medium bg-green-100 p-2 rounded-md">
                  10.000.000đ
                </span>
              </div>
            </div>
            <div className="flex justify-between items-center border-b-[1px] border-gray-300/70 pb-3">
              <div className="flex items-center gap-2">
                <div>
                  <IoCashOutline
                    className="bg-yellow-100 p-2.5 w-11 h-11 rounded-xl"
                    color="orange"
                  />
                </div>
                <div>
                  <span className="text-sm font-normal text-gray-500/60">
                    Thu nhập/năm
                  </span>
                </div>
              </div>
              <div>
                <span className="text-sm font-medium bg-yellow-100 p-2 rounded-md">
                  100.000.000đ
                </span>
              </div>
            </div>
            <div className="flex justify-between items-center border-gray-300/70 pb-3">
              <div className="flex items-center gap-2">
                <div>
                  <IoWalletOutline
                    className="bg-blue-100 p-2.5 w-11 h-11 rounded-xl"
                    color="blue"
                  />
                </div>
                <div>
                  <span className="text-sm font-normal text-gray-500/60">
                    Tổng doanh thu
                  </span>
                </div>
              </div>
              <div>
                <span className="text-sm font-medium bg-blue-100 p-2 rounded-md">
                  300.000.000đ
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Thẻ hiệu quả công việc  */}
      {collaboratorJobs && (
        <div className="p-3.5">
          <div className="w-full h-24 bg-blue-100 rounded-xl flex justify-between items-center">
            <div className="flex flex-col">
              <span className="px-4 text-base font-medium text-gray-500/60">
                Tổng số công việc
              </span>
              <div className="flex px-4 gap-1 items-center">
                <span className="text-2xl font-medium">
                  {totalJobsCancel + totalJobsSuccess + totalJobsOther}
                </span>
                <span className="text-sm font-medium uppercase">việc</span>
              </div>
            </div>
            <img className="h-full" src={jobLogo}></img>
          </div>
          {/*Container hiệu quả công việc */}
          <div className="flex flex-col justify-center gap-4 mt-4">
            <div className="flex items-center gap-4 border-b-[1px] border-gray-300/70 pb-3">
              <div>
                <IoCheckmarkCircleOutline
                  className="bg-green-100 p-2.5 w-11 h-11 rounded-xl"
                  color="green"
                />
              </div>
              <div className="w-full">
                <div className="flex justify-between items-center mb-0.5">
                  <span className="text-sm font-normal text-gray-500/60">
                    Đơn đã hoàn thành
                  </span>
                  <span className="text-sm font-medium">
                    {totalJobsSuccess + totalJobsOther} đơn
                  </span>
                </div>
                <div className="w-full relative rounded-full bg-gray-100 text-center">
                  {/* <span className="text-black italic text-xs">
                  {calculateNumberPercent(
                    totalJobs,
                    totalJobsSuccess + totalJobsOther
                  )}
                  %
                </span> */}
                  <span className="text-black italic text-xs absolute mt-0.5">
                    {calculateNumberPercent(
                      totalJobs,
                      totalJobsSuccess + totalJobsOther
                    )}
                    %
                  </span>
                  <div
                    className="bg-green-500 h-5 rounded-full flex justify-center items-center leading-none text-xs font-normal progress-bar-success"
                    style={{
                      width: `${calculateNumberPercent(
                        totalJobs,
                        totalJobsSuccess + totalJobsOther
                      )}%`,
                    }}
                    // style={{ width: "60%" }}
                  ></div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4 pb-3">
              <div>
                <IoCloseCircleOutline
                  className="bg-red-100 p-2.5 w-11 h-11 rounded-xl"
                  color="red"
                />
              </div>
              <div className="w-full">
                <div className="flex justify-between items-center mb-0.5">
                  <span className="text-sm font-normal text-gray-500/60">
                    Đơn đã hủy
                  </span>
                  <span className="text-sm font-medium">
                    {totalJobsCancel} đơn
                  </span>
                </div>
                <div className="w-full relative rounded-full bg-gray-100 text-center">
                  <span className="text-black italic text-xs absolute mt-0.5">
                    {calculateNumberPercent(totalJobs, totalJobsCancel)}%
                  </span>
                  <div
                    className="bg-red-500 h-5 rounded-full flex justify-center items-center leading-none text-xs font-normal progress-bar-cancel"
                    style={{
                      width: `${calculateNumberPercent(
                        totalJobs,
                        totalJobsCancel
                      )}%`,
                    }}
                  ></div>
                </div>
                {/* <div class="w3-light-grey">
                <div
                  class="w3-container w3-green w3-center"
                  style={{ width: "25%" }}
                >
                  25%
                </div>
              </div> */}
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Thẻ hoạt động gần đây */}
      {collaboratorActivitys ? (
        dataRecentActivities.length > 0 ? (
          <div className="flex flex-col py-2.5 px-3 mt-3 mb-2">
            {dataRecentActivities?.map((activity, index) => (
              <div className="flex pb-4">
                {/* Ngày tháng năm */}
                <div className="w-3/12 flex flex-col items-center ">
                  <div>
                    <span className="text-sm font-medium">
                      {moment(new Date(activity?.date_work)).format(
                        "DD/MM/YYYY"
                      )}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm font-normal text-gray-500/60">
                      {capitalizeWords(
                        moment(new Date(activity?.date_work))
                          .locale(lang)
                          .format("dddd")
                      )}
                    </span>
                  </div>
                </div>
                {/* Icon và line ở giữa */}
                <div className="w-2/12 items-center flex flex-col -mb-[24px]">
                  <div
                    className={`p-2 w-fit h-fit rounded-full ${
                      activity?.status === "pending"
                        ? "bg-yellow-100"
                        : activity?.status === "confirm"
                        ? "bg-blue-100"
                        : activity?.status === "doing"
                        ? "bg-blue-100"
                        : activity?.status === "done"
                        ? "bg-green-100"
                        : "bg-red-100"
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
                  <div className="w-[2px] h-[100%] bg-gray-300/50"></div>
                </div>
                {/* Nội dung dịch vụ và địa chỉ */}
                <div className="w-7/12">
                  <div>
                    <span className="font-medium text-sm">
                      {activity?.type === "loop" && activity?.is_auto_order
                        ? `${i18n.t("repeat", { lng: lang })}`
                        : activity?.service?._id?.kind === "giup_viec_theo_gio"
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
                      <span className="text-sm font-normal text-gray-500/60 line-clamp-2">
                        {activity?.address}
                      </span>
                    </Tooltip>
                  </div>
                  <div
                    className={`w-fit px-1 py-0.5 rounded-lg border-[1px] mt-2 ${
                      activity?.status === "pending"
                        ? "bg-yellow-50 border-yellow-500 text-yellow-500"
                        : activity?.status === "confirm"
                        ? "bg-blue-50 border-blue-500 text-blue-500"
                        : activity?.status === "doing"
                        ? "bg-blue-50 border-blue-500 text-blue-500"
                        : activity?.status === "done"
                        ? "bg-green-50 border-green-500 text-green-500"
                        : "bg-red-50 border-red-500 text-red-500"
                    }`}
                  >
                    <span className="text-sm ">
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
            <span className="text-sm text-gray-500/60 italic">
              Cộng tác viên chưa có hoạt động nào
            </span>
          </div>
        )
      ) : (
        ""
      )}
      {/* Thẻ thông tin cá nhân */}
      {collaboratorInformation && (
        <>
          <div
            style={{ backgroundColor: "#ebe0f8" }}
            className="rounded-xl m-3 p-4 flex justify-center"
          >
            <div className="flex flex-col items-center justify-center">
              <Image
                style={{
                  padding: "4px",
                  backgroundColor: "#FFFFFF",
                  borderRadius: "100%",
                }}
                width={"150px"}
                height={"150px"}
                // class="h-[150px] w-[150px] p-2 bg-white rounded-full shadow-lg"
                src={dataDetail?.avatar ? dataDetail?.avatar : avatarDefault}
                alt=""
              />
              <div className="flex flex-col items-center mt-3 gap-2.5">
                <span className="font-medium text-xl text-center">
                  {dataDetail?.name}
                </span>
                <div className="flex items-center gap-1">
                  <span className="font-normal text-sm text-gray-500/60">
                    Số điện thoại:
                  </span>
                  <span className="font-medium text-sm">{dataDetail?.phone}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="font-normal text-sm text-gray-500/60">
                    Mã giới thiệu:
                  </span>
                  <span className="font-medium text-sm">
                    {dataDetail?.invite_code}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="font-normal text-sm text-gray-500/60">
                    Khu vực:
                  </span>
                  <span className="font-medium text-sm">{city?.name}</span>
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
                    className={`py-2 px-4 rounded-full ${
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
          <div className="flex flex-col gap-6 mx-3 my-4">
            <span className="font-medium text-sm">Thông tin nhân sự</span>
            <div className="flex gap-3 items-center">
              <IconTextCustom
                icon={
                  <IoPersonOutline
                    className="bg-blue-100 p-2.5 w-11 h-11 rounded-xl"
                    color="DodgerBlue"
                  />
                }
                label="Giới tính"
                content={dataDetail.gender === "male" ? "Nam" : "Nữ"}
              ></IconTextCustom>
            </div>
            <div className="flex gap-3 items-center">
              <IconTextCustom
                icon={
                  <IoShieldCheckmarkOutline
                    className="bg-green-100 p-2.5 w-11 h-11 rounded-xl"
                    color="green"
                  />
                }
                label="Ngày kích hoạt"
                content={moment(dataDetail?.date_create).format("DD/MM/YYYY")}
              ></IconTextCustom>
            </div>
            <div className="flex gap-3 items-center">
              <IconTextCustom
                icon={
                  <IoCalendarOutline
                    className="bg-yellow-100 p-2.5 w-11 h-11 rounded-xl"
                    color="orange"
                  />
                }
                label="Ngày sinh"
                content={moment(dataDetail?.birthday).format("DD/MM/YYYY")}
              ></IconTextCustom>
            </div>
            {/* <div className="flex gap-3 items-center">
              <IconTextCustom
                icon={
                  <IoCallOutline
                    className="bg-red-100 p-2.5 w-11 h-11 rounded-xl"
                    color="red"
                  />
                }
                label="Điện thoại"
                content={dataDetail?.phone}
              ></IconTextCustom>
            </div> */}
            <div className="flex gap-3 items-center">
              <IconTextCustom
                icon={
                  <IoNewspaperOutline
                    className="bg-red-100 p-2.5 w-11 h-11 rounded-xl"
                    color="red"
                  />
                }
                label="Tổng số đơn"
                content={total?.total_order}
                subcontent="đơn"
              ></IconTextCustom>
            </div>
            <div className="flex gap-3 items-center">
              <IconTextCustom
                icon={
                  <IoTimeOutline
                    className="bg-blue-100 p-2.5 w-11 h-11 rounded-xl"
                    color="DodgerBlue"
                  />
                }
                label="Tổng số giờ làm"
                content={total?.total_hour}
                subcontent="giờ"
              ></IconTextCustom>
            </div>
            <div className="flex gap-3 items-center">
              <IconTextCustom
                icon={
                  <IoCalendarNumberOutline
                    className="bg-green-100 p-2.5 w-11 h-11 rounded-xl"
                    color="green"
                  />
                }
                label="Ngày đăng ký"
                content={moment(dataDetail?.date_create).format("DD/MM/YYYY")}
              ></IconTextCustom>
            </div>
            <div className="flex gap-3 items-center">
              <IconTextCustom
                icon={
                  <IoHeartOutline
                    className="bg-red-100 p-2.5 w-11 h-11 rounded-xl"
                    color="red"
                  />
                }
                label="Tổng lượt yêu thích"
                content={total?.total_favourite}
              ></IconTextCustom>
            </div>
          </div>
        </>
      )}
      {/* Thẻ tiến hành hồ sơ  */}
      {collaboratorDocument && (
        <div className="flex flex-col pt-2.5 pb-4 px-3 gap-6 mt-3">
          <div className="flex justify-between">
            <div className="flex gap-4 items-center">
              <div
                className={`p-1 ${
                  dataDetail?.is_identity ? "status-done" : "status-not-process"
                } rounded-full`}
              >
                {dataDetail?.is_document_code ? (
                  <IoCheckmark color="green" />
                ) : (
                  <IoCheckmark style={{ visibility: "hidden" }} color="gray" />
                )}
              </div>
              <span
                className={`text-sm font-normal ${
                  !dataDetail?.is_document_code && "text-gray-500/60"
                } `}
              >
                Thỏa thuận hợp tác
              </span>
            </div>
            <div>
              <span className="text-gray-500/60 italic text-sm">
                {dataDetail?.document_code ? dataDetail?.document_code : ""}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div
              className={`p-1 ${
                dataDetail?.is_identity ? "status-done" : "status-not-process"
              } rounded-full`}
            >
              {dataDetail?.is_identity ? (
                <IoCheckmark color="green" />
              ) : (
                <IoCheckmark style={{ visibility: "hidden" }} color="gray" />
              )}
            </div>
            <span
              className={`text-sm font-normal ${
                !dataDetail?.is_identity && "text-gray-500/60"
              } `}
            >
              {" "}
              CCCD/CMND
            </span>
          </div>
          <div className="flex items-center gap-4">
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
                <IoCheckmark style={{ visibility: "hidden" }} color="gray" />
              )}
            </div>
            <span
              className={`text-sm font-normal ${
                !dataDetail?.is_personal_infor && "text-gray-500/60"
              } `}
            >
              {" "}
              Sơ yếu lí lịch
            </span>
          </div>
          <div className="flex items-center gap-4">
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
                <IoCheckmark style={{ visibility: "hidden" }} color="gray" />
              )}
            </div>
            <span
              className={`text-sm font-normal ${
                !dataDetail?.is_household_book && "text-gray-500/60"
              } `}
            >
              Sổ hộ khẩu
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div
              className={`p-1 ${
                dataDetail?.is_behaviour ? "status-done" : "status-not-process"
              } rounded-full`}
            >
              {dataDetail?.is_behaviour ? (
                <IoCheckmark color="green" />
              ) : (
                <IoCheckmark style={{ visibility: "hidden" }} color="gray" />
              )}
            </div>
            <span
              className={`text-sm font-normal ${
                !dataDetail?.is_behaviour && "text-gray-500/60 "
              } `}
            >
              Giấy xác nhận hạnh kiểm
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default CardInfo;
