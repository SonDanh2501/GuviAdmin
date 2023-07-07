import { useState } from "react";
import "./styles.scss";

const PromotionDrag = () => {
  const [data, setData] = useState([
    {
      title: "🍰 Cake",
      value: 0,
    },
    {
      title: "🍩 Donut",
      value: 1,
    },
    {
      title: "🍎 Apple",
      value: 2,
    },
    {
      title: "🍕 Pizza",
      value: 3,
    },
  ]);
  const [draggedItem, setDraggedItem] = useState();

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
      items[i].value = i;
      setData(arr);
    }
  };

  const onDragEnd = () => {
    setDraggedItem(null);
  };

  return (
    <div>
      <ul className="ul-list">
        {data?.map((item, index) => {
          return (
            <li key={index} onDragOver={() => onDragOver(index)}>
              <div
                className="item"
                draggable
                onDragStart={(e) => onDragStart(e, index)}
                onDragEnd={onDragEnd}
              >
                <a>{item?.title}</a>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default PromotionDrag;
