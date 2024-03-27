import { Button, DatePicker } from "antd";
import RangeDatePicker from "../../datePicker/RangeDatePicker";
import React, { useEffect, useState } from "react";

const CommonFilter = (props) => {
  const { setReturnValue, dataFilter, onClick, onReset } = props;
  const onChangeStartDate = (date, dateString) => {
    console.log("=>> ", date, dateString);
  };
  const onChangeEndDate = (date, dateString) => {
    console.log("=>> ", date, dateString);
  };
  const [ui, setUi] = useState([
    // {
    //  return <p></p>
    // }
  ]);
  useEffect(() => {
    dataFilter = a;
  }, [dataFilter]);

  return (
    <div className="common-filter_container">
      {ui.map((item, index) => {
        return <div key={index}>{item}</div>;
      })}
    </div>
  );
};
export default React.memo(CommonFilter);

const a = [
  {
    title: "Đối tượng",
    data: [
      {
        lable: "Kh",
        value: "customer",
      },
      {
        lable: "CTV",
        value: "collaborator",
      },
      {
        lable: "Khác",
        value: "other",
      },
    ],
  },
];
