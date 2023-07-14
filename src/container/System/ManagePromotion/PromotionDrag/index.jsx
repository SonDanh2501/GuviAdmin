import { useEffect, useState } from "react";
import "./styles.scss";
import { useLocation } from "react-router-dom";
import {
  fetchPromotion,
  getPromotionByPosition,
  updatePositionPromotion,
} from "../../../../api/promotion";
import { Button, Image } from "antd";
import { errorNotify } from "../../../../helper/toast";
import LoadingPagination from "../../../../components/paginationLoading";

const PromotionDrag = () => {
  const { state } = useLocation();
  const { type, brand, idService, exchange } = state || {};
  const [data, setData] = useState([]);
  const [item, setItem] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [draggedItem, setDraggedItem] = useState();

  useEffect(() => {
    getPromotionByPosition()
      .then((res) => {
        setData(res?.data);
      })
      .catch((err) => {});
  }, []);

  const onDragStart = (e, index) => {
    setDraggedItem(data[index]);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/html", e.target.parentNode);
    e.dataTransfer.setDragImage(e.target.parentNode, 20, 20);
  };

  const onDragOver = (index) => {
    const draggedOverItem = data[index];
    // if the item is dragged over itself, ignore
    if (draggedItem === draggedOverItem) {
      return;
    }
    // filter out the currently dragged item
    let items = data.filter((item) => item !== draggedItem);
    items.splice(index, 0, draggedItem);

    for (let i = 0; i < items.length; i++) {
      const arr = [...items];
      items[i].position = i;
      setData(arr);
    }

    for (let i = 0; i < items.length; i++) {
      item.push({
        _id: items[i]._id,
        position: i,
      });
    }
  };

  const onDragEnd = () => {
    setDraggedItem(null);
  };

  const onUpdatePositon = () => {
    setIsLoading(true);
    updatePositionPromotion({
      arr_promotion: item,
    })
      .then((res) => {
        setIsLoading(false);
        getPromotionByPosition()
          .then((res) => {
            setData(res?.data);
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

  return (
    <div>
      <h5>Thay đổi vị trí mã khuyến mãi</h5>
      <Button onClick={onUpdatePositon}>Cập nhật</Button>
      <div className="div-list-item-image">
        {data?.map((item, index) => {
          return (
            <div
              className="item"
              key={index}
              onDragOver={() => onDragOver(index)}
            >
              <div
                className="body-item"
                draggable
                onDragStart={(e) => onDragStart(e, index)}
                onDragEnd={onDragEnd}
              >
                <Image src={item?.thumbnail} className="img-promotion" />
                <a className="text-title">{item?.title?.vi}</a>
              </div>
            </div>
          );
        })}
      </div>

      {isLoading && <LoadingPagination />}
    </div>
  );
};

export default PromotionDrag;
