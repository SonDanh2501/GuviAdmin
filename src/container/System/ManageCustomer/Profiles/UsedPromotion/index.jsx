import { useEffect, useState } from "react";
import { getUsedPromotionByCustomers } from "../../../../../api/customer";
import "./styles.scss";
import { formatMoney } from "../../../../../helper/formatMoney";
import { Table } from "antd";
import moment from "moment";
import { Link } from "react-router-dom";
import useWindowDimensions from "../../../../../helper/useWindowDimensions";

const UsedPromotion = ({ id }) => {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState([]);
  const { width } = useWindowDimensions();
  useEffect(() => {
    getUsedPromotionByCustomers(id)
      .then((res) => {
        setData(res?.data);
        setTotal(res?.total);
      })
      .catch((err) => {});
  }, [id]);

  const columns = [
    {
      title: () => {
        return <p className="title-column">Ngày sử dụng</p>;
      },
      render: (data) => {
        return (
          <div className="div-date-used-prmotion">
            <p className="text-date">
              {moment(data?.date_create).format("DD/MM/YYYY")}
            </p>
            <p className="text-date">
              {moment(data?.date_create).format("HH:mm")}
            </p>
          </div>
        );
      },
    },
    {
      title: () => {
        return <p className="title-column">Mã khuyến mãi</p>;
      },
      render: (data) => {
        return (
          <p className="text-name-promotion">
            {data?.code_promotion?._id?.title?.vi}
          </p>
        );
      },
    },
    {
      title: () => {
        return <p className="title-column">Giá giảm</p>;
      },
      render: (data) => {
        return (
          <p className="text-name-promotion">
            {formatMoney(data?.code_promotion?.discount)}
          </p>
        );
      },
    },
    {
      title: () => {
        return <p className="title-column">Mã đơn</p>;
      },
      render: (data) => {
        return (
          <Link to={`/details-order/${data?.id_group_order}`}>
            <p className="text-name-promotion">{data?.id_view}</p>
          </Link>
        );
      },
    },
    {
      title: () => {
        return <p className="title-column">Trạng thái</p>;
      },
      render: (data) => {
        return (
          <p
            className={
              data?.status === "done"
                ? "text-status-done"
                : data?.status === "pending"
                ? "text-status-pending"
                : data?.status === "confirm"
                ? "text-status-confirm"
                : "text-status-cancel"
            }
          >
            {data?.status === "done"
              ? "Hoàn thành"
              : data?.status === "pending"
              ? "Đang chờ làm"
              : data?.status === "confirm"
              ? "Đã nhận"
              : "Đã huỷ"}
          </p>
        );
      },
    },
  ];
  return (
    <div>
      {total.length > 0 && (
        <div className="div-head-used-prmotion">
          {total?.map((item, key) => {
            return (
              <div className="div-item-total">
                <p
                  className={
                    item?._id === "done"
                      ? "text-done-total"
                      : item?._id === "pending"
                      ? "text-pending-total"
                      : item?._id === "confirm"
                      ? "text-confirm-total"
                      : "text-cancel-total"
                  }
                >
                  {item?._id === "done"
                    ? "Đơn hoàn thành"
                    : item?._id === "pending"
                    ? "Đơn đang chờ làm"
                    : item?._id === "confirm"
                    ? "Đơn đã nhận"
                    : "Đơn huỷ"}
                </p>
                <p className="text-total">Sử dụng: {item?.total_used}</p>
                <p className="text-total">
                  Tổng: {formatMoney(item?.total_discount)}
                </p>
              </div>
            );
          })}
        </div>
      )}
      <div className="mt-5">
        <Table
          dataSource={data}
          columns={columns}
          scroll={{ x: width < 900 ? 900 : 0 }}
          pagination={false}
        />
      </div>
    </div>
  );
};

export default UsedPromotion;
