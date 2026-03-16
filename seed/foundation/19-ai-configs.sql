-- ============================================
-- AI CONFIGURATION SEEDS
-- ============================================
-- Instance-level defaults for AI provider settings.
-- These are overridable at tenant and facility level via the
-- Configurations page → AI Settings tab.
-- The AI Gateway falls back to env vars if no value is set here.
--
-- Supported providers:
--   openai    — OpenAI (GPT-4o, etc.)
--   anthropic — Anthropic (Claude)
--   groq      — Groq (Llama, Mixtral — ultra-fast inference)
--   mistral   — Mistral AI (European, strong models)
--   xai       — xAI Grok
--   google    — Google Gemini (via OpenAI-compatible endpoint)
--   ollama    — Self-hosted local models

INSERT INTO instance_configs (id, config_key, value, value_type, category, description, is_overridable, is_sensitive, created_at, updated_at)
VALUES
  -- Active provider
  (gen_random_uuid(), 'ai.provider',              '"openai"',                   'string', 'AI', 'Active LLM provider: openai | anthropic | groq | mistral | xai | google | ollama', true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

  -- OpenAI
  (gen_random_uuid(), 'ai.openai_api_key',        '""',                         'string', 'AI', 'OpenAI API key (sk-...)',                                  true, true,  CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'ai.openai_model',          '"gpt-4o"',                   'string', 'AI', 'OpenAI model for completions',                             true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

  -- Anthropic
  (gen_random_uuid(), 'ai.anthropic_api_key',     '""',                         'string', 'AI', 'Anthropic API key (sk-ant-...)',                           true, true,  CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'ai.anthropic_model',       '"claude-sonnet-4-20250514"', 'string', 'AI', 'Anthropic Claude model for completions',                   true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

  -- Groq
  (gen_random_uuid(), 'ai.groq_api_key',          '""',                         'string', 'AI', 'Groq API key (gsk_...)',                                   true, true,  CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'ai.groq_model',            '"llama-3.3-70b-versatile"',  'string', 'AI', 'Groq model for completions',                               true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

  -- Mistral AI
  (gen_random_uuid(), 'ai.mistral_api_key',       '""',                         'string', 'AI', 'Mistral AI API key',                                       true, true,  CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'ai.mistral_model',         '"mistral-large-latest"',     'string', 'AI', 'Mistral AI model for completions',                         true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

  -- xAI (Grok)
  (gen_random_uuid(), 'ai.xai_api_key',           '""',                         'string', 'AI', 'xAI API key (xai-...)',                                    true, true,  CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'ai.xai_model',             '"grok-2-latest"',            'string', 'AI', 'xAI Grok model for completions',                           true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

  -- Google Gemini
  (gen_random_uuid(), 'ai.google_api_key',        '""',                         'string', 'AI', 'Google AI Studio API key (AIza...)',                       true, true,  CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'ai.google_model',          '"gemini-2.0-flash"',         'string', 'AI', 'Google Gemini model for completions',                      true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

  -- Ollama (self-hosted)
  (gen_random_uuid(), 'ai.ollama_base_url',       '"http://localhost:11434/v1"', 'string', 'AI', 'Ollama server base URL (change for remote Ollama)',        true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'ai.ollama_model',          '"llama3.2"',                 'string', 'AI', 'Ollama model name (must be pulled on the Ollama server)',   true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

  -- Embeddings (always OpenAI)
  (gen_random_uuid(), 'ai.embedding_model',       '"text-embedding-3-small"',   'string', 'AI', 'OpenAI embedding model',                                   true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'ai.embedding_dimensions',  '1536',                       'number', 'AI', 'Embedding vector dimensions',                               true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)

ON CONFLICT (config_key) DO NOTHING;
