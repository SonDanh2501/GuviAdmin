import moment from "moment";
import React, { useEffect, useState, memo } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  getReportOrderByCity,
  getReportOrderDaily,
  getReportServiceByArea,
} from "../../../api/report";
import CustomDatePicker from "../../../components/customDatePicker";
import RangeDatePicker from "../../../components/datePicker/RangeDatePicker";
import { CaretDownOutlined, CaretUpOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import LoadingPagination from "../../../components/paginationLoading";
import { formatMoney } from "../../../helper/formatMoney";
import { number_processing } from "../../../helper/numberProcessing";
import { getLanguageState } from "../../../redux/selectors/auth";
import "./styles.scss";
import { Image, Select } from "antd";


const ReportOverview = () => {
  const lang = useSelector(getLanguageState);
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [sameStartDate, setSameStartDate] = useState("")
  const [sameEndDate, setSameEndDate] = useState("")
  const headerDefault = {
    total: 0,
    arrow: "up",
    percent: 0,
  }
  const configSelectTopService = [
    { value: "total_income", label: "Doanh thu" },
    { value: "total_net_income", label: "Doanh thu thuần" },
  ]
  const [dataIncome, setDataIncome] = useState([]);
  const [headerIncome, setHeaderIncome] = useState(headerDefault);
  const [dataOrder, setDataOrder] = useState([]);
  const [headerOrder, setHeaderOrder] = useState(headerDefault);
  const [dataNetIncome, setDataNetIncome] = useState([]);
  const [headerNetIncome, setHeaderNetIncome] = useState(headerDefault);
  const [dataProfit, setDataProfit] = useState([]);
  const [headerProfit, setHeaderProfit] = useState(headerDefault);
  const [dataNetIncomeByArea, setDataNetIncomeByArea] = useState([]);
  const [dataChartAreaOrder, setDataChartAreaOrder] = useState([]);
  const [dataTopService, setDataTopService] = useState([]);
  const [typePriceService, setTypePriceService] = useState(configSelectTopService[0].value);

  const configLineIncome = [
    {
      dataKey: "total_gross_income",
      stroke: "#2962ff",
      name: "Hiện tại",
      strokeDasharray: ""
    },
    {
      dataKey: "total_gross_income_same",
      stroke: "#82ca9d",
      name: "Cùng kỳ",
      strokeDasharray: "3 4 5 2"
    }
  ]
  const configLineOrder = [
    {
      dataKey: "total_item",
      stroke: "#2962ff",
      name: "Hiện tại",
      strokeDasharray: ""
    },
    {
      dataKey: "total_item_same",
      stroke: "#82ca9d",
      name: "Cùng kỳ",
      strokeDasharray: "3 4 5 2"
    }
  ]
  const configLineNetIncome = [
    {
      dataKey: "total_net_income",
      stroke: "#2962ff",
      name: "Hiện tại",
      strokeDasharray: ""
    },
    {
      dataKey: "total_net_income_same",
      stroke: "#82ca9d",
      name: "Cùng kỳ",
      strokeDasharray: "3 4 5 2"
    }
  ]
  const configLineProfit = [
    {
      dataKey: "total_profit",
      stroke: "#2962ff",
      name: "Hiện tại",
      strokeDasharray: ""
    },
    {
      dataKey: "total_profit_same",
      stroke: "#82ca9d",
      name: "Cùng kỳ",
      strokeDasharray: "3 4 5 2"
    }
  ]



  useEffect(() => {
    if (startDate !== "") {
    const timeStartDate = new Date(startDate).getTime();
    const timeEndDate = new Date(endDate).getTime();
    const rangeDate = timeEndDate - timeStartDate;
    const tempSameEndDate = timeStartDate - 1;
    const tempSameStartDate = tempSameEndDate - rangeDate;
    setSameStartDate(new Date(tempSameStartDate).toISOString())
    setSameEndDate(new Date(tempSameEndDate).toISOString())
    }
  }, [startDate])


  useEffect(() => {
    if (sameStartDate !== "") {
      const oneDay = 24 * 60 * 60 * 1000;
      const diffDays = Math.round(Math.abs((new Date(startDate).getTime() - new Date(endDate).getTime()) / oneDay));
      getDataReportDaily(diffDays);
      getDataReportOrderByCity();
      getDataReportServiceByArea();
    }
  }, [sameStartDate]);

  useEffect(() => {
    const payload = []
    for(const item of dataTopService) {
      item.percent_view = item[`percent_${typePriceService}`]
      item.value_view = item[typePriceService]
      payload.push(item)
    }
    setDataTopService(payload);
  }, [typePriceService]);


  const getDataReportDaily = async (diffDays) => {
    const arrGetResult = await Promise.all([
      getReportOrderDaily(0, diffDays, startDate, endDate, "date_work", 1),
      getReportOrderDaily(0, diffDays, sameStartDate, sameEndDate, "date_work", 1)
    ])
    visualizationDataIncome(arrGetResult[0], arrGetResult[1])
    visualizationDataOrder(arrGetResult[0], arrGetResult[1])
    visualizationDataNetIncome(arrGetResult[0], arrGetResult[1])
    visualizationDataProfit(arrGetResult[0], arrGetResult[1])
  }


  const visualizationDataIncome = (data, dataInsame) => {
    const tempIncome = []
    for (let i = 0; i < data.data.length; i++) {
      const payload = {
        total_gross_income: data.data[i].total_gross_income,
        date_report: data.data[i]._id.slice(0, 5),
        total_gross_income_same: dataInsame.data[i]?.total_gross_income,
        date_report_same: dataInsame.data[i]?._id.slice(0, 5)
      }
      tempIncome.push(payload)
    }

    console.log(tempIncome, 'tempIncome');
    setDataIncome(tempIncome);


    const percentGrossIncome = (data.total[0]?.total_gross_income / (data.total[0]?.total_gross_income + dataInsame.total[0]?.total_gross_income)) * 100;
    const percentGrossIncomeSame = (dataInsame.total[0]?.total_gross_income / (data.total[0]?.total_gross_income + dataInsame.total[0]?.total_gross_income)) * 100

    const headerTempIncome = {
      total: formatMoney(data.total[0]?.total_gross_income),
      arrow: (percentGrossIncome - percentGrossIncomeSame > 0) ? "up" : "down",
      percent: Math.abs((percentGrossIncome - percentGrossIncomeSame).toFixed(2))
    }
    setHeaderIncome(headerTempIncome)
  }

  const visualizationDataOrder = (data, dataInsame) => {
    const tempOrder = []
    for (let i = 0; i < data.data.length; i++) {
      const payload = {
        total_item: data.data[i].total_item,
        date_report: data.data[i]._id.slice(0, 5),
        total_item_same: dataInsame.data[i]?.total_item,
        date_report_same: dataInsame.data[i]?._id.slice(0, 5)
      }
      tempOrder.push(payload)
    }
    setDataOrder(tempOrder);
    const percentOrder = (data.total[0]?.total_item / (data.total[0]?.total_item + dataInsame.total[0]?.total_item)) * 100;
    const percentSameOrder = (dataInsame.total[0]?.total_item / (data.total[0]?.total_item + dataInsame.total[0]?.total_item)) * 100
    const headerTempOrder = {
      total: data.total[0]?.total_item + " Đơn hàng",
      arrow: (percentOrder - percentSameOrder > 0) ? "up" : "down",
      percent: Math.abs((percentOrder - percentSameOrder).toFixed(2))
    }
    setHeaderOrder(headerTempOrder)
  }

  const visualizationDataNetIncome = (data, dataInsame) => {
    const temp = []
    for (let i = 0; i < data.data.length; i++) {
      const payload = {
        total_net_income: data.data[i].total_net_income,
        date_report: data.data[i]._id.slice(0, 5),
        total_net_income_same: dataInsame.data[i]?.total_net_income,
        date_report_same: dataInsame.data[i]?._id.slice(0, 5)
      }
      temp.push(payload)
    }
    setDataNetIncome(temp);
    const percent = (data.total[0]?.total_net_income / (data.total[0]?.total_net_income + dataInsame.total[0]?.total_net_income)) * 100;
    const percentSame = (dataInsame.total[0]?.total_net_income / (data.total[0]?.total_net_income + dataInsame.total[0]?.total_net_income)) * 100
    const headerTemp = {
      total: formatMoney(data.total[0]?.total_net_income),
      arrow: (percent - percentSame > 0) ? "up" : "down",
      percent: Math.abs((percent - percentSame).toFixed(2))
    }
    setHeaderNetIncome(headerTemp)
  }

  const visualizationDataProfit = (data, dataInsame) => {
    const temp = []
    for (let i = 0; i < data.data.length; i++) {
      const payload = {
        total_profit: data.data[i].total_net_income_business,
        date_report: data.data[i]._id.slice(0, 5),
        total_profit_same: dataInsame.data[i]?.total_net_income_business,
        date_report_same: dataInsame.data[i]?._id.slice(0, 5)
      }
      temp.push(payload)
    }
    setDataProfit(temp);
    const percent = (data.total[0]?.total_net_income_business / (data.total[0]?.total_net_income_business + dataInsame.total[0]?.total_net_income_business)) * 100;
    const percentSame = (dataInsame.total[0]?.total_net_income_business / (data.total[0]?.total_net_income_business + dataInsame.total[0]?.total_net_income_business)) * 100
    const headerTemp = {
      total: formatMoney(data.total[0]?.total_net_income_business),
      arrow: (percent - percentSame > 0) ? "up" : "down",
      percent: Math.abs((percent - percentSame).toFixed(2))
    }
    setHeaderProfit(headerTemp)
  }

  
  const getDataReportOrderByCity = async () => {
    const arrGetResult = await Promise.all([
      getReportOrderByCity(0, 90, startDate, endDate, 0),
      getReportOrderByCity(0, 90, sameStartDate, sameEndDate, 0)
    ])
    const payload = [];
    for(let i = 0 ; i < arrGetResult[0].totalItem ; i ++) {
      const percentNetIncome = (arrGetResult[0].data[i]?.total_net_income / (arrGetResult[0].data[i]?.total_net_income + arrGetResult[1].data[i]?.total_net_income)) * 100
      const percentNetIncomeSame = (arrGetResult[1].data[i]?.total_net_income / (arrGetResult[0].data[i]?.total_net_income + arrGetResult[1].data[i]?.total_net_income)) * 100
      const percent = (percentNetIncome - percentNetIncomeSame).toFixed(2)

      payload.push({
        city: arrGetResult[0].data[i]?.city,
        total_item: arrGetResult[0].data[i]?.total_item,
        total_net_income: arrGetResult[0].data[i]?.total_net_income,
        percent_net_income: percent
      })
    }
    setDataChartAreaOrder(payload);
  }

  const getDataReportServiceByArea = async () => {
    const arrGetResult = await Promise.all([
      getReportServiceByArea(startDate, endDate),
      getReportServiceByArea(sameStartDate, sameEndDate)
    ])

    const payload = [];
    for(let i = 0 ; i < arrGetResult[0].data.length ; i ++) {

      const percentIncome = arrGetResult[0].data[i].total_income / (arrGetResult[0].data[i].total_income + arrGetResult[1].data[i].total_income) * 100
      const percentIncomeSame = arrGetResult[1].data[i].total_income / (arrGetResult[0].data[i].total_income + arrGetResult[1].data[i].total_income) * 100
      const levelPercentIncome = (percentIncome - percentIncomeSame).toFixed(2)

      const percentNetIncome = arrGetResult[0].data[i].total_net_income / (arrGetResult[0].data[i].total_net_income + arrGetResult[1].data[i].total_net_income) * 100
      const percentNetIncomeSame = arrGetResult[1].data[i].total_net_income / (arrGetResult[0].data[i].total_net_income + arrGetResult[1].data[i].total_net_income) * 100
      const levelPercentNetIncome = (percentNetIncome - percentNetIncomeSame).toFixed(2) 

      const percentView = (typePriceService === configSelectTopService[0].value) ? levelPercentIncome : levelPercentNetIncome;
      payload.push({
        title: arrGetResult[0].data[i].title,
        thumbnail: arrGetResult[0].data[i].thumbnail,
        total_net_income: arrGetResult[0].data[i].total_net_income,
        total_net_income_same: arrGetResult[1].data[i].total_net_income,
        total_income: arrGetResult[0].data[i].total_income,
        total_income_same: arrGetResult[1].data[i].total_income,
        total_order: arrGetResult[0].data[i].total_order,
        total_order_same: arrGetResult[1].data[i].total_order,
        percent_total_income: isNaN(levelPercentIncome) ? 0 : levelPercentIncome,
        percent_total_net_income: isNaN(levelPercentNetIncome) ? 0 : levelPercentNetIncome,
        percent_view: (isNaN(percentView)) ? 0 : percentView,
        value_view: (typePriceService === configSelectTopService[0].value) ? arrGetResult[0].data[i].total_income : arrGetResult[0].data[i].total_net_income,
      })
    }
    setDataTopService(payload);
  }

  const HeaderInfo = ({ total, arrow, percentSame }) => {
    return (
      <React.Fragment>
        <div className="total-info">
          <div className="text-value">
          <p>{total}&nbsp;</p>
          </div>
          <div className="text-percent">
          {
            arrow === "up" ?
              (<CaretUpOutlined style={{ marginRight: 5 }} />) :
              (<CaretDownOutlined style={{ marginRight: 5 }} />)
          }
          <p>{percentSame}%</p>
          <span>&nbsp; so với cùng kỳ</span>
          </div>
        </div>
      </React.Fragment>
    )
  }

  const renderTooltipContent = (data) => {
    const { payload } = data;
    return (
      <>
        {payload && payload.length > 0 ? (<>
          <div className="tool-tip">
            <div style={{ color: payload[0].color }}>
              <span>{payload[0].payload?.date_report}: </span>
              <span>{ payload[0].payload?.total_item ?`${payload[0].value} Đơn`  : formatMoney(payload[0].value)}</span>
            </div>
            <div style={{ color: payload[1].color }}>
              <span>{payload[1].payload?.date_report_same}: </span>
              <span>{ payload[1].payload?.total_item ?`${payload[1].value} Đơn`  : formatMoney(payload[1].value)}</span>
            </div>
          </div>
        </>) :
          (<></>)}
      </>
    )
  }

  return (
    <React.Fragment>
      <div className="report-overview">
        <div className="div-flex-row-flex-start">
          <div className="date-picker">
            <RangeDatePicker
              setStartDate={setStartDate}
              setEndDate={setEndDate}
              onCancel={() => { }}
              defaults={"thirty_last"}
            />
          </div>
          <div className="div-same">
            <p className="m-0 text-date-same">
              Kỳ này: {moment(startDate).format("DD/MM/YYYY")}-
              {moment(endDate).format("DD/MM/YYYY")}
            </p>
          </div>
          <div className="div-same">
            <p className="m-0 text-date-same">
              Kỳ trước: {moment(sameStartDate).format("DD/MM/YYYY")}-
              {moment(sameEndDate).format("DD/MM/YYYY")}
            </p>
          </div>
        </div>

        <div className="div-flex-row-flex-start">
          <div className="block-content">
            <div className="header">
              <div className="text-header">
                <p>Doanh số</p>
              </div>
              <HeaderInfo total={headerIncome.total} arrow={headerIncome.arrow} percentSame={headerIncome.percent} />
            </div>
            <div className="content">
              {
                dataIncome?.length > 0 ? (
                  <ResponsiveContainer height={350} width="99%">
                    <LineChart data={dataIncome}
                    margin={{ left: -10, top: 10}}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date_report" angle={-20} textAnchor="end" tick={{ fontSize: 10 }}/>
                      <YAxis tickFormatter={(tickItem) => number_processing(tickItem)} />
                      <Tooltip
                        content={renderTooltipContent}
                      />
                      <Legend />
                      {configLineIncome.map((item, index) => (
                        <Line type="monotone" dataKey={item.dataKey} stroke={item.stroke} name={item.name} strokeDasharray={item.strokeDasharray} />
                      ))}
                    </LineChart>
                  </ResponsiveContainer>
                ) : (<p>Không có dữ liệu</p>)
              }
            </div>
          </div>
          <div className="block-content">
            <div className="header">
              <div className="text-header">
                <p>Lượng đơn hàng</p>
              </div>
              <HeaderInfo total={headerOrder.total} arrow={headerOrder.arrow} percentSame={headerOrder.percent} />
            </div>
            <div className="content">
              {
                dataOrder?.length > 0 ? (
                  <ResponsiveContainer height={350} width="99%">
                    <LineChart data={dataOrder}
                    margin={{ left: -10, top: 10}}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date_report" angle={-20} textAnchor="end" tick={{ fontSize: 10 }}  />
                      <YAxis tickFormatter={(tickItem) => number_processing(tickItem)} />
                      <Tooltip content={renderTooltipContent}/>
                      <Legend />
                      {configLineOrder.map((item, index) => (
                        <Line type="monotone" dataKey={item.dataKey} stroke={item.stroke} name={item.name} strokeDasharray={item.strokeDasharray} />
                      ))}
                    </LineChart>
                  </ResponsiveContainer>
                ) : (<p>Không có dữ liệu</p>)
              }
            </div>
          </div>
        </div>

        <div className="div-flex-row-flex-start">
          <div className="block-content">
            <div className="header">
              <div className="text-header">
                <p>Doanh thu thuần</p>
              </div>
              <HeaderInfo total={headerNetIncome.total} arrow={headerNetIncome.arrow} percentSame={headerNetIncome.percent} />
            </div>
            <div className="content">
              {
                dataNetIncome?.length > 0 ? (
                  <ResponsiveContainer height={350} width="99%">
                    <LineChart data={dataNetIncome}
                    margin={{ left: -10, top: 10}}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date_report" angle={-20} textAnchor="end" tick={{ fontSize: 10 }}  />
                      <YAxis tickFormatter={(tickItem) => number_processing(tickItem)} />
                      <Tooltip content={renderTooltipContent}/>
                      <Legend />
                      {configLineNetIncome.map((item, index) => (
                        <Line type="monotone" dataKey={item.dataKey} stroke={item.stroke} name={item.name} strokeDasharray={item.strokeDasharray} />
                      ))}
                    </LineChart>
                  </ResponsiveContainer>
                ) : (<p>Không có dữ liệu</p>)
              }
            </div>
          </div>
          <div className="block-content">
            <div className="header">
              <div className="text-header">
                <p>Lợi nhuận</p>
              </div>
              <HeaderInfo total={headerProfit.total} arrow={headerProfit.arrow} percentSame={headerProfit.percent} />
            </div>
            <div className="content">
              {
                dataProfit?.length > 0 ? (
                  <ResponsiveContainer height={350} width="99%">
                    <LineChart data={dataProfit}
                    margin={{ left: -10, top: 10}}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date_report" angle={-20} textAnchor="end" tick={{ fontSize: 10 }}  />
                      <YAxis tickFormatter={(tickItem) => number_processing(tickItem)} />
                      <Tooltip content={renderTooltipContent}/>
                      <Legend />
                      {configLineProfit.map((item, index) => (
                        <Line type="monotone" dataKey={item.dataKey} stroke={item.stroke} name={item.name} strokeDasharray={item.strokeDasharray} />
                      ))}
                    </LineChart>
                  </ResponsiveContainer>
                ) : (<p>Không có dữ liệu</p>)
              }
            </div>
          </div>
        </div>


        <div className="div-flex-row-flex-start">
          <div className="block-content">
            <div className="header">
              <div className="text-header">
                <p>Doanh thu thuần - theo khu vực</p>
              </div>
            </div>
            <div className="content">
            {dataChartAreaOrder?.slice(0, 5)?.map((item, index) => {
              return (
                <div key={index} className="div-item-chart">
                  <div className="div-name-area">
                    <p className="name-area">{item?.city}</p>
                    <p className="m-0">{item?.total_item} đơn</p>
                  </div>
                  <div className="div-number-area">
                    <p className="money-area">
                      {formatMoney(item?.total_net_income)}
                    </p>

                    {item?.percent_net_income < 0 ? (
                      <p className="text-number-persent-down">
                        <CaretDownOutlined style={{ marginRight: 5 }} />{" "}
                        {Math.abs(
                          isNaN(item?.percent_net_income)
                            ? 0
                            : Math.abs(item?.percent_net_income)
                        ).toFixed(2)}
                        %
                      </p>
                    ) : (
                      <p className="text-number-persent-up">
                        <CaretUpOutlined style={{ marginRight: 5 }} />
                        {Number(
                          isNaN(item?.percent_net_income)
                            ? 0
                            : Math.abs(item?.percent_net_income)
                        ).toFixed(2)}
                        %
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
            </div>
          </div>
          <div className="block-content">
            <div className="header">
            <div className="text-header">
                <p>Top dịch vụ</p>
              </div>
              <div className="select-type-view">
                 <Select
                  value={typePriceService}
                  style={{ width: 150 }}
                  bordered={false}
                  onChange={(e) => { console.log(e, 'e'); setTypePriceService(e)} }
                  options={configSelectTopService}
                />
              </div>
            </div>
            <div className="content">

              

                  {dataTopService.map((item, index) => {
                    return (
                      <>
                      <div className="item-service">
                      <div className="div-name-service">
                      <Image
                        preview={false}
                        className="image-service"
                        src={item.thumbnail}
                      />
                      <p className="name-service">{item.title.vi}</p>
                    </div>
                    <div className="div-info-service">
                      <p className="money-area">
                        { formatMoney(item.value_view)}
                      </p>
                      {item.percent_view < 0 ? (<>
                        <p className="text-number-persent-down">
                        <CaretDownOutlined style={{ marginRight: 5 }} />{" "}
                        {Math.abs(item.percent_view)}%
                        </p>
                      </>) : (<>
                        <p className="text-number-persent-up">
                        <CaretUpOutlined style={{ marginRight: 5 }} />{" "}
                        {Math.abs(item.percent_view)}%
                        </p>
                      </>)}
                    </div>
                    </div>
                      </>
                    )
                  })}
                  {/* {dataChartSerive.map((item, index) => {

                  })} */}
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  )
}


export default memo(ReportOverview);