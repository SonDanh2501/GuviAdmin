import HeaderCard from "../../../../../../../components/headerCard";
import CardInfo from "../../../../../../../components/card";
import "./styles.scss";
import CardActivityLog from "../../../../../../../components/card/cardActivityLog";
import { useEffect, useState } from "react";
import { loadingAction } from "../../../../../../../redux/actions/loading";
import { useDispatch } from "react-redux";
import { getHistoryOrderCollaborator, getReviewCollaborator } from "../../../../../../../api/collaborator";
import { errorNotify } from "../../../../../../../helper/toast";
import CardBieChart from "../../../../../../../components/card/cardBieChart";
import CardRadio from "../../../../../../../components/card/cardRadio";

const Overview = ({ id, star }) => {
  const dispatch = useDispatch();
  const dataAreaChart = [
    {
      subject: "Làm việc chăm chỉ",
      A: 1,
      B: 2,
      fullMark: 5,
    },
    {
      subject: "Đồng phục gọn gàn, sạch sẽ",
      A: 1,
      B: 2,
      fullMark: 5,
    },
    {
      subject: "Dụng cụ chuẩn bị đầy đủ",
      A: 3,
      B: 4,
      fullMark: 5,
    },
    {
      subject: "Làm việc rất tốt, dọn dẹp sạch sẽ",
      A: 5,
      B: 5,
      fullMark: 5,
    },
    {
      subject: "Giờ giấc chuẩn, luôn đến trước giờ hẹn",
      A: 3,
      B: 4,
      fullMark: 5,
    },
  ]; // Dữ liệu tạm thời để hiển thị của tiêu chí đánh giá
  const [dataOrder, setDataOrder] = useState([]); // Dữ liệu đơn hàng
  const [dataRating, setDataRating] = useState([
    {
      name: "5 sao",
      value: 1,
    },
    {
      name: "4 sao",
      value: 1,
    },
    {
      name: "3 sao",
      value: 1,
    },
    {
      name: "2 sao",
      value: 1,
    },
    {
      name: "1 sao",
      value: 1,
    },
  ]); // Dữ liệu tổng giá trị từng loại sao
  /* Handle Function */
  // 1. Hàm tính tổng từng loại sao
  const handleCalculateStarEachKind = (
    totalRating,
    setTotalRating,
    dataReview
  ) => {
    if (totalRating.length > 0 && dataReview.totalItem > 0) {
      let fiveStar = 0;
      let fourStar = 0;
      let threeStar = 0;
      let twoStar = 0;
      let oneStar = 0;
      dataReview?.data?.forEach((el) => {
        if (el.star === 5) fiveStar += 1;
        if (el.star === 4) fourStar += 1;
        if (el.star === 3) threeStar += 1;
        if (el.star === 2) twoStar += 1;
        if (el.star === 1) oneStar += 1;
      });
      setTotalRating((prevTotalRating) =>
        prevTotalRating.map((item, index) => {
          if (index === 0) {
            return { ...item, value: fiveStar };
          }
          if (index === 1) {
            return {
              ...item,
              value: fourStar,
            };
          }
          if (index === 2) {
            return {
              ...item,
              value: threeStar,
            };
          }
          if (index === 3) {
            return {
              ...item,
              value: twoStar,
            };
          }
          if (index === 4) {
            return {
              ...item,
              value: oneStar,
            };
          }
          return item;
        })
      );
    }
  };
  /* Use effect */
  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch(loadingAction.loadingRequest(true));
        // Chạy API
        const [dataOrderFetch, dataStarFetch] = await Promise.all([
          getHistoryOrderCollaborator(id, 0, 5), // Fetch dữ liệu lịch sử đơn hàng của đối tác (5 đơn gần nhất)
          getReviewCollaborator(id, 0, 1), // Fetch dữ liệu lấy đánh giá gần nhất của đối tác (dùng trick để lấy tổng đánh giá)
        ]);
        // Sau khi có tổng số lượng đánh giá, gọi lại API để lấy toàn bộ dữ liệu đánh giá
        const fullReviewData = await getReviewCollaborator(
          id,
          0,
          dataStarFetch.totalItem
        );
        // Cập nhật state
        setDataOrder(dataOrderFetch);
        handleCalculateStarEachKind(dataRating, setDataRating, fullReviewData);
      } catch (err) {
        errorNotify({
          message: err?.message,
        });
      } finally {
        dispatch(loadingAction.loadingRequest(false));
      }
    };
    fetchData();
  }, [id, dispatch]);
  return (
    <div class="collaborator-overview">
      {/* Left container */}
      <div class="collaborator-overview__left">
        <CardInfo
          cardHeader="Tổng quan đánh giá"
          cardContent={
            <CardBieChart
              data={dataRating}
              star={star}
              totalItem={dataRating?.reduce((acc, item) => acc + item.value, 0)}
            />
          }
        />
        <CardInfo
          cardHeader="Tiêu chí đánh giá"
          cardContent={
            <CardRadio
              data={dataAreaChart}
              dataKey="subject"
              dataName="Mục đánh giá"
            />
          }
        />
        <CardInfo
          collaboratorOverviewBonusAndPunish={true}
          cardHeader="Khen thưởng, vi phạm"
          supportIcon={true}
        />
        <CardInfo
          collaboratorOverviewTest={true}
          collaboratorId={id}
          cardHeader="Bài kiểm tra"
        />
      </div>
      {/* Middle container */}
      <div class="collaborator-overview__middle">
        <CardInfo
          collaboratorOverviewFinance={true}
          cardHeader="Tài chính"
          supportIcon={true}
          timeFilter={true}
        />
        <CardInfo
          collaboratorOverviewJobs={true}
          collaboratorId={id}
          cardHeader="Hiệu quả công việc"
        />
        <CardInfo
          cardHeader="Hoạt động gần đây"
          cardContent={
            <CardActivityLog
              data={dataOrder?.data}
              totalItem={dataOrder?.data?.length}
              dateIndex="date_work"
            />
          }
        />
        {/* <CardInfo
          cardHeader="Hoạt động gần đây"
          // cardBody={<CardActivityLog />}
          collaboratorOverviewActivitys={true}
          collaboratorId={id}
        /> */}
      </div>
      {/* Right container */}
      <div class="collaborator-overview__right">
        <CardInfo collaboratorId={id} collaboratorOverviewInformation={true} />
        <CardInfo
          collaboratorOverviewDocument={true}
          collaboratorId={id}
          cardHeader="Tiến hành hồ sơ"
        />
      </div>
    </div>
  );
};

export default Overview;
