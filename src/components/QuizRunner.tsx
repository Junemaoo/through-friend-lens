import { useState } from "react";
import type { Answers } from "@/lib/scoring";
import type { Question } from "@/lib/questions";

interface Props {
  questions: Question[];
  onComplete: (answers: Answers) => void;
  ctaLabel?: string;
}

export function QuizRunner({ questions, onComplete, ctaLabel = "下一题" }: Props) {
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const q = questions[idx];
  const selected = answers[q.id];
  const isLast = idx === questions.length - 1;
  const progress = ((idx + (selected ? 1 : 0)) / questions.length) * 100;

  const handleNext = () => {
    if (!selected) return;
    if (isLast) {
      onComplete(answers);
    } else {
      setIdx(idx + 1);
    }
  };

  return (
    <div className="mx-auto w-full max-w-xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <span className="sticker">第 {idx + 1} / {questions.length} 题</span>
        <div className="flex-1 mx-4 h-2 rounded-full bg-muted overflow-hidden border-2 border-[var(--ink)]">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <h2 className="text-2xl font-extrabold mb-6 leading-snug">{q.prompt}</h2>

      <div className="flex flex-col gap-3 mb-8">
        {q.options.map((opt) => {
          const active = selected === opt.key;
          return (
            <button
              key={opt.key}
              onClick={() => setAnswers({ ...answers, [q.id]: opt.key })}
              className={[
                "text-left rounded-2xl border-2 border-[var(--ink)] px-4 py-3 font-medium transition-all",
                "shadow-[3px_3px_0_0_var(--ink)] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[4px_4px_0_0_var(--ink)]",
                active
                  ? "bg-primary text-primary-foreground"
                  : "bg-card text-foreground hover:bg-secondary",
              ].join(" ")}
            >
              <span className="mr-2 font-extrabold">{opt.key}.</span>
              {opt.text}
            </button>
          );
        })}
      </div>

      <div className="flex justify-between items-center">
        <button
          onClick={() => setIdx(Math.max(0, idx - 1))}
          disabled={idx === 0}
          className="btn-pop btn-ghost disabled:opacity-30"
        >
          上一题
        </button>
        <button onClick={handleNext} disabled={!selected} className="btn-pop">
          {isLast ? "查看结果" : ctaLabel}
        </button>
      </div>
    </div>
  );
}
