// 8 hidden roles in the people-relationship test.
// Codes A–H map to the spec in PRD §10–§11.

export type RoleId = "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H";

export interface Role {
  id: RoleId;
  name: string;
  tagline: string;
  description: string;
  group: "rational" | "emotional" | "social" | "hidden";
  groupLabel: string;
  accent: "orange" | "mint";
}

export const ROLES: Record<RoleId, Role> = {
  A: {
    id: "A",
    name: "人间清醒官",
    tagline: "朋友还在情绪风暴里原地打转，你已经画完一整张流程图。",
    description:
      "你是那个能把混乱事情说清楚的人。朋友遇到问题时，会觉得你能帮 TA 把局面拆开、把逻辑捋清、把下一步看明白。你以为自己只是冷静分析，但朋友感受到的是一种可靠和稳定。",
    group: "rational",
    groupLabel: "理性 / 功能组",
    accent: "orange",
  },
  B: {
    id: "B",
    name: "情绪接线员",
    tagline: "朋友一崩溃就找你，你总能稳稳接住每一缕情绪，用理解以回应。",
    description:
      "你是那个让人愿意倾诉的人。朋友不一定期待你立刻给出解决方案，但会觉得你能理解 TA 的感受。你可能觉得自己不会安慰人，但朋友已经把你当成情绪出口。",
    group: "emotional",
    groupLabel: "情绪 / 陪伴组",
    accent: "mint",
  },
  C: {
    id: "C",
    name: "气氛点火器",
    tagline: "只要你在场，这个局就不会冷！",
    description:
      "你是那个能让关系流动起来的人。有你在，群体不容易尴尬，沉默也不会太难熬。你以为自己只是随口开玩笑，但朋友可能觉得你让整个关系变得更轻松。",
    group: "social",
    groupLabel: "活跃 / 关系调节组",
    accent: "orange",
  },
  D: {
    id: "D",
    name: "离线守护者",
    tagline: "你不是时刻都在线，但重要的时刻不会缺席。",
    description:
      "你不一定每天出现，也不一定高频聊天，但朋友知道真正有事的时候你不会消失。你可能觉得自己不够主动，但朋友看重的是你关键时刻的可靠。",
    group: "emotional",
    groupLabel: "情绪 / 陪伴组",
    accent: "mint",
  },
  E: {
    id: "E",
    name: "细节大捕手",
    tagline: "你不会把"我关心你"挂在嘴上，但总能记住别人以为没人会在意的小事。",
    description:
      "你是那个会记得细节的人。你可能不会盛大表达爱，但会通过具体行动让朋友感受到被在意。你觉得那些只是小事，但朋友可能早就记住了你的用心。",
    group: "rational",
    groupLabel: "理性 / 功能组",
    accent: "orange",
  },
  F: {
    id: "F",
    name: "边界拉扯王",
    tagline: "你不是不想亲近，只是太近会想开窗透口气。",
    description:
      "你不是冷漠，而是需要在关系里保留自己的空间。你可以靠近别人，也会在太近的时候想后退一点。你以为自己只是正常保持距离，但朋友可能感受到你在"靠近"和"退后"之间反复拉扯。",
    group: "social",
    groupLabel: "活跃 / 关系调节组",
    accent: "mint",
  },
  G: {
    id: "G",
    name: "人格折叠师",
    tagline: "你很会配合每一种关系，却很少把完整的自己摊开给别人看。",
    description:
      "你很会相处，也很会让别人舒服。你能根据不同关系调整自己，但也因此不一定让别人真正看清完整的你。你以为自己只是好相处，但朋友可能隐约觉得：你有一部分自己没有被放出来。",
    group: "hidden",
    groupLabel: "隐藏 / 防御组",
    accent: "orange",
  },
  H: {
    id: "H",
    name: "嘴硬跑路王",
    tagline: "越在乎越嘴硬，越心动越想撤退——先跑为敬。",
    description:
      "你不是没有感情，而是感情越重要，越容易先装作没事。你可能会用冷静、消失、转移话题或嘴硬来保护自己的真心。你以为自己藏得很好，但熟悉你的人可能早就看出来：你不是不在乎，只是不想先暴露自己。",
    group: "hidden",
    groupLabel: "隐藏 / 防御组",
    accent: "mint",
  },
};

export const ROLE_LIST: Role[] = Object.values(ROLES);
