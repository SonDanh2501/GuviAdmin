import { Image } from "antd";
import { arrDaysVN, default_avatar } from "../../../constants";
import { useEffect, useState } from "react";
import { format } from "date-fns";

const ItemInfoBill = ({
  title,
  type_address_work,
  date_work,
  end_date_work,
  address,
  avatar,
}) => {
  const [dateWork, setDateWork] = useState({
    time: "??:?? - ??:??",
    day: "??:??:????",
  });
  useEffect(() => {
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
  }, [date_work]);

  return (
    <div className="item-info-bill_container">
      <h6 className="item-info-bill_title">{title}</h6>

      <div className="item-info-bill_detail">
        <p>
          Địa chỉ: <span>{address}</span>
        </p>
        <p>
          Giờ làm: <span>{dateWork.time}</span>
        </p>
        <p>
          Ngày làm: <span>{dateWork.day}</span>
        </p>
      </div>
      <div className="item-info-bill_img">
        <Image
          preview={false}
          style={{ height: 50, width: 50 }}
          className="collaborator-info_avatar-img"
          src={avatar || default_avatar}
        />
      </div>
    </div>
  );
};

export default ItemInfoBill;
