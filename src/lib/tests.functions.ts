// Server functions backing the personality test. Uses the admin client
// because all access is link-based (testId is the secret).
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const scoresSchema = z.record(z.string(), z.number());

export const createTest = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      selfScores: scoresSchema,
      selfResult: z.string().min(1).max(1),
    }),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import(
      "@/integrations/supabase/client.server"
    );
    const { data: row, error } = await supabaseAdmin
      .from("tests")
      .insert({
        self_scores: data.selfScores,
        self_result: data.selfResult,
      })
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    return { testId: row.id as string };
  });

export const getTest = createServerFn({ method: "GET" })
  .inputValidator(
    z.object({
      testId: z.string().uuid(),
      reviewId: z.string().uuid().optional(),
    }),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import(
      "@/integrations/supabase/client.server"
    );
    const { data: test, error } = await supabaseAdmin
      .from("tests")
      .select("id, self_scores, self_result, created_at")
      .eq("id", data.testId)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!test) {
      return { test: null, friendReviews: [], selectedReview: null };
    }

    const { data: reviews, error: rerr } = await supabaseAdmin
      .from("friend_reviews")
      .select("id, friend_name, friend_scores, friend_result, submitted_at")
      .eq("test_id", data.testId)
      .order("submitted_at", { ascending: false });
    if (rerr) throw new Error(rerr.message);

    const friendReviews = reviews ?? [];
    const selectedReview = data.reviewId
      ? friendReviews.find((review) => review.id === data.reviewId) ?? null
      : null;

    return {
      test,
      friendReviews,
      selectedReview,
    };
  });

export const submitFriendReview = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      testId: z.string().uuid(),
      friendName: z.string().max(40).optional().nullable(),
      friendScores: scoresSchema,
      friendResult: z.string().min(1).max(1),
    }),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import(
      "@/integrations/supabase/client.server"
    );
    const { data: row, error } = await supabaseAdmin
      .from("friend_reviews")
      .insert({
        test_id: data.testId,
        friend_name: data.friendName?.trim() || null,
        friend_scores: data.friendScores,
        friend_result: data.friendResult,
      })
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    return { ok: true, reviewId: row.id as string };
  });

