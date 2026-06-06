import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { QuizRunner } from "@/components/QuizRunner";
import { FRIEND_QUESTIONS } from "@/lib/questions";
import { computeRole, computeScores, type Answers } from "@/lib/scoring";
import { submitFriendReview } from "@/lib/tests.functions";

const searchSchema = z.object({ testId: z.string().uuid().optional() });

export const Route = createFileRoute("/review/quiz")({
  validateSearch: (s) => {
    const parsed = searchSchema.safeParse(s);
    return parsed.success ? parsed.data : {};
  },
  head: () => ({
    meta: [{ title: "朋友评价 · 答题中" }],
  }),
  component: ReviewQuiz,
});

function ReviewQuiz() {
  const { testId } = Route.useSearch();
  const navigate = useNavigate();
  const submit = useServerFn(submitFriendReview);
  const [submitting, setSubmitting] = useState(false);

  if (!testId) {
    return (
      <div className="p-12 text-center">
        <p className="mb-4">这个评价链接不完整。</p>
        <button onClick={() => navigate({ to: "/" })} className="btn-pop">
          回首页
        </button>
      </div>
    );
  }

  const handleComplete = async (answers: Answers) => {
    if (submitting) return;
    setSubmitting(true);
    try {
      const scores = computeScores(answers, FRIEND_QUESTIONS);
      const result = computeRole(scores, "friend", answers, FRIEND_QUESTIONS);
      const friendName =
        typeof window !== "undefined"
          ? sessionStorage.getItem(`friendName:${testId}`)
          : null;
      const response = await submit({
        data: {
          testId,
          friendName,
          friendScores: scores,
          friendResult: result,
        },
      });
      navigate({
        to: "/review/done",
        search: { testId, reviewId: response.reviewId },
      });
    } catch (e) {
      console.error(e);
      toast.error("提交失败，再试一次");
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen">
      <header className="px-4 py-6 text-center">
        <h1 className="text-xl font-black">关于 TA · 朋友评价</h1>
      </header>
      <QuizRunner questions={FRIEND_QUESTIONS} onComplete={handleComplete} />
      {submitting && (
        <div className="text-center text-muted-foreground pb-8">正在送达评价...</div>
      )}
    </main>
  );
}
