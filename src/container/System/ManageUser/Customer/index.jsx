// import { FloatButton, Select } from "antd";

// import "./index.scss";

// import { useEffect, useState } from "react";
// import { useSelector } from "react-redux";
// import { getGroupCustomerApi } from "../../../../api/promotion";
// import { useCookies } from "../../../../helper/useCookies";
// import { useHorizontalScroll } from "../../../../helper/useSideScroll";
// import useWindowDimensions from "../../../../helper/useWindowDimensions";
// import i18n from "../../../../i18n";
// import { getLanguageState } from "../../../../redux/selectors/auth";
// import UserManage from "./TableCustomer/UserManage";

// const ManageCustomer = () => {
//   const lang = useSelector(getLanguageState);
//   const [dataGroup, setDataGroup] = useState([]);
//   const [idGroup, setIdGroup] = useState("all");
//   const dataTab = [{ value: "all", label: "Tất cả" }];
//   const [saveToCookie, readCookie] = useCookies();
//   const { width } = useWindowDimensions();
//   const scrollRef = useHorizontalScroll();
//   const tab = readCookie("tab-khhang");

//   useEffect(() => {
//     setIdGroup(tab === "" ? "all" : tab);
//     getGroupCustomerApi(0, 20)
//       .then((res) => {
//         setDataGroup(res?.data);
//       })
//       .catch((err) => {});
//   }, [tab]);

//   dataGroup?.map((item) => {
//     return dataTab.push({
//       value: item?._id,
//       label: item?.name,
//     });
//   });

//   return (
//     <>
//       <div className="div-header-customer">
//         <p className="title-cv">{`${i18n.t("list_customer", {
//           lng: lang,
//         })}`}</p>
//       </div>

//       <div className="div-container-customer">
//         {width > 900 ? (
//           <div className="div-tab-customer" ref={scrollRef}>
//             {dataTab?.map((item, index) => {
//               return (
//                 <div
//                   key={index}
//                   className={
//                     idGroup === item?.value
//                       ? "div-item-tab-select"
//                       : "div-item-tab"
//                   }
//                   onClick={() => {
//                     setIdGroup(item?.value);
//                     saveToCookie("tab-khhang", item?.value);
//                   }}
//                 >
//                   <p className="text-tab">{item?.label}</p>
//                 </div>
//               );
//             })}
//           </div>
//         ) : (
//           <Select
//             options={dataTab}
//             value={idGroup}
//             onChange={(e) => {
//               setIdGroup(e);
//               saveToCookie("tab-khhang", e);
//             }}
//           />
//         )}

//         <div className="mt-3">
//           <UserManage status={""} idGroup={idGroup} />
//         </div>
//       </div>
//       <FloatButton.BackTop />
//     </>
//   );
// };

// export default ManageCustomer;
