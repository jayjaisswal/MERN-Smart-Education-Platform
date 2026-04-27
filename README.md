# 📚 Padho India - Smart Education Platform

> **Empowering Education Through Technology** 🚀

A comprehensive **MERN stack** education platform that bridges the gap between instructors and students. Padho India enables seamless course creation, delivery, and enrollment with secure payments and interactive learning experiences.

![MERN](https://img.shields.io/badge/MERN-Stack-blue?style=flat-square)
![MongoDB](https://img.shields.io/badge/MongoDB-4.4-green?style=flat-square)
![React](https://img.shields.io/badge/React-19.1-61dafb?style=flat-square)
![Node.js](https://img.shields.io/badge/Node.js-LTS-green?style=flat-square)
![License](https://img.shields.io/badge/License-Educational-yellow?style=flat-square)

> ⚠️ **Note:** Backend is hosted on Render (free tier). First request may take 30-50 seconds to respond.

---

## 🌍 Live Demo

🔗 **[Visit Padho India](https://padho-india.vercel.app/)**

### Demo Credentials

| Role          | Email                  | Password |
| ------------- | ---------------------- | -------- |
| 👨‍🏫 Instructor | `instructor@gmail.com` | `123456` |
| 👨‍🎓 Student    | `student@gmail.com`    | `123456` |

> **Note:** Students and instructors have distinct role-based access controls and dashboards.

---

## ✨ Key Features

### 🎓 For Instructors

- ✅ **Complete Course Management** - Create, edit, delete courses with full CRUD operations
- 📹 **Media Management** - Upload and manage course videos via Cloudinary
- 👥 **Student Tracking** - Monitor enrolled students and course progress
- ⭐ **Feedback System** - View ratings and reviews from students
- 💰 **Payment Integration** - Manage course pricing and Razorpay integration

### 👤 For Students

- 🔍 **Course Discovery** - Browse and search available courses by category
- 💳 **Secure Enrollment** - Enroll with integrated Razorpay payment gateway
- 📺 **Video Learning** - Stream course lectures with adaptive player
- ⭐ **Course Reviews** - Rate and review courses, view community feedback
- 📊 **Progress Tracking** - Monitor your learning progress visually

### 🔐 Security & Authentication

- 🔑 **OTP-Based Auth** - Secure email verification for new accounts
- 🛡️ **JWT Tokens** - Secure session management with refresh tokens
- 🔄 **Password Recovery** - Forgot password and password reset functionality
- 🚫 **Role-Based Access** - Separate permissions for instructors and students

---

## 🛠 Tech Stack

### Frontend

- **React 19** - UI library with hooks and modern patterns
- **Redux Toolkit** - State management with Redux slices
- **Tailwind CSS** - Utility-first CSS framework
- **Vite** - Fast build tool and dev server
- **Axios** - HTTP client for API calls
- React Router DOM, React Hot Toast, Swiper, and more

### Backend

- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database (Atlas)
- **Mongoose** - ODM for MongoDB
- **JWT** - Secure authentication tokens
- **Bcrypt** - Password hashing
- **Nodemailer** - Email notifications
- **Cloudinary** - Cloud media storage
- **Razorpay** - Payment gateway

### Hosting & Deployment

- **Frontend:** Vercel (automatic deployments)
- **Backend:** Render (with free tier cold start)
- **Database:** MongoDB Atlas
- **CDN:** Cloudinary for media files

---

## 📁 Project Structure

```
MERN-Smart-Education-Platform/
├── server/                          # Backend (Node.js + Express)
│   ├── config/                      # Configuration files
│   │   ├── database.js              # MongoDB connection
│   │   ├── cloudinary.js            # Cloudinary setup
│   │   └── razorpay.js              # Payment gateway config
│   ├── controllers/                 # Request handlers
│   │   ├── Auth.js
│   │   ├── Course.js
│   │   ├── Payments.js
│   │   └── ...
│   ├── models/                      # Database schemas
│   │   ├── User.js
│   │   ├── Course.js
│   │   └── ...
│   ├── routes/                      # API routes
│   ├── middlewares/                 # Authentication & validation
│   ├── mail/                        # Email templates
│   └── utils/                       # Helper functions
│
└── SmartStudy/                      # Frontend (React + Vite)
    ├── src/
    │   ├── components/              # Reusable components
    │   ├── pages/                   # Page components
    │   ├── services/                # API integration
    │   ├── slices/                  # Redux slices
    │   ├── hooks/                   # Custom React hooks
    │   └── utils/                   # Utility functions
    └── public/                      # Static assets
```

---

## 🚀 Installation & Setup

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB account (Atlas)
- Cloudinary account
- Razorpay account

### Backend Setup

1. **Navigate to server directory**

   ```bash
   cd server
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Create `.env` file** with the following:

   ```env
   PORT=4000
   MONGODB_URL=your_mongodb_atlas_url
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRE=7d

   # Cloudinary
   CLOUDINARY_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret

   # Razorpay
   RAZORPAY_KEY_ID=your_razorpay_key
   RAZORPAY_KEY_SECRET=your_razorpay_secret

   # Email Configuration
   MAIL_HOST=your_email_host
   MAIL_USER=your_email
   MAIL_PASS=your_email_password
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```
   Server runs on `http://localhost:4000`

### Frontend Setup

1. **Navigate to frontend directory**

   ```bash
   cd SmartStudy
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Create `.env` file** with:

   ```env
   VITE_API_BASE_URL=http://localhost:4000/api
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```
   Frontend runs on `http://localhost:5173`

### Run Both Simultaneously

From the root directory or SmartStudy folder:

```bash
npm run dev
```

This uses `concurrently` to run both backend and frontend!

---

## 📚 API Endpoints Overview

### Authentication Routes

- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/sendotp` - Send OTP via email
- `POST /api/auth/resetpassword` - Reset password

### Course Routes

- `GET /api/course/getAllCourses` - Fetch all courses
- `POST /api/course/createCourse` - Create new course (instructor)
- `PUT /api/course/updateCourse` - Update course (instructor)
- `DELETE /api/course/deleteCourse` - Delete course (instructor)
- `GET /api/course/getCourseDetails` - Get course details

### Payment Routes

- `POST /api/payments/capturePayment` - Process payment
- `POST /api/payments/verifySignature` - Verify payment signature

### Profile Routes

- `GET /api/profile/getUserDetails` - Get user profile
- `PUT /api/profile/updateProfile` - Update profile

---

## 🎯 Key Models & Schemas

### User Model

- Authentication (email, password with bcrypt)
- Role-based access (Student/Instructor)
- Profile information
- Enrolled courses (for students)

### Course Model

- Course metadata (title, description, price)
- Instructor reference
- Sections & subsections (nested schema)
- Student enrollments
- Ratings & reviews

### Section & SubSection

- Hierarchical course structure
- Video content via Cloudinary
- Duration tracking

### OTP Model

- Time-based expiry
- Email verification

---

## 📊 Database Schema Relationships

```
User (1) ──→ (Many) Course (Instructor)
User (Many) ──→ (Many) Course (Student Enrollments)
Course (1) ──→ (Many) Section
Section (1) ──→ (Many) SubSection
SubSection (1) ──→ (Many) RatingAndReview
User (1) ──→ (Many) RatingAndReview
```

---

## 🔄 Authentication Flow

```
1. User Signup → Register with email & password
2. Send OTP → Verify email via OTP
3. Email Verification → Confirm OTP
4. Login → Generate JWT token
5. Protected Routes → Middleware validates JWT
6. Token Refresh → Refresh token for extended sessions
7. Logout → Clear token from client
```

---

## 💳 Payment Flow (Razorpay Integration)

```
1. Student selects course
2. Frontend creates Razorpay order
3. Student completes payment
4. Backend verifies signature
5. Course enrollment confirmed
6. Payment confirmation email sent
```

---

## 📧 Email Templates

The platform includes automated email notifications for:

- Email verification during signup
- Course enrollment confirmation
- Payment success receipt
- Password reset link
- Admin notifications

Located in: `server/mail/templates/`

---

## 🌟 Future Enhancements

- [ ] 🔐 Google & GitHub OAuth authentication
- [ ] 💬 Real-time student-instructor chat system
- [ ] 🎥 Live class streaming capability
- [ ] 📊 Advanced analytics dashboard for instructors
- [ ] 🤖 AI-powered course recommendations
- [ ] 📱 Mobile app (React Native)
- [ ] 🌍 Multi-language support
- [ ] 🎓 Certificate generation upon course completion
- [ ] 💻 Code execution environment for coding courses
- [ ] 📝 Assignment submission system

---

## 🏗️ Development Workflow

1. **Create a feature branch**

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** - Follow the existing code structure

3. **Commit with clear messages**

   ```bash
   git commit -m "feat: add xyz feature"
   ```

4. **Push to repository**

   ```bash
   git push origin feature/your-feature-name
   ```

5. **Create a Pull Request** on GitHub

---

## 🐛 Troubleshooting

### Backend not connecting to MongoDB

- Verify MongoDB Atlas URI in `.env`
- Check IP whitelist in MongoDB Atlas
- Ensure network connectivity

### Cloudinary upload issues

- Confirm Cloudinary credentials in `.env`
- Check file size limits
- Verify folder permissions

### Payment issues

- Test with Razorpay test credentials
- Verify webhook configurations
- Check CORS settings

### Frontend API calls failing

- Ensure backend server is running
- Verify `VITE_API_BASE_URL` in `.env`
- Check browser console for CORS errors

---

## 📝 Best Practices

- ✅ Use environment variables for sensitive data
- ✅ Validate all user inputs on backend
- ✅ Implement proper error handling
- ✅ Follow RESTful API conventions
- ✅ Comment complex logic
- ✅ Use meaningful variable and function names
- ✅ Test features before deployment

---

## 👥 Contributors

### 👨‍💻 Creator & Lead Developer

- **Jay Kumar** ([@jayjaisswal](https://github.com/jayjaisswal)) - Full Stack Developer

Built with ❤️ for educational excellence.

---

## 📄 License

This project is licensed for **academic and educational purposes only**.

For commercial use, please contact the project maintainers.

---

## 📞 Support & Contact

- 📧 Email: support@padhoindia.com
- 🐛 Report Issues: [GitHub Issues](https://github.com/jayjaisswal/MERN-Smart-Education-Platform/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/jayjaisswal/MERN-Smart-Education-Platform/discussions)

---

## 🙏 Acknowledgments

- MongoDB for the database
- Cloudinary for media hosting
- Razorpay for payment processing
- Vercel & Render for deployment hosting
- React, Node.js, and all open-source communities

---

**Made with ❤️ by Jay Kumar**
