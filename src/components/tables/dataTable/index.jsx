import React, { memo, useEffect, useState } from "react";
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
import LoadingPagination from "../../../components/paginationLoading";

const DataTable = (props) => {
    const {
        columns,
        data,
        actionColumn,
        start,
        pageSize,
        totalItem,
        detectLoading
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
    let widthPage = 0;
    let headerTable = []
    const [hidePhone, setHidePhone] = useState(false);
    const [rowIndex, setRowIndex] = useState(0);


    useEffect(() => {
        setIsLoading(false)
    }, [data]);

    useEffect(() => {
        setIsLoading(true)
    }, [detectLoading]);



    const HeaderTitle = (title) => {
        return (
            <React.Fragment>
            <p className="title-column">{title}</p>
            </React.Fragment>
        )
    }


    for (const item of columns) {
        const title = (item.i18n_title) ? i18n.t(`${item.i18n_title}`, {lng: lang}) : item.title;


        const temp: any = {
            title: () => {

                if(item.customTitle) {
                    return item.customTitle
                } else {
                    return (
                        <>
                        <p className={`title-column ${item?.fontSize}`}>{title}</p>
                        </>
                    )
                }



                // if (item.i18n_title) {
                //     return (
                //         <p className="title-column">{`${i18n.t(`${item.i18n_title}`, {
                //             lng: lang,
                //         })}`}</p>
                //     );
                // } else {
                //     return (
                //         <p className="title-column">{item.title}</p>
                //     );
                // }
            },
            render: (data, record, index) => {
                let linkRedirect = `#`
                switch (item.key) {
                    case "id_view":
                        return (
                            <p>{data[item.dataIndex]}</p>
                        )
                        break;
                    case "code_order":
                        linkRedirect = `/details-order/${data?.id_group_order}`
                        return (
                            <Link
                                onClick={() => saveToCookie("order_scrolly", scrollY)}
                                to={linkRedirect}
                            >
                                <p className={`text-id-code-order ${item?.fontSize}`}>{data?.id_view}</p>
                            </Link>
                        )
                        break;
                    case "code_customer":
                        linkRedirect = checkElement?.includes("detail_customer") ? `/profile-customer/${data?._id}` : ""
                        return (
                            <Link
                                onClick={() => saveToCookie("order_scrolly", scrollY)}
                                to={linkRedirect}
                            >
                                <p className={`text-id-code-customer ${item?.fontSize}`}>{data?.id_view}</p>
                            </Link>
                        )
                        break;
                    case "date_create":
                        return (
                            <div className="div-date-create">
                                <p className={`${item?.fontSize}`}>
                                    {moment(new Date(data?.date_create)).format("DD/MM/YYYY")}
                                </p>
                                <p className={`${item?.fontSize}`}>
                                    {moment(new Date(data?.date_create)).format("HH:mm")}
                                </p>
                            </div>
                        )
                        break;
                    case "customer-name-phone":
                        return (
                            <Link to={`/profile-customer/${data?.id_customer?._id}`}>
                                <div className="div-customer-name-phone">
                                    <p className={`text-name-customer ${item?.fontSize}`}>
                                        {data?.id_customer?.full_name || data?.full_name}
                                    </p>
                                    <p className={`text-phone-customer ${item?.fontSize}`}>
                                        {data?.id_customer?.phone || data?.phone}
                                    </p>
                                </div>
                            </Link>
                        );
                        break;
                    case "service":
                        return (
                            <div>
                                <p className={`${item?.fontSize}`}>
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
                                <p className={`${item?.fontSize}`}>{timeWork(data)}</p>
                            </div>
                        );
                        break;
                    case "date_work":
                        return (
                            <div className="div-date-work">
                                <p className={`text-worktime ${item?.fontSize}`}>
                                    {moment(new Date(data?.date_work)).format("DD/MM/YYYY")}
                                </p>
                                <p className={`text-worktime ${item?.fontSize}`}>
                                    {moment(new Date(data?.date_work)).locale(lang).format("dddd")}
                                </p>
                            </div>
                        )
                        break;
                    case "collaborator":
                        return (
                            <>
                                <div className="div-collaborator">
                                    {!data?.id_collaborator ? (
                                        <p className={`text-pending-search ${item?.fontSize}`}>{`${i18n.t("searching", {
                                            lng: lang,
                                        })}`}</p>
                                    ) : (
                                        <Link
                                            to={`/details-collaborator/${data?.id_collaborator?._id}`}
                                            className="div-name-star"
                                        >
                                            <div className="div-name">
                                                <p className={`${item?.fontSize}`}>
                                                    {data?.id_collaborator?.full_name}
                                                </p>
                                            </div>
                                            <div className="div-phone-star">
                                                <p className={`${item?.fontSize}`}>{data?.id_collaborator?.phone}</p>
                                                {data?.id_collaborator?.star && (
                                                    <div className="div-star">
                                                        <StarFilled className="icon-star" />
                                                        <p className={`text-star ${item?.fontSize}`}>{data?.id_collaborator?.star}</p>

                                                    </div>
                                                )}
                                            </div>
                                        </Link>
                                    )}
                                </div>
                            </>
                        )
                        break;
                    case "status":
                        return (
                            <div className="div-status-order">
                                <span
                                    className={`text-star ${item?.fontSize} ${data?.status === "pending"
                                        ? "text-status-pending"
                                        : data?.status === "confirm"
                                            ? "text-status-confirm"
                                            : data?.status === "doing"
                                                ? "text-status-doing"
                                                : data?.status === "done"
                                                    ? "text-status-done"
                                                    : "text-status-cancel"
                                        }`}
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
                                </span>
                            </div>

                        )
                        break;
                    case "pay":
                        return (
                            <div className="div-payment">
                                <p className={`text-payment-method ${item?.fontSize}`}>
                                    {data?.payment_method === "cash"
                                        ? `${i18n.t("cash", { lng: lang })}`
                                        : data?.payment_method === "point"
                                            ? `${i18n.t("wallet_gpay", { lng: lang })}`
                                            : ""}
                                </p>
                                <p className={`text-payment-method ${item?.fontSize}`}>
                                    {formatMoney(data?.final_fee)}
                                </p>
                            </div>
                        )
                        break;
                    case "name_customer":
                        return (
                            <Link
                                to={
                                    checkElement?.includes("detail_customer")
                                        ? `/profile-customer/${data?._id}`
                                        : ""
                                }
                                className="name_customer"
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
                                <span className={`text-name-customer ${item?.fontSize}`}> {data?.full_name}</span>
                            </Link>
                        )
                        break;
                    case "nearest_order":
                        return (
                            <>
                                {data?.id_group_order ? (
                                    <Link to={`/details-order/${data?.id_group_order}`}>
                                        <p className={`text-id-code-order ${item?.fontSize}`}>{data?.id_view_group_order}</p>
                                    </Link>
                                ) : (
                                    <p className={`${item?.fontSize}`}>{`${i18n.t("not_available", {
                                        lng: lang,
                                    })}`}</p>
                                )}
                            </>
                        );
                        break;
                    case "address":
                        const temp = item.dataIndex.split(".");
                        let getData = data[temp[0]];
                        for (let i = 1; i < temp.length; i++) {
                            if (getData === undefined || getData === null) {
                                getData = ""
                                break;
                            }
                            getData = getData[temp[i]]
                        }
                        const indexSlice = getData.length - 75;
                        const viewAddress = (indexSlice > 0) ? getData.slice(0, 75) + "..." : getData;
                        return (
                            <p className={`text-address-order ${item?.fontSize}`}>
                                {getData !== "" ? viewAddress : `${i18n.t("not_available", { lng: lang })}`}
                            </p>
                        )
                        break;
                    case "phone_action_hide":
                        const phone = data?.phone.slice(0, 7);
                        return (
                            <div className="hide-phone">
                                <p className={`phone-text ${item?.fontSize}`}>
                                    {rowIndex === index
                                        ? hidePhone
                                            ? data?.phone
                                            : phone + "***"
                                        : phone + "***"}
                                </p>
                                <p className="btn-eyes"
                                    onClick={() => rowIndex === index ? setHidePhone(!hidePhone) : setHidePhone(!hidePhone)}>
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
                        )
                        break;
                    case "total_order":
                        return (
                            <p className={`text-address-customer ${item?.fontSize}`}>
                                {data[item.dataIndex] || 0}
                            </p>
                        )
                        break;
                    case "description_request":
                        return (
                            <p className={`text-address-customer ${item?.fontSize}`}>
                                {data[item.dataIndex] || 0}
                            </p>
                        )
                        break;
                    case "status_request":
                        return (
                            <div className="status_request">
                                {data?.status === "done" ? (
                                    <p className={`text-contacted ${item?.fontSize}`}>
                                        {`${i18n.t("contacted", { lng: lang })}`}
                                    </p>
                                ) : (
                                    <div className="div-uncontact">
                                        <p className="text-uncontact">{`${i18n.t("not_contacted", {
                                            lng: lang,
                                        })}`}</p>
                                        {checkElement?.includes("contact_request_service") && (
                                            <div className="btn-contacted-deep2" onClick={toggleModal} >
                                                <p className="text-btn-contact">{`${i18n.t("contact", {
                                                    lng: lang,
                                                })}`}</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )
                        break;
                    case "user_contact":
                        return (
                            <>
                                <div className="user_contact">
                                    {data?.status === "done" ? (
                                        <>
                                            <p className={`text-user ${item?.fontSize}`}> {data?.full_name_admin}</p>
                                            <p className={`${item?.fontSize}`}>
                                                {moment(new Date(data?.date_admin_contact_create)).format("DD/MM/YYYY")}
                                            </p>
                                            <p className={`${item?.fontSize}`}>
                                                {moment(new Date(data?.date_admin_contact_create)).format("HH:mm")}
                                            </p>
                                        </>
                                    ) : (<></>)
                                    }
                                </div>
                            </>
                        )
                        break;

                    case "money": {
                            return (
                                <p className={`text-address-customer ${item?.fontSize}`}>
                                    {formatMoney(data[item.dataIndex] || 0)}
                                </p>
                            )
                            break;
                    }
                    case "percent": {
                        return (
                            <p className={`text-address-customer ${item?.fontSize}`}>
                                {data[item.dataIndex]} %
                            </p>
                        )
                        break;
                    }
                    case "punish": {
                        return (
                            <p className={`text-user ${item?.fontSize}`}> {data?.punish}</p>
                        )
                        break;
                    }
                    case "date_hour": {
                        return (
                            <div className="div-date-create">
                                <p className={`${item?.fontSize}`}>
                                    {moment(new Date(data[item.dataIndex])).format("DD/MM/YYYY")}
                                </p>
                                <p className={`${item?.fontSize}`}>
                                    {moment(new Date(data[item.dataIndex])).format("HH:mm")}
                                </p>
                            </div>
                        )
                        break;
                    }
                    case "id_view_group_report": {
                        return (


                            <Link to={`/details-order/${data?.id_group_order?._id}`}>
                            <p className={`${item?.fontSize}`}>
                              {data?.id_group_order?.id_view}
                            </p>
                          </Link>

                        )
                        break;
                    }
                    default: {
                        const dataView = data[item.dataIndex] || "";
                        return (
                            <p className={`${item?.fontSize}`}> {dataView}</p>
                        )
                        break;
                    }

                }
            },
            width: item.width || 100,
            // sorter: (a, b) => {a[item.dataIndex] - b[item.dataIndex]},
            // align: "center",
        };
        headerTable.push(temp)
        widthPage += Number(temp.width);
    }
    if (actionColumn) headerTable.push(actionColumn)

    const calculateCurrentPage = (event) => {
        setCurrentPage(event)
        if (props.onCurrentPageChange) {
            setIsLoading(true);
            props.onCurrentPageChange((event * pageSize) - pageSize);
        }
    }

    const toggleModal = (event) => {
        if(props.onToggleModal) props.onToggleModal(true);
    }

    const onSort = (typeSort, valueSort) => {
        
    }

    return (
        <React.Fragment>

            {/* <div className="mt-2 p-2 pagination">
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
                        hideOnSinglePage={true}
                    />
                </div>
            </div> */}


            <div className="mt-3">
                <Table
                    columns={headerTable}
                    dataSource={data}
                    pagination={false}
                    scroll={{ x: widthPage }}
                    loading={isLoading}
                    onRow={(record, rowIndex) => {
                        return {
                            onClick: (event) => {
                                setItem(record)
                                setRowIndex(rowIndex)
                                if (props.getItemRow) props.getItemRow(record);
                            },
                        };
                    }}
                />
            </div>

            <div className="mt-2 p-2 pagination">
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
                        hideOnSinglePage={true}
                    />
                </div>
            </div>

            {/* {isLoading && <LoadingPagination />} */}
        </React.Fragment>
    );
}

export default memo(DataTable);