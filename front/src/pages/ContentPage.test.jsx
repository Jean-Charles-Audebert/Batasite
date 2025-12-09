import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ContentPage } from '../pages/ContentPage';

jest.mock('../services/api', () => ({
  getContent: jest.fn(),
  updateContent: jest.fn(),
  getContentHistory: jest.fn(),
}));

jest.mock('../pages/ContentPage.module.css', () => ({}));

// Importer après le mock
import api from '../services/api';

describe('ContentPage Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('affiche "Chargement..." au démarrage', () => {
    api.getContent.mockImplementationOnce(() => new Promise(() => {}));
    render(<ContentPage />);
    expect(screen.getByText('Chargement...')).toBeInTheDocument();
  });

  test('affiche le contenu chargé', async () => {
    api.getContent.mockResolvedValueOnce({
      content: { title: 'Bienvenue', description: 'Test' }
    });

    render(<ContentPage />);

    await waitFor(() => {
      expect(screen.getByText('Contenu Actuel')).toBeInTheDocument();
    });
  });

  test('affiche "Aucun contenu" si vide', async () => {
    api.getContent.mockResolvedValueOnce({ content: {} });

    render(<ContentPage />);

    await waitFor(() => {
      expect(screen.getByText('Aucun contenu pour le moment')).toBeInTheDocument();
    });
  });

  test('permet d\'activer le mode édition', async () => {
    api.getContent.mockResolvedValueOnce({ content: { title: 'Test' } });

    render(<ContentPage />);

    await waitFor(() => {
      expect(screen.getByText('Modifier')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Modifier'));

    await waitFor(() => {
      expect(screen.getByText('Sauvegarder')).toBeInTheDocument();
    });
  });

  test('charge l\'historique', async () => {
    api.getContent.mockResolvedValueOnce({ content: { title: 'Test' } });
    api.getContentHistory.mockResolvedValueOnce({
      versions: [
        { id: 1, content: { title: 'v1' }, updated_at: '2024-01-01T10:00:00Z' }
      ]
    });

    render(<ContentPage />);

    await waitFor(() => {
      expect(screen.getByText('Historique')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Historique'));

    await waitFor(() => {
      expect(screen.getByText('Historique des Versions')).toBeInTheDocument();
    });

    expect(api.getContentHistory).toHaveBeenCalledWith(1, 10);
  });
});
