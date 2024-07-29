import React from 'react'
import { IoStar } from "react-icons/io5";
const CardStatistical = ({color, icon_color,totalStar, totalPercent}) => {
  return (
    <div className="w-1/5 rounded-xl bg-white card-shadow flex flex-col px-2 py-2.5">
      <div
        style={{ backgroundColor: `${color}` }}
        className={`flex px-2 py-3 items-center gap-2 h-1/3 rounded-lg`}
      >
        <IoStar
          size="1.2rem"
          color={icon_color} // green
          style={{ marginBottom: "2px" }}
        />
        <span className=" uppercase font-bold">Đánh giá 5 sao</span>
      </div>
      <div className="h-2/3 flex my-2">
        <span className="w-1/2 flex flex-col items-center justify-center border-r-2">
          <span>Số lượng</span>
          <span className="font-bold">{totalStar}</span>
        </span>
        <span className="w-1/2 flex flex-col items-center justify-center">
          <span>Chiếm</span>
          <span className="font-bold">{totalPercent}%</span>
        </span>
      </div>
    </div>
  );
}

export default CardStatistical