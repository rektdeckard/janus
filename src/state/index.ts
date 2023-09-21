import { create } from "zustand";
import { v4 as uuid } from "uuid";
import { OnMount } from "@monaco-editor/react";

interface EditorState {
  label: string;
  editor: Parameters<OnMount>[0] | null;
  monaco: Parameters<OnMount>[1] | null;
}

const UNINITIALIZED = {
  label: new Date().toLocaleString(),
  editor: null,
  monaco: null,
} as const;

interface NotebookState {
  blocks: Map<string, EditorState>;
  createBlock: () => void;
  registerBlock: (id: string, ...onMount: Parameters<OnMount>) => void;
  renameBlock: (id: string, label: string) => void;
  deleteBlock: (id: string) => void;
}

export const useNotebookState = create<NotebookState>()((set, get) => ({
  blocks: new Map([["initial", UNINITIALIZED]]),
  createBlock: () => {
    const id = uuid();
    set(({ blocks }) => {
      blocks.set(id, UNINITIALIZED);
      return { blocks };
    });
  },
  registerBlock: (id, editor, monaco) => {
    set(({ blocks }) => {
      blocks.set(id, {
        label: new Date().toLocaleString(),
        editor,
        monaco,
      });
      return { blocks };
    });
  },
  renameBlock: (id, label) => {
    const blocks = get().blocks;
    const block = blocks.get(id);
    if (!!block) {
      blocks.set(id, { ...block, label });
    }
    set({ blocks });
  },
  deleteBlock: (id) =>
    set(({ blocks }) => {
      blocks.delete(id);
      return { blocks };
    }),
}));

const selectBlock = (id: string) => (s: NotebookState) => s.blocks.get(id);
export const useBlockState = (id: string) =>
  useNotebookState(selectBlock(id)) ?? UNINITIALIZED;
