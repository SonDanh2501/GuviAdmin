import React from "react";
import icons from "../../../utils/icons";
import { Image, Tooltip } from "antd";
import moment from "moment";
import { useSelector } from "react-redux";
import { getProvince } from "../../../redux/selectors/service";
import avatarDefault from "../../../assets/images/user.png";
import "./index.scss";

const {
  IoCallOutline,
  IoPersonOutline,
  IoCalendarOutline,
  IoNewspaperOutline,
  IoTimeOutline,
  IoHeartOutline,
  IoShieldCheckmarkOutline,
  IoCalendarNumberOutline,
} = icons;

const IconTextCustom = (props) => {
  const { icon, label, content, subcontent } = props;
  return (
    <div className="card-statistics__icon--layout">
      {icon}
      <div className="card-statistics__icon--layout-content">
        <span className="card-statistics__icon--layout-content-sub">
          {label}
        </span>
        <span className="card-statistics__icon--layout-content-main">
          {content} {subcontent}
        </span>
      </div>
    </div>
  );
};

const CardInformation = (props) => {
  const { data, total } = props;
  const province = useSelector(getProvince);
  const city = province.filter((x) => x.code === data.city)[0];

  return (
    <div className="card__information">
      <div className="card__information--avatar">
        <div className="card__information--avatar-image">
          <Image
            style={{
              padding: "4px",
              backgroundColor: "#FFFFFF",
              borderRadius: "100%",
            }}
            width={"150px"}
            height={"150px"}
            src={data?.avatar ? data?.avatar : avatarDefault}
            alt=""
          />
          <div className="card__information--avatar-information">
            <span className="card__information--avatar-information-name">
              {data?.full_name}
            </span>
            <div className="card__information--avatar-information-other">
              <span className="card__information--avatar-information-other-subtext-label">
                Khu vực:
              </span>
              <span className="card__information--avatar-information-other-subtext">
                {city?.name}
              </span>
            </div>
            <div className="card__information--avatar-information-other">
              <span className="card__information--avatar-information-other-subtext-label">
                Tuổi:
              </span>
              <span className="card__information--avatar-information-other-subtext">
                {moment().diff(data?.birthday, "years")}
              </span>
            </div>
            <div className="card__information--avatar-information-other">
              <span className="card__information--avatar-information-other-subtext-label">
                Mã giới thiệu:
              </span>
              <span className="card__information--avatar-information-other-subtext">
                {data?.invite_code}
              </span>
            </div>

            <Tooltip
              placement="bottom"
              title={
                data?.status === "locked"
                  ? data?.note_handle_admin
                    ? data?.note_handle_admin
                    : "Tài khoản đã bị khóa"
                  : ""
              }
            >
              <span
                className={`card__information--avatar-information-status ${
                  data?.status === "actived"
                    ? "status-done"
                    : "status-not-contact"
                }`}
              >
                {data?.status === "actived"
                  ? "Đang hoạt động"
                  : data?.status === "locked"
                  ? "Đang khóa"
                  : "Khác"}
              </span>
            </Tooltip>
          </div>
        </div>
      </div>
      <div className="card__information--detail-info">
        <span className="card__information--detail-info-label">
          Thông tin nhân sự
        </span>
        <IconTextCustom
          icon={
            <IoCallOutline
              className="card-statistics__icon green"
              color="green"
            />
          }
          label="Điện thoại"
          content={data?.phone}
        />
        <IconTextCustom
          icon={
            <IoPersonOutline
              className="card-statistics__icon blue"
              color="blue"
            />
          }
          label="Giới tính"
          content={data.gender === "male" ? "Nam" : "Nữ"}
        />
        <IconTextCustom
          icon={
            <IoCalendarOutline
              className="card-statistics__icon yellow"
              color="orange"
            />
          }
          label="Ngày sinh"
          content={moment(data?.birthday).format("DD/MM/YYYY")}
        />

        <IconTextCustom
          icon={
            <IoNewspaperOutline
              className="card-statistics__icon red"
              color="red"
            />
          }
          label="Tổng đơn đã hoàn thành"
          content={total?.total_order}
          subcontent="đơn"
        />
        <IconTextCustom
          icon={
            <IoTimeOutline
              className="card-statistics__icon green"
              color="green"
            />
          }
          label="Tổng số giờ làm"
          content={total?.total_hour}
          subcontent="giờ"
        />

        <IconTextCustom
          icon={
            <IoHeartOutline
              className="card-statistics__icon blue"
              color="blue"
            />
          }
          label="Tổng lượt yêu thích"
          content={total?.total_favourite}
        />
        <IconTextCustom
          icon={
            <IoShieldCheckmarkOutline
              className="card-statistics__icon yellow"
              color="orange"
            />
          }
          label="Ngày kích hoạt"
          content={moment(data?.date_create).format("DD/MM/YYYY")}
        />
        <IconTextCustom
          icon={
            <IoCalendarNumberOutline
              className="card-statistics__icon red"
              color="red"
            />
          }
          label="Ngày đăng ký"
          content={moment(data?.date_create).format("DD/MM/YYYY")}
        />
      </div>
    </div>
  );
};

export default CardInformation;
