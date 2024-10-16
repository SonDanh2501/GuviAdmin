import React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  Tooltip,
  YAxis,
} from "recharts";
import "./index.scss";
const CardBarChart = (props) => {
  const {
    height, // Chiều cao của biểu đồ (number or percent)
    width, // Chiều rộng của biểu đồ (number or percent)
    size, // Chiều rộng của từng cột giá trị (number)
    data, // Dữ liệu
    total, // Tổng số lượng (number)
    verticalLine, // Bật/tắt cột Oy (true/false)
    verticalValue, // Giá trị cột Oy (string)
    horizontalLine, // Bật/tắt cột Ox (true/false)
    horizontalValue, // Giá trị cột Ox (string)
    chartUnit, // Đơn vị của biểu đồ (string)
    color, // Màu của biểu đồ (string)
    colorTotal, // Màu của giá trị tổng (string)
  } = props;
  return (
    <div className="card__bar-chart">
      <div className="card__bar-chart--header">
        {chartUnit && (
          <span className="card__bar-chart--header-label">
            Số lượng {chartUnit} theo từng tháng
          </span>
        )}
        {chartUnit && total && (
          <div className="card__bar-chart--header-average">
            <span className="card__bar-chart--header-average-label">
              Tổng {chartUnit}:
            </span>
            <span
              style={{ color: colorTotal, backgroundColor: color }}
              className="card__bar-chart--header-average-number"
            >
              {total}
            </span>
          </div>
        )}
      </div>
      <div className="card__bar-chart--body">
        <ResponsiveContainer height={height} width={width || "99%"}>
          <BarChart data={data} barSize={size || 30}>
            {horizontalLine && (
              <XAxis
                dataKey={horizontalValue}
                axisLine={false}
                tickLine={false}
                tick={{
                  fontSize: 12,
                  fontFamily: "Roboto",
                  fill: "#475569",
                }}
              />
            )}
            {verticalLine && (
              <YAxis
                dataKey={verticalValue}
                axisLine={false}
                tickLine={false}
                tick={{
                  fontSize: 12,
                  fontFamily: "Roboto",
                  fill: "#475569",
                }}
              />
            )}

            <Tooltip />
            <CartesianGrid strokeDasharray="5 10" vertical={false} />
            <Bar label={true} dataKey={verticalValue} fill={color} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CardBarChart;
