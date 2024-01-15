import { StarFilled } from "@ant-design/icons";
import { Button, Image } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ModalCustom from "../../../components/modalCustom";

const InfoCollaborator = (props) => {
  const { full_name, avatar, phone, birthday, _id, star } = props.info;
  const list_block = props.list_block;
  const list_favourite = props.list_favourite;
  const [age, setAge] = useState(0);
  const [isFavourite, setIsFavourite] = useState(false);
  const [isBlock, setIsBlock] = useState(false);
  const [modalBlock, setModalBlock] = useState(false);
  const [modalFavourite, setModalFavourite] = useState(false);
  useEffect(() => {
    const tempAge = birthday ? moment().diff(birthday, "years") : 0;
    setAge(tempAge);
    setIsBlock(list_block.includes(_id));
    setIsFavourite(list_favourite.includes(_id));
  }, [props]);

  const handleFavourite = () => {
    setIsFavourite(!isFavourite);
    setModalFavourite(false);
  };
  const handleBlock = () => {
    setIsBlock(!isBlock);
    setModalBlock(false);
  };
  return (
    <>
      <section className="info-collaborator">
        <h5>Cộng Tác viên hiện tại</h5>
        <section className="container-button-favourite-block">
          <Button
            onClick={() => setModalFavourite(true)}
            className={
              isFavourite ? "col-button-favourite" : "col-button-unfavourite"
            }
          >
            <span>{isFavourite ? "Bỏ yêu thích" : "Yêu thích"}</span>
          </Button>
          <Button
            onClick={() => setModalBlock(true)}
            className={
              isBlock ? "col-button-favourite" : "col-button-unfavourite"
            }
          >
            <span>{isBlock ? "Bỏ hạn chế" : "Hạn chế"}</span>
          </Button>
        </section>
        <div className="info-collaborator_container">
          <Image className="avatar" src={avatar} />
          <ul>
            <li>
              <Link to={`/details-collaborator/${_id}`}>Tên: {full_name}</Link>
            </li>
            <li>SĐT: {phone}</li>
            <li>Tuổi: {age} tuổi</li>
            <li>
              Số sao: {star} <StarFilled style={{ color: "#f2cc0e" }} />
            </li>
          </ul>
        </div>
      </section>
      <ModalCustom
        isOpen={modalBlock}
        title={isBlock ? "Bỏ chặn cộng tác viên" : "Chặn công tác viên"}
        handleOk={handleBlock}
        textOk={isBlock ? "Bỏ hạn chế" : "Hạn chế"}
        handleCancel={() => setModalBlock(false)}
        body={
          <p>
            {isBlock
              ? `Bạn có chắc muốn bỏ chặn cộng tác viên ${full_name} cho khách hàng ${full_name}`
              : `Bạn có chắc muốn chặn công tác viên ${full_name} cho khách hàng ${full_name}`}
          </p>
        }
      />

      <ModalCustom
        isOpen={modalFavourite}
        title={isFavourite ? "Bỏ yêu cộng tác viên" : "Yêu thích công tác viên"}
        handleOk={handleFavourite}
        textOk={isFavourite ? "Bỏ yêu thích" : "Yêu thích"}
        handleCancel={() => setModalFavourite(false)}
        body={
          <p>
            {isFavourite
              ? `Bạn có chắc muốn bỏ yêu thích cộng tác viên ${full_name} cho khách hàng ${full_name}`
              : `Bạn có chắc muốn thêm công tác viên yêu thích ${full_name} cho khách hàng ${full_name}`}
          </p>
        }
      />
    </>
  );
};
export default InfoCollaborator;
