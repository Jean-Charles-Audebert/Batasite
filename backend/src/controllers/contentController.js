import * as contentModel from '../models/content.js';

export const getContentByClient = async (req, res) => {
  try {
    const { clientId } = req.params;
    const content = await contentModel.getContentByClientId(parseInt(clientId));
    res.json(content);
  } catch (error) {
    console.error('Error fetching content:', error);
    res.status(500).json({ error: 'Failed to fetch content' });
  }
};

export const getContent = async (req, res) => {
  try {
    const { id } = req.params;
    const content = await contentModel.getContentById(parseInt(id));
    
    if (!content) {
      return res.status(404).json({ error: 'Content not found' });
    }
    
    res.json(content);
  } catch (error) {
    console.error('Error fetching content:', error);
    res.status(500).json({ error: 'Failed to fetch content' });
  }
};

export const createContent = async (req, res) => {
  try {
    const content = await contentModel.createContent(req.body);
    res.status(201).json(content);
  } catch (error) {
    console.error('Error creating content:', error);
    res.status(500).json({ error: 'Failed to create content' });
  }
};

export const updateContent = async (req, res) => {
  try {
    const { id } = req.params;
    const content = await contentModel.updateContent(parseInt(id), req.body);
    
    if (!content) {
      return res.status(404).json({ error: 'Content not found' });
    }
    
    res.json(content);
  } catch (error) {
    console.error('Error updating content:', error);
    res.status(500).json({ error: 'Failed to update content' });
  }
};

export const deleteContent = async (req, res) => {
  try {
    const { id } = req.params;
    const content = await contentModel.deleteContent(parseInt(id));
    
    if (!content) {
      return res.status(404).json({ error: 'Content not found' });
    }
    
    res.json({ message: 'Content deleted successfully' });
  } catch (error) {
    console.error('Error deleting content:', error);
    res.status(500).json({ error: 'Failed to delete content' });
  }
};
