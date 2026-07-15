import { Stage } from "./components/Stage";
import { useStepper } from "./hooks/useStepper";
import { CHAPTERS } from "./registry/chapters";

export default function App() {
  const stepper = useStepper(CHAPTERS);
  const ch = CHAPTERS[stepper.cursor.chapter]!;
  const Cmp = ch.Component;
  const stepText = ch.narrations[stepper.cursor.step] ?? "";

  return (
    <Stage onAdvance={stepper.next}>
      <div key={ch.id} className="scene">
        <Cmp step={stepper.cursor.step} />
      </div>
    </Stage>
  );
}
