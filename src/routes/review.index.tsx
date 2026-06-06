import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";

const searchSchema = z.object({ testId: z.string().uuid().optional() });

export const Route = createFileRoute("/review/")({
  validateSearch: (s) => searchSchema.parse(s),
  head: () => ({
    meta: [
      { title: "评价你的朋友" },
      { name: "description", content: "TA 在你眼中是什么样的人？" },
    ],
  }),
  component: ReviewIntro,
});

function ReviewIntro() {
  const { testId } = Route.useSearch();
  const navigate = useNavigate();
  const [name, setName] = useState("");

  if (!testId) {
    return (
      <div className="p-12 text-center">
        <p className="mb-4">这个评价链接不完整。</p>
        <Link to="/" className="btn-pop">我也想测测自己</Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen px-4 py-12 flex flex-col items-center">
      <div className="max-w-xl w-full flex flex-col gap-6">
        <div className="text-center flex flex-col items-center gap-3">
          <span className="sticker">朋友视角</span>
          <h1 className="text-3xl font-black leading-snug">
            TA 在你眼中
            <br />
            是什么样的人？
          </h1>
          <p className="text-foreground/70">
            5 道题，不用太认真，但请诚实一点。
          </p>
        </div>

        <div className="card-pop p-6 flex flex-col gap-4">
          <label className="text-sm font-bold">
            你的称呼（可不填）
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="比如：阿喵"
              maxLength={40}
              className="mt-2 w-full px-3 py-2 rounded-xl border-2 border-[var(--ink)] bg-card font-medium"
            />
          </label>
          <p className="text-xs text-muted-foreground">
            填了的话，对照结果里 TA 会知道是你给的评价；不填也完全 OK。
          </p>
          <button
            onClick={() => {
              if (typeof window !== "undefined") {
                if (name.trim()) {
                  sessionStorage.setItem(`friendName:${testId}`, name.trim());
                } else {
                  sessionStorage.removeItem(`friendName:${testId}`);
                }
              }
              navigate({ to: "/review/quiz", search: { testId } });
            }}
            className="btn-pop self-start"
          >
            开始评价 →
          </button>
        </div>

        <Link to="/" className="text-center text-sm text-muted-foreground underline">
          我也想测测自己
        </Link>
      </div>
    </main>
  );
}
