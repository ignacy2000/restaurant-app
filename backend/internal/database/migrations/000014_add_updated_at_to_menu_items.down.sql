DROP TRIGGER IF EXISTS menu_items_set_updated_at ON menu_items;
ALTER TABLE menu_items DROP COLUMN IF EXISTS updated_at;
