import { Card, Pagination } from "antd";
import moment from "moment";
import { memo, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getCollaboratorRemainder,
  getHistoryCollaboratorRemainder,
  getListTransitionByCollaborator,
  getTransitionDetailsCollaborator,
} from "../../../../../../../api/collaborator";
import { formatMoney } from "../../../../../../../helper/formatMoney";
import { errorNotify } from "../../../../../../../helper/toast";
import i18n from "../../../../../../../i18n";
import { loadingAction } from "../../../../../../../redux/actions/loading";
import { getLanguageState } from "../../../../../../../redux/selectors/auth";
import "./index.scss";
import HistoryActivity from "../../../../../../../components/historyActivity";
import CardInfo from "../../../../../../../components/card";
import icons from "../../../../../../../utils/icons";
import DataTable from "../../../../../../../components/tables/dataTable";
import CardBarChart from "../../../../../../../components/card/cardBarChart";
import CardTotalValue from "../../../../../../../components/card/cardTotalValue";

import { IoCubeOutline, IoTrendingUp } from "react-icons/io5";

const {
  IoWalletOutline,
  IoArrowUp,
  IoArrowDown,
  IoPersonOutline,
  IoPerson,
  IoArrowDownCircleOutline,
  IoArrowUpCircleOutline,
} = icons;

const History = ({ id }) => {
  const [collaboratorMoneyHistory, setCollaboratorMoneyHistory] = useState([]); // Giá trị lịch sử dòng tiền của đối tác
  const [collaboratorWithdrawal, setCollaboratorWithdrawal] = useState([]); // Giá trị lịch sử yêu cầu nạp rút của đối tác
  const [startPage, setStartPage] = useState(0);
  const [lengthPage, setLengthPage] = useState(
    JSON.parse(localStorage.getItem("linePerPage"))
      ? JSON.parse(localStorage.getItem("linePerPage")).value
      : 20
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [topup, setTopup] = useState(0);
  const [withdraw, setWithdraw] = useState(0);
  const [remainder, setRemainder] = useState(0);
  const [giftRemainder, setGiftRemainder] = useState(0);
  const [work_wallet, setWorkWallet] = useState(0);
  const [collaborator_wallet, setCollaboratorWallet] = useState(0);
  const dispatch = useDispatch();
  const lang = useSelector(getLanguageState);
  const columns = [
    {
      title: "Ngày tạo",
      key: "withdrawal_date",
      width: 70,
      FontSize: "text-size-M",
    },
    {
      title: "Số tiền",
      key: "withdrawal_money",
      width: 70,
      FontSize: "text-size-M",
    },
    {
      title: "Nạp rút",
      key: "withdrawal_type_transfer",
      width: 70,
      FontSize: "text-size-M",
    },
    {
      title: "Nội dung",
      dataIndex: "transfer_note",
      key: "text",
      width: 70,
      FontSize: "text-size-M",
    },
    {
      title: "Trạng thái",
      key: "transfer_status",
      width: 70,
      FontSize: "text-size-M",
    },
  ];

  const testData = [
    {
      name: "Thg 1",
      value: 4,
    },
    {
      name: "Thg 2",
      value: 5,
    },
    {
      name: "Thg 3",
      value: 6,
    },
    {
      name: "Thg 4",
      value: 7,
    },
    {
      name: "Thg 5",
      value: 1,
    },
    {
      name: "Thg 6",
      value: 7,
    },
    {
      name: "Thg 7",
      value: 7,
    },
    {
      name: "Thg 8",
      value: 9,
    },
    {
      name: "Thg 9",
      value: 11,
    },
    {
      name: "Thg 10",
      value: 5,
    },
    {
      name: "Thg 11",
      value: 13,
    },
    {
      name: "Thg 12",
      value: 1,
    },
  ];
  const onChangePage = (value) => {
    setStartPage(value);
  };
  /* ~~~ Use effect ~~~ */
  // 1. Fetch giá trị lịch sử dòng tiền và dữ liệu tổng nạp, tổng rút khi vào trang lần đầu
  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch(loadingAction.loadingRequest(true));
        // Thực hiện các gọi API song song
        const [historyData, remainderData] = await Promise.all([
          getHistoryCollaboratorRemainder(id, 0, 10), // Fetch dữ liệu lịch sử dòng tiền
          getCollaboratorRemainder(id), // Fetch dữ liệu tổng nạp, tổng rút
        ]);
        // Cập nhật state sau khi nhận dữ liệu từ API
        setCollaboratorMoneyHistory(historyData);
        setWorkWallet(remainderData?.work_wallet);
        setCollaboratorWallet(remainderData?.collaborator_wallet);
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
  // 2. Fetch giá trị yêu cầu nạp rút
  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch(loadingAction.loadingRequest(true));
        // Thực hiện các gọi API song song
        const dataFetchListTransitionByCollaborator =
          await getListTransitionByCollaborator(id, startPage, lengthPage); // Fetch dữ liệu lịch sử yêu cầu nạp rút
        setCollaboratorWithdrawal(dataFetchListTransitionByCollaborator);
      } catch (err) {
        errorNotify({
          message: err?.message,
        });
      } finally {
        dispatch(loadingAction.loadingRequest(false));
      }
    };
    fetchData();
  }, [id, dispatch, startPage, lengthPage]);
  /* ~~~ Handle function ~~~*/
  // 1. Handle qua trang lịch sử dòng tiền của đối tác
  const handleChangePageMoneyHistory = (page) => {
    setCurrentPage(page);
    const dataLength =
      collaboratorMoneyHistory?.data?.length < 10
        ? 10
        : collaboratorMoneyHistory?.data?.length;
    const start = page * dataLength - dataLength;
    getHistoryCollaboratorRemainder(id, start, 10)
      .then((res) => {
        setCollaboratorMoneyHistory(res);
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="collaborator-history">
      <div className="collaborator-history__top">
        {/* <CardInfo
          cardTotal={true}
          cardTotalIcon={IoWalletOutline}
          cardTotalLabel={`${i18n.t("work_wallet", { lng: lang })}`}
          cardTotalValue={formatMoney(work_wallet)}
        />
        <CardInfo
          cardTotal={true}
          cardTotalIcon={IoPerson}
          cardTotalLabel={`${i18n.t("collaborator_wallet", { lng: lang })}`}
          cardTotalValue={formatMoney(collaborator_wallet)}
        />
        <CardInfo
          cardTotal={true}
          cardTotalIcon={IoArrowUp}
          cardTotalLabel="Tổng nạp"
          cardTotalValue={0}
        />
        <CardInfo
          cardTotal={true}
          cardTotalIcon={IoArrowDown}
          cardTotalLabel="Tổng rút"
          cardTotalValue={0}
        /> */}
        <div className="collaborator-history__top--left">
          <CardInfo
            cardContent={
              <CardTotalValue
                label={`${i18n.t("work_wallet", { lng: lang })}`}
                total={formatMoney(work_wallet)}
                previousCompare="0"
                IconComponent={IoWalletOutline}
                color="red"
                horizontal={true}
              />
            }
          />
          <CardInfo
            cardContent={
              <CardTotalValue
                label={`${i18n.t("collaborator_wallet", { lng: lang })}`}
                total={formatMoney(collaborator_wallet)}
                previousCompare="0"
                IconComponent={IoPersonOutline}
                color="orange"
                horizontal={true}
              />
            }
          />
          {/* <CardInfo
            cardContent={
              <CardTotalValue
                label="Tổng nạp"
                total={0}
                previousCompare="0"
                IconComponent={IoArrowUpCircleOutline}
                color="blue"
                horizontal={true}
              />
            }
          />
          <CardInfo
            cardContent={
              <CardTotalValue
                label="Tổng rút"
                total={0}
                previousCompare="0"
                IconComponent={IoArrowDownCircleOutline}
                color="green"
                horizontal={true}
              />
            }
          /> */}
        </div>
        {/* <div className="collaborator-history__top--right">
          <CardInfo
            cardHeader="Thống kê số tiền"
            cardContent={
              <CardBarChart
                data={testData}
                height={190}
                verticalValue="value"
                // verticalLine={true}
                horizontalValue="name"
                horizontalLine={true}
                chartUnit="đánh giá"
                total={20}
                color="#f5d0fe"
                colorTotal="#d946ef"
              />
            }
          />
        </div> */}
      </div>
      <div className="collaborator-history__body">
        <div className="collaborator-history__body--financial-history">
          <div className="collaborator-history__body--financial-history-header">
            <span>Lịch sử dòng tiền</span>
          </div>
          <div className="collaborator-history__body--financial-history-body">
            <HistoryActivity data={collaboratorMoneyHistory?.data} />
            <div className="div-pagination">
              <span>
                {`${i18n.t("total", { lng: lang })}`}:{" "}
                <span style={{ fontWeight: 500 }}>
                  {collaboratorMoneyHistory?.totalItem}
                </span>
              </span>

              <div>
                <Pagination
                  current={currentPage}
                  onChange={handleChangePageMoneyHistory}
                  total={collaboratorMoneyHistory?.totalItem}
                  pageSize={10}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="collaborator-history__body--withdrawal">
          <DataTable
            columns={columns}
            data={
              collaboratorWithdrawal?.data ? collaboratorWithdrawal?.data : []
            }
            start={startPage}
            pageSize={lengthPage}
            setLengthPage={setLengthPage}
            totalItem={collaboratorWithdrawal?.totalItem}
            onCurrentPageChange={onChangePage}
          />
        </div>
      </div>
    </div>
  );
};

export default memo(History);
