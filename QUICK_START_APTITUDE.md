# Master Aptitude - Quick Start Guide 🚀

## What's Been Built

A complete aptitude practice platform with 3 categories (Verbal Ability, Arithmetic, Logical Reasoning) featuring:

- ✅ Questions with pagination
- ✅ 60-second timer per question
- ✅ Auto-submit on timeout
- ✅ Performance tracking
- ✅ User statistics dashboard

---

## Installation & Setup

### Step 1: Seed Database (First Time Only)

```bash
cd server
npm run seed-aptitude
```

Expected: ~500 questions loaded into MongoDB

### Step 2: Start Backend

```bash
cd server
npm run dev
```

Visit: http://localhost:4000

### Step 3: Start Frontend

```bash
cd SmartStudy
npm run dev
```

Visit: http://localhost:5173

---

## User Flow

### 1. Browse Aptitude Categories

- Go to: `/aptitude` OR Click "Master Aptitude" in navbar
- See 3 categories as interactive cards
- Each card shows question count and topics

### 2. Start Practicing

- Click on any category card
- Login if needed
- Start answering questions (60s per question)

### 3. Question Interface

- Question displayed with **4 options**
- **Timer** ticking down at top
- Select your answer and **Submit**
- See explanation and correct answer
- Navigate between questions

### 4. View Performance

- After completing questions, navigate to `/aptitude-performance`
- See:
  - Total attempts & accuracy
  - Average time per question
  - Category-wise breakdown
  - Progress trends

---

## Key Files & Structure

### Backend

```
server/
├── models/
│   ├── Aptitude.js              ← Question schema
│   └── AptitudeProgress.js       ← User progress schema
├── controllers/
│   └── Aptitude.js              ← Business logic
├── routes/
│   └── Aptitude.js              ← API endpoints
└── scripts/
    └── seedAptitude.js          ← Data import script
```

### Frontend

```
SmartStudy/src/
├── components/Aptitude/
│   ├── AptitudeCategories.jsx   ← Category cards
│   ├── AptitudeQuiz.jsx         ← Quiz interface
│   ├── QuestionCard.jsx         ← Question display
│   └── AptitudePerformance.jsx  ← Stats dashboard
├── services/operations/
│   └── aptitudeAPI.js           ← API calls
├── slices/
│   └── aptitudeSlice.js         ← Redux state
└── App.jsx                      ← Routes added
```

---

## API Endpoints

### Public

- `GET /api/v1/aptitude/categories` - All categories
- `GET /api/v1/aptitude/questions?category=verbal_ability&page=1&limit=5` - Questions

### Protected (Login Required)

- `POST /api/v1/aptitude/submit` - Submit answer
- `GET /api/v1/aptitude/performance` - User stats

---

## Customization

### Change Questions Per Page

File: `SmartStudy/src/components/Aptitude/AptitudeQuiz.jsx`

```javascript
const { questionsPerPage = 5 } = // Change 5 to x
```

### Change Timer Duration (seconds)

File: `SmartStudy/src/components/Aptitude/AptitudeQuiz.jsx`

```javascript
const [timeRemaining, setTimeRemaining] = useState(60); // Change 60
```

### Add Category

1. Update JSON file
2. Update enum in `server/models/Aptitude.js`
3. Update icons in `AptitudeCategories.jsx`

---

## Troubleshooting

| Issue                  | Solution                                 |
| ---------------------- | ---------------------------------------- |
| No questions showing   | Run `npm run seed-aptitude`              |
| Login loop             | Clear browser cookies, login again       |
| Timer not working      | Check if quiz.jsx is rendering correctly |
| Performance page blank | Make sure you've answered questions      |

---

## Features Explanation

### 🎯 Timer System

- 60 seconds per question
- Automatically submits if timeout
- Red warning when < 10 seconds

### 📊 Progress Tracking

- Saves all answers + time taken
- Calculates accuracy per category
- Shows improvement over time

### 📱 Responsive Design

- Works on desktop, tablet, mobile
- Touch-friendly buttons
- Readable fonts and spacing

### 🔐 Security

- Correct options hidden during quiz
- Only revealed after submission
- User data protected with JWT

---

## Next Steps (Optional)

1. **Test the flow:** Go through a full practice session
2. **Monitor performance:** Check MongoDB for saved progress
3. **Customize:** Adjust timer, questions per page, etc.
4. **Add more questions:** Load more from JSON files
5. **Deploy:** Follow your usual deployment process

---

## Support

For detailed documentation, see: `APTITUDE_SETUP_GUIDE.md`
