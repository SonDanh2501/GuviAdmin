import React from "react";
import {
  Legend,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from "recharts";

const CardRadio = (props) => {
  const { data, dataKey, dataName } = props;
  const MAX_LINE_WIDTH = 110;
  const CustomDot = (props) => {
    const { cx, cy, value } = props;

    if (value > 2500) {
      return <circle cx={cx} cy={cy} r={10} fill="red" stroke="none" />;
    }

    return <circle cx={cx} cy={cy} r={5} fill="#8b5cf6" stroke="none" />;
  };
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


  return (
    <div className="card-statistics__overview-criteria">
      <ResponsiveContainer height={250} width={"100%"}>
        <RadarChart outerRadius={80} data={data}>
          <PolarGrid opacity={1} stroke="#e5e7eb" />
          <PolarAngleAxis tick={renderCustomTick} dataKey={dataKey} />
          <PolarRadiusAxis angle={90} domain={[0, 5]} />
          <Radar
            dot={<CustomDot />}
            label={false}
            legendType="square"
            name={dataName}
            dataKey="B"
            stroke="#8b5cf6"
            strokeWidth={3}
            fill="transparent"
            fillOpacity={0.6}
          />
          <Legend />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CardRadio;
