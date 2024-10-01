import React, { useEffect, useState } from "react";
import { renderStarFromNumber } from "../../../utils/contant";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import "./index.scss";

const COLORS = ["#2fc22f", "#3b82f6", "#FFD700", "#FFA500", "#dc2626"];

const CardBieChart = (props) => {
  const { data, dataDetail, totalStar } = props;
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
  return (
    <div className="card__bie-chart">
      <div className="card__bie-chart--star">
        {renderStarFromNumber(totalStar).map((el, index) => (
          <span>{el}</span>
        ))}
        <span className="card__bie-chart--star-avg">
          {totalStar ? totalStar?.toFixed(1) : 5}
        </span>
      </div>
      <div className="card__bie-chart--total">
        <span className="card__bie-chart--total-number">{data?.length}</span>
        <span>khách hàng đã đánh giá</span>
      </div>
      <ResponsiveContainer width="100%" height={230}>
        <PieChart>
          <Pie
            data={dataDetail}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {dataDetail.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="card__bie-chart--kind">
        <div className="card__bie-chart--kind-label">
          <div
            style={{ backgroundColor: "#2fc22f" }}
            className="card__bie-chart--kind-label-circle"
          ></div>
          <span>5 sao</span>
        </div>
        <div className="card__bie-chart--kind-label">
          <div
            style={{ backgroundColor: "#3b82f6" }}
            className="card__bie-chart--kind-label-circle"
          ></div>
          <span>4 sao</span>
        </div>
        <div className="card__bie-chart--kind-label">
          <div
            style={{ backgroundColor: "#FFD700" }}
            className="card__bie-chart--kind-label-circle"
          ></div>
          <span>3 sao</span>
        </div>
        <div className="card__bie-chart--kind-label">
          <div
            style={{ backgroundColor: "#FFA500" }}
            className="card__bie-chart--kind-label-circle"
          ></div>
          <span>2 sao</span>
        </div>
        <div className="card__bie-chart--kind-label">
          <div
            style={{ backgroundColor: "#dc2626" }}
            className="card__bie-chart--kind-label-circle"
          ></div>
          <span>1 sao</span>
        </div>
      </div>
    </div>
  );
};

export default CardBieChart;
