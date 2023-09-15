import React, { memo, useState } from "react";
import i18n from "../../../i18n";
import { Dropdown, Pagination, Space, Table } from "antd";
import { StarFilled } from "@ant-design/icons";
import { UilEllipsisV } from "@iconscout/react-unicons";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useCookies } from "../../../helper/useCookies";
import useWindowDimensions from "../../../helper/useWindowDimensions";
import { formatMoney } from "../../../helper/formatMoney";
import { useWindowScrollPositions } from "../../../helper/useWindowPosition";
import moment from "moment";
import { Spin, Image } from 'antd';
import {
    getElementState,
    getLanguageState,
} from "../../../redux/selectors/auth";
import "./style.scss";
import gold from "../../../assets/images/iconGold.svg";
import member from "../../../assets/images/iconMember.svg";
import platinum from "../../../assets/images/iconPlatinum.svg";
import silver from "../../../assets/images/iconSilver.svg";

const DataTable = (props) => {
    const {
        columns,
        data,
        actionColumn,
        start,
        pageSize,
        totalItem
        // items
        // currentPage,
        // setCurrentPage
        // page,
        // totalItem,
        // startItem
    } = props;
    const checkElement = useSelector(getElementState);
    const lang = useSelector(getLanguageState);
    const [saveToCookie] = useCookies();
    const { width } = useWindowDimensions();
    const timeWork = (data) => {
        const start = moment(new Date(data.date_work)).format("HH:mm");
        const timeEnd = moment(new Date(data.date_work))
            .add(data?.total_estimate, "hours")
            .format("HH:mm");
        return start + " - " + timeEnd;
    };
    const { scrollY } = useWindowScrollPositions();
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [item, setItem] = useState(data[0]);
    const [currentPage, setCurrentPage] = useState(1);
    // const [items3, setItems3] = useState(items);
    // let items3 = [...items]


    let headerTable = []
    const [hidePhone, setHidePhone] = useState(false);
    const [rowIndex, setRowIndex] = useState();

    console.log(width, 'width');
    for (const item of columns) {
        const temp = {
            title: () => {
                if (item.i18n_title) {
                    return (
                        <p className="title-column">{`${i18n.t(`${item.i18n_title}`, {
                            lng: lang,
                        })}`}</p>
                    );
                } else {
                    return (
                        <p className="title-column">{item.title}</p>
                    );
                }
            },
            render: (data, record, index) => {
                switch (item.key) {
                    case "id_view":
                        const linkRedirect = `/details-order/${data?.id_group_order}`
                        return (
                            <Link
                                onClick={() => saveToCookie("order_scrolly", scrollY)}
                                to={linkRedirect}
                            >
                                <p className="text-id-view-order">{data?.id_view}</p>
                            </Link>
                        )
                        break;
                    case "date_create":
                        return (
                            <div className="div-create-order">
                                <p className="text-create">
                                    {moment(new Date(data?.date_create)).format("DD/MM/YYYY")}
                                </p>
                                <p className="text-create">
                                    {moment(new Date(data?.date_create)).format("HH:mm")}
                                </p>
                            </div>
                        )
                        break;
                    case "customer-phone":
                        return (
                            <Link to={`/profile-customer/${data?.id_customer?._id}`}>
                                <div className="div-name-order-cutomer">
                                    
                                    <p className="text-name-customer">
                                        {data?.id_customer?.full_name}
                                    </p>
                                    <p className="text-phone-order-customer">
                                        {data?.id_customer?.phone}
                                    </p>
                                </div>
                            </Link>
                        );
                        break;
                    case "service":
                        return (
                            <div className="div-service-order">
                                <p className="text-service">
                                    {data?.type === "loop" && data?.is_auto_order
                                        ? `${i18n.t("repeat", { lng: lang })}`
                                        : data?.service?._id?.kind === "giup_viec_theo_gio"
                                            ? `${i18n.t("cleaning", { lng: lang })}`
                                            : data?.service?._id?.kind === "giup_viec_co_dinh"
                                                ? `${i18n.t("cleaning_subscription", { lng: lang })}`
                                                : data?.service?._id?.kind === "phuc_vu_nha_hang"
                                                    ? `${i18n.t("serve", { lng: lang })}`
                                                    : data?.service?._id?.kind === "ve_sinh_may_lanh"
                                                        ? `${i18n.t("Máy lạnh", { lng: lang })}`
                                                        : ""}
                                </p>
                                <p className="text-service">{timeWork(data)}</p>
                            </div>
                        );
                        break;
                    case "date_work":
                        return (
                            <div className="div-worktime-order">
                                <p className="text-worktime">
                                    {moment(new Date(data?.date_work)).format("DD/MM/YYYY")}
                                </p>
                                <p className="text-worktime">
                                    {moment(new Date(data?.date_work)).locale(lang).format("dddd")}
                                </p>
                            </div>
                        )
                    case "collaborator":
                        return (
                            <>
                                {!data?.id_collaborator ? (
                                    <p className="text-pending-search">{`${i18n.t("searching", {
                                        lng: lang,
                                    })}`}</p>
                                ) : (
                                    <Link
                                        to={`/details-collaborator/${data?.id_collaborator?._id}`}
                                        className="div-name-order"
                                    >
                                        <div className="div-name-star">
                                            <p className="text-collaborator">
                                                {data?.id_collaborator?.full_name}
                                            </p>
                                            {data?.id_collaborator?.star && (
                                                <div className="div-star">
                                                    <p className="text-star">{data?.id_collaborator?.star}</p>
                                                    <StarFilled className="icon-star" />
                                                </div>
                                            )}
                                        </div>
                                        <p className="text-phone">{data?.id_collaborator?.phone}</p>
                                    </Link>
                                )}
                            </>
                        )
                    case "status":
                        return (
                            <div className="text-status-order">
                            <p
                                className={
                                    data?.status === "pending"
                                        ? "text-pen-order"
                                        : data?.status === "confirm"
                                            ? "text-confirm-order"
                                            : data?.status === "doing"
                                                ? "text-doing-order"
                                                : data?.status === "done"
                                                    ? "text-done-order"
                                                    : "text-cancel-order"
                                }
                            >
                                {data?.status === "pending"
                                    ? `${i18n.t("pending", { lng: lang })}`
                                    : data?.status === "confirm"
                                        ? `${i18n.t("confirm", { lng: lang })}`
                                        : data?.status === "doing"
                                            ? `${i18n.t("doing", { lng: lang })}`
                                            : data?.status === "done"
                                                ? `${i18n.t("complete", { lng: lang })}`
                                                : `${i18n.t("cancel", { lng: lang })}`}
                            </p>
                            </div>

                        )
                    case "pay":
                        return (
                            <div className="div-payment">
                                <p className="text-payment-method">
                                    {data?.payment_method === "cash"
                                        ? `${i18n.t("cash", { lng: lang })}`
                                        : data?.payment_method === "point"
                                            ? `${i18n.t("wallet_gpay", { lng: lang })}`
                                            : ""}
                                </p>
                                <p className="text-payment-method">
                                    {formatMoney(data?.final_fee)}
                                </p>
                            </div>
                        )
                    case "customer":
                        return (
                            <Link
                                to={
                                    checkElement?.includes("detail_customer")
                                        ? `/profile-customer/${data?._id}`
                                        : ""
                                }
                                className="div-name-customer"
                            >
                                <Image
                                    preview={false}
                                    src={
                                        data?.rank_point < 100
                                            ? member
                                            : data?.rank_point >= 100 && data?.rank_point < 300
                                                ? silver
                                                : data?.rank_point >= 300 && data?.rank_point < 1500
                                                    ? gold
                                                    : platinum
                                    }
                                    style={{ width: 20, height: 20 }}
                                />
                                <p className="text-name-customer"> {data?.full_name}</p>
                            </Link>
                        )
                    case "phone":
                        const phone = data?.phone.slice(0, 7);
                        return (
                            <div className="hide-phone">
                                <p className="text-phone">
                                    {rowIndex === index
                                        ? hidePhone
                                            ? data?.phone
                                            : phone + "***"
                                        : phone + "***"}
                                </p>
                                <p
                                    className="btn-eyes"
                                    onClick={() =>
                                        rowIndex === index
                                            ? setHidePhone(!hidePhone)
                                            : setHidePhone(!hidePhone)
                                    }
                                >
                                    {rowIndex === index ? (
                                        hidePhone ? (
                                            <i class="uil uil-eye"></i>
                                        ) : (
                                            <i class="uil uil-eye-slash"></i>
                                        )
                                    ) : (
                                        <i class="uil uil-eye-slash"></i>
                                    )}
                                </p>
                            </div>
                        );
                    case "nearest_order":
                        return (
                            <>
                                {data?.id_group_order ? (
                                    <Link to={`/details-order/${data?.id_group_order}`}>
                                        <p className="text-id-order">{data?.id_view_group_order}</p>
                                    </Link>
                                ) : (
                                    <p className="text-address-customer">{`${i18n.t("not_available", {
                                        lng: lang,
                                    })}`}</p>
                                )}
                            </>
                        );
                    case "money":
                        return (
                            <p className="text-address-customer">
                                {formatMoney(data?.total_price)}
                            </p>
                        )
                        case "address":
                            return (
                                <p className="text-address-order">
                                    {data.address}
                                </p>
                            )
                    default:
                        const dataView = data[item.dataIndex] || "";
                        return (
                            <p > {dataView}</p>
                        )
                        break;
                }
            },
            width: item.width || 20
        };
        headerTable.push(temp)
    }
    if(actionColumn) headerTable.push(actionColumn)
    
    const calculateCurrentPage = (event) => {
        setCurrentPage(event)
        props.onCurrentPageChange((event * pageSize) - pageSize);
    }

    // const onChange = (page) => {
    //     setCurrentPage(page);
    //     saveToCookie("page_order", page);
    //     const dataLength = data.length < 20 ? 20 : data.length;
    //     const start = page * dataLength - dataLength;
    //     setStartPage(start);
    //     saveToCookie("start_order", start);
    //     getOrderApi(
    //       valueSearch,
    //       start,
    //       20,
    //       status,
    //       kind,
    //       type,
    //       startDate,
    //       endDate,
    //       city,
    //       ""
    //     )
    //       .then((res) => {
    //         setData(res?.data);
    //         setTotal(res?.totalItem);
    //       })
    //       .catch((err) => {});
    //   };


    return (
        <React.Fragment>
            <div className="mt-3">
                <Table
                    columns={headerTable}
                    dataSource={data}
                    pagination={false}
                    scroll={{ x: 1500 }}
                    onRow={(record, rowIndex) => {
                        return {
                          onClick: (event) => {
                            setItem(record)
                            props.onValueChange(record);
                          },
                        };
                      }}
                />
            </div>

            <div className="mt-2 div-pagination-order p-2">
          <p>
            {`${i18n.t("total", { lng: lang })}`}: {totalItem}
          </p>
          <div>
            <Pagination
              current={currentPage}
              onChange={calculateCurrentPage}
              total={totalItem}
              showSizeChanger={false}
              pageSize={20}
            />
          </div>
        </div>

            {/* {isLoading && <LoadingPagination />} */}
        </React.Fragment>
    );
}

export default memo(DataTable);