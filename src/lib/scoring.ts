// Scoring engine: computes dimension scores, role match, and compares results.
import {
  DIMENSIONS,
  type Dimension,
  type Question,
  type Scores,
} from "./questions";
import { ROLES, type RoleId } from "./roles";

export type Answers = Record<string, "A" | "B" | "C" | "D" | "E">;

export function emptyScores(): Scores {
  return DIMENSIONS.reduce((acc, d) => {
    acc[d] = 0;
    return acc;
  }, {} as Scores);
}

export function computeScores(answers: Answers, questions: Question[]): Scores {
  const scores = emptyScores();
  for (const q of questions) {
    const optKey = answers[q.id];
    if (!optKey) continue;
    const opt = q.options.find((o) => o.key === optKey);
    if (!opt) continue;
    for (const [dim, delta] of Object.entries(opt.deltas)) {
      scores[dim as Dimension] += delta as number;
    }
  }
  return scores;
}

function roleScores(s: Scores): Record<RoleId, number> {
  return {
    A: s.SI * 2 + s.Agency * 1.5 - s.Defense * 0.5,
    B: s.SE * 2 + s.Communion * 1.5 - s.Boundary * 0.3,
    C: s.SA * 2 + s.Expression * 1.5 + s.Communion * 0.5,
    D: s.SR * 2 + s.Boundary * 1 + s.Communion * 0.5 - s.Expression * 0.5,
    E: s.SC * 2 + s.Communion * 1 + s.Hidden * 0.5,
    F: s.Boundary * 2 + s.Communion * 0.5 + s.Defense * 0.5,
    G: s.Hidden * 2 + s.Communion * 1 - s.Expression * 0.5,
    H: s.Defense * 2 + s.Boundary * 1 - s.Expression * 0.5,
  };
}

// Self tiebreak priority (PRD §16.1): prefer self-aware roles
const SELF_PRIORITY: RoleId[] = ["G", "H", "F", "B", "A", "E", "D", "C"];
// Friend tiebreak priority (PRD §16.2): prefer outwardly visible roles
const FRIEND_PRIORITY: RoleId[] = ["C", "B", "A", "E", "D", "F", "G", "H"];

export function computeRole(
  scores: Scores,
  mode: "self" | "friend",
  answers: Answers,
  questions: Question[],
): RoleId {
  const totals = roleScores(scores);
  const max = Math.max(...Object.values(totals));
  const tied = (Object.entries(totals) as [RoleId, number][])
    .filter(([, v]) => Math.abs(v - max) < 1e-9)
    .map(([k]) => k);
  if (tied.length === 1) return tied[0];

  // Tiebreak 1: last question (Q5/FQ5) contribution
  const lastId = mode === "self" ? "Q5" : "FQ5";
  const semiId = mode === "self" ? "Q4" : "FQ2";
  for (const qid of [lastId, semiId]) {
    const subAnswers: Answers = { [qid]: answers[qid] };
    const subQuestions = questions.filter((q) => q.id === qid);
    if (!subAnswers[qid]) continue;
    const subScores = computeScores(subAnswers, subQuestions);
    const subTotals = roleScores(subScores);
    let best: RoleId = tied[0];
    let bestVal = -Infinity;
    for (const r of tied) {
      if (subTotals[r] > bestVal) {
        bestVal = subTotals[r];
        best = r;
      }
    }
    const stillTied = tied.filter((r) => subTotals[r] === bestVal);
    if (stillTied.length === 1) return best;
  }

  // Final fallback: priority order
  const priority = mode === "self" ? SELF_PRIORITY : FRIEND_PRIORITY;
  for (const r of priority) {
    if (tied.includes(r)) return r;
  }
  return tied[0];
}

export type CompareStatus = "consensus" | "slight" | "reversal";

export interface CompareResult {
  status: CompareStatus;
  selfRole: RoleId;
  friendRole: RoleId;
  banner: string;
  helper: string;
}

export function compareResults(
  selfRole: RoleId,
  friendRole: RoleId,
): CompareResult {
  if (selfRole === friendRole) {
    return {
      status: "consensus",
      selfRole,
      friendRole,
      banner: "朋友官方认证成功！",
      helper: "人设稳定，暂无翻车迹象。",
    };
  }
  const sameGroup = ROLES[selfRole].group === ROLES[friendRole].group;
  if (sameGroup) {
    return {
      status: "slight",
      selfRole,
      friendRole,
      banner: "轻微偏差",
      helper: "你们看见的是同一个你，只是角度不一样。",
    };
  }
  return {
    status: "reversal",
    selfRole,
    friendRole,
    banner: "隐藏角色解锁！",
    helper: `你以为自己在人际里更像 ${ROLES[selfRole].name}，但朋友看见的是另一个版本的你。`,
  };
}
