import { query } from '../config/database.js';

export const getAllClients = async () => {
  const result = await query('SELECT * FROM clients ORDER BY created_at DESC');
  return result.rows;
};

export const getClientById = async (id) => {
  const result = await query('SELECT * FROM clients WHERE id = $1', [id]);
  return result.rows[0];
};

export const getClientBySlug = async (slug) => {
  const result = await query('SELECT * FROM clients WHERE slug = $1', [slug]);
  return result.rows[0];
};

export const createClient = async (clientData) => {
  const { name, slug, description, logo_url, active } = clientData;
  const result = await query(
    'INSERT INTO clients (name, slug, description, logo_url, active) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [name, slug, description, logo_url, active !== undefined ? active : true]
  );
  return result.rows[0];
};

export const updateClient = async (id, clientData) => {
  const { name, slug, description, logo_url, active } = clientData;
  const result = await query(
    'UPDATE clients SET name = $1, slug = $2, description = $3, logo_url = $4, active = $5, updated_at = CURRENT_TIMESTAMP WHERE id = $6 RETURNING *',
    [name, slug, description, logo_url, active, id]
  );
  return result.rows[0];
};

export const deleteClient = async (id) => {
  const result = await query('DELETE FROM clients WHERE id = $1 RETURNING *', [id]);
  return result.rows[0];
};
