import HeaderCard from "../../../../../../../components/headerCard";
import CardInfo from "../../../../../../../components/card";
import "./styles.scss";

const Overview = ({ id, star }) => {
  return (
    <div className="pb-4">
      {/* <HeaderCard calendar={true} /> */}
      <div class="flex md:flex-row flex-col-reverse w-full gap-6">
        {/* Left container */}
        <div class="w-full md:w-1/3 md:flex flex-col gap-6">
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
        <div class="w-full md:w-1/3 flex flex-col gap-6">
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
        <div class="w-full md:w-1/3 flex flex-col gap-6">
          <CardInfo collaboratorId={id} collaboratorInformation={true} />
          <CardInfo
            collaboratorDocument={true}
            collaboratorId={id}
            headerLabel="Tiến hành hồ sơ"
          />
        </div>
      </div>
    </div>
  );
};

export default Overview;
