import { useCallback, useEffect, useState } from "react";

import "./styles.scss";
import {
  deleteFileImage,
  getListImageApi,
  postFile,
} from "../../../../../api/file";
import { useSelector } from "react-redux";
import { getLanguageState } from "../../../../../redux/selectors/auth";
import i18n from "../../../../../i18n";
import { Button, Drawer, Dropdown, Image, Pagination, Space } from "antd";
import { MoreOutlined } from "@ant-design/icons";
import LoadingPagination from "../../../../../components/paginationLoading";
import { errorNotify } from "../../../../../helper/toast";
import moment from "moment";
import ModalCustom from "../../../../../components/modalCustom";
import resizeFile from "../../../../../helper/resizer";

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
    deleteFileImage({ id_files: [itemEdit?._id] })
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

  const onChangeThumbnail = async (e) => {
    setIsLoading(true);
    if (e.target.files[0]) {
      const reader = new FileReader();
      // reader.addEventListener("load", () => {
      //   setImg(reader.result);
      // });
      reader.readAsDataURL(e.target.files[0]);
    }
    const file = e.target.files[0];
    const image = await resizeFile(file);
    const formData = new FormData();
    formData.append("multi-files", image);
    postFile(formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
      .then((res) => {
        getListImageApi(startPage, 50)
          .then((res) => {
            setData(res?.data);
            setTotal(res?.totalItem);
          })
          .catch((err) => {});
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
        errorNotify({
          message: err,
        });
      });
  };

  const copyLink = (text) => {
    window.prompt("Copy to clipboard: Ctrl+C, Enter", text);
  };

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

      <label for="choose-image" className="add-image">
        Thêm hình mới
      </label>

      <input
        name="image"
        type="file"
        placeholder=""
        accept={".jpg,.png,.jpeg"}
        id="choose-image"
        onChange={onChangeThumbnail}
      />

      <h6 className="mt-5">File</h6>
      <div className="div-list-image">
        {data?.map((item, index) => {
          return (
            <div key={index} className={"div-item-list-image"}>
              <div className="div-name-image">
                <a>{item?.title.slice(0, 10)}...</a>
                <Dropdown
                  menu={{
                    items,
                  }}
                  trigger={"click"}
                >
                  <a
                    onClick={(e) => {
                      setItemEdit(item);
                      e.preventDefault();
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
            <Image src={itemEdit?.link_url} className="image_detail" />
            <a className="title-image">Ngày tạo</a>
            <a>{moment(itemEdit?.date_create).format("DD/MM/YYYY - HH:mm")}</a>
            <a className="title-image">Link</a>
            <a className="title-link">{itemEdit?.link_url}</a>
            <Button
              onClick={() => navigator.clipboard.writeText(itemEdit?.link_url)}
              style={{ width: "auto", marginTop: 20 }}
            >
              Copy Link
            </Button>
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
