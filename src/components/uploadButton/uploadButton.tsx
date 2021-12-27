import React, { useState, useEffect, useRef } from "react";
import {isEmpty, get, map} from "lodash";

const UploadButton = ({ children=null, icon, name="photo", className="button", value="", onChange=(i)=>{}, disabled=false, accept="image/*", getFiles=(i)=>{}, getSrc=(i)=>{} }) => {
  const [curFiles, setCurFiles] = useState([]);
  const [curUrls, setCurUrls] = useState([]);
  const ref = useRef(null);

  useEffect(() => {
    if (isEmpty(curFiles)) {
      return;
    }
    setCurUrls(map(curFiles, (file)=> {
      try {
        return URL.createObjectURL(file)
      } catch {
        return;
      }
    }))

    getFiles(curFiles);
  }, [curFiles]);

  useEffect(() => {
    if (isEmpty(curUrls)) {
      return;
    }
    getSrc(curUrls);
  }, [curUrls]);


  const goChange = (e) => {
    const files = get(e, "target.files", []);
    if (!isEmpty(files)) {
      onChange(files);
      setCurFiles(files);
    }
  };

  return (
    <label htmlFor={name} className={className} onClick={() => ref.current.click()}>
      {icon && <span className={icon} style={{marginRight: "0.5em"}}/>}
      <input
        ref={ref}
        value={value}
        accept={accept}
        disabled={disabled}
        style={{ display: "none" }}
        name={name}
        multiple
        type="file"
        onChange={disabled ? () => {} : goChange}
        hidden
      />
      {children}
    </label>
  );
};

export default UploadButton;
