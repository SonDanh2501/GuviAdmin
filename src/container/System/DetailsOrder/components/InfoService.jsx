import { useEffect, useState } from "react";
import { formatMoney } from "../../../../helper/formatMoney";
import { sortArrObject } from "../../../../helper/share";
import { addHours, format } from "date-fns";
import { arrDays } from "../../../../constants";
import EditTimeOrder from "../../ManageOrder/EditTimeGroupOrder";

const InfoService = (props) => {
  const { data, setIsLoading, setDataGroup, setDataList } = props;
  const [arrExtend, setArrExtend] = useState([]);
  const [titleService, setTitleService] = useState("???");
  const [systemFee, setSystemFee] = useState(0);
  const [dateWork, setDateWork] = useState("??:??:??");
  const [timeWork, setTimeWork] = useState("??:??");
  const [isShowEdit, setIsShowEdit] = useState(false);
  useEffect(() => {
    const tempArr = [];
    let tempSystemFee = 0;
    const _date = data?.date_work_schedule[0]?.date;
    data?.service?.optional_service?.map((item) => {
      item?.extend_optional?.map((i) => {
        tempArr.push(i);
      });
    });
    data?.service_fee?.map((item) => {
      tempSystemFee += item?.fee;
    });
    const _tempDateWork = format(new Date(_date), "dd/MM/yyyy");

    const _tempDay = arrDays.filter(
      (i) => i.id === new Date(new Date(_date)).getDay()
    )[0]?.title;
    const _start_time = format(new Date(_date), "HH:mm");
    const _end_time = format(
      addHours(new Date(_date), data?.total_estimate),
      "HH:mm"
    );
    const _temp = tempArr.sort((a, b) => b.price - a.price);
    if (
      data?.status === "pending" ||
      (data?.status === "confirm" && data?.date_work_schedule.length < 2)
    ) {
      setIsShowEdit(true);
    }
    setTimeWork(`${_start_time} - ${_end_time} (${data?.total_estimate} Giờ)`);
    setDateWork(_tempDateWork + `  (${_tempDay})`);
    setArrExtend(_temp);
    setTitleService(data?.service?._id?.title["vi"]);
    setSystemFee(tempSystemFee);
  }, [data]);
  return (
    <>
      <h5 className="info-title-service">{titleService}</h5>
      <div className="gird-1-1-3">
        <span>Thời gian</span>
        <div className="div-flex">
          <p>Ngày làm: {dateWork}</p>
          <p>Giờ làm: {timeWork}</p>
        </div>
        {isShowEdit && (
          <div>
            <EditTimeOrder
              idOrder={data?.id_order[0]}
              dateWork={data?.date_work_schedule[0].date}
              code={data?.code_promotion ? data?.code_promotion?.code : ""}
              setIsLoading={setIsLoading}
              idDetail={data?._id}
              setDataGroup={setDataGroup}
              setDataList={setDataList}
              details={true}
            />
          </div>
        )}
      </div>
      <div className="gird-1-4">
        <span>Địa chỉ</span>
        <p>{data?.address}</p>
      </div>
      <div className="gird-1-4">
        <span>Ghi chú</span>
        <p>{data?.note}</p>
      </div>
      <div className="gird-1-4">
        <span>Thanh toán</span>
        <p>{data?.payment_method === "cash" ? "Tiền mặt" : "G-Pay"}</p>
      </div>
    </>
  );
};

export default InfoService;
