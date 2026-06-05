import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "你自以为的你，和朋友眼中的你一样吗？" },
      {
        name: "description",
        content: "测测你在人际关系里的隐藏角色。先自测，再发给朋友评价，看看你以为的自己和朋友眼中的你是不是同一个版本。",
      },
      { property: "og:title", content: "你自以为的你，和朋友眼中的你一样吗？" },
      {
        property: "og:description",
        content: "测测你在人际关系里的隐藏角色。",
      },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <div className="max-w-xl w-full text-center flex flex-col items-center gap-6">
        <div className="flex flex-wrap justify-center gap-2">
          <span className="sticker">朋友视角</span>
          <span className="sticker" style={{ background: "var(--accent)" }}>
            隐藏角色
          </span>
          <span className="sticker">可爱毒舌</span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-black leading-tight">
          你自以为的你，
          <br />
          和朋友眼中的你
          <span className="inline-block px-2 bg-primary text-primary-foreground rounded-lg -rotate-2 mx-1">
            一样
          </span>
          吗？
        </h1>

        <p className="text-lg text-foreground/80 font-medium">
          测测你在人际关系里的隐藏角色
        </p>

        <p className="text-foreground/70 max-w-md">
          先完成自测，再发给朋友测，看看是否一样吧
        </p>

        <Link to="/quiz" className="btn-pop text-lg">
          开始自测 →
        </Link>

        <p className="text-xs text-muted-foreground mt-4 max-w-sm whitespace-pre-line">
          灵感来自「乔哈里窗」：我们对自己的理解，和别人眼中的我们，常常并不完全重合。
          {"\n"}娱乐测试，结果仅供参考
        </p>
      </div>
    </main>
  );
}
