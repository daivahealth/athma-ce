-- Migration: Add value_set_code to value_set_concepts table
-- This improves query performance and simplifies API implementation

-- Step 1: Add the column (nullable initially)
ALTER TABLE value_set_concepts
ADD COLUMN value_set_code VARCHAR(100);

-- Step 2: Populate the column from value_sets table
UPDATE value_set_concepts vsc
SET value_set_code = vs.code
FROM value_sets vs
WHERE vsc.value_set_id = vs.id;

-- Step 3: Make the column NOT NULL
ALTER TABLE value_set_concepts
ALTER COLUMN value_set_code SET NOT NULL;

-- Step 4: Add index for query performance
CREATE INDEX idx_value_set_concepts_valueset_code ON value_set_concepts(value_set_code);

-- Step 5: Drop old unique constraint and create new one with value_set_code
ALTER TABLE value_set_concepts
DROP CONSTRAINT value_set_concepts_value_set_id_code_key;

ALTER TABLE value_set_concepts
ADD CONSTRAINT value_set_concepts_value_set_code_code_key
UNIQUE (value_set_code, code);

-- Step 6: Add foreign key constraint to ensure referential integrity
ALTER TABLE value_set_concepts
ADD CONSTRAINT fk_value_set_concepts_code
FOREIGN KEY (value_set_code)
REFERENCES value_sets(code)
ON DELETE CASCADE
ON UPDATE CASCADE;

-- Add comment
COMMENT ON COLUMN value_set_concepts.value_set_code IS 'Denormalized valueset code for improved query performance';
