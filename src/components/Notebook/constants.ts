import { EditorProps } from "@monaco-editor/react";

export const LINE_HEIGHT = 19;
export const MIN_LINES = 5;
export const MAX_LINES = 20;

export const DEFAULT_PROPS: EditorProps = {
  defaultLanguage: "typescript",
} as const;

export const DEFAULT_OPTIONS: EditorProps["options"] = {
  automaticLayout: true,
  scrollBeyondLastLine: false,
  scrollbar: { vertical: "auto" },
  minimap: { enabled: false },
  hideCursorInOverviewRuler: true,
  overviewRulerBorder: false,
} as const;

export const DEFAULT_CONTENT = `\
// This is a block. Write JavaScript or Typescript here.
//   - Press Shift + Enter to evaluate a block.
//     The value of the final expesssion is printed as a comment.
//   - Press Ctrl + N to add another block.
`;
