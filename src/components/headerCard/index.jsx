import React, { useState } from 'react'
import RangeDatePicker from '../datePicker/RangeDatePicker';
import moment from 'moment';
import "./index.scss";
const HeaderCard = (props) => {
  const { calendar } = props;
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  // console.log("check >>>", calendar);
  return (
    <div className="header-card card-shadow">
      {calendar && (
        <>
          <RangeDatePicker
            setStartDate={setStartDate}
            setEndDate={setEndDate}
          />
          <div className="div-same">
            <p className="text-date-same">
              Mốc thời gian: {moment(startDate).format("DD/MM/YYYY")}-
              {moment(endDate).format("DD/MM/YYYY")}
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default HeaderCard