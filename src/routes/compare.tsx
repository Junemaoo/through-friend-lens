import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { RoleCard } from "@/components/RoleCard";
import { ROLES, type RoleId } from "@/lib/roles";
import { compareResults } from "@/lib/scoring";
import { getTest } from "@/lib/tests.functions";

const searchSchema = z.object({ testId: z.string().uuid() });

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
  const { testId } = Route.useSearch();
  const fetchTest = useServerFn(getTest);
  const { data, isLoading } = useQuery({
    queryKey: ["test", testId],
    queryFn: () => fetchTest({ data: { testId } }),
    refetchInterval: 4000,
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
  if (!data.friendReview) {
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

  const selfRole = data.test.self_result as RoleId;
  const friendRole = data.friendReview.friend_result as RoleId;
  const friendName = data.friendReview.friend_name;
  const cmp = compareResults(selfRole, friendRole);

  const bannerBg =
    cmp.status === "consensus"
      ? "var(--accent)"
      : cmp.status === "slight"
        ? "var(--secondary)"
        : "var(--primary)";
  const bannerText =
    cmp.status === "reversal" ? "var(--primary-foreground)" : "var(--ink)";

  return (
    <main className="min-h-screen px-4 py-8">
      <div className="max-w-3xl mx-auto flex flex-col gap-6">
        <div
          className="card-pop p-6 text-center"
          style={{ background: bannerBg, color: bannerText }}
        >
          <h1 className="text-3xl font-black mb-2">{cmp.banner}</h1>
          <p className="font-semibold opacity-90">{cmp.helper}</p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <RoleCard role={ROLES[selfRole]} label="你以为你是" compact />
          <RoleCard
            role={ROLES[friendRole]}
            label={friendName ? `来自「${friendName}」` : "一位朋友觉得你是"}
            compact
          />
        </div>

        {cmp.status !== "consensus" && (
          <div className="card-pop p-6">
            <h2 className="text-xl font-extrabold mb-3">
              这份「{ROLES[friendRole].name}」朋友是这样看你的
            </h2>
            <p className="text-foreground/80 leading-relaxed text-sm">
              {ROLES[friendRole].description}
            </p>
          </div>
        )}

        <div className="card-pop p-5 text-center" style={{ background: "var(--secondary)" }}>
          <p className="text-sm text-muted-foreground mb-3">
            想看看另一个朋友怎么说？继续把链接发出去。
          </p>
          <Link
            to="/result"
            search={{ testId }}
            className="btn-pop btn-mint inline-flex"
          >
            返回结果页拿链接
          </Link>
        </div>

        <p className="text-center text-xs text-muted-foreground">
          娱乐测试，结果仅供参考。
        </p>
      </div>
    </main>
  );
}
