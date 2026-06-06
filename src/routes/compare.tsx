import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { SingleComparisonView } from "@/components/SingleComparisonView";
import { type RoleId } from "@/lib/roles";
import { getTest } from "@/lib/tests.functions";

const searchSchema = z.object({
  testId: z.string().uuid().optional(),
  reviewId: z.string().uuid().optional(),
});

export const Route = createFileRoute("/compare")({
  validateSearch: (s) => searchSchema.parse(s),
  head: () => ({
    meta: [
      { title: "对照结果 - 你以为的你 vs 朋友眼中的你" },
      { name: "description", content: "看看朋友眼中的你和你以为的自己是不是同一个版本。" },
    ],
  }),
  component: ComparePage,
});

function ComparePage() {
  const { testId, reviewId } = Route.useSearch();
  const navigate = useNavigate();
  const fetchTest = useServerFn(getTest);
  const { data, isLoading } = useQuery({
    queryKey: ["compare", testId, reviewId],
    queryFn: () => fetchTest({ data: { testId: testId!, reviewId } }),
    refetchInterval: reviewId ? false : 4000,
    enabled: Boolean(testId),
  });

  if (!testId) {
    return (
      <div className="p-12 text-center">
        <p className="mb-4">没找到这次测试。</p>
        <Link to="/" className="btn-pop">回首页</Link>
      </div>
    );
  }

  if (isLoading) {
    return <div className="p-12 text-center text-muted-foreground">加载中...</div>;
  }
  if (!data?.test) {
    return (
      <div className="p-12 text-center">
        <p className="mb-4">没找到这次测试。</p>
        <Link to="/" className="btn-pop">回首页</Link>
      </div>
    );
  }

  const selectedReview = data.selectedReview ?? data.friendReviews[0] ?? null;

  if (!selectedReview) {
    return (
      <main className="min-h-screen px-4 py-12 flex items-center justify-center">
        <div className="max-w-md text-center card-pop p-8 flex flex-col gap-4">
          <span className="sticker self-center">等待中</span>
          <h1 className="text-2xl font-black">朋友还没评价</h1>
          <p className="text-foreground/70">
            等 TA 提交评价后再来看吧。这个页面会自动刷新。
          </p>
          <Link to="/result" search={{ testId }} className="btn-pop self-center">
            回到我的结果
          </Link>
        </div>
      </main>
    );
  }

  return (
    <SingleComparisonView
      testId={testId}
      selfRoleId={data.test.self_result as RoleId}
      review={selectedReview}
      onInviteMore={() => navigate({ to: "/result", search: { testId } })}
    />
  );
}

