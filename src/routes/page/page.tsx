import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import _ from "lodash";
import { useSearchParams, NavLink } from "react-router-dom";
import { Editor } from "draft-js";
import { BLOCK_RENDER_MAP, CUSTOM_STYLE_MAP } from "../../helpers/textEditorConfig";
import { useEditorApi } from "../../contexts/textEditor";
import { getQuery, postQueryFormData, putQueryFormData } from "../../api/service";
import useLocalStorage from '../../helpers/useLocalStorage';
import { UploadButton, TextEditor, ToolPanel } from "../../components";
import "draft-js/dist/Draft.css";
import "./page.scss";

interface iPage
{
  id: string;
  name?: string;
  body?: string;
  photo?: string;
}

export default function Page() {
  const [user] = useLocalStorage('user', {});
  const [searchParams] = useSearchParams();
  const pageId = parseInt(searchParams.get('id'), 10);
  const [page, setPage] = useState<iPage>();
  const [newPhoto, setNewPhoto] = useState("");
  const editorApi = useEditorApi();

  useEffect(() => {
    if (!pageId) {
      return;
    }

    const getPage = () => {
      getQuery("/pages/read",  user.token, {id: pageId}).then((data:any)=>{
        if (!_.isUndefined(data)) {
          setPage(data);
          editorApi.setStateFromHTML(data.body);
        }
      });
    }
    getPage();
  }, [pageId]);

  const photoSrc = useMemo(() => _.isEmpty(newPhoto) ? `../${page?.photo}` : newPhoto, [newPhoto, page?.photo])

  const doSave = ()=> {

    postQueryFormData("/pages/update", user.token, {
      ...page,
      body: editorApi.toHtml()
    }).then((data:any)=>{
      if (!_.isUndefined(data)) {
        setPage(data);
        setNewPhoto("");
      }
    }).catch((err)=>{
      console.error(err)
    });
  }

  const onSubmit = (event) => {
    event.preventDefault();
  };

  return (
    <div id="user">
      <NavLink to="/">Главная</NavLink>
      <h4>Редактирование страницы:</h4>
      <form action="#" onSubmit={onSubmit}>
        <div className="row user-form">
          <div className="col-2">
            <span className="image fit">
              {photoSrc === "../" ? <span className="icon-user-circle user-photo"/> : <img src={photoSrc} alt=""/>}
            </span>
          </div>
        </div>
        <div className="row user-form">
          <div className="col-12">
            <UploadButton icon="icon-insert_photo" name="photo" getFiles={([file])=>{
              setPage((prev)=>({...prev, page: file}))
            }} getSrc={([img])=>{
              setNewPhoto(img)
            }}>Выберите файл</UploadButton>
          </div>
        </div>
        <div className="row user-form">
          <div className="col-12">
            <label htmlFor="user-login">Заголовок:</label>
            <input type="text" name="user-login" value={page?.name ? page.name : ""} placeholder="Заголовок"
              onChange={({target: {value}})=>setPage((prev)=>({...prev, name: value}))}
            />
          </div>
        </div>
        <div className="row user-form">
          <div className="col-12">
            <label htmlFor="user-firstname">Текст:</label>
            <ToolPanel />
            <div className="text-editor">
              <Editor
                spellCheck
                handleKeyCommand={editorApi.handleKeyCommand}
                customStyleMap={CUSTOM_STYLE_MAP}
                blockRenderMap={BLOCK_RENDER_MAP}
                editorState={editorApi.state}
                onChange={editorApi.onChange}
                keyBindingFn={editorApi.handlerKeyBinding}
              />
            </div>
          </div>
        </div>
      </form>
      <div className="row user-form">
        <div className="col-12">
          <button className="button primary icon-save" onClick={doSave}>Сохранить</button>
        </div>
      </div>
    </div>
  );
}
