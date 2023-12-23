import { Notebook } from "./components/Notebook";
import { useNotebookState } from "./state";
import { useEvent } from "./utils";

function App() {
  const { createBlock } = useNotebookState();

  useEvent("keypress", (e) => {
    if (e.key === "\u000e" && e.ctrlKey) {
      e.preventDefault();
      createBlock();
    }
  });

  return (
    <div className="monaco-editor container">
      <Notebook />
    </div>
  );
}

export default App;
