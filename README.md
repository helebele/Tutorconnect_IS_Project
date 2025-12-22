# TutorConnect 🎓

A modern tutoring platform that connects students with tutors for live video sessions, course management, and interactive classrooms.

## 🌟 Features

- **User Authentication** - Secure login and registration for students and tutors
- **Course Marketplace** - Browse and enroll in courses
- **Live Video Sessions** - WebRTC-powered video classrooms with chat
- **Session Scheduling** - Tutors can schedule sessions with enrolled students
- **Real-time Communication** - Socket.io for instant messaging and notifications
- **Role-Based Dashboards** - Separate interfaces for students and tutors

## 🚀 Live Demo

- **Frontend**: [https://tutorconnect-five.vercel.app](https://tutorconnect-five.vercel.app) _(Update with your URL)_
- **Backend**: Running locally via ngrok

## 🛠️ Tech Stack

### Frontend
- React 18
- Vite
- React Router
- Socket.io Client
- SimplePeer (WebRTC)

### Backend
- Node.js
- Express
- MongoDB
- Socket.io
- JWT Authentication

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn
- Git

## 🔧 Local Development Setup

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/tutorconnect.git
cd tutorconnect
```

### 2. Backend Setup

```bash
cd backend
npm install

# Create .env file
cp .env.example .env

# Edit .env with your values:
# MONGO_URI=your_mongodb_connection_string
# JWT_SECRET=your_secret_key
# PORT=5000

# Start backend server
npm start
```

### 3. Frontend Setup

```bash
cd frontend
npm install

# Create .env.local file (optional for local dev)
cp .env.example .env.local

# Start frontend dev server
npm run dev
```

### 4. Access the application

- Frontend: http://localhost:5173
- Backend: http://localhost:5000

## 🌐 Deployment

This project is configured for:
- **Frontend**: Vercel
- **Backend**: Local (via ngrok) or any Node.js hosting platform

### Deploy to Vercel + Ngrok

See detailed instructions in:
- [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) - Complete walkthrough
- [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md) - Quick checklist

**Quick Steps:**
1. Push code to GitHub
2. Connect Vercel to your GitHub repo
3. Set `VITE_BACKEND_URL` environment variable
4. Deploy!

For backend, install ngrok and run:
```bash
ngrok http 5000
```

## 📁 Project Structure

```
tutorconnect/
├── frontend/                # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── api.js          # API client
│   │   └── config.js       # Configuration
│   └── package.json
│
├── backend/                # Express backend
│   ├── controllers/        # Route controllers
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── utils/             # Utilities
│   ├── server.js          # Entry point
│   └── package.json
│
├── .gitignore
├── DEPLOYMENT_GUIDE.md
├── DEPLOYMENT_CHECKLIST.md
└── README.md
```

## 🔐 Environment Variables

### Frontend (`frontend/.env.local`)

```env
VITE_BACKEND_URL=http://localhost:5000
```

### Backend (`backend/.env`)

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000
```

> ⚠️ **Never commit `.env` files!** They contain sensitive information.

## 🧪 Testing

### Test User Accounts

Create test accounts with different roles:
- Student: `student@test.com`
- Tutor: `tutor@test.com`

### API Health Check

```bash
curl http://localhost:5000/api/health
```

Expected response: `{"status": "ok"}`

## 🐛 Troubleshooting

### CORS Errors
- Ensure your frontend URL is in `backend/server.js` allowedOrigins
- Restart backend after changing CORS settings

### WebSocket Connection Issues
- Check that Socket.io is properly connected
- Verify ngrok is running if using remote backend

### Build Fails on Vercel
- Check build logs in Vercel dashboard
- Ensure Root Directory is set to `frontend`
- Verify all dependencies are in `package.json`

## 📝 API Documentation

### Authentication
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - Login user

### Classes
- `GET /api/classes` - Get all classes
- `POST /api/classes` - Create class (tutors only)
- `POST /api/classes/:id/enroll` - Enroll in class (students only)

### Sessions
- `POST /api/sessions` - Schedule session (tutors only)
- `GET /api/sessions/user` - Get user's sessions
- `GET /api/sessions/:id` - Get specific session

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 👤 Author

Your Name
- GitHub: [@yourusername](https://github.com/yourusername)

## 🙏 Acknowledgments

- Built with React and Node.js
- WebRTC powered by SimplePeer
- Real-time communication via Socket.io

---

**Need help?** Check out the [Deployment Guide](./DEPLOYMENT_GUIDE.md) or open an issue!
