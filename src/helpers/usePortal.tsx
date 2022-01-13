import { createElement, useLayoutEffect, useEffect, useRef, useState } from "react";
import { createPortal, render } from "react-dom";

const portalNode = document.querySelector("#portal-root");

const subNode = (subNodeParams={})=> {
  return Object.assign(document.createElement("div"), subNodeParams);
}
 
/**
 * Example:
 * const demoPortal = <Portal params={{style: {position: 'fixed', top: 0, left: 0}}}>In portal-root</Portal>
 */

export const Portal = ({params, children}) => {
  if (!children) {
    return null;
  }

  const node = subNode(params);
  const [domReady, setDomReady] = useState(false);
  const [container] = useState<any>(node);

  useEffect(() => {
    setDomReady(true);
    portalNode.appendChild(container);
    return () => {
      portalNode.removeChild(container);
    };
  }, []);

  return domReady ? createPortal(children, container) : null;
};

/**
 * Example:
 * const demoPortal = usePortal();
 * return demoPortal(<div style={{position: 'fixed', top: 0, left: 0}}>In portal-root</div>);
 */

export const usePortal = () => {
  const wrapperRef = useRef(null);
  if (!wrapperRef.current) {
    wrapperRef.current = subNode();
  }

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper || !document) {
      return null;
    }
    portalNode.appendChild(wrapper);
    return () => {
      portalNode.removeChild(wrapper);
    }
  }, []);

  return (children => wrapperRef.current && createPortal(children, wrapperRef.current));
}

/**
 * Example:
 * setAsLastPortal('#id-1');
 * return the existing div is moved to the end of all elements: <portalNode>[...<div id='id-1' .../>]</portalNode>;
 */

 export const setAsLastPortal = (selector="") => {
  if (!!selector) {
    return null;
  }
  const movableChild = portalNode.querySelector(selector);
  const currentLastChild = portalNode.lastChild;
  if (!movableChild || !currentLastChild) {
    return null;
  }
  portalNode.replaceChild(movableChild, currentLastChild);
}
