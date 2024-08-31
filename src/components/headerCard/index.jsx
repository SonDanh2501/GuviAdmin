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
            <span className="text-date-same mr-1 text-gray-700/80">Mốc thời gian:</span>
            <span className='font-medium'>
              {moment(startDate).format("DD/MM/YYYY")}-
              {moment(endDate).format("DD/MM/YYYY")}
            </span>
          </div>
        </>
      )}
    </div>
  );
};

export default HeaderCard