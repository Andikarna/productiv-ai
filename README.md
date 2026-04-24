# ProductiveAI 🚀

A full-stack AI-powered productivity chatbot built with Node.js, Express, MongoDB, OpenAI, and React.

## Quick Start

### 1. Prerequisites
- Node.js ≥ 18
- MongoDB (local or Atlas)
- OpenAI API key

### 2. Backend Setup

```bash
cd backend
cp .env.example .env
# Edit .env with your MongoDB URI and OpenAI API key
npm install
npm run dev
```

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### 4. Open in browser
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000
- Health check: http://localhost:5000/health

---

## API Reference

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/auth/register | ❌ | Register new user |
| POST | /api/auth/login | ❌ | Login & get JWT |
| GET | /api/auth/me | ✅ | Get current user |
| POST | /api/chat | ✅ | Send message to AI |
| GET | /api/chat/history | ✅ | Get chat history |
| DELETE | /api/chat/history | ✅ | Clear history |
| POST | /api/task | ✅ | Create task |
| GET | /api/task | ✅ | List tasks |
| PATCH | /api/task/:id | ✅ | Update task |
| DELETE | /api/task/:id | ✅ | Delete task |

---

## Environment Variables

See `backend/.env.example` for all required variables.

| Variable | Description |
|----------|-------------|
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret for signing JWTs |
| `OPENAI_API_KEY` | Your OpenAI API key |
| `OPENAI_MODEL` | Model name (default: gpt-4o-mini) |

---

## Project Structure

```
├── backend/
│   ├── config/          # DB & env validation
│   ├── controllers/     # Route handlers
│   ├── middleware/      # Auth, error handling, logging
│   ├── models/          # Mongoose schemas
│   ├── repositories/    # Data access layer
│   ├── routes/          # API route definitions
│   ├── services/        # Business logic
│   ├── utils/           # Logger, prompt builder
│   └── server.js        # Entry point
└── frontend/
    └── src/
        ├── components/  # ChatWindow, TaskPanel, Sidebar, etc.
        ├── context/     # Auth & Chat state
        ├── hooks/       # useTask
        ├── pages/       # Login, Register, Chat
        └── services/    # Axios API client
```
