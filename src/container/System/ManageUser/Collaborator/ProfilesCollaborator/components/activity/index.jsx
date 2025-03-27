import { Pagination, Table } from "antd";
import moment from "moment";
import { memo, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  getHistoryOrderCollaborator,
  getHistoryActivityCollaborator,
} from "../../../../../../../api/collaborator";
import { errorNotify } from "../../../../../../../helper/toast";
import useWindowDimensions from "../../../../../../../helper/useWindowDimensions";
import i18n from "../../../../../../../i18n";
import { loadingAction } from "../../../../../../../redux/actions/loading";
import {
  getLanguageState,
  getUser,
} from "../../../../../../../redux/selectors/auth";
import "./index.scss";
import FilterData from "../../../../../../../components/filterData";
import DataTable from "../../../../../../../components/tables/dataTable";
import CardInfo from "../../../../../../../components/card";
import CardTotalValue from "../../../../../../../components/card/cardTotalValue";

import CardBarChart from "../../../../../../../components/card/cardBarChart";

import icons from "../../../../../../../utils/icons";
import CardActivityLog from "../../../../../../../components/card/cardActivityLog";
import CustomHeaderDatatable from "../../../../../../../components/tables/tableHeader";
import ButtonCustom from "../../../../../../../components/button";
import { getService } from "../../../../../../../redux/selectors/service";

const {
  IoStatsChartOutline,
  IoCalendarNumberOutline,
  IoCubeOutline,
  IoPieChartOutline,
} = icons;

const Activity = ({ id }) => {
  const service = useSelector(getService);
  const user = useSelector(getUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const lang = useSelector(getLanguageState);
  const { width } = useWindowDimensions();
  const [startPageOrder, setStartPageOrder] = useState(0);
  const [startPageHistoryActivities, setStartPageHistoryActivities] =
    useState(0);
  const [lengthPage, setLengthPage] = useState(
    JSON.parse(localStorage.getItem("linePerPage"))
      ? JSON.parse(localStorage.getItem("linePerPage")).value
      : 20
  );
  /* ~~~ Value ~~~ */
  const [dataHistoryOrderCollaborator, setDataHistoryOrderCollaborator] =
    useState([]); // Dữ liệu của bảng hoạt động đơn hàng
  const [
    dataHistoryActivitiesCollaborator,
    setDataHistoryActivitiesCollaborator,
  ] = useState([]); // Dữ liệu của lịch sử hoạt động
  const [
    totalItemHistoryActivitiesCollaborator,
    setTotalItemHistoryActivitiesCollaborator,
  ] = useState(0);
  const [timePeriod, setTimePeriod] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [valueSelectStatus, setValueSelectStatus] = useState("confirm");
  const [valueSelectService, setValueSelectService] = useState("");
  const [valueSelectPaymentMethod, setValueSelectPaymentMethod] =
    useState("all");
  const [valueSelectTypeDate, setValueSelectTypeDate] = useState("date_work");

  /* ~~~ List ~~~ */

  const [valueActivityStatistics, setValueActivityStatistics] = useState([
    {
      label: "Tổng đơn đến nay",
      value: 0,
      icon: IoCubeOutline,
      color: "green",
    },
    {
      label: "Tổng đơn tháng này",
      value: 0,
      icon: IoCalendarNumberOutline,
      color: "red",
    },
    {
      label: "Tổng đơn năm trước",
      value: 0,
      icon: IoStatsChartOutline,
      color: "blue",
    },
    {
      label: "Tổng đơn năm nay",
      value: 0,
      icon: IoPieChartOutline,
      color: "yellow",
    },
  ]);

  const [listStatus, setListStatus] = useState([
    { code: "all", label: "Tất cả", total: 0 },
    // { code: "processing", label: "Chờ thanh toán", total: 0 },
    // { code: "pending", label: "Đang Chờ làm", total: 0 },
    { code: "confirm", label: "Đã nhận", total: 0 },
    { code: "doing", label: "Đang làm", total: 0 },
    { code: "done", label: "Hoàn thành", total: 0 },
    { code: "cancel", label: "Đã hủy", total: 0 },
  ]);

  // 2. Danh sách các loại dịch vụ
  const listService = [{ code: "", label: "Tất cả" }];
  service.forEach((item) => {
    if (user?.id_service_manager?.length === 0) {
      listService.push({
        code: item?._id,
        label: item?.title?.[lang],
      });
      return;
    } else {
      user?.id_service_manager?.forEach((i) => {
        if (item?._id === i?._id) {
          listService.push({
            code: item?._id,
            label: item?.title?.[lang],
          });
          return;
        }
      });
    }
  });

  // Danh sách các phương thức thanh toán
  const listPaymentMethod = [
    { code: "all", label: "Tất cả" },
    { code: "cash", label: "Tiền mặt" },
    { code: "point", label: "Ví G-pay" },
    { code: "momo", label: "Momo" },
    { code: "vnpay", label: "VNPAY-QR" },
    { code: "vnbank", label: "VNPAY-ATM" },
    { code: "intcard", label: "Thẻ quốc tế" },
  ];

  // Danh sách các loại ngày sắp xếp
  const listTypeDate = [
    { code: "date_work", label: "Ngày làm" },
    { code: "date_create", label: "Ngày tạo" },
  ];

  // 1. Danh sách các cột trong bảng
  const columns = [
    {
      customTitle: <CustomHeaderDatatable title="STT" position="center"/>,
      dataIndex: "",
      key: "case_numbering",
      width: 30,
    },
    {
      customTitle: <CustomHeaderDatatable title="Mã đơn" />,
      key: "case_code_order",
      width: 60,
    },
    {
      customTitle: <CustomHeaderDatatable title="Ngày tạo" />,
      dataIndex: "date_create",
      key: "case_date-create-day",
      width: 50,
    },
    {
      customTitle: <CustomHeaderDatatable title="Khách hàng" />,
      dataIndex: "customer_name_phone",
      key: "case_customer_name_phone",
      width: 55,
    },
    {
      customTitle: <CustomHeaderDatatable title="Dịch vụ" />,
      key: "case_service",
      width: 50,
    },

    {
      customTitle: <CustomHeaderDatatable title="Ngày làm" />,
      dataIndex: "date_work",
      key: "case_date-work-day",
      width: 50,
    },
    {
      customTitle: <CustomHeaderDatatable title="Địa chỉ" />,
      dataIndex: "address",
      key: "case_text",
      width: 170,
    },
    {
      customTitle: <CustomHeaderDatatable title="Trạng thái" position="center" />,
      key: "case_status",
      width: 50,
    },
    {
      customTitle: <CustomHeaderDatatable title="Thanh Toán" position="right" />,
      key: "case_payment-method",
      width: 50,
    },

  ];
  // 2. Danh sách đơn hàng thống kê theo tháng
  const orderDataStatistic = [
    {
      name: "Thg 1",
      value: 4,
    },
    {
      name: "Thg 2",
      value: 5,
    },
    {
      name: "Thg 3",
      value: 6,
    },
    {
      name: "Thg 4",
      value: 7,
    },
    {
      name: "Thg 5",
      value: 1,
    },
    {
      name: "Thg 6",
      value: 7,
    },
    {
      name: "Thg 7",
      value: 7,
    },
    {
      name: "Thg 8",
      value: 9,
    },
    {
      name: "Thg 9",
      value: 11,
    },
    {
      name: "Thg 10",
      value: 5,
    },
    {
      name: "Thg 11",
      value: 13,
    },
    {
      name: "Thg 12",
      value: 1,
    },
  ];
  /* ~~~ Handle function ~~~ */
  // 1. Hàm xử lý khi chuyển trang bảng lịch sử đơn hàng
  const onChangePageOrder = (value) => {
    setStartPageOrder(value);
  };
  // 2. Hàm xử lý khi chuyển trang lịch sử hoạt động
  const onChangePageHistoryActivity = (value) => {
    setStartPageHistoryActivities(value);
  };
  // 3. Hàm fetch dữ liệu đơn hàng của đối tác
  const fetchHistoryOrderCollaborator = async (
    id,
    start,
    length,
    service,
    payment_method,
    status,
    type_date
  ) => {
    try {
      dispatch(loadingAction.loadingRequest(true));
      const res = await getHistoryOrderCollaborator(
        id,
        start,
        length,
        service,
        payment_method,
        status,
        type_date
      );
      setDataHistoryOrderCollaborator(res);
      dispatch(loadingAction.loadingRequest(false));
    } catch (err) {
      errorNotify({
        message: err?.message || err,
      });
    }
  };
  // 4. Hàm fetch dữ liệu lịch sử hoạt động (lịch sử hoạt động là phần tử cha của lịch sử trạng thái)
  const fetchHistoryActivitiesCollaborator = async (id, start, length) => {
    try {
      dispatch(loadingAction.loadingRequest(true));
      const res = await getHistoryActivityCollaborator(id, start, length);
      setDataHistoryActivitiesCollaborator((prev) => [...prev, ...res?.data]);
      setTotalItemHistoryActivitiesCollaborator(res?.totalItem)
      dispatch(loadingAction.loadingRequest(false));
    } catch (err) {
      errorNotify({
        message: err?.message || err,
      });
    }
  };
  /* ~~~ Use effect ~~~ */
  // 1. Fetch giá trị lịch sử đơn hàng của đối tác
  useEffect(() => {
    fetchHistoryOrderCollaborator(
      id,
      startPageOrder,
      lengthPage,
      valueSelectService,
      valueSelectPaymentMethod,
      valueSelectStatus,
      valueSelectTypeDate
    );
  }, [
    id,
    startPageOrder,
    lengthPage,
    valueSelectService,
    valueSelectPaymentMethod,
    valueSelectStatus,
    valueSelectTypeDate,
  ]);
  // 2. Fetch giá trị lịch sử hoạt động của đối tác
  useEffect(() => {
   
    fetchHistoryActivitiesCollaborator(
      id,
      startPageHistoryActivities,
      lengthPage
    );
  }, [id, dispatch, startPageHistoryActivities, lengthPage]);

  const filterByStatus = () => {
    return (
      <div className="manage-order__filter-content">
        {listStatus?.map((el) => (
          <div
            onClick={() => setValueSelectStatus(el.code)}
            className={`manage-order__filter-content--tab ${
              valueSelectStatus === el.code && "selected"
            }`}
          >
            <span className="manage-order__filter-content--tab-label">
              {el?.label}
            </span>
            <span className="manage-order__filter-content--tab-number">
              {el?.total}
            </span>
          </div>
        ))}
      </div>
    );
  };

  const filterContentRight = () => {
    return (
      <div className="manage-order__filter-content">
        <div>
          <ButtonCustom
            label="Dịch vụ"
            options={listService}
            value={valueSelectService}
            setValueSelectedProps={setValueSelectService}
          />
        </div>
        <div>
          <ButtonCustom
            label="Phương thức thanh toán"
            options={listPaymentMethod}
            value={valueSelectPaymentMethod}
            setValueSelectedProps={setValueSelectPaymentMethod}
          />
        </div>
        <div>
          <ButtonCustom
            label="Sắp xếp theo"
            options={listTypeDate}
            value={valueSelectTypeDate}
            setValueSelectedProps={setValueSelectTypeDate}
          />
        </div>
      </div>
    );
  };

  /* ~~~ Main ~~~ */
  return (
    <div className="collaborator-activity">
      {/* Các thẻ thống kê (hiện tại đang ẩn đi chừng nào viết xong api thì mở ra và truyền dữ liệu vào) */}
      {/* <div className="collaborator-activity__statistics">
        <div className="collaborator-activity__statistics--overview grid-column-2">
          {valueActivityStatistics.map((item, index) => {
            return (
              <CardInfo
                cardContent={
                  <CardTotalValue
                    label={item.label}
                    total={item.value}
                    previousCompare="0"
                    IconComponent={item.icon}
                    color={item.color}
                  />
                }
              />
            );
          })}
        </div>
        <div className="collaborator-activity__statistics--chart">
          <CardInfo
            cardHeader="Thống kê đơn hàng"
            cardContent={
              <CardBarChart
                data={orderDataStatistic}
                height={220}
                verticalValue="value"
                // verticalLine={true}
                horizontalValue="name"
                horizontalLine={true}
                chartUnit="đơn hàng"
                total={20}
                color="#bbf7d0"
                colorTotal="#22c55e"
              />
            }
            supportIcon={true}
          />
        </div>
      </div> */}
      {/* Lịch sử đơn hàng và Lịch sử hoạt động */}
      <div className="collaborator-activity__history">
        <FilterData
          leftContent={filterByStatus()}
          rightContent={filterContentRight()}
        />
        <div className="collaborator-activity__history--order">
          <DataTable
            columns={columns}
            data={dataHistoryOrderCollaborator?.data || []}
            start={startPageOrder}
            pageSize={lengthPage}
            setLengthPage={setLengthPage}
            totalItem={dataHistoryOrderCollaborator?.totalItem || 0}
            onCurrentPageChange={onChangePageOrder}
            // headerRightContent={
            //   <div className="manage-order__search">
            //     <div className="manage-order__search-field">
            //       <InputTextCustom
            //         type="text"
            //         placeHolderNormal="Tìm kiếm"
            //         onChange={(e) => {
            //           handleSearch(e.target.value);
            //         }}
            //       />
            //     </div>
            //   </div>
            // }
          />
        </div>
        {/* Lịch sử đơn hàng */}
        <div className="collaborator-activity__history--activities">
          <div className="collaborator-activity__history--activities-activity">
            <CardInfo
              cardHeader="Lịch sử hoạt động"
              cardContent={
                <CardActivityLog
                  data={dataHistoryActivitiesCollaborator}
                  totalItem={totalItemHistoryActivitiesCollaborator}
                  dateIndex="date_create"
                  statusIndex="type"
                  pageSize={lengthPage}
                  setLengthPage={setLengthPage}
                  onCurrentPageChange={onChangePageHistoryActivity}
                  pagination={true}
                />
              }
            />
          </div>
          {/* Thẻ lịch sử nhận điểm thưởng và lịch sử nhận phạt (ẩn đi vừa tính năng đang tạm dừng) */}
          {/* <div className="collaborator-activity__history--activities-activity">
            <CardInfo
              cardHeader="Lịch sử khen thưởng"
              cardContent={
                <CardActivityLog
                  data={dataHistoryActivitiesCollaborator}
                  totalItem={totalItemHistoryActivitiesCollaborator}
                  dateIndex="date_create"
                  statusIndex="type"
                  pageSize={lengthPage}
                  setLengthPage={setLengthPage}
                  onCurrentPageChange={onChangePageHistoryActivity}
                  pagination={true}
                  type="reward"
                />
              }
            />
          </div>
          <div className="collaborator-activity__history--activities-activity">
            <CardInfo
              cardHeader="Lịch sử phạt"
              cardContent={
                <CardActivityLog
                  data={dataHistoryActivitiesCollaborator}
                  totalItem={totalItemHistoryActivitiesCollaborator}
                  dateIndex="date_create"
                  statusIndex="type"
                  pageSize={lengthPage}
                  setLengthPage={setLengthPage}
                  onCurrentPageChange={onChangePageHistoryActivity}
                  pagination={true}
                  type="punish"
                />
              }
            />
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default memo(Activity);
