# Master Aptitude Feature - Setup & Implementation Guide

## Overview

The Master Aptitude feature is a comprehensive platform for practicing aptitude questions in three categories:

- Verbal Ability
- Arithmetic
- Logical Reasoning

Users can solve questions with a timer, track their performance, and view detailed statistics.

---

## Backend Setup

### 1. Database Models Created

#### Aptitude Model (`server/models/Aptitude.js`)

```javascript
Fields:
- category: verbal_ability | arithmetic | logical_reasoning
- topic: String (e.g., "spotting-errors")
- question: String
- options: Array of Strings (2-5 options)
- correctOption: Number (index of correct option)
- explanation: String
- difficulty: easy | medium | hard
```

#### AptitudeProgress Model (`server/models/AptitudeProgress.js`)

```javascript
Fields:
- userId: Reference to User
- questionId: Reference to Aptitude
- userAnswer: Number (selected option index)
- isCorrect: Boolean
- timeTaken: Number (in seconds)
- category: String
- attemptedAt: Date
```

### 2. Backend Routes & Controllers

**Routes available at:**
`/api/v1/aptitude`

**Endpoints:**

| Method | Endpoint        | Auth | Description                               |
| ------ | --------------- | ---- | ----------------------------------------- |
| GET    | `/categories`   | No   | Get all categories with counts            |
| GET    | `/questions`    | No   | Get questions by category with pagination |
| GET    | `/question/:id` | No   | Get specific question details             |
| POST   | `/submit`       | Yes  | Submit answer and save progress           |
| GET    | `/performance`  | Yes  | Get user performance stats                |
| POST   | `/create`       | Yes  | Create questions (admin)                  |

**Query Parameters for `/questions`:**

- `category` (required): verbal_ability | arithmetic | logical_reasoning
- `page` (optional, default: 1): Page number
- `limit` (optional, default: 5): Questions per page
- `topic` (optional): Filter by topic

---

## Data Seeding

### Step 1: Prepare JSON Files

The JSON files are located at:

- `SmartStudy/src/data/Aptitude/verbal_ability.json`
- `SmartStudy/src/data/Aptitude/Arithmetic.json`
- `SmartStudy/src/data/Aptitude/logicalReasoning.json`

### Step 2: Run Seed Script

From the server directory:

```bash
npm run seed-aptitude
```

This will:

1. Connect to your MongoDB database
2. Clear existing Aptitude data
3. Parse JSON files and convert to proper format
4. Insert all questions into the database
5. Display statistics

Expected output:

```
Connected to database
Cleared existing aptitude questions
Preparing to insert 500+ questions...
Successfully inserted 500+ questions

=== Insertion Statistics ===
verbal_ability: 250 questions
arithmetic: 150 questions
logical_reasoning: 100 questions

Database seeding completed successfully!
```

---

## Frontend Setup

### 1. Redux Store Configuration

- **Slice created:** `src/slices/aptitudeSlice.js`
- **Reducer added to:** `src/reducer/index.js`
- **State includes:**
  - categories
  - currentCategory
  - currentQuestions
  - currentPage
  - totalPages
  - questionsPerPage
  - userPerformance
  - loading

### 2. API Integration

**File:** `src/services/operations/aptitudeAPI.js`

Functions:

- `getAptitudeCategories()` - Fetch all categories
- `getAptitudeQuestions(category, page, limit, topic)` - Fetch questions
- `submitAptitudeAnswer(questionId, userAnswer, timeTaken, category, token)` - Submit answer
- `getUserAptitudePerformance(token, category)` - Get performance stats
- `getAptitudeQuestionDetails(questionId)` - Get question details

### 3. Components Created

#### AptitudeCategories (`src/components/Aptitude/AptitudeCategories.jsx`)

- Displays all 3 categories as cards
- Shows question count and topics
- Handles category selection and navigation

#### AptitudeQuiz (`src/components/Aptitude/AptitudeQuiz.jsx`)

- Main quiz component
- Features:
  - 60-second timer per question (auto-submit on timeout)
  - Question pagination (4-5 per page)
  - Navigation between questions
  - Progress tracking
  - Question grid navigation
- Saves user answers and time taken to backend

#### QuestionCard (`src/components/Aptitude/QuestionCard.jsx`)

- Individual question display
- Radio button for option selection
- Shows explanation after answer submission
- Highlights correct/incorrect options

#### AptitudePerformance (`src/components/Aptitude/AptitudePerformance.jsx`)

- Performance dashboard
- Stats shown:
  - Total attempts
  - Correct/Incorrect answers
  - Accuracy percentage
  - Average time per question
  - Category-wise breakdown

### 4. Routes Added

| Route                          | Auth Required | Component           |
| ------------------------------ | ------------- | ------------------- |
| `/aptitude`                    | No            | AptitudeCategories  |
| `/aptitude-practice/:category` | Yes           | AptitudeQuiz        |
| `/aptitude-performance`        | Yes           | AptitudePerformance |

### 5. Homepage & Navigation Integration

- **Navbar:** Added "Master Aptitude" link to navbar-links.js
- **Home Page:** Added AptitudeCategories component after "Explore Courses"

---

## User Flow

1. **Browse Categories** → Visit `/aptitude`
   - See all 3 categories with practice stats
2. **Start Practice** → Click category card → Navigate to practice page
   - Select questions one by one
   - Timer runs for 60 seconds per question
   - Submit answer to see explanation
3. **View Results** → Answer all questions → Navigate to performance page
   - See overall accuracy
   - View category-wise stats
   - Start new practice session

---

## Key Features

### Timer System

- 60 seconds per question
- Auto-submit if time runs out
- Visual warning when time < 10 seconds
- Displays remaining time above each question

### Pagination

- 4-5 questions per page by default
- Navigate between pages
- Questions load as user progresses

### Progress Tracking

- User answers saved to database
- Time taken for each question recorded
- Accuracy calculated
- Performance broken down by category

### User Experience

- Responsive design (mobile + desktop)
- Smooth transitions and animations
- Clear feedback on correct/incorrect answers
- Ability to review answers
- Question navigation grid

---

## API Request/Response Examples

### Get Categories

**Request:**

```
GET /api/v1/aptitude/categories
```

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "name": "verbal_ability",
      "displayName": "Verbal Ability",
      "count": 250,
      "topics": ["spotting-errors", "reading-comprehension", ...]
    },
    ...
  ]
}
```

### Get Questions

**Request:**

```
GET /api/v1/aptitude/questions?category=verbal_ability&page=1&limit=5
```

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "category": "verbal_ability",
      "topic": "spotting-errors",
      "question": "...",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "explanation": "..."
    },
    ...
  ],
  "pagination": {
    "totalQuestions": 250,
    "totalPages": 50,
    "currentPage": 1,
    "questionsPerPage": 5
  }
}
```

### Submit Answer

**Request:**

```
POST /api/v1/aptitude/submit
Content-Type: application/json
Authorization: Bearer <token>

{
  "questionId": "...",
  "userAnswer": 0,
  "timeTaken": 45,
  "category": "verbal_ability"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Answer submitted successfully",
  "data": {
    "isCorrect": true,
    "correctOption": 0,
    "explanation": "...",
    "progress": { ... }
  }
}
```

### Get Performance

**Request:**

```
GET /api/v1/aptitude/performance HTTP/1.1
Authorization: Bearer <token>
```

**Response:**

```json
{
  "success": true,
  "data": {
    "totalAttempts": 50,
    "correct": 35,
    "incorrect": 15,
    "accuracy": "70.00",
    "averageTime": 42,
    "categoryStats": [
      {
        "category": "verbal_ability",
        "attempts": 20,
        "correct": 15,
        "accuracy": "75.00"
      },
      ...
    ]
  }
}
```

---

## Environment Variables Required

In `.env` file:

```
VITE_BASE_URL=http://localhost:4000/api/v1
```

Or update the baseURL as per your deployment.

---

## Testing the Feature

### Manual Testing Steps

1. **Seed the database:**

   ```bash
   cd server
   npm run seed-aptitude
   ```

2. **Start backend:**

   ```bash
   npm run dev
   ```

3. **Start frontend:**

   ```bash
   cd SmartStudy
   npm run dev
   ```

4. **Test flow:**
   - Navigate to `/aptitude` → See categories
   - Click on a category → Redirects to login if not authenticated
   - Login/Signup → Start practice
   - Answer questions (timer runs for 60s)
   - View performance dashboard

---

## Customization Options

### Change Questions Per Page

Edit in `AptitudeQuiz.jsx`:

```javascript
const { questionsPerPage = 5 } = // Change 5 to desired number
```

### Change Timer Duration

Edit in `AptitudeQuiz.jsx`:

```javascript
const [timeRemaining, setTimeRemaining] = useState(60); // Change 60 to desired seconds
```

### Add/Edit Categories

- Modify category enum in `Aptitude.js` model
- Update category mapping in seed script
- Update icons in `AptitudeCategories.jsx`

---

## Troubleshooting

### Questions not appearing

1. Check if seed script ran successfully
2. Verify MongoDB connection
3. Check browser console for API errors

### Timer not working

1. Ensure auth token is valid
2. Check if quiz component is re-rendering properly
3. Check for React strict mode issues

### Performance stats not showing

1. Verify user is logged in (auth.token exists)
2. Check if questions were attempted
3. Verify AptitudeProgress records exist in database

---

## Future Enhancements

- [ ] Leaderboard system
- [ ] Difficulty-based filtering
- [ ] Mock tests
- [ ] Video explanations
- [ ] Question bookmarking
- [ ] Progress export (PDF)
- [ ] Difficulty progression algorithm
- [ ] AI-based recommendations

---

## Dependencies Added

Frontend:

- No new dependencies (uses existing Redux, React Router, React Hot Toast)

Backend:

- Uses existing Mongoose, Express

---

## Notes

- Questions are fetched without correct option initially (security)
- Correct option only revealed after answer submission
- User time tracking helps identify weak areas
- All data is persisted to database for future reference
