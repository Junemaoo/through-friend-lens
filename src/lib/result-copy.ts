import { ROLES, type RoleId } from "@/lib/roles";

export function getFriendLabel(
  friendName?: string | null,
  fallback = "这位朋友",
) {
  const trimmed = friendName?.trim();
  return trimmed ? `「${trimmed}」` : fallback;
}

export function getComparisonNarrative(
  selfRole: RoleId,
  friendRole: RoleId,
  friendName?: string | null,
) {
  const label = getFriendLabel(friendName);

  if (selfRole === friendRole) {
    return {
      matched: true,
      title: "朋友官方认证成功！",
      helper: `你对自己的定位很准。不是你自我感觉良好，${label}也确实这样感受到你。`,
      short: "人设稳定，暂无翻车迹象。",
    };
  }

  return {
    matched: false,
    title: "隐藏角色解锁！",
    helper: `你以为自己在人际里更像 ${ROLES[selfRole].name}，但 ${label} 看见的是另一个版本的你。`,
    short: `${label} 眼中的你是 ${ROLES[friendRole].name}。`,
  };
}

export function getFriendReviewCardCopy(selfRole: RoleId, friendRole: RoleId) {
  if (selfRole === friendRole) {
    return {
      title: "朋友官方认证成功！",
      helper: "人设稳定，暂无翻车迹象。",
    };
  }

  return {
    title: "隐藏角色解锁！",
    helper: `你以为你是 ${ROLES[selfRole].name}，但 TA 眼中的你是 ${ROLES[friendRole].name}。`,
  };
}

export function getReviewerDeliveryNarrative(
  selfRole: RoleId,
  friendRole: RoleId,
) {
  if (selfRole === friendRole) {
    return {
      matched: true,
      title: "你们达成共识！",
      helper: `TA 以为自己是 ${ROLES[selfRole].name}，你也这样看见 TA。`,
    };
  }

  return {
    matched: false,
    title: "你解锁了 TA 的隐藏角色！",
    helper: `TA 以为自己是 ${ROLES[selfRole].name}，但你眼中的 TA 是 ${ROLES[friendRole].name}。`,
  };
}
