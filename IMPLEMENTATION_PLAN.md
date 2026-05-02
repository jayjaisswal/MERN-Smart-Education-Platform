# Implementation Plan: Exam & Career Prep Feature

## Analysis Summary

### Current State:
1. **Interview Components** - InterviewQA, InterviewMCQ, InterviewQuiz are already implemented with:
   - Pagination for Q&A (article-like reading)
   - MCQ with options, submit, show answer, explanations
   - Quiz with timer (60 sec/question), 25 questions, real-time progress indicators
   - Reset functionality
   - Backend integration (InterviewProgress model, API endpoints)

2. **InterviewPage.jsx** - Handles categories like ML, Python, IT-Companywise, IIT-JEE, NEET with placeholder DBMS data

3. **Data Files** - Already exist in `SmartStudy/src/data/interview/`:
   - ML (numpy-mcq.json, pandas-mcq.json)
   - Programming (python-mcq.json)
   - IT-Companywise (tcs-mcq.json)
   - IIT-JEE (physics-pyq.json)
   - NEET (physics-pyq.json)
   - DBMS (dbms-mcq.json, dbms-theory.json)
   - CN, OS, OOPS folders exist

4. **Backend** - InterviewProgress model and API endpoints ready

5. **Navbar** - Has "Exam & Career Prep" dropdown showing InterviewLinks

### Requirements Breakdown:

#### 1. Dropdown Structure:
- **IT Interview Prep**: DBMS, OS, CN, SDLC, OOPS cards
- **Machine Learning**: NumPy, Pandas cards
- **Programming Languages**: Python, Java, C++, JavaScript cards
- **IT Company Wise**: TCS, Infosys, Wipro, Accenture, Capgemini cards
- **IIT JEE PYQ**: Physics, Chemistry, Mathematics cards
- **NEET PYQ**: Physics, Chemistry, Biology cards

#### 2. Features for Each Category:
- **Interview Q&A**: Article-like reader with pagination
- **MCQ**: Questions per page, option selection, submit, show answer + explanation
- **Quiz**: 25 questions, timer, prev/next, real-time progress (green = attempted)

#### 3. Backend Integration:
- Save all MCQ and Quiz attempts to InterviewProgress model
- Reset option clears local state and backend data
- Fetch user performance for dashboard

#### 4. Dashboard Performance:
- Show student performance in their profile dashboard

---

## Implementation Tasks

### Task 1: Update Navbar Dropdown Data
**File**: `SmartStudy/src/data/interviewLink.js`
- Add new categories: AI, Programming Languages, IT Company Wise, IIT JEE PYQ, NEET PYQ
- Keep existing IT Interview Prep with updated links for DBMS, OS, CN, SDLC, OOPS

### Task 2: Update InterviewPage.jsx Data Loading
**File**: `SmartStudy/src/pages/InterviewPage.jsx`
- Import and use actual JSON data files based on category/topic
- Map topics to their corresponding JSON files
- Use DBMS data as fallback where JSON not available

### Task 3: Create Data Import Mappings
**Files to create**: Data loader files for each category to dynamically import JSON
- Create smart data loader that checks for JSON files and falls back to DBMS placeholders

### Task 4: Update InterviewQA Component
**File**: `SmartStudy/src/components/Interview/components/InterviewQA.jsx`
- Add backend save functionality for reading progress
- Add pagination with proper state management

### Task 5: Update InterviewMCQ Component
**File**: `SmartStudy/src/components/Interview/components/InterviewMCQ.jsx`
- Ensure all answers are saved to backend
- Add reset that also clears backend data
- Improve pagination UI

### Task 6: Update InterviewQuiz Component  
**File**: `SmartStudy/src/components/Interview/components/InterviewQuiz.jsx`
- Add reset that clears backend data
- Ensure 25-question limit is properly enforced
- Improve timer countdown display

### Task 7: Add Backend Reset API
**File**: `server/controllers/Interview.js`
- Add/batch reset endpoint for MCQ and Quiz resets

### Task 8: Create Performance Dashboard Section
**File**: `SmartStudy/src/pages/Dashboard.jsx` (or create new component)
- Add Interview Progress section showing:
  - Topics attempted
  - Accuracy per topic
  - Recent activity

### Task 9: Add Fetch Performance API Wrapper
**File**: `SmartStudy/src/services/operations/interviewAPI.js`
- Add getInterviewPerformance function to fetch from backend

---

## Step-by-Step Implementation Order:

1. ✅ InterviewLinks data update
2. ✅ InterviewPage data loading update  
3. ✅ InterviewMCQ backend integration
4. ✅ InterviewQuiz backend integration + reset
5. ✅ InterviewQA backend integration
6. ✅ Backend reset endpoint
7. ✅ Dashboard performance section

---

## Notes:
- Currently ML has: NumPy, Pandas cards
- AI is not in the plan - user may add later
- Use DBMS data as placeholder where other data not available
- All MCQ and Quiz attempts should save to backend with userId, category, topic, type
- Reset should clear both local state AND backend records
