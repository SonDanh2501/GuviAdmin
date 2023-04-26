import { Checkbox, Modal } from "antd";
import "./index.scss";
import { memo, useState } from "react";

const RoleAccount = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [role, setRole] = useState(DATA);

  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const onChangeActive = (value, indexRole, indexPer) => {
    const arr = [...role];
    role[indexRole].dropPermission[indexPer].dependency = value;

    if (role[indexRole]?.dropPermission[indexPer]?.dependency === true) {
      role[indexRole]?.dropPermission[indexPer]?.activeLocal?.map((item) => {
        role[indexRole]?.dropPermission?.map((itemDrop) => {
          itemDrop["active"] = true;
        });
      });
    } else {
      role[indexRole]?.dropPermission[indexPer]?.activeLocal?.map((item) => {
        role[indexRole]?.dropPermission?.map((itemDrop) => {
          if (itemDrop?.value !== "get") {
            itemDrop["dependency"] = false;
            itemDrop["active"] = false;
          }
        });
      });
    }

    setRole(arr);
  };

  return (
    <div>
      <div className="div-add-role">
        <a>
          Phân quyền (Lưu ý: mọi chỉnh sửa trên đây chỉ là lưu tạm thời, giá trị
          thay đổi chỉ lưu lại khi bạn bấm nút "Lưu lại")
        </a>
        <button className="btn-add-role" onClick={showModal}>
          Phân quyền
        </button>
      </div>
      <Modal
        width={1000}
        title="Phân quyền"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Lưu lại"
        cancelText="Huỷ"
      >
        <div>
          <div className="div-title-role">
            {role?.map((item, index) => {
              return (
                <div key={index} className="div-item-role">
                  <a className="title-role">{item?.name}</a>
                  {item?.dropPermission?.map((per, i) => {
                    return (
                      <div className="div-item-per" key={i}>
                        <a className="text-name-per">{per?.name}</a>
                        <Checkbox
                          disabled={per?.active === false ? true : false}
                          checked={per?.dependency}
                          onChange={(e) =>
                            onChangeActive(e.target.checked, index, i)
                          }
                        />
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default memo(RoleAccount);

const DATA = [
  {
    id: 1,
    name: "Admin cấp cao",
    dropPermission: [
      {
        value: "get",
        name: "Xem",
        active: true,
        activeLocal: ["add", "edit", "delete"],
        dependency: false,
      },
      {
        value: "add",
        name: "Thêm",
        active: false,
        dependency: false,
      },
      {
        value: "edit",
        name: "Sửa",
        active: false,
        dependency: false,
      },
      {
        value: "delete",
        name: "Xóa",
        active: false,
        dependency: false,
      },
    ],
  },
  {
    id: 2,
    name: "Dưới tay anh Tam",
    dropPermission: [
      {
        value: "get",
        name: "Xem",
        active: true,
        activeLocal: ["delete"],
        dependency: false,
      },
      {
        value: "delete",
        name: "Xóa",
        active: false,
        dependency: false,
      },
    ],
  },
  {
    id: 1,
    name: "Team Nữ quyền",
    dropPermission: [
      {
        value: "get",
        name: "Xem",
        active: true,
        activeLocal: ["add", "edit"],
        dependency: false,
      },
      {
        value: "add",
        name: "Thêm",
        active: false,
        dependency: false,
      },
      {
        value: "edit",
        name: "Sửa",
        active: false,
        dependency: false,
      },
    ],
  },
];
