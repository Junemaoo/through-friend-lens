
# 你自以为的你，和朋友眼中的你一样吗？

A lightweight social comparison test: user self-tests, shares a link, friend reviews, then compares "self-perception vs friend's view" across 8 hidden roles.

## Scope (MVP)

Full interaction logic + complete UI scaffold (white / orange / mint sticker style). Cartoon role illustrations will be added later by the user.

## Pages & Routes

```
/                       Home (intro + 开始自测 CTA)
/quiz                   Self-test (5 questions, progress bar)
/result?testId=xxx      Self-test result + share link + view comparison
/review?testId=xxx      Friend review intro (optional nickname)
/review/quiz?testId=xxx Friend 5-question quiz
/review/done?testId=xxx Friend submission confirmation
/compare?testId=xxx     Self vs friend comparison (consensus or hidden role)
```

All routes use TanStack Start file-based routing with proper `head()` metadata.

## Data Layer

Enable **Lovable Cloud** for persistence (test results need to survive across devices: user takes test on phone, friend opens link on theirs).

Two tables:

- `tests` — `id (uuid)`, `self_scores (jsonb)`, `self_result (text)`, `created_at`
- `friend_reviews` — `id`, `test_id (fk)`, `friend_name (text, nullable)`, `friend_scores (jsonb)`, `friend_result (text)`, `submitted_at`

RLS: public insert/select by `test_id` (no auth, link-based access — anyone with the testId can read/write). Service role used server-side via server functions.

Server functions in `src/lib/tests.functions.ts`:
- `createTest({ selfScores, selfResult })` → returns testId
- `getTest({ testId })` → returns self + latest friend review
- `submitFriendReview({ testId, friendName, friendScores, friendResult })`

## Scoring Engine (`src/lib/scoring.ts`)

Pure functions, fully unit-testable:

- `SELF_QUESTIONS` / `FRIEND_QUESTIONS` — question banks with per-option dimension deltas (from PRD §13–14)
- `ROLES` — 8 role definitions (id A–H, name, tagline, description, group)
- `computeScores(answers, questions)` — sums 11 dimensions
- `computeRole(scores, mode, answers)` — applies role formulas (§15) and tiebreak rules (§16, self vs friend differ)
- `compareResults(selfRole, friendRole)` — returns `{ status: 'consensus' | 'slight' | 'reversal', selfRole, friendRole }` using the 4 group buckets (§18)

## Components

- `QuizRunner` — shared 5-question flow (props: questions, onComplete), bubble-style option cards, progress dots
- `RoleCard` — sticker-tag role display (name, tagline, description); placeholder mascot slot ready for upcoming illustrations
- `ShareLinkBox` — copy-to-clipboard with toast
- `CompareCards` — side-by-side "我以为的我 / 朋友眼中的我" cards with status banner

UI primitives from existing shadcn (`button`, `card`, `progress`, `input`, `sonner`).

## Design System (`src/styles.css`)

Add semantic tokens (oklch):
- `--background` white
- `--primary` rich orange (highlight, CTA)
- `--accent` mint green (balance, secondary tag)
- `--foreground` near-black (bold headings)
- `--muted` light gray (helper text)
- `--sticker-shadow` soft drop shadow for sticker-tag look

Typography: bold black headings, rounded body. Mobile-first centered card layout.

## Sharing

- `testId` is the uuid from `tests` table
- Self result page shows `/review?testId=...` link with copy button
- Friend done page links back to `/compare?testId=...` (sent to original user) and offers "我也想自测"
- Result-card screenshot: render an on-page card the user can screenshot (no canvas export in MVP)

## Out of Scope (MVP)

Auth, multi-friend aggregation, generated share-image export, mascot illustrations (placeholders only until user provides assets).

## Technical Notes

- TanStack Start + TanStack Query for `getTest` polling on the compare page (so user sees friend review when it arrives)
- All copy in Simplified Chinese per PRD
- Friend review answers stored server-side; comparison computed client-side from returned scores
- `/compare` shows "等待朋友评价中…" state until a `friend_reviews` row exists
