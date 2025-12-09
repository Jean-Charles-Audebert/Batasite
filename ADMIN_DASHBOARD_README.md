# Admin Dashboard - Phase 2.2

## Overview

The admin dashboard is a React single-page application built with:
- React 19.2.0
- React Router 6
- Native CSS Modules (no external UI libraries)
- Jest + React Testing Library for testing
- Vite for build tooling

---

## Features

### 1. Content Management (US-2.2)

**Path**: `/admin` → Click "📄 Contenu" in sidebar

**Functionality**:
- **Display** - View all global site content as key-value pairs
- **Edit** - Modify content fields with inline textarea editors
- **History** - Browse version history and restore previous versions
- **Status** - Shows loading, errors, and empty states

**API Endpoints** (required):
- `GET /content` - Retrieve current content
- `PUT /content` - Update content
- `GET /content/history?page=1&limit=10` - Fetch version history

**Usage Example**:
```jsx
import { ContentPage } from './pages/ContentPage';

// Already integrated in DashboardPage sidebar
<ContentPage />
```

### 2. Admin Management (US-2.3)

**Path**: `/admin` → Click "👥 Administrateurs" in sidebar

**Functionality**:
- **List** - View all admins with email, role, creation date
- **Create** - Add new administrator with email/password/role
- **Edit** - Modify admin role or reset password
- **Delete** - Remove admin (with confirmation)
- **Roles** - Assign admin or superadmin role

**API Endpoints** (required):
- `GET /admin` - List all admins
- `POST /admin` - Create new admin
- `PATCH /admin/:id` - Update admin
- `DELETE /admin/:id` - Delete admin

**Usage Example**:
```jsx
import { AdminPage } from './pages/AdminPage';

// Already integrated in DashboardPage sidebar
<AdminPage />
```

---

## Running Tests

### All Tests
```bash
npm test
```

### Watch Mode
```bash
npm test:watch
```

### Coverage Report
```bash
npm test:coverage
```

### Test Results
```
 PASS  src/pages/AdminPage.test.jsx
 PASS  src/pages/ContentPage.test.jsx

Test Suites: 2 passed, 2 total
Tests:       12 passed, 12 total
```

---

## Building

### Development Build
```bash
npm run dev
```

Runs Vite dev server with hot reload on `http://localhost:5173`

### Production Build
```bash
npm run build
```

Creates dual bundles:
- `dist/index.html` - Static vitrine site
- `dist/admin.html` - React admin dashboard
- `dist/assets/` - JavaScript, CSS, images

---

## Project Structure

```
front/
├── src/
│   ├── pages/
│   │   ├── ContentPage.jsx         # Content management UI
│   │   ├── ContentPage.module.css
│   │   ├── ContentPage.test.jsx    # 5 tests
│   │   ├── AdminPage.jsx           # Admin management UI
│   │   ├── AdminPage.module.css
│   │   ├── AdminPage.test.jsx      # 7 tests
│   │   ├── DashboardPage.jsx       # Main dashboard layout
│   │   ├── LoginPage.jsx
│   │   └── RegisterPage.jsx
│   ├── services/
│   │   ├── api.js                  # HTTP client (Fetch native)
│   │   └── __mocks__/api.js        # Mock for tests
│   ├── contexts/
│   │   └── AuthContext.jsx         # Auth state management
│   ├── components/
│   │   ├── ProtectedRoute.jsx
│   │   └── ...
│   ├── admin.jsx                   # React admin app entry
│   └── main.jsx                    # Static vitrine entry
├── admin.html                      # React app shell
├── index.html                      # Static vitrine site
├── jest.config.js
├── jest.setup.js
├── .babelrc.json
├── vite.config.js
└── package.json
```

---

## API Service

The `api.js` service provides a clean Fetch-based interface:

```javascript
import api from './services/api';

// Content Management
await api.getContent();
await api.updateContent(data);
await api.getContentHistory(page, limit);

// Admin Management
await api.getAdmins();
await api.createAdmin(data);
await api.updateAdmin(id, data);
await api.deleteAdmin(id);

// Authentication
await api.login(email, password);
await api.register(email, password);
await api.logout();
await api.refreshToken();
```

All methods return promises and include error handling.

---

## Styling

### CSS Modules

Each component has its own scoped CSS file:

```javascript
import styles from './ContentPage.module.css';

<div className={styles.container}>
  <h2 className={styles.header}>Title</h2>
</div>
```

### Design System

**Colors**:
- Primary: `#3b82f6` (blue) - Main actions
- Danger: `#ef4444` (red) - Delete/critical
- Warning: `#f59e0b` (amber) - Edit/caution
- Success: `#10b981` (green) - Confirmation
- Neutral: `#e5e7eb` to `#374151` (gray scale)

**Breakpoints** (mobile-responsive):
- Desktop: 1200px max-width
- Tablet: 768px media query
- Mobile: 100% width

**No External Dependencies**:
- No Tailwind, Bootstrap, or Material-UI
- Pure CSS Modules for maintainability
- Minimal CSS (~420 lines for both components)

---

## Authentication

All admin routes are protected by `ProtectedRoute` component:

```jsx
<Route 
  path="/admin" 
  element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} 
/>
```

Redirects to `/login` if not authenticated.

---

## Error Handling

Components display errors consistently:

```
┌─────────────────────────────────────────┐
│ ⚠ Erreur lors du chargement du contenu  │
└─────────────────────────────────────────┘
```

Error box styling:
- Background: light red (#fee2e2)
- Text: dark red (#991b1b)
- Left border: 4px solid (#dc2626)

---

## Loading States

- **Initial Load**: "Chargement..."
- **Async Operations**: Button disabled with "En cours..." text
- **Errors**: Error message displayed
- **Empty State**: "Aucun contenu pour le moment"

---

## Future Enhancements (Phase 2.4+)

- [ ] Search/filter in admin list
- [ ] Pagination UI controls
- [ ] Loading spinners/skeleton screens
- [ ] Undo/redo for content edits
- [ ] Admin activity log
- [ ] Email verification for new admins
- [ ] Password strength validator
- [ ] Confirm password field
- [ ] Bulk admin operations
- [ ] Admin permissions granularity

---

## Troubleshooting

### Tests Not Running
```bash
# Make sure dependencies are installed
npm install

# Clear Jest cache
npm test -- --clearCache
```

### Build Errors
```bash
# Check Node version (requires 18+)
node --version

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
npm run build
```

### API Calls Failing
- Check backend is running on `http://localhost:3000`
- Verify `VITE_API_URL` environment variable
- Check network tab in DevTools for request/response

---

## Deployment

### Local Testing
```bash
npm run build
npm run preview
```

### Production
- Build outputs to `dist/` folder
- Serve both `index.html` and `admin.html` from web server
- Backend API should be at configured `VITE_API_URL`

### Environment Variables
```
VITE_API_URL=https://api.example.com
```

---

## Contributing

When adding new features:

1. **Create component** in `src/pages/`
2. **Add styles** as `ComponentName.module.css`
3. **Write tests** as `ComponentName.test.jsx`
4. **Integrate** in `DashboardPage.jsx`
5. **Run tests**: `npm test` (must pass 100%)
6. **Build**: `npm run build` (must succeed)
7. **Commit**: Use semantic commit messages

---

## Support

For issues or questions:
- Check `PHASE_2.2_COMPLETION.md` for architecture details
- Review test files for usage examples
- Check `src/services/api.js` for API documentation

---

**Last Updated**: December 2024  
**Version**: v2.2  
**Status**: Production Ready ✅
