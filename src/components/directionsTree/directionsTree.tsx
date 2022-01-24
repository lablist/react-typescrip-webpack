import React, { Fragment, useState, useEffect, useCallback, memo } from "react";
import { DragDropContext, Draggable, Droppable, DropResult, resetServerContext, ResponderProvided } from "react-beautiful-dnd";
import "./directionsTree.scss";

const nodeIdName = "id_direction";

const notFilledArray = (v)=> (!Array.isArray(v) || (Array.isArray(v)  && v.length === 0));

const WrappedDirectionsTree = ({value=[], readOnly=false, getValue=(newTree)=>{}, getActive=(curActive)=>{}}) => {
  const [dTree, setDTree] = useState([]);
  const [active, setActive] = useState("");

  useEffect(() => {
    if (dTree === value) {
      return;
    }
    setDTree(value);
  }, [value]);

  useEffect(() => {
    if (dTree === value) {
      return;
    }
    getValue(dTree);
  }, [dTree]);

  useEffect(() => {
    getActive(active);
  }, [active]);

  const getNodes = useCallback((pid="0")=> (
    dTree.filter((l)=>{return Number(l.parent_id) === Number(pid)}).sort((a,b)=>(Number(a.rate) - Number(b.rate)))
  ), [dTree]);

  const onDragEnd = (result: DropResult, provided: ResponderProvided) => {
    if (readOnly || result.combine || !result.destination) {
      return;
    }
    const startPos = result.source.index + 1;
    const endPos = result.destination.index + 1;
    if (startPos === endPos) {
      return;
    }
    const pid = result.type;
    setDTree((prev) => {
      const nodes = getNodes(pid);
      const startId = nodes.find(i => i.rate == startPos)[nodeIdName];
      const endId = nodes.find(i => i.rate == endPos)[nodeIdName];
      const newDTree = Array.from(prev);
      const startIndex = newDTree.findIndex(i => i[nodeIdName] == startId);
      const endIndex = newDTree.findIndex(i => i[nodeIdName] == endId);
      newDTree[startIndex].rate = endPos;
      newDTree[endIndex].rate = startPos;
      return newDTree;
    });
  }

  const switchActive = (newId) => {
    setActive((prev)=>{
      return prev !== newId ? newId : ""
    })
  }

  const draggableChild = (provided, snapshot, node, nodeIndex) => (
    <p ref={provided.innerRef}
      onClick={()=>switchActive(node[nodeIdName])}
      {...provided.draggableProps}
      className={`direction-node ${snapshot.isDragging ? "dragging" : ""} ${(active === node[nodeIdName]) ? "active" : ""}`}
      style={...provided?.draggableProps?.style}>
        {node.human_name}<span title={node.rate} {...provided.dragHandleProps} className="icon-drag_indicator"></span>
    </p>
  );

  function droppableChild(node, nodeIndex) {
    const nodeId = node[nodeIdName];
    const subNodes = getNodes(node[nodeIdName]);
    return (<Fragment key={node[nodeIdName]}>
      <Draggable key={`draggable-${nodeId}-${nodeIndex}`} draggableId={`draggable-${nodeId}`} index={nodeIndex}>
        {(provided, snapshot) => draggableChild(provided, snapshot, node, nodeIndex)}
      </Draggable>
      {!notFilledArray(subNodes) && <Droppable droppableId={`droppable-${nodeId}`} type={nodeId} key={nodeId} ignoreContainerClipping={false} isCombineEnabled={true}>
        {(provided, snapshot) => droppableChildren(provided, snapshot, subNodes, nodeId)}
      </Droppable>}
      </Fragment>)
  };

  function droppableChildren(provided, snapshot, nodes, nodeId) {
    return (
      <div ref={provided.innerRef}
      id="directions-tree" className={`direction direction-${nodeId} ${snapshot.isDraggingOver ? "dragging-over" : ""} ${snapshot.draggingFromThisWith ? "dragging-with" : ""}`}
      {...provided.droppableProps}>
        {nodes.map((node, nodeIndex) => droppableChild(node, nodeIndex))}
        {provided.placeholder}
      </div>
    );
  };

  const rootNodes = getNodes();
  if (notFilledArray(rootNodes)) {
    return null;
  };

  return (<DragDropContext
    onDragEnd={onDragEnd}>
      <Droppable droppableId="droppable" type="0" key="root" ignoreContainerClipping={false} isCombineEnabled={true}>
        {(provided, snapshot)=>droppableChildren(provided, snapshot, rootNodes, "0")}
      </Droppable>
    </DragDropContext>);
};

resetServerContext();
const DirectionsTree = memo(WrappedDirectionsTree);

export default DirectionsTree;

