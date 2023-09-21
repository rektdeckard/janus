import { useEffect } from "react";
import Editor, { EditorProps, OnMount } from "@monaco-editor/react";
import { invoke } from "@tauri-apps/api/tauri";
import { match, P } from "ts-pattern";

import { useEvent } from "../../utils";
import { useBlockState, useNotebookState } from "../../state";
import { X } from "../../assets/icons";

type EvalSuccess<T> = { status: "success"; result: T };
type EvalError<E> = { status: "error"; result: E };
type EvalResult<T, E> = EvalSuccess<T> | EvalError<E>;

type BlockProps = {
  id: string;
};

async function executeScript<T, E>(script: string) {
  // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
  return invoke<EvalResult<T, E>>("execute_script", { script });
}

const DEFAULT_CONTENT = `\
// This is a block. Write JavaScript or Typescript here.
//   - Press Shift + Enter to evaluate a block.
//     The value of the final expesssion is printed as a comment.
//   - Press Ctrl + N to add another block.
`;

const DEFAULT_OPTIONS: EditorProps["options"] = {
  automaticLayout: true,
  scrollBeyondLastLine: false,
  scrollbar: { vertical: "auto" },
  minimap: { enabled: false },
  hideCursorInOverviewRuler: true,
  overviewRulerBorder: false,
} as const;

export function Block({ id }: BlockProps) {
  const { registerBlock, renameBlock, deleteBlock } = useNotebookState();
  const { label, editor } = useBlockState(id);

  useEffect(() => {
    if (!!editor) {
      editor.focus();
    }
  }, [editor]);

  useEvent(
    "keypress",
    async (e) => {
      console.log(e);
      if (e.key === "\x17" && e.ctrlKey) {
        deleteBlock(id);
      }

      if (e.key === "Enter" && e.shiftKey) {
        e.preventDefault();
        if (!editor) return;

        const script = editor?.getValue();

        if (!!script) {
          match(await executeScript<unknown, string>(script))
            .with({ status: "success", result: P.select() }, (res) => {
              editor.executeEdits("<anon>", [
                {
                  range: {
                    startLineNumber:
                      editor.getSelection()!.getEndPosition().lineNumber + 1,
                    startColumn: 0,
                    endLineNumber:
                      editor.getSelection()!.getEndPosition().lineNumber + 1,
                    endColumn: 0,
                  },
                  text: `\n// ${JSON.stringify(res, null, 2)
                    .split("\n")
                    .join("\n// ")}\n`,
                  forceMoveMarkers: true,
                },
              ]);
            })
            .with({ status: "error", result: P.select() }, (err) => {
              // editor.setValue(script + `\n// ${err.split("\n").join("\n// ")}`);
              editor.executeEdits("<anon>", [
                {
                  range: {
                    startLineNumber:
                      editor.getSelection()!.getEndPosition().lineNumber + 1,
                    startColumn: 0,
                    endLineNumber:
                      editor.getSelection()!.getEndPosition().lineNumber + 1,
                    endColumn: 0,
                  },
                  text: `\n// ${err.split("\n").join("\n// ")}\n`,
                  forceMoveMarkers: true,
                },
              ]);
            });
        }
      }
    },
    false,
    editor?.getDomNode() ?? document.body
  );

  function initialize(...args: Parameters<OnMount>) {
    registerBlock(id, ...args);
    args[0].layout({
      width: 100,
      height: 19 * (id === "initial" ? 5 : 1),
    });
    autoSize();
  }

  function autoSize() {
    const height = editor?.getContentHeight();
    editor?.layout({
      width: editor!.getDomNode()?.clientWidth!,
      height: height ?? 19 * (id === "initial" ? 5 : 1),
    });
  }

  return (
    <div className="block">
      <div className="block-header">
        <input
          className="block-label"
          value={label}
          onChange={(e) => renameBlock(id, e.target.value)}
        />
        <button className="block-button" onClick={() => deleteBlock(id)}>
          <X />
        </button>
      </div>
      <Editor
        className="block-code"
        theme="vs-dark"
        defaultLanguage="typescript"
        path={id}
        options={DEFAULT_OPTIONS}
        defaultValue={id === "initial" ? DEFAULT_CONTENT : ""}
        onMount={initialize}
        onChange={autoSize}
        onValidate={autoSize}
        loading={
          <div
            className="block-code"
            style={{ height: 19 * (id === "initial" ? 5 : 1), width: "100%" }}
          />
        }
      />
    </div>
  );
}
