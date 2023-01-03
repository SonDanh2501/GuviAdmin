import {
  DatePicker,
  Empty,
  FloatButton,
  List,
  Progress,
  Select,
  Skeleton,
  Table,
  Input,
} from "antd";

import moment from "moment";
import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { Card, CardBody, Col, Row } from "reactstrap";
import { getDayReportApi } from "../../../api/statistic";
import CustomTextInput from "../../../components/CustomTextInput/customTextInput";
import {
  getActiveUser,
  getHistoryActivity,
  getLastestService,
  getServiceConnect,
  getTopCollaborator,
} from "../../../redux/actions/statistic";
import {
  getActiveUsers,
  getHistoryActivitys,
  getLastestServices,
  getServiceConnects,
  getTopCollaborators,
} from "../../../redux/selectors/statistic";
import "./DashBoard.scss";
import Header from "./HeaderBoard/Header";
import "moment/locale/vi";
import { useNavigate } from "react-router-dom";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatMoney } from "../../../helper/formatMoney";
import MoreTopCollaborator from "../../../components/moreTopCollaborator";
import MoreActivity from "./MoreActivity";
moment.locale("vi");
const { RangePicker } = DatePicker;
const { Option } = Select;

const data = [
  { name: "Group A", value: 400 },
  { name: "Group B", value: 300 },
  { name: "Group C", value: 300 },
  { name: "Group D", value: 100 },
];
const COLORS = ["#BAE6FD", " #F477EF", "#FCD34D", "#2ACB9E"];

export default function Home() {
  const [arrResult, setArrResult] = useState([]);
  const [dataTopService, setDataTopService] = useState([]);
  const [day, setDay] = useState([]);
  const [type, setType] = useState("day");
  const dataDay = [];
  const [numberData, setNumberData] = useState(5);
  const historyActivity = useSelector(getHistoryActivitys);
  const activeUser = useSelector(getActiveUsers);
  const lastestService = useSelector(getLastestServices);
  const connectionService = useSelector(getServiceConnects);
  const topCollaborator = useSelector(getTopCollaborators);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    getDayReportApi(
      moment().startOf("month").toISOString(),
      moment(new Date()).toISOString()
    )
      .then((res) => {
        setArrResult(res.arrResult);
      })
      .catch((err) => console.log(err));
    dispatch(getServiceConnect.getServiceConnectRequest());
    dispatch(
      getHistoryActivity.getHistoryActivityRequest({ start: 0, length: 20 })
    );
    dispatch(getActiveUser.getActiveUserRequest());
    dispatch(
      getLastestService.getLastestServiceRequest({ start: 0, length: 5 })
    );
    dispatch(
      getTopCollaborator.getTopCollaboratorRequest({
        startDate: moment().startOf("month").toISOString(),
        endDate: moment().endOf("month").toISOString(),
        start: 0,
        length: 10,
      })
    );
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

  const onChange = useCallback((start, end) => {
    const dayStart = moment(start).toISOString();
    const dayEnd = moment(end).toISOString();
    getDayReportApi(dayStart, dayEnd)
      .then((res) => {
        setArrResult(res.arrResult);
      })
      .catch((err) => console.log(err));

    getDates(dayStart, dayEnd);
  }, []);

  const timeWork = (data) => {
    const start = moment(new Date(data.date_work)).format("HH:mm");

    const timeEnd =
      Number(start?.slice(0, 2)) + data?.total_estimate + start?.slice(2, 5);

    return start + " - " + timeEnd;
  };

  const columns = [
    {
      title: "Khách hàng",
      render: (data) => {
        return (
          <a
            className="text-collaborator"
            onClick={() =>
              navigate("/details-customer", {
                state: { id: data?.id_customer?._id },
              })
            }
          >
            {data?.id_customer?.full_name}
          </a>
        );
      },
    },
    {
      title: "Dịch vụ",
      render: (data) => {
        return (
          <div className="div-column-service">
            <a className="text-service">
              {data?.service?._id?.kind === "giup_viec_theo_gio"
                ? "Giúp việc theo giờ"
                : "Giúp việc cố định"}
            </a>
            <a className="text-service">{timeWork(data)}</a>
          </div>
        );
      },
    },
    {
      title: "Thời gian",
      render: (data) => {
        return (
          <div className="div-column-service">
            <a className="text-service">
              {moment(new Date(data?.date_work)).format("DD/MM/YYYY")}
            </a>
            <a className="text-service">
              {moment(new Date(data?.date_work)).lang("VI").format("dddd")}
            </a>
          </div>
        );
      },
    },
    {
      title: "Địa điểm",
      render: (data) => {
        return (
          <div className="div-column-service">
            <a className="text-address">{data?.address}</a>
          </div>
        );
      },
    },
    {
      title: "Cộng tác viên",
      render: (data) => {
        return (
          <div>
            {!data?.id_collaborator ? (
              <a>Đang tìm kiếm</a>
            ) : (
              <a
                onClick={() =>
                  navigate("/details-collaborator", {
                    state: { id: data?.id_collaborator?._id },
                  })
                }
                className="text-collaborator"
              >
                {data?.id_collaborator.full_name}
              </a>
            )}
          </div>
        );
      },
    },
    {
      title: "Tiến độ",
      render: (data) => (
        <a
          className={
            data?.status === "pending"
              ? "text-pending"
              : data?.status === "confirm"
              ? "text-confirm"
              : data?.status === "doing"
              ? "text-doing"
              : data?.status === "done"
              ? "text-done"
              : "text-cancel"
          }
        >
          {data?.status === "pending"
            ? "Đang chờ làm"
            : data?.status === "confirm"
            ? "Đã nhận"
            : data?.status === "doing"
            ? "Đang làm"
            : data?.status === "done"
            ? "Hoàn thành"
            : "Đã huỷ"}
        </a>
      ),
    },
    {
      title: "Hành động",
      key: "action",
      render: (data) => {
        return (
          <div className="div-action">
            <button className="btn-click">Thao tác</button>
            <button
              className="btn-details"
              onClick={() =>
                navigate("/details-order", {
                  state: { id: data?._id },
                })
              }
            >
              Chi tiết
            </button>
          </div>
        );
      },
    },
  ];

  const onChangeNumberData = useCallback((number) => {
    dispatch(
      getLastestService.getLastestServiceRequest({ start: 0, length: number })
    );
  }, []);

  return (
    <div className="container-dash">
      <Header />
      <div>
        <div className="mt-4 mb-4">
          <Row>
            <Col lg="9">
              <div className="chart">
                <div className="div-date">
                  <Input.Group compact>
                    <Select
                      defaultValue={type}
                      onChange={(e) => setType(e)}
                      className="input-picker"
                    >
                      <Option value="day">Ngày</Option>
                      <Option value="week">Tuần </Option>
                      <Option value="month">Tháng</Option>
                      <Option value="quarter">Quý</Option>
                    </Select>
                  </Input.Group>
                  <div>
                    <RangePicker
                      picker={type}
                      className="picker"
                      onChange={(e) => onChange(e[0]?.$d, e[1]?.$d)}
                    />
                  </div>
                </div>
                <div>
                  <ResponsiveContainer
                    width={"100%"}
                    height={350}
                    min-width={350}
                  >
                    <AreaChart
                      width={window.screen.height / 1.2}
                      height={400}
                      data={arrResult}
                      margin={{
                        top: 10,
                        right: 30,
                        left: 0,
                        bottom: 0,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis />
                      <YAxis dataKey="total_income" fontSize={12} />
                      <Tooltip />
                      <Area
                        type="monotone"
                        dataKey="total_income"
                        stroke="#00CF3A"
                        fill="#00CF3A"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <Row>
                  <Col lg="7" className="pl-4">
                    <p className="label-persen-active">Phần trăm hoạt động</p>
                    <div className="div-persen">
                      <p className="label-persen">{activeUser?.donePercent}%</p>
                      <p className="label-total">Tổng</p>
                    </div>
                    <Progress
                      percent={activeUser?.donePercent}
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
                          <a className="text-total-on">
                            {activeUser?.ActiveUsers}
                          </a>
                        </div>
                      </div>

                      <div className="div-on">
                        <div className="line-off" />
                        <div className="total-div-on">
                          <a className="text-on">Ofline</a>
                          <a className="text-total-on">
                            {activeUser?.OfflineUsers}
                          </a>
                        </div>
                      </div>
                    </div>
                  </Col>
                  <Col lg="5">
                    {/* <p className="label-persen-active">Active Users</p>
                    <p className="label-active">2154</p>
                    <div>
                      <Progress
                        percent={66}
                        strokeWidth={10}
                        strokeColor={"#48CAE4"}
                        className="progress-persent"
                      />
                      <a>Hồ Chí Minh</a>
                    </div> */}
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
                    percent={
                      !connectionService?.donePercent
                        ? 0
                        : connectionService?.donePercent
                    }
                    gapDegree={5}
                    strokeColor={"#48CAE4"}
                    strokeWidth={15}
                    width={150}
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
              {topCollaborator.length > 0 && (
                <div className="div-top-collaborator">
                  <p className="text-top">Top CTV</p>
                  <div className="level">
                    <div
                      className="level-ctv1"
                      onClick={() =>
                        navigate("/details-collaborator", {
                          state: {
                            id: topCollaborator[0]?._id?.id_collaborator,
                          },
                        })
                      }
                    >
                      <p className="text-level">
                        {topCollaborator[0]?._id?.name}
                      </p>
                      <p className="text-level">
                        {formatMoney(topCollaborator[0]?.sumIncome)}
                      </p>
                    </div>
                    {topCollaborator.length > 1 && (
                      <div
                        className="level-ctv2"
                        onClick={() =>
                          navigate("/details-collaborator", {
                            state: {
                              id: topCollaborator[1]?._id?.id_collaborator,
                            },
                          })
                        }
                      >
                        <p className="text-level">
                          {topCollaborator[1]?._id?.name}
                        </p>
                        <p className="text-level">
                          {formatMoney(topCollaborator[1]?.sumIncome)}
                        </p>
                      </div>
                    )}
                    {topCollaborator.length > 2 && (
                      <div
                        className="level-ctv3"
                        onClick={() =>
                          navigate("/details-collaborator", {
                            state: {
                              id: topCollaborator[2]?._id?.id_collaborator,
                            },
                          })
                        }
                      >
                        <p className="text-level">
                          {topCollaborator[2]?._id?.name}
                        </p>
                        <p className="text-level">
                          {formatMoney(topCollaborator[2]?.sumIncome)}
                        </p>
                      </div>
                    )}
                    {topCollaborator.length > 3 && (
                      <div
                        className="level-ctv4"
                        onClick={() =>
                          navigate("/details-collaborator", {
                            state: {
                              id: topCollaborator[3]?._id?.id_collaborator,
                            },
                          })
                        }
                      >
                        <p className="text-level">
                          {topCollaborator[3]?._id?.name}
                        </p>
                        <p className="text-level">
                          {formatMoney(topCollaborator[3]?.sumIncome)}
                        </p>
                      </div>
                    )}
                    {topCollaborator.length > 4 && (
                      <div
                        className="level-ctv5"
                        onClick={() =>
                          navigate("/details-collaborator", {
                            state: {
                              id: topCollaborator[4]?._id?.id_collaborator,
                            },
                          })
                        }
                      >
                        <p className="text-level">
                          {topCollaborator[4]?._id?.name}
                        </p>
                        <p className="text-level">
                          {formatMoney(topCollaborator[4]?.sumIncome)}
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="div-seemore">
                    <MoreTopCollaborator />
                  </div>
                </div>
              )}
            </Col>
          </Row>
        </div>
        <p className="label-service">DỊCH VỤ GẦN NHẤT</p>
        <Row className=" mb-5">
          <Col className="mb-5 mb-xl-0">
            <Card className="shadow">
              <CardBody>
                <Table
                  columns={columns}
                  dataSource={lastestService}
                  pagination={false}
                  // locale={{
                  //   emptyText:
                  //     lastestService.length > 0 ? (
                  //       <Empty />
                  //     ) : (
                  //       <Skeleton active={true} />
                  //     ),
                  // }}
                />
              </CardBody>
              <div className="div-entries">
                <CustomTextInput
                  label={"Hiện"}
                  type="select"
                  className={"select-entries"}
                  onChange={(e) => onChangeNumberData(e.target.value)}
                  body={
                    <>
                      <option value={"5"}>5</option>
                      <option value={"10"}>10</option>
                      <option value={"20"}>20</option>
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
                    <div className="div-pieChart">
                      <div>
                        <div className="div-service-hours">
                          <div className="div-towhours" />
                          <a>2 Giờ</a>
                        </div>
                        <div className="div-service-hours">
                          <div className="div-threehours" />
                          <a>3 Giờ</a>
                        </div>
                        <div className="div-service-hours">
                          <div className="div-fourhours" />
                          <a>4 Giờ</a>
                        </div>
                        <div className="div-service-hours">
                          <div className="div-different" />
                          <a>Khác</a>
                        </div>
                      </div>
                      <div className="div-chart-de">
                        <PieChart width={300} height={320}>
                          <Pie
                            data={data}
                            cx={120}
                            cy={200}
                            innerRadius={60}
                            outerRadius={80}
                            fill="#8884d8"
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {data.map((entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={COLORS[index % COLORS.length]}
                              />
                            ))}
                          </Pie>
                        </PieChart>
                      </div>
                    </div>
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
                  dataSource={historyActivity.slice(0, 3)}
                  renderItem={(item, index) => {
                    return (
                      <div className="div-list" key={index}>
                        <div className="div-line">
                          <div className="circle" />
                          <div className="line-vertical" />
                        </div>
                        <div className="div-details-activity">
                          <a className="text-date-activity">
                            {moment(new Date(item?.date_create)).format(
                              "DD/MM/YYYY"
                            )}
                          </a>
                          <a className="text-date-activity">
                            {item?.admin_action}
                            <a className="text-time-activity">
                              {/* {item?.id_collaborator
                                ? item?.id_collaborator?.name
                                : item?.id_customer
                                ? item?.id_customer?.name
                                : item?.id_admin_action?.name} */}
                              -{" "}
                              {moment(new Date(item?.date_create)).format(
                                "HH:MM"
                              )}
                            </a>
                          </a>
                          <a className="text-content-activity">
                            {item?.id_customer
                              ? item?.title_admin.replace(
                                  item?.id_customer?._id,
                                  item?.id_customer?.name
                                )
                              : item?.title_admin}
                          </a>
                        </div>
                      </div>
                    );
                  }}
                />
                {/* <MoreActivity /> */}
              </div>
            </Col>
          </Row>
        </div>
      </div>
      <FloatButton.BackTop />
    </div>
  );
}
