import * as clientModel from '../models/client.js';

export const getAllClients = async (req, res) => {
  try {
    const clients = await clientModel.getAllClients();
    res.json(clients);
  } catch (error) {
    console.error('Error fetching clients:', error);
    res.status(500).json({ error: 'Failed to fetch clients' });
  }
};

export const getClient = async (req, res) => {
  try {
    const { identifier } = req.params;
    let client;
    
    if (isNaN(identifier)) {
      client = await clientModel.getClientBySlug(identifier);
    } else {
      client = await clientModel.getClientById(parseInt(identifier));
    }
    
    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }
    
    res.json(client);
  } catch (error) {
    console.error('Error fetching client:', error);
    res.status(500).json({ error: 'Failed to fetch client' });
  }
};

export const createClient = async (req, res) => {
  try {
    const client = await clientModel.createClient(req.body);
    res.status(201).json(client);
  } catch (error) {
    console.error('Error creating client:', error);
    res.status(500).json({ error: 'Failed to create client' });
  }
};

export const updateClient = async (req, res) => {
  try {
    const { id } = req.params;
    const client = await clientModel.updateClient(parseInt(id), req.body);
    
    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }
    
    res.json(client);
  } catch (error) {
    console.error('Error updating client:', error);
    res.status(500).json({ error: 'Failed to update client' });
  }
};

export const deleteClient = async (req, res) => {
  try {
    const { id } = req.params;
    const client = await clientModel.deleteClient(parseInt(id));
    
    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }
    
    res.json({ message: 'Client deleted successfully' });
  } catch (error) {
    console.error('Error deleting client:', error);
    res.status(500).json({ error: 'Failed to delete client' });
  }
};
