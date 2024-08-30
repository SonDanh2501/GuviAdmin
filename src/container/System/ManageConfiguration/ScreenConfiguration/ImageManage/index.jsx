import { useEffect, useState } from "react";

import { Button, Drawer, Dropdown, Image, Pagination, Space } from "antd";
import moment from "moment";
import { useSelector } from "react-redux";
import {
  deleteFileImage,
  getListImageApi,
  postFile,
} from "../../../../../api/file";
import ModalCustom from "../../../../../components/modalCustom";
import LoadingPagination from "../../../../../components/paginationLoading";
import resizeFile from "../../../../../helper/resizer";
import { errorNotify } from "../../../../../helper/toast";
import i18n from "../../../../../i18n";
import { getLanguageState } from "../../../../../redux/selectors/auth";
import "./styles.scss";

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
        // console.log("check res >>>", res);
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
          message: err?.message,
        });
      });
  };

  const onChangeThumbnail = async (e) => {
    setIsLoading(true);
    const extend = e.target.files[0].type.slice(
      e.target.files[0].type.indexOf("/") + 1
    );
    if (e.target.files[0]) {
      const reader = new FileReader();
      // reader.addEventListener("load", () => {
      //   setImg(reader.result);
      // });
      reader.readAsDataURL(e.target.files[0]);
    }
    const file = e.target.files[0];
    const image = await resizeFile(file, extend);
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
          message: err?.message,
        });
      });
  };

  const items = [
    {
      key: "1",
      label: (
        <p className="m-0" onClick={() => setModal(true)}>{`${i18n.t("delete", {
          lng: lang,
        })}`}</p>
      ),
    },
    {
      key: "2",
      label: (
        <p className="m-0" onClick={showDrawer}>{`${i18n.t("detail", {
          lng: lang,
        })}`}</p>
      ),
    },
  ];

  return (
    <div className="div-container-image">
      <h5> {`${i18n.t("image_management", { lng: lang })}`}</h5>
      {itemDelete.length > 0 && (
        <div className="div-item-select-delete">
          <p className="text-select m-0">{itemDelete.length} được chọn</p>
          <i className="uil uil-trash-alt" onClick={() => setModal(true)}></i>
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
                <p className="m-0">{item?.title.slice(0, 10)}...</p>
                <Dropdown
                  menu={{
                    items,
                  }}
                  trigger={"click"}
                >
                  <p
                    className="m-0"
                    onClick={(e) => {
                      setItemEdit(item);
                      e.preventDefault();
                    }}
                  >
                    <Space>
                      <i className="uil uil-ellipsis-v icon_menu"></i>
                    </Space>
                  </p>
                </Dropdown>
              </div>
              <Image src={item?.link_url} className="image" preview={false} />
            </div>
          );
        })}
      </div>

      <div className="mt-5 div-pagination p-2">
        <p>
          {`${i18n.t("total", { lng: lang })}`}: {total}
        </p>
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

      <Drawer
        title={`${i18n.t("detail", { lng: lang })}`}
        placement="right"
        onClose={onClose}
        open={open}
        headerStyle={{ height: 50 }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <p style={{ fontSize: 14, fontWeight: 600, margin: 0 }}>Tên</p>
          <p className="m-0">{itemEdit?.title}</p>
          <Image
            src={itemEdit?.link_url}
            style={{
              width: "100%",
              height: 200,
              objectFit: "cover",
              borderRadius: 8,
              marginTop: 10,
            }}
          />
          <p style={{ fontSize: 14, fontWeight: 600, margin: 0 }}>Ngày tạo</p>
          <p className="m-0">
            {moment(itemEdit?.date_create).format("DD/MM/YYYY - HH:mm")}
          </p>
          <p style={{ fontSize: 14, fontWeight: 600, margin: 0 }}>Link</p>
          <p
            style={{
              fontSize: 12,
              width: 400,
              wordWrap: "break-word",
              margin: 0,
            }}
          >
            {itemEdit?.link_url}
          </p>
          <Button
            onClick={() => navigator.clipboard.writeText(itemEdit?.link_url)}
            style={{ width: "auto", marginTop: 20 }}
          >
            Copy Link
          </Button>
        </div>
      </Drawer>

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
