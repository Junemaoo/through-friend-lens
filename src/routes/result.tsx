import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { z } from "zod";
import { RoleCard } from "@/components/RoleCard";
import { ShareLinkBox } from "@/components/ShareLinkBox";
import { ROLES, type RoleId } from "@/lib/roles";
import { getTest } from "@/lib/tests.functions";

const searchSchema = z.object({ testId: z.string().uuid() });

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
  const { testId } = Route.useSearch();
  const navigate = useNavigate();
  const fetchTest = useServerFn(getTest);
  const [shareUrl, setShareUrl] = useState("");
  const [compareUrl, setCompareUrl] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setShareUrl(`${window.location.origin}/review?testId=${testId}`);
      setCompareUrl(`${window.location.origin}/compare?testId=${testId}`);
    }
  }, [testId]);

  const { data, isLoading } = useQuery({
    queryKey: ["test", testId],
    queryFn: () => fetchTest({ data: { testId } }),
    refetchInterval: 5000,
  });

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

  const role = ROLES[data.test.self_result as RoleId];
  const hasFriendReview = !!data.friendReview;

  return (
    <main className="min-h-screen px-4 py-8">
      <div className="max-w-xl mx-auto flex flex-col gap-6">
        <div className="text-center">
          <span className="sticker mb-4">你以为你是</span>
          <h1 className="text-3xl font-black mt-3">{role.name}</h1>
        </div>

        <RoleCard role={role} />

        <div className="card-pop p-5 flex flex-col gap-3" style={{ background: "var(--accent)" }}>
          <h2 className="text-lg font-extrabold text-accent-foreground">
            想知道朋友怎么看你？
          </h2>
          <p className="text-sm text-accent-foreground/80">
            把下面的链接发给一位朋友，让 TA 从外部视角评价你。
          </p>
          <ShareLinkBox url={shareUrl} />
        </div>

        <div className="card-pop p-5 flex flex-col gap-3">
          <h2 className="text-lg font-extrabold">
            {hasFriendReview ? "朋友已经评价啦 🎉" : "等待朋友评价中..."}
          </h2>
          <p className="text-sm text-muted-foreground">
            {hasFriendReview
              ? "去看看你和朋友眼中的你是不是同一个版本。"
              : "朋友提交评价后，这里会出现对照结果入口。这个页面会自动刷新。"}
          </p>
          <button
            disabled={!hasFriendReview}
            onClick={() => navigate({ to: "/compare", search: { testId } })}
            className="btn-pop self-start"
          >
            查看对照结果 →
          </button>
        </div>

        <Link to="/" className="text-center text-sm text-muted-foreground underline">
          回首页
        </Link>
      </div>
    </main>
  );
}
