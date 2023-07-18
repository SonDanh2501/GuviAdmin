import { useEffect, useState } from "react";
import { getUsedPromotionByCustomers } from "../../../../../../api/customer";
import "./styles.scss";
import { formatMoney } from "../../../../../../helper/formatMoney";
import { Table } from "antd";
import moment from "moment";
import { Link } from "react-router-dom";

const UsedPromotion = ({ id }) => {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState([]);
  const [totalItem, setTotalItem] = useState([]);
  useEffect(() => {
    getUsedPromotionByCustomers(id)
      .then((res) => {
        setData(res?.data);
        setTotal(res?.total);
        setTotalItem(res?.totalItem);
      })
      .catch((err) => {});
  }, []);

  const columns = [
    {
      title: () => {
        return <a className="title-column">Ngày sử dụng</a>;
      },
      render: (data) => {
        return (
          <div className="div-date-used-prmotion">
            <a className="text-date">
              {moment(data?.date_create).format("DD/MM/YYYY")}
            </a>
            <a className="text-date">
              {moment(data?.date_create).format("HH:mm")}
            </a>
          </div>
        );
      },
    },
    {
      title: () => {
        return <a className="title-column">Mã khuyến mãi</a>;
      },
      render: (data) => {
        return (
          <a className="text-name-promotion">
            {data?.code_promotion?._id?.title?.vi}
          </a>
        );
      },
    },
    {
      title: () => {
        return <a className="title-column">Giá giảm</a>;
      },
      render: (data) => {
        return (
          <a className="text-name-promotion">
            {formatMoney(data?.code_promotion?.discount)}
          </a>
        );
      },
    },
    {
      title: () => {
        return <a className="title-column">Mã đơn</a>;
      },
      render: (data) => {
        return (
          <Link to={`/details-order/${data?.id_group_order}`}>
            <a className="text-name-promotion">{data?.id_view}</a>
          </Link>
        );
      },
    },
    {
      title: () => {
        return <a className="title-column">Trạng thái</a>;
      },
      render: (data) => {
        return (
          <a
            className={
              data?.status === "done"
                ? "text-status-done"
                : "text-status-cancel"
            }
          >
            {data?.status === "done" ? "Hoàn thành" : "Đã huỷ"}
          </a>
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
                <a
                  className={
                    item?._id === "done"
                      ? "text-done-total"
                      : "text-cancel-total"
                  }
                >
                  {item?._id === "done" ? "Đơn hoàn thành" : "Đơn huỷ"}
                </a>
                <a className="text-total">Sử dụng: {item?.total_used}</a>
                <a className="text-total">
                  Tổng: {formatMoney(item?.total_discount)}
                </a>
              </div>
            );
          })}
        </div>
      )}
      <div className="mt-5">
        <Table dataSource={data} columns={columns} />
      </div>
    </div>
  );
};

export default UsedPromotion;
