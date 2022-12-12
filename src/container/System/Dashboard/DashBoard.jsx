import { DatePicker, List, Progress, Table } from "antd";
// import Highcharts from "highcharts";
// import {
//   default as PieChart,
//   default as ReactHighcharts,
// } from "highcharts-react-official";
import moment from "moment";
import React, { useCallback, useEffect, useState } from "react";
import { Card, CardBody, Col, Input, Row } from "reactstrap";
import { getDayReportApi } from "../../../api/statistic";
import CustomTextInput from "../../../components/CustomTextInput/customTextInput";
import "./DashBoard.scss";
import Header from "./HeaderBoard/Header";

const { RangePicker } = DatePicker;

const data = [
  {
    id: 1,
    name: "Nguyễn Tam Kiều Công",
    service: "Giúp việc theo giờ ",
    time: "31/12/2022",
    address: "Hồ Chí Minh",
    collaborator: "Tam Kiều Công",
    progress: "Hoàn thành",
  },
  {
    id: 2,
    name: "Nguyễn Tam Kiều Công",
    service: "Giúp việc theo giờ ",
    time: "31/12/2022",
    address: "Hồ Chí Minh",
    collaborator: "Tam Kiều Công",
    progress: "Hoàn thành",
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
    dataDay.push([item?.total_income]);
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

  const options = {
    chart: {
      type: "column",
      width: 1000,
      height: 300,
    },
    title: {
      text: "Thống kê",
    },
    xAxis: {
      type: "total_income",
      labels: {
        style: {
          fontSize: "13px",
          fontFamily: "Verdana, sans-serif",
        },
      },
    },
    yAxis: {
      min: 0,
      title: {
        text: "Tiền",
      },
    },
    legend: {
      enabled: false,
    },
    series: [
      {
        name: "Tiền",
        data: dataDay,
      },
    ],
  };

  const optionPie = {
    chart: {
      type: "pie",
      width: 700,
      height: 300,
    },
    title: {
      text: "",
    },
    series: [
      {
        name: "Gases",
        data: [
          {
            name: "GIÚP VIỆC THEO GIỜ/4 GIỜ",
            y: 0.9,
            color: "#BAE6FD",
          },
          {
            name: "GIÚP VIỆC THEO GIỜ/3 GIỜ",
            y: 78.1,
            color: "#F477EF",
          },
          {
            name: "GIÚP VIỆC THEO GIỜ/2 GIỜ",
            y: 20.9,
            color: "#FCD34D",
          },
          {
            name: "Khác",
            y: 0.1,
            color: "#2ACB9E",
          },
        ],
      },
    ],
  };

  const columns = [
    {
      title: "Khách hàng",
      render: (data) => {
        return (
          <a className="text-name" onClick={() => {}}>
            {data.name}
          </a>
        );
      },
    },
    {
      title: "Dịch vụ",
      render: (data) => {
        return (
          <div className="div-column-service">
            <a>{data.service}</a>
            <a>08:00-10:00</a>
          </div>
        );
      },
    },
    {
      title: "Thời gian",
      render: (data) => {
        return (
          <div className="div-column-service">
            <a>{data.time}</a>
            <a>Thứ bảy</a>
          </div>
        );
      },
    },
    {
      title: "Địa điểm",
      render: (data) => {
        return (
          <div className="div-column-service">
            <a>{data.address}</a>
            <a>45 Lê Lợi, Phường Bến Thành, Qu...</a>
          </div>
        );
      },
    },
    {
      title: "Cộng tác viên",
      dataIndex: "collaborator",
    },
    {
      title: "Tiến độ",
      dataIndex: "progress",
    },
    {
      title: "Hành động",
      key: "action",
      render: (data) => {
        return (
          <div className="div-action">
            <button className="btn-click">Thao tác</button>
            <button className="btn-details">Chi tiết</button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="container-dash">
      <Header />
      <div>
        <div className="mt-4">
          <Row>
            <Col lg="9">
              <div className="chart">
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
                {/* <ReactHighcharts highcharts={Highcharts} options={options} /> */}

                <Row>
                  <Col lg="7" className="pl-4">
                    <p className="label-persen-active">Phần trăm hoạt động</p>
                    <div className="div-persen">
                      <p className="label-persen">49%</p>
                      <p className="label-total">Tổng</p>
                    </div>
                    <Progress
                      percent={49}
                      showInfo={false}
                      strokeColor={"#48CAE4"}
                      className="progress-persent"
                      strokeWidth={15}
                    />
                    <div className="div-container-on">
                      <div className="div-on">
                        <div className="line-on" />
                        <div className="total-div-on">
                          <a className="text-on">Online</a>
                          <a className="text-total-on">2,113</a>
                        </div>
                      </div>

                      <div className="div-on">
                        <div className="line-off" />
                        <div className="total-div-on">
                          <a className="text-on">Ofline</a>
                          <a className="text-total-on">2,113</a>
                        </div>
                      </div>
                    </div>
                  </Col>
                  <Col lg="5">
                    <p className="label-persen-active">Active Users</p>
                    <p className="label-active">2154</p>
                    <div>
                      <Progress
                        percent={66}
                        strokeWidth={10}
                        strokeColor={"#48CAE4"}
                        className="progress-persent"
                      />
                      <a>Hồ Chí Minh</a>
                    </div>
                    {/* <div>
                      <Progress
                        percent={73}
                        strokeWidth={10}
                        strokeColor={"#48CAE4"}
                        className="progress-persent"
                      />
                      <a>Đà Nẵng</a>
                    </div>
                    <div>
                      <Progress
                        percent={20}
                        strokeWidth={10}
                        strokeColor={"#48CAE4"}
                        className="progress-persent"
                      />
                      <a>Hà Nội</a>
                    </div> */}
                  </Col>
                </Row>
              </div>
            </Col>
            <Col lg="3">
              <div className="div-connect-service">
                <div className="div-progress">
                  <Progress
                    type="dashboard"
                    percent={75}
                    gapDegree={5}
                    strokeColor={"#48CAE4"}
                    strokeWidth={20}
                  />
                </div>
                <div className="div-progress-text">
                  <p className="title-progress">Tỉ lệ dịch vụ kết nối</p>
                </div>
                <div className="div-success">
                  <a className="square" />
                  <p className="text-success-square">Hoàn thành</p>
                </div>
                <div className="div-success">
                  <a className="unsquare" />
                  <p className="text-success-square">Chưa hoàn thành</p>
                </div>
              </div>
              <div className="div-top-collaborator">
                <p className="text-top">Top CTV</p>
                <div className="level-ctv1">
                  <p className="text-level">Nguyễn Công Kiều Tam</p>
                  <p className="text-level">15.000.000đ</p>
                </div>
                <div className="level-ctv2">
                  <p className="text-level">Nguyễn Công Kiều Tam</p>
                  <p className="text-level">15.000.000đ</p>
                </div>
                <div className="level-ctv3">
                  <p className="text-level">Nguyễn Công Kiều Tam</p>
                  <p className="text-level">15.000.000đ</p>
                </div>
                <div className="level-ctv4">
                  <p className="text-level">Nguyễn Công Kiều Tam</p>
                  <p className="text-level">15.000.000đ</p>
                </div>
                <div className="level-ctv5">
                  <p className="text-level">Nguyễn Công Kiều Tam</p>
                  <p className="text-level">15.000.000đ</p>
                </div>
                <div className="div-seemore">
                  <p>Xem chi tiết</p>
                  <i class="uil uil-angle-right"></i>
                </div>
              </div>
            </Col>
          </Row>
        </div>
        <p className="label-service">DỊCH VỤ GẦN NHẤT</p>
        <Row className=" mb-5">
          <Col className="mb-5 mb-xl-0">
            <Card className="shadow">
              <CardBody>
                <Table columns={columns} dataSource={data} pagination={false} />
              </CardBody>
              <div className="div-entries">
                <CustomTextInput
                  label={"Hiện"}
                  type="select"
                  className={"select-entries"}
                  body={
                    <>
                      <option value={"5"}>5</option>
                      <option value={"5"}>10</option>
                      <option value={"5"}>15</option>
                    </>
                  }
                />
              </div>
            </Card>
          </Col>
        </Row>
        <div>
          <Row>
            <Col lg="9">
              <div className="div-chart-pie">
                <div>
                  <a>TOP DỊCH VỤ</a>
                </div>
                <Row>
                  <Col>
                    {/* <PieChart highcharts={Highcharts} options={optionPie} /> */}
                  </Col>
                  <Col className="mt-5">
                    <div>
                      <Progress
                        percent={66}
                        strokeWidth={10}
                        strokeColor={"#48CAE4"}
                      />
                      <a>Hồ Chí Minh</a>
                    </div>
                    {/* <div>
                      <Progress
                        percent={66}
                        strokeWidth={10}
                        strokeColor={"#48CAE4"}
                      />
                      <a>Hồ Chí Minh</a>
                    </div>
                    <div>
                      <Progress
                        percent={66}
                        strokeWidth={10}
                        strokeColor={"#48CAE4"}
                      />
                      <a>Hồ Chí Minh</a>
                    </div> */}
                  </Col>
                </Row>
              </div>
            </Col>
            <Col lg="3">
              <div className="col-activity">
                <p className="label-activity">Hoạt động</p>
                <List
                  itemLayout="horizontal"
                  dataSource={[1, 2, 3]}
                  renderItem={(item) => {
                    return (
                      <div className="div-list">
                        <div className="div-line">
                          <div className="circle" />
                          <div className="line-vertical" />
                        </div>
                        <div>
                          <a>Lê</a>
                        </div>
                      </div>
                    );
                  }}
                />
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
}
