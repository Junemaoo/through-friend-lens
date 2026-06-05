import roleA from "@/assets/role-a.png.asset.json";
import roleB from "@/assets/role-b.png.asset.json";
import roleC from "@/assets/role-c.png.asset.json";
import roleD from "@/assets/role-d.png.asset.json";
import roleE from "@/assets/role-e.png.asset.json";
import roleF from "@/assets/role-f.png.asset.json";
import roleG from "@/assets/role-g.png.asset.json";
import roleH from "@/assets/role-h.png.asset.json";
import type { RoleId } from "@/lib/roles";

export const ROLE_IMAGES: Record<RoleId, { url: string; alt: string }> = {
  A: { url: roleA.url, alt: "人间清醒官角色形象" },
  B: { url: roleB.url, alt: "情绪接线员角色形象" },
  C: { url: roleC.url, alt: "气氛点火器角色形象" },
  D: { url: roleD.url, alt: "离线守护者角色形象" },
  E: { url: roleE.url, alt: "细节大捕手角色形象" },
  F: { url: roleF.url, alt: "边界拉扯王角色形象" },
  G: { url: roleG.url, alt: "人格折叠师角色形象" },
  H: { url: roleH.url, alt: "嘴硬跑路王角色形象" },
};
