import { Button, DatePicker } from "antd";
import RangeDatePicker from "../../datePicker/RangeDatePicker";
const { RangePicker } = DatePicker;

const CommonFilter = (props) => {
  const {
    setSearchValue,
    setCity,
    setDistrict,
    setStartDate,
    setEndDate,
    setCustomerStatus,
    setCustomerRank,
    setCustomerGroup,
    setCollaboratorStatus,
    setService,
    setGroupPromotion,
    setTypePromotion,
    onClick,
    onReset,
  } = props;
  const onChangeStartDate = (date, dateString) => {
    console.log("=>> ", date, dateString);
  };
  const onChangeEndDate = (date, dateString) => {
    console.log("=>> ", date, dateString);
  };

  return (
    <div className="common-filter_container">
      <div className="common-filter_filter-container">
        {/* <DatePicker
          style={{ fontSize: 6 }}
          className="date-picker"
          placeholder="Ngày bắt đầu"
          onChange={onChangeStartDate}
        />
        <DatePicker
          style={{ fontSize: 6 }}
          className="date-picker"
          placeholder="Ngày kết thúc"
          onChange={onChangeEndDate}
        /> */}
        <RangePicker placeholder={["Ngày bắt đầu", "Ngày kết thúc"]} />

        <RangeDatePicker />
      </div>
      <div className="common-filter_button-container">
        <Button onClick={onReset}>Reset</Button>
        <Button type="primary" onClick={onClick}>
          Tìm kiếm
        </Button>
      </div>
    </div>
  );
};
export default CommonFilter;
