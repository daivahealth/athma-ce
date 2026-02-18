-- ============================================================================
-- pgvector Extension Setup for Clinical Semantic Search
-- Run this BEFORE running prisma db push if pgvector isn't installed
-- ============================================================================

-- Enable the pgvector extension
-- This requires superuser privileges or the extension must be pre-installed
CREATE EXTENSION IF NOT EXISTS vector;

-- Create the HNSW index for fast approximate nearest neighbor search
-- This index is tuned for medical precision (higher m and ef values)
-- Note: The index will be created automatically by Prisma, but if you need
-- custom tuning, run this after the table is created:

-- DROP INDEX IF EXISTS idx_embedding_vector;
-- CREATE INDEX idx_embedding_vector ON clinical_document_embeddings
-- USING hnsw (embedding vector_cosine_ops)
-- WITH (m = 24, ef_construction = 200);

-- Verify the extension is installed
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'vector') THEN
    RAISE EXCEPTION 'pgvector extension is not installed. Please install it first.';
  ELSE
    RAISE NOTICE 'pgvector extension is installed and ready.';
  END IF;
END $$;

-- Check vector functions are available
SELECT
  'pgvector ready' AS status,
  (SELECT extversion FROM pg_extension WHERE extname = 'vector') AS version;
