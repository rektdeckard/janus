import { useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import { Editor } from "@monaco-editor/react";

import { DEFAULT_OPTIONS, LINE_HEIGHT } from "./constants";
import { Zone } from "./types";
import { useBlockState } from "../../state";
import { useSystemTheme } from "../../utils";

type ResultProps = {
  blockId: string;
  zones: Zone[];
};

export function Result({ blockId, zones }: ResultProps) {
  const { editor } = useBlockState(blockId);
  const theme = useSystemTheme();

  const widgets = useMemo(() => {
    if (!editor) return {};
    if (!zones.length) return {};

    type ContentWidget = Parameters<typeof editor.addContentWidget>[0] & {
      domNode: HTMLElement;
    };

    return zones.reduce<Record<string, ContentWidget>>((acc, zone) => {
      const widget: ContentWidget = {
        domNode: document.createElement("aside"),
        getId: () => zone.id,
        getDomNode: function () {
          return this.domNode;
        },
        getPosition: () => ({
          position: {
            lineNumber: zone.line,
            column: 1,
          },
          preference: [2, 2],
        }),
        suppressMouseDown: false,
        afterRender: () => console.log("I DID RENDER!"),
      };

      acc[zone.id] = widget;
      editor.addContentWidget(widget);
      return acc;
    }, {});
  }, [editor, zones]);

  useEffect(() => {
    if (!editor) return;

    return () => {
      editor.changeViewZones((accessor) => {
        Object.entries(widgets).forEach(([zid, widget]) => {
          editor.removeContentWidget(widget);
          accessor.removeZone(zid);
        });
      });
    };
  }, [editor, widgets]);

  if (!editor) {
    return null;
  }

  console.log({ zones });

  return (
    <>
      {zones.map((zone) => {
        return createPortal(
          <Editor
            key={zone.id}
            className="block-code"
            path={zone.id}
            theme={`vs-${theme}`}
            height={LINE_HEIGHT * 3}
            width="calc(100vh - 64px)"
            options={{ ...DEFAULT_OPTIONS, readOnly: true }}
            value={zone.content}
            defaultLanguage="javascript"
          />,
          widgets[zone.id].getDomNode()
        );
      })}
    </>
  );
}
