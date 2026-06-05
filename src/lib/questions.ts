// Question banks for self-test (5 Qs) and friend review (5 Qs).
// Each option contains a partial map of dimension → score delta.

export type Dimension =
  | "Agency"
  | "Communion"
  | "Expression"
  | "Boundary"
  | "Defense"
  | "Hidden"
  | "SI"
  | "SE"
  | "SA"
  | "SC"
  | "SR";

export const DIMENSIONS: Dimension[] = [
  "Agency",
  "Communion",
  "Expression",
  "Boundary",
  "Defense",
  "Hidden",
  "SI",
  "SE",
  "SA",
  "SC",
  "SR",
];

export type Scores = Record<Dimension, number>;

export interface QuestionOption {
  key: "A" | "B" | "C" | "D" | "E";
  text: string;
  deltas: Partial<Scores>;
}

export interface Question {
  id: string;
  prompt: string;
  options: QuestionOption[];
}

export const SELF_QUESTIONS: Question[] = [
  {
    id: "Q1",
    prompt: "朋友突然发来一大段崩溃小作文，你通常会？",
    options: [
      {
        key: "A",
        text: "先发点表情包 / 玩笑缓一下，再慢慢聊正事",
        deltas: { Expression: 2, SA: 2, Communion: 0.5 },
      },
      {
        key: "B",
        text: "不一定说很多，但会记住这件事，之后再问 TA 怎么样了",
        deltas: { SC: 2, SR: 1, Communion: 1, Expression: -0.5 },
      },
      {
        key: "C",
        text: "先抓重点，帮 TA 理清问题到底卡在哪里",
        deltas: { Agency: 2, SI: 2, Communion: 0.5 },
      },
      {
        key: "D",
        text: "会担心 TA，但如果情绪太满，我需要先消化一下再回复",
        deltas: { Boundary: 2, Defense: 1, Expression: -1 },
      },
      {
        key: "E",
        text: "认真读完，先回应 TA 的感受，不急着给结论",
        deltas: { Communion: 2, SE: 2 },
      },
    ],
  },
  {
    id: "Q2",
    prompt: "你最常用什么方式表达"我在乎你"？",
    options: [
      {
        key: "A",
        text: "记住你随口说过的小事，然后下次默默做到",
        deltas: { SC: 2, Communion: 1, Expression: -0.5 },
      },
      {
        key: "B",
        text: "帮你分析，陪你做决定，尽量让你少走弯路",
        deltas: { SI: 2, Agency: 2 },
      },
      {
        key: "C",
        text: "不会黏太紧，但重要的时候我会出现",
        deltas: { Boundary: 2, SR: 2, Expression: -1 },
      },
      {
        key: "D",
        text: "把气氛变轻一点，不让你一直陷在难过里",
        deltas: { SA: 2, Expression: 2 },
      },
      {
        key: "E",
        text: "陪你把情绪说完，让你知道这不是你的错",
        deltas: { SE: 2, Communion: 2 },
      },
    ],
  },
  {
    id: "Q3",
    prompt: "当一段关系变得越来越亲近时，你更容易？",
    options: [
      {
        key: "A",
        text: "越在乎越容易别扭，有时会嘴硬或突然后退",
        deltas: { Defense: 2, Boundary: 1, Expression: -1, Communion: 0.5 },
      },
      {
        key: "B",
        text: "更放得开，开玩笑、接梗、主动约见面都变多",
        deltas: { Expression: 2, SA: 1, Communion: 1 },
      },
      {
        key: "C",
        text: "开心，但也会想保留一点自己的空间",
        deltas: { Boundary: 2, Communion: 1, Defense: 0.5 },
      },
      {
        key: "D",
        text: "开始认真思考这段关系怎么维持得更好",
        deltas: { Agency: 1, SI: 1, Boundary: 0.5 },
      },
      {
        key: "E",
        text: "更愿意分享感受，也更想理解对方",
        deltas: { Communion: 2, SE: 1, Expression: 1 },
      },
    ],
  },
  {
    id: "Q4",
    prompt: "朋友可能最容易误会你哪一点？",
    options: [
      {
        key: "A",
        text: "以为我很好说话，所以没注意到我也有自己的想法",
        deltas: { Hidden: 2, Communion: 1, Expression: -1 },
      },
      {
        key: "B",
        text: "以为我冷淡，其实我是怕太认真会显得很狼狈",
        deltas: { Defense: 2, Boundary: 1, Expression: -1 },
      },
      {
        key: "C",
        text: "以为我只是在搞笑，其实我是在让大家别那么尴尬",
        deltas: { SA: 2, Expression: 1, Communion: 1 },
      },
      {
        key: "D",
        text: "以为我太理性，其实我是想帮忙解决问题",
        deltas: { SI: 2, Agency: 1, Expression: -0.5 },
      },
      {
        key: "E",
        text: "以为我不主动就是不在乎",
        deltas: { SR: 2, Boundary: 1, Expression: -1 },
      },
    ],
  },
  {
    id: "Q5",
    prompt: "你最希望朋友在关系里感受到你哪一点？",
    options: [
      {
        key: "A",
        text: "我不一定时时刻刻在，但我值得信任",
        deltas: { SR: 2, Boundary: 1 },
      },
      {
        key: "B",
        text: "跟我说话，情绪可以被好好放下",
        deltas: { SE: 2, Communion: 2 },
      },
      {
        key: "C",
        text: "和我相处很舒服，但也希望你能慢慢看见真正的我",
        deltas: { Hidden: 1.5, Communion: 1, Expression: -0.5 },
      },
      {
        key: "D",
        text: "跟我聊完，事情会变清楚一点",
        deltas: { SI: 2, Agency: 1 },
      },
      {
        key: "E",
        text: "跟我在一起，不会无聊也不会太沉重",
        deltas: { SA: 2, Expression: 1 },
      },
    ],
  },
];

export const FRIEND_QUESTIONS: Question[] = [
  {
    id: "FQ1",
    prompt: "你最常在什么情况下想到 TA？",
    options: [
      {
        key: "A",
        text: "我想轻松一点、找人聊天缓一缓的时候",
        deltas: { SA: 2, Expression: 1 },
      },
      {
        key: "B",
        text: "我真的遇到事，需要一个靠谱的人在的时候",
        deltas: { SR: 2, SC: 1 },
      },
      {
        key: "C",
        text: "我想不清楚、需要有人帮我分析的时候",
        deltas: { SI: 2, Agency: 1 },
      },
      {
        key: "D",
        text: "我想找一个相处舒服、不会给我压力的人时",
        deltas: { Boundary: 1, Communion: 1, Hidden: 0.5 },
      },
      {
        key: "E",
        text: "我情绪很乱、想被理解的时候",
        deltas: { SE: 2, Communion: 2 },
      },
    ],
  },
  {
    id: "FQ2",
    prompt: "TA 给你的最强感受是？",
    options: [
      {
        key: "A",
        text: "可靠：TA 不一定高频出现，但关键时刻在",
        deltas: { SR: 2, Boundary: 1 },
      },
      {
        key: "B",
        text: "清醒：TA 总能把复杂事情理顺",
        deltas: { SI: 2, Agency: 2 },
      },
      {
        key: "C",
        text: "神秘：TA 很好相处，但总觉得还有一部分没展开",
        deltas: { Hidden: 2, Expression: -1 },
      },
      {
        key: "D",
        text: "轻松：TA 在的时候气氛不会冷",
        deltas: { SA: 2, Expression: 2 },
      },
      {
        key: "E",
        text: "安心：TA 能接住我的情绪",
        deltas: { SE: 2, Communion: 2 },
      },
    ],
  },
  {
    id: "FQ3",
    prompt: "TA 表达在乎的方式更像？",
    options: [
      {
        key: "A",
        text: "听你说完，让你觉得被理解",
        deltas: { SE: 2, Communion: 2 },
      },
      {
        key: "B",
        text: "嘴上不太说，甚至有点别扭，但能感觉到 TA 在乎",
        deltas: { Defense: 2, Expression: -1, Communion: 0.5 },
      },
      {
        key: "C",
        text: "记住小事，默默做点什么",
        deltas: { SC: 2, Communion: 1 },
      },
      {
        key: "D",
        text: "帮你分析，给你建议",
        deltas: { SI: 2, Agency: 1 },
      },
      {
        key: "E",
        text: "逗你开心，把气氛弄轻一点",
        deltas: { SA: 2, Expression: 1 },
      },
    ],
  },
  {
    id: "FQ4",
    prompt: "如果你觉得 TA 有距离感，最可能是因为？",
    options: [
      {
        key: "A",
        text: "TA 本来就需要空间，不喜欢太黏",
        deltas: { Boundary: 2, Expression: -0.5 },
      },
      {
        key: "B",
        text: "TA 总会用玩笑带过认真话题",
        deltas: { SA: 1, Defense: 1, Expression: 1 },
      },
      {
        key: "C",
        text: "TA 太习惯理性分析，情绪表达慢半拍",
        deltas: { SI: 1, Agency: 1, Expression: -0.5 },
      },
      {
        key: "D",
        text: "TA 很会配合别人，但不太主动说自己",
        deltas: { Hidden: 2, Communion: 1, Expression: -1 },
      },
      {
        key: "E",
        text: "TA 接住太多情绪后，也需要自己缓一缓",
        deltas: { SE: 1, Boundary: 1, Communion: 1 },
      },
    ],
  },
  {
    id: "FQ5",
    prompt: "如果用一句话"朋友认证"TA，你会选？",
    options: [
      {
        key: "A",
        text: "你不太直说，但我知道你在乎",
        deltas: { Defense: 1, SC: 1, Communion: 0.5 },
      },
      {
        key: "B",
        text: "你总能把我从混乱里捞出来",
        deltas: { SI: 2, Agency: 1 },
      },
      {
        key: "C",
        text: "有你在，这个局就不会冷",
        deltas: { SA: 2, Expression: 1 },
      },
      {
        key: "D",
        text: "你不常在线，但重要时刻不会缺席",
        deltas: { SR: 2, Boundary: 1 },
      },
      {
        key: "E",
        text: "你让我觉得，我的情绪可以被好好放下",
        deltas: { SE: 2, Communion: 2 },
      },
    ],
  },
];
