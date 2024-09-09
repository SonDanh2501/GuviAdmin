import HeaderCard from "../../../../../../../components/headerCard";
import CardInfo from "../../../../../../../components/card";
import "./styles.scss";

const Overview = ({ id, star }) => {
  return (
    <div class="div-overview">
      {/* Left container */}
      <div class="div-overview-left">
        <CardInfo
          collaboratorRatingOverview={true}
          collaboratorId={id}
          headerLabel="Tổng quan đánh giá"
          collaboratorStar={star}
        />
        <CardInfo
          collaboratorCriteria={true}
          headerLabel="Tiêu chí đánh giá"
          supportIcon={true}
        />
        <CardInfo
          collaboratorBonusAndPunish={true}
          headerLabel="Khen thưởng, vi phạm"
          supportIcon={true}
        />
        <CardInfo
          collaboratorTest={true}
          collaboratorId={id}
          headerLabel="Bài kiểm tra"
        />
      </div>
      {/* Middle container */}
      <div class="div-overview-middle">
        <CardInfo
          collaboratorFinance={true}
          headerLabel="Tài chính"
          supportIcon={true}
          timeFilter={true}
        />
        <CardInfo
          collaboratorJobs={true}
          collaboratorId={id}
          headerLabel="Hiệu quả công việc"
        />
        <CardInfo
          collaboratorActivitys={true}
          collaboratorId={id}
          headerLabel="Hoạt động gần đây"
        />
      </div>
      {/* Right container */}
      <div class="div-overview-right">
        <CardInfo collaboratorId={id} collaboratorInformation={true} />
        <CardInfo
          collaboratorDocument={true}
          collaboratorId={id}
          headerLabel="Tiến hành hồ sơ"
        />
      </div>
    </div>
  );
};

export default Overview;
