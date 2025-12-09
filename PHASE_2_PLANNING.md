# 📋 Phase 2 - Planning & Setup Guide

**Status:** Ready to Start  
**Date:** December 9, 2025  
**Backend Status:** ✅ Complete (89/89 tests passing)

---

## 🎯 Phase 2 Objectives

### Main Goal
Build a React admin dashboard that consumes the completed backend API.

### Key Features
1. Admin authentication (login/logout)
2. Admin management (CRUD operations)
3. Content management interface
4. Responsive UI/UX
5. Real-time API integration

---

## 📐 Project Structure

### Frontend Directory (`/front`)

```
front/
├── src/
│   ├── components/        # Reusable React components
│   │   ├── Auth/          # Login, logout components
│   │   ├── Admin/         # Admin list, edit, delete
│   │   ├── Content/       # Content editor
│   │   ├── Layout/        # Header, sidebar, footer
│   │   └── Common/        # Buttons, modals, forms
│   ├── pages/             # Full page components
│   │   ├── LoginPage.jsx
│   │   ├── DashboardPage.jsx
│   │   ├── AdminsPage.jsx
│   │   ├── ContentPage.jsx
│   │   └── NotFoundPage.jsx
│   ├── services/          # API integration
│   │   ├── api.js         # Axios instance with interceptors
│   │   ├── authService.js
│   │   ├── adminService.js
│   │   └── contentService.js
│   ├── hooks/             # Custom React hooks
│   │   ├── useAuth.js
│   │   ├── useAdmin.js
│   │   └── useFetch.js
│   ├── context/           # React Context for state
│   │   ├── AuthContext.jsx
│   │   └── NotificationContext.jsx
│   ├── styles/            # Global styles
│   │   ├── variables.css
│   │   └── global.css
│   ├── utils/             # Helper functions
│   │   ├── formatting.js
│   │   ├── validation.js
│   │   └── errorHandler.js
│   ├── App.jsx            # Main app component
│   ├── App.css
│   ├── main.jsx           # Entry point
│   └── index.css
├── public/                # Static files
├── index.html             # HTML template
├── package.json
├── vite.config.js
└── eslint.config.js
```

---

## 🛠️ Tech Stack (Recommended)

### Frontend Frameworks
- **React 18** - UI library
- **Vite** - Build tool (already configured)
- **React Router** - Navigation
- **Axios** - HTTP client
- **Zustand** or **Context API** - State management

### Styling
- **CSS Modules** or **Tailwind CSS** - Styling
- **Responsive Design** - Mobile-first approach

### Forms & Validation
- **React Hook Form** - Form management
- **Yup** or **Zod** - Schema validation

### UI Components (Optional)
- **Material-UI** or **Shadcn/ui** - Component library
- Or **Custom CSS** for minimal dependencies

---

## 📝 User Stories for Phase 2

### US-2.1: Authentication UI
**Objective:** User login and session management

```gherkin
Feature: Admin Authentication
  Scenario: Admin logs in with valid credentials
    Given: Login page is displayed
    When: Admin enters email and password
    And: Clicks "Login"
    Then: Access token is stored
    And: Redirected to dashboard
    
  Scenario: Admin session persists on page refresh
    Given: Admin is logged in
    When: Page is refreshed
    Then: Session remains active
```

**Acceptance Criteria:**
- [ ] Login form with email/password fields
- [ ] Form validation (email format, password minimum)
- [ ] Error messages for invalid credentials
- [ ] Token storage (localStorage/sessionStorage)
- [ ] Auto-redirect to dashboard on successful login
- [ ] Logout functionality
- [ ] Token refresh mechanism

### US-2.2: Dashboard Layout
**Objective:** Create responsive admin dashboard skeleton

**Components:**
- [ ] Header (logo, user menu, logout)
- [ ] Sidebar (navigation menu)
- [ ] Main content area
- [ ] Footer
- [ ] Responsive breakpoints (mobile, tablet, desktop)

### US-2.3: Admins Management UI
**Objective:** Full CRUD interface for admin management

**Features:**
- [ ] List admins with filtering and sorting
- [ ] Create admin (registration form)
- [ ] View admin details
- [ ] Edit admin (role, active status)
- [ ] Delete admin (with confirmation)
- [ ] Activity log viewer

### US-2.4: Content Management UI
**Objective:** Visual editor for global content

**Features:**
- [ ] JSON editor interface
- [ ] Visual form builder (alternative to raw JSON)
- [ ] Version history viewer
- [ ] Save/publish operations
- [ ] Preview mode

### US-2.5: API Integration
**Objective:** Connect frontend to backend API

**Implementation:**
- [ ] Axios setup with baseURL
- [ ] Authentication headers (JWT token injection)
- [ ] Error handling and retry logic
- [ ] Loading states
- [ ] Success/error notifications

---

## 🚀 Development Approach

### Phase 2.1: Authentication (1-2 days)
1. Create login page component
2. Integrate with `/auth/login` endpoint
3. Implement token storage and refresh
4. Add protected routes
5. Test authentication flow

### Phase 2.2: Layout & Navigation (1 day)
1. Create main layout component
2. Add sidebar with navigation
3. Create page structure
4. Add responsive styling
5. Test on mobile/tablet

### Phase 2.3: Admin Management (2-3 days)
1. Admin list page (GET /admin)
2. Admin detail page
3. Admin edit form (PATCH /admin/:id)
4. Admin delete functionality (DELETE /admin/:id)
5. Add/edit admin form (POST /auth/register)
6. Integration testing

### Phase 2.4: Content Management (2-3 days)
1. Content editor page
2. JSON viewer/editor (GET /content)
3. Update content (PUT /content)
4. Patch content (PATCH /content)
5. History viewer (GET /content/history)
6. Integration testing

### Phase 2.5: Polish & Testing (1-2 days)
1. Error handling improvements
2. Loading states
3. Success notifications
4. Input validation
5. User testing
6. Bug fixes

**Total Estimated Time:** 1.5-2 weeks

---

## 🔌 API Endpoints to Consume

### Authentication
```
POST /auth/register        - Register new admin
POST /auth/login          - Login (returns accessToken, refreshToken)
POST /auth/refresh        - Refresh token
POST /auth/logout         - Logout
```

### Admins
```
GET /admin                - List all admins (with role filter)
GET /admin/:id            - Get single admin
GET /admin/:id/activity   - Get admin activity log
PATCH /admin/:id          - Update admin (role, is_active)
DELETE /admin/:id         - Delete admin
```

### Content
```
GET /content              - Get global content
PUT /content              - Replace content (full update)
PATCH /content            - Merge content (partial update)
GET /content/history      - Get content version history
```

---

## 📋 Setup Checklist

### Before Starting Phase 2

- [ ] Backend is running and tested ✅
- [ ] API endpoints verified
- [ ] Frontend scaffold ready (`/front` folder exists)
- [ ] Dependencies installed (`npm install`)
- [ ] Development environment configured
- [ ] Git workflow established

### Local Development Setup

```bash
# Install dependencies
cd front
npm install

# Add recommended packages
npm install react-router-dom axios zustand
npm install -D tailwindcss postcss autoprefixer  # if using Tailwind

# Start development server
npm run dev

# Build for production
npm run build
```

### Environment Configuration

Create `.env.local` in `/front`:
```env
VITE_API_URL=http://localhost:3000/api
VITE_APP_NAME=Batasite Admin
```

---

## 🧪 Testing Strategy

### Unit Tests
- Component rendering
- Hook behavior
- Utility functions

### Integration Tests
- API calls
- Form submissions
- Authentication flow

### E2E Tests (Later)
- Complete user workflows
- Cross-browser testing

### Test Coverage Goal
- Minimum 70% coverage
- Critical paths at 100%

---

## 📚 Code Quality Standards

### For Phase 2 Frontend

**ESLint Rules:**
- Enforce consistent naming
- Require JSDoc comments on components
- No console logs in production
- Proper error handling

**Code Review Checklist:**
- [ ] Components are <300 lines
- [ ] Props are validated (PropTypes or TypeScript)
- [ ] Error handling implemented
- [ ] Loading states present
- [ ] Responsive design tested
- [ ] Accessibility (a11y) considered
- [ ] No hardcoded strings (use i18n)

---

## 🎨 UI/UX Guidelines

### Design Principles
- **Consistency:** Use design system
- **Clarity:** Clear labeling and messaging
- **Feedback:** Visual feedback for actions
- **Accessibility:** WCAG 2.1 AA compliance
- **Responsiveness:** Mobile-first design

### Color Palette (Suggested)
```
Primary:   #007bff (Blue)
Success:   #28a745 (Green)
Warning:   #ffc107 (Yellow)
Danger:    #dc3545 (Red)
Neutral:   #6c757d (Gray)
```

---

## 📖 Resources & Documentation

### Backend API Documentation
- See `/back/README.md` for API details
- Swagger/OpenAPI (optional enhancement)

### React Documentation
- https://react.dev
- https://vite.dev

### State Management
- Zustand: https://github.com/pmndrs/zustand
- Context API: Built into React

### Form Handling
- React Hook Form: https://react-hook-form.com
- Yup Validation: https://github.com/jquense/yup

---

## 🎯 Success Criteria for Phase 2

✅ **Frontend is production-ready when:**
- All 5 user stories implemented
- Admin login works end-to-end
- All CRUD operations functional
- Responsive on mobile/tablet/desktop
- Error handling comprehensive
- Loading states present
- Code coverage >70%
- All tests passing
- Code audit score >8/10

---

## 🚀 Next Steps

1. **Review this plan** with team
2. **Set up local environment** with frontend dependencies
3. **Create feature branch:** `git checkout -b feature/2.1-authentication`
4. **Start with US-2.1** (Authentication UI)
5. **Follow TDD:** Write tests first, implementation second
6. **Daily commits:** Small, focused changes
7. **Regular testing:** Test API integration frequently

---

## 📞 Quick Reference

| Item | Location |
|------|----------|
| Backend API | http://localhost:3000 |
| Frontend Dev | http://localhost:5173 (Vite default) |
| API Docs | `/back/src/routes/*.js` |
| Test Commands | `npm test` (backend), `npm run test` (frontend) |
| Build Prod | `npm run build` |

---

**Ready to begin Phase 2?** 🚀

Let's build an amazing admin dashboard! ✨

