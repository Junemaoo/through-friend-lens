import { useState } from "react";
import { toast } from "sonner";

export function ShareLinkBox({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("链接已复制，去发给朋友吧～");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("复制失败，请手动复制");
    }
  };
  return (
    <div className="flex flex-col sm:flex-row gap-2 items-stretch">
      <input
        readOnly
        value={url}
        onFocus={(e) => e.currentTarget.select()}
        className="flex-1 px-3 py-2 rounded-xl border-2 border-[var(--ink)] bg-secondary font-mono text-sm"
      />
      <button onClick={copy} className="btn-pop btn-mint">
        {copied ? "已复制 ✓" : "复制链接"}
      </button>
    </div>
  );
}
