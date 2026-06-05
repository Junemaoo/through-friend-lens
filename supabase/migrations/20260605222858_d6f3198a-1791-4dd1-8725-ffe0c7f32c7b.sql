
CREATE TABLE public.tests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  self_scores JSONB NOT NULL,
  self_result TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.friend_reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  test_id UUID NOT NULL REFERENCES public.tests(id) ON DELETE CASCADE,
  friend_name TEXT,
  friend_scores JSONB NOT NULL,
  friend_result TEXT NOT NULL,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_friend_reviews_test_id ON public.friend_reviews(test_id, submitted_at DESC);

GRANT SELECT, INSERT ON public.tests TO anon, authenticated;
GRANT ALL ON public.tests TO service_role;
GRANT SELECT, INSERT ON public.friend_reviews TO anon, authenticated;
GRANT ALL ON public.friend_reviews TO service_role;

ALTER TABLE public.tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.friend_reviews ENABLE ROW LEVEL SECURITY;

-- Link-based access: anyone with the testId (uuid) can read/insert.
CREATE POLICY "Anyone can read tests" ON public.tests FOR SELECT USING (true);
CREATE POLICY "Anyone can create tests" ON public.tests FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can read friend reviews" ON public.friend_reviews FOR SELECT USING (true);
CREATE POLICY "Anyone can create friend reviews" ON public.friend_reviews FOR INSERT WITH CHECK (true);
