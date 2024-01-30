import moment from "moment";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  getReportBalanceCollaborator,
  getReportDetailBalanceCollaborator,
  getReportDetailBalanceCustomer,
} from "../../../api/finance";
import CustomDatePicker from "../../../components/customDatePicker";
import LoadingPagination from "../../../components/paginationLoading";
import { formatMoney } from "../../../helper/formatMoney";
import { errorNotify } from "../../../helper/toast";
import i18n from "../../../i18n";
import { getLanguageState } from "../../../redux/selectors/auth";
import "./index.scss";
import { Pagination, Table } from "antd";
import { Link } from "react-router-dom";
import { useCookies } from "../../../helper/useCookies";
import useWindowDimensions from "../../../helper/useWindowDimensions";

const ManageFinance = () => {
  const [totalEndingRemainder, setTotalEndingRemainder] = useState(0);
  const [totalOpeningRemainder, setTotalOpeningRemainder] = useState(0);
  const [totalEndingGiftRemainder, setTotalEndingGiftRemainder] = useState(0);
  const [totalOpeningGiftRemainder, setTotalOpeningGiftRemainder] = useState(0);
  const [totalEndingPayPoint, setTotalEndingPayPoint] = useState(0);
  const [totalOpeningPayPoint, setTotalOpeningPayPoint] = useState(0);
  const [startDate, setStartDate] = useState(
    moment().startOf("weeks").toISOString()
  );
  const [endDate, setEndDate] = useState(moment().endOf("date").toISOString());
  const [isLoading, setIsLoading] = useState(false);
  const [tab, setTab] = useState("collaborator");
  const [ballanceCollaborator, setBallanceCollaborator] = useState([]);
  const [totalCollaborator, setTotalCollaborator] = useState(0);
  const [ballanceCustomer, setBallanceCustomer] = useState([]);
  const [totalCustomer, setTotalCustomer] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageCustomer, setCurrentPageCustomer] = useState(1);
  const [startPage, setStartPage] = useState(0);
  const [startPageCustomer, setStartPageCustomer] = useState(0);
  const [saveToCookie, readCookie] = useCookies();
  const { width } = useWindowDimensions();
  const lang = useSelector(getLanguageState);

  useEffect(() => {
    setIsLoading(true);
    getReportBalanceCollaborator(0, 20, startDate, endDate)
      .then((res) => {
        setTotalOpeningRemainder(res?.total_opening_remainder);
        setTotalEndingRemainder(res?.total_ending_remainder);
        setTotalOpeningGiftRemainder(res?.total_opening_gift_remainder);
        setTotalEndingGiftRemainder(res?.total_ending_gift_remainder);
        setTotalOpeningPayPoint(res?.total_opening_pay_point);
        setTotalEndingPayPoint(res?.total_ending_pay_point);
        setIsLoading(false);
      })
      .catch((err) => {});
    getReportDetailBalanceCollaborator(startPage, 20, startDate, endDate)
      .then((res) => {
        setBallanceCollaborator(res?.data);
        setTotalCollaborator(res?.total);
        setIsLoading(false);
      })
      .catch((err) => {});

    getReportDetailBalanceCustomer(startPageCustomer, 20, startDate, endDate)
      .then((res) => {
        setBallanceCustomer(res?.data);
        setTotalCustomer(res?.total);
        setIsLoading(false);
      })
      .catch((err) => {});

    setTab(
      readCookie("tab_finance") === ""
        ? "collaborator"
        : readCookie("tab_finance")
    );
  }, []);

  const onChangeDay = () => {
    setIsLoading(true);
    getReportBalanceCollaborator(0, 20, startDate, endDate)
      .then((res) => {
        setIsLoading(false);
        setTotalOpeningRemainder(res?.total_opening_remainder);
        setTotalEndingRemainder(res?.total_ending_remainder);
        setTotalOpeningGiftRemainder(res?.total_opening_gift_remainder);
        setTotalEndingGiftRemainder(res?.total_ending_gift_remainder);
        setTotalOpeningPayPoint(res?.total_opening_pay_point);
        setTotalEndingPayPoint(res?.total_ending_pay_point);
      })
      .catch((err) => {
        errorNotify({
          message: err?.message,
        });
        setIsLoading(false);
      });

    getReportDetailBalanceCollaborator(startPage, 20, startDate, endDate)
      .then((res) => {
        setBallanceCollaborator(res?.data);
        setTotalCollaborator(res?.total);
      })
      .catch((err) => {});

    getReportDetailBalanceCustomer(startPageCustomer, 20, startDate, endDate)
      .then((res) => {
        setBallanceCustomer(res?.data);
        setTotalCustomer(res?.total);
      })
      .catch((err) => {});
  };

  const onChange = (page) => {
    tab === "collaborator"
      ? setCurrentPage(page)
      : setCurrentPageCustomer(page);
    setCurrentPage(page);
    const collaboratorLength =
      ballanceCollaborator?.length < 20 ? 20 : ballanceCollaborator.length;
    const customerLength =
      ballanceCustomer?.length < 20 ? 20 : ballanceCollaborator.length;
    const startCollaborator = page * collaboratorLength - collaboratorLength;
    const startCustomer = page * customerLength - customerLength;
    tab === "collaborator"
      ? setStartPage(startCollaborator)
      : setStartPageCustomer(startCustomer);
    tab === "collaborator"
      ? getReportDetailBalanceCollaborator(
          startCollaborator,
          20,
          startDate,
          endDate
        )
          .then((res) => {
            setBallanceCollaborator(res?.data);
            setTotalCollaborator(res?.total);
          })
          .catch((err) => {})
      : getReportDetailBalanceCustomer(startCustomer, 20, startDate, endDate)
          .then((res) => {
            setBallanceCustomer(res?.data);
            setTotalCustomer(res?.total);
          })
          .catch((err) => {});
  };

  const columns =
    tab === "collaborator"
      ? [
          {
            title: () => {
              return <p className="title-column">Thời gian</p>;
            },
            render: (data) => {
              return (
                <div className="div-date-create">
                  <p className="text-date">
                    {moment(data?.date_create).format("DD/MM/YYYY")}
                  </p>
                  <p className="text-date">
                    {moment(data?.date_create).format("HH:mm")}
                  </p>
                </div>
              );
            },
          },
          {
            title: () => {
              return <p className="title-column">Cộng tác viên</p>;
            },
            render: (data) => {
              return (
                <Link
                  to={`/details-collaborator/${data?.id_collaborator?._id}`}
                  className="div-name-ctv"
                >
                  <p className="text-ctv">{data?.id_collaborator?.full_name}</p>
                  <p className="text-ctv">{data?.id_collaborator?.phone}</p>
                </Link>
              );
            },
          },
          {
            title: () => {
              return <p className="title-column">Nội dung</p>;
            },
            render: (item) => {
              const subject = item?.id_user_system
                ? item?.title_admin.replace(
                    item?.id_user_system?._id,
                    item?.id_user_system?.full_name
                  )
                : item?.id_admin_action
                ? item?.title_admin.replace(
                    item?.id_admin_action?._id,
                    item?.id_admin_action?.full_name
                  )
                : item?.id_customer
                ? item?.title_admin.replace(
                    item?.id_customer?._id,
                    item?.id_customer?.full_name
                  )
                : item?.id_collaborator
                ? item?.title_admin.replace(
                    item?.id_collaborator?._id,
                    item?.id_collaborator?.full_name
                  )
                : item?.title_admin.replace(
                    item?.id_promotion?._id,
                    item?.id_promotion?.code
                  );

              const predicate = item?.id_punish
                ? subject.replace(
                    item?.id_punish?._id,
                    item?.id_punish?.note_admin
                  )
                : item?.id_reason_punish
                ? subject.replace(
                    item?.id_reason_punish?._id,
                    item?.id_reason_punish?.title?.vi
                  )
                : item?.id_order
                ? subject.replace(item?.id_order?._id, item?.id_order?.id_view)
                : item?.id_reward
                ? subject.replace(
                    item?.id_reward?._id,
                    item?.id_reward?.title?.vi
                  )
                : item?.id_info_reward_collaborator
                ? subject.replace(
                    item?.id_info_reward_collaborator?._id,
                    item?.id_info_reward_collaborator?.id_reward_collaborator
                      ?.title?.vi
                  )
                : item?.id_transistion_collaborator
                ? subject.replace(
                    item?.id_transistion_collaborator?._id,
                    item?.id_transistion_collaborator?.transfer_note
                  )
                : item?.id_collaborator
                ? subject.replace(
                    item?.id_collaborator?._id,
                    item?.id_collaborator?.full_name
                  )
                : item?.id_customer
                ? subject.replace(
                    item?.id_customer?._id,
                    item?.id_customer?.full_name
                  )
                : item?.id_promotion
                ? subject.replace(
                    item?.id_promotion?._id,
                    item?.id_promotion?.title?.vi
                  )
                : item?.id_admin_action
                ? subject.replace(
                    item?.id_admin_action?._id,
                    item?.id_admin_action?.full_name
                  )
                : item?.id_address
                ? subject.replace(item?.id_address, item?.value_string)
                : subject.replace(
                    item?.id_transistion_customer?._id,
                    item?.id_transistion_customer?.transfer_note
                  );

              const object = item?.id_reason_cancel
                ? predicate.replace(
                    item?.id_reason_cancel?._id,
                    item?.id_reason_cancel?.title?.vi
                  )
                : item?.id_collaborator
                ? predicate.replace(
                    item?.id_collaborator?._id,
                    item?.id_collaborator?.full_name
                  )
                : item?.id_customer
                ? predicate.replace(
                    item?.id_customer?._id,
                    item?.id_customer?.full_name
                  )
                : item?.id_address
                ? predicate.replace(item?.id_address, item?.value_string)
                : item?.id_order
                ? predicate.replace(
                    item?.id_order?._id,
                    item?.id_order?.id_view
                  )
                : item?.id_transistion_collaborator
                ? predicate.replace(
                    item?.id_transistion_collaborator?._id,
                    item?.id_transistion_collaborator?.transfer_note
                  )
                : predicate.replace(
                    item?.id_transistion_customer?._id,
                    item?.id_transistion_customer?.transfer_note
                  );
              return <p className="text-content">{object}</p>;
            },
          },
          {
            title: () => {
              return <p className="title-column">Ví chính</p>;
            },
            render: (data) => {
              return (
                <div className="div-current-remainder">
                  <p className="text-money">
                    {formatMoney(data?.current_remainder)}
                  </p>

                  {data?.status_current_remainder === "down" ? (
                    <i className="uil uil-arrow-down icon-deduction"></i>
                  ) : data?.status_current_remainder === "up" ? (
                    <i className="uil uil-arrow-up icon-plus"></i>
                  ) : (
                    <i className="uil uil-minus icon-minus"></i>
                  )}
                </div>
              );
            },
          },
          {
            title: () => {
              return <p className="title-column">Ví thưởng</p>;
            },
            render: (data) => {
              return (
                <div className="div-current-remainder">
                  <p className="text-money">
                    {formatMoney(data?.current_gift_remainder)}
                  </p>

                  {data?.status_current_gift_remainder === "down" ? (
                    <i className="uil uil-arrow-down icon-deduction"></i>
                  ) : data?.status_current_gift_remainder === "up" ? (
                    <i className="uil uil-arrow-up icon-plus"></i>
                  ) : (
                    <i className="uil uil-minus icon-minus"></i>
                  )}
                </div>
              );
            },
          },
        ]
      : [
          {
            title: () => {
              return <p className="title-column">Thời gian</p>;
            },
            render: (data) => {
              return (
                <div className="div-date-create">
                  <p className="text-date">
                    {moment(data?.date_create).format("DD/MM/YYYY")}
                  </p>
                  <p className="text-date">
                    {moment(data?.date_create).format("HH:mm")}
                  </p>
                </div>
              );
            },
          },
          {
            title: () => {
              return <p className="title-column">Khách hàng</p>;
            },
            render: (data) => {
              return (
                <Link
                  to={`/profile-customer/${data?.id_customer?._id}`}
                  className="div-name-ctv"
                >
                  <p className="text-ctv">{data?.id_customer?.full_name}</p>
                  <p className="text-ctv">{data?.id_customer?.phone}</p>
                </Link>
              );
            },
          },
          {
            title: () => {
              return <p className="title-column">Nội dung</p>;
            },
            render: (item) => {
              const subject = item?.id_user_system
                ? item?.title_admin.replace(
                    item?.id_user_system?._id,
                    item?.id_user_system?.full_name
                  )
                : item?.id_admin_action
                ? item?.title_admin.replace(
                    item?.id_admin_action?._id,
                    item?.id_admin_action?.full_name
                  )
                : item?.id_customer
                ? item?.title_admin.replace(
                    item?.id_customer?._id,
                    item?.id_customer?.full_name
                  )
                : item?.id_collaborator
                ? item?.title_admin.replace(
                    item?.id_collaborator?._id,
                    item?.id_collaborator?.full_name
                  )
                : item?.title_admin.replace(
                    item?.id_promotion?._id,
                    item?.id_promotion?.code
                  );

              const predicate = item?.id_punish
                ? subject.replace(
                    item?.id_punish?._id,
                    item?.id_punish?.note_admin
                  )
                : item?.id_reason_punish
                ? subject.replace(
                    item?.id_reason_punish?._id,
                    item?.id_reason_punish?.title?.vi
                  )
                : item?.id_order
                ? subject.replace(item?.id_order?._id, item?.id_order?.id_view)
                : item?.id_reward
                ? subject.replace(
                    item?.id_reward?._id,
                    item?.id_reward?.title?.vi
                  )
                : item?.id_info_reward_collaborator
                ? subject.replace(
                    item?.id_info_reward_collaborator?._id,
                    item?.id_info_reward_collaborator?.id_reward_collaborator
                      ?.title?.vi
                  )
                : item?.id_transistion_collaborator
                ? subject.replace(
                    item?.id_transistion_collaborator?._id,
                    item?.id_transistion_collaborator?.transfer_note
                  )
                : item?.id_collaborator
                ? subject.replace(
                    item?.id_collaborator?._id,
                    item?.id_collaborator?.full_name
                  )
                : item?.id_customer
                ? subject.replace(
                    item?.id_customer?._id,
                    item?.id_customer?.full_name
                  )
                : item?.id_promotion
                ? subject.replace(
                    item?.id_promotion?._id,
                    item?.id_promotion?.title?.vi
                  )
                : item?.id_admin_action
                ? subject.replace(
                    item?.id_admin_action?._id,
                    item?.id_admin_action?.full_name
                  )
                : item?.id_address
                ? subject.replace(item?.id_address, item?.value_string)
                : subject.replace(
                    item?.id_transistion_customer?._id,
                    item?.id_transistion_customer?.transfer_note
                  );

              const object = item?.id_reason_cancel
                ? predicate.replace(
                    item?.id_reason_cancel?._id,
                    item?.id_reason_cancel?.title?.vi
                  )
                : item?.id_collaborator
                ? predicate.replace(
                    item?.id_collaborator?._id,
                    item?.id_collaborator?.full_name
                  )
                : item?.id_customer
                ? predicate.replace(
                    item?.id_customer?._id,
                    item?.id_customer?.full_name
                  )
                : item?.id_address
                ? predicate.replace(item?.id_address, item?.value_string)
                : item?.id_order
                ? predicate.replace(
                    item?.id_order?._id,
                    item?.id_order?.id_view
                  )
                : item?.id_transistion_collaborator
                ? predicate.replace(
                    item?.id_transistion_collaborator?._id,
                    item?.id_transistion_collaborator?.transfer_note
                  )
                : predicate.replace(
                    item?.id_transistion_customer?._id,
                    item?.id_transistion_customer?.transfer_note
                  );
              return <p className="text-content">{object}</p>;
            },
          },
          {
            title: () => {
              return <p className="title-column">Ví chính</p>;
            },
            render: (data) => {
              return (
                <div className="div-current-remainder">
                  <p className="text-money">
                    {formatMoney(data?.current_remainder)}
                  </p>
                  <p>
                    {data?.status_current_remainder === "down" ? (
                      <i className="uil uil-arrow-down icon-deduction"></i>
                    ) : data?.status_current_remainder === "up" ? (
                      <i className="uil uil-arrow-up icon-plus"></i>
                    ) : (
                      <i className="uil uil-minus icon-minus"></i>
                    )}
                  </p>
                </div>
              );
            },
          },
          {
            title: () => {
              return <p className="title-column">Ví thưởng</p>;
            },
            render: (data) => {
              return (
                <div className="div-current-remainder">
                  <p className="text-money">
                    {formatMoney(data?.current_gift_remainder)}
                  </p>

                  {data?.status_current_gift_remainder === "down" ? (
                    <i className="uil uil-arrow-down icon-deduction"></i>
                  ) : data?.status_current_gift_remainder === "up" ? (
                    <i className="uil uil-arrow-up icon-plus"></i>
                  ) : (
                    <i className="uil uil-minus icon-minus"></i>
                  )}
                </div>
              );
            },
          },
        ];

  return (
    <>
      <h5>{`${i18n.t("wallet_balance", { lng: lang })}`}</h5>
      <div className="div-date-finance">
        <CustomDatePicker
          setStartDate={setStartDate}
          setEndDate={setEndDate}
          onClick={onChangeDay}
          onCancel={() => {}}
          setSameStart={() => {}}
          setSameEnd={() => {}}
        />
        {startDate && (
          <p className="text-date m-0 ml-2">
            {moment(new Date(startDate)).format("DD/MM/YYYY")} -{" "}
            {moment(new Date(endDate)).format("DD/MM/YYYY")}
          </p>
        )}
      </div>
      <div className="div-contai-wallet">
        <p className="text-beginnig">{`${i18n.t("beginning", {
          lng: lang,
        })}`}</p>
        <div className="div-wallet-row">
          <div className="div-item-wallet">
            <p className="text-name-wallet">{`${i18n.t(
              "main_wallet_collaborator",
              { lng: lang }
            )}`}</p>
            <p className="text-money-remainder">
              {formatMoney(totalOpeningRemainder)}
            </p>
          </div>
          <div className="div-item-wallet">
            <p className="text-name-wallet">{`${i18n.t(
              "collaborator_gift_wallet",
              { lng: lang }
            )}`}</p>
            <p className="text-money-gift">
              {formatMoney(totalOpeningGiftRemainder)}
            </p>
          </div>
          <div className="div-item-wallet-last">
            <p className="text-name-wallet">{`${i18n.t("customer_wallet", {
              lng: lang,
            })}`}</p>
            <p className="text-money-paypoint">
              {formatMoney(totalOpeningPayPoint)}
            </p>
          </div>
        </div>
      </div>
      <div className="div-contai-wallet mt-3">
        <p className="text-beginnig">{`${i18n.t("end_of_term", {
          lng: lang,
        })}`}</p>
        <div className="div-wallet-row">
          <div className="div-item-wallet">
            <p className="text-name-wallet">{`${i18n.t(
              "main_wallet_collaborator",
              { lng: lang }
            )}`}</p>
            <p className="text-money-remainder">
              {formatMoney(totalEndingRemainder)}
            </p>
          </div>
          <div className="div-item-wallet">
            <p className="text-name-wallet">{`${i18n.t(
              "collaborator_gift_wallet",
              { lng: lang }
            )}`}</p>
            <p className="text-money-gift">
              {formatMoney(totalEndingGiftRemainder)}
            </p>
          </div>
          <div className="div-item-wallet-last">
            <p className="text-name-wallet">{`${i18n.t("customer_wallet", {
              lng: lang,
            })}`}</p>
            <p className="text-money-paypoint">
              {formatMoney(totalEndingPayPoint)}
            </p>
          </div>
        </div>
      </div>
      <div className="div-tab-finance">
        {DATA?.map((item, index) => {
          return (
            <div
              key={index}
              onClick={() => {
                setTab(item?.value);
                saveToCookie("tab_finance", item?.value);
              }}
              className={
                tab === item?.value ? "div-item-tab-select" : "div-item-tab"
              }
            >
              <p className="text-tab">{item?.title}</p>
            </div>
          );
        })}
      </div>
      <div className="mt-3">
        <Table
          dataSource={
            tab === "collaborator" ? ballanceCollaborator : ballanceCustomer
          }
          columns={columns}
          pagination={false}
          scroll={{ x: width < 900 ? 1000 : 0 }}
          expandable={
            width <= 490
              ? {
                  expandedRowRender: (record) => {
                    const subject = record?.id_user_system
                      ? record?.title_admin.replace(
                          record?.id_user_system?._id,
                          record?.id_user_system?.full_name
                        )
                      : record?.id_admin_action
                      ? record?.title_admin.replace(
                          record?.id_admin_action?._id,
                          record?.id_admin_action?.full_name
                        )
                      : record?.id_customer
                      ? record?.title_admin.replace(
                          record?.id_customer?._id,
                          record?.id_customer?.full_name
                        )
                      : record?.id_collaborator
                      ? record?.title_admin.replace(
                          record?.id_collaborator?._id,
                          record?.id_collaborator?.full_name
                        )
                      : record?.title_admin.replace(
                          record?.id_promotion?._id,
                          record?.id_promotion?.code
                        );

                    const predicate = record?.id_punish
                      ? subject.replace(
                          record?.id_punish?._id,
                          record?.id_punish?.note_admin
                        )
                      : record?.id_reason_punish
                      ? subject.replace(
                          record?.id_reason_punish?._id,
                          record?.id_reason_punish?.title?.vi
                        )
                      : record?.id_order
                      ? subject.replace(
                          record?.id_order?._id,
                          record?.id_order?.id_view
                        )
                      : record?.id_reward
                      ? subject.replace(
                          record?.id_reward?._id,
                          record?.id_reward?.title?.vi
                        )
                      : record?.id_info_reward_collaborator
                      ? subject.replace(
                          record?.id_info_reward_collaborator?._id,
                          record?.id_info_reward_collaborator
                            ?.id_reward_collaborator?.title?.vi
                        )
                      : record?.id_transistion_collaborator
                      ? subject.replace(
                          record?.id_transistion_collaborator?._id,
                          record?.id_transistion_collaborator?.transfer_note
                        )
                      : record?.id_collaborator
                      ? subject.replace(
                          record?.id_collaborator?._id,
                          record?.id_collaborator?.full_name
                        )
                      : record?.id_customer
                      ? subject.replace(
                          record?.id_customer?._id,
                          record?.id_customer?.full_name
                        )
                      : record?.id_promotion
                      ? subject.replace(
                          record?.id_promotion?._id,
                          record?.id_promotion?.title?.vi
                        )
                      : record?.id_admin_action
                      ? subject.replace(
                          record?.id_admin_action?._id,
                          record?.id_admin_action?.full_name
                        )
                      : record?.id_address
                      ? subject.replace(
                          record?.id_address,
                          record?.value_string
                        )
                      : subject.replace(
                          record?.id_transistion_customer?._id,
                          record?.id_transistion_customer?.transfer_note
                        );

                    const object = record?.id_reason_cancel
                      ? predicate.replace(
                          record?.id_reason_cancel?._id,
                          record?.id_reason_cancel?.title?.vi
                        )
                      : record?.id_collaborator
                      ? predicate.replace(
                          record?.id_collaborator?._id,
                          record?.id_collaborator?.full_name
                        )
                      : record?.id_customer
                      ? predicate.replace(
                          record?.id_customer?._id,
                          record?.id_customer?.full_name
                        )
                      : record?.id_address
                      ? predicate.replace(
                          record?.id_address,
                          record?.value_string
                        )
                      : record?.id_order
                      ? predicate.replace(
                          record?.id_order?._id,
                          record?.id_order?.id_view
                        )
                      : record?.id_transistion_collaborator
                      ? predicate.replace(
                          record?.id_transistion_collaborator?._id,
                          record?.id_transistion_collaborator?.transfer_note
                        )
                      : predicate.replace(
                          record?.id_transistion_customer?._id,
                          record?.id_transistion_customer?.transfer_note
                        );
                    return (
                      <div className="detail-finance-table">
                        <div className="div-text">
                          <p className="title-detail">Nội dung:</p>
                          <p className="text-detail-finance">{object} </p>
                        </div>
                        <div className="div-text">
                          <p className="title-detail">Ví chính:</p>
                          <p className="text-detail-finance">
                            {formatMoney(record?.current_remainder)}{" "}
                            {record?.status_current_remainder === "down" ? (
                              <i className="uil uil-arrow-down icon-deduction"></i>
                            ) : record?.status_current_remainder === "up" ? (
                              <i className="uil uil-arrow-up icon-plus"></i>
                            ) : (
                              <i className="uil uil-minus icon-minus"></i>
                            )}
                          </p>
                        </div>
                        <div className="div-text">
                          <p className="title-detail">Ví thưởng:</p>
                          <p className="text-detail-finance">
                            {formatMoney(record?.current_gift_remainder)}{" "}
                            {record?.status_current_gift_remainder ===
                            "down" ? (
                              <i className="uil uil-arrow-down icon-deduction"></i>
                            ) : record?.status_current_gift_remainder ===
                              "up" ? (
                              <i className="uil uil-arrow-up icon-plus"></i>
                            ) : (
                              <i className="uil uil-minus icon-minus"></i>
                            )}
                          </p>
                        </div>
                      </div>
                    );
                  },
                }
              : ""
          }
        />
        <div className="div-pagination p-2">
          <p>
            Tổng: {tab === "collaborator" ? totalCollaborator : totalCustomer}
          </p>
          <div>
            <Pagination
              current={
                tab === "collaborator" ? currentPage : currentPageCustomer
              }
              onChange={onChange}
              total={tab === "collaborator" ? totalCollaborator : totalCustomer}
              showSizeChanger={false}
              pageSize={20}
            />
          </div>
        </div>
      </div>

      {isLoading && <LoadingPagination />}
    </>
  );
};

export default ManageFinance;

const DATA = [
  { value: "collaborator", title: "Cộng tác viên" },
  { value: "customer", title: "Khách hàng" },
];
