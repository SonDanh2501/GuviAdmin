import { useDispatch, useSelector } from "react-redux";
import {
  getElementState,
  getLanguageState,
} from "../../../redux/selectors/auth";
import { loadingAction } from "../../../redux/actions/loading";
import { errorNotify } from "../../../helper/toast";
import { useEffect, useState } from "react";
import {
  changeStatusOrderApi,
  getOrderByGroupOrderApi,
} from "../../../api/order";
import {
  blockCustomerApi,
  favouriteCustomerApi,
  unblockCustomerApi,
  unfavouriteCustomerApi,
} from "../../../api/customer";
import CustomerInfo from "../components/OrderComponents/CustomerInfo";
import { UilCalender, UilClock } from "@iconscout/react-unicons";
import CollaboratorInfo from "../components/OrderComponents/CollaboratorInfo";
import InfoBill from "../components/OrderComponents/InfoBill";
import DetailBill from "../components/OrderComponents/DetailBill";
import { Dropdown, FloatButton, Input, Space } from "antd";
import DataTable from "../../../components/tables/dataTable";
import { UilEllipsisV } from "@iconscout/react-unicons";
import i18n from "../../../i18n";
import { Link } from "react-router-dom";
import EditTimeOrder from "../EditTimeGroupOrder";
import AddCollaboratorOrder from "../DrawerAddCollaboratorToOrder/index";
import { format } from "date-fns";
import { arrDaysVN } from "../../../constants";
import ItemInfoBill from "./ItemInfoBill";
import ModalCustom from "../../../components/modalCustom";
import moment from "moment";
import { getListReasonCancel } from "../../../api/reasons";
import InputCustom from "../../../components/textInputCustom";
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
  const [titleService, setTitleService] = useState("");
  const [infoBill, setInfoBill] = useState();
  const [serviceFee, setServiceFee] = useState(0);
  const [modalFavourite, setModalFavourite] = useState(false);
  const [modalLock, setModalLock] = useState(false);
  const [isChangeCollaborator, setIsChangeCollaborator] = useState(false);
  const [modalCancel, setModalCancel] = useState(false);
  const [isOpenModalCancel, setIsOpenModalCancel] = useState(false);
  const [isOpenModalChangeStatus, setIsOpenModalChangeStatus] = useState(false);
  const [columns, setColumns] = useState(base_columns);
  const [dataReason, setDataReason] = useState();
  const [idReason, setIdReason] = useState("");
  const [noteReason, setNoteReason] = useState("");
  const [isOpenCancelGroupOrder, setIsOpenCancelGroupOrder] = useState(false);
  const toggle = () => {
    console.log("asjkiuldgajklsgd");
  };
  const onChangePage = (value) => {
    setStartPage(value);
  };
  useEffect(() => {
    getListReasonCancel("vi")
      .then((res) => {
        const _reason_option = [];
        res?.data?.map((item) => {
          _reason_option.push({
            value: item?._id,
            label: item?.title?.["vi"],
          });
        });
        setDataReason(_reason_option);
      })
      .catch((err) => {});
  }, []);
  // console.log("data reason ", dataReason);
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
      setInfoBill({
        info: dataGroup,
        date_work_schedule: dataGroup?.date_work_schedule,
      });
      setCustomer(dataGroup?.id_customer);
      setCollaborator(dataGroup?.id_collaborator);
      setTitleService(dataGroup?.service?._id?.title?.vi);
      const arrFavourite = dataGroup?.id_customer?.id_favourite_collaborator;
      const arrLock = dataGroup?.id_customer?.id_block_collaborator;
      if (arrFavourite.includes(dataGroup?.id_collaborator?._id)) {
        setIsFavourite(true);
      } else {
        setIsFavourite(false);
      }
      if (arrLock.includes(dataGroup?.id_collaborator?._id)) {
        setIsLock(true);
      } else {
        setIsLock(false);
      }
      let _service_fee = 0;
      dataGroup?.service_fee?.map((item) => {
        _service_fee += item?.fee;
      });
      setServiceFee(_service_fee);
      if (dataGroup?.status === "confirm") {
        setIsChangeCollaborator(true);
      }
      if (dataGroup?.status === "done" || dataGroup?.status === "cancel") {
        setColumns(base_columns.slice(0, base_columns.length - 2));
      }
      if (dataGroup?.date_work_schedule?.length > 1) {
        if (
          dataGroup.status === "pending" ||
          dataGroup.status === "confirm" ||
          dataGroup.status === "doing"
        ) {
          setIsOpenCancelGroupOrder(true);
        }
      }
    }
  }, [dataGroup]);
  // console.log("info dataList  ", dataList);
  const getData = () => {
    setDetectLoading(true);
    getOrderByGroupOrderApi(id, lang)
      .then((res) => {
        setDataGroup(res?.data?.groupOrder);
        setDataList(res?.data?.listOrder);
        setDetectLoading(false);
      })
      .catch((err) => {
        errorNotify({
          message: err,
        });
        dispatch(loadingAction.loadingRequest(false));
      });
  };
  const OrderNote = ({ title, value, disabled = true }) => {
    return (
      <div className="box-common">
        <h6>{title}</h6>
        <TextArea
          style={{ color: "black" }}
          disabled={disabled}
          rows={4}
          value={value}
        />
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

  const handleFavourite = () => {
    setModalFavourite(!modalFavourite);
    if (isFavourite) {
      unfavouriteCustomerApi(customer?._id, collaborator?._id)
        .then((res) => {
          getData();
        })
        .catch((err) => {});
    } else {
      favouriteCustomerApi(customer?._id, collaborator?._id)
        .then((res) => {
          getData();
        })
        .catch((err) => {});
    }
  };
  const openModalFavourite = () => {
    setModalFavourite(!modalFavourite);
  };
  const openModalLock = () => {
    setModalLock(!modalLock);
  };
  const openModalCancel = () => {
    setModalCancel(!modalCancel);
  };
  const openModalChangeStatus = () => {};
  const handleLock = () => {
    setModalLock(!modalLock);
    if (isLock) {
      unblockCustomerApi(customer?._id, collaborator?._id)
        .then((res) => {
          getData();
        })
        .catch((err) => {});
    } else {
      blockCustomerApi(customer?._id, collaborator?._id)
        .then((res) => {
          getData();
        })
        .catch((err) => {});
    }
  };
  const handleChangeCollaborator = () => {
    console.log("change ");
  };
  const handleCancelGroupOrder = () => {
    console.log("handleCancel ");
    setModalCancel(false);
  };
  const handleCancelOrder = () => {
    if (idReason && idReason !== "") {
      onChangeStatus(item?._id, {
        status: "cancel",
        id_reason_cancel: idReason,
        note_admin: noteReason,
      });
    }
    errorNotify({
      message: "Chưa chọn lý do huỷ việc",
    });
    setIsOpenModalCancel(false);
  };

  const onChangeStatus = (_id, data) => {
    dispatch(loadingAction.loadingRequest(true));
    changeStatusOrderApi(_id, data)
      .then((res) => {
        getData();
        dispatch(loadingAction.loadingRequest(false));
      })
      .catch((err) => {
        errorNotify({
          message: err,
        });
        dispatch(loadingAction.loadingRequest(false));
      });
  };
  const handleChangeStatus = () => {
    onChangeStatus(item?._id, { status: "next" });
    setIsOpenModalChangeStatus(false);
  };
  return (
    <div className="info-detail-order_container ">
      {true && dataGroup && (
        <EditTimeOrder
          idOrder={dataGroup?.id_order[0]}
          dateWork={dataGroup?.date_work_schedule[0].date}
          code={
            dataGroup?.code_promotion ? dataGroup?.code_promotion?.code : ""
          }
          setIsLoading={true}
          idDetail={dataGroup?._id}
          setDataGroup={setDataGroup}
          setDataList={setDataList}
          details={true}
        />
      )}
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
      <div className="info-detail-order_detail">
        <CustomerInfo
          email={customer?.email}
          full_name={customer?.full_name}
          phone={customer?.phone}
          rank_point={1500}
          avatar={customer?.avatar}
        />
        {dataGroup?.id_collaborator ? (
          <CollaboratorInfo
            full_name={collaborator?.full_name}
            phone={collaborator?.phone}
            avatar={collaborator?.avatar}
            birthday={collaborator?.birthday}
            star={collaborator?.star}
            handleFavourite={openModalFavourite}
            handleLock={openModalLock}
            isFavourite={isFavourite}
            isLock={isLock}
            // isChangeCollaborator={isChangeCollaborator}
            // handleChangeCollaborator={handleChangeCollaborator}
          />
        ) : (
          <CollaboratorInfo />
        )}
        <ItemInfoBill
          address={dataGroup?.address}
          date_work={dataList.length > 0 && dataList[0]?.date_work}
          end_date_work={dataList.length > 0 && dataList[0]?.end_date_work}
          type_address_work={dataGroup?.type_address_work}
          title="Thông tin nơi làm"
          avatar={address}
        />
      </div>
      <div className="info-detail-order_container-info-bill">
        <InfoBill
          title="Chi tiết đơn hàng"
          data={infoBill}
          handleCancel={isOpenCancelGroupOrder && openModalCancel}
        />
        <DetailBill
          code_promotion={dataGroup?.code_promotion}
          event_promotion={dataGroup?.event_promotion}
          tip_collaborator={dataGroup?.tip_collaborator}
          service_fee={serviceFee}
          total_fee={
            dataGroup?.initial_fee + serviceFee + dataGroup?.tip_collaborator
          }
          final_fee={dataGroup?.final_fee}
          initial_fee={dataGroup?.initial_fee}
          total_date_work={dataGroup?.date_work_schedule.length}
        />
      </div>
      <div className="info-detail-order_container-note">
        <OrderNote title="Ghi chú nội bộ" />
        <OrderNote title="Ghi chú của khách KH" value={dataGroup?.note} />
      </div>
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
          setOpenModalCancel={setIsOpenModalCancel}
          setOpenModalChangeStatus={setIsOpenModalChangeStatus}
        />
      )}
      <FloatButton.BackTop />
      <ModalCustom
        isOpen={modalFavourite}
        title={isFavourite ? "Bỏ yêu cộng tác viên" : "Yêu thích công tác viên"}
        handleOk={handleFavourite}
        textOk={isFavourite ? "Bỏ yêu thích" : "Yêu thích"}
        handleCancel={() => setModalFavourite(false)}
        body={
          <p>
            {isFavourite
              ? `Bạn có chắc muốn loại bỏ ctv ${collaborator?.full_name} ra khỏi danh sách yêu thích của khách hàng ${collaborator?.full_name}`
              : `Bạn có chắc muốn thêm ctv ${collaborator?.full_name} vào danh sách ctv yêu thích của khách hàng ${collaborator?.full_name}`}
          </p>
        }
      />
      <ModalCustom
        isOpen={modalLock}
        title={isLock ? "Bỏ chặn cộng tác viên" : "Chặn công tác viên"}
        handleOk={handleLock}
        textOk={isLock ? "Bỏ hạn chế" : "Hạn chế"}
        handleCancel={() => setModalLock(false)}
        body={
          <p>
            {isLock
              ? `Bạn có chắc muốn bỏ chặn cộng tác viên ${collaborator?.full_name} cho khách hàng ${collaborator?.full_name}`
              : `Bạn có chắc muốn chặn công tác viên ${collaborator?.full_name} cho khách hàng ${collaborator?.full_name}`}
          </p>
        }
      />
      <ModalCustom
        isOpen={modalCancel}
        title={"Bạn có chắc muốn huỷ đơn hàng này"}
        handleOk={handleCancelGroupOrder}
        textOk={"OK"}
        handleCancel={() => setModalCancel(false)}
        body={<p></p>}
      />
      <ModalCustom
        isOpen={isOpenModalCancel}
        title={"Bạn có chắc muốn huỷ ca làm này"}
        handleOk={handleCancelOrder}
        textOk={"OK"}
        handleCancel={() => setIsOpenModalCancel(false)}
        body={
          <>
            <InputCustom
              title={`${i18n.t("reason_cancellation", { lng: lang })}`}
              style={{ width: "100%" }}
              value={idReason}
              onChange={(e) => setIdReason(e)}
              options={dataReason}
              select={true}
            />
            <InputCustom
              title={`${i18n.t("other_reason", { lng: lang })}`}
              onChange={(e) => setNoteReason(e.target.value)}
            />
          </>
        }
      />
      <ModalCustom
        isOpen={isOpenModalChangeStatus}
        title={"Bạn có chắc muốn thay đổi trạng thái ca làm này không?"}
        handleOk={handleChangeStatus}
        textOk={"OK"}
        handleCancel={openModalChangeStatus}
        body={
          <p>
            {`Bạn có chắc muốn thay đổi trạng thái ca làm này sang ${
              item?.status === "confirm" ? "ĐANG LÀM" : "HOÀN THÀNH"
            }`}
          </p>
        }
      />
    </div>
  );
};
export default InForDetailGroupOrder;

const a =
  "https://server.guvico.com/image/upload/8b216c92894c6d252f4c3ae64afd2ec4.png";

const address =
  "https://server.guvico.com/image/upload/9bd3b28bfc3b6da26f4553a4e70092b4.png";

const base_columns = [
  {
    i18n_title: "code_order",
    dataIndex: "id_view",
    key: "code_order",
    width: 140,
    fontSize: "text-size-M",
  },
  // {
  //   i18n_title: "customer",
  //   dataIndex: "customer",
  //   key: "customer-name-phone",
  //   width: 140,
  //   fontSize: "text-size-M",
  // },
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
  // {
  //   i18n_title: "address",
  //   dataIndex: "address",
  //   key: "address",
  //   width: 220,
  //   fontSize: "text-size-M",
  // },
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
  {
    dataIndex: "change_status",
    key: "change_status",
    width: 120,
    fontSize: "text-size-L",
  },
];
