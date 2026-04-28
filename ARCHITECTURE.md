# Master Aptitude Architecture

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                          USER BROWSER                            │
└─────────────────────────────────────────────────────────────────┘
                                △
                                │ HTTP/HTTPS
                                │
    ┌───────────────────────────┴────────────────────────────┐
    │                                                         │
    ▼                                                         ▼
┌──────────────────────────┐                    ┌──────────────────────────┐
│   FRONTEND (React)       │                    │   BACKEND (Node/Express) │
├──────────────────────────┤                    ├──────────────────────────┤
│                          │                    │                          │
│ Pages:                   │                    │ Controllers:             │
│ ├─ Home                  │                    │ ├─ Aptitude.js          │
│ ├─ AptitudeCategories    ├──────API calls───→├─ (6 main functions)    │
│ ├─ AptitudeQuiz          │                    │                          │
│ └─ AptitudePerformance   │←───JSON responses──┤ Routes:                 │
│                          │                    │ └─ Aptitude.js          │
│ Redux Store:             │                    │ (6 endpoints)           │
│ ├─ aptitudeSlice         │                    │                          │
│ ├─ authSlice             │                    │ Middleware:             │
│ └─ profileSlice          │                    │ └─ auth.js              │
│                          │                    │                          │
│ Components:              │                    │ DB Queries              │
│ ├─ AptitudeQuiz          │                    │ & validations           │
│ ├─ QuestionCard          │                    │                          │
│ └─ AptitudePerformance   │                    │                          │
│                          │                    │                          │
│ Services:                │                    │                          │
│ └─ aptitudeAPI.js        │                    │                          │
│                          │                    │                          │
└──────────────────────────┘                    └──────────────────────────┘
                                                         △
                                                         │
                                                    Mongoose
                                                         │
                                                         ▼
                                            ┌──────────────────────────┐
                                            │   MongoDB Database       │
                                            ├──────────────────────────┤
                                            │                          │
                                            │ Collections:             │
                                            │ ├─ Aptitude              │
                                            │ │  (questions)           │
                                            │ ├─ AptitudeProgress      │
                                            │ │  (user attempts)       │
                                            │ └─ Users                 │
                                            │    (auth info)           │
                                            │                          │
                                            └──────────────────────────┘
```

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                      USER INTERACTION FLOW                           │
└─────────────────────────────────────────────────────────────────────┘

1. BROWSE CATEGORIES
   ┌──────────────────┐
   │ User visits      │
   │ /aptitude        │──→ API: GET /categories
   └──────────────────┘         │
                                ▼
                      DB: Find all categories
                                │
                                ▼
                      ┌────────────────────────┐
                      │ 3 Category Cards       │
                      │ ├─ Verbal Ability      │
                      │ ├─ Arithmetic          │
                      │ └─ Logical Reasoning   │
                      └────────────────────────┘

2. START PRACTICE
   ┌──────────────────┐
   │ User clicks      │
   │ category         │──→ Check auth, redirect to quiz
   └──────────────────┘
                      ┌──────────────────────────────┐
                      │ /aptitude-practice/category  │
                      └──────────────────────────────┘

3. LOAD QUESTIONS
   ┌──────────────────┐
   │ Quiz loads       │
   │ page 1           │──→ API: GET /questions?category=X&page=1&limit=5
   └──────────────────┘         │
                                ▼
                      DB: Find 5 questions for category
                                │
                                ▼
                      ┌────────────────────────────┐
                      │ Load Questions in Redux    │
                      │ Start Timer: 60s           │
                      └────────────────────────────┘

4. USER ANSWERS QUESTION
   ┌──────────────────┐
   │ User selects     │
   │ option & submits │
   └──────────────────┘
         │
         ▼
   ┌──────────────────────────────────┐
   │ API: POST /submit                │
   │ Data: question_id, answer,       │
   │       timeTaken, category        │
   └──────────────────────────────────┘
         │
         ▼
   ┌──────────────────────────────────┐
   │ Backend:                         │
   │ 1. Get question                  │
   │ 2. Check correctness             │
   │ 3. Save to AptitudeProgress      │
   │ 4. Return result + explanation   │
   └──────────────────────────────────┘
         │
         ▼
   ┌──────────────────────────────────┐
   │ Frontend: Show explanation       │
   │ Highlight: Correct/Incorrect     │
   └──────────────────────────────────┘

5. NAVIGATE & CONTINUE
   ┌──────────────────────────────┐
   │ Next Question / Continue      │──→ Repeat until end of page
   └──────────────────────────────┘
                  │
          ┌───────┴───────┐
          │               │
      More Q's?        Last Q?
      (same page)   (load next)
          │               │
          ▼               ▼
     Not yet     API: GET /questions
      (show         (same category,
       next Q)       next page)

6. VIEW PERFORMANCE
   ┌──────────────────────────────┐
   │ Quiz Complete                 │
   │ → /aptitude-performance       │
   └──────────────────────────────┘
         │
         ▼
   API: GET /performance?category=X
         │
         ▼
   DB: Aggregate AptitudeProgress
   - Count total attempts
   - Count correct answers
   - Calculate accuracy
   - Group by category
         │
         ▼
   ┌────────────────────────────────┐
   │ Display Stats:                 │
   │ ├─ Total Attempts: 50          │
   │ ├─ Correct: 35                 │
   │ ├─ Accuracy: 70%               │
   │ ├─ Avg Time: 42s               │
   │ └─ Category Breakdown           │
   └────────────────────────────────┘
```

## Component Hierarchy

```
App.jsx
├─ Home
│  └─ AptitudeCategories
│     ├─ Category Card 1
│     ├─ Category Card 2
│     └─ Category Card 3
│
├─ AptitudeQuiz (Protected)
│  ├─ QuestionCard
│  │  ├─ Timer
│  │  ├─ Question Title
│  │  ├─ Option Buttons
│  │  └─ Explanation (after submit)
│  └─ Navigation Controls
│     ├─ Previous Button
│     ├─ Next Button
│     └─ Question Grid
│
└─ AptitudePerformance (Protected)
   ├─ Stats Cards
   │  ├─ Total Attempts
   │  ├─ Correct/Incorrect
   │  ├─ Accuracy %
   │  └─ Avg Time
   └─ Category Stats Section
      ├─ Verbal Ability Stats
      ├─ Arithmetic Stats
      └─ Logical Reasoning Stats
```

## State Management (Redux)

```
aptitudeSlice
│
├─ categories: Array
│  └─ [{ name, displayName, count, topics }, ...]
│
├─ currentCategory: String
│  └─ "verbal_ability" | "arithmetic" | "logical_reasoning"
│
├─ currentQuestions: Array
│  └─ [{ _id, question, options, explanation, ... }, ...]
│
├─ currentPage: Number
│  └─ 1, 2, 3, ...
│
├─ totalPages: Number
│  └─ Total pages based on pagination
│
├─ questionsPerPage: Number
│  └─ 5 (default)
│
├─ userPerformance: Object
│  └─ {
│     totalAttempts,
│     correct,
│     incorrect,
│     accuracy,
│     averageTime,
│     categoryStats: [...]
│   }
│
└─ loading: Boolean
   └─ true | false
```

## Database Schema

```
Aptitude (Collection)
├─ _id: ObjectId
├─ category: String (enum: verbal_ability, arithmetic, logical_reasoning)
├─ topic: String
├─ question: String
├─ options: Array<String>
├─ correctOption: Number (0-4)
├─ explanation: String
├─ difficulty: String (easy, medium, hard)
├─ createdAt: Date
└─ updatedAt: Date

AptitudeProgress (Collection)
├─ _id: ObjectId
├─ userId: ObjectId (ref: User)
├─ questionId: ObjectId (ref: Aptitude)
├─ userAnswer: Number (0-4)
├─ isCorrect: Boolean
├─ timeTaken: Number (seconds)
├─ category: String
├─ createdAt: Date
└─ updatedAt: Date
```

## API Request/Response Flow

```
GET /api/v1/aptitude/categories
    ↓
Aggregate categories from Aptitude
    ↓
Response: [{ name, displayName, count, topics }]

GET /api/v1/aptitude/questions?category=X&page=1&limit=5
    ↓
Query: skip, limit, exclude correctOption
    ↓
Response: { data: [...], pagination: {...} }

POST /api/v1/aptitude/submit
    ↓ (with auth token)
Verify question, check answer, save progress
    ↓
Response: { isCorrect, correctOption, explanation }

GET /api/v1/aptitude/performance
    ↓ (with auth token)
Find all user attempts, aggregate stats
    ↓
Response: { totalAttempts, correct, accuracy, categoryStats: [...] }
```
