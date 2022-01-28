import React, { useEffect, useCallback, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import _ from "lodash";
import useLocalStorage from "../../helpers/useLocalStorage";
import { getQuery, postQuery, deleteQuery, putQuery } from "../../api/service";
import { DirectionsTree, Checkbox } from "../../components";

const nodeIdName = "id_direction";
const newDirection = {
  id_direction: "",
  parent_id: "0",
  rate: "1",
  active: false,
  direction_name: "",
  human_name: "",
  direction_type_id: "1",
  page_id: "",
  site_description: "",
  site_keywords: "",
  site_title: "",
};

export default function Main() {
  const navigate = useNavigate();
  const [user, setUser, deleteUser] = useLocalStorage("user", {});
  const [srvMsg, setSrvMsg] = useState("");
  const [directions, setDirections] = useState([]);
  const [directionsTypes, setDirectionsTypes] = useState([]);
  const [activeDirectionIndex, setActiveDirectionIndex] = useState(-1);
  const [activeDirectionId, setActiveDirectionId] = useState("");

  const getDirections = () => {
    getQuery("/directions/read",  user.token).then((data:any=[])=>{
      setDirections(data);
    });
  }

  useEffect(() => {
    const getDirectionsTypes = () => {
      getQuery("/directionsTypes/read",  user.token).then((data:any=[])=>{
        setDirectionsTypes(data);
      });
    }
    getDirections();
    getDirectionsTypes();
  }, []);

  useEffect(() => {
    setActiveDirectionIndex(directions.findIndex((i:number)=>i[nodeIdName] == activeDirectionId));
  }, [activeDirectionId, directions]);

  const activeDirection = useMemo(() => {
    if (activeDirectionIndex >= 0) {
      return directions[activeDirectionIndex];
    }
    return newDirection;
  }, [activeDirectionIndex]);

  const generateAll = () => {
    getQuery("/generate/all", user.token, {}).then((data)=>{
      console.log("data", data);
    }).catch((errMsg)=>{
      setSrvMsg(errMsg)
    });
  }

  const setActiveDirection = useCallback((k, v) => {
    if (activeDirectionIndex < 0) {
      return;
    }
    setDirections((prev) => {
      const newDirections = Array.from(prev);
      newDirections[activeDirectionIndex][k] = v;
      return newDirections;
    })
  }, [activeDirectionIndex]);

  const saveDirectories =  useCallback((isParentId=false, isSave=false) => {
    postQuery("/directions/update", user.token, {
      directions: directions,
      id: isSave ? '' : activeDirectionId,
      isParentId: isParentId
    }).then(()=>{
      getDirections();
    }).catch((errMsg)=>{
      getDirections();
      setSrvMsg(errMsg)
    });
  }, [activeDirectionId, directions]);

  const deleteDirectory =  useCallback(() => {
    deleteQuery("/directions/delete", user.token, {
      id: activeDirectionId
    }).then(()=>{
      getDirections();
    }).catch((errMsg)=>{
      setSrvMsg(errMsg)
    });
  }, [activeDirectionId]);

  const hiddenClass = useMemo(() => {
    if (!activeDirectionId) {
      return "disabled";
    }
    return "";
  }, [activeDirectionId]);

  const editPage = useCallback(() => {
    if (activeDirection?.page_id) {
      getQuery("/pages/read", user.token, {
        id: activeDirection?.page_id,
        did: activeDirection?.id_direction
      }).then((r)=>{
        navigate(`page?id=${r.id}`);
      }).catch((errMsg)=>{
        setSrvMsg(errMsg)
      });
    } else {
      putQuery("/pages/create", user.token, {
        did: activeDirection?.id_direction
      }).then((r)=>{
        navigate(`page?id=${r.id}`);
      }).catch((errMsg)=>{
        setSrvMsg(errMsg)
      });
    }
  }, [activeDirection]);

  return (
    <div id="#main-page">
      <div className="row user-form"></div>
      <div className="row user-form">
        <div className="col-6">
          <DirectionsTree value={directions} getActive={setActiveDirectionId}/>
          <div className="row user-form"></div>
          <div className="row user-form">
            <div className="col-2">
              <button className={`button primary ${hiddenClass} icon-add`} onClick={()=>saveDirectories()} title="Сохранить и создать новый пункт"></button>
            </div>
            <div className="col-2">
              <button className={`button primary ${hiddenClass} icon-subdirectory_arrow_right`} onClick={()=>saveDirectories(true)} title="Сохранить и создать новый подпункт"></button>
            </div>
            <div className="col-2">
              <button className={`button primary ${hiddenClass} icon-delete`} onClick={()=>deleteDirectory()} title="Удалить пункт"></button>
            </div>
            <div className="col-2">
              <button className={`button primary icon-save`} onClick={()=>saveDirectories(false, true)} title="Сохранить"></button>
            </div>
          </div>
        </div>
        <div className="col-6">
          <div className="row user-form">
            <label htmlFor="human-name">Имя директории</label>
            <input type="text" name="human-name" value={activeDirection["human_name"] ? activeDirection["human_name"] : ""} placeholder="Имя директории"
              onChange={({target: {value}})=>setActiveDirection("human_name", value)}
            />
          </div>
          <div className="row user-form">
            <label htmlFor="direction-name">Имя пути</label>
            <input type="text" name="direction-name" value={activeDirection["direction_name"] ? activeDirection["direction_name"] : ""} placeholder="Имя пути"
              onChange={({target: {value}})=>setActiveDirection("direction_name", value)}
            />
          </div>
          <div className="row user-form">
            <label htmlFor="direction-type-id">Тип шаблона:</label>
            <select name="direction-type-id" value={activeDirection["direction_type_id"] ? activeDirection["direction_type_id"] : ""} onChange={(event)=>{
                setActiveDirection("direction_type_id", parseInt(event?.target?.value, 10));
              }}>
              {directionsTypes.map((directionsType)=>(<option key={directionsType.id} value={directionsType.id}>{directionsType.name}</option>))}
            </select>
          </div>
          <div className="row user-form">
            <Checkbox name="direction-active" className="col-3" checked={activeDirection["active"]} onChange={(isChecked)=>setActiveDirection("active", isChecked)}>
              Активный
            </Checkbox>
            <div className="col-9">
              <button className={`button primary ${hiddenClass} icon-create`} onClick={()=>editPage()} title="Редактировать страницу">Редактировать</button>
            </div>
          </div>
          <div className="row user-form">
            <label htmlFor="user-description">Описание <i>description</i>:</label>
            <textarea name="user-description" value={activeDirection["site_description"] ? activeDirection["site_description"] : ""} placeholder="Описание страницы"
              onChange={({target: {value}})=>setActiveDirection("site_description", value)}
            />
          </div>
          <div className="row user-form">
            <label htmlFor="user-description">Ключевые слова <i>keywords</i>:</label>
            <textarea name="user-description" value={activeDirection["site_keywords"] ? activeDirection["site_keywords"] : ""} placeholder="Ключевые слова страницы"
              onChange={({target: {value}})=>setActiveDirection("site_keywords", value)}
            />
          </div>
          <div className="row user-form">
            <label htmlFor="user-description">Заголовок <i>title</i>:</label>
            <textarea name="user-description" value={activeDirection["site_title"] ? activeDirection["site_title"] : ""} placeholder="Заголовок страницы"
              onChange={({target: {value}})=>setActiveDirection("site_title", value)}
            />
          </div>
        </div>
      </div>
      <button className="button primary icon-build" onClick={generateAll}>Создать сайт</button>
    </div>
  );
}
