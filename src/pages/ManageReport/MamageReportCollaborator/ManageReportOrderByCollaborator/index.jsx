import "./index.scss";
import React, { useEffect, useState } from "react";
import RangeDatePicker from "../../../../components/datePicker/RangeDatePicker";
import DataTable from "../../../../components/tables/dataTable";
import { formatMoney } from "../../../../helper/formatMoney";
import { Popover, Select } from "antd";
import moment from "moment";
import { getReportOrderByCollaborator } from "../../../../api/report";

const ManageReportOrderByCollaborator = () => {
  const [startPage, setStartPage] = useState(0);
  const [data, setData] = useState([]);
  const [total, setTotal] = useState([]);
  const [start, setStart] = useState(0);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [dataTotal, setDataTotal] = useState({});
  const [selectStatus, setSelectStatus] = useState(["done"]);
  const [detectLoading, setDetectLoading] = useState(null);
  // const [length, setLength] = useState(100)
  const [lengthPage, setLengthPage] = useState(
    JSON.parse(localStorage.getItem("linePerPage"))
      ? JSON.parse(localStorage.getItem("linePerPage")).value
      : 20
  );

  useEffect(() => {
    if (startDate !== "") {
      setDetectLoading(startDate + start);
      getDataReportOrderByCollaborator();
    }
  }, [startDate, start, lengthPage]);

  useEffect(() => {
    if (startDate !== "") {
      setDetectLoading(selectStatus);
      setStart(0);
      getDataReportOrderByCollaborator();
    }
  }, [selectStatus, lengthPage]);

  const getDataReportOrderByCollaborator = async () => {
    const res = await getReportOrderByCollaborator(
      start,
      lengthPage,
      startDate,
      endDate,
      selectStatus
    );
    for (let i = 0; i < res.data.length; i++) {
      res.data[i]["start_date"] = startDate;
      res.data[i]["end_date"] = endDate;
      res.data[i]["status"] = selectStatus;
    }
    setData(res?.data);
    setTotal(res?.totalItem);
    setDataTotal(res?.total[0]);
  };

  const CustomHeaderDatatable = ({
    title,
    subValue,
    typeSubValue,
    textToolTip,
  }) => {
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
      customTitle: <CustomHeaderDatatable title="CTV" />,
      dataIndex: "id_collaborator.full_name",
      key: "id_collaborator",
      width: 100,
      fontSize: "text-size-M text-weight-500",
    },
    {
      customTitle: (
        <CustomHeaderDatatable title="Số ĐH" subValue={dataTotal?.total_item} />
      ),
      dataIndex: "total_item",
      key: "number",
      width: 50,
      fontSize: "text-size-M text-weight-500",
    },
    {
      customTitle: (
        <CustomHeaderDatatable
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
        <CustomHeaderDatatable
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
        <CustomHeaderDatatable
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
        <CustomHeaderDatatable
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
        <CustomHeaderDatatable
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
        <CustomHeaderDatatable
          title="Tổng hoá đơn"
          subValue={dataTotal?.total_order_fee}
          typeSubValue="money"
          textToolTip="Tổng số tiền ghi nhận trên hoá đơn dịch vụ. Tổng hoá đơn = Tổng tiền (-) giảm giá."
        />
      ),
      dataIndex: "total_order_fee",
      key: "money",
      width: 120,
      fontSize: "text-size-M text-weight-500",
    },
    {
      customTitle: (
        <CustomHeaderDatatable
          title="Giá vốn"
          subValue={dataTotal?.cost_price}
          typeSubValue="money"
        />
      ),
      dataIndex: "cost_price",
      key: "money",
      width: 120,
      fontSize: "text-size-M text-weight-500",
    },
    {
      customTitle: (
        <CustomHeaderDatatable
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
        <CustomHeaderDatatable
          title="Tổng lợi nhuận"
          subValue={dataTotal?.total_net_income_business}
          typeSubValue="money"
          textToolTip="Tổng lợi nhuận = Doanh thu thuần (+) thu nhập khác"
        />
      ),
      dataIndex: "total_net_income_business",
      key: "money",
      width: 120,
      fontSize: "text-size-M text-weight-500",
    },
    {
      customTitle: (
        <CustomHeaderDatatable
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
        <CustomHeaderDatatable
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

  const changeStatusOrder = (value) => {
    setSelectStatus(value);
  };

  return (
    <React.Fragment>
      <div className="div-container-content">
        <div className="div-flex-row">
          <div className="div-header-container">
            <h4 className="title-cv">Báo cáo đơn hàng theo ngày làm của CTV</h4>
          </div>
        </div>

        <div className="div-flex-row-flex-start">
          <div className="date-picker">
            <RangeDatePicker
              setStartDate={setStartDate}
              setEndDate={setEndDate}
              onCancel={() => {}}
              defaults={"thirty_last"}
            />
          </div>
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

        <div className="div-flex-row-start">
          <DataTable
            columns={columns}
            data={data}
            // actionColumn={addActionColumn}
            start={startPage}
            pageSize={lengthPage}
            setLengthPage={setLengthPage}
            totalItem={total}
            detectLoading={detectLoading}
            // getItemRow={setItem}
            onCurrentPageChange={setStart}
          />
        </div>
      </div>
    </React.Fragment>
  );
};

export default ManageReportOrderByCollaborator;
