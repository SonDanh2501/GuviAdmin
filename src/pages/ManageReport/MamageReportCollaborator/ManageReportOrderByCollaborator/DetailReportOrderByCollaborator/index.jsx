// import "./index.scss";
// import React, { useEffect, useState } from "react";
// import RangeDatePicker from "../../../../../../components/datePicker/RangeDatePicker";
// import DataTable from "../../../../../../components/tables/dataTable"
// import { formatMoney } from "../../../../../../helper/formatMoney";
// import { Popover, Image, Select } from "antd";
// import moment from "moment";
// import { getCollaboratorsById } from "../../../../../../api/collaborator";
// import { useLocation, useNavigate, useParams } from "react-router-dom";
// import {getReportDetailOrderByCollaborator} from "../../../../../../api/report"

// const DetailReportOrderByCollaborator = () => {
//   const { state } = useLocation();
//   const params = useParams();
//   const id = params?.id;
//   const { dateStart, dateEnd } = state || {};
//     const [startPage, setStartPage] = useState(0);
//     const [data, setData] = useState([]);
//     const [total, setTotal] = useState([]);
//     const [start, setStart] = useState(0)
//     const [startDate, setStartDate] = useState("")
//     const [endDate, setEndDate] = useState("")
//     const [dataTotal, setDataTotal] = useState({});
//     const [selectStatus, setSelectStatus] = useState(["done", "doing", "confirm"])
//     const [dataCollaborator, setDataCollaborator] = useState();

//     useEffect(() => {
//       getInfoCollaborator()
//     },[])

//     useEffect(() => {
//         if (startDate !== "") {
//           getDataDetailReportOrderByCollaborator();
//         }
//       }, [startDate, start])

//       const getDataDetailReportOrderByCollaborator = async () => {
//         const res = await getReportDetailOrderByCollaborator(id, start, 20, startDate, endDate, selectStatus);
//         setData(res?.data);
//         setTotal(res?.totalItem);
//         setDataTotal(res?.total[0]);
//       }

//       const getInfoCollaborator = async () => {
//         const res = await getCollaboratorsById(id)
//         setDataCollaborator(res);
//       }

//       const CustomHeaderDatatable = ({title, subValue, typeSubValue, textToolTip}) => {
//         const content = (
//             <p>
//               {textToolTip ? textToolTip : ""}
//             </p>
//         );
//         if(subValue) subValue = (typeSubValue === "money") ? formatMoney(subValue) : (typeSubValue === "percent") ? subValue + " %" : subValue;
//         if(title == "Giá vốn") subValue = "0 đ";
//         console.log(subValue, 'subValue');
//         return (
//           <React.Fragment>
//             <div className="header-table-custom">
//             <div className="title-report">
//             <p style={{color: title === "Doanh thu" ? "#2463eb" : "none"}} >{title}</p>
//             {textToolTip ? (
//             <Popover
//             content={content}
//             placement="bottom"
//             overlayInnerStyle={{
//             backgroundColor: "white"
//             }}
//           >
//             <div>
//               <i style={{color: title === "Doanh thu" ? "#2463eb" : "none"}} class="uil uil-question-circle icon-question"></i>
//             </div>
//           </Popover>
//             ) : (<></>)}
//             </div>
//             <div className="sub-value">
//               {subValue ? (
//                <p style={{color: title === "Doanh thu" ? "#2463eb" : "none"}} >{subValue}</p>
//               ) : (<div style={{marginTop: "35px"}}></div>)}
//             </div>
//             </div>

//           </React.Fragment>
//         )
//       }

//       const columns = [
//         // {
//         //   customTitle: <CustomHeaderDatatable title= "CTV" />,
//         //   dataIndex: 'id_collaborator.full_name',
//         //   key: "id_collaborator",
//         //   width: 100,
//         //   fontSize: "text-size-M text-weight-500"
//         // },
//         {
//           customTitle: <CustomHeaderDatatable title="Số đơn hàng"
//             subValue={dataTotal?.total_item} />,
//           dataIndex: 'total_item',
//           key: "number",
//           width: 50,
//           fontSize: "text-size-M text-weight-500"
//         },
//         {
//           customTitle: <CustomHeaderDatatable title="Tổng giá trị giao dịch"
//             subValue={dataTotal?.total_gross_income}
//             typeSubValue="money"
//             textToolTip="GMV - Gross Merchandise Volume" />,
//           dataIndex: 'total_gross_income',
//           key: "money",
//           width: 120,
//           fontSize: "text-size-M text-weight-500"

//         },
//         {
//           customTitle: <CustomHeaderDatatable title="Thu hộ dịch vụ"
//             subValue={dataTotal?.total_collabotator_fee}
//             typeSubValue="money"
//             textToolTip="Bao gồm phí dịch vụ trả cho CTV, tiền tip từ khách,…" />,
//           dataIndex: 'total_collabotator_fee',
//           key: "money",
//           width: 120,
//           fontSize: "text-size-M text-weight-500"

//         },
//         {
//           customTitle: <CustomHeaderDatatable title="Doanh thu"
//             subValue={dataTotal?.total_income}
//             typeSubValue="money"
//             textToolTip="" />,
//           dataIndex: 'total_income',
//           key: "money",
//           width: 120,
//           fontSize: "text-size-M text-color-1 text-weight-500"

//         },
//         {
//           customTitle: <CustomHeaderDatatable title="Giảm giá"
//             subValue={dataTotal?.total_discount}
//             typeSubValue="money"
//             textToolTip="Tổng số tiền giảm giá từ giảm giá dịch vụ, giảm giá đơn hàng, đồng giá, ctkm,…" />,
//           dataIndex: 'total_discount',
//           key: "money",
//           width: 120,
//           fontSize: "text-size-M text-weight-500"

//         },

//         {
//           customTitle: <CustomHeaderDatatable title="Doanh thu thuần"
//             subValue={dataTotal?.total_net_income}
//             typeSubValue="money"
//             textToolTip="Số tiền thu được sau khi trừ toàn bộ các giảm giá. Doanh thu thuần = Doanh thu (-) Giảm giá." />,
//           dataIndex: 'total_net_income',
//           key: "money",
//           width: 120,
//           fontSize: "text-size-M text-weight-500"

//         },
//         {
//           customTitle: <CustomHeaderDatatable title="Tổng hoá đơn"
//             subValue={dataTotal?.total_order_fee}
//             typeSubValue="money"
//             textToolTip="Tổng số tiền ghi nhận trên hoá đơn dịch vụ. Tổng hoá đơn = Tổng tiền - giảm giá." />,
//           dataIndex: 'total_order_fee',
//           key: "money",
//           width: 120,
//           fontSize: "text-size-M text-weight-500"
//         },
//         {
//           customTitle: <CustomHeaderDatatable title="Giá vốn"
//             subValue={dataTotal?.cost_price}
//             typeSubValue="money" />,
//           dataIndex: 'cost_price',
//           key: "money",
//           width: 120,
//           fontSize: "text-size-M text-weight-500"
//         },
//         {
//           customTitle: <CustomHeaderDatatable title="Thu nhập khác"
//             subValue={dataTotal?.punish}
//             typeSubValue="money"
//             textToolTip="Bao gồm phí phạt trễ và huỷ ca" />,
//           dataIndex: 'punish',
//           key: "money",
//           width: 120,
//           fontSize: "text-size-M text-weight-500"
//         },
//         {
//           customTitle: <CustomHeaderDatatable title="Tổng lợi nhuận"
//             subValue={dataTotal?.total_net_income_business}
//             typeSubValue="money"
//             textToolTip="Tổng lợi nhuận = Doanh thu thuần + thu nhập khác" />,
//           dataIndex: 'total_net_income_business',
//           key: "money",
//           width: 120,
//           fontSize: "text-size-M text-weight-500"
//         },
//         {
//           customTitle: <CustomHeaderDatatable title="% Lợi nhuận"
//             subValue={dataTotal?.percent_income}
//             typeSubValue="percent"
//             textToolTip="% Lợi nhuận = Tổng lợi nhuận (/) Doanh thu." />,
//           dataIndex: 'percent_income',
//           key: "percent",
//           width: 90,
//           fontSize: "text-size-M text-weight-500"
//         },
//         {
//           customTitle: <CustomHeaderDatatable title="Phí áp dụng"
//             subValue={dataTotal?.total_service_fee}
//             typeSubValue="money" />,
//           title: 'Phí áp dụng',
//           dataIndex: 'total_service_fee',
//           key: "money",
//           width: 120,
//           fontSize: "text-size-M text-weight-500"
//         },
//       ]

//       const changeStatusOrder = (value: string) => {
//         setSelectStatus(value)
//       };

//     return (
//         <React.Fragment>
//     <div className="div-container-content">
//       <div className="div-flex-row">
//         <div className="div-header-container">
//           <h4 className="title-cv">Báo cáo đơn hàng hoàn thành theo CTV</h4>
//         </div>

//       </div>

//       <div className="div-flex-row">
//       <div className="div-info-collaborator mt-2">
//         <Image
//           src={dataCollaborator?.avatar}
//           style={{ width: 100, height: 100, borderRadius: 4 }}
//         />
//         <div className="div-info-name">
//           <div className="div-row-name">
//             <p className="text-title-ctv">Tên:</p>{" "}
//             <p className="text-name-ctv">{dataCollaborator?.full_name}</p>
//           </div>
//           <div className="div-row-name">
//             <p className="text-title-ctv">Mã:</p>{" "}
//             <p className="text-name-ctv">{dataCollaborator?.id_view}</p>
//           </div>
//           <div className="div-row-name">
//             <p className="text-title-ctv">Sđt:</p>{" "}
//             <p className="text-name-ctv">{dataCollaborator?.phone}</p>
//           </div>
//         </div>
//       </div>
//       </div>

//         <div className="div-flex-row-flex-start">
//           <div className="date-picker">
//             <RangeDatePicker
//               setStartDate={setStartDate}
//               setEndDate={setEndDate}
//               onCancel={() => { }}
//               defaults={"thirty_last"}
//             />
//           </div>
//           <div className="div-same">
//             <p className="m-0 text-date-same">
//               {moment(startDate).format("DD/MM/YYYY")}-
//               {moment(endDate).format("DD/MM/YYYY")}
//             </p>
//           </div>
//         </div>

//         <div className="div-flex-row">
//         <Select
//           mode="multiple"
//           defaultValue="all"
//           onChange={changeStatusOrder}
//           value={selectStatus}
//           options={[
//             { value: 'done', label: 'Hoàn thành' },
//             { value: 'doing', label: 'Đang làm' },
//             { value: 'confirm', label: 'Đã nhận' },
//           ]}
//         />
//       </div>

//       <div className="div-flex-row-start">

//         <DataTable
//           columns={columns}
//           data={data}
//           // actionColumn={addActionColumn}
//           start={startPage}
//           pageSize={20}
//           totalItem={total}
//           // detectLoading={detectLoading}
//           // getItemRow={setItem}
//           onCurrentPageChange={setStart}
//         />
//       </div>
//     </div>

//         </React.Fragment>
//     )
// }

// export default DetailReportOrderByCollaborator;

import { Pagination, Popover, Table, Select, Image } from "antd";
import moment from "moment";
import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate, useParams, Link } from "react-router-dom";
import { getReportOrder } from "../../../../../api/report";
import CustomDatePicker from "../../../../../components/customDatePicker";
import LoadingPagination from "../../../../../components/paginationLoading";
import { formatMoney } from "../../../../../helper/formatMoney";
import useWindowDimensions from "../../../../../helper/useWindowDimensions";
import i18n from "../../../../../i18n";
import { getLanguageState } from "../../../../../redux/selectors/auth";
import RangeDatePicker from "../../../../../components/datePicker/RangeDatePicker";
import DataTable from "../../../../../components/tables/dataTable";
import { getReportDetailOrderByCollaborator } from "../../../../../api/report";
import { getCollaboratorsById } from "../../../../../api/collaborator";
import "./index.scss";

const DetailReportOrderByCollaborator = () => {
  const params = useParams();
  const id = params?.id;
  const { state } = useLocation();

  const [currentPage, setCurrentPage] = useState(1);
  const [startPage, setStartPage] = useState(0);
  const [lengthPage, setLengthPage] = useState(100);

  const [data, setData] = useState([]);
  const [total, setTotal] = useState([]);
  const [dataTotal, setDataTotal] = useState({});

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [start, setStart] = useState(0);

  const typeDate =
    window.location.pathname.slice(-5) === "-work"
      ? "date_work"
      : "date_create";

  const [isLoading, setIsLoading] = useState(false);
  const { width } = useWindowDimensions();
  const lang = useSelector(getLanguageState);

  const [selectStatus, setSelectStatus] = useState(
    state?.status ? state?.status : ["done", "doing", "confirm"]
  );
  const [dataCollaborator, setDataCollaborator] = useState();
  // console.log(state?.startDate, 'state?.startDate');
  const [defaultRangeTime, setDefaultRangeTime] = useState(
    state?.startDate ? [state?.startDate, state?.endDate] : "thirty_last"
  );
  const [orderStatus, setOrderStatus] = useState({
    total_item: 0,
    total_order_confirm: 0,
    total_order_done: 0,
    total_order_doing: 0,
  });

  // useEffect(() => {
  //   if(date) {
  //     const startDate = moment(date, "DD-MM-YYYY").startOf("date").toISOString()
  //     const endDate = moment(date, "DD-MM-YYYY").endOf("date").toISOString()
  //     setStartDate(startDate)
  //     setEndDate(endDate)
  //   }
  // }, [])

  useEffect(() => {
    if (startDate !== "") {
      getDataDetailReportOrderByCollaborator();
    }
  }, [startDate, start, selectStatus]);

  useEffect(() => {
    getInfoCollaborator();
  }, []);

  const getInfoCollaborator = async () => {
    // console.log(id, 'id');
    const res = await getCollaboratorsById(id);
    setDataCollaborator(res);
  };

  const getDataDetailReportOrderByCollaborator = async () => {
    const res = await getReportDetailOrderByCollaborator(
      id,
      start,
      lengthPage,
      startDate,
      endDate,
      selectStatus
    );
    console.log("CHECK response", res);
    setData(res?.data);
    setTotal(res?.totalItem);
    setDataTotal(res?.total[0]);
    
    setOrderStatus({
      total_item: res?.total[0]?.total_item,
      total_order_confirm: res?.total[0]?.total_order_confirm,
      total_order_done: res?.total[0]?.total_order_done,
      total_order_doing: res?.total[0]?.total_order_doing,
    });
  };

  const HeaderInfo = ({ title, subValue, typeSubValue, textToolTip }) => {
    const content = <p>{textToolTip ? textToolTip : ""}</p>;
    if (subValue)
      subValue =
        typeSubValue === "money"
          ? formatMoney(subValue)
          : typeSubValue === "percent"
          ? subValue + " %"
          : subValue;
    if (title == "Giá vốn") subValue = "0 đ";
    return (
      <React.Fragment>
        <div className="header-table-custom">
          <div className="title-report">
            <p style={{ color: title === "Doanh thu" ? "#2463eb" : "none" }}>
              {title}
            </p>
            {textToolTip ? (
              <Popover
                content={content}
                placement="bottom"
                overlayInnerStyle={{
                  backgroundColor: "white",
                }}
              >
                <div>
                  <i
                    style={{
                      color: title === "Doanh thu" ? "#2463eb" : "none",
                    }}
                    class="uil uil-question-circle icon-question"
                  ></i>
                </div>
              </Popover>
            ) : (
              <></>
            )}
          </div>
          <div className="sub-value">
            {subValue ? (
              <p style={{ color: title === "Doanh thu" ? "#2463eb" : "none" }}>
                {subValue}
              </p>
            ) : (
              <div style={{ marginTop: "35px" }}></div>
            )}
          </div>
        </div>
      </React.Fragment>
    );
  };

  const columns = [
    {
      customTitle:
        typeDate === "date_work" ? (
          <HeaderInfo title="Ngày làm" />
        ) : (
          <HeaderInfo title="Ngày tạo" />
        ),
      dataIndex: typeDate === "date_work" ? "date_work" : "date_create",
      key: "date_hour",
      width: 100,
      fontSize: "text-size-M text-weight-500",
    },
    {
      customTitle: <HeaderInfo title="Mã đơn" />,
      dataIndex: "id_view",
      key: "text_link",
      width: 150,
      fontSize: "text-size-M text-color-black text-weight-500",
    },
    {
      customTitle: <HeaderInfo title="Trạng thái" />,
      dataIndex: "status",
      key: "status",
      width: 120,
      fontSize: "text-size-M text-weight-500",
    },
    {
      customTitle: (
        <HeaderInfo
          title="Tổng giá trị giao dịch"
          subValue={dataTotal?.total_gross_income}
          typeSubValue="money"
          textToolTip="GMV - Gross Merchandise Volume"
        />
      ),
      dataIndex: "total_gross_income",
      key: "money",
      width: 120,
      fontSize: "text-size-M text-weight-500",
    },
    {
      customTitle: (
        <HeaderInfo
          title="Thu hộ dịch vụ"
          subValue={dataTotal?.total_collabotator_fee}
          typeSubValue="money"
          textToolTip="Bao gồm phí dịch vụ trả cho CTV, tiền tip từ khách,…"
        />
      ),
      dataIndex: "total_collabotator_fee",
      key: "money",
      width: 120,
      fontSize: "text-size-M text-weight-500",
    },
    {
      customTitle: (
        <HeaderInfo
          title="Doanh thu"
          subValue={dataTotal?.total_income}
          typeSubValue="money"
          textToolTip=""
        />
      ),
      dataIndex: "total_income",
      key: "money",
      width: 120,
      fontSize: "text-size-M text-color-1 text-weight-500",
    },
    {
      customTitle: (
        <HeaderInfo
          title="Giảm giá"
          subValue={dataTotal?.total_discount}
          typeSubValue="money"
          textToolTip="Tổng số tiền giảm giá từ giảm giá dịch vụ, giảm giá đơn hàng, đồng giá, ctkm,…"
        />
      ),
      dataIndex: "total_discount",
      key: "money",
      width: 120,
      fontSize: "text-size-M text-weight-500",
    },

    {
      customTitle: (
        <HeaderInfo
          title="Doanh thu thuần"
          subValue={dataTotal?.total_net_income}
          typeSubValue="money"
          textToolTip="Số tiền thu được sau khi trừ toàn bộ các giảm giá. Doanh thu thuần = Doanh thu (-) Giảm giá."
        />
      ),
      dataIndex: "total_net_income",
      key: "money",
      width: 120,
      fontSize: "text-size-M text-weight-500",
    },
    {
      customTitle: (
        <HeaderInfo
          title="Tổng hoá đơn"
          subValue={dataTotal?.total_order_fee}
          typeSubValue="money"
          textToolTip="Tổng số tiền ghi nhận trên hoá đơn dịch vụ. Tổng hoá đơn = Tổng tiền - giảm giá."
        />
      ),
      dataIndex: "total_order_fee",
      key: "money",
      width: 120,
      fontSize: "text-size-M text-weight-500",
    },
    {
      customTitle: (
        <HeaderInfo
          title="Giá vốn"
          subValue={dataTotal?.punishss}
          typeSubValue="money"
        />
      ),
      dataIndex: "punishss",
      key: "money",
      width: 90,
      fontSize: "text-size-M text-weight-500",
    },
    {
      customTitle: (
        <HeaderInfo
          title="Thu nhập khác"
          subValue={dataTotal?.punish}
          typeSubValue="money"
          textToolTip="Bao gồm phí phạt trễ và huỷ ca"
        />
      ),
      dataIndex: "punish",
      key: "money",
      width: 120,
      fontSize: "text-size-M text-weight-500",
    },
    {
      customTitle: (
        <HeaderInfo
          title="Tổng lợi nhuận"
          subValue={dataTotal?.total_net_income_business}
          typeSubValue="money"
          textToolTip="Tổng lợi nhuận = Doanh thu thuần + thu nhập khác"
        />
      ),
      dataIndex: "total_net_income_business",
      key: "money",
      width: 120,
      fontSize: "text-size-M text-weight-500",
    },
    {
      customTitle: (
        <HeaderInfo
          title="% Lợi nhuận"
          subValue={dataTotal?.percent_income}
          typeSubValue="percent"
          textToolTip="% Lợi nhuận = Tổng lợi nhuận (/) Doanh thu."
        />
      ),
      dataIndex: "percent_income",
      key: "percent",
      width: 90,
      fontSize: "text-size-M text-weight-500",
    },
    {
      customTitle: (
        <HeaderInfo
          title="Phí áp dụng"
          subValue={dataTotal?.total_service_fee}
          typeSubValue="money"
        />
      ),
      title: "Phí áp dụng",
      dataIndex: "total_service_fee",
      key: "money",
      width: 120,
      fontSize: "text-size-M text-weight-500",
    },
  ];

  const onChange = useCallback(
    (page) => {
      // setIsLoading(true);
      setCurrentPage(page);
      const start = page * lengthPage - lengthPage;
      setStartPage(start);
      getReportOrder(start, lengthPage, startDate, endDate, "date_work")
        .then((res) => {
          setIsLoading(false);
          setData(res?.data);
          setTotal(res?.totalItem);
          setDataTotal(res?.total[0]);
        })
        .catch((err) => {
          setIsLoading(false);
        });
    },
    [data, startDate, endDate]
  );

  const onChangeDay = () => {
    setIsLoading(true);

    getReportOrder(startPage, 20, startDate, endDate, "date_work")
      .then((res) => {
        setIsLoading(false);
        setData(res?.data);
        setTotal(res?.totalItem);
        setDataTotal(res?.total[0]);
      })
      .catch((err) => {
        setIsLoading(false);
      });
  };

  const changeStatusOrder = (value) => {
    setSelectStatus(value);
  };

  return (
    <div className="div-container-content">
      <div className="div-flex-row">
        {/* <div className="div-header-container"> */}
        <div className="">
          <h4 className="title-cv">{`${i18n.t("order_report", {
            lng: lang,
          })}`}</h4>
        </div>
      </div>

      <div className="div-flex-row">
        <div className="div-info-collaborator mt-2">
          <Image
            src={dataCollaborator?.avatar}
            style={{ width: 100, height: 100, borderRadius: 4 }}
          />
          <div className="div-info-name">
            <div className="div-row-name">
              <p className="text-title-ctv">Tên:</p>{" "}
              <p className="text-name-ctv">{dataCollaborator?.full_name}</p>
            </div>
            <div className="div-row-name">
              <p className="text-title-ctv">Mã:</p>{" "}
              <p className="text-name-ctv">{dataCollaborator?.id_view}</p>
            </div>
            <div className="div-row-name">
              <p className="text-title-ctv">Sđt:</p>{" "}
              <p className="text-name-ctv">{dataCollaborator?.phone}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="div-flex-row">
        <div class="card">
          <img src="/static/media/add.1c86de41.png" class="img" />
          <div class="div-details">
            <a class="text-title">Tổng đơn hàng</a>
            <a class="text-detail">{orderStatus.total_item}</a>
          </div>
        </div>
        <div class="card">
          <img src="/static/media/add.1c86de41.png" class="img" />
          <div class="div-details">
            <a class="text-title">Đơn hoàn thành</a>
            <a class="text-detail">{orderStatus.total_order_done}</a>
          </div>
        </div>
        <div class="card">
          <img src="/static/media/add.1c86de41.png" class="img" />
          <div class="div-details">
            <a class="text-title">Đơn đang làm</a>
            <a class="text-detail">{orderStatus.total_order_doing}</a>
          </div>
        </div>
        <div class="card">
          <img src="/static/media/add.1c86de41.png" class="img" />
          <div class="div-details">
            <a class="text-title">Đơn đã nhận</a>
            <a class="text-detail">{orderStatus.total_order_confirm}</a>
          </div>
        </div>
      </div>

      <div className="div-flex-row-flex-start">
        <RangeDatePicker
          setStartDate={setStartDate}
          setEndDate={setEndDate}
          onCancel={() => {}}
          defaults={defaultRangeTime}
        />
        <div className="div-same">
          <p className="m-0 text-date-same">
            {moment(startDate).format("DD/MM/YYYY")}-
            {moment(endDate).format("DD/MM/YYYY")}
          </p>
        </div>
      </div>

      <div className="div-flex-row">
        <Select
          mode="multiple"
          defaultValue="all"
          onChange={changeStatusOrder}
          value={selectStatus}
          options={[
            { value: "done", label: "Hoàn thành" },
            { value: "doing", label: "Đang làm" },
            { value: "confirm", label: "Đã nhận" },
          ]}
        />
      </div>

      {/* <div className="div-flex-row">
        <div className="div-info-collaborator mt-2">
          <Image
            src={dataCollaborator?.avatar}
            style={{ width: 100, height: 100, borderRadius: 4 }}
          />
          <div className="div-info-name">
            <div className="div-row-name">
              <p className="text-title-ctv">Tên:</p>{" "}
              <p className="text-name-ctv">{dataCollaborator?.full_name}</p>
            </div>
            <div className="div-row-name">
              <p className="text-title-ctv">Mã:</p>{" "}
              <p className="text-name-ctv">{dataCollaborator?.id_view}</p>
            </div>
            <div className="div-row-name">
              <p className="text-title-ctv">Sđt:</p>{" "}
              <p className="text-name-ctv">{dataCollaborator?.phone}</p>
            </div>
          </div>
        </div>
      </div> */}

      <div>
        <DataTable
          columns={columns}
          data={data}
          // actionColumn={addActionColumn}
          start={startPage}
          pageSize={lengthPage}
          totalItem={total}
          // detectLoading={detectLoading}
          // getItemRow={setItem}
          onCurrentPageChange={setStart}
        />
      </div>
    </div>
  );
};

export default DetailReportOrderByCollaborator;
