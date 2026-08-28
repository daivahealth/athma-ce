-- PluginActivation.settings was written by the activation API but never read
-- anywhere. Per-tenant plugin configuration lives in the instance → tenant →
-- facility config hierarchy instead (ADR-0015), so the blob is removed to keep
-- a single configuration mechanism.
ALTER TABLE "plugin_activations" DROP COLUMN IF EXISTS "settings";
