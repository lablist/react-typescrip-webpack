import React, { useEffect, useContext, useState } from 'react';
import _ from "lodash";
import useLocalStorage from "../../helpers/useLocalStorage";
import { getQuery } from "../../api/service";

export default function Main() {
  const [user, setUser, deleteUser] = useLocalStorage("user", {});
  const [srvMsg, setSrvMsg] = useState<any>("");

  const generateAll = () => {
    getQuery("/generate/all", user.token, {}).then((data)=>{
      if (!_.isUndefined(data)) {
        setSrvMsg(data);
      }
    }).catch((errMsg)=>{
      setSrvMsg(errMsg)
    });
  }

  return (
    <div className="row user-form">
      <div className="col-4 col-12-small">
        <a href="#" className="button primary" onClick={generateAll}>Создать сайт</a>
      </div>
    </div>
  );
}
