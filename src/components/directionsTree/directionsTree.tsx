import React, { Fragment, useState, useEffect, useMemo } from "react";

const initialDnDState = {
  draggedFrom: null,
  draggedTo: null,
  isDragging: false,
  originalOrder: [],
  updatedOrder: [],
};

const DirectionsTree = ({value=[], pid=0}) => {
  const [dTree, setDTree] = useState([]);
  const [dragAndDrop, setDragAndDrop] = useState(initialDnDState);

  useEffect(() => {
    console.log("value", value);
    setDTree(value);
  }, [value]);

  const nodes = useMemo(()=>(dTree.filter((l)=>{return Number(l.parent_id) === 0}).sort((a,b)=>(Number(a.rate) - Number(b.rate)))), [dTree]);

  const onDragStart = (event) => {
    const initialPosition = Number(event.currentTarget.dataset.position);

    setDragAndDrop({
      ...dragAndDrop,
      draggedFrom: initialPosition,
      isDragging: true,
      originalOrder: dTree,
    });
    event.dataTransfer.setData("text/html", "");
  };

  const onDragOver = (event) => {
    event.preventDefault();

    let newDTree = dragAndDrop.originalOrder;

    const draggedFrom = dragAndDrop.draggedFrom;
    const draggedTo = Number(event.currentTarget.dataset.position);

    const itemDragged = newDTree[draggedFrom];

    const remainingItems = newDTree.filter(
      (item, index) => index !== draggedFrom
    );

    newDTree = [
      ...remainingItems.slice(0, draggedTo),
      itemDragged,
      ...remainingItems.slice(draggedTo),
    ];

    if (draggedTo !== dragAndDrop.draggedTo) {
      setDragAndDrop({
        ...dragAndDrop,
        updatedOrder: newDTree,
        draggedTo: draggedTo,
      });
    }
  };

  const onDrop = (event) => {
    setDTree(dragAndDrop.updatedOrder);

    setDragAndDrop({
      ...dragAndDrop,
      draggedFrom: null,
      draggedTo: null,
      isDragging: false,
    });
  };

  const onDragLeave = () => {
    setDragAndDrop({
      ...dragAndDrop,
      draggedTo: null,
    });
  };

  const clickColumnVisibleCallback = (columnKey) => {
    setDTree((prev) => {
      const index = prev.findIndex((el) => el.accessor === columnKey);
      const visible = prev[index].visible;
      const newArr = [...prev];
      newArr[index].visible = !visible;
      return newArr;
    });
  };

  const clickApply = () => {
  };

  
  const renderTree = (leafs) => {
    if (nodes.length === 0) {
      return null;
    }

    console.log("nodes", nodes);
    return nodes.map((element, index) => {
      return (
        <div
          key={index}
          data-position={index}
          draggable
          onDragStart={onDragStart}
          onDragOver={onDragOver}
          onDrop={onDrop}
          onDragLeave={onDragLeave}
          className={`column-row ${
            dragAndDrop && dragAndDrop.draggedTo === Number(index)
              ? "dropArea"
              : ""
          }`}
        >
          <label>{element.direction_name}</label>
          <span></span>
        </div>
      );
    });
  }
  
  return (<Fragment>{renderTree(dTree)}</Fragment>);
};

export default DirectionsTree;

