# Implementation TODO - Interview & Career Prep

## Phase 1: Navbar & Dropdown Menu
- [ ] Update SmartStudy/src/data/navbar-links.js with dropdown sub-items
- [ ] Update SmartStudy/src/components/common/Navbar.jsx with dropdown component

## Phase 2: Interview Data Structure
- [ ] Create SmartStudy/src/data/interview/ML/ folder with placeholder data
- [ ] Create SmartStudy/src/data/interview/AI/ folder with placeholder data
- [ ] Create SmartStudy/src/data/interview/Programming/ folder with placeholder data
- [ ] Create SmartStudy/src/data/interview/IT-Companywise/ folder with placeholder data
- [ ] Create SmartStudy/src/data/interview/IIT-JEE/ folder with placeholder data
- [ ] Create SmartStudy/src/data/interview/NEET/ folder with placeholder data

## Phase 3: Reusable Interview Components
- [ ] Create SmartStudy/src/components/Interview/components/InterviewQA.jsx (Q&A article reader with pagination)
- [ ] Create SmartStudy/src/components/Interview/components/InterviewMCQ.jsx (MCQ with options, submit, show answer)
- [ ] Create SmartStudy/src/components/Interview/components/InterviewQuiz.jsx (25 Q, timer, prev/next, progress)

## Phase 4: Backend Integration
- [ ] Create server/models/InterviewProgress.js model
- [ ] Create server/controllers/Interview.js controller
- [ ] Create server/routes/Interview.js route
- [ ] Update server/index.js with new routes
- [ ] Add API endpoints in SmartStudy/src/services/apis.js

## Phase 5: Profile Dashboard
- [ ] Update dashboard to show interview/aptitude/quiz performance

## Phase 6: Testing & Integration
- [ ] Test all components with DBMS data
- [ ] Verify data flow to backend

## Notes:
- All interview/MCQ/Quiz components use props to pass data
- Use DBMS data as placeholders initially
- Timer: 60 seconds per question
- Quiz: 25 questions per quiz, 5-6 quizzes per topic
