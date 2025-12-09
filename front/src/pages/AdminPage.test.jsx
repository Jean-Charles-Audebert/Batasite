import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AdminPage } from '../pages/AdminPage';

jest.mock('../services/api', () => ({
  getAdmins: jest.fn(),
  createAdmin: jest.fn(),
  updateAdmin: jest.fn(),
  deleteAdmin: jest.fn(),
}));

jest.mock('../pages/AdminPage.module.css', () => ({}));

import api from '../services/api';

describe('AdminPage Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('affiche "Chargement..." au démarrage', () => {
    api.getAdmins.mockImplementationOnce(() => new Promise(() => {}));
    render(<AdminPage />);
    expect(screen.getByText('Chargement...')).toBeInTheDocument();
  });

  test('affiche la liste des administrateurs', async () => {
    api.getAdmins.mockResolvedValueOnce({
      admins: [
        {
          id: 1,
          email: 'admin@test.com',
          role: 'admin',
          created_at: '2024-01-01T10:00:00Z'
        },
        {
          id: 2,
          email: 'super@test.com',
          role: 'superadmin',
          created_at: '2024-01-02T10:00:00Z'
        }
      ]
    });

    render(<AdminPage />);

    await waitFor(() => {
      expect(screen.getByText('Gestion des Administrateurs')).toBeInTheDocument();
      expect(screen.getByText('admin@test.com')).toBeInTheDocument();
      expect(screen.getByText('super@test.com')).toBeInTheDocument();
    });
  });

  test('affiche "Aucun administrateur" si liste vide', async () => {
    api.getAdmins.mockResolvedValueOnce({ admins: [] });

    render(<AdminPage />);

    await waitFor(() => {
      expect(screen.getByText('Aucun administrateur pour le moment')).toBeInTheDocument();
    });
  });

  test('permet d\'ouvrir le formulaire de création', async () => {
    api.getAdmins.mockResolvedValueOnce({ admins: [] });

    render(<AdminPage />);

    await waitFor(() => {
      expect(screen.getByText('Ajouter un administrateur')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Ajouter un administrateur'));

    await waitFor(() => {
      expect(screen.getByText('Créer un administrateur')).toBeInTheDocument();
    });
  });

  test('permet d\'annuler la création', async () => {
    api.getAdmins.mockResolvedValueOnce({ admins: [] });

    render(<AdminPage />);

    await waitFor(() => {
      expect(screen.getByText('Ajouter un administrateur')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Ajouter un administrateur'));

    await waitFor(() => {
      expect(screen.getByText('Annuler')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Annuler'));

    await waitFor(() => {
      expect(screen.queryByText('Créer un administrateur')).not.toBeInTheDocument();
    });
  });

  test('permet d\'éditer un administrateur', async () => {
    api.getAdmins.mockResolvedValueOnce({
      admins: [
        {
          id: 1,
          email: 'admin@test.com',
          role: 'admin',
          created_at: '2024-01-01T10:00:00Z'
        }
      ]
    });

    render(<AdminPage />);

    await waitFor(() => {
      expect(screen.getByText('admin@test.com')).toBeInTheDocument();
    });

    // Cliquer sur le bouton d'édition (✎)
    const editButtons = screen.getAllByTitle('Modifier');
    fireEvent.click(editButtons[0]);

    await waitFor(() => {
      expect(screen.getByText('Modifier l\'administrateur')).toBeInTheDocument();
    });
  });

  test('supprime un administrateur avec confirmation', async () => {
    api.getAdmins.mockResolvedValueOnce({
      admins: [
        {
          id: 1,
          email: 'admin@test.com',
          role: 'admin',
          created_at: '2024-01-01T10:00:00Z'
        }
      ]
    });

    api.deleteAdmin.mockResolvedValueOnce({ success: true });
    api.getAdmins.mockResolvedValueOnce({ admins: [] });

    render(<AdminPage />);

    await waitFor(() => {
      expect(screen.getByText('admin@test.com')).toBeInTheDocument();
    });

    // Mock window.confirm
    global.confirm = jest.fn(() => true);

    // Cliquer sur le bouton de suppression (✕)
    const deleteButtons = screen.getAllByTitle('Supprimer');
    fireEvent.click(deleteButtons[0]);

    await waitFor(() => {
      expect(api.deleteAdmin).toHaveBeenCalledWith(1);
    });
  });
});
