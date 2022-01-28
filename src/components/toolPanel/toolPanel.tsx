import * as React from "react";
import { useEditorApi } from "../../contexts/textEditor";
import { BlockType, InlineStyle } from "../../helpers/textEditorConfig";
import "./toolPanel.scss";

const ToolPanel: React.FC = () => {
  const {
    toHtml,
    addLink,
    toggleBlockType,
    currentBlockType,
    toggleInlineStyle,
    hasInlineStyle,
  } = useEditorApi();

  return (
    <div className="tool-panel">
      <button
        className={`tool-panel__item ${currentBlockType === BlockType.h1 ? "tool-panel__item_active" : ""}`}
        onMouseDown={(e) => {
          e.preventDefault();
          toggleBlockType(BlockType.h1);
        }}
      >
        Заголовок
      </button>
      <button
        className={`tool-panel__item ${currentBlockType === BlockType.h2 ? "tool-panel__item_active" : ""}`}
        onMouseDown={(e) => {
          e.preventDefault();
          toggleBlockType(BlockType.h2);
        }}
      >
        Подзаголовок
      </button>
      <button
        className={`tool-panel__item ${currentBlockType === BlockType.cite ? "tool-panel__item_active" : ""}`}
        onMouseDown={(e) => {
          e.preventDefault();
          toggleBlockType(BlockType.cite);
        }}
      >
        Сноска
      </button>
      <button
        className={`tool-panel__item ${currentBlockType === BlockType.default ? "tool-panel__item_active" : ""}`}
        onMouseDown={(e) => {
          e.preventDefault();
          toggleBlockType(BlockType.default);
        }}
      >
        Простой
      </button>

      {Object.values(InlineStyle).map((v) => (
        <button
          key={v}
          className={`tool-panel__item ${hasInlineStyle(v) ? "tool-panel__item_active" : ""}`}
          onMouseDown={(e) => {
            e.preventDefault();
            toggleInlineStyle(v);
          }}
        >
          {v}
        </button>
      ))}

      <button
        className="tool-panel__item"
        onClick={() => {
          const url = prompt("URL:");
          if (url) {
            addLink(url);
          }
        }}
      >
        LINK
      </button>

      <button
        className="tool-panel__item"
        onClick={() => {
          console.log(toHtml());
        }}
      >
        Print
      </button>
    </div>
  );
};

export default ToolPanel;
