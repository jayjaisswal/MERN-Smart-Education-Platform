# TODO: Fix DBMS Interview Q&A Display

## Task

Fix the DBMS interview Q&A content display to show all content from dbms-theory.json

## Files to Edit

1. SmartStudy/src/components/Interview/DBMS/DbmsInterviewTheory.jsx

## Implementation Plan

1. Read and understand the current placeholder component
2. Update DbmsInterviewTheory.jsx to:
   - Import dbmsTheory from "../../data/interview/dbms-theory.json"
   - Import InterviewQA from "../components/InterviewQA"
   - Pass the questions array to InterviewQA
   - Use appropriate categoryColor

## Expected Outcome

All 30 DBMS theory Q&A questions and answers will be displayed properly with:

- Questions with numbering
- Detailed answers
- Interview tips
- Infinite scrolling support
