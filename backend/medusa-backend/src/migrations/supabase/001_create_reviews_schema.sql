-- Create customer profiles table to link Medusa customers with Supabase users
CREATE TABLE IF NOT EXISTS customer_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  medusa_customer_id VARCHAR(255) UNIQUE NOT NULL,
  supabase_user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id VARCHAR(255) NOT NULL,
  customer_id VARCHAR(255) NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  verified_purchase BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create review votes table
CREATE TABLE IF NOT EXISTS review_votes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  review_id UUID NOT NULL REFERENCES reviews(id) ON DELETE CASCADE,
  customer_id VARCHAR(255) NOT NULL,
  is_helpful BOOLEAN NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(review_id, customer_id)
);

-- Create social shares tracking table
CREATE TABLE IF NOT EXISTS social_shares (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id VARCHAR(255) NOT NULL,
  customer_id VARCHAR(255),
  platform VARCHAR(50) NOT NULL,
  share_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_reviews_product_id ON reviews(product_id);
CREATE INDEX idx_reviews_customer_id ON reviews(customer_id);
CREATE INDEX idx_reviews_created_at ON reviews(created_at DESC);
CREATE INDEX idx_review_votes_review_id ON review_votes(review_id);
CREATE INDEX idx_social_shares_product_id ON social_shares(product_id);

-- Create a view for review statistics
CREATE OR REPLACE VIEW review_stats AS
SELECT 
  product_id,
  COUNT(*) as total_reviews,
  AVG(rating)::NUMERIC(3,2) as average_rating,
  COUNT(CASE WHEN rating = 1 THEN 1 END) as total_1_star,
  COUNT(CASE WHEN rating = 2 THEN 1 END) as total_2_star,
  COUNT(CASE WHEN rating = 3 THEN 1 END) as total_3_star,
  COUNT(CASE WHEN rating = 4 THEN 1 END) as total_4_star,
  COUNT(CASE WHEN rating = 5 THEN 1 END) as total_5_star
FROM reviews
GROUP BY product_id;

-- Create function to get review with vote counts
CREATE OR REPLACE FUNCTION get_review_with_votes(review_id UUID)
RETURNS TABLE (
  id UUID,
  product_id VARCHAR(255),
  customer_id VARCHAR(255),
  rating INTEGER,
  title VARCHAR(255),
  content TEXT,
  verified_purchase BOOLEAN,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ,
  helpful_count BIGINT,
  not_helpful_count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    r.id,
    r.product_id,
    r.customer_id,
    r.rating,
    r.title,
    r.content,
    r.verified_purchase,
    r.created_at,
    r.updated_at,
    COUNT(CASE WHEN rv.is_helpful = true THEN 1 END) as helpful_count,
    COUNT(CASE WHEN rv.is_helpful = false THEN 1 END) as not_helpful_count
  FROM reviews r
  LEFT JOIN review_votes rv ON r.id = rv.review_id
  WHERE r.id = review_id
  GROUP BY r.id;
END;
$$ LANGUAGE plpgsql;

-- Enable Row Level Security
ALTER TABLE customer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_shares ENABLE ROW LEVEL SECURITY;

-- Create RLS policies

-- Customer profiles: Users can only see their own profile
CREATE POLICY "Users can view own profile" ON customer_profiles
  FOR SELECT USING (supabase_user_id = auth.uid());

CREATE POLICY "Users can update own profile" ON customer_profiles
  FOR UPDATE USING (supabase_user_id = auth.uid());

-- Reviews: Anyone can read, authenticated users can create/update their own
CREATE POLICY "Anyone can view reviews" ON reviews
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create reviews" ON reviews
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update own reviews" ON reviews
  FOR UPDATE USING (
    customer_id IN (
      SELECT medusa_customer_id FROM customer_profiles 
      WHERE supabase_user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own reviews" ON reviews
  FOR DELETE USING (
    customer_id IN (
      SELECT medusa_customer_id FROM customer_profiles 
      WHERE supabase_user_id = auth.uid()
    )
  );

-- Review votes: Anyone can read, authenticated users can vote
CREATE POLICY "Anyone can view votes" ON review_votes
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can vote" ON review_votes
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update own votes" ON review_votes
  FOR UPDATE USING (
    customer_id IN (
      SELECT medusa_customer_id FROM customer_profiles 
      WHERE supabase_user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own votes" ON review_votes
  FOR DELETE USING (
    customer_id IN (
      SELECT medusa_customer_id FROM customer_profiles 
      WHERE supabase_user_id = auth.uid()
    )
  );

-- Social shares: Anyone can create and view
CREATE POLICY "Anyone can view shares" ON social_shares
  FOR SELECT USING (true);

CREATE POLICY "Anyone can create shares" ON social_shares
  FOR INSERT WITH CHECK (true);