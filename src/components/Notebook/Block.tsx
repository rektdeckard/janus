import { useState, useCallback, useEffect } from "react";
import Editor, { OnMount } from "@monaco-editor/react";
import { invoke } from "@tauri-apps/api/tauri";
import { match, P } from "ts-pattern";
import { clamp } from "kdim";
import { v4 as uuid } from "uuid";

import {
  DEFAULT_PROPS,
  DEFAULT_OPTIONS,
  DEFAULT_CONTENT,
  LINE_HEIGHT,
  MIN_LINES,
  MAX_LINES,
} from "./constants";
import { EvalResult, Zone } from "./types";
import { Result } from "./Result";
import { useEvent, useSystemTheme } from "../../utils";
import { useBlockState, useNotebookState } from "../../state";
import { ChevronDown, ChevronUp, Refresh, Run, X } from "../../assets/icons";

type BlockProps = {
  id: string;
};

async function evaluateScript<T, E>(script: string) {
  return invoke<EvalResult<T, E>>("evaluate_script", { script });
}

export function Block({ id }: BlockProps) {
  const { registerBlock, renameBlock, deleteBlock } = useNotebookState();
  const { label, editor } = useBlockState(id);
  const [hasRun, setHasRun] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [zones, setZones] = useState<Zone[]>([]);
  const theme = useSystemTheme();

  useEffect(() => {
    if (!!editor) {
      editor.focus();
    }
  }, [editor]);

  useEffect(() => {
    autoResize();
  }, [expanded]);

  // useEffect(() => {
  //   if (!editor || !zones.length) return;

  //   editor.changeViewZones((accessor) => {
  //     for (const zone of zones) {
  //       const root = document.createElement("div");
  //       createRoot(root).render(
  //         <Editor
  //           className="block-code"
  //           path="123"
  //           theme={`vs-${theme}`}
  //           width="calc(100% - 64px)"
  //           options={DEFAULT_OPTIONS}
  //           value={zone.content}
  //           defaultLanguage="javascript"
  //         />
  //       );

  //       accessor.addZone({
  //         afterLineNumber: zone.line,
  //         heightInLines: 2,
  //         domNode: root,
  //       });
  //     }
  //   });
  // }, [zones]);

  const evaluate = useCallback(
    async (toCursor: boolean = false) => {
      if (!editor) return;

      const content = toCursor
        ? editor?.getModel()?.getValueInRange({
            startLineNumber: 0,
            startColumn: 0,
            endLineNumber: editor.getSelection()!.getEndPosition().lineNumber,
            endColumn: editor.getSelection()!.getEndPosition().column,
          })
        : editor?.getValue();

      const range = toCursor
        ? {
            startLineNumber:
              editor.getSelection()!.getEndPosition().lineNumber + 1,
            startColumn: 0,
            endLineNumber:
              editor.getSelection()!.getEndPosition().lineNumber + 1,
            endColumn: 0,
          }
        : {
            startLineNumber: (editor.getModel()?.getLineCount() ?? 0) + 1,
            startColumn: 0,
            endLineNumber: (editor.getModel()?.getLineCount() ?? 0) + 1,
            endColumn: 0,
          };

      if (!!content) {
        match(await evaluateScript<unknown, string>(content))
          .with({ status: "success", result: P.select() }, (res) => {
            // editor.executeEdits("<anon>", [
            //   {
            //     range,
            //     text: `// ${JSON.stringify(res).split("\n").join("\n// ")}\n`,
            //     forceMoveMarkers: true,
            //   },
            // ]);
            editor.changeViewZones((accessor) => {
              const root = document.createElement("div");
              setZones((z) => [
                ...z,
                {
                  id: accessor.addZone({
                    afterLineNumber: range.startLineNumber - 1,
                    heightInLines: 3,
                    domNode: root,
                  }),
                  content: JSON.stringify(res),
                  line: range.startLineNumber - 1,
                  root,
                },
              ]);
            });
          })
          .with({ status: "error", result: P.select() }, (err) => {
            // editor.executeEdits("<anon>", [
            //   {
            //     range,
            //     text: `// ${JSON.stringify(err).split("\n").join("\n// ")}\n`,
            //     forceMoveMarkers: true,
            //   },
            // ]);
            editor.changeViewZones((accessor) => {
              const root = document.createElement("div");
              setZones((z) => [
                ...z,
                {
                  id: accessor.addZone({
                    afterLineNumber: range.startLineNumber - 1,
                    heightInLines: 3,
                    domNode: root,
                  }),
                  content: JSON.stringify(err),
                  line: range.startLineNumber - 1,
                  root,
                },
              ]);
            });
          });
        setHasRun(true);
      }
    },
    [editor]
  );

  useEvent(
    "keypress",
    async (e) => {
      console.log(e);
      if (e.key === "\x17" && e.ctrlKey) {
        deleteBlock(id);
      }

      if (e.key === "Enter" && e.shiftKey) {
        e.preventDefault();
        evaluate(true);
      }
    },
    false,
    editor?.getDomNode() ?? document.body
  );

  function initialize(...args: Parameters<OnMount>) {
    registerBlock(id, ...args);
    args[0].layout({
      width: 100,
      height: LINE_HEIGHT * MIN_LINES,
    });
  }

  function onContentChange() {
    setHasRun(false);
    autoResize();
  }

  function autoResize() {
    const height = editor?.getContentHeight();
    editor?.layout({
      width: editor!.getDomNode()?.clientWidth!,
      height: expanded
        ? height ?? MIN_LINES * LINE_HEIGHT
        : LINE_HEIGHT *
          clamp(
            MIN_LINES,
            MAX_LINES,
            height ? height / LINE_HEIGHT : MIN_LINES
          ),
    });
  }

  function toggleExpand() {
    setExpanded((e) => !e);
  }

  return (
    <div className="block">
      <div className="block-header">
        <input
          className="block-label"
          value={label}
          onChange={(e) => renameBlock(id, e.target.value)}
        />
        <button
          className="block-button"
          title="Close"
          onClick={() => deleteBlock(id)}
        >
          <X />
        </button>
        <button
          className="block-button"
          title={expanded ? "Collapse" : "Expand"}
          onClick={toggleExpand}
        >
          {expanded ? <ChevronUp /> : <ChevronDown />}
        </button>
        <button
          className="block-button"
          title={`${hasRun ? "Re-e" : "E"}valuate block`}
          onClick={() => evaluate(false)}
        >
          {hasRun ? <Refresh /> : <Run />}
        </button>
        <button
          className="block-button"
          title={`${hasRun ? "Re-e" : "E"}valuate block`}
          onClick={() => {
            editor?.changeViewZones((accessor) => {
              for (let zone of zones) {
                accessor.removeZone(zone.id);
              }
              setZones([]);
            });
          }}
        >
          CLR
        </button>
      </div>
      <Editor
        className="block-code"
        theme={`vs-${theme}`}
        path={id}
        options={DEFAULT_OPTIONS}
        defaultValue={id === "initial" ? DEFAULT_CONTENT : ""}
        onMount={initialize}
        onChange={onContentChange}
        loading={
          <div
            className="block-code"
            style={{ height: LINE_HEIGHT * MIN_LINES, width: "100%" }}
          />
        }
        {...DEFAULT_PROPS}
      />
      <Result blockId={id} zones={zones} />
    </div>
  );
}
