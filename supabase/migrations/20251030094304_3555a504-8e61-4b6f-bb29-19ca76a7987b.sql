-- FIX 2: Optimize best_practices tags for better keyword matching

-- Expand tags for component_creation category
UPDATE best_practices 
SET tags = array_cat(tags, ARRAY['button', 'component', 'creation', 'ui', 'interface'])
WHERE category = 'component_creation' 
  AND NOT (tags && ARRAY['button', 'component']);

-- Expand tags for design_system category
UPDATE best_practices 
SET tags = array_cat(tags, ARRAY['design', 'color', 'style', 'ui', 'theme', 'palette'])
WHERE category = 'design_system' 
  AND NOT (tags && ARRAY['design', 'color']);

-- Expand tags for typescript_safety category
UPDATE best_practices 
SET tags = array_cat(tags, ARRAY['type', 'safety', 'typescript', 'validation', 'error'])
WHERE category = 'typescript_safety' 
  AND NOT (tags && ARRAY['type', 'typescript']);

-- Expand tags for performance category
UPDATE best_practices 
SET tags = array_cat(tags, ARRAY['performance', 'optimization', 'speed', 'cache', 'query'])
WHERE category = 'performance' 
  AND NOT (tags && ARRAY['performance', 'optimization']);

-- Expand tags for security category
UPDATE best_practices 
SET tags = array_cat(tags, ARRAY['security', 'auth', 'authentication', 'rls', 'policy'])
WHERE category = 'security' 
  AND NOT (tags && ARRAY['security', 'auth']);