import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { RoleCard } from "@/components/RoleCard";
import { getReviewerDeliveryNarrative } from "@/lib/result-copy";
import { ROLES, type RoleId } from "@/lib/roles";
import { getTest } from "@/lib/tests.functions";

const searchSchema = z.object({
  testId: z.string().uuid().optional(),
  reviewId: z.string().uuid().optional(),
});

export const Route = createFileRoute("/review/done")({
  validateSearch: (s) => {
    const parsed = searchSchema.safeParse(s);
    return parsed.success ? parsed.data : {};
  },
  head: () => ({ meta: [{ title: "你眼中的 TA 已送达" }] }),
  component: ReviewDone,
});

function ReviewDone() {
  const { testId, reviewId } = Route.useSearch();
  const fetchTest = useServerFn(getTest);
  const { data, isLoading } = useQuery({
    queryKey: ["review-done", testId, reviewId],
    queryFn: () => fetchTest({ data: { testId: testId!, reviewId } }),
    enabled: Boolean(testId && reviewId),
  });

  if (!testId || !reviewId) {
    return (
      <div className="p-12 text-center">
        <p className="mb-4">这份朋友评价不存在了。</p>
        <Link to="/" className="btn-pop">回首页</Link>
      </div>
    );
  }

  if (isLoading) {
    return <div className="p-12 text-center text-muted-foreground">加载中...</div>;
  }

  if (!data?.test || !data.selectedReview) {
    return (
      <div className="p-12 text-center">
        <p className="mb-4">这份朋友评价不存在了。</p>
        <Link to="/" className="btn-pop">回首页</Link>
      </div>
    );
  }

  const selfRole = ROLES[data.test.self_result as RoleId];
  const friendRole = ROLES[data.selectedReview.friend_result as RoleId];
  const narrative = getReviewerDeliveryNarrative(selfRole.id, friendRole.id);

  return (
    <main className="min-h-screen px-4 py-12 flex flex-col items-center">
      <div className="max-w-3xl w-full flex flex-col gap-6">
        <div className="text-center flex flex-col items-center gap-3">
          <span className="sticker" style={{ background: "var(--accent)" }}>
            你眼中的 TA 已送达
          </span>
          <h1 className="text-3xl font-black">{narrative.title}</h1>
          <p className="text-sm text-foreground/70 max-w-xl">{narrative.helper}</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <RoleCard role={friendRole} label="你眼中的 TA 是" compact />
          <RoleCard role={selfRole} label="TA 以为自己是" compact />
        </div>

        <div className="card-pop p-5 flex flex-col gap-3">
          <h2 className="text-lg font-extrabold">我也想自测一下</h2>
          <p className="text-sm text-muted-foreground">
            你也来测测自己在人际关系里是什么角色？
          </p>
          <Link to="/" className="btn-pop self-start">
            开始我的自测 →
          </Link>
        </div>
      </div>
    </main>
  );
}

