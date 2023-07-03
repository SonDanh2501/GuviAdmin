import { useCallback, useEffect, useState } from "react";

import "./styles.scss";
import { deleteFileImage, getListImageApi } from "../../../../../api/file";
import { useSelector } from "react-redux";
import { getLanguageState } from "../../../../../redux/selectors/auth";
import i18n from "../../../../../i18n";
import { Drawer, Dropdown, Image, Pagination, Space } from "antd";
import { MoreOutlined } from "@ant-design/icons";
import LoadingPagination from "../../../../../components/paginationLoading";
import { errorNotify } from "../../../../../helper/toast";
import moment from "moment";
import ModalCustom from "../../../../../components/modalCustom";

const ImageManage = () => {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [startPage, setStartPage] = useState(0);
  const [itemEdit, setItemEdit] = useState();
  const [itemDelete, setItemDelete] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [modal, setModal] = useState(false);

  const lang = useSelector(getLanguageState);
  useEffect(() => {
    getListImageApi(0, 50)
      .then((res) => {
        setData(res?.data);
        setTotal(res?.totalItem);
      })
      .catch((err) => {});
  }, []);

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  const onChange = (page) => {
    setCurrentPage(page);
    const lengthData = data.length < 50 ? 50 : data.length;
    const start = page * lengthData - lengthData;
    setStartPage(start);
    getListImageApi(start, 50)
      .then((res) => {
        setData(res?.data);
        setTotal(res?.totalItem);
      })
      .catch((err) => {});
  };

  const deleteArrImage = () => {
    setIsLoading(true);
    deleteFileImage({ id_files: itemDelete })
      .then((res) => {
        setIsLoading(false);
        setModal(false);
        setItemDelete([]);
        getListImageApi(startPage, 50)
          .then((res) => {
            setData(res?.data);
            setTotal(res?.totalItem);
          })
          .catch((err) => {});
      })
      .catch((err) => {
        setIsLoading(false);
        errorNotify({
          message: err,
        });
      });
  };

  const onChooseMultiple = useCallback(
    (_id) => {
      if (itemDelete.some((item) => item === _id)) {
        function filterByID(item) {
          if (item !== _id) {
            return true;
          }
          return false;
        }

        setItemDelete((prev) => prev.filter(filterByID));
      } else {
        setItemDelete((prev) => [...prev, _id]);
      }
    },
    [itemDelete]
  );

  const items = [
    {
      key: "1",
      label: (
        <a onClick={() => setModal(true)}>{`${i18n.t("delete", {
          lng: lang,
        })}`}</a>
      ),
    },
    {
      key: "2",
      label: <a onClick={showDrawer}>{`${i18n.t("detail", { lng: lang })}`}</a>,
    },
  ];

  return (
    <div>
      <h5> {`${i18n.t("image_management", { lng: lang })}`}</h5>
      {itemDelete.length > 0 && (
        <div className="div-item-select-delete">
          <a className="text-select">{itemDelete.length} được chọn</a>
          <i class="uil uil-trash-alt" onClick={() => setModal(true)}></i>
        </div>
      )}

      <h6 className="mt-5">File</h6>
      <div className="div-list-image">
        {data?.map((item, index) => {
          return (
            <div
              key={index}
              onClick={() => onChooseMultiple(item?._id)}
              className={
                itemDelete.some((items) => items === item?._id)
                  ? "div-item-list-image-select"
                  : "div-item-list-image"
              }
            >
              <div className="div-name-image">
                <a>{item?.title.slice(0, 10)}...</a>
                <Dropdown
                  menu={{
                    items,
                  }}
                >
                  <a
                    onClick={(e) => {
                      e.preventDefault();
                      setItemEdit(item);
                    }}
                  >
                    <Space>
                      <i class="uil uil-ellipsis-v icon_menu"></i>
                    </Space>
                  </a>
                </Dropdown>
              </div>
              <Image src={item?.link_url} className="image" preview={false} />
            </div>
          );
        })}
      </div>

      <div className="mt-5 div-pagination p-2">
        <a>
          {`${i18n.t("total", { lng: lang })}`}: {total}
        </a>
        <div>
          <Pagination
            current={currentPage}
            onChange={onChange}
            total={total}
            showSizeChanger={false}
            pageSize={50}
          />
        </div>
      </div>

      <div>
        <Drawer
          title={`${i18n.t("detail", { lng: lang })}`}
          placement="right"
          onClose={onClose}
          open={open}
          headerStyle={{ height: 50 }}
        >
          <div className="div-detail-image">
            <a className="title-image">Tên</a>
            <a>{itemEdit?.title}</a>
            <Image
              src={itemEdit?.link_url}
              style={{
                width: "100%",
                height: 200,
                marginTop: 20,
                marginBottom: 20,
              }}
            />
            <a className="title-image">Ngày tạo</a>
            <a>{moment(itemEdit?.date_create).format("DD/MM/YYYY - hh:MM")}</a>
          </div>
        </Drawer>
      </div>

      <div>
        <ModalCustom
          title={`${i18n.t("delete_image", { lng: lang })}`}
          isOpen={modal}
          handleCancel={() => setModal(false)}
          handleOk={() => deleteArrImage()}
          textOk={`${i18n.t("delete", { lng: lang })}`}
        />
      </div>

      {isLoading && <LoadingPagination />}
    </div>
  );
};

export default ImageManage;
