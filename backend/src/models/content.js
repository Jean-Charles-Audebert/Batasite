import { query } from '../config/database.js';

export const getContentByClientId = async (clientId) => {
  const result = await query(
    'SELECT * FROM content WHERE client_id = $1 ORDER BY created_at DESC',
    [clientId]
  );
  return result.rows;
};

export const getContentById = async (id) => {
  const result = await query('SELECT * FROM content WHERE id = $1', [id]);
  return result.rows[0];
};

export const createContent = async (contentData) => {
  const { client_id, title, content_type, body, media_url, published } = contentData;
  const result = await query(
    'INSERT INTO content (client_id, title, content_type, body, media_url, published) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
    [client_id, title, content_type, body, media_url, published !== undefined ? published : true]
  );
  return result.rows[0];
};

export const updateContent = async (id, contentData) => {
  const { title, content_type, body, media_url, published } = contentData;
  const result = await query(
    'UPDATE content SET title = $1, content_type = $2, body = $3, media_url = $4, published = $5, updated_at = CURRENT_TIMESTAMP WHERE id = $6 RETURNING *',
    [title, content_type, body, media_url, published, id]
  );
  return result.rows[0];
};

export const deleteContent = async (id) => {
  const result = await query('DELETE FROM content WHERE id = $1 RETURNING *', [id]);
  return result.rows[0];
};
