import { Link } from "@tanstack/react-router";
import { RoleCard } from "@/components/RoleCard";
import { ROLES, type RoleId } from "@/lib/roles";
import {
  getComparisonNarrative,
  getFriendLabel,
} from "@/lib/result-copy";

interface FriendReviewItem {
  id: string;
  friend_name: string | null;
  friend_result: string;
}

interface Props {
  testId: string;
  selfRoleId: RoleId;
  review: FriendReviewItem;
  onInviteMore?: () => void;
}

export function SingleComparisonView({
  testId,
  selfRoleId,
  review,
  onInviteMore,
}: Props) {
  const selfRole = ROLES[selfRoleId];
  const friendRole = ROLES[review.friend_result as RoleId];
  const friendLabel = getFriendLabel(review.friend_name);
  const narrative = getComparisonNarrative(
    selfRole.id,
    friendRole.id,
    review.friend_name,
  );

  return (
    <main className="min-h-screen px-4 py-8">
      <div className="max-w-4xl mx-auto flex flex-col gap-6">
        <div className="text-center">
          <span className="sticker mb-3">
            {review.friend_name?.trim()
              ? `你和${friendLabel}的对照结果`
              : "你和这位朋友的对照结果"}
          </span>
        </div>

        <section
          className="card-pop p-6 text-center"
          style={{
            background: narrative.matched ? "var(--accent)" : "var(--primary)",
            color: narrative.matched
              ? "var(--accent-foreground)"
              : "var(--primary-foreground)",
          }}
        >
          <h1 className="text-3xl font-black mb-3">{narrative.title}</h1>
          <p className="text-sm sm:text-base opacity-90 leading-relaxed">
            {narrative.helper}
          </p>
          <p className="mt-3 font-extrabold">{narrative.short}</p>
        </section>

        <div className="grid gap-4 sm:grid-cols-2">
          <RoleCard role={selfRole} label="你以为你是" compact />
          <RoleCard
            role={friendRole}
            label={review.friend_name?.trim() ? `${friendLabel}眼中的你` : "这位朋友眼中的你"}
            compact
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-3 sm:justify-center">
          <Link to="/result" search={{ testId }} className="btn-pop btn-ghost justify-center">
            返回朋友视角列表
          </Link>
          {onInviteMore && (
            <button onClick={onInviteMore} className="btn-pop btn-mint justify-center">
              邀请更多朋友评价我
            </button>
          )}
        </div>

        <p className="text-center text-xs text-muted-foreground">
          娱乐测试，结果仅供参考。
        </p>
      </div>
    </main>
  );
}
