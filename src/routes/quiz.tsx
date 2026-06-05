import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { toast } from "sonner";
import { QuizRunner } from "@/components/QuizRunner";
import { SELF_QUESTIONS } from "@/lib/questions";
import { computeRole, computeScores, type Answers } from "@/lib/scoring";
import { createTest } from "@/lib/tests.functions";

export const Route = createFileRoute("/quiz")({
  head: () => ({
    meta: [
      { title: "自测 - 你在人际关系里的隐藏角色" },
      { name: "description", content: "5 道题，测测你以为自己在人际里是什么样。" },
    ],
  }),
  component: QuizPage,
});

function QuizPage() {
  const navigate = useNavigate();
  const create = useServerFn(createTest);
  const [submitting, setSubmitting] = useState(false);

  const handleComplete = async (answers: Answers) => {
    if (submitting) return;
    setSubmitting(true);
    try {
      const scores = computeScores(answers, SELF_QUESTIONS);
      const result = computeRole(scores, "self", answers, SELF_QUESTIONS);
      const { testId } = await create({
        data: { selfScores: scores, selfResult: result },
      });
      navigate({ to: "/result", search: { testId } });
    } catch (e) {
      console.error(e);
      toast.error("提交失败，再试一次");
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen">
      <header className="px-4 py-6 text-center">
        <h1 className="text-xl font-black">关于你 · 自测</h1>
      </header>
      <QuizRunner questions={SELF_QUESTIONS} onComplete={handleComplete} />
      {submitting && (
        <div className="text-center text-muted-foreground pb-8">正在生成你的角色...</div>
      )}
    </main>
  );
}
