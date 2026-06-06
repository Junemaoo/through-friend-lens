import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { z } from "zod";
import { FriendReviewCard } from "@/components/FriendReviewCard";
import { RoleCard } from "@/components/RoleCard";
import { ShareLinkBox } from "@/components/ShareLinkBox";
import { SingleComparisonView } from "@/components/SingleComparisonView";
import { ROLES, type RoleId } from "@/lib/roles";
import { getTest } from "@/lib/tests.functions";

const searchSchema = z.object({
  testId: z.string().uuid().optional(),
  reviewId: z.string().uuid().optional(),
});

export const Route = createFileRoute("/result")({
  validateSearch: (s) => searchSchema.parse(s),
  head: () => ({
    meta: [
      { title: "我的自测角色" },
      { name: "description", content: "看看你以为自己是哪种人际角色。" },
    ],
  }),
  component: ResultPage,
});

function ResultPage() {
  const { testId, reviewId } = Route.useSearch();
  const fetchTest = useServerFn(getTest);
  const [shareUrl, setShareUrl] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined" && testId) {
      setShareUrl(`${window.location.origin}/review?testId=${testId}`);
    }
  }, [testId]);

  const { data, isLoading } = useQuery({
    queryKey: ["test", testId, reviewId],
    queryFn: () => fetchTest({ data: { testId: testId!, reviewId } }),
    refetchInterval: reviewId ? false : 5000,
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

  const selfRoleId = data.test.self_result as RoleId;
  const role = ROLES[selfRoleId];
  const hasFriendReviews = data.friendReviews.length > 0;

  if (reviewId) {
    if (!data.selectedReview) {
      return (
        <div className="p-12 text-center">
          <p className="mb-4">没找到这位朋友的评价。</p>
          <Link to="/result" search={{ testId }} className="btn-pop">返回朋友视角列表</Link>
        </div>
      );
    }

    return (
      <SingleComparisonView
        testId={testId}
        selfRoleId={selfRoleId}
        review={data.selectedReview}
        onInviteMore={() => undefined}
      />
    );
  }

  return (
    <main className="min-h-screen px-4 py-8">
      <div className="max-w-4xl mx-auto flex flex-col gap-6">
        {hasFriendReviews ? (
          <section className="card-pop p-6 text-center" style={{ background: "var(--secondary)" }}>
            <h1 className="text-3xl font-black">朋友视角已送达</h1>
            <p className="mt-2 text-foreground/70">每一张卡，都是一个朋友看见的你。</p>
            <p className="mt-4 text-sm font-semibold">已收到 {data.friendReviews.length} 位朋友评价</p>
          </section>
        ) : null}

        <div className="text-center">
          <span className="sticker mb-4">你以为你是：{role.name}</span>
        </div>

        <RoleCard role={role} />

        <div className="card-pop p-5 flex flex-col gap-3" style={{ background: "var(--accent)" }}>
          <h2 className="text-lg font-extrabold text-accent-foreground">邀请朋友评价我</h2>
          <p className="text-sm text-accent-foreground/80">
            把链接发给一个朋友，看看 TA 眼里的你是不是同一个版本。
          </p>
          <div>
            <ShareLinkBox url={shareUrl} />
          </div>
        </div>

        {!hasFriendReviews ? (
          <div className="card-pop p-5 flex flex-col gap-3">
            <h2 className="text-lg font-extrabold">等待朋友评价中...</h2>
            <p className="text-sm text-muted-foreground">
              朋友提交评价后，这里会出现朋友视角列表。这个页面会自动刷新。
            </p>
          </div>
        ) : (
          <section className="flex flex-col gap-4">
            {data.friendReviews.map((review) => (
              <FriendReviewCard
                key={review.id}
                testId={testId}
                selfRoleId={selfRoleId}
                review={review}
              />
            ))}
          </section>
        )}

        <Link to="/" className="text-center text-sm text-muted-foreground underline">
          回首页
        </Link>
      </div>
    </main>
  );
}

