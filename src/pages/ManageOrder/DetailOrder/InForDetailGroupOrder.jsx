import { useDispatch, useSelector } from "react-redux";
import {
  getElementState,
  getLanguageState,
} from "../../../redux/selectors/auth";
import { loadingAction } from "../../../redux/actions/loading";
import { errorNotify } from "../../../helper/toast";
import { useEffect, useState } from "react";
import { getOrderByGroupOrderApi } from "../../../api/order";
import { getFavoriteAndBlockByCustomers } from "../../../api/customer";
import CustomerInfo from "../components/OrderComponents/CustomerInfo";
import { CalendarOutlined, CalendarTwoTone } from "@ant-design/icons";
import { UilCalender, UilClock } from "@iconscout/react-unicons";
import CollaboratorInfo from "../components/OrderComponents/CollaboratorInfo";
import InfoBill from "../components/OrderComponents/InfoBill";
import DetailBill from "../components/OrderComponents/DetailBill";
import { Dropdown, Input, Space } from "antd";
import DataTable from "../../../components/tables/dataTable";
import { UilEllipsisV } from "@iconscout/react-unicons";
import i18n from "../../../i18n";
import { Link } from "react-router-dom";
import EditTimeOrder from "../EditTimeGroupOrder";
import AddCollaboratorOrder from "../DrawerAddCollaboratorToOrder/index";
import { format } from "date-fns";
import { arrDaysVN } from "../../../constants";
import ItemInfoBill from "./ItemInfoBill";
const { TextArea } = Input;
const InForDetailGroupOrder = (props) => {
  const { id } = props;
  const lang = useSelector(getLanguageState);
  const checkElement = useSelector(getElementState);
  const dispatch = useDispatch();
  const [dataGroup, setDataGroup] = useState();
  const [dataList, setDataList] = useState([]);
  const [customer, setCustomer] = useState();
  const [collaborator, setCollaborator] = useState();
  const [data, setData] = useState([]);
  const [startPage, setStartPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [item, setItem] = useState({ date_work: "" });
  const [detectLoading, setDetectLoading] = useState(false);
  const [dateCreate, setDateCreate] = useState({
    day: "?? ??:??:????",
    time: "??:??",
    title: "??",
  });
  const [statusGroupOrder, setStatusGroupOrder] = useState({
    status: "pending",
    title: "Đang tìm kiếm",
  });
  const [isLock, setIsLock] = useState(false);
  const [isFavourite, setIsFavourite] = useState(false);
  const toggle = () => {
    console.log("asjkiuldgajklsgd");
  };
  const onChangePage = (value) => {
    setStartPage(value);
  };

  useEffect(() => {
    getData();
  }, [id]);
  useEffect(() => {
    if (dataGroup) {
      const _date_create = new Date(dataGroup?.date_create);
      const _day = format(_date_create, "dd/MM/yyyy");
      const _time = format(_date_create, "HH:mm");
      const _title = arrDaysVN.filter(
        (day) => day.id === _date_create.getDay()
      );
      setDateCreate({
        day: _day,
        time: _time,
        title: _title[0].title,
      });
      if (dataGroup.status === "confirm") {
        setStatusGroupOrder({
          status: "confirm",
          title: "Đã nhận",
        });
      } else if (dataGroup.status === "doing") {
        setStatusGroupOrder({
          status: "doing",
          title: "Đang làm",
        });
      } else if (dataGroup.status === "done") {
        setStatusGroupOrder({
          status: "done",
          title: "Hoàn thành",
        });
      } else if (dataGroup.status === "cancel") {
        setStatusGroupOrder({
          status: "cancel",
          title: "Đã huỷ",
        });
      }
    }
  }, [dataGroup]);

  const getData = () => {
    setDetectLoading(true);
    getOrderByGroupOrderApi(id, lang)
      .then((res) => {
        console.log("ré ", res);
        setDataGroup(res?.data?.groupOrder);
        setDataList(res?.data?.listOrder);
        setCustomer(res?.data?.groupOrder?.id_customer);
        setCollaborator(res?.data?.groupOrder?.id_collaborator);
        setDetectLoading(false);
        //  xử lý thêm phần ctv đó có phải ctv yêu thích hay hạn chế không
        // dựa theo mảng yêu thích và mảng hạn chế
      })
      .catch((err) => {
        errorNotify({
          message: err,
        });
        dispatch(loadingAction.loadingRequest(false));
      });
  };
  const OrderNote = ({ title }) => {
    return (
      <div className="box-common">
        <h6>{title}</h6>
        <TextArea rows={4} placeholder="Nhập ghi chú cho CTV" />
      </div>
    );
  };
  let items = [
    {
      key: "1",
      label: checkElement?.includes("detail_guvi_job") && (
        <Link to={`/details-order/${item?.id_group_order}`}>
          <p style={{ margin: 0 }}>{`${i18n.t("see_more", {
            lng: lang,
          })}`}</p>
        </Link>
      ),
    },
    {
      key: "2",
      label: checkElement?.includes("add_collaborator_guvi_job") &&
        (item?.status === "pending" || item?.status === "confirm") && (
          <AddCollaboratorOrder
            idOrder={item?._id}
            idCustomer={item?.id_customer?._id}
            status={item?.status}
            // type={tab}
            // kind={kind}
            startPage={startPage}
            setData={setData}
            setTotal={setTotal}
            // setIsLoading={setIsLoading}
          />
        ),
    },
    {
      key: "3",
      label: checkElement?.includes("edit_guvi_job") &&
        item?.status !== "done" &&
        item?.status !== "cancel" &&
        item?.status !== "doing" && (
          <EditTimeOrder
            idOrder={item?._id}
            dateWork={item?.date_work}
            code={item?.code_promotion ? item?.code_promotion?.code : ""}
            // status={tab}
            // kind={kind}
            startPage={startPage}
            setData={setData}
            setTotal={setTotal}
            // setIsLoading={setIsLoading}
            details={false}
            estimate={item?.total_estimate}
            // valueSearch={valueSearch}
            // type={type}
            // startDate={startDate}
            // endDate={endDate}
          />
        ),
    },
    {
      key: "4",
      label: checkElement?.includes("delete_order_guvi_job") && (
        <p className="m-0" onClick={toggle}>{`${i18n.t("delete", {
          lng: lang,
        })}`}</p>
      ),
    },
  ];

  items = items.filter((x) => x.label !== false);
  const addActionColumn = {
    i18n_title: "",
    dataIndex: "action",
    key: "action",
    fixed: "right",
    width: 40,
    render: () => (
      <Space size="middle">
        <Dropdown menu={{ items }} trigger={["click"]}>
          <a>
            <UilEllipsisV />
          </a>
        </Dropdown>
      </Space>
    ),
  };
  const columns = [
    {
      i18n_title: "code_order",
      dataIndex: "id_view",
      key: "code_order",
      width: 140,
      fontSize: "text-size-M",
    },
    // {
    //   i18n_title: "date_create",
    //   dataIndex: "date_create",
    //   key: "date_create",
    //   width: 100,
    //   fontSize: "text-size-M",
    // },
    {
      i18n_title: "customer",
      dataIndex: "customer",
      key: "customer-name-phone",
      width: 140,
      fontSize: "text-size-M",
    },
    {
      i18n_title: "service",
      dataIndex: "service._id.title.vi",
      key: "service",
      width: 130,
      fontSize: "text-size-M",
    },
    {
      i18n_title: "date_work",
      dataIndex: "date_work",
      key: "date_work",
      width: 100,
      fontSize: "text-size-M",
    },
    {
      i18n_title: "address",
      dataIndex: "address",
      key: "address",
      width: 220,
      fontSize: "text-size-M",
    },
    {
      i18n_title: "collaborator",
      dataIndex: "collaborator",
      key: "collaborator",
      width: 160,
      fontSize: "text-size-M",
    },
    {
      i18n_title: "status",
      dataIndex: "status",
      key: "status",
      width: 120,
      fontSize: "text-size-M",
    },
    {
      i18n_title: "pay",
      dataIndex: "pay",
      key: "pay",
      width: 90,
      fontSize: "text-size-M",
    },
  ];
  const handleFavourite = () => {};
  const handleLock = () => {};
  return (
    <div className="info-detail-order_container ">
      <div className="info-detail-order_header">
        <div className="info-detail-order_header-idview">
          <p>Mã đơn hàng</p>
          <p className="fw-500">{dataGroup?.id_view}</p>
        </div>
        <div className="info-detail-order_header-date-create">
          <div>
            <div className="info-detail-order_header-date">
              <p>{`${dateCreate.title}   ${dateCreate.day}`}</p>
              <UilCalender />
            </div>
            <div className="info-detail-order_header-hour">
              <p>{dateCreate.time}</p>
              <UilClock />
            </div>
          </div>
          <p className={`info-detail-order_status-${statusGroupOrder.status}`}>
            {statusGroupOrder.title}
          </p>
        </div>
      </div>
      <br />
      <div className="info-detail-order_detail">
        <CustomerInfo
          email={customer?.email}
          full_name={customer?.full_name}
          phone={customer?.phone}
          rank_point={1500}
          avatar={customer?.avatar}
        />
        {dataGroup?.id_collaborator && (
          <CollaboratorInfo
            full_name={collaborator?.full_name}
            phone={collaborator?.phone}
            avatar={collaborator?.avatar}
            birthday={collaborator?.birthday}
            star={collaborator?.star}
            handleFavourite={handleFavourite}
            handleLock={handleLock}
            isFavourite={isFavourite}
            isLock={isLock}
          />
        )}
        <ItemInfoBill
          address={dataGroup?.address}
          date_work={dataList.length > 0 && dataList[0]?.date_work}
          end_date_work={dataList.length > 0 && dataList[0]?.end_date_work}
          type_address_work={dataGroup?.type_address_work}
        />
        <CustomerInfo />
      </div>
      <br />
      <div className="info-detail-order_container-info-bill">
        <InfoBill />
        <DetailBill />
        <></>
      </div>
      <br />
      <div className="info-detail-order_container-note">
        <OrderNote title="Ghi chú nội bộ" />
        <OrderNote title="Ghi chú của khách KH" />
      </div>
      <br />
      {dataList.length > 0 && (
        <DataTable
          columns={columns}
          data={dataList}
          actionColumn={addActionColumn}
          start={startPage}
          pageSize={20}
          totalItem={total}
          getItemRow={setItem}
          onCurrentPageChange={onChangePage}
          detectLoading={detectLoading}
        />
      )}
    </div>
  );
};
export default InForDetailGroupOrder;
