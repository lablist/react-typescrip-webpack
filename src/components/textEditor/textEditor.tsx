import * as React from "react";
import { Editor } from "draft-js";
import { BLOCK_RENDER_MAP, CUSTOM_STYLE_MAP } from "../../helpers/textEditorConfig";
import { useEditorApi } from "../../contexts/textEditor";
import "./textEditor.scss";

export type TextEditorProps = {
  className?: string;
};

const TextEditor: React.FC<TextEditorProps> = ({ className }) => {
  const editorApi = useEditorApi();

  return (
    <div className={`text-editor ${className}`}>
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
  );
};

export default TextEditor;
