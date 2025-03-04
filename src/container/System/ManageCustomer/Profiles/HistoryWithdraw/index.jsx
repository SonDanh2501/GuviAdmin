import React, { useEffect, useState } from "react";
import "./index.scss";
import { getListHisorityWithdrawApi } from "../../../../../api/affiliate";
import { errorNotify } from "../../../../../helper/toast";
import DataTable from "../../../../../components/tables/dataTable";
import CustomHeaderDatatable from "../../../../../components/tables/tableHeader";

const HistoryWithdraw = (props) => {
  const { id } = props;
  const [lengthPage, setLengthPage] = useState(25);

  /* ~~~ Value ~~~ */
  const [isLoading, setIsLoading] = useState(false);
  const [listDataHistoryWithdraw, setListDataHistoryWithdraw] = useState([]);
  const [startPageHistoryDiscount, setStartPageHistoryDiscount] = useState(0); // Giá trị phần tử bắt đầu hiển thị
  /* ~~~ List ~~~ */
  const columns = [
    {
      customTitle: (
        <CustomHeaderDatatable title="STT" textToolTip="Số thứ tự" />
      ),
      dataIndex: "",
      key: "ordinal",
      width: 20,
    },
    {
      customTitle: (
        <CustomHeaderDatatable
          title="Ngày tạo"
          textToolTip="Ngày tạo của lệnh giao dịch"
        />
      ),
      dataIndex: "date_create",
      key: "date_create",
      width: 30,
      position: "center",
    },
    {
      customTitle: (
        <CustomHeaderDatatable
          title="Trạng thái"
          textToolTip="Trạng thái hiện tại của lệnh giao dịch"
        />
      ),
      dataIndex: "status",
      key: "transfer_status",
      width: 35,
    },
    {
      customTitle: (
        <CustomHeaderDatatable
          title="Số tiền"
          textToolTip="Giá trị của giao dịch"
          position="right"
        />
      ),
      dataIndex: "money",
      key: "money",
      width: 35,
    },
  ];
  /* ~~~ Handle function ~~~ */
  const fetchDataHistoryWithdraw = async () => {
    try {
      setIsLoading(true);
      const res = await getListHisorityWithdrawApi(
        id,
        startPageHistoryDiscount,
        lengthPage,
        "",
        ""
      );
      setListDataHistoryWithdraw(res);
      setIsLoading(false);
    } catch (err) {
      errorNotify({
        message: err?.message || err,
      });
    }
  };
  /* ~~~ Use efffect  ~~~ */
  useEffect(() => {
    fetchDataHistoryWithdraw();
  }, [startPageHistoryDiscount, id]);
  const onChangePage = (value) => {
    setStartPageHistoryDiscount(value);
  };
  return (
    <div>
      <>
        <div style={{ padding: "12px" }}>
          <DataTable
            columns={columns}
            data={
              listDataHistoryWithdraw?.data?.length > 0
                ? listDataHistoryWithdraw?.data
                : []
            }
            start={startPageHistoryDiscount}
            pageSize={lengthPage}
            setLengthPage={setLengthPage}
            totalItem={listDataHistoryWithdraw?.totalItem}
            onCurrentPageChange={onChangePage}
            // scrollX={2300}
            loading={isLoading}
            // headerRightContent={
            //   <div className="manage-top-up-with-draw__table--right-header">
            //     <div className="manage-top-up-with-draw__table--right-header--search-field">
            //       <InputTextCustom
            //         type="text"
            //         placeHolderNormal="Tìm kiếm"
            //         onChange={(e) => {
            //           handleSearch(e.target.value);
            //         }}
            //       />
            //     </div>
            //   </div>
            // }
          />
        </div>
      </>
    </div>
  );
};

export default HistoryWithdraw;
