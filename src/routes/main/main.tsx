import React, { useEffect, useContext, useState } from 'react';
import _ from "lodash";
import useLocalStorage from "../../helpers/useLocalStorage";
import { getQuery } from "../../api/service";
import { DirectionsTree } from "../../components";


export default function Main() {
  const [user, setUser, deleteUser] = useLocalStorage("user", {});
  const [srvMsg, setSrvMsg] = useState("");
  const [directions, setDirections] = useState([]);

  useEffect(() => {
    const getDirections = () => {
      getQuery("/directions/read",  user.token).then((data:any=[])=>{
        setDirections(data);
      });
    }
    getDirections();
  }, []);


  const generateAll = () => {
    getQuery("/generate/all", user.token, {}).then((data)=>{
      console.log("data", data);
    }).catch((errMsg)=>{
      setSrvMsg(errMsg)
    });
  }

  return (
    <div id="#main-page" className="row user-form">
      <div className="col-4 col-12-small">
        <DirectionsTree value={directions}/>
        <a href="#" className="button primary" onClick={generateAll}>Создать сайт</a>
      </div>
    </div>
  );
}
