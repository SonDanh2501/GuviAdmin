import { Image } from "antd";
import { useEffect, useState } from "react";
import { arrDaysVN, default_avatar } from "../../../../constants";
import avatarDefault from "../../../../assets/images/user.png";
import { Link } from "react-router-dom";
import {
  CloseCircleFilled,
  HeartFilled,
  PlusCircleOutlined,
} from "@ant-design/icons";
import { format } from "date-fns";
import EditTimeOrder from "../../EditTimeGroupOrder";

const CustomerInfo = ({
  full_name,
  phone,
  email,
  rank_point,
  avatar,
  id,
  title,
  star,
  handleFavourite,
  handleLock,
  handleAddCollaborator,
  isFavourite,
  isLock,
  isCustomer,
  isCollaborator,
  isAddress,
  address,
  dataGroupOrder,
  date_work,
  end_date_work,
  setReCallData,
  reCallData,
}) => {
  const [rank, setRank] = useState("Thành viên");
  const [dateWork, setDateWork] = useState({
    time: "",
    day: "",
  });
  const [isEditTime, setIsEditTime] = useState(false);
  useEffect(() => {
    if (rank_point > 1499) {
      setRank("Bạch kim");
    } else if (rank_point > 299) {
      setRank("Bạc");
    } else if (rank_point > 99) {
      setRank("Vàng");
    }
    if (date_work && end_date_work) {
      const _start_date_work = new Date(date_work);
      const _end_date_work = new Date(end_date_work);
      const _start_time = format(_start_date_work, "HH:mm");
      const _end_time = format(_end_date_work, "HH:mm");
      const _date = format(_start_date_work, "dd/MM/yyyy");
      const _day = arrDaysVN.filter(
        (item) => item.id === _start_date_work.getDay()
      )[0].title;
      setDateWork({
        time: _start_time + " - " + _end_time,
        day: `${_date} (${_day})`,
      });
    }
    if (
      (dataGroupOrder?.status === "pending" ||
        dataGroupOrder?.status === "confirm") &&
      dataGroupOrder?.date_work_schedule?.length < 2
    ) {
      setIsEditTime(true);
    } else {
      setIsEditTime(false);
    }
  }, [dataGroupOrder, date_work, end_date_work]);

  return (
    <div className="customer-info_container">
      <div className="customer-info_box-title">
        <p className="customer-info_box-title_title">{title}</p>
        {isCustomer && (
          <Link to={`/profile-customer/${id}`}>
            <p
              className="customer-info_box-title_detail"
              id="color-selected"
            >{`Chi tiết >>>`}</p>
          </Link>
        )}
        {isCollaborator && (
          <Link to={`/details-collaborator/${id}`}>
            {id && (
              <p
                className="customer-info_box-title_detail"
                id="color-selected"
              >{`Chi tiết >>>`}</p>
            )}
          </Link>
        )}
      </div>
      <div className="customer-info_detail">
        <div>
          {(isCollaborator || isCustomer) && (
            <p className="customer-info_detail-p-name " id="color-selected">
              <span className="customer-info_detail-p"> Tên: </span>
              {full_name ? full_name : "Đang tìm kiếm"}
            </p>
          )}

          {(isCollaborator || isCustomer) && (
            <p className="customer-info_detail-p-name">
              <span className="customer-info_detail-p">SĐT: </span>
              {phone ? phone : "Đang tìm kiếm"}
            </p>
          )}
          {isCustomer && (
            <p className="customer-info_detail-p-name">
              <span className="customer-info_detail-p">Email: </span>
              {email}
            </p>
          )}
          {isCollaborator && (
            <p className="customer-info_detail-p-name">
              <span className="customer-info_detail-p">Số sao: </span>
              {star ? `${star} sao` : "Đang tìm kiếm"}
            </p>
          )}
          {isAddress && (
            <p className="customer-info_detail-p-name">
              <span className="customer-info_detail-p">Địa chỉ: </span>
              {address}
            </p>
          )}
          {isAddress && (
            <p className="customer-info_detail-p-name">
              <span className="customer-info_detail-p">Ngày làm: </span>
              {dateWork.day}
            </p>
          )}
          {isAddress && (
            <p className="customer-info_detail-p-name">
              <span className="customer-info_detail-p">Giờ làm: </span>
              {dateWork.time} ({dataGroupOrder?.total_estimate}
              giờ)
            </p>
          )}
        </div>
        <div className="customer-info_detail-avatar">
          {(isCollaborator || isCustomer) && (
            <Image
              style={{ height: 50, width: 50 }}
              className="customer-info_avatar-img"
              src={avatar || avatarDefault}
            />
          )}
          {isAddress && (
            <Image style={{ height: 50, width: 50 }} src={imageAddress} />
          )}

          {isCustomer && (
            <p className="customer-info_detail-avatar_rank">{rank}</p>
          )}

          <div className="customer-info_detail-avatar_action">
            {isCollaborator && (
              <>
                {handleFavourite && (
                  <p onClick={handleFavourite}>
                    <HeartFilled
                      style={{
                        fontSize: "22px",
                        color: isFavourite ? "#dc2828" : "#8d8d8d",
                      }}
                    />
                  </p>
                )}
                {handleLock && (
                  <p onClick={handleLock}>
                    <CloseCircleFilled
                      style={{
                        fontSize: "22px",
                        color: isLock ? "#dc2828" : "#8d8d8d",
                      }}
                    />
                  </p>
                )}
                {handleAddCollaborator && (
                  <p onClick={handleAddCollaborator}>
                    <PlusCircleOutlined
                      style={{
                        fontSize: "22px",
                        color: "#2463eb",
                      }}
                    />
                  </p>
                )}
              </>
            )}
          </div>
          {isAddress && isEditTime && (
            <EditTimeOrder
              idCustomer={id}
              address ={address}
              idOrder={dataGroupOrder?.id_order[0]}
              dateWork={date_work}
              estimate={dataGroupOrder?.total_estimate}
              setReCallData={setReCallData}
              reCallData={reCallData}
              title={"Chỉnh sửa"}
            />
          )}
        </div>
      </div>
    </div>
  );
};
export default CustomerInfo;

const imageAddress =
  "https://server.guvico.com/image/upload/9bd3b28bfc3b6da26f4553a4e70092b4.png";
