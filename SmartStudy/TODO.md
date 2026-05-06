# SmartStudy TODO

## IIT/JEE Chemistry (MERN-Smart-Education-Platform)
- [ ] Create chapter cards UI for Chemistry JEE Main under `src/components/IITJEE/jee-chemistry/ChaptersCards.jsx`.
- [ ] Create chapter questions list page with pagination (5 questions per page) under `src/components/IITJEE/jee-chemistry/JeeChemistryQuestions.jsx`.
- [ ] Create solve/self-check page under `src/components/IITJEE/jee-chemistry/JeeChemistrySolveQuestion.jsx`.
- [ ] Add API helpers in `src/services/operations/jeeChemistryAPI.js`.
- [x] Wire routes in `src/App.jsx`:
  - [x] `/jee-chemistry` → ChaptersCards
  - [x] `/jee-chemistry/:chapterName` → JeeChemistryQuestions
  - [x] `/jee-chemistry/solve/:questionId` → JeeChemistrySolveQuestion
- [ ] Verify UI flow end-to-end (chapter → questions list → solve) and pagination shows 5 per page.


