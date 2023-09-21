import { useNotebookState } from "../../state";
import { Block } from "./Block";
import "./Notebook.css";

export function Notebook() {
  const [...blocks] = useNotebookState((s) => s.blocks.keys());

  return (
    <div className="notebook">
      {blocks.map((id) => (
        <Block key={id} id={id} />
      ))}
    </div>
  );
}
