import { Input } from "antd";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import CustomerInfo from "../components/OrderComponents/CustomerInfo";
import CollaboratorInfo from "../components/OrderComponents/CollaboratorInfo";
import ItemInfoBill from "./ItemInfoBill";
import InfoBill from "../components/OrderComponents/InfoBill";
import DetailBill from "../components/OrderComponents/DetailBill";
import ModalCustom from "../../../components/modalCustom";
import { getOrderDetailApi } from "../../../api/order";
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
const { TextArea } = Input;
const DetailOrder = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [dataGroup, setDataGroup] = useState();
  const [customer, setCustomer] = useState();
  const [collaborator, setCollaborator] = useState();
  const [detectLoading, setDetectLoading] = useState(false);
  const [dateCreate, setDateCreate] = useState({
    day: "?? ??:??:????",
    time: "??:??",
    title: "??",
  });
  const [statusGroupOrder, setStatusGroupOrder] = useState({
    status: "pending",
    title: "Đang chờ làm",
  });
  const [isLock, setIsLock] = useState(false);
  const [isFavourite, setIsFavourite] = useState(false);
  const [titleService, setTitleService] = useState("");
  const [infoBill, setInfoBill] = useState();
  const [serviceFee, setServiceFee] = useState(0);
  const [modalFavourite, setModalFavourite] = useState(false);
  const [modalLock, setModalLock] = useState(false);
  const [modalCancel, setModalCancel] = useState(false);
  const [isOpenCancelGroupOrder, setIsOpenCancelGroupOrder] = useState(false);
  const [reCallData, setReCallData] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("Tiền mặt");
  useEffect(() => {
    getData();
  }, [id, reCallData]);
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
      if (dataGroup?.payment_method === "point") {
        setPaymentMethod("Ví G-pay");
      }
    }
  }, [dataGroup]);

  const getData = () => {
    setDetectLoading(true);
    getOrderDetailApi(id)
      .then((res) => {
        setDataGroup(res);
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
          date_work={dataGroup?.date_work}
          end_date_work={dataGroup?.end_date_work}
          type_address_work={dataGroup?.type_address_work}
          title="Thông tin thời gian và địa chỉ"
          avatar={address}
          data={dataGroup}
          setReCallData={setReCallData}
          reCallData={reCallData}
          total_estimate={dataGroup?.total_estimate}
        />
      </div>
      <div className="info-detail-order_container-info-bill">
        <InfoBill
          data={infoBill}
          titleService={titleService}
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
          total_date_work={1}
          payment_method={paymentMethod}
        />
      </div>
      <div className="info-detail-order_container-note">
        <OrderNote title="Ghi chú nội bộ" />
        <OrderNote title="Ghi chú của khách KH" value={dataGroup?.note} />
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
      {detectLoading && <LoadingPagination />}
    </div>
  );
};
export default DetailOrder;

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
