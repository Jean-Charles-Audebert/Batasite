/**
 * Tests pour le modèle Content
 * TDD: Les tests définissent le comportement attendu
 */
const { query } = require('../config/db');
const contentModel = require('../models/content.model');

jest.mock('../config/db');

describe('Content Model', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getContent', () => {
    test('should retrieve existing content', async () => {
      const mockContent = {
        id: 1,
        data: { page: { title: 'Test' } },
        updated_at: new Date().toISOString(),
      };

      query.mockResolvedValueOnce({ rows: [mockContent] });

      const result = await contentModel.getContent();

      expect(result).toEqual(mockContent);
      expect(result.data).toBeDefined();
    });

    test('should create default content if none exists', async () => {
      const newContent = {
        id: 1,
        data: {},
        updated_at: new Date().toISOString(),
      };

      query.mockResolvedValueOnce({ rows: [] }); // No content
      query.mockResolvedValueOnce({ rows: [newContent] }); // Create default

      const result = await contentModel.getContent();

      expect(result.id).toBe(1);
      expect(query).toHaveBeenCalledTimes(2);
    });
  });

  describe('updateContent', () => {
    test('should update existing content', async () => {
      const newData = { page: { title: 'Updated' } };
      const updatedContent = {
        id: 1,
        data: newData,
        updated_at: new Date().toISOString(),
        updated_by: 1,
      };

      query.mockResolvedValueOnce({ rows: [{ id: 1 }] }); // Get existing
      query.mockResolvedValueOnce({ rows: [updatedContent] }); // Update

      const result = await contentModel.updateContent(newData, 1);

      expect(result.data).toEqual(newData);
      expect(result.updated_by).toBe(1);
    });

    test('should create content if none exists', async () => {
      const newData = { page: { title: 'New' } };
      const createdContent = {
        id: 1,
        data: newData,
        updated_at: new Date().toISOString(),
        updated_by: 1,
      };

      query.mockResolvedValueOnce({ rows: [] }); // No existing
      query.mockResolvedValueOnce({ rows: [{ id: 1 }] }); // Create
      query.mockResolvedValueOnce({ rows: [createdContent] }); // Return

      const result = await contentModel.updateContent(newData, 1);

      expect(result.data).toEqual(newData);
    });

    test('should reject non-object data', async () => {
      await expect(contentModel.updateContent('not an object', 1)).rejects.toThrow();
    });

    test('should track which admin updated', async () => {
      const newData = { page: { title: 'Test' } };

      query.mockResolvedValueOnce({ rows: [{ id: 1 }] });
      query.mockResolvedValueOnce({ rows: [{ id: 1, data: newData, updated_by: 5, updated_at: new Date().toISOString() }] });

      await contentModel.updateContent(newData, 5);

      // Vérifier que updated_by = 5 a été passé à query
      expect(query).toHaveBeenCalledTimes(2);
      const updateCall = query.mock.calls[1];
      expect(updateCall[1][1]).toBe(5); // Paramètre updated_by
    });
  });

  describe('getContentHistory', () => {
    test('should retrieve content history', async () => {
      const history = [
        {
          id: 3,
          data: { version: 3 },
          updated_at: new Date().toISOString(),
          username: 'admin1',
        },
        {
          id: 2,
          data: { version: 2 },
          updated_at: new Date().toISOString(),
          username: 'admin2',
        },
      ];

      query.mockResolvedValueOnce({ rows: history });

      const result = await contentModel.getContentHistory(20);

      expect(result).toHaveLength(2);
      expect(result[0].id).toBe(3);
      expect(result[1].username).toBe('admin2');
    });

    test('should respect limit parameter', async () => {
      query.mockResolvedValueOnce({ rows: [] });

      await contentModel.getContentHistory(10);

      const call = query.mock.calls[0];
      expect(call[1][0]).toBe(10);
    });

    test('should return empty array if no history', async () => {
      query.mockResolvedValueOnce({ rows: [] });

      const result = await contentModel.getContentHistory();

      expect(result).toEqual([]);
    });
  });

  describe('patchContent', () => {
    test('should merge partial data with existing content', async () => {
      const existingData = { page: { title: 'Original' }, hero: { video: 'test.mp4' } };
      const patchData = { page: { title: 'Updated' } };
      const mergedData = { page: { title: 'Updated' }, hero: { video: 'test.mp4' } };

      query.mockResolvedValueOnce({ rows: [{ id: 1, data: existingData }] }); // getContent
      query.mockResolvedValueOnce({ rows: [{ id: 1 }] }); // updateContent - get existing
      query.mockResolvedValueOnce({ rows: [{ id: 1, data: mergedData }] }); // updateContent - update

      const result = await contentModel.patchContent(patchData, 1);

      expect(result.data).toEqual(mergedData);
    });

    test('should create new content if none exists during patch', async () => {
      const patchData = { page: { title: 'New' } };

      query.mockResolvedValueOnce({ rows: [] }); // getContent - no existing
      query.mockResolvedValueOnce({ rows: [{ id: 1, data: {} }] }); // Create default
      query.mockResolvedValueOnce({ rows: [] }); // updateContent - get existing (none)
      query.mockResolvedValueOnce({ rows: [{ id: 1 }] }); // Create in update
      query.mockResolvedValueOnce({ rows: [{ id: 1, data: patchData }] }); // Return

      const result = await contentModel.patchContent(patchData, 1);

      expect(result).toBeDefined();
    });
  });
});
