import { useDispatch, useSelector } from "react-redux";
import {
  getElementState,
  getLanguageState,
} from "../../../redux/selectors/auth";
import { loadingAction } from "../../../redux/actions/loading";
import { errorNotify, successNotify } from "../../../helper/toast";
import { useEffect, useState } from "react";
import {
  cancelGroupOrderApi,
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
import { Checkbox, Dropdown, FloatButton, Input, Space } from "antd";
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
import LoadingPagination from "../../../components/paginationLoading";
import { unAssignCollaborator } from "../../../api/groupOrder";
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
  const [isLoading, setIsLoading] = useState(false);
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
    title: "",
  });
  const [isLock, setIsLock] = useState(false);
  const [isFavourite, setIsFavourite] = useState(false);
  const [titleService, setTitleService] = useState("");
  const [infoBill, setInfoBill] = useState();
  const [serviceFee, setServiceFee] = useState(0);
  const [modalFavourite, setModalFavourite] = useState(false);
  const [modalLock, setModalLock] = useState(false);
  const [modalCancelCollaborator, setModalCancelCollaborator] = useState(false);
  const [isChangeCollaborator, setIsChangeCollaborator] = useState(false);
  const [modalCancel, setModalCancel] = useState(false);
  const [isOpenModalCancel, setIsOpenModalCancel] = useState(false);
  const [isOpenModalChangeStatus, setIsOpenModalChangeStatus] = useState(false);
  const [columns, setColumns] = useState(base_columns);
  const [dataReason, setDataReason] = useState();
  const [idReason, setIdReason] = useState("");
  const [noteReason, setNoteReason] = useState("");
  const [isOpenCancelGroupOrder, setIsOpenCancelGroupOrder] = useState(false);
  const [reCallData, setReCallData] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("Tiền mặt");
  const [isOpenModalAddCollaborator, setIsOpenModalAddCollaborator] =
    useState(false);
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

  useEffect(() => {
    getData();
  }, [id, reCallData, startPage]);
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
      } else {
        setStatusGroupOrder({
          status: "pending",
          title: "Đang chờ làm",
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
        setColumns(base_columns.slice(0, base_columns.length - 1));
      }
      if (dataGroup?.date_work_schedule?.length > 1) {
        if (
          dataGroup.status === "pending" ||
          dataGroup.status === "confirm" ||
          dataGroup.status === "doing"
        ) {
          setIsOpenCancelGroupOrder(true);
        } else {
          setIsOpenCancelGroupOrder(false);
        }
      } else {
        setIsOpenCancelGroupOrder(false);
      }
      if (dataGroup?.payment_method === "point") {
        setPaymentMethod("Ví G-pay");
      }
    }
  }, [dataGroup]);

  const getData = () => {
    setDetectLoading(true);
    setIsLoading(true);
    getOrderByGroupOrderApi(id, lang, startPage, 20)
      .then((res) => {
        console.log("resss ", res);
        setDataGroup(res?.data?.groupOrder);
        setDataList(res?.data?.listOrder?.data);
        setDetectLoading(false);
        setTotal(res?.totalItem);
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
        errorNotify({
          message: err?.message,
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
        <Link to={`/details-order/details-order-schedule/${item?._id}`}>
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
            estimate={item?.total_estimate}
            setReCallData={setReCallData}
            reCallData={reCallData}
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
  const handleAddCollaborator = () => {
    console.log("change ");
  };
  const handleCancelGroupOrder = () => {
    if (idReason && idReason !== "") {
      cancelGroupOrderApi(dataGroup?._id, {
        id_reason_cancel: idReason,
      })
        .then((res) => {
          errorNotify({
            message: "Huỷ đơn hàng thành công",
          });
          getData();
        })
        .catch((err) => {
          errorNotify({
            message: err?.message,
          });
          dispatch(loadingAction.loadingRequest(false));
        });
    } else {
      errorNotify({
        message: "Chưa chọn lý do huỷ việc",
      });
    }

    setModalCancel(false);
  };
  const handleCancelOrder = () => {
    if (idReason && idReason !== "") {
      onChangeStatus(item?._id, {
        status: "cancel",
        id_reason_cancel: idReason,
        note_admin: noteReason,
      });
    } else {
      errorNotify({
        message: "Chưa chọn lý do huỷ việc",
      });
    }
    setIsOpenModalCancel(false);
  };

  const onChangeStatus = (_id, data) => {
    dispatch(loadingAction.loadingRequest(true));
    changeStatusOrderApi(_id, data)
      .then((res) => {
        getData();
        dispatch(loadingAction.loadingRequest(false));
        let _message = "";
        if (data?.status === "next") {
          _message = "Thay đổi trạng thái làm việc thành công";
        } else {
          _message = "Hủy công việc thành công";
        }
        successNotify({
          message: _message,
        });
      })
      .catch((err) => {
        errorNotify({
          message: err?.message,
        });
        dispatch(loadingAction.loadingRequest(false));
      });
  };
  const handleChangeStatus = () => {
    onChangeStatus(item?._id, { status: "next" });
    setIsOpenModalChangeStatus(false);
  };
  const handleUnassignCollaborator = (id) => {
    unAssignCollaborator(id)
      .then((res) => {
        // console.log("check response", res);
      })
      .catch((err) => {
        // console.log("err", err);
      });
  }
  console.log("data ", collaborator);
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
          <div className="flex items-center ">
            <button
              className="text-purple-500 border-[1px] border-purple-500 bg-purple-50 hover:bg-purple-300 hover:text-purple-700 hover:border-purple-300 duration-500"
              style={{
                cursor: "pointer",
                marginLeft: "4px",
                fontWeight: "500",
                fontSize: "12px",
                padding: "8px",
                // border: "1px solid purple",
                borderRadius: "6px",
              }}
              onClick={() => setModalCancelCollaborator(true)}
            >
              Đẩy CTV khỏi đơn hàng
            </button>
          </div>
        </div>
      </div>
      <div className="info-detail-order_detail">
        <CustomerInfo
          title={"Thông tin khách hàng"}
          email={customer?.email}
          full_name={customer?.full_name}
          phone={customer?.phone}
          rank_point={customer?.rank_point}
          avatar={customer?.avatar}
          id={customer?._id}
          isCustomer
        />
        <CustomerInfo
          title={"Thông tin cộng tác viên"}
          star={collaborator?.star}
          full_name={collaborator?.full_name}
          phone={collaborator?.phone}
          avatar={collaborator?.avatar}
          id={collaborator?._id}
          handleFavourite={collaborator && openModalFavourite}
          handleLock={collaborator && openModalLock}
          isFavourite={isFavourite}
          isLock={isLock}
          isCollaborator
          // handleAddCollaborator={!collaborator && handleAddCollaborator}
        />
        {/* Tạm thời chưa sửa tên component CustomerInfo do không kịp */}
        <CustomerInfo
          title={"Thông tin thời gian và đia chỉ"}
          address={dataGroup?.address}
          dataGroupOrder={dataGroup}
          isAddress
          date_work={dataList.length > 0 && dataList[0]?.date_work}
          end_date_work={dataList.length > 0 && dataList[0]?.end_date_work}
          setReCallData={setReCallData}
          reCallData={reCallData}
        />
      </div>
      <div className="info-detail-order_container-info-bill">
        <div>
          <InfoBill
            data={infoBill}
            titleService={titleService}
            handleCancel={isOpenCancelGroupOrder && openModalCancel}
          />
          <div className="mr-t" />
          <OrderNote title="Ghi chú của khách KH" value={dataGroup?.note} />
        </div>

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
          payment_method={paymentMethod}
        />
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
      {/*Đẩy CTV ra khỏi đơn hàng  */}
      <ModalCustom
        isOpen={modalCancelCollaborator}
        title={"Đẩy cộng tác viên ra khỏi đơn hàng"}
        textOk={"Xác nhận"}
        handleOk={() => handleUnassignCollaborator(id)}
        handleCancel={() => setModalCancelCollaborator(false)}
        body={
          <>
            <p>
              Bạn có chắc muốn đẩy cộng tác viên ra khỏi đơn hàng? Hành động này
              sẽ đẩy cộng tác viên ra khỏi tất cả các ca làm
            </p>
            <div>
              <Checkbox>Phạt CTV theo chính sách hủy ca</Checkbox>
            </div>
          </>
        }
      />
      {isLoading && <LoadingPagination />}
    </div>
  );
};
export default InForDetailGroupOrder;

const a =
  "https://server.guvico.com/image/upload/8b216c92894c6d252f4c3ae64afd2ec4.png";

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
    i18n_title: "Tổng tiền",
    dataIndex: "total_fee",
    key: "total_fee",
    width: 120,
    fontSize: "text-size-M",
  },
  {
    i18n_title: "Tổng khuyến mãi",
    dataIndex: "total_discount",
    key: "total_discount",
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
