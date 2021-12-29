import React, { useState, useEffect, useMemo } from "react";

const Checkbox = ({ children=null, name="", className="", checked=false, onChange=(i)=>{}, disabled=false}) => {
  const [isChecked, setIsChecked] = useState(checked);

  useEffect(() => {
    if (checked === isChecked) {
      return;
    }
    setIsChecked(checked);
  }, [checked]);

  useEffect(() => {
    onChange(isChecked);
  }, [isChecked]);

  const getClassName = useMemo(() => (`icon-${isChecked ? 'check_box' : 'check_box_outline_blank'}`), [isChecked])

  const goChange = () => {
    if (disabled) {
      return;
    }
    setIsChecked((prev)=> (!prev));
  };

  return (<div className={className}>
    <span className={getClassName} onClick={goChange}/>
    <label htmlFor={name}>{children}</label>
  </div>);
};

export default Checkbox;
