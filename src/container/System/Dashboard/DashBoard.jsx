import React, { useCallback, useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  Col,
  Container,
  Input,
  Row,
  Table,
} from "reactstrap";
import "./DashBoard.scss";
import Header from "./HeaderBoard/Header";
import HomeObj from "./DashboardTable";
import {
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Tooltip,
  XAxis,
  YAxis,
  Area,
} from "recharts";
import { getDayReportApi } from "../../../api/statistic";
import { DatePicker, Space } from "antd";
import moment from "moment";
import { formatDayVN } from "../../../helper/formatDayVN";
const { RangePicker } = DatePicker;

const data = [
  {
    id: 1,
    name: "Nguyễn Tam Kiều Công",
    service: "Giúp việc theo giờ",
    time: "16:00",
    address: "Ho chi Minh",
    progress: "Hoàn thành",
  },
  {
    id: 2,
    name: "Nguyễn Tam Kiều Công",
    service: "Giúp việc cố định",
    time: "16:00",
    address: "Ho chi Minh",
    progress: "Hoàn thành",
  },
];
const dataChart = [
  {
    name: "Tháng 1",
    money: 2400,
    job: 1,
  },
  {
    name: "Tháng 2",
    money: 1398,
    job: 7,
  },
  {
    name: "Tháng 3",
    money: 9800,
    job: 8634,
  },
  {
    name: "Tháng 4",
    money: 3908,
    job: 2,
  },
  {
    name: "Tháng 5",
    money: 4800,
    job: 1,
  },
  {
    name: "Tháng 6",
    money: 3800,
    job: 90,
  },
  {
    name: "Tháng 7",
    money: 4300,
    job: 234,
  },
  {
    name: "Tháng 8",
    money: 4300,
    job: 2436,
  },
];

const dataAreChart = [
  {
    name: "Quận 1",
    money: 2400,
  },
  {
    name: "Quận 2",
    money: 1398,
  },
  {
    name: "Quận 3",
    money: 9800,
  },
  {
    name: "Quận 4",
    money: 3908,
  },
  {
    name: "Quận 5",
    money: 4800,
  },
  {
    name: "Quận 6",
    money: 3800,
  },
];

export default function Home() {
  const [arrResult, setArrResult] = useState([]);
  const [day, setDay] = useState([]);
  const [type, setType] = useState("");
  const dataDay = [];
  useEffect(() => {
    getDayReportApi(
      moment(new Date(2022, 11, 1)).toISOString(),
      moment(new Date()).toISOString()
    )
      .then((res) => {
        setArrResult(res.arrResult);
      })
      .catch((err) => console.log(err));
  }, []);

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

  arrResult.map((item, index) => {
    dataDay.push({
      money: item?.total_income,
      job: item?.total_job,
    });
  });

  const onChange = useCallback((start, end) => {
    console.log(start, end);
    const dayStart = moment(start).toISOString();
    const dayEnd = moment(end).toISOString();
    getDayReportApi(dayStart, dayEnd)
      .then((res) => {
        setArrResult(res.arrResult);
      })
      .catch((err) => console.log(err));

    getDates(dayStart, dayEnd);
  }, []);

  return (
    <>
      <Header />
      <Container className="mt--7" fluid>
        <Row className="mt-5">
          <Col xl="8">
            <Input
              name="select"
              className="type-select"
              type="select"
              onChange={(e) => setType(e.target.value)}
            >
              <>
                <option value="">Chọn kiểu</option>
                <option value="day">Ngày</option>
                <option value="week">Tuần</option>
              </>
            </Input>
            <RangePicker
              picker={type}
              onChange={(e) => onChange(e[0]?.$d, e[1]?.$d)}
              style={{ marginBottom: 10 }}
            />
            <BarChart
              width={1000}
              height={500}
              data={dataDay}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis type="number" domain={[0, 2000000]} />
              <Tooltip />
              <Legend />
              <Bar dataKey="money" fill="#82ca9d" radius={5} barSize={25} />
              <Bar dataKey="job" fill="#82ca53" radius={5} barSize={25} />
            </BarChart>
          </Col>
          {/* <Col xl="4">
            <AreaChart
              width={500}
              height={470}
              data={dataAreChart}
              syncId="anyId"
              margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 0,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis type="number" domain={[0, 20000]} />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="money"
                stroke="#82ca9d"
                fill="rgb(253, 255, 215)"
              />
            </AreaChart>
          </Col> */}
        </Row>
        <Row className="mt-5 mb-5">
          <Col className="mb-5 mb-xl-0">
            <Card className="shadow">
              <CardHeader className="border-0">
                <Row className="align-items-center">
                  <div className="col">
                    <h3 className="mb-0">Thông tin dịch vụ gần nhất</h3>
                  </div>
                </Row>
              </CardHeader>
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                    <th scope="col">Khách hàng</th>
                    <th scope="col">Dịch vụ yêu cầu</th>
                    <th scope="col">Thời gian</th>
                    <th scope="col">Địa điểm</th>
                    <th scope="col">Tiến độ</th>
                    <th scope="col" />
                  </tr>
                </thead>
                <tbody>
                  {data.length > 0 ? (
                    data.map((e) => <HomeObj {...e} />)
                  ) : (
                    <></>
                  )}
                </tbody>
              </Table>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}
