import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { RoleCard } from "@/components/RoleCard";
import { ShareLinkBox } from "@/components/ShareLinkBox";
import { ROLES, type RoleId } from "@/lib/roles";

const searchSchema = z.object({
  testId: z.string().uuid(),
  result: z.enum(["A", "B", "C", "D", "E", "F", "G", "H"]),
});

export const Route = createFileRoute("/review/done")({
  validateSearch: (s) => searchSchema.parse(s),
  head: () => ({ meta: [{ title: "评价已送达" }] }),
  component: ReviewDone,
});

function ReviewDone() {
  const { result } = Route.useSearch();
  const role = ROLES[result as RoleId];
  const [shareUrl, setShareUrl] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setShareUrl(window.location.origin + "/");
    }
  }, []);

  return (
    <main className="min-h-screen px-4 py-12 flex flex-col items-center">
      <div className="max-w-xl w-full flex flex-col gap-6">
        <div className="text-center flex flex-col items-center gap-3">
          <span className="sticker" style={{ background: "var(--accent)" }}>
            评价已送达 ✓
          </span>
          <h1 className="text-3xl font-black">你觉得 TA 是</h1>
        </div>

        <RoleCard role={role} label="你眼中的 TA" />

        <p className="text-center text-foreground/70">
          这份朋友视角已经悄悄送到 TA 的结果页了。
        </p>

        <div className="card-pop p-5 flex flex-col gap-3">
          <h2 className="text-lg font-extrabold">我也想自测一下</h2>
          <p className="text-sm text-muted-foreground">
            你也来测测自己在人际关系里是什么角色？
          </p>
          <Link to="/" className="btn-pop self-start">
            开始我的自测 →
          </Link>
        </div>

        <div className="card-pop p-5 flex flex-col gap-3" style={{ background: "var(--secondary)" }}>
          <h2 className="text-lg font-extrabold">把链接发给另一个朋友</h2>
          <ShareLinkBox url={shareUrl} />
        </div>
      </div>
    </main>
  );
}
