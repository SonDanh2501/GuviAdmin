import HeaderCard from "../../../../../../../components/headerCard";
import CardInfo from "../../../../../../../components/card";
import "./styles.scss";

const Overview = ({ id, star }) => {
  return (
    <div class="collaborator-overview">
      {/* Left container */}
      <div class="collaborator-overview__left">
        <CardInfo
          collaboratorOverviewRating={true}
          collaboratorId={id}
          headerLabel="Tổng quan đánh giá"
          collaboratorStar={star}
        />
        <CardInfo
          collaboratorOverviewCriteria={true}
          headerLabel="Tiêu chí đánh giá"
          supportIcon={true}
        />
        <CardInfo
          collaboratorOverviewBonusAndPunish={true}
          headerLabel="Khen thưởng, vi phạm"
          supportIcon={true}
        />
        <CardInfo
          collaboratorOverviewTest={true}
          collaboratorId={id}
          headerLabel="Bài kiểm tra"
        />
      </div>
      {/* Middle container */}
      <div class="collaborator-overview__middle">
        <CardInfo
          collaboratorOverviewFinance={true}
          headerLabel="Tài chính"
          supportIcon={true}
          timeFilter={true}
        />
        <CardInfo
          collaboratorOverviewJobs={true}
          collaboratorId={id}
          headerLabel="Hiệu quả công việc"
        />
        <CardInfo
          collaboratorOverviewActivitys={true}
          collaboratorId={id}
          headerLabel="Hoạt động gần đây"
        />
      </div>
      {/* Right container */}
      <div class="collaborator-overview__right">
        <CardInfo collaboratorId={id} collaboratorOverviewInformation={true} />
        <CardInfo
          collaboratorOverviewDocument={true}
          collaboratorId={id}
          headerLabel="Tiến hành hồ sơ"
        />
      </div>
    </div>
  );
};

export default Overview;
