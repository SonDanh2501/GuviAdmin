import { Input } from "antd";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CustomerInfo from "../components/OrderComponents/CustomerInfo";
import CollaboratorInfo from "../components/OrderComponents/CollaboratorInfo";
import ItemInfoBill from "./ItemInfoBill";
import InfoBill from "../components/OrderComponents/InfoBill";
import DetailBill from "../components/OrderComponents/DetailBill";
import ModalCustom from "../../../components/modalCustom";
import { getOrderByGroupOrderApi, getOrderDetailApi } from "../../../api/order";
import { loadingAction } from "../../../redux/actions/loading";
import { UilCalender, UilClock } from "@iconscout/react-unicons";
import { arrDaysVN } from "../../../constants";
import { errorNotify } from "../../../helper/toast";
import {
  blockCustomerApi,
  favouriteCustomerApi,
  unblockCustomerApi,
  unfavouriteCustomerApi,
} from "../../../api/customer";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeftOutlined } from "@ant-design/icons";
import LoadingPagination from "../../../components/paginationLoading";
import {
  getElementState,
  getLanguageState,
} from "../../../redux/selectors/auth";
const { TextArea } = Input;

const DetailOrder = (props) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [dataGroup, setDataGroup] = useState();
  const [customer, setCustomer] = useState();
  const [collaborator, setCollaborator] = useState();
  const [startPage, setStartPage] = useState(1);
  const [detectLoading, setDetectLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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
  const [isChangeCollaborator, setIsChangeCollaborator] = useState(false);
  const [modalCancel, setModalCancel] = useState(false);
  const [isOpenModalCancel, setIsOpenModalCancel] = useState(false);
  const [isOpenModalChangeStatus, setIsOpenModalChangeStatus] = useState(false);
  const [dataReason, setDataReason] = useState();
  const [idReason, setIdReason] = useState("");
  const [noteReason, setNoteReason] = useState("");
  const [isOpenCancelGroupOrder, setIsOpenCancelGroupOrder] = useState(false);
  const [reCallData, setReCallData] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("Tiền mặt");
  const onChangePage = (value) => {
    setStartPage(value);
  };

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
        date_work_schedule: [],
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
    getOrderDetailApi(id)
      .then((res) => {
        setIsLoading(false);
        setDataGroup(res);
        setDetectLoading(false);
      })
      .catch((err) => {
        setDetectLoading(false);
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
  return (
    <div className="info-detail-order_container ">
      <div className="info-detail-order_back">
        <ArrowLeftOutlined onClick={() => navigate(-1)} />
      </div>
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
        />
        {/* Tạm thời chưa sửa tên component CustomerInfo do không kịp */}
        <CustomerInfo
          title={"Thông tin thời gian và đia chỉ"}
          address={dataGroup?.address}
          dataGroupOrder={dataGroup}
          isAddress
          date_work={dataGroup?.date_work}
          end_date_work={dataGroup?.end_date_work}
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
          total_date_work={1}
          payment_method={paymentMethod}
        />
      </div>
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
      {isLoading && <LoadingPagination />}
    </div>
  );
};
export default DetailOrder;

const address =
  "https://server.guvico.com/image/upload/9bd3b28bfc3b6da26f4553a4e70092b4.png";
