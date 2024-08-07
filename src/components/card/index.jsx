import React, { useEffect, useState } from 'react'
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
import { renderStarFromNumber } from '../../utils/contant';
// API
import { getReviewCollaborator } from '../../api/collaborator';
import { IoHelpCircleOutline, IoMedalOutline, IoReceiptOutline, IoThumbsDownOutline } from 'react-icons/io5';
import { Tooltip } from 'antd';


const CardInfo = (props) => {
  const {
    headerLabel,
    supportIcon,
    supportText,
    collaboratorRatingOverview,
    collaboratorStar,
    collaboratorId,
    collaboratorCriteria,
    collaboratorBonusAndPunish,
    collaboratorTest
  } = props;
  const COLORS = ["#008000", "#2fc22f", "#FFD700", "#FFA500", "#FF0000"];
  // For overview rating card
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
        <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
          {totalCountRating === 0 ? 0 : payload.value} đánh giá
        </text>
        <text x={cx} y={cy + 20} dy={8} textAnchor="middle" fill={fill}>
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
      fullMark: 10,
    },
    {
      subject: "Đồng phục gọn gàn, sạch sẽ",
      A: 1,
      B: 2,
      fullMark: 10,
    },
    {
      subject: "Dụng cụ chuẩn bị đầy đủ",
      A: 3,
      B: 4,
      fullMark: 10,
    },
    {
      subject: "Làm việc rất tốt, dọn dẹp sạch sẽ",
      A: 5,
      B: 6,
      fullMark: 10,
    },
    {
      subject: "Giờ giấc chuẩn, luôn đến trước giờ hẹn",
      A: 3,
      B: 4,
      fullMark: 10,
    },
  ];
  useEffect(() => {
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
  }, [collaboratorId]);
  return (
    <div className="bg-white rounded-lg card-shadow">
      {/* Header */}
      {headerLabel && (
        <div className="flex items-center justify-between gap-2 border-b-2 border-gray-200 py-2.5 px-3">
          <div className="flex items-center gap-1">
            <span className="font-bold text-sm">{headerLabel}</span>
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
              <span className="italic font-normal">khách hàng đã đánh giá</span>
            </div>
          </div>
          {/* const COLORS = ["#008000", "#2fc22f", "#FFD700", "#FFA500", "#FF0000"]; */}
          <div className="flex flex-col items-center justify-center gap-2">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  activeIndex={activeIndex}
                  activeShape={renderActiveShape}
                  data={totalRating}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={110}
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
                  <div className="w-3 h-3 rounded-full bg-[#008000]"></div>
                  <span className="text-sm">5 sao</span>
                </div>
                <div className="flex gap-1 items-center">
                  <div className="w-3 h-3 rounded-full bg-[#2fc22f]"></div>
                  <span className="text-sm">4 sao</span>
                </div>
                <div className="flex gap-1 items-center">
                  <div className="w-3 h-3 rounded-full bg-[#FFD700]"></div>
                  <span className="text-sm">3 sao</span>
                </div>
                <div className="flex gap-1 items-center">
                  <div className="w-3 h-3 rounded-full bg-[#FFA500]"></div>
                  <span className="text-sm">2 sao</span>
                </div>
                <div className="flex gap-1 items-center">
                  <div className="w-3 h-3 rounded-full bg-[#FF0000]"></div>
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
              <PolarRadiusAxis angle={45} domain={[0, 10]} />
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
                <span className="text-sm font-normal text-gray-500/70">
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
                <span className="text-sm font-normal text-gray-500/70">
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
                <span className="text-sm font-normal text-gray-500/70">
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
                <span className="text-sm font-normal text-gray-500/70">
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
               <span className="px-4 text-lg font-medium">
                 Các bài kiểm tra
               </span>
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
                   <span className="text-sm font-medium">
                     {lesson?.title?.vi}
                   </span>
                   <span className="text-sm font-normal text-gray-500/70">
                     {lesson?.description?.vi}
                   </span>
                 </div>
                 {lesson?.is_pass ? (
                   <div className="bg-green-50 py-1 px-3 text-center border-[1px] border-green-500 rounded-full">
                     <span className="text-green-500">Hoàn thành</span>
                   </div>
                 ) : (
                   <div className="bg-gray-50 py-1 px-3 text-center border-[1px] border-gray-500 rounded-full">
                     <span className="text-gray-500/70">Chưa hoàn thành</span>
                   </div>
                 )}
               </div>
             ))}
           </div>
      )}
    </div>
  );
}

export default CardInfo