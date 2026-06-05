import { Link } from "@tanstack/react-router";
import { RoleImage } from "@/components/RoleImage";
import { ROLES, type RoleId } from "@/lib/roles";
import { getFriendReviewCardCopy } from "@/lib/result-copy";

interface FriendReviewItem {
  id: string;
  friend_name: string | null;
  friend_result: string;
}

interface Props {
  testId: string;
  selfRoleId: RoleId;
  review: FriendReviewItem;
}

export function FriendReviewCard({ testId, selfRoleId, review }: Props) {
  const friendRole = ROLES[review.friend_result as RoleId];
  const displayName = review.friend_name?.trim() || "一位朋友";
  const copy = getFriendReviewCardCopy(selfRoleId, friendRole.id);

  return (
    <article className="card-pop p-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-4 min-w-0">
        <div className="shrink-0 rounded-[1.25rem] bg-secondary p-2 border-2 border-[var(--ink)]">
          <RoleImage roleId={friendRole.id} className="h-20 w-20 object-contain" />
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="text-lg font-extrabold leading-snug break-words">
            {displayName} 觉得你是：{friendRole.name}
          </h3>
          <p className="mt-1 text-sm font-semibold text-foreground/90">{copy.title}</p>
          <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
            {copy.helper}
          </p>
        </div>
      </div>

      <Link
        to="/result"
        search={{ testId, reviewId: review.id }}
        className="btn-pop self-start sm:self-center whitespace-nowrap"
      >
        查看对照
      </Link>
    </article>
  );
}
